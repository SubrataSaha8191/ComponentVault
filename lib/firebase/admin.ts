import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK for server-side operations with fallbacks
if (!admin.apps.length) {
  try {
    const hasServiceAccount =
      !!process.env.FIREBASE_ADMIN_PROJECT_ID &&
      !!process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
      !!process.env.FIREBASE_ADMIN_PRIVATE_KEY;

    if (hasServiceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      // Fallback to application default credentials (gcloud auth or env-based ADC)
      console.warn('[firebase-admin] Service account env vars not set. Falling back to application default credentials.');
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
    }
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
export const adminStorage = admin.storage();

export default admin;
