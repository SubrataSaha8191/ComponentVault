import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK for server-side operations with fallbacks
if (!admin.apps.length) {
  try {
    const hasServiceAccount =
      !!process.env.FIREBASE_ADMIN_PROJECT_ID &&
      !!process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
      !!process.env.FIREBASE_ADMIN_PRIVATE_KEY;

    if (hasServiceAccount) {
      // Fix private key format - handle both escaped and non-escaped newlines
      let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY || '';
      
      // If the key is escaped (from .env file), replace escaped newlines
      if (privateKey.includes('\\n')) {
        privateKey = privateKey.replace(/\\n/g, '\n');
      }
      
      // Ensure the key has proper format
      if (!privateKey.startsWith('-----BEGIN PRIVATE KEY-----')) {
        console.error('[firebase-admin] Private key appears to be malformed');
      }

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
      console.log('[firebase-admin] Initialized successfully with service account');
    } else {
      // Fallback to application default credentials (gcloud auth or env-based ADC)
      console.warn('[firebase-admin] Service account env vars not set. Falling back to application default credentials.');
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
    }
  } catch (error) {
    console.error('[firebase-admin] Initialization error:', error);
    // Try to provide more helpful error message
    if (error instanceof Error && error.message.includes('DECODER')) {
      console.error('[firebase-admin] Private key decoding failed. Please check:');
      console.error('1. FIREBASE_ADMIN_PRIVATE_KEY is properly formatted in .env.local');
      console.error('2. Newlines are escaped as \\n in the .env file');
      console.error('3. The entire key is wrapped in quotes');
    }
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
export const adminStorage = admin.storage();

export default admin;
