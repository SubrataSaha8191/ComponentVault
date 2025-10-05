# ComponentVault Backend - Quick Setup Guide

## ✅ Installation Complete

All necessary packages have been installed:
- Firebase SDK (firebase)
- Firebase Admin SDK (firebase-admin)
- React Firebase Hooks (react-firebase-hooks)

## 🔥 Firebase Setup Required

### Step 1: Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your **ComponentVault** project
3. Click the gear icon → Project Settings
4. Scroll down to "Your apps" section
5. Click on Web app (</>) to get your config
6. Copy all the config values

### Step 2: Get Firebase Admin SDK Credentials

1. In Firebase Console → Project Settings
2. Click "Service Accounts" tab
3. Click "Generate new private key"
4. Download the JSON file
5. Extract: `project_id`, `client_email`, and `private_key`

### Step 3: Update .env.local File

Open `.env.local` and replace all the placeholder values:

```env
# From Firebase Web App Config
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=componentvault.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ComponentVault
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=componentvault.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABC...

# From Service Account JSON
FIREBASE_ADMIN_PROJECT_ID=ComponentVault
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-...@componentvault.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Step 4: Enable Firebase Services

#### Enable Authentication:
1. Go to Authentication → Sign-in method
2. Enable: Email/Password, Google, GitHub
3. Configure OAuth providers as needed

#### Enable Firestore Database:
1. Go to Firestore Database
2. Click "Create database"
3. Choose "Production mode"
4. Select a region close to your users
5. Apply the security rules from BACKEND_DOCUMENTATION.md

#### Enable Storage:
1. Go to Storage
2. Click "Get started"
3. Choose "Production mode"
4. Apply the security rules from BACKEND_DOCUMENTATION.md

### Step 5: Test the Setup

Create a test file to verify Firebase connection:

```typescript
// test-firebase.ts
import { db } from '@/lib/firebase/config';
import { collection, getDocs } from 'firebase/firestore';

async function testConnection() {
  try {
    const testCollection = collection(db, 'test');
    await getDocs(testCollection);
    console.log('✅ Firebase connected successfully!');
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
  }
}

testConnection();
```

## 🚀 What's Been Created

### Backend Infrastructure
✅ Firebase Configuration (client & server)
✅ TypeScript Types for all entities
✅ Firestore Operations (CRUD for all collections)
✅ Storage Operations (file uploads)
✅ Authentication Operations (sign up/in/out)

### API Routes
✅ `/api/components` - Component CRUD
✅ `/api/collections` - Collection management
✅ `/api/favorites` - Favorite system
✅ `/api/comments` - Comment system
✅ `/api/follows` - Follow/unfollow users
✅ `/api/users` - User profiles
✅ `/api/activities` - Activity feed
✅ `/api/search` - Search components

### React Hooks
✅ `useAuth()` - Authentication state
✅ `useComponents()` - Fetch components
✅ `useComponent()` - Single component
✅ `useCollections()` - User collections
✅ `useCollection()` - Single collection

## 📊 Database Collections

Your Firebase will have these collections:
- **users** - User profiles and stats
- **components** - All uploaded components
- **collections** - User-created collections
- **favorites** - Liked components
- **comments** - Component comments
- **follows** - User follow relationships
- **activities** - User activity feed
- **stats** - Component statistics
- **libraryComponents** - Bootstrap, Flowbite, etc.

## 🎯 Next Steps

1. ✅ **Complete Firebase Setup** (Steps 1-4 above)
2. 🔲 **Create Upload Form** - UI for users to upload components
3. 🔲 **Create Component Cards** - Display components in browse page
4. 🔲 **Build User Dashboard** - Show user's components and stats
5. 🔲 **Add Collection UI** - Manage component collections
6. 🔲 **Implement Search** - Use the search API
7. 🔲 **Add Authentication UI** - Sign up/sign in forms
8. 🔲 **Seed Library Components** - Add Bootstrap, Flowbite, Radix data

## 📚 Key Features

### User Features
- Sign up/Sign in with Email, Google, or GitHub
- Upload components with preview images
- Edit/Delete own components
- Create and manage collections
- Like/Unlike components
- Comment on components
- Follow other users
- View activity feed

### Component Features
- Multiple categories (button, card, form, etc.)
- Framework support (React, Next, Vue, etc.)
- Styling frameworks (Tailwind, CSS, etc.)
- Source types (custom, bootstrap, flowbite, etc.)
- Code preview with Monaco Editor
- Usage instructions
- Install commands
- Track views, likes, copies

### Admin Features (Future)
- Feature components
- Manage users
- Moderate comments
- View analytics

## 💡 Example: Complete Upload Flow

```typescript
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';

function UploadComponent() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData();
    formData.append('title', 'My Button Component');
    formData.append('description', 'A beautiful button');
    formData.append('code', buttonCode);
    formData.append('previewImage', imageFile);
    formData.append('category', 'button');
    formData.append('tags', JSON.stringify(['button', 'react']));
    formData.append('framework', 'react');
    formData.append('language', 'typescript');
    formData.append('styling', 'tailwind');
    formData.append('dependencies', JSON.stringify([]));
    formData.append('authorId', user.uid);
    formData.append('authorName', user.displayName);
    formData.append('isPublic', 'true');
    formData.append('sourceType', 'custom');
    formData.append('version', '1.0.0');

    const response = await fetch('/api/components', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    setUploading(false);

    if (result.success) {
      alert('Component uploaded!');
    }
  };

  return <form onSubmit={handleSubmit}>{/* form fields */}</form>;
}
```

## 🔒 Security

- Firestore security rules control data access
- Storage rules protect file uploads
- Server-side validation in API routes
- Authentication required for write operations
- Users can only edit/delete their own content

## 📖 Documentation

Full documentation available in:
- `BACKEND_DOCUMENTATION.md` - Complete API reference
- `lib/firebase/types.ts` - All TypeScript interfaces
- Inline code comments

## 🆘 Need Help?

Check these files:
1. `BACKEND_DOCUMENTATION.md` - Full API docs
2. `lib/firebase/*.ts` - Firebase operations
3. `app/api/**/route.ts` - API endpoint implementations
4. `hooks/*.ts` - React hook examples

## 🎉 You're Ready!

Your backend system is fully set up. Just complete the Firebase configuration and start building your UI!

Run your dev server:
```bash
pnpm dev
```

Happy coding! 🚀
