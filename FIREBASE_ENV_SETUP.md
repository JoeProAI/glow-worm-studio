# 🔥 Firebase Environment Variables Setup

## 📋 Required Environment Variables for Vercel

Copy and paste these environment variables into your Vercel project settings:

### 🔐 Server-Side Firebase Admin (Already Working)
```
FIREBASE_PROJECT_ID=glow-worm-studio
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@glow-worm-studio.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----"
FIREBASE_STORAGE_BUCKET=glow-worm-studio.firebasestorage.app
```

### 🌐 Client-Side Firebase Auth (Need New Keys)
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=glow-worm-studio.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=glow-worm-studio
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=glow-worm-studio.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890abcdef
```

## 🎯 How to Get These Values

### 1. Go to Firebase Console
- Visit: https://console.firebase.google.com/
- Select your `glow-worm-studio` project

### 2. Get Client-Side Config
- Click the gear icon ⚙️ → Project Settings
- Scroll down to "Your apps" section
- Click on your web app or create one if needed
- Copy the `firebaseConfig` object values:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // → NEXT_PUBLIC_FIREBASE_API_KEY
  authDomain: "glow-worm-studio.firebaseapp.com", // → NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  projectId: "glow-worm-studio", // → NEXT_PUBLIC_FIREBASE_PROJECT_ID
  storageBucket: "glow-worm-studio.firebasestorage.app", // → NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123456789012", // → NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123456789012:web:abcdef1234567890abcdef" // → NEXT_PUBLIC_FIREBASE_APP_ID
};
```

### 3. Enable Authentication
- Go to Authentication → Sign-in method
- Enable:
  - ✅ Email/Password
  - ✅ Google (optional)
  - ✅ GitHub (optional)

## 🚀 Copy-Paste Ready Format for Vercel

Once you get your Firebase config, replace the XXX values and paste into Vercel:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=glow-worm-studio.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=glow-worm-studio
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=glow-worm-studio.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890abcdef
```

## ✅ What Will Work After Setup

- 🔐 **Sign In/Sign Up** - Email & password authentication
- 🔑 **Google/GitHub Auth** - Social login (if enabled)
- 👤 **User Profiles** - Automatic user management
- 🛡️ **Protected Dashboard** - Requires authentication
- 📁 **Personal File Storage** - User-specific file management
- 🎬 **AI Video Generation** - Authenticated user features

## 🔧 Current Status

- ✅ **Server-side Firebase Admin** - Working perfectly
- ✅ **File uploads & management** - Working via server APIs
- ✅ **AI video generation** - Working via server APIs
- ⏳ **Client-side authentication** - Needs environment variables

## 📝 Notes

- Server-side Firebase Admin is already working with your service account
- Only client-side authentication needs the new environment variables
- All data operations will continue to work via secure server APIs
- Client-side Firebase only handles authentication, not data storage
