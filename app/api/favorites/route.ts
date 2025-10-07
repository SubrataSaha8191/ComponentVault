import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

// GET - Check if component is favorited or get user favorites
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const componentId = searchParams.get('componentId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if specific component is favorited
    if (componentId) {
      const favoritesSnapshot = await adminDb
        .collection('favorites')
        .where('userId', '==', userId)
        .where('componentId', '==', componentId)
        .limit(1)
        .get();
      
      const isFavorited = !favoritesSnapshot.empty;
      return NextResponse.json({ isFavorited });
    }

    // Get all user favorites using Admin SDK
    const favoritesSnapshot = await adminDb
      .collection('favorites')
      .where('userId', '==', userId)
      .get();
    
    const favorites = favoritesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    favorites.sort((a: any, b: any) => {
      const aDate = a.createdAt?.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt ?? 0).getTime();
      const bDate = b.createdAt?.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt ?? 0).getTime();
      return bDate - aDate;
    });
    
    // Fetch full component data for each favorite
    const componentsPromises = favorites.map(async (favorite: any) => {
      try {
        const componentDoc = await adminDb
          .collection('components')
          .doc(favorite.componentId)
          .get();
        
        if (componentDoc.exists) {
          return {
            id: componentDoc.id,
            ...componentDoc.data()
          };
        }
        return null;
      } catch (err) {
        console.error(`Failed to fetch component ${favorite.componentId}:`, err);
        return null;
      }
    });
    
    const components = await Promise.all(componentsPromises);
    // Filter out any null values (components that failed to load or were deleted)
    const validComponents = components.filter(c => c !== null);
    
    return NextResponse.json(validComponents);
  } catch (error: any) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites', details: error?.message },
      { status: 500 }
    );
  }
}

// POST - Add to favorites
export async function POST(request: NextRequest) {
  try {
    const { userId, componentId } = await request.json();

    if (!userId || !componentId) {
      return NextResponse.json(
        { error: 'User ID and Component ID are required' },
        { status: 400 }
      );
    }

    // Check if already favorited
    const existingFavorite = await adminDb
      .collection('favorites')
      .where('userId', '==', userId)
      .where('componentId', '==', componentId)
      .limit(1)
      .get();

    if (!existingFavorite.empty) {
      return NextResponse.json({
        success: true,
        message: 'Already in favorites',
      });
    }

    // Add to favorites
    await adminDb.collection('favorites').add({
      userId,
      componentId,
      createdAt: FieldValue.serverTimestamp(),
    });

    // Increment favorites count on component
    const componentRef = adminDb.collection('components').doc(componentId);
    await componentRef.update({
      favorites: FieldValue.increment(1),
    });

    return NextResponse.json({
      success: true,
      message: 'Added to favorites',
    });
  } catch (error: any) {
    console.error('Error adding to favorites:', error);
    return NextResponse.json(
      { error: 'Failed to add to favorites', details: error?.message },
      { status: 500 }
    );
  }
}

// DELETE - Remove from favorites
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const componentId = searchParams.get('componentId');

    if (!userId || !componentId) {
      return NextResponse.json(
        { error: 'User ID and Component ID are required' },
        { status: 400 }
      );
    }

    // Find and delete the favorite
    const favoriteSnapshot = await adminDb
      .collection('favorites')
      .where('userId', '==', userId)
      .where('componentId', '==', componentId)
      .limit(1)
      .get();

    if (!favoriteSnapshot.empty) {
      // Delete the favorite document
      await favoriteSnapshot.docs[0].ref.delete();

      // Decrement favorites count on component
      const componentRef = adminDb.collection('components').doc(componentId);
      await componentRef.update({
        favorites: FieldValue.increment(-1),
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Removed from favorites',
    });
  } catch (error: any) {
    console.error('Error removing from favorites:', error);
    return NextResponse.json(
      { error: 'Failed to remove from favorites', details: error?.message },
      { status: 500 }
    );
  }
}
