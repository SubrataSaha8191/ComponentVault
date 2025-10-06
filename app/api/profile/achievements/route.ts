import { NextRequest, NextResponse } from 'next/server'
import { adminDb, adminAuth } from '@/lib/firebase/admin'

// Achievement definitions
const ACHIEVEMENTS = [
  {
    id: 'early_adopter',
    name: 'Early Adopter',
    description: 'Joined in the first month',
    icon: 'Award',
    color: 'text-purple-500',
    condition: (stats: any) => {
      const joinDate = stats.userCreatedAt?.toDate?.() || new Date()
      const monthsDiff = (Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
      return monthsDiff >= 1 // User has been around for at least a month
    },
  },
  {
    id: 'first_component',
    name: 'First Component',
    description: 'Published your first component',
    icon: 'Package',
    color: 'text-blue-500',
    condition: (stats: any) => stats.components >= 1,
  },
  {
    id: 'popular_creator',
    name: 'Popular Creator',
    description: 'Reached 1,000 downloads',
    icon: 'TrendingUp',
    color: 'text-green-500',
    condition: (stats: any) => stats.downloads >= 1000,
  },
  {
    id: 'top_contributor',
    name: 'Top Contributor',
    description: 'Published 10+ components',
    icon: 'Star',
    color: 'text-yellow-500',
    condition: (stats: any) => stats.components >= 10,
  },
  {
    id: 'community_favorite',
    name: 'Community Favorite',
    description: 'Received 100+ favorites',
    icon: 'Heart',
    color: 'text-red-500',
    condition: (stats: any) => stats.favorites >= 100,
  },
  {
    id: 'trending_creator',
    name: 'Trending Creator',
    description: 'Reached 10,000 views',
    icon: 'Eye',
    color: 'text-blue-600',
    condition: (stats: any) => stats.views >= 10000,
  },
  {
    id: 'influencer',
    name: 'Influencer',
    description: 'Gained 100+ followers',
    icon: 'Users',
    color: 'text-indigo-500',
    condition: (stats: any) => stats.followers >= 100,
  },
  {
    id: 'prolific_creator',
    name: 'Prolific Creator',
    description: 'Published 25+ components',
    icon: 'Zap',
    color: 'text-orange-500',
    condition: (stats: any) => stats.components >= 25,
  },
]

// GET - Fetch user's achievements
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

    // Get user's components to calculate stats
    const componentsSnapshot = await adminDb
      .collection('components')
      .where('authorId', '==', userId)
      .get()

    const components = componentsSnapshot.docs.map(doc => doc.data())

    // Calculate stats
    const stats = {
      components: components.length,
      downloads: components.reduce((sum: number, c: any) => sum + (c.downloads || c.copies || 0), 0),
      views: components.reduce((sum: number, c: any) => sum + (c.views || 0), 0),
      favorites: components.reduce((sum: number, c: any) => sum + (c.likes || 0), 0),
      followers: userData?.followers || 0,
      userCreatedAt: userData?.createdAt,
    }

    // Calculate which achievements the user has earned
    const earnedAchievements = ACHIEVEMENTS.filter(achievement => 
      achievement.condition(stats)
    ).map(({ condition, ...achievement }) => achievement) // Remove condition function from response

    return NextResponse.json({ achievements: earnedAchievements })
  } catch (error) {
    console.error('Error fetching achievements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch achievements' },
      { status: 500 }
    )
  }
}
