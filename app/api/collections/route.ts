import { NextRequest, NextResponse } from 'next/server';
import {
  getUserCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
  addComponentToCollection,
  removeComponentFromCollection,
  getAllPublicCollections,
} from '@/lib/firebase/firestore';
import { adminDb, adminAuth } from '@/lib/firebase/admin';
import * as admin from 'firebase-admin';

// GET - Fetch collections
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');
    const limit = searchParams.get('limit');
    const orderBy = searchParams.get('orderBy');
    const order = searchParams.get('order') as 'asc' | 'desc';

    // Fetch single collection by ID (use Admin SDK for server-side access)
    if (id) {
      const doc = await adminDb.collection('collections').doc(id).get();
      if (!doc.exists) {
        return NextResponse.json(
          { error: 'Collection not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ id: doc.id, ...doc.data() });
    }

    // Fetch user collections
    if (userId && type === 'user') {
      const collections = await getUserCollections(userId);
      return NextResponse.json(collections);
    }

    // Fetch all public collections (with optional user private collections)
    const collections = await getAllPublicCollections({
      limitCount: limit ? parseInt(limit) : undefined,
      orderByField: orderBy || 'updatedAt',
      orderDirection: order || 'desc',
      userId: userId || undefined,
    });

    return NextResponse.json(collections);
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collections' },
      { status: 500 }
    );
  }
}

// POST - Create a new collection
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log('Received collection data:', data);

    // Verify Firebase ID token from Authorization header
    const authHeader = request.headers.get('authorization') || '';
    const idToken = authHeader.startsWith('Bearer ')
      ? authHeader.substring('Bearer '.length)
      : null;

    if (!idToken) {
      return NextResponse.json(
        { error: 'Unauthorized: missing ID token' },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = await adminAuth.verifyIdToken(idToken);
    } catch (e) {
      console.error('Failed to verify ID token', e);
      return NextResponse.json(
        { error: 'Unauthorized: invalid ID token' },
        { status: 401 }
      );
    }

    const uid = decoded.uid;
    const { name, description, userName, isPublic, coverImage, tags } = data;

    if (!name) {
      return NextResponse.json(
        { error: 'Missing required field: name' },
        { status: 400 }
      );
    }

    // Build the document, enforce userId from token
    const docRef = adminDb.collection('collections').doc();
    const now = admin.firestore.FieldValue.serverTimestamp();
    const collectionPayload: Record<string, any> = {
      id: docRef.id,
      name,
      description: description || '',
      userId: uid,
      userName: userName || decoded.name || decoded.email || 'Anonymous',
      componentIds: [],
      isPublic: isPublic ?? true,
      likes: 0,
      createdAt: now,
      updatedAt: now,
    };

    if (coverImage) collectionPayload.coverImage = coverImage;
    if (Array.isArray(tags)) collectionPayload.tags = tags;

    await docRef.set(collectionPayload, { merge: true });

    // Best-effort activity log; do not fail if it errors
    try {
      const activityRef = adminDb.collection('userActivities').doc();
      await activityRef.set({
        id: activityRef.id,
        userId: uid,
        type: 'collection',
        targetId: docRef.id,
        targetType: 'collection',
        description: `Created collection: ${name}`,
        createdAt: now,
      });
    } catch (e) {
      console.warn('Activity creation failed (non-fatal):', e);
    }

    console.log('Collection created successfully with ID:', docRef.id);

    return NextResponse.json(
      {
        success: true,
        collectionId: docRef.id,
        message: 'Collection created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating collection:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to create collection', details: errorMessage },
      { status: 500 }
    );
  }
}
