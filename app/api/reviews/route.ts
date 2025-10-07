import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import * as admin from 'firebase-admin';

interface Review {
  id: string;
  componentId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  helpful: number;
  notHelpful: number;
  createdAt: any;
  updatedAt: any;
}

// GET - Fetch reviews for a component
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const componentId = searchParams.get('componentId');

    if (!componentId) {
      return NextResponse.json(
        { error: 'Component ID is required' },
        { status: 400 }
      );
    }

    // Get reviews for this component
    const reviewsSnapshot = await adminDb
      .collection('reviews')
      .where('componentId', '==', componentId)
      .get();

    const reviews: Review[] = reviewsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Review));

    reviews.sort((a, b) => {
      const aDate = a.createdAt?.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt ?? 0).getTime();
      const bDate = b.createdAt?.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt ?? 0).getTime();
      return bDate - aDate;
    });

    // Calculate aggregated rating data
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0;

    const ratingBreakdown = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    };

    return NextResponse.json({
      reviews,
      aggregates: {
        totalReviews,
        averageRating,
        ratingBreakdown,
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST - Add a review
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { componentId, userId, userName, userAvatar, rating, comment } = data;

    if (!componentId || !userId || !userName || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if user already reviewed this component
    const existingReview = await adminDb
      .collection('reviews')
      .where('componentId', '==', componentId)
      .where('userId', '==', userId)
      .get();

    if (!existingReview.empty) {
      return NextResponse.json(
        { error: 'User has already reviewed this component' },
        { status: 400 }
      );
    }

    const reviewData = {
      componentId,
      userId,
      userName,
      userAvatar: userAvatar || null,
      rating,
      comment: comment || '',
      helpful: 0,
      notHelpful: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await adminDb.collection('reviews').add(reviewData);

    return NextResponse.json({
      success: true,
      reviewId: docRef.id,
      message: 'Review added successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding review:', error);
    return NextResponse.json(
      { error: 'Failed to add review' },
      { status: 500 }
    );
  }
}

// PUT - Update review helpfulness
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { reviewId, action, userId } = data;

    if (!reviewId || !action || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['helpful', 'notHelpful'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    // Check if user already voted on this review
    const voteSnapshot = await adminDb
      .collection('reviewVotes')
      .where('reviewId', '==', reviewId)
      .where('userId', '==', userId)
      .get();

    if (!voteSnapshot.empty) {
      return NextResponse.json(
        { error: 'User has already voted on this review' },
        { status: 400 }
      );
    }

    // Add vote record
    await adminDb.collection('reviewVotes').add({
      reviewId,
      userId,
      action,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Update review helpful/notHelpful count
    const updateField = action === 'helpful' ? 'helpful' : 'notHelpful';
    await adminDb.collection('reviews').doc(reviewId).update({
      [updateField]: admin.firestore.FieldValue.increment(1),
    });

    return NextResponse.json({
      success: true,
      message: 'Vote recorded successfully',
    });
  } catch (error) {
    console.error('Error updating review vote:', error);
    return NextResponse.json(
      { error: 'Failed to update review vote' },
      { status: 500 }
    );
  }
}