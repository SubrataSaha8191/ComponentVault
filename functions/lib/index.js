"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncAllToAlgolia = exports.onCollectionDelete = exports.onCollectionUpdate = exports.onCollectionCreate = exports.onUserDelete = exports.onUserUpdate = exports.onUserCreate = exports.onComponentDelete = exports.onComponentUpdate = exports.onComponentCreate = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
const algoliasearch_1 = require("algoliasearch");
// Initialize Firebase Admin
admin.initializeApp();
// Initialize Algolia
const algoliaClient = (0, algoliasearch_1.algoliasearch)(process.env.ALGOLIA_APP_ID || "", process.env.ALGOLIA_ADMIN_KEY || "");
// Algolia indices
const COMPONENTS_INDEX = "components";
const USERS_INDEX = "users";
const COLLECTIONS_INDEX = "collections";
/**
 * Sync component data to Algolia when created
 */
exports.onComponentCreate = (0, firestore_1.onDocumentCreated)("components/{componentId}", async (event) => {
    var _a, _b, _c;
    const component = (_a = event.data) === null || _a === void 0 ? void 0 : _a.data();
    if (!component)
        return;
    const componentId = event.params.componentId;
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
            createdAt: ((_b = component.createdAt) === null || _b === void 0 ? void 0 : _b._seconds) || Date.now() / 1000,
            updatedAt: ((_c = component.updatedAt) === null || _c === void 0 ? void 0 : _c._seconds) || Date.now() / 1000,
            _geoloc: component._geoloc || undefined,
        };
        // Save to Algolia
        await algoliaClient.saveObject({
            indexName: COMPONENTS_INDEX,
            body: algoliaObject,
        });
        console.log("Component indexed in Algolia:", componentId);
    }
    catch (error) {
        console.error("Error indexing component in Algolia:", error);
        throw error;
    }
});
/**
 * Sync component data to Algolia when updated
 */
exports.onComponentUpdate = (0, firestore_1.onDocumentUpdated)("components/{componentId}", async (event) => {
    var _a, _b, _c;
    const newData = (_a = event.data) === null || _a === void 0 ? void 0 : _a.after.data();
    if (!newData)
        return;
    const componentId = event.params.componentId;
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
            createdAt: ((_b = newData.createdAt) === null || _b === void 0 ? void 0 : _b._seconds) || Date.now() / 1000,
            updatedAt: ((_c = newData.updatedAt) === null || _c === void 0 ? void 0 : _c._seconds) || Date.now() / 1000,
            _geoloc: newData._geoloc || undefined,
        };
        await algoliaClient.saveObject({
            indexName: COMPONENTS_INDEX,
            body: algoliaObject,
        });
        console.log("Component updated in Algolia:", componentId);
    }
    catch (error) {
        console.error("Error updating component in Algolia:", error);
        throw error;
    }
});
/**
 * Remove component from Algolia when deleted
 */
exports.onComponentDelete = (0, firestore_1.onDocumentDeleted)("components/{componentId}", async (event) => {
    const componentId = event.params.componentId;
    console.log("Component deleted:", componentId);
    try {
        await algoliaClient.deleteObject({
            indexName: COMPONENTS_INDEX,
            objectID: componentId,
        });
        console.log("Component removed from Algolia:", componentId);
    }
    catch (error) {
        console.error("Error removing component from Algolia:", error);
        throw error;
    }
});
/**
 * Sync user data to Algolia when created
 */
exports.onUserCreate = (0, firestore_1.onDocumentCreated)("users/{userId}", async (event) => {
    var _a, _b;
    const user = (_a = event.data) === null || _a === void 0 ? void 0 : _a.data();
    if (!user)
        return;
    const userId = event.params.userId;
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
            createdAt: ((_b = user.createdAt) === null || _b === void 0 ? void 0 : _b._seconds) || Date.now() / 1000,
        };
        await algoliaClient.saveObject({
            indexName: USERS_INDEX,
            body: algoliaObject,
        });
        console.log("User indexed in Algolia:", userId);
    }
    catch (error) {
        console.error("Error indexing user in Algolia:", error);
        throw error;
    }
});
/**
 * Sync user data to Algolia when updated
 */
exports.onUserUpdate = (0, firestore_1.onDocumentUpdated)("users/{userId}", async (event) => {
    var _a, _b;
    const newData = (_a = event.data) === null || _a === void 0 ? void 0 : _a.after.data();
    if (!newData)
        return;
    const userId = event.params.userId;
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
            createdAt: ((_b = newData.createdAt) === null || _b === void 0 ? void 0 : _b._seconds) || Date.now() / 1000,
        };
        await algoliaClient.saveObject({
            indexName: USERS_INDEX,
            body: algoliaObject,
        });
        console.log("User updated in Algolia:", userId);
    }
    catch (error) {
        console.error("Error updating user in Algolia:", error);
        throw error;
    }
});
/**
 * Remove user from Algolia when deleted
 */
