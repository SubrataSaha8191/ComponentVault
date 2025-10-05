# Firebase Security Rules for ComponentVault

## 📋 Firestore Security Rules

Copy and paste these rules into your Firebase Console → Firestore Database → Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isValidString(text, minLen, maxLen) {
      return text is string && 
             text.size() >= minLen && 
             text.size() <= maxLen;
    }
    
    // Users collection
    match /users/{userId} {
      // Anyone can read public user profiles
      allow read: if true;
      
      // Users can only create and update their own profile
      allow create: if isOwner(userId) && 
                      isValidString(request.resource.data.displayName, 1, 100) &&
                      isValidString(request.resource.data.email, 5, 100);
      
      allow update: if isOwner(userId);
      
      // Users can delete their own profile
      allow delete: if isOwner(userId);
    }
    
    // Components collection
    match /components/{componentId} {
      // Read: public components or own components
      allow read: if resource.data.isPublic == true || 
                    isOwner(resource.data.authorId);
      
      // Create: authenticated users only
      allow create: if isAuthenticated() && 
                      isValidString(request.resource.data.title, 3, 200) &&
                      isValidString(request.resource.data.description, 10, 2000) &&
                      isValidString(request.resource.data.code, 10, 50000) &&
                      request.resource.data.authorId == request.auth.uid;
      
      // Update: only component author
      allow update: if isOwner(resource.data.authorId);
      
      // Delete: only component author
      allow delete: if isOwner(resource.data.authorId);
    }
    
    // Collections
    match /collections/{collectionId} {
      // Read: public collections or own collections
      allow read: if resource.data.isPublic == true || 
                    isOwner(resource.data.userId);
      
      // Create: authenticated users only
      allow create: if isAuthenticated() && 
                      isValidString(request.resource.data.name, 1, 100) &&
                      request.resource.data.userId == request.auth.uid;
      
      // Update: only collection owner
      allow update: if isOwner(resource.data.userId);
      
      // Delete: only collection owner
      allow delete: if isOwner(resource.data.userId);
    }
    
    // Favorites
    match /favorites/{favoriteId} {
      // Read: only own favorites
      allow read: if isOwner(resource.data.userId);
      
      // Create: authenticated users can add to their favorites
      allow create: if isAuthenticated() && 
                      request.resource.data.userId == request.auth.uid;
      
      // Delete: users can remove their own favorites
      allow delete: if isOwner(resource.data.userId);
      
      // Update: not allowed
      allow update: if false;
    }
    
    // Comments
    match /comments/{commentId} {
      // Anyone can read comments
      allow read: if true;
      
      // Authenticated users can create comments
      allow create: if isAuthenticated() && 
                      isValidString(request.resource.data.content, 1, 2000) &&
                      request.resource.data.userId == request.auth.uid;
      
      // Users can update their own comments
      allow update: if isOwner(resource.data.userId);
      
      // Users can delete their own comments
      allow delete: if isOwner(resource.data.userId);
    }
    
    // Follows
    match /follows/{followId} {
      // Anyone can read follows
      allow read: if true;
      
      // Users can follow others
      allow create: if isAuthenticated() && 
                      request.resource.data.followerId == request.auth.uid;
      
      // Users can unfollow (delete their own follows)
      allow delete: if isOwner(resource.data.followerId);
      
      // Update not allowed
      allow update: if false;
    }
    
    // Activities
    match /activities/{activityId} {
      // Anyone can read activities
      allow read: if true;
      
      // System creates activities (via server-side)
      allow create: if isAuthenticated();
      
      // Users can delete their own activities
      allow delete: if isOwner(resource.data.userId);
      
      // Update not allowed
      allow update: if false;
    }
    
    // Stats
    match /stats/{statId} {
      // Anyone can read stats
      allow read: if true;
      
      // Only server can write stats
      allow write: if false;
    }
    
    // Library Components (Read-only for users)
    match /libraryComponents/{libraryId} {
      // Anyone can read library components
      allow read: if true;
      
      // Only admins can write (do via Firebase Console or Admin SDK)
      allow write: if false;
    }
  }
}
```

## 🗄️ Storage Security Rules

Copy and paste these rules into your Firebase Console → Storage → Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Helper function to check authentication
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check file size (max 5MB)
    function isValidSize() {
      return request.resource.size < 5 * 1024 * 1024;
    }
    
    // Helper function to check if file is an image
    function isImage() {
      return request.resource.contentType.matches('image/.*');
    }
    
    // Component preview images
    match /components/previews/{fileName} {
      // Anyone can read
      allow read: if true;
      
      // Authenticated users can upload images
      allow write: if isAuthenticated() && 
                     isImage() && 
                     isValidSize();
      
      // Only the uploader can delete
      allow delete: if isAuthenticated();
    }
    
    // Component thumbnail images
    match /components/thumbnails/{fileName} {
      // Anyone can read
      allow read: if true;
      
      // Authenticated users can upload images
      allow write: if isAuthenticated() && 
                     isImage() && 
                     isValidSize();
      
      // Only the uploader can delete
      allow delete: if isAuthenticated();
    }
    
    // User avatars
    match /users/avatars/{userId}/{fileName} {
      // Anyone can read avatars
      allow read: if true;
      
      // Users can upload their own avatar
      allow write: if isAuthenticated() && 
                     request.auth.uid == userId && 
                     isImage() && 
                     isValidSize();
      
      // Users can delete their own avatar
      allow delete: if isAuthenticated() && 
                      request.auth.uid == userId;
    }
    
    // Collection cover images
    match /collections/covers/{fileName} {
      // Anyone can read
      allow read: if true;
      
      // Authenticated users can upload collection covers
      allow write: if isAuthenticated() && 
                     isImage() && 
                     isValidSize();
      
      // Only the uploader can delete
      allow delete: if isAuthenticated();
    }
  }
}
```

