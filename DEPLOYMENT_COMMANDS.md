# 🚀 Deployment Commands

## After creating GitHub repository, run these commands:

```bash
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/glow-worm-studio.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Deploy to Vercel:

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import `glow-worm-studio` repository
5. Configure:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: Leave empty (Next.js default)
6. Click "Deploy"

## Environment Variables (Add in Vercel Dashboard):

```bash
# Add these in Vercel → Project → Settings → Environment Variables
NEXT_PUBLIC_FIREBASE_API_KEY=your_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
# ... (copy from .env.example)
```

## Custom Domain (Optional):
1. In Vercel Dashboard → Domains
2. Add your custom domain (e.g., glowworm.studio)
3. Follow DNS configuration instructions

Your app will be live at: `https://glow-worm-studio.vercel.app`
