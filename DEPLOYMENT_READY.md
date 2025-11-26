# ✅ Deployment Ready - Quick Start Guide

Your deployment workflow has been updated to use **Docker** instead of PM2!

## 📋 What Changed

- ✅ Updated GitHub Actions workflow to use Docker
- ✅ Updated `docker-compose.yml` with health checks and env file support
- ✅ Updated `deploy.sh` script for Docker deployment
- ✅ Created comprehensive VPS setup guide for Docker
- ✅ Added Docker vs PM2 comparison documentation

## 🚀 Quick Deployment Steps

### 1. Setup Your VPS (One-time)

Follow **[VPS_SETUP_DOCKER.md](./VPS_SETUP_DOCKER.md)** to:
- Install Docker & Docker Compose
- Install Git & Nginx
- Clone your repository
- Create `.env.local` file
- Configure Nginx reverse proxy
- Set up SSL with Let's Encrypt

**Quick commands:**
```bash
# On your VPS
sudo apt update && sudo apt install -y docker.io docker-compose git nginx

# Clone project
sudo mkdir -p /var/www/streamlined-property-portal
sudo chown $USER:$USER /var/www/streamlined-property-portal
cd /var/www/streamlined-property-portal
git clone https://YOUR_TOKEN@github.com/Davechpn/streamlined-property-portal.git .

# Create environment file
nano .env.local
# (Add your production environment variables)

# Test Docker
docker compose build
docker compose up -d
```

### 2. Configure GitHub Secrets

Go to: `github.com/Davechpn/streamlined-property-portal/settings/secrets/actions`

Add these secrets:

| Secret | Your Value | Status |
|--------|-----------|---------|
| `VPS_SSH_KEY` | (Your private key shown earlier) | ✅ Ready |
| `VPS_HOST` | Your VPS IP or domain | ❌ Add this |
| `VPS_USERNAME` | SSH username (e.g., `ubuntu`, `deployer`) | ❌ Add this |
| `VPS_PROJECT_PATH` | `/var/www/streamlined-property-portal` | ❌ Add this |

**Environment variables (add to VPS `.env.local` instead):**
- `NEXT_PUBLIC_API_URL`
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- Other app-specific variables

### 3. Deploy!

**Option A: Automatic deployment**
```bash
# Push to main or production branch
git push origin main
```

**Option B: Manual deployment**
1. Go to GitHub Actions tab
2. Click "Deploy to VPS"
3. Click "Run workflow"
4. Select branch

## 📦 Files Created/Updated

1. **`.github/workflows/deploy.yml`** - GitHub Actions workflow (Docker-based)
2. **`docker-compose.yml`** - Updated with health checks and env file
3. **`deploy.sh`** - Deployment script for Docker
4. **`VPS_SETUP_DOCKER.md`** - Complete VPS setup guide
5. **`DEPLOYMENT.md`** - Updated deployment documentation
6. **`DOCKER_VS_PM2.md`** - Comparison and rationale

## 🔍 Verify Deployment

After deployment, check:

```bash
# On your VPS
docker compose ps
docker compose logs -f
docker stats streamlined-property-portal

# Check if app is responding
curl http://localhost:3007
```

## 🎯 Benefits of Docker Deployment

✅ **Consistent** - Same environment everywhere  
✅ **Simple** - Just `docker compose up`  
✅ **Isolated** - No dependency conflicts  
✅ **Portable** - Easy to move/scale  
✅ **Modern** - Industry standard practice  

## 🛠️ Common Commands

```bash
# View logs
docker compose logs -f

# Restart application
docker compose restart

# Rebuild and redeploy
docker compose up -d --build

# Stop application
docker compose down

# Check container status
docker compose ps
```

## 📚 Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Full deployment guide
- [VPS_SETUP_DOCKER.md](./VPS_SETUP_DOCKER.md) - VPS setup instructions
- [DOCKER_VS_PM2.md](./DOCKER_VS_PM2.md) - Why Docker over PM2

## ⚠️ Important Notes

1. **Branch**: Workflow triggers on `main` or `production`. You're on `001-accounts`.
   - Either merge to main, or update workflow to trigger on your branch
   
2. **Environment Variables**: Store them in `.env.local` on your VPS (not in GitHub)

3. **First Deploy**: May take 5-10 minutes to build the Docker image

4. **Health Check**: Container has a health check at `/api/health` (you may need to create this endpoint)

## 🆘 Troubleshooting

### Container won't start
```bash
docker compose logs streamlined-property-portal
```

### Deployment fails
- Check GitHub Actions logs
- Verify all secrets are set correctly
- Ensure VPS has Docker installed
- Check SSH connectivity

### Out of memory
```bash
# Add swap space
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

## ✨ Next Steps

1. [ ] Set up your VPS following VPS_SETUP_DOCKER.md
2. [ ] Add GitHub Secrets
3. [ ] Add your SSH public key to VPS
4. [ ] Create `.env.local` on VPS
5. [ ] Test Docker locally: `docker compose up`
6. [ ] Push to main branch and watch it deploy!

---

**Questions?** Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed troubleshooting and best practices.
