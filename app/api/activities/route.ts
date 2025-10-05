import { NextRequest, NextResponse } from 'next/server';
import { getUserActivities } from '@/lib/firebase/firestore';

// GET - Fetch user activities
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = searchParams.get('limit');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const activities = await getUserActivities(
      userId,
      limit ? parseInt(limit) : 20
    );

    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}
