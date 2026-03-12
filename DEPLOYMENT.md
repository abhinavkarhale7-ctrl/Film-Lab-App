# Deployment Guide

This guide covers deploying the Film Lab Management App to production.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (can use managed services like Supabase, Railway, or AWS RDS)
- Domain name (optional but recommended)
- Vercel/Netlify account or similar hosting platform

## Option 1: Deploy to Vercel (Recommended)

Vercel offers the easiest deployment for Next.js applications.

### Steps

1. **Push your code to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**
   
   In your Vercel project settings, add these environment variables:

   ```
   DATABASE_URL=postgresql://user:password@host:5432/database
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=your-generated-secret
   ```

   Generate NEXTAUTH_SECRET:
   ```bash
   openssl rand -base64 32
   ```

4. **Set up Database**

   You'll need a PostgreSQL database. Options:
   
   - **Vercel Postgres** (easiest, built-in)
   - **Supabase** (free tier available)
   - **Railway** (simple setup)
   - **AWS RDS** (production-grade)

5. **Run Migrations**

   After deploying, run migrations via Vercel CLI:
   ```bash
   vercel env pull .env.local
   npx prisma migrate deploy
   npx prisma db seed
   ```

6. **Deploy**
   
   Click "Deploy" in Vercel. Your app will be live at `your-project.vercel.app`

## Option 2: Deploy to Railway

Railway is another excellent option with integrated database hosting.

### Steps

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub account

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add PostgreSQL Database**
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway will automatically create and connect the database

4. **Configure Environment Variables**
   
   Railway auto-configures `DATABASE_URL`. Add these additional variables:

   ```
   NEXTAUTH_URL=${{RAILWAY_PUBLIC_DOMAIN}}
   NEXTAUTH_SECRET=your-generated-secret
   ```

5. **Run Migrations**
   
   Use Railway's terminal:
   ```bash
   npx prisma migrate deploy
   npm run db:seed
   ```

6. **Deploy**
   
   Railway auto-deploys on push. Your app will be live at a Railway-provided domain.

## Option 3: Deploy to DigitalOcean App Platform

### Steps

1. **Create DigitalOcean Account**
   - Go to [digitalocean.com](https://digitalocean.com)

2. **Create PostgreSQL Database**
   - Create a managed PostgreSQL database in DigitalOcean

3. **Create App**
   - Go to Apps → Create App
   - Connect your GitHub repository
   - DigitalOcean will detect Next.js

4. **Configure Build Settings**
   
   Build Command: `npm run build`
   Run Command: `npm start`

5. **Add Environment Variables**
   
   ```
   DATABASE_URL=your-digitalocean-db-url
   NEXTAUTH_URL=https://your-app-url.ondigitalocean.app
   NEXTAUTH_SECRET=your-generated-secret
   ```

6. **Deploy**
   
   Click "Create Resources" to deploy.

## Post-Deployment Checklist

After deploying, verify:

- [ ] Database migrations completed
- [ ] Database seeded (admin/customer users created)
- [ ] Login functionality works
- [ ] Order creation works
- [ ] Admin dashboard accessible
- [ ] Environment variables properly set
- [ ] HTTPS enabled
- [ ] Custom domain configured (if applicable)

## Database Migration Commands

### Production Migration
```bash
npx prisma migrate deploy
```

### View Database
```bash
npx prisma studio
```

### Reset Database (⚠️ DANGER - deletes all data)
```bash
npx prisma migrate reset
```

## Environment Variables Reference

### Required
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - Full URL of your deployed app
- `NEXTAUTH_SECRET` - Secret for JWT signing (generate with `openssl rand -base64 32`)

### Optional (for future features)
- `STRIPE_SECRET_KEY` - Stripe API key
- `STRIPE_PUBLISHABLE_KEY` - Stripe public key
- `EMAIL_SERVER_HOST` - SMTP server
- `EMAIL_SERVER_PORT` - SMTP port
- `EMAIL_SERVER_USER` - SMTP username
- `EMAIL_SERVER_PASSWORD` - SMTP password
- `EMAIL_FROM` - Sender email address
- `AWS_REGION` - AWS region for S3
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_S3_BUCKET` - S3 bucket name

## Monitoring & Logging

### Vercel
- Built-in analytics and logging
- View logs in Vercel dashboard
- Set up alerts for errors

### Railway
- Built-in metrics and logging
- View logs in Railway dashboard

### Production Best Practices

1. **Enable Error Tracking**
   - Consider Sentry or similar service
   - Monitor API errors and client-side errors

2. **Set Up Backups**
   - Configure automated database backups
   - Most managed databases include this

3. **Monitor Performance**
   - Use Vercel Analytics or similar
   - Set up uptime monitoring

4. **Security**
   - Use HTTPS only (enabled by default on Vercel/Railway)
   - Rotate secrets regularly
   - Keep dependencies updated

5. **Scaling**
   - Monitor database connection pool
   - Consider read replicas for high traffic
   - Use CDN for static assets (automatic on Vercel)

## Troubleshooting

### Build Failures

**Problem**: Build fails with Prisma errors
**Solution**: Ensure `postinstall` script runs `prisma generate`

**Problem**: Environment variables not found
**Solution**: Check they're set in hosting platform, not just .env file

### Runtime Errors

**Problem**: Database connection fails
**Solution**: Verify DATABASE_URL is correct and database is accessible

**Problem**: NextAuth session issues
**Solution**: Ensure NEXTAUTH_URL and NEXTAUTH_SECRET are set correctly

### Performance Issues

**Problem**: Slow page loads
**Solution**: Enable caching, optimize database queries, use CDN

**Problem**: Database timeouts
**Solution**: Increase connection pool size, optimize queries

## Rollback Procedure

If deployment has issues:

1. **Vercel**: Use "Redeploy" with previous commit
2. **Railway**: Redeploy from previous deployment
3. **Database**: Restore from backup if needed

## Support

For deployment issues:
- Check platform documentation (Vercel, Railway, etc.)
- Review application logs
- Check GitHub issues
- Contact platform support

## Cost Estimation

### Vercel + Supabase (Free Tier)
- Vercel: Free for hobby projects
- Supabase: Free tier (500MB database)
- Total: $0/month (with limits)

### Vercel + Railway (Paid)
- Vercel: $20/month (Pro plan)
- Railway: $5-20/month (database)
- Total: $25-40/month

### DigitalOcean
- App Platform: $12/month
- Managed Database: $15/month
- Total: $27/month

## Next Steps

After successful deployment:
1. Test all features in production
2. Set up monitoring and alerts
3. Configure custom domain
4. Add SSL certificate (usually automatic)
5. Create admin documentation
6. Train users on the system
