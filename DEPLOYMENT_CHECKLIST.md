# Production Deployment Checklist

## Issue Fixed
The login internal server error was caused by improper Prisma client initialization for production environments.

## Changes Made

### 1. Updated `src/lib/prisma.js`
- ✅ Removed `dotenv.config()` (doesn't work in serverless production)
- ✅ Added proper `Pool` initialization from `pg` package
- ✅ Added error handling for missing `DATABASE_URL`
- ✅ Implemented singleton pattern to prevent connection exhaustion
- ✅ Fixed adapter initialization syntax

### 2. Updated `src/app/api/auth/login/route.js`
- ✅ Added error logging for debugging production issues

## Environment Variables to Set in Production

Make sure these environment variables are set in your hosting platform (Vercel/Netlify/etc.):

### Required:
- `DATABASE_URL` - Your PostgreSQL connection string
  - Format: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public`
  - Example: `postgresql://user:pass@host.com:5432/dbname?schema=public`

- `JWT_SECRET` - Your JWT secret key for token generation
  - Should be a long, random string
  - Example: `your-super-secret-jwt-key-change-this-in-production`

### Optional:
- `NODE_ENV` - Should be set to `production` (usually auto-set by hosting platforms)

## Deployment Steps

### For Vercel:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the following:
   - `DATABASE_URL` = your PostgreSQL connection string
   - `JWT_SECRET` = your secret key
4. Redeploy your application

### For Other Platforms:
1. Locate environment variables settings
2. Add `DATABASE_URL` and `JWT_SECRET`
3. Ensure build command is: `npm run build`
4. Ensure start command is: `npm start`
5. Redeploy

## Database Connection String Format

### Standard PostgreSQL:
```
postgresql://username:password@hostname:5432/database_name
```

### With SSL (recommended for production):
```
postgresql://username:password@hostname:5432/database_name?sslmode=require
```

### Connection Pooling (for serverless - recommended):
If using a service like Neon, Supabase, or PlanetScale, use their connection pooling URL.

Example for Neon:
```
postgresql://username:password@hostname/database_name?sslmode=require&connect_timeout=10
```

## Testing After Deployment

1. Check deployment logs for any errors
2. Test the login endpoint:
   ```bash
   curl -X POST https://your-domain.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"testpassword"}'
   ```
3. Check server logs for the error message we added
4. Verify database connection is working

## Common Issues and Solutions

### Issue: "DATABASE_URL environment variable is not set"
**Solution:** Add DATABASE_URL to your hosting platform's environment variables

### Issue: Connection timeout
**Solution:** 
- Ensure your database allows connections from your hosting platform's IP
- Use connection pooling URL if available
- Check database firewall settings

### Issue: SSL/TLS errors
**Solution:** Add `?sslmode=require` to your DATABASE_URL

### Issue: Too many connections
**Solution:** 
- The singleton pattern should prevent this
- Consider using a connection pooler like PgBouncer
- Use serverless-friendly database services (Neon, Supabase)

## Verification

After deployment, verify:
- [ ] Environment variables are set correctly
- [ ] Database is accessible from hosting platform
- [ ] Login endpoint returns proper responses
- [ ] JWT tokens are being generated
- [ ] Cookies are being set correctly

## Next Steps

1. Deploy the updated code to production
2. Set environment variables in your hosting platform
3. Monitor logs for any errors
4. Test login functionality
5. If issues persist, check the server logs for the specific error message

## Support

If you continue to experience issues:
1. Check your hosting platform's logs
2. Verify DATABASE_URL is correct and accessible
3. Test database connection independently
4. Ensure all dependencies are installed in production
