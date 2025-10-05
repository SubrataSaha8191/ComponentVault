import { NextRequest, NextResponse } from 'next/server';
import {
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
  isComponentFavorited,
} from '@/lib/firebase/firestore';

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
      const isFavorited = await isComponentFavorited(userId, componentId);
      return NextResponse.json({ isFavorited });
    }

    // Get all user favorites
    const favorites = await getUserFavorites(userId);
    return NextResponse.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
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

    await addToFavorites(userId, componentId);

    return NextResponse.json({
      success: true,
      message: 'Added to favorites',
    });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return NextResponse.json(
      { error: 'Failed to add to favorites' },
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

    await removeFromFavorites(userId, componentId);

    return NextResponse.json({
      success: true,
      message: 'Removed from favorites',
    });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return NextResponse.json(
      { error: 'Failed to remove from favorites' },
      { status: 500 }
    );
  }
}
