# Production Deployment Fix Guide

## ✅ Issues Fixed

### Enhanced Error Handling
- ✅ Added detailed error logging for login/signup
- ✅ Specific error messages for database, JWT, and connection issues
- ✅ Better debugging information in development mode

## 🚀 Deployment Steps for Vercel/Netlify/Railway

### Step 1: Environment Variables

You **MUST** set these environment variables in your hosting platform:

#### Required Variables:

1. **DATABASE_URL**
   ```
   postgresql://username:password@host:port/database?sslmode=require
   ```
   - Get this from your database provider (Neon, Supabase, Railway, etc.)
   - Must include `?sslmode=require` for production
   - Example: `postgresql://user:pass@db.neon.tech/mydb?sslmode=require`

2. **JWT_SECRET**
   ```
   your-super-secret-random-string-min-32-characters
   ```
   - Use a long, random string
   - Generate one: `openssl rand -base64 32`
   - Example: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

3. **NODE_ENV** (usually auto-set)
   ```
   production
   ```

### Step 2: Vercel Deployment

1. **Go to Vercel Dashboard**
   - Navigate to your project
   - Click "Settings" → "Environment Variables"

2. **Add Variables:**
   ```
   DATABASE_URL = postgresql://your-connection-string
   JWT_SECRET = your-secret-key
   ```

3. **Redeploy:**
   - Go to "Deployments"
   - Click "..." on latest deployment
   - Click "Redeploy"

### Step 3: Check Logs

After deployment, check logs for errors:

1. Go to your deployment
2. Click "View Function Logs"
3. Look for any error messages
4. The new error handling will show specific issues

## 🔍 Common Production Errors & Solutions

### Error: "Database configuration error"
**Cause:** DATABASE_URL not set or incorrect

**Solution:**
1. Verify DATABASE_URL is set in environment variables
2. Check the connection string format
3. Ensure database allows connections from your hosting platform

### Error: "Database connection error"
**Cause:** Can't connect to database

**Solution:**
1. Add `?sslmode=require` to DATABASE_URL
2. Check database firewall settings
3. Verify database is running
4. Use connection pooling URL if available

### Error: "Authentication token error"
**Cause:** JWT_SECRET not set or JWT generation failed

**Solution:**
1. Set JWT_SECRET environment variable
2. Ensure it's a long, random string
3. Restart deployment after setting

### Error: "Email already exists"
**Cause:** User trying to signup with existing email

**Solution:** This is expected - user should login instead

## 📊 Database Providers Setup

### Neon (Recommended)
1. Go to https://neon.tech
2. Create a new project
3. Copy the connection string
4. Use the "Pooled connection" string
5. Add to Vercel as DATABASE_URL

### Supabase
1. Go to https://supabase.com
2. Create project
3. Go to Settings → Database
4. Copy "Connection pooling" string
5. Add to Vercel as DATABASE_URL

### Railway
1. Go to https://railway.app
2. Create PostgreSQL database
3. Copy DATABASE_URL from variables
4. Add to Vercel as DATABASE_URL

## 🧪 Testing Production

### Test Login Endpoint:
```bash
curl -X POST https://your-domain.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Test Signup Endpoint:
```bash
curl -X POST https://your-domain.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Expected Success Response:
```json
{
  "message": "logged in",
  "token": "eyJhbGc..."
}
```

### Expected Error Response (with details):
```json
{
  "error": "Database connection error",
  "details": "Connection timeout..."
}
```

## ✅ Deployment Checklist

Before deploying:
- [ ] DATABASE_URL is set in production environment
- [ ] JWT_SECRET is set in production environment
- [ ] Database allows connections from hosting platform
- [ ] SSL mode is enabled in DATABASE_URL
- [ ] Code is committed and pushed to GitHub
- [ ] Environment variables are saved (not just added)

After deploying:
- [ ] Check deployment logs for errors
- [ ] Test login endpoint
- [ ] Test signup endpoint
- [ ] Verify cookies are being set
- [ ] Check database for new users

## 🆘 Still Having Issues?

1. **Check Vercel Logs:**
   - Go to your deployment
   - Click "View Function Logs"
   - Look for the detailed error messages we added

2. **Verify Database Connection:**
   ```bash
   # Test database connection locally
   psql "your-database-url"
   ```

3. **Check Environment Variables:**
   - Ensure they're set in the correct environment (Production)
   - Verify no typos in variable names
   - Make sure to redeploy after adding variables

4. **Common Mistakes:**
   - Forgetting to redeploy after adding env variables
   - Using wrong DATABASE_URL (not the pooled one)
   - Missing `?sslmode=require` in DATABASE_URL
   - JWT_SECRET too short or not set

## 📝 Next Steps

1. Commit and push these changes:
   ```bash
   git add .
   git commit -m "fix: enhanced error handling for production"
   git push
   ```

2. Set environment variables in Vercel

3. Redeploy and test

4. Check logs if issues persist

The enhanced error logging will now tell you exactly what's wrong!