## 🔐 Security Best Practices

### 1. Always Validate on Client AND Server
Even with security rules, validate data in your API routes:

```typescript
// Example server-side validation
if (!title || title.length < 3 || title.length > 200) {
  return NextResponse.json({ error: 'Invalid title' }, { status: 400 });
}
```

### 2. Sanitize User Input
```typescript
import DOMPurify from 'isomorphic-dompurify';

const sanitizedContent = DOMPurify.sanitize(userContent);
```

### 3. Rate Limiting
Consider adding rate limiting to your API routes:

```typescript
// Example with simple in-memory rate limiting
const rateLimiter = new Map();

function checkRateLimit(userId: string, maxRequests = 10) {
  const now = Date.now();
  const userRequests = rateLimiter.get(userId) || [];
  const recentRequests = userRequests.filter(
    (time: number) => now - time < 60000
  );
  
  if (recentRequests.length >= maxRequests) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimiter.set(userId, recentRequests);
  return true;
}
```

### 4. Environment Variables
Never commit sensitive keys:

```env
# ❌ DON'T commit this file
.env.local

# ✅ DO use environment variables
FIREBASE_ADMIN_PRIVATE_KEY=...
```

### 5. CORS Configuration
```typescript
// next.config.mjs
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: process.env.NEXT_PUBLIC_APP_URL },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
        ],
      },
    ];
  },
};
```

## 📊 Firebase Indexes

You may need to create indexes for complex queries. Firebase will prompt you with a link when needed.

Common indexes you might need:

### Components Collection
```
Collection: components
Fields indexed:
- isPublic (Ascending) + createdAt (Descending)
- isPublic (Ascending) + likes (Descending)
- isPublic (Ascending) + views (Descending)
- category (Ascending) + createdAt (Descending)
- authorId (Ascending) + createdAt (Descending)
- framework (Ascending) + createdAt (Descending)
```

### Favorites Collection
```
Collection: favorites
Fields indexed:
- userId (Ascending) + createdAt (Descending)
```

### Comments Collection
```
Collection: comments
Fields indexed:
- componentId (Ascending) + createdAt (Descending)
```

### Follows Collection
```
Collection: follows
Fields indexed:
- followerId (Ascending) + createdAt (Descending)
- followingId (Ascending) + createdAt (Descending)
```

## 🛡️ Additional Security Recommendations

### 1. Enable App Check (Optional but Recommended)
Protect your Firebase resources from abuse:

1. Go to Firebase Console → Build → App Check
2. Enable App Check for your app
3. Add reCAPTCHA v3 for web

### 2. Set Up Budget Alerts
Prevent unexpected costs:

1. Go to Firebase Console → Usage and billing
2. Set up budget alerts
3. Set daily/monthly limits

### 3. Enable Firestore Backup (Paid Feature)
For production apps:

1. Go to Firestore → Backups
2. Schedule automated backups

### 4. Monitor Security Rules
Check Firebase Console → Firestore → Rules regularly for:
- Denied reads/writes
- Security violations
- Unusual patterns

### 5. Implement Audit Logging
Log important actions:

```typescript
await adminDb.collection('audit_logs').add({
  action: 'component_deleted',
  userId: user.uid,
  resourceId: componentId,
  timestamp: admin.firestore.FieldValue.serverTimestamp(),
  metadata: { /* additional info */ }
});
```

## 🔍 Testing Security Rules

### Using Firebase Emulator
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize emulators
firebase init emulators

# Start emulators
firebase emulators:start
```

### Testing Rules in Console
1. Go to Firestore → Rules
2. Click "Rules playground"
3. Test read/write operations

## 🚨 Common Security Issues to Avoid

### ❌ Don't Allow Unrestricted Writes
```javascript
// BAD
allow write: if true;

// GOOD
allow write: if isAuthenticated() && isOwner(resource.data.authorId);
```

### ❌ Don't Trust Client-Side Validation Only
```javascript
// BAD - Only validating on client
if (title.length > 3) {
  await createComponent(data);
}

// GOOD - Validate on both client and server
if (title.length > 3) {
  await createComponent(data); // Server validates again
}
```

### ❌ Don't Expose Sensitive Data
```javascript
// BAD
match /users/{userId}/privateData/{doc} {
  allow read: if true; // Anyone can read private data!
}

// GOOD
match /users/{userId}/privateData/{doc} {
  allow read: if isOwner(userId);
}
```

### ❌ Don't Allow Direct Database Writes from Client
Always use your API routes for complex operations that need validation.

## 📚 Resources

- [Firestore Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)
- [Storage Security Rules Guide](https://firebase.google.com/docs/storage/security)
- [Firebase Security Checklist](https://firebase.google.com/support/guides/security-checklist)
- [Firebase App Check](https://firebase.google.com/docs/app-check)

---

**Remember**: Security rules are your first line of defense. Test them thoroughly before deploying to production!
