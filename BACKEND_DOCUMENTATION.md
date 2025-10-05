# ComponentVault Backend System Documentation

## Overview

This comprehensive backend system enables users to upload, share, and manage UI components with full Firebase integration. The system supports user authentication, component uploads with preview images, favorites, collections, comments, and follows.

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Next.js 15 with React 19
- **Backend**: Next.js API Routes
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Authentication**: Firebase Authentication
- **Language**: TypeScript

### Firebase Project
- **Project Name**: ComponentVault
- **Collections**: users, components, collections, favorites, comments, activities, follows, stats, libraryComponents

## 📁 Project Structure

```
lib/firebase/
├── config.ts           # Firebase client configuration
├── admin.ts            # Firebase Admin SDK (server-side)
├── types.ts            # TypeScript types for all entities
├── firestore.ts        # Firestore database operations
├── storage.ts          # Firebase Storage operations
└── auth.ts             # Authentication operations

app/api/
├── components/         # Component CRUD operations
│   ├── route.ts
│   └── [id]/
│       ├── route.ts
│       └── copy/route.ts
├── collections/        # Collection management
│   ├── route.ts
│   └── [id]/route.ts
├── favorites/          # Favorite operations
│   └── route.ts
├── comments/           # Comment system
│   └── route.ts
├── follows/            # User follow system
│   └── route.ts
├── users/              # User profile management
│   └── route.ts
├── activities/         # User activity feed
│   └── route.ts
└── search/             # Search functionality
    └── route.ts

hooks/
├── use-auth.ts         # Authentication hook
├── use-components.ts   # Component data hooks
└── use-collections.ts  # Collection data hooks
```

## 🔧 Setup Instructions

### 1. Environment Configuration

Create `.env.local` file with your Firebase credentials:

```env
# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ComponentVault
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id_here

# Firebase Admin SDK (Server-side)
FIREBASE_ADMIN_PROJECT_ID=ComponentVault
FIREBASE_ADMIN_CLIENT_EMAIL=your_client_email_here
FIREBASE_ADMIN_PRIVATE_KEY=your_private_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your ComponentVault project
3. Enable the following services:
   - **Authentication**: Email/Password, Google, GitHub
   - **Firestore Database**: Production mode
   - **Storage**: Production mode

4. Set up Firestore Security Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Components collection
    match /components/{componentId} {
      allow read: if resource.data.isPublic == true || request.auth.uid == resource.data.authorId;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.authorId;
    }
    
    // Collections
    match /collections/{collectionId} {
      allow read: if resource.data.isPublic == true || request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Favorites
    match /favorites/{favoriteId} {
      allow read: if request.auth.uid == resource.data.userId;
      allow create, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Comments
    match /comments/{commentId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Follows
    match /follows/{followId} {
      allow read: if true;
      allow create, delete: if request.auth != null && request.auth.uid == request.resource.data.followerId;
    }
    
    // Activities
    match /activities/{activityId} {
      allow read: if true;
      allow create: if request.auth != null;
    }
  }
}
```

5. Set up Storage Security Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /components/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /users/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /collections/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 3. Install Dependencies

Already installed! Run if needed:
```bash
pnpm install
```

## 📚 Database Schema

### Users Collection
```typescript
{
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  website?: string;
  github?: string;
  twitter?: string;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
  totalComponents: number;
  totalLikes: number;
  followers: number;
  following: number;
}
```

### Components Collection
```typescript
{
  id: string;
  title: string;
  description: string;
  code: string;
  previewImage: string;
  thumbnailImage?: string;
  category: ComponentCategory;
  tags: string[];
  framework: Framework;
  language: 'typescript' | 'javascript';
  styling: StylingFramework;
  dependencies: string[];
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  likes: number;
  views: number;
  copies: number;
  isPublic: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  version: string;
  sourceType: 'custom' | 'bootstrap' | 'flowbite' | 'radix' | 'shadcn' | 'material-ui' | 'chakra' | 'ant-design';
  sourceUrl?: string;
  livePreviewUrl?: string;
  installCommand?: string;
  usageInstructions?: string;
}
```

