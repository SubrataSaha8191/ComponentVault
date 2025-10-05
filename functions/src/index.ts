import { onDocumentCreated, onDocumentUpdated, onDocumentDeleted } from "firebase-functions/v2/firestore";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { algoliasearch } from "algoliasearch";

// Initialize Firebase Admin
admin.initializeApp();

// Initialize Algolia
const algoliaClient = algoliasearch(
  process.env.ALGOLIA_APP_ID || "",
  process.env.ALGOLIA_ADMIN_KEY || ""
);

// Algolia indices
const COMPONENTS_INDEX = "components";
const USERS_INDEX = "users";
const COLLECTIONS_INDEX = "collections";

/**
 * Sync component data to Algolia when created
 */
export const onComponentCreate = onDocumentCreated("components/{componentId}", async (event) => {
  const component = event.data?.data();
  if (!component) return;
  
  const componentId = event.params.componentId as string;

  console.log("New component created:", componentId);

  try {
    // Format data for Algolia
    const algoliaObject = {
      objectID: componentId,
      name: component.name || "",
      description: component.description || "",
      category: component.category || "",
      tags: component.tags || [],
      framework: component.framework || "react",
      frameworks: component.frameworks || [],
      downloads: component.downloads || 0,
      likes: component.likes || 0,
      favorites: component.favorites || 0,
      views: component.views || 0,
      author: component.author || {},
      authorId: component.authorId || "",
      authorName: component.authorName || "",
      thumbnail: component.thumbnail || "",
      accessibilityScore: component.accessibilityScore || 0,
      isPremium: component.isPremium || false,
      isPublished: component.isPublished !== false,
      createdAt: component.createdAt?._seconds || Date.now() / 1000,
      updatedAt: component.updatedAt?._seconds || Date.now() / 1000,
      _geoloc: component._geoloc || undefined,
    };

    // Save to Algolia
    await algoliaClient.saveObject({
      indexName: COMPONENTS_INDEX,
      body: algoliaObject,
    });

    console.log("Component indexed in Algolia:", componentId);
  } catch (error) {
    console.error("Error indexing component in Algolia:", error);
    throw error;
  }
});

/**
 * Sync component data to Algolia when updated
 */
export const onComponentUpdate = onDocumentUpdated("components/{componentId}", async (event) => {
  const newData = event.data?.after.data();
  if (!newData) return;
  
  const componentId = event.params.componentId as string;

  console.log("Component updated:", componentId);

  try {
    const algoliaObject = {
      objectID: componentId,
      name: newData.name || "",
      description: newData.description || "",
      category: newData.category || "",
      tags: newData.tags || [],
      framework: newData.framework || "react",
      frameworks: newData.frameworks || [],
      downloads: newData.downloads || 0,
      likes: newData.likes || 0,
      favorites: newData.favorites || 0,
      views: newData.views || 0,
      author: newData.author || {},
      authorId: newData.authorId || "",
      authorName: newData.authorName || "",
      thumbnail: newData.thumbnail || "",
      accessibilityScore: newData.accessibilityScore || 0,
      isPremium: newData.isPremium || false,
      isPublished: newData.isPublished !== false,
      createdAt: newData.createdAt?._seconds || Date.now() / 1000,
      updatedAt: newData.updatedAt?._seconds || Date.now() / 1000,
      _geoloc: newData._geoloc || undefined,
    };

    await algoliaClient.saveObject({
      indexName: COMPONENTS_INDEX,
      body: algoliaObject,
    });

    console.log("Component updated in Algolia:", componentId);
  } catch (error) {
    console.error("Error updating component in Algolia:", error);
    throw error;
  }
});

/**
 * Remove component from Algolia when deleted
 */
export const onComponentDelete = onDocumentDeleted("components/{componentId}", async (event) => {
  const componentId = event.params.componentId as string;

  console.log("Component deleted:", componentId);

  try {
    await algoliaClient.deleteObject({
      indexName: COMPONENTS_INDEX,
      objectID: componentId,
    });

    console.log("Component removed from Algolia:", componentId);
  } catch (error) {
    console.error("Error removing component from Algolia:", error);
    throw error;
  }
});

/**
 * Sync user data to Algolia when created
 */
