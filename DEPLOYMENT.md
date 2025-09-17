# Deployment Guide - Beginner Friendly

This guide focuses on simple, beginner-friendly deployment options for the Real-Time Polling application.

## 📋 Pre-deployment Checklist

- [ ] PostgreSQL database is set up and accessible locally
- [ ] Environment variables are configured (.env file)
- [ ] Application runs locally without errors (`npm start`)
- [ ] API tests pass successfully (`npm run test:api`)
- [ ] You have a GitHub account with your code pushed

## 🔧 Environment Setup

Your `.env` file should contain:
```env
# Database (use your actual PostgreSQL password)
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/polling_db"

# Authentication (generate a random string)
JWT_SECRET="your-random-secret-key-at-least-32-characters-long"

# Server
PORT=3000
NODE_ENV=development
```

## 🚀 Easy Deployment Options

### Option 1: Railway (Recommended for Beginners)

Railway is the easiest way to deploy Node.js apps with PostgreSQL.

#### Steps:
1. **Sign up at [Railway.app](https://railway.app)** using your GitHub account
2. **Click "New Project" → "Deploy from GitHub repo"**
3. **Select your Real-Time-Polling repository**
4. **Add PostgreSQL database:**
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway will automatically create a database
5. **Set Environment Variables:**
   - Go to your app → "Variables" tab
   - Add: `JWT_SECRET` = `your-secret-key-here`
   - Add: `NODE_ENV` = `production`
   - DATABASE_URL is automatically set by Railway
6. **Deploy:** Railway automatically deploys when you push to GitHub!

**Cost:** Free tier includes everything you need to start.

### Option 2: Heroku (Also Beginner-Friendly)

#### Prerequisites:
- Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
- Have Git installed

#### Steps:
1. **Create Heroku account** at [heroku.com](https://heroku.com)
2. **Login to Heroku CLI:**
   ```bash
   heroku login
   ```
3. **Create new app:**
   ```bash
   heroku create your-unique-app-name
   ```
4. **Add PostgreSQL database:**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```
5. **Set environment variables:**
   ```bash
   heroku config:set JWT_SECRET="your-secret-key-here"
   heroku config:set NODE_ENV=production
   ```
6. **Deploy:**
   ```bash
   git push heroku main
   ```
7. **Set up database:**
   ```bash
   heroku run npm run db:push
   heroku run npm run db:setup
   ```

**Cost:** Free tier available (with some limitations).

## 🔍 Testing Your Deployment

After deployment, test these URLs (replace with your app URL):
- `https://your-app.railway.app/` - Should show API info
- `https://your-app.railway.app/client` - Your polling client
- `https://your-app.railway.app/api` - API documentation

## 🆘 Troubleshooting

### Common Issues:
1. **"Application Error"** → Check logs: `heroku logs --tail` (Heroku) or Railway dashboard
2. **Database connection failed** → Verify DATABASE_URL environment variable
3. **WebSocket not working** → Ensure your deployment platform supports WebSockets

### Getting Help:
- Railway: Check their [documentation](https://docs.railway.app)
- Heroku: Check their [dev center](https://devcenter.heroku.com)
- Your app logs will show specific error messages

## 🎉 Next Steps

Once deployed successfully:
1. **Share your app URL** with others to test
2. **Monitor usage** through your platform's dashboard
3. **Consider upgrading** to paid plans if you get many users

---

**Note:** This guide focuses on beginner-friendly options. Advanced deployment methods (AWS, VPS servers) require more technical knowledge and are not covered here.
   ```bash
   heroku create your-app-name
   ```

2. **Add PostgreSQL Add-on**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set JWT_SECRET="your-secure-secret"
   heroku config:set NODE_ENV=production
   heroku config:set CORS_ORIGIN="https://your-frontend-domain.com"
   ```

4. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

5. **Run Database Setup**
   ```bash
   heroku run npm run db:push
   heroku run npm run db:setup
   ```

#### Heroku-specific Configuration

Create `Procfile` in project root:
```
web: npm start
```

### 2. Railway Deployment

#### Steps

1. **Connect Repository**
   - Go to [Railway](https://railway.app)
   - Connect your GitHub repository

2. **Add PostgreSQL Service**
   - Add a PostgreSQL database service
   - Copy the connection URL

3. **Set Environment Variables**
   ```
   DATABASE_URL=<your-railway-postgres-url>
   JWT_SECRET=your-secure-secret
   NODE_ENV=production
   PORT=3000
   ```

4. **Deploy**
   - Railway automatically deploys on git push

### 3. DigitalOcean App Platform

#### Steps

1. **Create App**
   - Go to DigitalOcean App Platform
   - Connect your repository

2. **Configure Build Settings**
   ```yaml
   build_command: npm install && npm run db:generate
   run_command: npm start
   ```

3. **Add Database**
   - Create a managed PostgreSQL database
   - Add connection string to environment

4. **Set Environment Variables**
   - Configure all required environment variables
   - Deploy the application

### 4. AWS Elastic Beanstalk

#### Prerequisites
- AWS CLI installed and configured
- EB CLI installed

#### Steps

1. **Initialize Elastic Beanstalk**
   ```bash
   eb init
   ```

2. **Create Environment**
   ```bash
   eb create production
   ```

3. **Set Environment Variables**
   ```bash
   eb setenv JWT_SECRET="your-secure-secret" NODE_ENV=production
   ```

4. **Deploy**
   ```bash
   eb deploy
   ```

### 5. VPS/Dedicated Server

#### Prerequisites
- Ubuntu/CentOS server with SSH access
- Domain name pointing to server
- SSL certificate (Let's Encrypt recommended)

#### Steps

1. **Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PostgreSQL
   sudo apt install postgresql postgresql-contrib -y
   
   # Install PM2
   sudo npm install -g pm2
   ```

2. **Database Setup**
   ```bash
   # Create database and user
   sudo -u postgres psql
   CREATE DATABASE polling_db;
   CREATE USER polling_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE polling_db TO polling_user;
   \q
   ```

3. **Application Deployment**
   ```bash
   # Clone repository
   git clone <your-repo-url>
   cd real-time-polling
   
   # Install dependencies
   npm ci
   
   # Set up environment
   cp .env.example .env
   # Edit .env with your configurations
   
   # Generate Prisma client
   npm run db:generate
   
   # Apply database schema
   npm run db:push
   
   # Seed database
   npm run db:setup
   ```

4. **PM2 Configuration**
   
   Create `ecosystem.config.js`:
   ```javascript
   module.exports = {
     apps: [{
       name: 'polling-api',
       script: 'src/server.js',
       instances: 'max',
       exec_mode: 'cluster',
       env: {
         NODE_ENV: 'development'
       },
       env_production: {
         NODE_ENV: 'production'
       }
     }]
   }
   ```

5. **Start Application**
   ```bash
   pm2 start ecosystem.config.js --env production
   pm2 save
   pm2 startup
   ```

6. **Nginx Configuration**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
       
       # WebSocket support
       location /socket.io/ {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

## 🔍 Post-Deployment Verification

### Health Checks

1. **API Health**
   ```bash
   curl https://your-domain.com/health
   ```

2. **Database Connection**
   ```bash
   curl https://your-domain.com/api/polls
   ```

3. **WebSocket Connection**
   - Open browser developer console
   - Connect to your domain and test real-time features

### Monitoring

1. **PM2 Monitoring** (VPS)
   ```bash
   pm2 monit
   pm2 logs
   ```

2. **Database Monitoring**
   ```bash
   # Check database connections
   SELECT * FROM pg_stat_activity WHERE datname = 'polling_db';
   ```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify DATABASE_URL format
   - Check firewall rules
   - Ensure database is accessible from deployment platform

2. **WebSocket Connection Issues**
   - Verify proxy configuration for WebSockets
   - Check CORS settings
   - Ensure sticky sessions for load balancers

3. **Authentication Problems**
   - Verify JWT_SECRET is set
   - Check token expiration settings
   - Ensure consistent secret across instances

4. **Performance Issues**
   - Enable database connection pooling
   - Configure proper logging levels
   - Monitor memory usage

### Debugging Commands

```bash
# Check application logs
pm2 logs polling-api

# Monitor database connections
SELECT count(*) FROM pg_stat_activity;

# Test API endpoints
curl -X POST https://your-domain.com/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm run test:api
      env:
        DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
        JWT_SECRET: ${{ secrets.JWT_SECRET }}
    
    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
        heroku_app_name: "your-app-name"
        heroku_email: "your-email@example.com"
```

## 📊 Performance Optimization

### Production Optimizations

1. **Database Optimization**
   - Enable connection pooling
   - Add database indexes
   - Configure query optimization

2. **Application Optimization**
   - Enable gzip compression
   - Implement caching strategies
   - Use clustering for multi-core systems

3. **Security Enhancements**
   - Rate limiting
   - Request validation
   - Security headers

### Example Production Configuration

```javascript
// Add to server.js for production
if (process.env.NODE_ENV === 'production') {
  // Compression
  const compression = require('compression');
  app.use(compression());
  
  // Security headers
  const helmet = require('helmet');
  app.use(helmet());
  
  // Rate limiting
  const rateLimit = require('express-rate-limit');
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });
  app.use(limiter);
}
```

---

**For additional support, refer to the main README.md or create an issue in the repository.**
