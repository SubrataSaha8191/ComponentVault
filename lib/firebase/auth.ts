import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  GithubAuthProvider,
  updateProfile,
  sendPasswordResetEmail,
  updatePassword,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from './config';
import { createUser, getUserById } from './firestore';

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

/**
 * Sign up with email and password
 */
export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<FirebaseUser> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Update profile
  await updateProfile(user, { displayName });

  // Create user document in Firestore
  await createUser(user.uid, {
    uid: user.uid,
    email: user.email || '',
    displayName,
    photoURL: user.photoURL || undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
    isVerified: false,
    totalComponents: 0,
    totalLikes: 0,
    followers: 0,
    following: 0,
  });

  return user;
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<FirebaseUser> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async (): Promise<FirebaseUser> => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Check if user exists in Firestore
  const existingUser = await getUserById(user.uid);

  if (!existingUser) {
    // Create user document for new users
    await createUser(user.uid, {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'Anonymous',
      photoURL: user.photoURL || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      isVerified: false,
      totalComponents: 0,
      totalLikes: 0,
      followers: 0,
      following: 0,
    });
  }

  return user;
};

/**
 * Sign in with GitHub
 */
export const signInWithGithub = async (): Promise<FirebaseUser> => {
  const result = await signInWithPopup(auth, githubProvider);
  const user = result.user;

  // Check if user exists in Firestore
  const existingUser = await getUserById(user.uid);

  if (!existingUser) {
    // Create user document for new users
    await createUser(user.uid, {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'Anonymous',
      photoURL: user.photoURL || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      isVerified: false,
      totalComponents: 0,
      totalLikes: 0,
      followers: 0,
      following: 0,
    });
  }

  return user;
};

/**
 * Sign out
 */
export const signOutUser = async (): Promise<void> => {
  await signOut(auth);
};

/**
 * Send password reset email
 */
export const sendPasswordReset = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

/**
 * Update user password
 */
export const updateUserPassword = async (
  user: FirebaseUser,
  newPassword: string
): Promise<void> => {
  await updatePassword(user, newPassword);
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  user: FirebaseUser,
  data: { displayName?: string; photoURL?: string }
): Promise<void> => {
  await updateProfile(user, data);
};
