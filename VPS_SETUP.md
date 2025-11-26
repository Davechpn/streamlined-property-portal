# VPS Setup Guide

This guide walks you through setting up your Linux VPS to host the Streamlined Property Portal application.

## Server Requirements

- **OS**: Ubuntu 20.04 LTS or newer (or similar Linux distribution)
- **RAM**: Minimum 2GB (4GB+ recommended for production)
- **Storage**: Minimum 20GB
- **Node.js**: Version 20.x or newer
- **Network**: Public IP address with open ports 80 (HTTP) and 443 (HTTPS)

## Initial Server Setup

### 1. Update System Packages

```bash
sudo apt update
sudo apt upgrade -y
```

### 2. Create Deployment User (Recommended)

Instead of using root, create a dedicated user for deployments:

```bash
# Create user
sudo adduser deployer

# Add to sudo group
sudo usermod -aG sudo deployer

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

## Install Required Software

### 1. Install Node.js 20.x

```bash
# Install Node.js via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version
```

### 2. Install PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify installation
pm2 --version

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions printed by the command above
```

### 3. Install Git

```bash
sudo apt install -y git

# Configure Git
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 4. Install Nginx (Reverse Proxy)

```bash
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

## Project Setup

### 1. Create Project Directory

```bash
# Create directory for the application
sudo mkdir -p /var/www/streamlined-property-portal

# Change ownership to deployer user
sudo chown -R deployer:deployer /var/www/streamlined-property-portal
```

### 2. Clone Repository

```bash
cd /var/www/streamlined-property-portal

# Clone via HTTPS (recommended for private repos)
git clone https://github.com/YOUR_USERNAME/streamlined-property-portal.git .

# Or via SSH (requires SSH key setup)
git clone git@github.com:YOUR_USERNAME/streamlined-property-portal.git .
```

### 3. Set Up GitHub Access

#### Option A: Personal Access Token (HTTPS)

```bash
# Configure Git to use a token
git remote set-url origin https://YOUR_GITHUB_TOKEN@github.com/YOUR_USERNAME/streamlined-property-portal.git
```

To create a token:
1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select `repo` scope
4. Copy the token and use it in the command above

#### Option B: SSH Deploy Key

```bash
# Generate SSH key on VPS
ssh-keygen -t ed25519 -C "vps-deploy-key" -f ~/.ssh/github_deploy_key

# Display public key
cat ~/.ssh/github_deploy_key.pub

# Add this key to GitHub:
# Repo → Settings → Deploy keys → Add deploy key
# Paste the public key content

# Configure Git to use the SSH key
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/github_deploy_key

# Update remote URL
git remote set-url origin git@github.com:YOUR_USERNAME/streamlined-property-portal.git
```

### 4. Install Dependencies

```bash
cd /var/www/streamlined-property-portal
npm ci
```

### 5. Configure Environment Variables

```bash
# Create .env.local file
nano .env.local
```

Add your environment variables:

```env
# Application
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-api-domain.com

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/property_portal

# Authentication
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-very-long-secret-key-here

# OAuth (if using)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email (Resend)
RESEND_API_KEY=your-resend-api-key

# Monitoring (Sentry)
SENTRY_DSN=your-sentry-dsn
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

**Important**: Keep this file secure!

```bash
chmod 600 .env.local
```

### 6. Build Application

```bash
npm run build
```

### 7. Start Application with PM2

```bash
# Start the application
pm2 start npm --name "streamlined-property-portal" -- start

# Save PM2 configuration
pm2 save

# Check status
pm2 status
pm2 logs streamlined-property-portal
```

## Configure Nginx as Reverse Proxy

### 1. Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/streamlined-property-portal
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Redirect to HTTPS (after SSL is set up)
    # return 301 https://$server_name$request_uri;

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
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;

    # Max upload size
    client_max_body_size 10M;
}
```