### Collections Collection
```typescript
{
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  userId: string;
  userName: string;
  componentIds: string[];
  isPublic: boolean;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔌 API Endpoints

### Components API

#### GET /api/components
Fetch components with filters
```typescript
Query Parameters:
- id?: string                    // Single component by ID
- category?: string              // Filter by category
- framework?: string             // Filter by framework
- sourceType?: string            // Filter by source type
- authorId?: string              // Filter by author
- limit?: number                 // Limit results
- orderBy?: string               // Order by field
- order?: 'asc' | 'desc'        // Order direction

Response: Component | Component[]
```

#### POST /api/components
Create a new component (multipart/form-data)
```typescript
Form Data:
- title: string
- description: string
- code: string
- previewImage: File
- thumbnailImage?: File
- category: string
- tags: string (JSON array)
- framework: string
- language: 'typescript' | 'javascript'
- styling: string
- dependencies: string (JSON array)
- authorId: string
- authorName: string
- authorAvatar?: string
- isPublic: boolean
- sourceType: string
- sourceUrl?: string
- installCommand?: string
- usageInstructions?: string
- version: string

Response: { success: true, componentId: string, message: string }
```

#### PUT /api/components/[id]
Update a component
```typescript
Body: Partial<Component>
Response: { success: true, message: string }
```

#### DELETE /api/components/[id]
Delete a component
```typescript
Query Parameters:
- authorId: string
- previewUrl: string
- thumbnailUrl?: string

Response: { success: true, message: string }
```

#### POST /api/components/[id]/copy
Increment component copy count
```typescript
Response: { success: true, message: string }
```

### Favorites API

#### GET /api/favorites
Get favorites or check if favorited
```typescript
Query Parameters:
- userId: string
- componentId?: string  // Optional: check specific component

Response: { isFavorited: boolean } | Favorite[]
```

#### POST /api/favorites
Add to favorites
```typescript
Body: { userId: string, componentId: string }
Response: { success: true, message: string }
```

#### DELETE /api/favorites
Remove from favorites
```typescript
Query Parameters:
- userId: string
- componentId: string

Response: { success: true, message: string }
```

### Collections API

#### GET /api/collections
Get collections
```typescript
Query Parameters:
- id?: string      // Single collection by ID
- userId?: string  // User's collections

Response: Collection | Collection[]
```

#### POST /api/collections
Create a collection
```typescript
Body: {
  name: string;
  description: string;
  userId: string;
  userName: string;
  isPublic: boolean;
  coverImage?: string;
}

Response: { success: true, collectionId: string, message: string }
```

#### PUT /api/collections/[id]
Update a collection
```typescript
Body: Partial<Collection>
Response: { success: true, message: string }
```

#### DELETE /api/collections/[id]
Delete a collection
```typescript
Response: { success: true, message: string }
```

#### POST /api/collections/[id]
Add component to collection
```typescript
Body: { componentId: string }
Response: { success: true, message: string }
```

### Comments API

#### GET /api/comments
Get component comments
```typescript
Query Parameters:
- componentId: string

Response: Comment[]
```

#### POST /api/comments
Add a comment
```typescript
Body: {
  componentId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
}

Response: { success: true, commentId: string, message: string }
```

#### DELETE /api/comments
Delete a comment
```typescript
Query Parameters:
- commentId: string

Response: { success: true, message: string }
```

### Follows API

#### GET /api/follows
Check if following
```typescript
Query Parameters:
- followerId: string
- followingId: string

Response: { isFollowing: boolean }
```

#### POST /api/follows
Follow a user
```typescript
Body: { followerId: string, followingId: string }
Response: { success: true, message: string }
```

#### DELETE /api/follows
Unfollow a user
```typescript
Query Parameters:
- followerId: string
- followingId: string

Response: { success: true, message: string }
```

### Users API

#### GET /api/users
Get user by ID
```typescript
Query Parameters:
- userId: string

Response: User
```

#### PUT /api/users
Update user profile
```typescript
Body: { userId: string, ...updateData }
Response: { success: true, message: string }
```

### Activities API

#### GET /api/activities
Get user activities
```typescript
Query Parameters:
- userId: string
- limit?: number

Response: Activity[]
```

### Search API

#### GET /api/search
Search components
```typescript
Query Parameters:
- q: string       // Search query
- limit?: number

Response: Component[]
```

## 🎣 React Hooks Usage

### useAuth Hook
```typescript
import { useAuth } from '@/hooks/use-auth';

