# Quick Start: Algolia-Firestore Sync

## ✅ Setup Completed

Your Firestore to Algolia synchronization system has been set up! Here's what was configured:

### 📁 Files Created:

1. **Firebase Functions** (`/functions/`)
   - `src/index.ts` - Cloud Functions for automatic sync
   - `package.json` - Functions dependencies
   - `tsconfig.json` - TypeScript configuration

2. **Configuration Files**
   - `firebase.json` - Firebase project configuration
   - `firestore.rules` - Security rules for Firestore
   - `firestore.indexes.json` - Database indices

3. **Scripts** (`/scripts/`)
   - `configure-algolia.ts` - Set up Algolia index settings
   - `sync-algolia.ts` - Manual sync script

4. **Documentation**
   - `ALGOLIA_SYNC_SETUP.md` - Complete setup guide

### 🚀 Quick Start Commands

```bash
# 1. Configure Algolia indices (run once)
pnpm run configure:algolia

# 2. Sync existing data to Algolia (run once)
pnpm run sync:algolia

# 3. Build Firebase Functions
pnpm run functions:build

# 4. Deploy Functions to Firebase (requires Firebase CLI)
firebase login
firebase deploy --only functions
```

### 📋 What Happens Next?

Once you deploy the Firebase Functions:

1. **Automatic Sync** 🔄
   - Every time you create/update/delete a component → Algolia updates automatically
   - Every time you create/update/delete a user → Algolia updates automatically  
   - Every time you create/update/delete a collection → Algolia updates automatically

2. **Search Functionality** 🔍
   - Users can search components in real-time
   - Search is fast and typo-tolerant
   - Supports filtering by category, framework, tags, etc.

3. **No Manual Work** ✨
   - Everything syncs automatically
   - No need to manually update search indices
   - Data stays consistent between Firestore and Algolia

### 🔑 Required: Firebase CLI Setup

If you haven't already, install Firebase CLI:

```bash
npm install -g firebase-tools
```

Then login and initialize:

```bash
# Login to Firebase
firebase login

# Set your Firebase project (if not already set)
firebase use componentvault
```

### 📝 Environment Variables Required

Make sure these are set in your `.env.local`:

```bash
# Already configured ✅
ALGOLIA_APP_ID=A55R3Z1ERG
ALGOLIA_SEARCH_KEY=02b8de6bc1d0ca83a945ea3f28f34502
ALGOLIA_ADMIN_KEY=f429aaf1b5925da6d93cf3507f1cb088

# Firebase Admin (already configured ✅)
FIREBASE_ADMIN_PROJECT_ID=componentvault
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-fbsvc@componentvault.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
```

### 🎯 Testing the Sync

After deploying, you can test the sync:

```javascript
// In your app, create a test component
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const testComponent = {
  name: 'Test Button',
  description: 'Testing automatic sync to Algolia',
  category: 'buttons',
  tags: ['test', 'sync'],
  framework: 'react',
  isPublished: true,
  downloads: 0,
  likes: 0,
  createdAt: new Date(),
};

// This will automatically trigger the Algolia sync!
await addDoc(collection(db, 'components'), testComponent);
```

Then check your Algolia dashboard to see the new component indexed!

### 📊 Monitoring

- **Algolia Dashboard**: https://www.algolia.com/apps/A55R3Z1ERG/dashboard
- **Firebase Console**: https://console.firebase.google.com/project/componentvault/functions
- **Function Logs**: `firebase functions:log`

### ⚡ Performance Notes

- Syncs happen in real-time (within seconds)
- Free tier limits:
  - Algolia: 10K searches/month, 10K records
  - Firebase Functions: 125K invocations/month
- Monitor usage in respective dashboards

### 🐛 Troubleshooting

**Functions not deploying?**
```bash
# Make sure you're logged in
firebase login

# Check current project
firebase projects:list

# Use correct project
firebase use componentvault
```

**Sync not working?**
```bash
# Check function logs
firebase functions:log

# Re-deploy functions
pnpm run functions:build
firebase deploy --only functions
```

**Need to re-sync everything?**
```bash
# Run manual sync
pnpm run sync:algolia
```

### 📚 Next Steps

1. Deploy the Firebase Functions
2. Test with a sample component
3. Integrate search in your UI
4. Monitor the Algolia dashboard

See `ALGOLIA_SYNC_SETUP.md` for detailed documentation!

---

## 🎉 You're All Set!

The synchronization system is ready to deploy. Once you run the deploy command, your Firestore and Algolia will stay in perfect sync automatically! 

Happy coding! 🚀
