import { NextRequest, NextResponse } from 'next/server';
import {
  updateCollection,
  deleteCollection,
  addComponentToCollection,
  removeComponentFromCollection,
} from '@/lib/firebase/firestore';

// PUT - Update a collection
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await request.json();

    await updateCollection(id, data);

    return NextResponse.json({
      success: true,
      message: 'Collection updated successfully',
    });
  } catch (error) {
    console.error('Error updating collection:', error);
    return NextResponse.json(
      { error: 'Failed to update collection' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a collection
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await deleteCollection(id);

    return NextResponse.json({
      success: true,
      message: 'Collection deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting collection:', error);
    return NextResponse.json(
      { error: 'Failed to delete collection' },
      { status: 500 }
    );
  }
}

// POST - Add component to collection
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { componentId } = await request.json();

    if (!componentId) {
      return NextResponse.json(
        { error: 'Component ID is required' },
        { status: 400 }
      );
    }

    await addComponentToCollection(id, componentId);

    return NextResponse.json({
      success: true,
      message: 'Component added to collection',
    });
  } catch (error) {
    console.error('Error adding component to collection:', error);
    return NextResponse.json(
      { error: 'Failed to add component to collection' },
      { status: 500 }
    );
  }
}
