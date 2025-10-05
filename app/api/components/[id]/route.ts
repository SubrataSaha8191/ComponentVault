import { NextRequest, NextResponse } from 'next/server';
import { updateComponent, deleteComponent } from '@/lib/firebase/firestore';
import { deleteComponentImages } from '@/lib/firebase/storage';

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