exports.onUserDelete = (0, firestore_1.onDocumentDeleted)("users/{userId}", async (event) => {
    const userId = event.params.userId;
    console.log("User deleted:", userId);
    try {
        await algoliaClient.deleteObject({
            indexName: USERS_INDEX,
            objectID: userId,
        });
        console.log("User removed from Algolia:", userId);
    }
    catch (error) {
        console.error("Error removing user from Algolia:", error);
        throw error;
    }
});
/**
 * Sync collection data to Algolia when created
 */
exports.onCollectionCreate = (0, firestore_1.onDocumentCreated)("collections/{collectionId}", async (event) => {
    var _a, _b, _c;
    const collection = (_a = event.data) === null || _a === void 0 ? void 0 : _a.data();
    if (!collection)
        return;
    const collectionId = event.params.collectionId;
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
            createdAt: ((_b = collection.createdAt) === null || _b === void 0 ? void 0 : _b._seconds) || Date.now() / 1000,
            updatedAt: ((_c = collection.updatedAt) === null || _c === void 0 ? void 0 : _c._seconds) || Date.now() / 1000,
        };
        await algoliaClient.saveObject({
            indexName: COLLECTIONS_INDEX,
            body: algoliaObject,
        });
        console.log("Collection indexed in Algolia:", collectionId);
    }
    catch (error) {
        console.error("Error indexing collection in Algolia:", error);
        throw error;
    }
});
/**
 * Sync collection data to Algolia when updated
 */
exports.onCollectionUpdate = (0, firestore_1.onDocumentUpdated)("collections/{collectionId}", async (event) => {
    var _a, _b, _c;
    const newData = (_a = event.data) === null || _a === void 0 ? void 0 : _a.after.data();
    if (!newData)
        return;
    const collectionId = event.params.collectionId;
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
            createdAt: ((_b = newData.createdAt) === null || _b === void 0 ? void 0 : _b._seconds) || Date.now() / 1000,
            updatedAt: ((_c = newData.updatedAt) === null || _c === void 0 ? void 0 : _c._seconds) || Date.now() / 1000,
        };
        await algoliaClient.saveObject({
            indexName: COLLECTIONS_INDEX,
            body: algoliaObject,
        });
        console.log("Collection updated in Algolia:", collectionId);
    }
    catch (error) {
        console.error("Error updating collection in Algolia:", error);
        throw error;
    }
});
/**
 * Remove collection from Algolia when deleted
 */
exports.onCollectionDelete = (0, firestore_1.onDocumentDeleted)("collections/{collectionId}", async (event) => {
    const collectionId = event.params.collectionId;
    console.log("Collection deleted:", collectionId);
    try {
        await algoliaClient.deleteObject({
            indexName: COLLECTIONS_INDEX,
            objectID: collectionId,
        });
        console.log("Collection removed from Algolia:", collectionId);
    }
    catch (error) {
        console.error("Error removing collection from Algolia:", error);
        throw error;
    }
});
/**
 * Bulk sync existing Firestore data to Algolia (HTTP callable function)
 * This can be triggered manually to sync all existing data
 */
exports.syncAllToAlgolia = (0, https_1.onCall)(async (request) => {
    // Check if user is authenticated
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "User must be authenticated");
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
            var _a, _b;
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
                createdAt: ((_a = data.createdAt) === null || _a === void 0 ? void 0 : _a._seconds) || Date.now() / 1000,
                updatedAt: ((_b = data.updatedAt) === null || _b === void 0 ? void 0 : _b._seconds) || Date.now() / 1000,
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
            var _a;
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
                createdAt: ((_a = data.createdAt) === null || _a === void 0 ? void 0 : _a._seconds) || Date.now() / 1000,
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
            var _a, _b;
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
                createdAt: ((_a = data.createdAt) === null || _a === void 0 ? void 0 : _a._seconds) || Date.now() / 1000,
                updatedAt: ((_b = data.updatedAt) === null || _b === void 0 ? void 0 : _b._seconds) || Date.now() / 1000,
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
    }
    catch (error) {
        console.error("Error during bulk sync:", error);
        throw new https_1.HttpsError("internal", "Failed to sync data to Algolia");
    }
});
//# sourceMappingURL=index.js.map