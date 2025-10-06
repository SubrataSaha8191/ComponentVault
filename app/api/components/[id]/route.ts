import { NextRequest, NextResponse } from 'next/server';
import { updateComponent, deleteComponent } from '@/lib/firebase/firestore';
import { deleteComponentImages } from '@/lib/firebase/storage';
import { adminDb } from '@/lib/firebase/admin'
import * as admin from 'firebase-admin'

// GET - Fetch single component by ID (Admin SDK, safe for server usage)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const docRef = adminDb.collection('components').doc(id)
    const doc = await docRef.get()

    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Component not found' },
        { status: 404 }
      )
    }

    const data = { id: doc.id, ...doc.data() }

    // Best-effort: increment views using Admin SDK (won't fail clients due to rules)
    try {
      await docRef.update({ views: admin.firestore.FieldValue.increment(1) })
    } catch (e) {
      // Non-fatal
      console.warn('Failed to increment component views (non-fatal):', e)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching component:', error)
    return NextResponse.json(
      { error: 'Failed to fetch component' },
      { status: 500 }
    )
  }
}

// PUT - Update a component
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await request.json();

    await updateComponent(id, data);

    return NextResponse.json({
      success: true,
      message: 'Component updated successfully',
    });
  } catch (error) {
    console.error('Error updating component:', error);
    return NextResponse.json(
      { error: 'Failed to update component' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a component
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const authorId = searchParams.get('authorId');
    const previewUrl = searchParams.get('previewUrl');
    const thumbnailUrl = searchParams.get('thumbnailUrl');

    if (!authorId) {
      return NextResponse.json(
        { error: 'Author ID is required' },
        { status: 400 }
      );
    }

    // Delete images from storage
    if (previewUrl) {
      await deleteComponentImages(previewUrl, thumbnailUrl || undefined);
    }

    // Delete component from Firestore
    await deleteComponent(id, authorId);

    return NextResponse.json({
      success: true,
      message: 'Component deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting component:', error);
    return NextResponse.json(
      { error: 'Failed to delete component' },
      { status: 500 }
    );
  }
}
