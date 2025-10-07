import { NextRequest, NextResponse } from 'next/server';
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

    // Normalize options
    const limitCount = limit ? parseInt(limit) : undefined;
    const orderByField = orderBy || 'updatedAt';
    const orderDirection: 'asc' | 'desc' = order || 'desc';

    // Helper to safely get millis from Firestore Timestamp or string/date
    const toMillis = (v: any): number => {
      if (!v) return 0;
      if (typeof v?.toMillis === 'function') return v.toMillis();
      const d = typeof v === 'string' ? new Date(v) : v;
      return d instanceof Date ? d.getTime() : 0;
    };

    // Fetch collections using Admin SDK to bypass client security rules and index requirements.
    // We avoid composite orderBy in Firestore and instead sort in memory.
    let results: any[] = [];

    if (userId && type === 'user') {
      // Only this user's collections (including private)
      const snap = await adminDb.collection('collections').where('userId', '==', userId).get();
      results = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } else if (userId) {
      // Combine user's collections and public collections, then de-duplicate
      const [userSnap, publicSnap] = await Promise.all([
        adminDb.collection('collections').where('userId', '==', userId).get(),
        adminDb.collection('collections').where('isPublic', '==', true).get(),
      ]);
      const userCols = userSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const publicCols = publicSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const map = new Map<string, any>();
      [...publicCols, ...userCols].forEach(c => map.set(c.id, c));
      results = Array.from(map.values());
    } else {
      // Public collections only
      const snap = await adminDb.collection('collections').where('isPublic', '==', true).get();
      results = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }

    // In-memory sorting
    results.sort((a, b) => {
      const aVal = orderByField === 'updatedAt' || orderByField === 'createdAt'
        ? toMillis((a as any)[orderByField])
        : ((a as any)[orderByField] ?? 0);
      const bVal = orderByField === 'updatedAt' || orderByField === 'createdAt'
        ? toMillis((b as any)[orderByField])
        : ((b as any)[orderByField] ?? 0);
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return orderDirection === 'asc' ? cmp : -cmp;
    });

    // Apply limit if requested
    if (limitCount && results.length > limitCount) {
      results = results.slice(0, limitCount);
    }

    return NextResponse.json(results);
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