### 2. Enable the Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/streamlined-property-portal /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## Set Up SSL with Let's Encrypt

### 1. Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Obtain SSL Certificate

```bash
# Make sure your domain points to your VPS IP
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Follow the prompts:
# - Enter email address
# - Agree to terms
# - Choose whether to redirect HTTP to HTTPS (recommended: yes)
```

### 3. Auto-renewal

Certbot automatically sets up renewal. Test it:

```bash
sudo certbot renew --dry-run
```

## Database Setup (PostgreSQL)

If you're hosting the database on the same VPS:

### 1. Install PostgreSQL

```bash
sudo apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Create Database and User

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL prompt:
CREATE DATABASE property_portal;
CREATE USER portal_user WITH ENCRYPTED PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE property_portal TO portal_user;
\q
```

### 3. Configure Connection

Update your `.env.local` file with the database URL:

```env
DATABASE_URL=postgresql://portal_user:your-secure-password@localhost:5432/property_portal
```

## Monitoring and Maintenance

### PM2 Commands

```bash
# View application status
pm2 status

# View logs
pm2 logs streamlined-property-portal

# Monitor resources
pm2 monit

# Restart application
pm2 restart streamlined-property-portal

# Stop application
pm2 stop streamlined-property-portal

# Delete from PM2
pm2 delete streamlined-property-portal
```

### System Monitoring

```bash
# Check disk space
df -h

# Check memory usage
free -h

# Check CPU usage
top
# or
htop  # (install with: sudo apt install htop)

# Check running processes
ps aux | grep node
```

### Log Rotation

PM2 handles log rotation, but you can configure it:

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

## Backup Strategy

### 1. Database Backup

```bash
# Create backup script
nano ~/backup-db.sh
```

Add:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/postgres"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mkdir -p $BACKUP_DIR

pg_dump -U portal_user property_portal | gzip > $BACKUP_DIR/backup_$TIMESTAMP.sql.gz

# Keep only last 7 days of backups
find $BACKUP_DIR -type f -name "backup_*.sql.gz" -mtime +7 -delete
```

Make executable and add to cron:

```bash
chmod +x ~/backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add line:
0 2 * * * /home/deployer/backup-db.sh
```

### 2. Application Files Backup

```bash
# Backup .env.local and uploads (if any)
tar -czf /var/backups/app_$(date +%Y%m%d).tar.gz /var/www/streamlined-property-portal/.env.local /var/www/streamlined-property-portal/public/uploads
```

## Security Hardening

### 1. Disable Root Login

```bash
sudo nano /etc/ssh/sshd_config
```

Change:
```
PermitRootLogin no
PasswordAuthentication no  # If using SSH keys
```

Restart SSH:
```bash
sudo systemctl restart ssh
```

### 2. Install Fail2Ban

```bash
sudo apt install -y fail2ban

# Start and enable
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

### 3. Keep System Updated

```bash
# Enable automatic security updates
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

## Troubleshooting

### Application Won't Start

```bash
# Check PM2 logs
pm2 logs streamlined-property-portal --err

# Check if port 3007 is in use
sudo lsof -i :3007

# Restart the application
pm2 restart streamlined-property-portal
```

### Nginx Issues

```bash
# Check Nginx error log
sudo tail -f /var/log/nginx/error.log

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Out of Memory

```bash
# Add swap space
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Database Connection Issues

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-*.log

# Test connection
psql -U portal_user -d property_portal -h localhost
```

## Next Steps

After completing this setup:

1. ✅ Configure GitHub Secrets (see [DEPLOYMENT.md](./DEPLOYMENT.md))
2. ✅ Test deployment by pushing to main branch
3. ✅ Monitor logs and performance
4. ✅ Set up monitoring/alerting (optional: Sentry, UptimeRobot)
5. ✅ Configure CDN for static assets (optional: Cloudflare)

## Additional Resources

- [Ubuntu Server Guide](https://ubuntu.com/server/docs)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
