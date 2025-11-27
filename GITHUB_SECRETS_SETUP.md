# GitHub Secrets Setup Guide

## Quick Setup Checklist

Before the workflow can deploy, you need to add these secrets to GitHub.

### Step-by-Step Instructions

#### 1. Go to GitHub Secrets Page
Open: https://github.com/Davechpn/streamlined-property-portal/settings/secrets/actions

#### 2. Add Each Secret

Click **"New repository secret"** for each of the following:

---

### Secret 1: VPS_HOST
**Name:** `VPS_HOST`  
**Value:** Your VPS IP address or domain  
**Example:** `123.45.67.89` or `yourdomain.com`

---

### Secret 2: VPS_USERNAME
**Name:** `VPS_USERNAME`  
**Value:** The SSH username for your VPS  
**Common values:**
- `ubuntu` (Ubuntu servers)
- `root` (if using root)
- `deployer` (if you created a deploy user)

---

### Secret 3: VPS_SSH_KEY
**Name:** `VPS_SSH_KEY`  
**Value:** Your private SSH key (paste the ENTIRE key including headers)

**Get your key:**
```bash
cat ~/.ssh/id_ed25519
```

**The value should look like:**
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gt
ZWQyNTUxOQAAACA7H/ABZ/DSwyZ5Yn2KDP5iAniNli/ORYEgE6Lk779wKgAAAKBMk1atTJ
... (more lines)
ICeI2WL85FgSATouTvv3AqAAAAF2NoaXB1bmRvZGF2aWRAZ21haWwuY29tAQIDBAUG
-----END OPENSSH PRIVATE KEY-----
```

⚠️ **Important:** Include the entire key with BEGIN and END lines!

---

### Optional Secret: VPS_PORT
**Name:** `VPS_PORT`  
**Value:** `22` (default SSH port)  
**Only add if:** Your VPS uses a non-standard SSH port

---

## Verification

After adding all secrets, you should see:
- ✅ VPS_HOST
- ✅ VPS_USERNAME  
- ✅ VPS_SSH_KEY
- ✅ VPS_PORT (optional)

**Note:** The project path is now auto-detected and doesn't require a secret!

## Before First Deployment

⚠️ **Your VPS must have Docker installed!**

### Quick VPS Preparation (Only Docker Required)

```bash
# SSH into your VPS
ssh your-username@your-vps-ip

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker

# Verify Docker installation
docker --version
docker compose --version

# Exit VPS
exit
```

That's it! The workflow will automatically:
- ✅ Clone the repository on first deployment
- ✅ Create the project directory
- ✅ Pull updates on subsequent deployments
- ✅ Build and run your Docker containers

### Environment Variables

After the first deployment, you'll need to add your `.env.local` file:

```bash
# SSH into your VPS
ssh your-username@your-vps-ip

# Navigate to project
cd ~/streamlined-property-portal

# Create environment file
nano .env.local
```

Add your production environment variables:
```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
DATABASE_URL=postgresql://user:password@host:5432/dbname
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-super-secret-key
# ... other variables
```

Then trigger a redeploy to pick up the environment variables.

## Test Deployment

### Option 1: Manual Trigger
1. Go to: https://github.com/Davechpn/streamlined-property-portal/actions
2. Click "Deploy to VPS"
3. Click "Run workflow"
4. Select `001-accounts` branch
5. Click "Run workflow"

### Option 2: Push to Branch
```bash
git push origin 001-accounts
```

The workflow will automatically trigger on push.

## Troubleshooting

### "No such file or directory"
- ❌ VPS_PROJECT_PATH not set in GitHub Secrets
- ✅ Add the secret in GitHub

### "Permission denied (publickey)"
- ❌ VPS_SSH_KEY not set or incorrect
- ❌ Public key not added to VPS ~/.ssh/authorized_keys
- ✅ Verify the private key is complete in GitHub Secrets
- ✅ Add public key to VPS

### "fatal: not a git repository"
- ❌ Repository not cloned on VPS
- ✅ Clone the repository on VPS first

### "docker: command not found"
- ❌ Docker not installed on VPS
- ✅ Install Docker on VPS

## Complete Setup Documentation

For detailed VPS setup instructions, see:
- **[VPS_SETUP_DOCKER.md](./VPS_SETUP_DOCKER.md)** - Complete VPS setup guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Full deployment documentation
- **[DEPLOYMENT_READY.md](./DEPLOYMENT_READY.md)** - Quick start guide

## Support

If you encounter issues:
1. Check GitHub Actions logs for detailed error messages
2. SSH into your VPS and verify setup
3. Review the deployment documentation
