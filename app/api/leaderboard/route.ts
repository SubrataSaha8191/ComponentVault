import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'contributors'
    const period = searchParams.get('period') || 'alltime'
    const limit = parseInt(searchParams.get('limit') || '10')

    // Get all users with their stats
    const usersSnapshot = await adminDb.collection('users').get()
    const users = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    // Get all components to calculate downloads and ratings
    const componentsSnapshot = await adminDb.collection('components')
      .where('isPublic', '==', true)
      .get()
    
    const components = componentsSnapshot.docs.map(doc => doc.data())

    // Calculate stats for each user
    const userStats = await Promise.all(users.map(async (user: any) => {
      const userComponents = components.filter((c: any) => c.authorId === user.id)
      const totalDownloads = userComponents.reduce((sum: number, c: any) => sum + (c.downloads || c.copies || 0), 0)
      const totalLikes = userComponents.reduce((sum: number, c: any) => sum + (c.likes || 0), 0)
      
      // Calculate average rating
      const ratingsSum = userComponents.reduce((sum: number, c: any) => {
        const rating = c.stats?.rating || c.rating || 0
        return sum + rating
      }, 0)
      const avgRating = userComponents.length > 0 ? (ratingsSum / userComponents.length) : 0

      return {
        id: user.id,
        username: user.username || user.email?.split('@')[0] || 'anonymous',
        name: user.displayName || user.name || user.username || 'Anonymous',
        avatar: user.photoURL || user.avatar || null,
        email: user.email || '',
        components: userComponents.length,
        downloads: totalDownloads,
        likes: totalLikes,
        rating: Math.round(avgRating * 10) / 10,
        badges: user.badges || [],
        createdAt: user.createdAt,
      }
    }))

    // Filter out users with no components
    const activeUsers = userStats.filter(u => u.components > 0)

    // Sort based on type
    let sortedUsers = [...activeUsers]
    switch (type) {
      case 'downloads':
        sortedUsers.sort((a, b) => b.downloads - a.downloads)
        break
      case 'rated':
        sortedUsers.sort((a, b) => b.rating - a.rating)
        break
      case 'rising':
        // For rising stars, prioritize recent contributors with good stats
        sortedUsers = sortedUsers
          .filter(u => {
            const createdDate = u.createdAt?.toDate ? u.createdAt.toDate() : new Date(u.createdAt)
            const daysSinceJoined = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
            return daysSinceJoined <= 90 // Joined in last 90 days
          })
          .sort((a, b) => {
            const scoreA = (a.components * 10) + (a.downloads / 100) + (a.rating * 5)
            const scoreB = (b.components * 10) + (b.downloads / 100) + (b.rating * 5)
            return scoreB - scoreA
          })
        break
      case 'contributors':
      default:
        sortedUsers.sort((a, b) => {
          // Sort by components first, then downloads, then rating
          if (b.components !== a.components) return b.components - a.components
          if (b.downloads !== a.downloads) return b.downloads - a.downloads
          return b.rating - a.rating
        })
    }

    // Add rank and change indicator (mock for now)
    const rankedUsers = sortedUsers.slice(0, limit).map((user, index) => ({
      ...user,
      rank: index + 1,
      change: index < 3 ? 'up' : index < 7 ? 'same' : 'down', // Mock change
    }))

    return NextResponse.json(rankedUsers)
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