function MyComponent() {
  const { user, firebaseUser, loading, error, isAuthenticated } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please sign in</div>;

  return <div>Welcome, {user?.displayName}!</div>;
}
```

### useComponents Hook
```typescript
import { useComponents } from '@/hooks/use-components';

function ComponentList() {
  const { components, loading, error, refresh } = useComponents({
    category: 'button',
    framework: 'react',
    limit: 20,
    orderBy: 'likes',
    order: 'desc'
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {components.map(component => (
        <div key={component.id}>{component.title}</div>
      ))}
    </div>
  );
}
```

### useComponent Hook
```typescript
import { useComponent } from '@/hooks/use-components';

function ComponentDetail({ id }: { id: string }) {
  const { component, loading, error, refresh } = useComponent(id);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!component) return <div>Component not found</div>;

  return <div>{component.title}</div>;
}
```

### useCollections Hook
```typescript
import { useCollections } from '@/hooks/use-collections';

function UserCollections({ userId }: { userId: string }) {
  const { collections, loading, error, refresh } = useCollections(userId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {collections.map(collection => (
        <div key={collection.id}>{collection.name}</div>
      ))}
    </div>
  );
}
```

## 🔐 Authentication Usage

### Sign Up
```typescript
import { signUpWithEmail } from '@/lib/firebase/auth';

const handleSignUp = async () => {
  try {
    const user = await signUpWithEmail(email, password, displayName);
    console.log('User created:', user);
  } catch (error) {
    console.error('Sign up error:', error);
  }
};
```

### Sign In
```typescript
import { signInWithEmail, signInWithGoogle, signInWithGithub } from '@/lib/firebase/auth';

// Email/Password
const user = await signInWithEmail(email, password);

// Google
const user = await signInWithGoogle();

// GitHub
const user = await signInWithGithub();
```

### Sign Out
```typescript
import { signOutUser } from '@/lib/firebase/auth';

await signOutUser();
```

## 📤 Component Upload Example

```typescript
const uploadComponent = async (componentData: any, previewFile: File) => {
  const formData = new FormData();
  
  formData.append('title', componentData.title);
  formData.append('description', componentData.description);
  formData.append('code', componentData.code);
  formData.append('previewImage', previewFile);
  formData.append('category', componentData.category);
  formData.append('tags', JSON.stringify(componentData.tags));
  formData.append('framework', componentData.framework);
  formData.append('language', componentData.language);
  formData.append('styling', componentData.styling);
  formData.append('dependencies', JSON.stringify(componentData.dependencies));
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
  return result;
};
```

## 🎨 Component Categories

- button, card, form, input, navigation, modal, table, layout
- chart, authentication, dashboard, ecommerce, landing-page
- animation, icon, badge, alert, dropdown, tooltip, slider
- progress, skeleton, other

## 🚀 Framework Support

- react, next, vue, angular, svelte, vanilla

## 💅 Styling Frameworks

- tailwind, css, scss, styled-components, emotion, css-modules

## 📦 Component Sources

- custom (user-created)
- bootstrap, flowbite, radix, shadcn
- material-ui, chakra, ant-design

## 🔄 Next Steps

1. **Get Firebase Credentials**: Get your Firebase config from Firebase Console
2. **Update .env.local**: Add all Firebase credentials
3. **Initialize Firestore Indexes**: Firebase will prompt you to create indexes when needed
4. **Build UI Components**: Create upload forms, component cards, etc.
5. **Integrate Library Components**: Add data for Bootstrap, Flowbite, Radix, etc.
6. **Add Search**: Integrate Algolia for better search (optional)
7. **Deploy**: Deploy to Vercel or your preferred platform

## 📝 Notes

- All image uploads go to Firebase Storage
- Components can be public or private
- Users can follow each other and see activity feeds
- Statistics tracking for views, likes, and copies
- Support for existing component libraries
- Real-time updates possible with Firestore subscriptions

## 🐛 Troubleshooting

1. **Firebase Connection Issues**: Verify .env.local credentials
2. **Upload Failures**: Check Firebase Storage rules
3. **Permission Errors**: Review Firestore security rules
4. **Authentication Issues**: Enable auth providers in Firebase Console

## 📞 Support

For issues or questions, check:
- Firebase Documentation: https://firebase.google.com/docs
- Next.js Documentation: https://nextjs.org/docs
- TypeScript Documentation: https://www.typescriptlang.org/docs

Your ComponentVault backend system is ready! 🎉
