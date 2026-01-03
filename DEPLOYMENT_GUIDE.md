# MovieStream Deployment Guide

This guide covers deploying the MovieStream application to production environments.

## Deployment Architecture

```
┌─────────────────┐
│   Users         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Frontend       │  (Vercel/Netlify)
│  React App      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Backend API    │  (Cloud VM/Container)
│  FastAPI        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Database       │  (MongoDB Atlas)
│  MongoDB        │
└─────────────────┘
```

## Prerequisites

- Domain name (optional but recommended)
- MongoDB Atlas account or MongoDB server
- Vercel/Netlify account (for frontend)
- Cloud VM or container platform (for backend)
- SSL certificate (Let's Encrypt recommended)

## Part 1: Database Setup (MongoDB)

### Option A: MongoDB Atlas (Recommended)

1. **Create MongoDB Atlas Account**:
   - Visit https://www.mongodb.com/cloud/atlas
   - Sign up for free tier

2. **Create Cluster**:
   - Choose cloud provider and region
   - Select M0 (Free tier) or appropriate tier
   - Create cluster

3. **Configure Network Access**:
   - Go to Network Access
   - Add IP Address
   - Allow access from anywhere (0.0.0.0/0) or specific IPs

4. **Create Database User**:
   - Go to Database Access
   - Add New Database User
   - Choose password authentication
   - Set username and strong password
   - Grant "Atlas admin" or appropriate role

5. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/moviestream_db
   ```

6. **Seed Database**:
   ```bash
   # Update MONGO_URL in .env with Atlas connection string
   python seed_data.py
   ```

### Option B: Self-hosted MongoDB

1. **Install MongoDB** on your server:
   ```bash
   # Ubuntu/Debian
   sudo apt-get install mongodb
   
   # Start service
   sudo systemctl start mongodb
   sudo systemctl enable mongodb
   ```

2. **Configure Security**:
   - Enable authentication
   - Create admin user
   - Configure firewall

3. **Connection String**:
   ```
   mongodb://username:password@your-server-ip:27017/moviestream_db
   ```

## Part 2: Backend Deployment

### Option A: Docker Container (Recommended)

1. **Create Dockerfile** (`/app/backend/Dockerfile`):
   ```dockerfile
   FROM python:3.11-slim
   
   WORKDIR /app
   
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt
   
   COPY . .
   
   EXPOSE 8001
   
   CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001", "--workers", "4"]
   ```

2. **Build Image**:
   ```bash
   cd /app/backend
   docker build -t moviestream-backend .
   ```

3. **Run Container**:
   ```bash
   docker run -d \
     --name moviestream-backend \
     -p 8001:8001 \
     -e MONGO_URL="your_mongodb_connection_string" \
     -e DB_NAME="moviestream_db" \
     -e ADMIN_TOKEN="your_secure_random_token" \
     -e CORS_ORIGINS="https://your-frontend-domain.com" \
     --restart unless-stopped \
     moviestream-backend
   ```

4. **Deploy to Container Platform**:
   - **AWS ECS**: Push image to ECR, create ECS service
   - **Google Cloud Run**: Push to GCR, deploy service
   - **DigitalOcean App Platform**: Connect repo, deploy

### Option B: Cloud VM (AWS EC2, DigitalOcean, etc.)

1. **Create VM**:
   - Ubuntu 22.04 LTS recommended
   - Minimum: 1 vCPU, 2GB RAM
   - Open ports: 22 (SSH), 80 (HTTP), 443 (HTTPS)

2. **SSH into Server**:
   ```bash
   ssh user@your-server-ip
   ```

3. **Install Dependencies**:
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Python
   sudo apt install python3.11 python3.11-venv python3-pip -y
   
   # Install nginx
   sudo apt install nginx -y
   
   # Install certbot (for SSL)
   sudo apt install certbot python3-certbot-nginx -y
   ```

4. **Clone Repository**:
   ```bash
   cd /opt
   sudo git clone https://github.com/your-repo/moviestream.git
   cd moviestream/backend
   ```

5. **Set Up Python Environment**:
   ```bash
   python3.11 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

6. **Configure Environment**:
   ```bash
   sudo nano .env
   ```
   
   Add:
   ```env
   MONGO_URL="your_mongodb_connection_string"
   DB_NAME="moviestream_db"
   ADMIN_TOKEN="your_secure_random_token"
   CORS_ORIGINS="https://your-frontend-domain.com"
   ```

7. **Create Systemd Service** (`/etc/systemd/system/moviestream.service`):
   ```ini
   [Unit]
   Description=MovieStream FastAPI Application
   After=network.target
   
   [Service]
   Type=simple
   User=www-data
   WorkingDirectory=/opt/moviestream/backend
   Environment="PATH=/opt/moviestream/backend/venv/bin"
   ExecStart=/opt/moviestream/backend/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8001 --workers 4
   Restart=always
   
   [Install]
   WantedBy=multi-user.target
   ```

8. **Start Service**:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl start moviestream
   sudo systemctl enable moviestream
   sudo systemctl status moviestream
   ```

9. **Configure Nginx** (`/etc/nginx/sites-available/moviestream`):
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;
   
       location / {
           proxy_pass http://127.0.0.1:8001;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

10. **Enable Site**:
    ```bash
    sudo ln -s /etc/nginx/sites-available/moviestream /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl reload nginx
    ```

11. **Set Up SSL**:
    ```bash
    sudo certbot --nginx -d api.yourdomain.com
    ```

## Part 3: Frontend Deployment

### Option A: Vercel (Recommended)

1. **Push Code to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Visit https://vercel.com
   - Sign up / Log in with GitHub
   - Click "New Project"
   - Import your repository
   - Select `frontend` as root directory

3. **Configure Build Settings**:
   - Framework Preset: Create React App
   - Build Command: `yarn build`
   - Output Directory: `build`
   - Install Command: `yarn install`

4. **Set Environment Variables**:
   ```
   REACT_APP_BACKEND_URL=https://api.yourdomain.com
   ```

5. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at: `https://your-app.vercel.app`

6. **Add Custom Domain** (Optional):
   - Go to Project Settings → Domains
   - Add your domain
   - Update DNS records as instructed

### Option B: Netlify

1. **Connect Repository**:
   - Visit https://netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub repository

2. **Build Settings**:
   - Base directory: `frontend`
   - Build command: `yarn build`
   - Publish directory: `frontend/build`

3. **Environment Variables**:
   ```
   REACT_APP_BACKEND_URL=https://api.yourdomain.com
   ```

4. **Configure Redirects** (create `frontend/public/_redirects`):
   ```
   /*    /index.html   200
   ```

5. **Deploy**:
   - Click "Deploy site"
   - Site will be live at: `https://your-app.netlify.app`

### Option C: AWS S3 + CloudFront

1. **Build Frontend**:
   ```bash
   cd /app/frontend
   yarn build
   ```

2. **Create S3 Bucket**:
   - Go to AWS S3 Console
   - Create bucket with unique name
   - Enable static website hosting
   - Set index document: `index.html`
   - Set error document: `index.html`

3. **Upload Build**:
   ```bash
   aws s3 sync build/ s3://your-bucket-name --delete
   ```

4. **Configure Bucket Policy**:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::your-bucket-name/*"
       }
     ]
   }
   ```

5. **Set Up CloudFront**:
   - Create CloudFront distribution
   - Origin: Your S3 bucket
   - Default root object: `index.html`
   - Error pages: 404 → /index.html (200)

6. **Configure Custom Domain**:
   - Add CNAME in CloudFront
   - Update DNS to point to CloudFront
   - Add SSL certificate (AWS Certificate Manager)

## Part 4: Environment Variables

### Backend Production Variables

```env
# MongoDB
MONGO_URL="mongodb+srv://user:password@cluster.mongodb.net/moviestream_db?retryWrites=true&w=majority"
DB_NAME="moviestream_db"

# Security
ADMIN_TOKEN="generate_a_very_long_random_secure_token_here_min_32_chars"

# CORS - IMPORTANT: Set to your actual frontend domain
CORS_ORIGINS="https://moviestream.vercel.app,https://www.yourdomain.com"
```

### Frontend Production Variables

```env
REACT_APP_BACKEND_URL=https://api.yourdomain.com
```

### Generating Secure Admin Token

```bash
# Using Python
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Part 5: Post-Deployment

### 1. Seed Production Database

```bash
# SSH into backend server or run locally with production MONGO_URL
python seed_data.py
```

### 2. Test Deployment

**Test Backend**:
```bash
# Health check
curl https://api.yourdomain.com/api/

# Get movies
curl https://api.yourdomain.com/api/movies

# Test admin auth
curl -X POST https://api.yourdomain.com/api/admin/validate-token \
  -H "Authorization: Bearer your_token"
```

**Test Frontend**:
- Visit your frontend URL
- Browse movies
- Test search
- Try admin login
- Play a video

### 3. Monitor Logs

**Backend Logs** (if using systemd):
```bash
sudo journalctl -u moviestream -f
```

**Frontend Logs**:
- Check Vercel/Netlify dashboard
- Check browser console

### 4. Set Up Monitoring

**Backend Monitoring**:
- Use AWS CloudWatch, Datadog, or New Relic
- Monitor CPU, memory, request rates
- Set up alerts for errors

**Frontend Monitoring**:
- Use Vercel Analytics or Google Analytics
- Monitor page load times
- Track user behavior

### 5. Backup Strategy

**Database Backups**:
- MongoDB Atlas: Automatic backups enabled by default
- Self-hosted: Set up daily backups with mongodump:
  ```bash
  mongodump --uri="your_mongo_url" --out=/backups/$(date +%Y%m%d)
  ```

## Part 6: CI/CD Setup (Optional)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: |
          cd backend
          pip install -r requirements.txt
          pytest

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: |
          cd frontend
          yarn install
          yarn test

  deploy:
    needs: [test-backend, test-frontend]
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: echo "Deploy steps here"
```

## Troubleshooting

### CORS Errors
- Verify `CORS_ORIGINS` in backend `.env` includes your frontend domain
- Don't use `*` in production
- Include protocol: `https://domain.com`

### Database Connection Failed
- Check MongoDB connection string
- Verify network access in MongoDB Atlas
- Check firewall rules

### Admin Login Not Working
- Verify `ADMIN_TOKEN` matches in backend
- Check browser localStorage
- Clear cache and try again

### Video Playback Issues
- Ensure video URLs are publicly accessible
- Check CORS headers on video hosting
- Use CDN for better performance

### Build Failures
- Check environment variables are set
- Verify all dependencies are in package.json/requirements.txt
- Check build logs for specific errors

## Security Checklist

- [ ] Strong admin token (32+ characters)
- [ ] CORS configured for specific domains only
- [ ] HTTPS enabled (SSL certificates)
- [ ] MongoDB authentication enabled
- [ ] MongoDB network access restricted
- [ ] Environment variables not committed to git
- [ ] Regular security updates
- [ ] Rate limiting configured (recommended)
- [ ] Firewall rules configured
- [ ] Backup strategy in place

## Performance Optimization

### Backend
- Use multiple uvicorn workers: `--workers 4`
- Enable connection pooling for MongoDB
- Add Redis caching for frequently accessed data
- Use CDN for video delivery

### Frontend
- Enable Vercel/Netlify CDN
- Optimize images (use WebP, lazy loading)
- Code splitting for large bundles
- Enable service worker for offline support

## Cost Estimation

**Free Tier (Suitable for MVP)**:
- MongoDB Atlas: Free M0 cluster
- Vercel: Free tier (100GB bandwidth)
- Backend: DigitalOcean $5/month droplet
- **Total**: ~$5/month

**Production Tier**:
- MongoDB Atlas: M10 cluster ($57/month)
- Vercel: Pro tier ($20/month)
- Backend: DigitalOcean $12/month droplet
- CloudFront: Pay-as-you-go (~$10-50/month)
- **Total**: ~$100-150/month

## Support

For deployment issues:
1. Check this guide thoroughly
2. Review application logs
3. Test each component individually
4. Check DNS propagation (can take 24-48 hours)
5. Verify all environment variables

---

**Your MovieStream application is now ready for production!**