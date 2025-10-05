/**
 * Script to manually sync all Firestore data to Algolia
 * Use this for initial setup or to re-sync all data
 */

import { algoliasearch } from 'algoliasearch';
import * as admin from 'firebase-admin';

// Load environment variables
const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID!;
const ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY!;

// Initialize Firebase Admin
const serviceAccount = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID!,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')!,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

// Initialize Algolia
const algoliaClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);

const COMPONENTS_INDEX = 'components';
const USERS_INDEX = 'users';
const COLLECTIONS_INDEX = 'collections';

async function syncFirestoreToAlgolia() {
  console.log('🚀 Starting Firestore to Algolia sync...\n');

  try {
    const db = admin.firestore();
    const results = {
      components: 0,
      users: 0,
      collections: 0,
    };

    // Sync Components
    console.log('📦 Syncing components...');
    const componentsSnapshot = await db.collection('components').get();
    
    if (!componentsSnapshot.empty) {
      const componentsObjects = componentsSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          objectID: doc.id,
          name: data.name || '',
          description: data.description || '',
          category: data.category || '',
          tags: data.tags || [],
          framework: data.framework || 'react',
          frameworks: data.frameworks || [],
          downloads: data.downloads || 0,
          likes: data.likes || 0,
          favorites: data.favorites || 0,
          views: data.views || 0,
          author: data.author || {},
          authorId: data.authorId || '',
          authorName: data.authorName || '',
          thumbnail: data.thumbnail || '',
          accessibilityScore: data.accessibilityScore || 0,
          isPremium: data.isPremium || false,
          isPublished: data.isPublished !== false,
          createdAt: data.createdAt?.toMillis() || Date.now(),
          updatedAt: data.updatedAt?.toMillis() || Date.now(),
        };
      });

      await algoliaClient.saveObjects({
        indexName: COMPONENTS_INDEX,
        objects: componentsObjects,
      });
      
      results.components = componentsObjects.length;
      console.log(`✅ Synced ${results.components} components\n`);
    } else {
      console.log('⚠️  No components found\n');
    }

    // Sync Users
    console.log('👥 Syncing users...');
    const usersSnapshot = await db.collection('users').get();
    
    if (!usersSnapshot.empty) {
      const usersObjects = usersSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          objectID: doc.id,
          displayName: data.displayName || '',
          username: data.username || '',
          email: data.email || '',
          bio: data.bio || '',
          location: data.location || '',
          website: data.website || '',
          avatar: data.avatar || data.photoURL || '',
          componentsCount: data.componentsCount || 0,
          followersCount: data.followersCount || 0,
          followingCount: data.followingCount || 0,
          isVerified: data.isVerified || false,
          createdAt: data.createdAt?.toMillis() || Date.now(),
        };
      });

      await algoliaClient.saveObjects({
        indexName: USERS_INDEX,
        objects: usersObjects,
      });
      
      results.users = usersObjects.length;
      console.log(`✅ Synced ${results.users} users\n`);
    } else {
      console.log('⚠️  No users found\n');
    }

    // Sync Collections
    console.log('📚 Syncing collections...');
    const collectionsSnapshot = await db.collection('collections').get();
    
    if (!collectionsSnapshot.empty) {
      const collectionsObjects = collectionsSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          objectID: doc.id,
          name: data.name || '',
          description: data.description || '',
          tags: data.tags || [],
          componentIds: data.componentIds || [],
          componentsCount: data.componentsCount || 0,
          authorId: data.authorId || '',
          authorName: data.authorName || '',
          thumbnail: data.thumbnail || '',
          isPublic: data.isPublic !== false,
          likes: data.likes || 0,
          views: data.views || 0,
          createdAt: data.createdAt?.toMillis() || Date.now(),
          updatedAt: data.updatedAt?.toMillis() || Date.now(),
        };
      });

      await algoliaClient.saveObjects({
        indexName: COLLECTIONS_INDEX,
        objects: collectionsObjects,
      });
      
      results.collections = collectionsObjects.length;
      console.log(`✅ Synced ${results.collections} collections\n`);
    } else {
      console.log('⚠️  No collections found\n');
    }

    console.log('🎉 Sync completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Components: ${results.components}`);
    console.log(`   Users: ${results.users}`);
    console.log(`   Collections: ${results.collections}`);
    console.log(`   Total: ${results.components + results.users + results.collections} documents\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during sync:', error);
    process.exit(1);
  }
}

// Run the sync
syncFirestoreToAlgolia();
