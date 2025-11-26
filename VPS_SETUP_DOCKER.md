# VPS Setup Guide - Docker Edition

This guide walks you through setting up your Linux VPS to host the Streamlined Property Portal using Docker.

## Server Requirements

- **OS**: Ubuntu 20.04 LTS or newer
- **RAM**: Minimum 2GB (4GB+ recommended)
- **Storage**: Minimum 20GB
- **Docker**: Version 20.x or newer
- **Network**: Public IP with open ports 80 (HTTP) and 443 (HTTPS)

## Why Docker?

✅ **Consistent environments** - Dev matches production exactly  
✅ **Easy rollbacks** - Just redeploy a previous image  
✅ **No version conflicts** - Everything's containerized  
✅ **Simpler setup** - No need to install Node.js, PM2, etc.  
✅ **Better isolation** - Security and resource management  

## Initial Server Setup

### 1. Update System

```bash
sudo apt update
sudo apt upgrade -y
```

### 2. Create Deployment User (Optional but recommended)

```bash
# Create user
sudo adduser deployer

# Add to sudo and docker groups
sudo usermod -aG sudo deployer
sudo usermod -aG docker deployer

# Switch to deployer user
su - deployer
```

### 3. Configure Firewall

```bash
# Enable UFW firewall
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Check status
sudo ufw status
```

## Install Docker & Docker Compose

### Install Docker

```bash
# Install prerequisites
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Verify installation
docker --version
```

### Install Docker Compose

```bash
# Download Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

### Enable Docker Service

```bash
# Start Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add current user to docker group (avoid using sudo)
sudo usermod -aG docker $USER

# Log out and back in for group changes to take effect
```

## Install Additional Tools

### Install Git

```bash
sudo apt install -y git

# Configure Git
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Install Nginx (Reverse Proxy)

```bash
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Project Setup

### 1. Create Project Directory

```bash
# Create directory
sudo mkdir -p /var/www/streamlined-property-portal

# Change ownership to deployer user
sudo chown -R $USER:$USER /var/www/streamlined-property-portal
```

### 2. Clone Repository

```bash
cd /var/www/streamlined-property-portal

# Clone via HTTPS with token
git clone https://YOUR_GITHUB_TOKEN@github.com/Davechpn/streamlined-property-portal.git .

# Or via SSH (after setting up deploy keys)
git clone git@github.com:Davechpn/streamlined-property-portal.git .
```

### 3. Set Up GitHub Access

#### Option A: Personal Access Token (HTTPS)

```bash
# Configure Git credential helper
git config credential.helper store

# Set remote URL with token
git remote set-url origin https://YOUR_GITHUB_TOKEN@github.com/Davechpn/streamlined-property-portal.git
```

Create token: GitHub → Settings → Developer settings → Personal access tokens → Generate (select `repo` scope)

#### Option B: SSH Deploy Key

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "vps-deploy" -f ~/.ssh/github_deploy

# Display public key
cat ~/.ssh/github_deploy.pub
# Add this to: GitHub Repo → Settings → Deploy keys

# Add to SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/github_deploy

# Update remote
git remote set-url origin git@github.com:Davechpn/streamlined-property-portal.git
```

### 4. Configure Environment Variables

```bash
# Create .env.local file
nano .env.local
```

Add your production environment variables:

```env
# Application
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Authentication
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-super-secret-key-min-32-chars

# OAuth (optional)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# Email
RESEND_API_KEY=re_your_api_key

# Monitoring (optional)
SENTRY_DSN=your-sentry-dsn
NEXT_PUBLIC_SENTRY_DSN=your-public-sentry-dsn
```

**Secure the file:**
```bash
chmod 600 .env.local
```

### 5. Build and Run with Docker

```bash
# Build the Docker image
docker compose build

# Start the container
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f
```

## Configure Nginx as Reverse Proxy

### Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/streamlined-property-portal
```

Add configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3007;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    client_max_body_size 10M;
}
```

### Enable the Site

```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/streamlined-property-portal /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## Set Up SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

## Docker Management Commands

### Basic Commands

```bash
# View running containers
docker compose ps

# View logs
docker compose logs -f

# View logs for specific service
docker compose logs -f streamlined-property-portal

# Restart container
docker compose restart

# Stop containers
docker compose down

# Rebuild and restart
docker compose up -d --build

# Remove everything (including volumes)
docker compose down -v
```

### Maintenance Commands

```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove all unused data
docker system prune -a

# Check disk usage
docker system df
```

## Monitoring

### View Container Status

```bash
# Container stats (CPU, memory)
docker stats streamlined-property-portal

# Container logs
docker logs streamlined-property-portal --tail=100 -f

# Container details
docker inspect streamlined-property-portal
```

### System Resources

```bash
# Disk space
df -h

# Memory usage
free -h

# Docker disk usage
docker system df
```

## Backup Strategy

### Database Backup (if using containerized DB)

```bash
# Backup PostgreSQL
docker exec streamlined-property-portal-db pg_dump -U username dbname > backup_$(date +%Y%m%d).sql

# Restore
docker exec -i streamlined-property-portal-db psql -U username dbname < backup.sql
```

### Application Data Backup

```bash
# Backup .env and volumes
tar -czf backup_$(date +%Y%m%d).tar.gz .env.local docker-compose.yml
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker compose logs streamlined-property-portal

# Check if port 3007 is in use
sudo lsof -i :3007

# Rebuild from scratch
docker compose down
docker compose build --no-cache
docker compose up -d
```

### Out of Memory

```bash
# Check container memory
docker stats

# Add swap space
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Nginx Issues

```bash
# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## Security Best Practices

1. ✅ Use non-root user for deployments
2. ✅ Keep Docker updated: `sudo apt update && sudo apt upgrade docker-ce`
3. ✅ Use secrets management (not .env for sensitive data)
4. ✅ Enable firewall (UFW)
5. ✅ Set up fail2ban: `sudo apt install fail2ban`
6. ✅ Regular backups
7. ✅ Monitor logs for suspicious activity
8. ✅ Use SSL/HTTPS (Let's Encrypt)
9. ✅ Limit container resources in docker-compose.yml

## GitHub Actions Setup

After VPS is ready, configure GitHub Secrets:

| Secret | Value |
|--------|-------|
| `VPS_HOST` | Your VPS IP or domain |
| `VPS_USERNAME` | SSH username (deployer) |
| `VPS_SSH_KEY` | Your private SSH key |
| `VPS_PROJECT_PATH` | `/var/www/streamlined-property-portal` |

**Note:** PM2_APP_NAME is no longer needed with Docker!

## Next Steps

1. ✅ Complete VPS setup
2. ✅ Configure GitHub Secrets
3. ✅ Push to main/production branch
4. ✅ Watch GitHub Actions deploy
5. ✅ Visit your domain and verify

## Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
- [Nginx Documentation](https://nginx.org/en/docs/)