export const onUserCreate = onDocumentCreated("users/{userId}", async (event) => {
  const user = event.data?.data();
  if (!user) return;
  
  const userId = event.params.userId as string;

  console.log("New user created:", userId);

  try {
    const algoliaObject = {
      objectID: userId,
      displayName: user.displayName || "",
      username: user.username || "",
      email: user.email || "",
      bio: user.bio || "",
      location: user.location || "",
      website: user.website || "",
      avatar: user.avatar || user.photoURL || "",
      componentsCount: user.componentsCount || 0,
      followersCount: user.followersCount || 0,
      followingCount: user.followingCount || 0,
      isVerified: user.isVerified || false,
      createdAt: user.createdAt?._seconds || Date.now() / 1000,
    };

    await algoliaClient.saveObject({
      indexName: USERS_INDEX,
      body: algoliaObject,
    });

    console.log("User indexed in Algolia:", userId);
  } catch (error) {
    console.error("Error indexing user in Algolia:", error);
    throw error;
  }
});

/**
 * Sync user data to Algolia when updated
 */
export const onUserUpdate = onDocumentUpdated("users/{userId}", async (event) => {
  const newData = event.data?.after.data();
  if (!newData) return;
  
  const userId = event.params.userId as string;

  console.log("User updated:", userId);

  try {
    const algoliaObject = {
      objectID: userId,
      displayName: newData.displayName || "",
      username: newData.username || "",
      email: newData.email || "",
      bio: newData.bio || "",
      location: newData.location || "",
      website: newData.website || "",
      avatar: newData.avatar || newData.photoURL || "",
      componentsCount: newData.componentsCount || 0,
      followersCount: newData.followersCount || 0,
      followingCount: newData.followingCount || 0,
      isVerified: newData.isVerified || false,
      createdAt: newData.createdAt?._seconds || Date.now() / 1000,
    };

    await algoliaClient.saveObject({
      indexName: USERS_INDEX,
      body: algoliaObject,
    });

    console.log("User updated in Algolia:", userId);
  } catch (error) {
    console.error("Error updating user in Algolia:", error);
    throw error;
  }
});

/**
 * Remove user from Algolia when deleted
 */
export const onUserDelete = onDocumentDeleted("users/{userId}", async (event) => {
  const userId = event.params.userId as string;

  console.log("User deleted:", userId);

  try {
    await algoliaClient.deleteObject({
      indexName: USERS_INDEX,
      objectID: userId,
    });

    console.log("User removed from Algolia:", userId);
  } catch (error) {
    console.error("Error removing user from Algolia:", error);
    throw error;
  }
});

/**
 * Sync collection data to Algolia when created
 */
export const onCollectionCreate = onDocumentCreated("collections/{collectionId}", async (event) => {
  const collection = event.data?.data();
  if (!collection) return;
  
  const collectionId = event.params.collectionId as string;

  console.log("New collection created:", collectionId);

  try {
    const algoliaObject = {
      objectID: collectionId,
      name: collection.name || "",
      description: collection.description || "",
      tags: collection.tags || [],
      componentIds: collection.componentIds || [],
      componentsCount: collection.componentsCount || 0,
      authorId: collection.authorId || "",
      authorName: collection.authorName || "",
      thumbnail: collection.thumbnail || "",
      isPublic: collection.isPublic !== false,
      likes: collection.likes || 0,
      views: collection.views || 0,
      createdAt: collection.createdAt?._seconds || Date.now() / 1000,
      updatedAt: collection.updatedAt?._seconds || Date.now() / 1000,
    };

    await algoliaClient.saveObject({
      indexName: COLLECTIONS_INDEX,
      body: algoliaObject,
    });

    console.log("Collection indexed in Algolia:", collectionId);
  } catch (error) {
    console.error("Error indexing collection in Algolia:", error);
    throw error;
  }
});

/**
 * Sync collection data to Algolia when updated
 */
export const onCollectionUpdate = onDocumentUpdated("collections/{collectionId}", async (event) => {
  const newData = event.data?.after.data();
  if (!newData) return;
  
  const collectionId = event.params.collectionId as string;

  console.log("Collection updated:", collectionId);

  try {
    const algoliaObject = {
      objectID: collectionId,
      name: newData.name || "",
      description: newData.description || "",
      tags: newData.tags || [],
      componentIds: newData.componentIds || [],
      componentsCount: newData.componentsCount || 0,
      authorId: newData.authorId || "",
      authorName: newData.authorName || "",
      thumbnail: newData.thumbnail || "",
      isPublic: newData.isPublic !== false,
      likes: newData.likes || 0,
      views: newData.views || 0,
      createdAt: newData.createdAt?._seconds || Date.now() / 1000,
      updatedAt: newData.updatedAt?._seconds || Date.now() / 1000,
    };

    await algoliaClient.saveObject({
      indexName: COLLECTIONS_INDEX,
      body: algoliaObject,
    });

    console.log("Collection updated in Algolia:", collectionId);
  } catch (error) {
    console.error("Error updating collection in Algolia:", error);
    throw error;
  }
});

