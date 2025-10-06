import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

// GET - Fetch platform statistics dynamically using Admin SDK
export async function GET(_request: NextRequest) {
  try {
    // Aggregate counts (Admin SDK bypasses security rules)
    const [collectionsCountSnap, publicCollectionsCountSnap, componentsCountSnap] = await Promise.all([
      adminDb.collection('collections').count().get(),
      adminDb.collection('collections').where('isPublic', '==', true).count().get(),
      adminDb.collection('components').where('isPublic', '==', true).count().get(),
    ]);

    const totalCollections = collectionsCountSnap.data().count || 0;
    const publicCollections = publicCollectionsCountSnap.data().count || 0;
    const totalComponents = componentsCountSnap.data().count || 0;

    // Trending components: top by likes (simple single-field index)
    const trendingSnap = await adminDb
      .collection('components')
      .where('isPublic', '==', true)
      .orderBy('likes', 'desc')
      .limit(6)
      .get();

    const trending = trendingSnap.docs.map((doc) => {
      const d = doc.data() as any;
      return {
        id: doc.id,
        name: d.name || d.title || 'Untitled',
        likes: d.likes || d.stats?.likes || 0,
        views: d.views || d.stats?.views || 0,
        downloads: d.downloads || d.stats?.downloads || 0,
        thumbnail: d.thumbnail || d.previewImage || d.thumbnailImage || '',
        category: d.category || 'other',
        framework: d.framework || 'react',
      };
    });

    return NextResponse.json({
      totalCollections,
      publicCollections,
      totalComponents,
      trending,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    // Graceful fallback
    return NextResponse.json(
      { totalCollections: 0, publicCollections: 0, totalComponents: 0, trending: [] },
      { status: 200 }
    );
  }
}