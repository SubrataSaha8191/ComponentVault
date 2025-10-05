# Firestore to Algolia Sync Setup

This document explains how to set up and use the automatic synchronization between Firestore and Algolia for ComponentVault.

## 📋 Overview

The sync system automatically keeps your Algolia search indices up-to-date with your Firestore data using Firebase Cloud Functions. Every time a document is created, updated, or deleted in Firestore, the corresponding changes are automatically reflected in Algolia.

## 🎯 What Gets Synced

### Components
- Name, description, category, tags
- Framework information
- Stats (downloads, likes, favorites, views)
- Author information
- Accessibility score
- Premium and published status

### Users
- Display name, username, email
- Bio, location, website
- Avatar/profile image
- Component and follower counts
- Verification status

### Collections
- Name, description, tags
- Component IDs and count
- Author information
- Public/private status
- Stats (likes, views)

## 🚀 Setup Instructions

### 1. Install Dependencies

First, install the necessary packages:

```bash
# Install main project dependencies (already done)
pnpm install

# Install Firebase Functions dependencies
pnpm run functions:install
```

### 2. Configure Environment Variables

Make sure your `.env.local` file has these Algolia credentials:

```bash
# Algolia Configuration
ALGOLIA_APP_ID=A55R3Z1ERG
ALGOLIA_SEARCH_KEY=02b8de6bc1d0ca83a945ea3f28f34502
ALGOLIA_ADMIN_KEY=f429aaf1b5925da6d93cf3507f1cb088
ALGOLIA_COMPONENTS_INDEX=components
```

### 3. Configure Algolia Index Settings

Run this command to set up optimal search configuration for your Algolia indices:

```bash
pnpm run configure:algolia
```

This configures:
- Searchable attributes
- Faceting (filtering) attributes
- Custom ranking
- Highlighting and snippeting
- Pagination settings

### 4. Initial Data Sync

Sync your existing Firestore data to Algolia:

```bash
pnpm run sync:algolia
```

This will:
- Read all documents from Firestore collections
- Format them for Algolia
- Upload them to the respective indices

### 5. Deploy Firebase Functions

Deploy the Cloud Functions to enable automatic sync:

```bash
# Build the functions
pnpm run functions:build

# Deploy to Firebase
pnpm run functions:deploy
```

Or use the Firebase CLI directly:

```bash
firebase deploy --only functions
```

## 🔄 How Automatic Sync Works

Once deployed, the following Firebase Cloud Functions will automatically sync your data:

### Component Sync Functions
- `onComponentCreate` - Indexes new components in Algolia
- `onComponentUpdate` - Updates component data in Algolia
- `onComponentDelete` - Removes deleted components from Algolia

### User Sync Functions
- `onUserCreate` - Indexes new users in Algolia
- `onUserUpdate` - Updates user profiles in Algolia
- `onUserDelete` - Removes deleted users from Algolia

### Collection Sync Functions
- `onCollectionCreate` - Indexes new collections in Algolia
- `onCollectionUpdate` - Updates collection data in Algolia
- `onCollectionDelete` - Removes deleted collections from Algolia

## 🛠️ Manual Sync Function

There's also a callable Cloud Function for manual bulk syncing:

```javascript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const syncAllToAlgolia = httpsCallable(functions, 'syncAllToAlgolia');

// Trigger manual sync
const result = await syncAllToAlgolia();
console.log(result.data); // { success: true, results: {...} }
```

## 📝 Usage Examples

### Creating a Component (Auto-syncs to Algolia)

```javascript
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Create a new component in Firestore
const componentData = {
  name: 'Button Component',
  description: 'A beautiful, accessible button',
  category: 'buttons',
  tags: ['ui', 'interactive'],
  framework: 'react',
  authorId: userId,
  authorName: userName,
  downloads: 0,
  likes: 0,
  isPublished: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// This automatically triggers the Algolia sync
await addDoc(collection(db, 'components'), componentData);
```

### Searching with Algolia

```javascript
import { searchComponents } from '@/lib/algolia-config';

// Search for components
const results = await searchComponents('button', {
  filters: 'category:buttons AND isPublished:true',
  facetFilters: [['framework:react', 'framework:vue']],
});

console.log(results.hits); // Matching components
```

## 🔧 Maintenance

### Re-sync All Data

If data gets out of sync, you can manually re-sync everything:

```bash
pnpm run sync:algolia
```

### Update Algolia Settings

If you need to change search configuration:

```bash
pnpm run configure:algolia
```

### View Function Logs

Monitor your Cloud Functions:

```bash
firebase functions:log
```

Or view in Firebase Console:
https://console.firebase.google.com/project/componentvault/functions

## 📊 Monitoring

### Algolia Dashboard
Monitor your search analytics at:
https://www.algolia.com/apps/A55R3Z1ERG/dashboard

### Firebase Console
View function execution and logs:
https://console.firebase.google.com/project/componentvault/functions

## ⚠️ Important Notes

1. **Admin Key Security**: Never expose `ALGOLIA_ADMIN_KEY` in client-side code
2. **Function Costs**: Firebase Functions have free tier limits; monitor usage
3. **Algolia Limits**: Free tier has 10K searches/month and 10K records
4. **Data Consistency**: Initial sync may take a few minutes for large datasets
5. **Authentication**: The manual sync function requires authentication

## 🐛 Troubleshooting

### Functions not triggering?
- Check Firebase Console for function deployment status
- Verify Firestore rules allow the operations
- Check function logs for errors

### Search not working?
- Verify Algolia indices exist
- Check API keys are correct
- Ensure data has been indexed

### Data mismatch?
- Run manual sync: `pnpm run sync:algolia`
- Check function logs for errors
- Verify Firestore data structure matches expected format

## 📚 Additional Resources

- [Firebase Cloud Functions Documentation](https://firebase.google.com/docs/functions)
- [Algolia Documentation](https://www.algolia.com/doc/)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)

## 🎉 Success!

Your Firestore to Algolia sync is now configured! Every change in Firestore will automatically update your search indices, providing real-time search capabilities for your users.
