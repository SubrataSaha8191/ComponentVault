import { NextRequest, NextResponse } from 'next/server'
import { adminDb, adminAuth } from '@/lib/firebase/admin'

// GET - Fetch user's recent components
export async function GET(request: NextRequest) {
  try {
    // Get authorization token
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const idToken = authHeader.split('Bearer ')[1]
    const decodedToken = await adminAuth.verifyIdToken(idToken)
    const userId = decodedToken.uid

    // Get limit from query params
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10', 10)

    // Fetch user's components ordered by creation date
    const componentsSnapshot = await adminDb
      .collection('components')
      .where('authorId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get()

    const components = componentsSnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        name: data.name || data.title || 'Untitled',
        title: data.title || data.name || 'Untitled',
        description: data.description || '',
        thumbnail: data.thumbnail || data.previewImage || data.thumbnailImage || '',
        downloads: data.downloads || data.copies || 0,
        favorites: data.likes || 0,
        views: data.views || 0,
        category: data.category || 'other',
        framework: data.framework || 'react',
        createdAt: data.createdAt,
        isPublic: data.isPublic || false,
      }
    })

    return NextResponse.json({ components })
  } catch (error) {
    console.error('Error fetching user components:', error)
    return NextResponse.json(
      { error: 'Failed to fetch components' },
      { status: 500 }
    )
  }
}
