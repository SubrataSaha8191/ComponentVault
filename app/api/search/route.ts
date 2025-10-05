import { NextRequest, NextResponse } from 'next/server';
import { searchComponents } from '@/lib/firebase/firestore';

// GET - Search components
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = searchParams.get('limit');

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    const components = await searchComponents(
      query,
      limit ? parseInt(limit) : 20
    );

    return NextResponse.json(components);
  } catch (error) {
    console.error('Error searching components:', error);
    return NextResponse.json(
      { error: 'Failed to search components' },
      { status: 500 }
    );
  }
}
