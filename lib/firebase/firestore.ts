import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryConstraint,
  DocumentData,
  increment,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { Component, Collection, Favorite, Comment, Activity, Follow, User } from './types';

// Collection References
const COLLECTIONS = {
  USERS: 'users',
  COMPONENTS: 'components',
  COLLECTIONS: 'collections',
  FAVORITES: 'favorites',
  COMMENTS: 'comments',
  ACTIVITIES: 'activities',
  FOLLOWS: 'follows',
  STATS: 'stats',
  LIBRARY_COMPONENTS: 'libraryComponents',
};

// ==================== USER OPERATIONS ====================

export const createUser = async (userId: string, userData: Partial<User>) => {
  const userRef = doc(db, COLLECTIONS.USERS, userId);
  await setDoc(userRef, {
    uid: userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    totalComponents: 0,
    totalLikes: 0,
    followers: 0,
    following: 0,
    isVerified: false,
    ...userData,
  });
};

export const getUserById = async (userId: string): Promise<User | null> => {
  const userRef = doc(db, COLLECTIONS.USERS, userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? (userSnap.data() as User) : null;
};

export const updateUser = async (userId: string, data: Partial<User>) => {
  const userRef = doc(db, COLLECTIONS.USERS, userId);
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

// ==================== COMPONENT OPERATIONS ====================

export const createComponent = async (componentData: Omit<Component, 'id'>) => {
  const componentRef = doc(collection(db, COLLECTIONS.COMPONENTS));
  const component = {
    ...componentData,
    id: componentRef.id,
    likes: 0,
    views: 0,
    copies: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  
  await setDoc(componentRef, component);
  
  // Update user's component count
  const userRef = doc(db, COLLECTIONS.USERS, componentData.authorId);
  await updateDoc(userRef, {
    totalComponents: increment(1),
  });
  
  // Create activity
  await createActivity({
    userId: componentData.authorId,
    type: 'upload',
    targetId: componentRef.id,
    targetType: 'component',
    description: `Uploaded ${componentData.title}`,
  });
  
  return componentRef.id;
};

export const getComponentById = async (componentId: string): Promise<Component | null> => {
  const componentRef = doc(db, COLLECTIONS.COMPONENTS, componentId);
  const componentSnap = await getDoc(componentRef);
  
  if (componentSnap.exists()) {
    // Increment view count
    await updateDoc(componentRef, {
      views: increment(1),
    });
    return componentSnap.data() as Component;
  }
  return null;
};

export const getComponents = async (constraints: {
  category?: string;
  framework?: string;
  sourceType?: string;
  authorId?: string;
  limitCount?: number;
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
}) => {
  const queries: QueryConstraint[] = [where('isPublic', '==', true)];
  
  if (constraints.category) {
    queries.push(where('category', '==', constraints.category));
  }
  if (constraints.framework) {
    queries.push(where('framework', '==', constraints.framework));
  }
  if (constraints.sourceType) {
    queries.push(where('sourceType', '==', constraints.sourceType));
  }
  if (constraints.authorId) {
    queries.push(where('authorId', '==', constraints.authorId));
  }
  if (constraints.orderByField) {
    queries.push(orderBy(constraints.orderByField, constraints.orderDirection || 'desc'));
  }
  if (constraints.limitCount) {
    queries.push(limit(constraints.limitCount));
  }
  
  const componentsQuery = query(collection(db, COLLECTIONS.COMPONENTS), ...queries);
  const snapshot = await getDocs(componentsQuery);
  
  return snapshot.docs.map(doc => doc.data() as Component);
};

export const updateComponent = async (componentId: string, data: Partial<Component>) => {
  const componentRef = doc(db, COLLECTIONS.COMPONENTS, componentId);
  await updateDoc(componentRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteComponent = async (componentId: string, authorId: string) => {
  const componentRef = doc(db, COLLECTIONS.COMPONENTS, componentId);
  await deleteDoc(componentRef);
  
  // Update user's component count
  const userRef = doc(db, COLLECTIONS.USERS, authorId);
  await updateDoc(userRef, {
    totalComponents: increment(-1),
  });
};

export const incrementComponentCopies = async (componentId: string) => {
  const componentRef = doc(db, COLLECTIONS.COMPONENTS, componentId);
  await updateDoc(componentRef, {
    copies: increment(1),
  });
};

// ==================== FAVORITE OPERATIONS ====================

export const addToFavorites = async (userId: string, componentId: string) => {
  const favoriteRef = doc(collection(db, COLLECTIONS.FAVORITES));
  await setDoc(favoriteRef, {
    id: favoriteRef.id,
    userId,
    componentId,
    createdAt: serverTimestamp(),
  });
  
  // Increment component likes
  const componentRef = doc(db, COLLECTIONS.COMPONENTS, componentId);
  await updateDoc(componentRef, {
    likes: increment(1),
  });
  
  // Create activity
  await createActivity({
    userId,
    type: 'like',
    targetId: componentId,
    targetType: 'component',
    description: 'Liked a component',
  });
};

export const removeFromFavorites = async (userId: string, componentId: string) => {
  const favoritesQuery = query(
    collection(db, COLLECTIONS.FAVORITES),
    where('userId', '==', userId),
    where('componentId', '==', componentId)
  );
  
  const snapshot = await getDocs(favoritesQuery);
  
  snapshot.docs.forEach(async (document) => {
    await deleteDoc(document.ref);
  });
  
  // Decrement component likes
  const componentRef = doc(db, COLLECTIONS.COMPONENTS, componentId);
  await updateDoc(componentRef, {
    likes: increment(-1),
  });
};

export const getUserFavorites = async (userId: string) => {
  const favoritesQuery = query(
    collection(db, COLLECTIONS.FAVORITES),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(favoritesQuery);
  return snapshot.docs.map(doc => doc.data() as Favorite);
};

export const isComponentFavorited = async (userId: string, componentId: string): Promise<boolean> => {
  const favoritesQuery = query(
    collection(db, COLLECTIONS.FAVORITES),
    where('userId', '==', userId),
    where('componentId', '==', componentId)
  );
  
  const snapshot = await getDocs(favoritesQuery);
  return !snapshot.empty;
};

// ==================== COLLECTION OPERATIONS ====================

export const createCollection = async (collectionData: Omit<Collection, 'id'>) => {
  const collectionRef = doc(collection(db, COLLECTIONS.COLLECTIONS));
  const newCollection = {
    ...collectionData,
    id: collectionRef.id,
    componentIds: [],
    likes: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  
  await setDoc(collectionRef, newCollection);
  
  // Create activity
  await createActivity({
    userId: collectionData.userId,
    type: 'collection',
    targetId: collectionRef.id,
    targetType: 'collection',
    description: `Created collection: ${collectionData.name}`,
  });
  
  return collectionRef.id;
};

export const getCollectionById = async (collectionId: string): Promise<Collection | null> => {
  const collectionRef = doc(db, COLLECTIONS.COLLECTIONS, collectionId);
  const collectionSnap = await getDoc(collectionRef);
  return collectionSnap.exists() ? (collectionSnap.data() as Collection) : null;
};

export const getUserCollections = async (userId: string) => {
  const collectionsQuery = query(
    collection(db, COLLECTIONS.COLLECTIONS),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(collectionsQuery);
  return snapshot.docs.map(doc => doc.data() as Collection);
};

export const addComponentToCollection = async (collectionId: string, componentId: string) => {
  const collectionRef = doc(db, COLLECTIONS.COLLECTIONS, collectionId);
  await updateDoc(collectionRef, {
    componentIds: arrayUnion(componentId),
    updatedAt: serverTimestamp(),
  });
};

export const removeComponentFromCollection = async (collectionId: string, componentId: string) => {
  const collectionRef = doc(db, COLLECTIONS.COLLECTIONS, collectionId);
  await updateDoc(collectionRef, {
    componentIds: arrayRemove(componentId),
    updatedAt: serverTimestamp(),
  });
};

export const updateCollection = async (collectionId: string, data: Partial<Collection>) => {
  const collectionRef = doc(db, COLLECTIONS.COLLECTIONS, collectionId);
  await updateDoc(collectionRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteCollection = async (collectionId: string) => {
  const collectionRef = doc(db, COLLECTIONS.COLLECTIONS, collectionId);
  await deleteDoc(collectionRef);
};

// ==================== COMMENT OPERATIONS ====================

export const addComment = async (commentData: Omit<Comment, 'id' | 'likes' | 'replies'>) => {
  const commentRef = doc(collection(db, COLLECTIONS.COMMENTS));
  const comment = {
    ...commentData,
    id: commentRef.id,
    likes: 0,
    replies: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  
  await setDoc(commentRef, comment);
  
  // Create activity
  await createActivity({
    userId: commentData.userId,
    type: 'comment',
    targetId: commentData.componentId,
    targetType: 'component',
    description: 'Commented on a component',
  });
  
  return commentRef.id;
};

export const getComponentComments = async (componentId: string) => {
  const commentsQuery = query(
    collection(db, COLLECTIONS.COMMENTS),
    where('componentId', '==', componentId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(commentsQuery);
  return snapshot.docs.map(doc => doc.data() as Comment);
};

export const deleteComment = async (commentId: string) => {
  const commentRef = doc(db, COLLECTIONS.COMMENTS, commentId);
  await deleteDoc(commentRef);
};

// ==================== FOLLOW OPERATIONS ====================

export const followUser = async (followerId: string, followingId: string) => {
  const followRef = doc(collection(db, COLLECTIONS.FOLLOWS));
  await setDoc(followRef, {
    id: followRef.id,
    followerId,
    followingId,
    createdAt: serverTimestamp(),
  });
  
  // Update counts
  const followerRef = doc(db, COLLECTIONS.USERS, followerId);
  const followingRef = doc(db, COLLECTIONS.USERS, followingId);
  
  await updateDoc(followerRef, { following: increment(1) });
  await updateDoc(followingRef, { followers: increment(1) });
  
  // Create activity
  await createActivity({
    userId: followerId,
    type: 'follow',
    targetId: followingId,
    targetType: 'user',
    description: 'Started following a user',
  });
};

export const unfollowUser = async (followerId: string, followingId: string) => {
  const followsQuery = query(
    collection(db, COLLECTIONS.FOLLOWS),
    where('followerId', '==', followerId),
    where('followingId', '==', followingId)
  );
  
  const snapshot = await getDocs(followsQuery);
  snapshot.docs.forEach(async (document) => {
    await deleteDoc(document.ref);
  });
  
  // Update counts
  const followerRef = doc(db, COLLECTIONS.USERS, followerId);
  const followingRef = doc(db, COLLECTIONS.USERS, followingId);
  
  await updateDoc(followerRef, { following: increment(-1) });
  await updateDoc(followingRef, { followers: increment(-1) });
};

export const isFollowing = async (followerId: string, followingId: string): Promise<boolean> => {
  const followsQuery = query(
    collection(db, COLLECTIONS.FOLLOWS),
    where('followerId', '==', followerId),
    where('followingId', '==', followingId)
  );
  
  const snapshot = await getDocs(followsQuery);
  return !snapshot.empty;
};

// ==================== ACTIVITY OPERATIONS ====================

export const createActivity = async (activityData: Omit<Activity, 'id' | 'createdAt'>) => {
  const activityRef = doc(collection(db, COLLECTIONS.ACTIVITIES));
  await setDoc(activityRef, {
    ...activityData,
    id: activityRef.id,
    createdAt: serverTimestamp(),
  });
};

export const getUserActivities = async (userId: string, limitCount: number = 20) => {
  const activitiesQuery = query(
    collection(db, COLLECTIONS.ACTIVITIES),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  
  const snapshot = await getDocs(activitiesQuery);
  return snapshot.docs.map(doc => doc.data() as Activity);
};

// ==================== SEARCH OPERATIONS ====================

export const searchComponents = async (searchTerm: string, limitCount: number = 20) => {
  // Note: For production, use Algolia or Firebase Extensions for full-text search
  // This is a basic implementation
  const componentsQuery = query(
    collection(db, COLLECTIONS.COMPONENTS),
    where('isPublic', '==', true),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  
  const snapshot = await getDocs(componentsQuery);
  const allComponents = snapshot.docs.map(doc => doc.data() as Component);
  
  // Filter by search term (client-side filtering)
  return allComponents.filter(component =>
    component.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    component.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    component.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );
};
