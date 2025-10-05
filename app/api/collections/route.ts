import { NextRequest, NextResponse } from 'next/server';
import {
  createCollection,
  getUserCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
  addComponentToCollection,
  removeComponentFromCollection,
} from '@/lib/firebase/firestore';

// GET - Fetch collections
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');

    // Fetch single collection by ID
    if (id) {
      const collection = await getCollectionById(id);
      if (!collection) {
        return NextResponse.json(
          { error: 'Collection not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(collection);
    }

    // Fetch user collections
    if (userId) {
      const collections = await getUserCollections(userId);
      return NextResponse.json(collections);
    }

    return NextResponse.json(
      { error: 'ID or User ID is required' },
      { status: 400 }
    );
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
    const { name, description, userId, userName, isPublic, coverImage } = data;

    if (!name || !userId || !userName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const collectionId = await createCollection({
      name,
      description: description || '',
      userId,
      userName,
      componentIds: [],
      isPublic: isPublic ?? true,
      coverImage: coverImage || undefined,
      likes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        collectionId,
        message: 'Collection created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating collection:', error);
    return NextResponse.json(
      { error: 'Failed to create collection' },
      { status: 500 }
    );
  }
}
