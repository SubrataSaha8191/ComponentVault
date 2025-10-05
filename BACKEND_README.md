# 🎨 ComponentVault - Complete Backend System

> A comprehensive, production-ready backend system for uploading, sharing, and managing UI components with Firebase integration.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Latest-orange)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

## 🌟 Features

### 👤 User Management
- ✅ Email/Password authentication
- ✅ Google OAuth integration
- ✅ GitHub OAuth integration
- ✅ User profiles with avatars
- ✅ Follow/unfollow system
- ✅ Activity feed tracking

### 📦 Component System
- ✅ Upload custom components with preview images
- ✅ 20+ component categories
- ✅ Multi-framework support (React, Next.js, Vue, Angular, Svelte, Vanilla)
- ✅ Code storage with Monaco Editor support
- ✅ Usage instructions and install commands
- ✅ Public/private visibility
- ✅ Track views, likes, and copies

### 📚 Library Integration
- ✅ Bootstrap components
- ✅ Flowbite components
- ✅ Radix UI components
- ✅ shadcn/ui components
- ✅ Material UI components
- ✅ Chakra UI components
- ✅ Ant Design components

### 🗂️ Collections & Favorites
- ✅ Create custom collections
- ✅ Add components to collections
- ✅ Like/unlike components
- ✅ Public/private collections
- ✅ Collection cover images

### 💬 Social Features
- ✅ Comment system
- ✅ Reply to comments
- ✅ Like comments
- ✅ Activity feed
- ✅ User profiles

### 🔍 Search & Discovery
- ✅ Full-text search
- ✅ Filter by category, framework, source
- ✅ Sort by likes, views, date
- ✅ Tag-based filtering

## 📂 Project Structure

```
ComponentVault/
├── lib/firebase/              # Firebase configuration & operations
│   ├── config.ts             # Client-side Firebase setup
│   ├── admin.ts              # Server-side Firebase Admin
│   ├── types.ts              # TypeScript type definitions
│   ├── firestore.ts          # Database operations
│   ├── storage.ts            # File storage operations
│   └── auth.ts               # Authentication operations
│
├── app/api/                  # API Routes (Next.js)
│   ├── components/           # Component CRUD
│   ├── collections/          # Collection management
│   ├── favorites/            # Favorites system
│   ├── comments/             # Comment system
│   ├── follows/              # Follow system
│   ├── users/                # User profiles
│   ├── activities/           # Activity feed
│   └── search/               # Search functionality
│
├── hooks/                    # React Hooks
│   ├── use-auth.ts           # Authentication hook
│   ├── use-components.ts     # Component data hooks
│   └── use-collections.ts    # Collection hooks
│
├── components/               # React Components
│   └── upload-component-form.tsx  # Upload form example
│
├── .env.local               # Environment variables
│
└── Documentation/
    ├── BACKEND_DOCUMENTATION.md      # Complete API reference
    ├── SETUP_GUIDE.md                # Quick setup guide
    ├── FIREBASE_SECURITY_RULES.md    # Security rules
    ├── SYSTEM_ARCHITECTURE.md        # Architecture diagram
    └── BACKEND_SYSTEM_SUMMARY.md     # System overview
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your **ComponentVault** project
3. Get your Firebase configuration
4. Update `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ComponentVault
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

FIREBASE_ADMIN_PROJECT_ID=ComponentVault
FIREBASE_ADMIN_CLIENT_EMAIL=your_client_email
FIREBASE_ADMIN_PRIVATE_KEY=your_private_key
```

### 3. Enable Firebase Services

- **Authentication**: Enable Email/Password, Google, GitHub
- **Firestore Database**: Create database and apply security rules
- **Storage**: Enable storage and apply security rules

### 4. Run Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📚 API Documentation

### Components

```typescript
// Get components
GET /api/components?category=button&framework=react&limit=20

// Upload component
POST /api/components
Content-Type: multipart/form-data

// Update component
PUT /api/components/[id]

// Delete component
DELETE /api/components/[id]?authorId=xxx

// Track copy
POST /api/components/[id]/copy
```

### Favorites

```typescript
// Get user favorites
GET /api/favorites?userId=xxx

// Add to favorites
POST /api/favorites
Body: { userId, componentId }

// Remove from favorites
DELETE /api/favorites?userId=xxx&componentId=xxx
```

### Collections

```typescript
// Get user collections
GET /api/collections?userId=xxx

// Create collection
POST /api/collections
Body: { name, description, userId, userName, isPublic }

