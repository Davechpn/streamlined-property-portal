#!/bin/bash

# Deployment script for streamlined-property-portal (Docker version)
# This script should be placed on your VPS

set -e  # Exit on any error

echo "🚀 Starting deployment..."

# Configuration
PROJECT_DIR="${PROJECT_DIR:-/var/www/streamlined-property-portal}"
BRANCH="${BRANCH:-main}"

# Navigate to project directory
cd "$PROJECT_DIR"

echo "📦 Current directory: $(pwd)"

# Backup current .env file
if [ -f .env.local ]; then
    echo "💾 Backing up .env.local..."
    cp .env.local .env.local.backup
fi

# Pull latest changes
echo "⬇️  Pulling latest changes from $BRANCH..."
git fetch origin
git reset --hard origin/$BRANCH

# Restore .env file
if [ -f .env.local.backup ]; then
    echo "📝 Restoring .env.local..."
    mv .env.local.backup .env.local
fi

# Stop running containers
echo "� Stopping running containers..."
docker compose down

# Build new image
echo "🔨 Building Docker image..."
docker compose build --no-cache

# Start containers
echo "� Starting containers..."
docker compose up -d

# Wait for container to be healthy
echo "⏳ Waiting for container to be healthy..."
sleep 5

# Show status
echo "✅ Deployment complete!"
echo ""
echo "📊 Container status:"
docker compose ps
echo ""
echo "📜 Recent logs:"
docker compose logs --tail=20