/**
 * Remove collection from Algolia when deleted
 */
export const onCollectionDelete = onDocumentDeleted("collections/{collectionId}", async (event) => {
  const collectionId = event.params.collectionId as string;

  console.log("Collection deleted:", collectionId);

  try {
    await algoliaClient.deleteObject({
      indexName: COLLECTIONS_INDEX,
      objectID: collectionId,
    });

    console.log("Collection removed from Algolia:", collectionId);
  } catch (error) {
    console.error("Error removing collection from Algolia:", error);
    throw error;
  }
});

/**
 * Bulk sync existing Firestore data to Algolia (HTTP callable function)
 * This can be triggered manually to sync all existing data
 */
export const syncAllToAlgolia = onCall(async (request) => {
  // Check if user is authenticated
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "User must be authenticated"
    );
  }

  console.log("Starting bulk sync to Algolia...");

  try {
    const results = {
      components: 0,
      users: 0,
      collections: 0,
    };

    // Sync components
    const componentsSnapshot = await admin.firestore().collection("components").get();
    const componentsObjects = componentsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        objectID: doc.id,
        name: data.name || "",
        description: data.description || "",
        category: data.category || "",
        tags: data.tags || [],
        framework: data.framework || "react",
        frameworks: data.frameworks || [],
        downloads: data.downloads || 0,
        likes: data.likes || 0,
        favorites: data.favorites || 0,
        views: data.views || 0,
        author: data.author || {},
        authorId: data.authorId || "",
        authorName: data.authorName || "",
        thumbnail: data.thumbnail || "",
        accessibilityScore: data.accessibilityScore || 0,
        isPremium: data.isPremium || false,
        isPublished: data.isPublished !== false,
        createdAt: data.createdAt?._seconds || Date.now() / 1000,
        updatedAt: data.updatedAt?._seconds || Date.now() / 1000,
      };
    });

    if (componentsObjects.length > 0) {
      await algoliaClient.saveObjects({
        indexName: COMPONENTS_INDEX,
        objects: componentsObjects,
      });
      results.components = componentsObjects.length;
    }

    // Sync users
    const usersSnapshot = await admin.firestore().collection("users").get();
    const usersObjects = usersSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        objectID: doc.id,
        displayName: data.displayName || "",
        username: data.username || "",
        email: data.email || "",
        bio: data.bio || "",
        location: data.location || "",
        website: data.website || "",
        avatar: data.avatar || data.photoURL || "",
        componentsCount: data.componentsCount || 0,
        followersCount: data.followersCount || 0,
        followingCount: data.followingCount || 0,
        isVerified: data.isVerified || false,
        createdAt: data.createdAt?._seconds || Date.now() / 1000,
      };
    });

    if (usersObjects.length > 0) {
      await algoliaClient.saveObjects({
        indexName: USERS_INDEX,
        objects: usersObjects,
      });
      results.users = usersObjects.length;
    }

    // Sync collections
    const collectionsSnapshot = await admin.firestore().collection("collections").get();
    const collectionsObjects = collectionsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        objectID: doc.id,
        name: data.name || "",
        description: data.description || "",
        tags: data.tags || [],
        componentIds: data.componentIds || [],
        componentsCount: data.componentsCount || 0,
        authorId: data.authorId || "",
        authorName: data.authorName || "",
        thumbnail: data.thumbnail || "",
        isPublic: data.isPublic !== false,
        likes: data.likes || 0,
        views: data.views || 0,
        createdAt: data.createdAt?._seconds || Date.now() / 1000,
        updatedAt: data.updatedAt?._seconds || Date.now() / 1000,
      };
    });

    if (collectionsObjects.length > 0) {
      await algoliaClient.saveObjects({
        indexName: COLLECTIONS_INDEX,
        objects: collectionsObjects,
      });
      results.collections = collectionsObjects.length;
    }

    console.log("Bulk sync completed:", results);
    return {
      success: true,
      message: "Successfully synced all data to Algolia",
      results,
    };
  } catch (error) {
    console.error("Error during bulk sync:", error);
    throw new HttpsError("internal", "Failed to sync data to Algolia");
  }
});
