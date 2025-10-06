import { NextRequest, NextResponse } from 'next/server'
import { adminDb, adminAuth } from '@/lib/firebase/admin'

// GET - Fetch user profile with stats
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

    // Fetch user document
    const userDoc = await adminDb.collection('users').doc(userId).get()
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userData = userDoc.data()

    // Get user's components
    const componentsSnapshot = await adminDb
      .collection('components')
      .where('authorId', '==', userId)
      .get()

    const components = componentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    // Calculate stats
    const totalComponents = components.length
    const totalDownloads = components.reduce((sum: number, c: any) => 
      sum + (c.downloads || c.copies || 0), 0)
    const totalViews = components.reduce((sum: number, c: any) => 
      sum + (c.views || 0), 0)

    // Get favorites count (number of times user's components have been favorited)
    const favoritesSnapshot = await adminDb
      .collection('favorites')
      .where('componentId', 'in', components.map(c => c.id).slice(0, 10)) // Firestore 'in' limit is 10
      .get()
    
    const totalFavorites = favoritesSnapshot.size

    // Get followers count
    const followersSnapshot = await adminDb
      .collection('follows')
      .where('followingId', '==', userId)
      .count()
      .get()
    
    const followers = followersSnapshot.data().count

    // Get following count
    const followingSnapshot = await adminDb
      .collection('follows')
      .where('followerId', '==', userId)
      .count()
      .get()
    
    const following = followingSnapshot.data().count

    return NextResponse.json({
      user: {
        uid: userId,
        email: userData?.email || '',
        displayName: userData?.displayName || userData?.name || '',
        photoURL: userData?.photoURL || userData?.avatar || '',
        bio: userData?.bio || '',
        website: userData?.website || '',
        github: userData?.github || '',
        twitter: userData?.twitter || '',
        location: userData?.location || '',
        createdAt: userData?.createdAt || null,
      },
      stats: {
        components: totalComponents,
        downloads: totalDownloads,
        favorites: totalFavorites,
        views: totalViews,
        followers,
        following,
      },
    })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}
