# Deployment Guide - VPS Deployment via GitHub Actions (Docker)

This document provides instructions for deploying the Streamlined Property Portal to a Linux VPS using GitHub Actions and Docker.

## Overview

The deployment workflow automatically:
- Builds and tests the application on GitHub's runners
- Connects to your VPS via SSH
- Pulls the latest code
- Builds a Docker image on the VPS
- Starts the container with docker-compose
- Verifies the deployment

## Why Docker?

✅ **Consistent environments** - Development matches production exactly  
✅ **Easy rollbacks** - Just redeploy a previous image  
✅ **No dependency conflicts** - Everything is containerized  
✅ **Better isolation** - Enhanced security and resource management  
✅ **Simpler setup** - No need to manually install Node.js, PM2, etc.  

## Prerequisites

Before setting up the deployment workflow, ensure you have:

1. A Linux VPS with SSH access
2. Docker and Docker Compose installed on the VPS
3. Git installed on the VPS
4. Your repository cloned on the VPS
5. A domain or IP address pointing to your VPS

## GitHub Secrets Configuration

Navigate to your GitHub repository → Settings → Secrets and variables → Actions, and add the following secrets:

### Required Secrets

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `VPS_HOST` | Your VPS IP address or domain | `123.45.67.89` or `example.com` |
| `VPS_USERNAME` | SSH username | `root` or `ubuntu` or `deployer` |
| `VPS_SSH_KEY` | Private SSH key for authentication | See SSH key setup below |
| `VPS_PORT` | SSH port (optional, defaults to 22) | `22` |
| `VPS_PROJECT_PATH` | Absolute path to project on VPS | `/var/www/streamlined-property-portal` |

### Environment Variables

| Secret Name | Description | Required |
|-------------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |
| `DATABASE_URL` | Database connection string | Yes |
| `NEXTAUTH_SECRET` | NextAuth secret key | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Optional |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Optional |
| `RESEND_API_KEY` | Resend email API key | Optional |
| `SENTRY_DSN` | Sentry error tracking DSN | Optional |

## SSH Key Setup

### 1. Generate SSH Key Pair (on your local machine)

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/vps_deploy_key
```

This creates two files:
- `~/.ssh/vps_deploy_key` (private key) - Add to GitHub Secrets
- `~/.ssh/vps_deploy_key.pub` (public key) - Add to VPS

### 2. Add Public Key to VPS

Copy the public key to your VPS:

```bash
ssh-copy-id -i ~/.ssh/vps_deploy_key.pub username@your-vps-ip
```

Or manually add it to `~/.ssh/authorized_keys` on the VPS:

```bash
# On your VPS
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "your-public-key-content" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### 3. Add Private Key to GitHub Secrets

Copy the contents of your private key:

```bash
cat ~/.ssh/vps_deploy_key
```

Add this entire output (including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`) as the `VPS_SSH_KEY` secret in GitHub.

## VPS Setup

See [VPS_SETUP_DOCKER.md](./VPS_SETUP_DOCKER.md) for detailed instructions on preparing your VPS with Docker for deployment.

**Quick setup checklist:**
1. Install Docker and Docker Compose
2. Install Git and Nginx
3. Clone your repository
4. Create `.env.local` file with environment variables
5. Add your SSH public key to `~/.ssh/authorized_keys`
6. Test Docker: `docker compose build && docker compose up -d`


## Triggering Deployments

### Automatic Deployment

The workflow automatically runs when you push to:
- `main` branch
- `production` branch

```bash
git push origin main
```

### Manual Deployment

You can also trigger a deployment manually:

1. Go to your GitHub repository
2. Click on "Actions" tab
3. Select "Deploy to VPS" workflow
4. Click "Run workflow"
5. Select the branch to deploy

## Monitoring Deployments

### GitHub Actions

1. Go to the "Actions" tab in your repository
2. Click on the latest workflow run
3. View logs for each step

### On Your VPS

Check Docker container status:
```bash
docker compose ps
docker compose logs -f streamlined-property-portal
```

Check container health:
```bash
docker inspect streamlined-property-portal --format='{{.State.Status}}'
```

Monitor resources:
```bash
docker stats streamlined-property-portal
```


## Troubleshooting

### Deployment Fails at Git Pull

**Issue**: Permission denied or authentication failed

**Solution**: 
- Ensure the VPS has access to your GitHub repository
- Set up deploy keys or use HTTPS with a personal access token

```bash
# On VPS, use HTTPS with token
git remote set-url origin https://YOUR_GITHUB_TOKEN@github.com/username/repo.git
```

### Build Fails on VPS

**Issue**: Out of memory or build errors

**Solution**:
- Increase VPS memory (swap file)
- Check Node.js version matches development environment
- Verify all dependencies are installed

### PM2 App Won't Start

**Issue**: Application crashes after restart

**Solution**:
- Check environment variables: `cat .env.local`
- View error logs: `pm2 logs streamlined-property-portal --err`
- Verify port is not already in use: `lsof -i :3000`

### SSH Connection Fails

**Issue**: GitHub Actions can't connect to VPS

**Solution**:
- Verify `VPS_HOST`, `VPS_PORT`, and `VPS_USERNAME` are correct
- Ensure firewall allows SSH connections
- Check SSH key format in GitHub Secrets (must include header/footer)
- Test SSH connection manually: `ssh -i ~/.ssh/vps_deploy_key username@vps-ip`

## Rollback Procedure

If a deployment causes issues:

### Option 1: Revert via Git

```bash
# On VPS
cd /var/www/streamlined-property-portal
git log --oneline  # Find the commit to revert to
git reset --hard COMMIT_HASH
npm ci
npm run build
pm2 restart streamlined-property-portal
```

### Option 2: Redeploy Previous Version

1. In GitHub, go to the commit you want to deploy
2. Click "Actions" → "Deploy to VPS" → "Run workflow"
3. Select the branch/commit to deploy

## Security Best Practices

1. **Use a dedicated deployment user** instead of root
2. **Restrict SSH key access** - the key should only allow deployment actions
3. **Use environment-specific secrets** for production vs staging
4. **Enable firewall** on VPS (ufw or iptables)
5. **Keep dependencies updated** regularly
6. **Monitor logs** for suspicious activity
7. **Use HTTPS** with SSL certificates (Let's Encrypt)
8. **Backup regularly** - database and application files

## Performance Optimization

1. **Enable PM2 clustering** for better performance:
   ```bash
   pm2 start npm --name "streamlined-property-portal" -i max -- start
   ```

2. **Set up Nginx as reverse proxy** for better performance and SSL termination

3. **Enable caching** in Next.js config

4. **Use CDN** for static assets

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [SSH Key Authentication](https://www.ssh.com/academy/ssh/public-key-authentication)

## Support

If you encounter issues not covered in this guide:

1. Check the GitHub Actions logs for detailed error messages
2. Review VPS logs: `pm2 logs streamlined-property-portal`
3. Verify all secrets are correctly set in GitHub
4. Ensure VPS has sufficient resources (CPU, RAM, disk space)
