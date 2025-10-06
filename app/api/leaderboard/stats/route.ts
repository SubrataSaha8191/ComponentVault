import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'

export async function GET(request: NextRequest) {
  try {
    // Get counts using aggregation queries
    const [
      componentsCount,
      usersCount,
      collectionsCount,
    ] = await Promise.all([
      adminDb.collection('components').where('isPublic', '==', true).count().get(),
      adminDb.collection('users').count().get(),
      adminDb.collection('collections').count().get(),
    ])

    // Get all public components to calculate downloads and avg rating
    const componentsSnapshot = await adminDb.collection('components')
      .where('isPublic', '==', true)
      .get()

    let totalDownloads = 0
    let totalRatings = 0
    let ratingCount = 0

    componentsSnapshot.docs.forEach(doc => {
      const data = doc.data()
      totalDownloads += (data.downloads || data.copies || 0)
      const rating = data.stats?.rating || data.rating || 0
      if (rating > 0) {
        totalRatings += rating
        ratingCount++
      }
    })

    const avgRating = ratingCount > 0 ? Math.round((totalRatings / ratingCount) * 10) / 10 : 0

    // Get active users (users with at least 1 component)
    const usersWithComponents = new Set<string>()
    componentsSnapshot.docs.forEach(doc => {
      const authorId = doc.data().authorId
      if (authorId) usersWithComponents.add(authorId)
    })

    const stats = {
      totalContributors: usersWithComponents.size,
      totalDownloads,
      avgRating,
      activeUsers: usersWithComponents.size, // Could be refined with last active date
      totalComponents: componentsCount.data().count,
      totalUsers: usersCount.data().count,
      totalCollections: collectionsCount.data().count,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching leaderboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
