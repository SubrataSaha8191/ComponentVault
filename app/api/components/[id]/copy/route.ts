import { NextRequest, NextResponse } from 'next/server';
import { incrementComponentCopies } from '@/lib/firebase/firestore';

// POST - Increment component copy count
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await incrementComponentCopies(id);

    return NextResponse.json({
      success: true,
      message: 'Component copy count incremented',
    });
  } catch (error) {
    console.error('Error incrementing copy count:', error);
    return NextResponse.json(
      { error: 'Failed to increment copy count' },
      { status: 500 }
    );
  }
}
