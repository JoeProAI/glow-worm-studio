# 🔥 Firebase Setup Guide

Your Firebase project is already created! Here's how to connect it:

## 📋 Quick Setup (5 minutes)

### 1. Get Your Firebase Config
- Go to [Firebase Console](https://console.firebase.google.com/project/glow-worm-studio/settings/general)
- Scroll down to "Your apps" section
- Click "Config" or the gear icon
- Copy the config values

### 2. Create Environment File
```bash
# Copy the example file
cp .env.local.example .env.local
```

### 3. Add Your Firebase Credentials
Edit `.env.local` with your actual values:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=glow-worm-studio.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=glow-worm-studio
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=glow-worm-studio.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 4. Enable Firebase Services
In your [Firebase Console](https://console.firebase.google.com/project/glow-worm-studio):

#### Authentication
- Go to Authentication > Sign-in method
- Enable "Email/Password"
- Enable "Google" (optional)

#### Firestore Database
- Go to Firestore Database
- Click "Create database"
- Choose "Start in test mode"
- Select your region

#### Storage
- Go to Storage
- Click "Get started"
- Choose "Start in test mode"
- Your bucket: `gs://glow-worm-studio.firebasestorage.app`

### 5. Security Rules (Optional)
Update your Storage rules for better security:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🚀 That's It!
Once you add the environment variables, your app will automatically:
- ✅ Upload files to Firebase Storage
- ✅ Store metadata in Firestore
- ✅ Handle user authentication
- ✅ Provide persistent, scalable storage

## 🔧 Troubleshooting
- **Demo mode**: App works without Firebase (shows sample data)
- **Check console**: Look for Firebase connection messages
- **Verify config**: Make sure all environment variables are set
