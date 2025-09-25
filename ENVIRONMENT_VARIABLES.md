# 🔧 Environment Variables Guide - Glow Worm Studio

## 🚀 **Current Status**
Your app is **deployed and working** without any environment variables! The landing page is live and beautiful.

Environment variables are only needed when you want to enable specific features:

---

## 🔥 **Phase 1: Firebase Authentication (Optional for now)**

### **What you need to do:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project: `glow-worm-studio`
3. Enable Authentication, Firestore, Storage
4. Get your config from Project Settings → General → Your apps

### **Variables to add in Vercel:**
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=glow-worm-studio.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=glow-worm-studio
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=glow-worm-studio.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

**🎯 Enables:** User signup, login, profile management, data storage

---

## 💳 **Phase 2: Stripe Payments (For revenue)**

### **What you need to do:**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get your API keys from Developers → API keys
3. Set up products and pricing

### **Variables to add in Vercel:**
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51...your_publishable_key
STRIPE_SECRET_KEY=sk_live_51...your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_...your_webhook_secret
```

**🎯 Enables:** Subscription payments, billing, premium features

---

## 🤖 **Phase 3: AI Features (For smart categorization)**

### **OpenAI (Image analysis)**
1. Go to [OpenAI Platform](https://platform.openai.com)
2. Create API key

```bash
OPENAI_API_KEY=sk-...your_openai_key
```

### **XAI (Advanced AI)**
1. Go to [XAI Console](https://console.x.ai)
2. Create API key

```bash
XAI_API_KEY=xai-...your_xai_key
```

### **Luma AI (Video generation)**
1. Go to [Luma AI](https://lumalabs.ai)
2. Get API access

```bash
LUMA_API_KEY=luma_...your_luma_key
```

**🎯 Enables:** Auto-tagging, smart organization, video generation

---

## 🌐 **Phase 4: Additional Services (Optional)**

### **App Configuration**
```bash
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_random_secret_string
NEXTAUTH_URL=https://your-domain.vercel.app
```

### **Email (Optional)**
```bash
RESEND_API_KEY=re_...your_resend_key
SMTP_FROM=noreply@yourdomain.com
```

---

## 📋 **Priority Order (What to add first)**

### **🥇 Priority 1: Get Started (Optional)**
- **Firebase variables** - Enable user accounts
- **Result:** Users can sign up and log in

### **🥈 Priority 2: Make Money (Important)**
- **Stripe variables** - Enable payments  
- **Result:** Users can subscribe and pay

### **🥉 Priority 3: AI Magic (Advanced)**
- **OpenAI + XAI + Luma** - Enable AI features
- **Result:** Smart categorization and generation

---

## 🔧 **How to Add Variables in Vercel**

1. **Go to:** [Vercel Dashboard](https://vercel.com/dashboard)
2. **Select:** Your `glow-worm-studio` project
3. **Go to:** Settings → Environment Variables
4. **Add each variable:**
   - Name: `NEXT_PUBLIC_FIREBASE_API_KEY`
   - Value: `AIzaSyC...your_actual_key`
   - Environment: `Production, Preview, Development`
5. **Click:** Save
6. **Redeploy:** Go to Deployments → Click "..." → Redeploy

---

## ⚡ **Quick Start Recommendation**

### **For Testing (5 minutes):**
```bash
# Just add these to see authentication work
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### **For Revenue (10 minutes):**
```bash
# Add Firebase + Stripe for full functionality
# (Firebase variables above +)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

---

## 🎯 **Current Status Summary**

✅ **Working Now:** Beautiful landing page, professional design
🔄 **Add Firebase:** Enable user accounts and authentication  
💰 **Add Stripe:** Enable subscriptions and revenue
🤖 **Add AI APIs:** Enable smart features

**Your app is already live and impressive! Environment variables just unlock more features.** 🌟