// Add component to collection
POST /api/collections/[id]
Body: { componentId }
```

For complete API documentation, see [BACKEND_DOCUMENTATION.md](./BACKEND_DOCUMENTATION.md)

## 🎣 React Hooks Usage

### Authentication

```typescript
import { useAuth } from '@/hooks/use-auth';

function MyComponent() {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please sign in</div>;
  
  return <div>Welcome, {user?.displayName}!</div>;
}
```

### Fetch Components

```typescript
import { useComponents } from '@/hooks/use-components';

function ComponentList() {
  const { components, loading, error } = useComponents({
    category: 'button',
    framework: 'react',
    limit: 20,
    orderBy: 'likes',
    order: 'desc'
  });
  
  return (
    <div>
      {components.map(comp => (
        <ComponentCard key={comp.id} component={comp} />
      ))}
    </div>
  );
}
```

### User Collections

```typescript
import { useCollections } from '@/hooks/use-collections';

function UserCollections({ userId }: { userId: string }) {
  const { collections, loading, refresh } = useCollections(userId);
  
  return (
    <div>
      {collections.map(collection => (
        <CollectionCard key={collection.id} collection={collection} />
      ))}
    </div>
  );
}
```

## 🔐 Security

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Components: Public read, owner write
    match /components/{componentId} {
      allow read: if resource.data.isPublic == true || 
                    request.auth.uid == resource.data.authorId;
      allow write: if request.auth != null && 
                     request.auth.uid == resource.data.authorId;
    }
    
    // More rules in FIREBASE_SECURITY_RULES.md
  }
}
```

See [FIREBASE_SECURITY_RULES.md](./FIREBASE_SECURITY_RULES.md) for complete rules.

## 📊 Database Schema

### Collections

1. **users** - User profiles and statistics
2. **components** - All components (user-uploaded & library)
3. **collections** - User-created collections
4. **favorites** - Liked components
5. **comments** - Component comments
6. **follows** - User relationships
7. **activities** - User activity feed
8. **stats** - Component analytics
9. **libraryComponents** - External library data

### Component Schema

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
  likes: number;
  views: number;
  copies: number;
  isPublic: boolean;
  sourceType: 'custom' | 'bootstrap' | 'flowbite' | etc.;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🎨 Component Categories

- button, card, form, input
- navigation, modal, table, layout
- chart, authentication, dashboard
- ecommerce, landing-page, animation
- icon, badge, alert, dropdown
- tooltip, slider, progress, skeleton
- And more...

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes
- **Database**: Firebase Firestore
- **Storage**: Firebase Cloud Storage
- **Authentication**: Firebase Auth
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (recommended)

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [BACKEND_DOCUMENTATION.md](./BACKEND_DOCUMENTATION.md) | Complete API reference and guides |
| [SETUP_GUIDE.md](./SETUP_GUIDE.md) | Quick setup instructions |
| [FIREBASE_SECURITY_RULES.md](./FIREBASE_SECURITY_RULES.md) | Security rules and best practices |
| [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) | Visual system architecture |
| [BACKEND_SYSTEM_SUMMARY.md](./BACKEND_SYSTEM_SUMMARY.md) | System overview |

## 🔄 Workflow Example

### Upload Component Flow

1. User fills out the upload form
2. Form submits to `POST /api/components`
3. API uploads images to Firebase Storage
4. API creates component document in Firestore
5. Updates user's component count
6. Creates activity entry
7. Returns success with component ID

### Search Flow

1. User enters search query
2. Frontend calls `GET /api/search?q=button`
3. API queries Firestore
4. Filters results on server
5. Returns matching components
6. Frontend displays results

## 🎯 Next Steps

- [ ] Complete Firebase configuration
- [ ] Build UI components for:
  - [ ] Component upload page
  - [ ] Component browse/grid
  - [ ] Component detail page
  - [ ] User dashboard
  - [ ] Collections page
  - [ ] User profile
- [ ] Seed library components data
- [ ] Integrate Algolia for advanced search (optional)
- [ ] Add image optimization
- [ ] Implement infinite scroll
- [ ] Deploy to production

## 🤝 Contributing

This is a complete backend system ready for implementation. Customize as needed for your specific requirements.

## 📝 License

This backend system is provided as-is for the ComponentVault project.

## 🆘 Support

For questions or issues:
1. Check the documentation files
2. Review Firebase documentation
3. Check Next.js documentation

## 🎉 Credits

Built with:
- Next.js by Vercel
- Firebase by Google
- TypeScript by Microsoft
- React by Meta

---

**Status**: ✅ Backend System Complete and Ready!

**Last Updated**: October 5, 2025

Made with ❤️ for ComponentVault
