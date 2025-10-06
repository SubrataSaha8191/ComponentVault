"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  LayoutGrid,
  Heart,
  Upload,
  BarChart3,
  Eye,
  Download,
  Star,
  Edit,
  Trash2,
  FolderPlus,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Users,
  Code,
  ImageIcon,
  ChevronRight,
  Check,
  AlertCircle,
  Sparkles,
  Zap,
  MessageSquare,
  ThumbsUp,
  Share2,
  Bell,
  Calendar,
  Award,
  Filter,
  Search,
  Loader2,
  Plus,
  User,
} from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { useAuth } from "@/contexts/auth-context"
import { 
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { Component, Collection } from "@/lib/firebase/types"
import debugFirebase from "@/lib/firebase/debug"
import Link from "next/link"
import { toast } from "sonner"
import ClientOnly from "@/components/client-only"

// Define Activity interface locally since it's causing import conflicts
interface Activity {
  id: string
  type: string
  description: string
  createdAt: Date | string
  userId: string
  componentId?: string
  collectionId?: string
}

interface UserStats {
  totalComponents: number
  totalViews: number
  totalDownloads: number
  totalLikes: number
  avgRating: number
  totalCollections: number
  followers: number
  following: number
}

interface ComponentAnalytics {
  name: string
  views: number
  downloads: number
  likes: number
}

// Upload result interface
interface UploadResult {
  downloadURL: string
  path: string
  fileName: string
  size?: number
  contentType?: string
  storageMethod: string
  deleteUrl?: string
}

const getUserComponents = async (userId: string): Promise<Component[]> => {
  try {
    // Use simple query without orderBy to avoid index requirement
    const q = query(
      collection(db, "components"),
      where("authorId", "==", userId)
    )
    const querySnapshot = await getDocs(q)
    const components = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Component))
    
    // Sort manually by createdAt
    return components.sort((a, b) => {
      const aDate = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt)
      const bDate = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt)
      return bDate.getTime() - aDate.getTime()
    })
  } catch (error) {
    console.error("Error fetching user components:", error)
    return []
  }
}

const getUserCollections = async (userId: string): Promise<Collection[]> => {
  try {
    // Use simple query without orderBy to avoid index requirement
    const q = query(
      collection(db, "collections"),
      where("userId", "==", userId)
    )
    const querySnapshot = await getDocs(q)
    const collections = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Collection))
    
    // Sort manually by createdAt
    return collections.sort((a, b) => {
      const aDate = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt)
      const bDate = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt)
      return bDate.getTime() - aDate.getTime()
    })
  } catch (error) {
    console.error("Error fetching user collections:", error)
    return []
  }
}

const getUserActivities = async (userId: string): Promise<Activity[]> => {
  try {
    // Use simple query without orderBy to avoid index requirement
    const q = query(
      collection(db, "userActivities"),
      where("userId", "==", userId),
      limit(20)
    )
    const querySnapshot = await getDocs(q)
    const activities = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    } as Activity))
    
    // Sort manually by createdAt descending
    return activities.sort((a, b) => {
      const aDate = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt)
      const bDate = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt)
      return bDate.getTime() - aDate.getTime()
    })
  } catch (error) {
    console.error("Error fetching user activities:", error)
    return []
  }
}

const getUserFavorites = async (userId: string): Promise<Component[]> => {
  try {
    // Get user's favorite component IDs
    const favoritesQuery = query(
      collection(db, "favorites"), 
      where("userId", "==", userId)
    )
    const favoritesSnapshot = await getDocs(favoritesQuery)
    const favoriteComponentIds = favoritesSnapshot.docs.map(doc => doc.data().componentId)
    
    if (favoriteComponentIds.length === 0) {
      return []
    }
    
    // Get favorite components - we'll need to query in batches due to Firestore's 'in' limit
    const favorites: Component[] = []
    const batchSize = 10 // Firestore 'in' limit
    
    for (let i = 0; i < favoriteComponentIds.length; i += batchSize) {
      const batch = favoriteComponentIds.slice(i, i + batchSize)
      const componentsQuery = query(
        collection(db, "components"),
        where("__name__", "in", batch)
      )
      const componentsSnapshot = await getDocs(componentsQuery)
      
      componentsSnapshot.docs.forEach(doc => {
        favorites.push({
          id: doc.id,
          ...doc.data()
        } as Component)
      })
    }
    
    return favorites
  } catch (error) {
    console.error("Error fetching user favorites:", error)
    return []
  }
}

const createComponent = async (componentData: any) => {
  try {
    const docRef = await addDoc(collection(db, "components"), {
      ...componentData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating component:", error)
    throw error
  }
}

const deleteComponent = async (componentId: string) => {
  try {
    await deleteDoc(doc(db, "components", componentId))
  } catch (error) {
    console.error("Error deleting component:", error)
    throw error
  }
}

// Alternative image upload function using base64 and free hosting services
const uploadComponentImages = async (file: File, folderPath: string): Promise<UploadResult> => {
  try {
    // Validate file
    if (!file) {
      throw new Error('No file provided')
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload an image (JPEG, PNG, GIF, or WebP)')
    }

    // Validate file size (max 5MB for free services)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      throw new Error('File too large. Please upload an image smaller than 5MB')
    }

    // Method 1: Convert to base64 for storage in Firestore (recommended for small images)
    if (file.size <= 1024 * 1024) { // 1MB or less - store as base64
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const base64String = reader.result as string
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${file.name.split('.').pop()?.toLowerCase() || 'jpg'}`
          
          resolve({
            downloadURL: base64String,
            path: `${folderPath}/${fileName}`,
            fileName: fileName,
            size: file.size,
            contentType: file.type,
            storageMethod: 'base64'
          })
        }
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsDataURL(file)
      })
    }

    // Method 2: Use ImgBB free image hosting (for larger images)
    // You can get a free API key from https://api.imgbb.com/
    const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY
    
    if (IMGBB_API_KEY && IMGBB_API_KEY !== 'your_imgbb_api_key_here') {
      try {
        console.log('Uploading to ImgBB...')
        
        const formData = new FormData()
        formData.append('image', file)
        formData.append('key', IMGBB_API_KEY)
        formData.append('name', `component_${Date.now()}`)
        
        const response = await fetch('https://api.imgbb.com/1/upload', {
          method: 'POST',
          body: formData
        })
        
        if (!response.ok) {
          throw new Error(`ImgBB upload failed: ${response.statusText}`)
        }
        
        const data = await response.json()
        
        if (data.success) {
          console.log('ImgBB upload successful:', data.data.url)
          return {
            downloadURL: data.data.url,
            path: data.data.url_viewer,
            fileName: data.data.title,
            size: data.data.size,
            contentType: file.type,
            storageMethod: 'imgbb',
            deleteUrl: data.data.delete_url
          }
        } else {
          throw new Error(`ImgBB upload failed: ${data.error?.message || 'Unknown error'}`)
        }
      } catch (imgbbError) {
        console.warn('ImgBB upload failed, falling back to base64:', imgbbError)
        // Fall back to base64 if ImgBB fails
      }
    }

    // Method 3: Fallback to base64 with compression for larger files
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        // Calculate new dimensions (max 800x600 for compression)
        let { width, height } = img
        const maxWidth = 800
        const maxHeight = 600
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width *= ratio
          height *= ratio
        }
        
        canvas.width = width
        canvas.height = height
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height)
        const compressedBase64 = canvas.toDataURL(file.type, 0.8) // 80% quality
        
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${file.name.split('.').pop()?.toLowerCase() || 'jpg'}`
        
        resolve({
          downloadURL: compressedBase64,
          path: `${folderPath}/${fileName}`,
          fileName: fileName,
          size: compressedBase64.length,
          contentType: file.type,
          storageMethod: 'base64_compressed'
        })
      }
      
      img.onerror = () => reject(new Error('Failed to process image'))
      img.src = URL.createObjectURL(file)
    })

  } catch (error: any) {
    console.error("Image upload error:", error)
    throw new Error(`Upload failed: ${error.message || 'Unknown error occurred'}`)
  }
}

export default function DashboardPage() {
  return (
    <ClientOnly>
      <DashboardContent />
    </ClientOnly>
  )
}

function DashboardContent() {
  const [activeTab, setActiveTab] = useState("my-components")
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [userComponents, setUserComponents] = useState<Component[]>([])
  const [userCollections, setUserCollections] = useState<Collection[]>([])
  const [userActivities, setUserActivities] = useState<Activity[]>([])
  const [userStats, setUserStats] = useState<UserStats>({
    totalComponents: 0,
    totalViews: 0,
    totalDownloads: 0,
    totalLikes: 0,
    avgRating: 0,
    totalCollections: 0,
    followers: 0,
    following: 0
  })
  const [favorites, setFavorites] = useState<Component[]>([])
  const [analyticsData, setAnalyticsData] = useState<ComponentAnalytics[]>([])

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        
        // Load user components
        const components = await getUserComponents(user.uid)
        setUserComponents(components)

        // Load user collections
        const collections = await getUserCollections(user.uid)
        setUserCollections(collections)

        // Load user activities
        const activities = await getUserActivities(user.uid)
        setUserActivities(activities)

        // Load user favorites
        const favoriteComponents = await getUserFavorites(user.uid)
        setFavorites(favoriteComponents)

        // Calculate user stats from loaded data
        const stats: UserStats = {
          totalComponents: components.length,
          totalViews: components.reduce((sum, comp) => sum + (comp.stats?.views || 0), 0),
          totalDownloads: components.reduce((sum, comp) => sum + (comp.stats?.downloads || 0), 0),
          totalLikes: components.reduce((sum, comp) => sum + (comp.stats?.likes || 0), 0),
          avgRating: components.length > 0 
            ? components.reduce((sum, comp) => sum + (comp.stats?.rating || 0), 0) / components.length 
            : 0,
          totalCollections: collections.length,
          followers: 0, // You can implement this later
          following: 0  // You can implement this later
        }
        setUserStats(stats)

        // Prepare analytics data with proper null checks
        const analytics = components.slice(0, 10).map(comp => ({
          name: comp.name || comp.title || 'Untitled Component',
          views: comp.stats?.views || comp.views || 0,
          downloads: comp.stats?.downloads || comp.downloads || 0,
          likes: comp.stats?.likes || comp.likes || 0
        }))
        setAnalyticsData(analytics)

      } catch (error) {
        console.error('Error loading user data:', error)
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [user])

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center bg-slate-900/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-black" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Please Sign In</h2>
            <p className="text-gray-400 mb-4">You need to be authenticated to access your dashboard</p>
            <Link href="/auth/signin">
              <Button className="bg-amber-500 hover:bg-amber-600 text-black">
                Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-amber-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const chartData = analyticsData?.map(item => ({
    name: (item.name || 'Unnamed').slice(0, 15) + (item.name && item.name.length > 15 ? '...' : ''),
    views: item.views || 0,
    downloads: item.downloads || 0,
    likes: item.likes || 0
  })) || []

  const pieData = [
    { name: 'Published', value: userComponents?.filter(c => c.isPublished !== false).length || 0, color: '#10b981' },
    { name: 'Draft', value: userComponents?.filter(c => c.isPublished === false).length || 0, color: '#f59e0b' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-5 pointer-events-none" />
      <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-amber-400/10 to-yellow-300/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-gradient-to-tl from-purple-400/10 to-blue-300/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container relative mx-auto px-4 py-8">
        <div className="mb-12">
          <div className="flex justify-between items-start">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 backdrop-blur-sm border border-amber-400/30 mb-6 shadow-lg shadow-amber-500/10">
                <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
                <span className="text-sm font-semibold bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 bg-clip-text text-transparent">
                  Welcome back, {user.displayName || 'Developer'}!
                </span>
              </div>
              <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-gray-100 via-white to-gray-100 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-400 text-lg">Manage your components and track performance</p>
            </div>
            
            {/* Debug Button - Development Only */}
            {process.env.NODE_ENV === 'development' && (
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  console.log('🔍 Running Firebase Debug Tests (No Storage)...')
                  toast.info('Running Firebase connectivity tests...')
                  try {
                    const results = await debugFirebase.runAllTests()
                    const envCheck = debugFirebase.checkEnvVars()
                    
                    if (results.auth && results.firestore && results.imageUpload && envCheck.allSet) {
                      if (results.firestoreWrite && results.componentCreation) {
                        toast.success('✅ All Firebase services working! Ready to upload components.')
                      } else {
                        toast.error('❌ Permission issues detected. Check Firestore security rules.')
                        console.log('🔧 To fix permissions:')
                        console.log('1. Go to Firebase Console → Firestore → Rules')
                        console.log('2. Copy rules from firestore-rules-updated.txt')
                        console.log('3. Publish the new rules')
                      }
                    } else {
                      toast.error('❌ Some Firebase services have issues. Check console for details.')
                    }
                  } catch (error) {
                    console.error('Debug test failed:', error)
                    toast.error('Debug test failed. Check console for details.')
                  }
                }}
                className="border-blue-400/30 text-blue-300 hover:bg-blue-400/10"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Debug Firebase
              </Button>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="hidden sm:flex justify-center lg:justify-start">
            <TabsList className="inline-flex w-full h-auto bg-slate-800/50 backdrop-blur-sm border border-amber-400/20 p-1.5 rounded-xl shadow-lg shadow-amber-500/10">
              <TabsTrigger 
                value="my-components" 
                className="flex items-center justify-center gap-2 px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 rounded-lg text-gray-300 hover:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-black transition-all duration-300 font-medium text-xs sm:text-sm whitespace-nowrap min-w-fit"
              >
                <LayoutGrid className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="font-semibold">My Components</span>
              </TabsTrigger>
              <TabsTrigger 
                value="favorites" 
                className="flex items-center justify-center gap-2 px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 rounded-lg text-gray-300 hover:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-black transition-all duration-300 font-medium text-xs sm:text-sm whitespace-nowrap min-w-fit"
              >
                <Heart className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="font-semibold">Favorites</span>
              </TabsTrigger>
              <TabsTrigger 
                value="submissions" 
                className="flex items-center justify-center gap-2 px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 rounded-lg text-gray-300 hover:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-black transition-all duration-300 font-medium text-xs sm:text-sm whitespace-nowrap min-w-fit"
              >
                <Upload className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="font-semibold">Submit</span>
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="flex items-center justify-center gap-2 px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 rounded-lg text-gray-300 hover:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-black transition-all duration-300 font-medium text-xs sm:text-sm whitespace-nowrap min-w-fit"
              >
                <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="font-semibold">Analytics</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* My Components Tab */}
          <TabsContent value="my-components" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="relative overflow-hidden bg-slate-900/50 backdrop-blur-sm border-2 border-slate-700/50 hover:border-purple-400/30 transition-all duration-300">
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-blue-300/10 rounded-full blur-2xl" />
                <CardHeader className="pb-3 relative z-10">
                  <CardDescription className="text-gray-400">Total Components</CardDescription>
                  <CardTitle className="text-4xl bg-gradient-to-r from-purple-200 via-blue-100 to-purple-200 bg-clip-text text-transparent">
                    {userStats.totalComponents}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="flex items-center text-sm text-purple-400">
                    <Code className="h-4 w-4 mr-1" />
                    <span>{userComponents.filter(c => c.isPublished !== false).length} published</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden bg-slate-900/50 backdrop-blur-sm border-2 border-slate-700/50 hover:border-amber-400/30 transition-all duration-300">
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-yellow-300/10 rounded-full blur-2xl" />
                <CardHeader className="pb-3 relative z-10">
                  <CardDescription className="text-gray-400">Total Views</CardDescription>
                  <CardTitle className="text-4xl bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 bg-clip-text text-transparent">
                    {userStats.totalViews.toLocaleString()}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="flex items-center text-sm text-emerald-400">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>All time</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden bg-slate-900/50 backdrop-blur-sm border-2 border-slate-700/50 hover:border-yellow-400/30 transition-all duration-300">
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-amber-300/10 rounded-full blur-2xl" />
                <CardHeader className="pb-3 relative z-10">
                  <CardDescription className="text-gray-400">Avg Rating</CardDescription>
                  <CardTitle className="text-4xl text-white">
                    {userStats.avgRating.toFixed(1)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="flex items-center text-sm text-gray-400">
                    <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                    <span>Based on {userStats.totalLikes} likes</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden bg-slate-900/50 backdrop-blur-sm border-2 border-slate-700/50 hover:border-emerald-400/30 transition-all duration-300">
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-green-300/10 rounded-full blur-2xl" />
                <CardHeader className="pb-3 relative z-10">
                  <CardDescription className="text-gray-400">Downloads</CardDescription>
                  <CardTitle className="text-4xl text-white">
                    {userStats.totalDownloads.toLocaleString()}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="flex items-center text-sm text-emerald-400">
                    <Download className="h-4 w-4 mr-1" />
                    <span>Total downloads</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Components Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {(userComponents?.length || 0) > 0 ? (
                userComponents.map((component) => (
                  <ComponentCard 
                    key={component.id} 
                    component={component} 
                    onUpdate={() => {
                      // Reload components after update
                      getUserComponents(user.uid).then(setUserComponents)
                    }}
                  />
                ))
              ) : (
                <div className="col-span-full">
                  <Card className="p-12 text-center bg-slate-900/30 border-slate-700/50">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Code className="h-8 w-8 text-amber-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No Components Yet</h3>
                    <p className="text-gray-400 mb-6">Start by uploading your first component to share with the community</p>
                    <Button 
                      onClick={() => setActiveTab("submissions")}
                      className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:from-amber-600 hover:to-yellow-600"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Upload Component
                    </Button>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-6">
            <FavoritesSection favorites={favorites} />
          </TabsContent>

          {/* Submissions Tab */}
          <TabsContent value="submissions" className="space-y-6">
            <SubmissionForm 
              onSuccess={() => {
                // Reload components after successful submission
                getUserComponents(user.uid).then(setUserComponents)
                setActiveTab("my-components")
              }} 
            />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsSection 
              chartData={chartData}
              pieData={pieData}
              userStats={userStats}
              activities={userActivities}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Component Card Component
function ComponentCard({ component, onUpdate }: { component: Component; onUpdate: () => void }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this component?')) return
    
    try {
      setIsDeleting(true)
      await deleteComponent(component.id)
      toast.success('Component deleted successfully')
      onUpdate()
    } catch (error) {
      console.error('Error deleting component:', error)
      toast.error('Failed to delete component')
    } finally {
      setIsDeleting(false)
    }
  }

  const getStatusColor = (isPublished: boolean) => {
    return isPublished 
      ? 'bg-green-500/20 text-green-400 border-green-500/30'
      : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
  }

  return (
    <Card className="group relative overflow-hidden bg-slate-900/50 backdrop-blur-sm border-2 border-slate-700/50 hover:border-amber-400/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/20">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="relative z-10">
        <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg mb-3 overflow-hidden relative">
          {component.previewImage || component.thumbnail ? (
            <img 
              src={component.previewImage || component.thumbnail} 
              alt={component.name || component.title || 'Component preview'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Code className="h-12 w-12 text-slate-500" />
            </div>
          )}
          <Badge 
            className={`absolute top-2 left-2 ${getStatusColor(component.isPublished !== false)}`}
          >
            {component.isPublished !== false ? 'Published' : 'Draft'}
          </Badge>
        </div>
        <CardTitle className="text-lg text-white group-hover:text-amber-200 transition-colors">
          {component.name || component.title || 'Untitled Component'}
        </CardTitle>
        <CardDescription className="text-gray-400 line-clamp-2">
          {component.description || 'No description available'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 relative z-10">
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="flex items-center gap-1 text-gray-400">
            <Eye className="h-4 w-4" />
            <span>{component.stats?.views || 0}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <Download className="h-4 w-4" />
            <span>{component.stats?.downloads || 0}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{component.stats?.rating?.toFixed(1) || "N/A"}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-xs bg-slate-800 text-gray-300 border-slate-700">
            {component.framework || 'react'}
          </Badge>
          <Badge variant="outline" className="text-xs bg-slate-800 text-gray-300 border-slate-700">
            {component.category || 'other'}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1 bg-slate-800/50 border-slate-700 text-gray-300 hover:bg-amber-500 hover:text-black hover:border-amber-400 transition-all"
            asChild
          >
            <Link href={`/components/${component.id}/edit`}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Link>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 bg-slate-800/50 border-slate-700 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-400 transition-all"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 mr-1" />
            )}
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Favorites Section Component
function FavoritesSection({ favorites }: { favorites: Component[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Favorite Components</h2>
        <Badge variant="secondary" className="bg-slate-800 text-gray-300">
          {favorites.length} components
        </Badge>
      </div>
      
      {favorites.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((component) => (
            <Card key={component.id} className="group relative overflow-hidden bg-slate-900/50 backdrop-blur-sm border-2 border-slate-700/50 hover:border-pink-400/50 transition-all duration-300">
              <CardHeader>
                <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg mb-3 overflow-hidden">
                  {component.previewImage || component.thumbnail ? (
                    <img 
                      src={component.previewImage || component.thumbnail} 
                      alt={component.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Code className="h-12 w-12 text-slate-500" />
                    </div>
                  )}
                  <Button size="icon" variant="secondary" className="absolute top-2 right-2 h-8 w-8 bg-slate-900/80 backdrop-blur-sm hover:bg-slate-900">
                    <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                  </Button>
                </div>
                <CardTitle className="text-lg text-white">{component.name}</CardTitle>
                <CardDescription className="text-gray-400">by {component.authorName}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-gray-400">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{component.stats?.rating?.toFixed(1) || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Download className="h-4 w-4" />
                    <span>{component.stats?.downloads || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center bg-slate-900/30 border-slate-700/50">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-pink-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Favorites Yet</h3>
          <p className="text-gray-400 mb-6">Start exploring components and add your favorites here</p>
          <Button asChild className="bg-gradient-to-r from-pink-500 to-red-500 text-white hover:from-pink-600 hover:to-red-600">
            <Link href="/browse">
              <Search className="h-4 w-4 mr-2" />
              Browse Components
            </Link>
          </Button>
        </Card>
      )}
    </div>
  )
}

// Submission Form Component
function SubmissionForm({ onSuccess }: { onSuccess: () => void }) {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const { user } = useAuth()
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    frameworks: [] as string[],
    tags: "",
    license: "",
    code: "",
    componentImage: null as File | null,
    githubUrl: "",
    screenshot: null as File | null,
    thumbnail: null as File | null,
  })

  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const totalSteps = 4
  
  // Calculate progress based on filled fields, not just step number
  const calculateProgress = () => {
    let filledFields = 0
    const totalRequiredFields = 9 // Core required fields for a complete component
    
    // Step 1 fields (Basic Info)
    if (formData.name.trim()) filledFields++
    if (formData.description.trim()) filledFields++
    if (formData.category) filledFields++
    if (formData.frameworks && formData.frameworks.length > 0) filledFields++
    
    // Step 2 fields (Code & Tags)
    if (formData.code.trim()) filledFields++
    if (formData.tags.trim()) filledFields++
    
    // Step 3 fields (Images - at least one required)
    if (formData.componentImage) filledFields++
    if (formData.screenshot) filledFields++
    if (formData.thumbnail) filledFields++
    
    // Minimum progress should be 0%, maximum 100%
    const percentage = Math.round((filledFields / totalRequiredFields) * 100)
    return Math.min(percentage, 100)
  }
  
  const progress = calculateProgress()

  const frameworks = ["React", "Vue", "Angular", "Svelte", "Solid", "Next.js", "Nuxt", "SvelteKit"]
  const categories = ["button", "card", "form", "input", "navigation", "modal", "table", "layout", "chart", "authentication", "dashboard", "animation"]
  const licenses = ["MIT", "Apache 2.0", "GPL-3.0", "BSD-3-Clause", "ISC"]

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1)
  }

  const handlePrev = () => {
    if (step > 1) setStep(step - 1)
  }

  // Handle image upload and preview
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }

      setFormData({ ...formData, componentImage: file })
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Remove uploaded image
  const handleRemoveImage = () => {
    setFormData({ ...formData, componentImage: null })
    setImagePreview(null)
  }

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please log in to submit components')
      return
    }

    // Additional check for user authentication
    if (!user.uid) {
      toast.error('Authentication error. Please sign out and sign in again.')
      return
    }

    try {
      setIsSubmitting(true)

      // Initialize URLs and storage method tracking
      let thumbnailUrl = ""
      let screenshotUrl = ""
      let componentImageUrl = ""
      let uploadErrors = []
      let storageMethodsUsed = []

      // Upload images with individual error handling - don't fail entire submission for image upload issues
      if (formData.thumbnail) {
        try {
          console.log('Uploading thumbnail...')
          const thumbnailResult = await uploadComponentImages(formData.thumbnail, 'thumbnails') as UploadResult
          thumbnailUrl = thumbnailResult.downloadURL
          storageMethodsUsed.push(`Thumbnail: ${thumbnailResult.storageMethod}`)
          console.log('Thumbnail uploaded successfully:', thumbnailUrl)
        } catch (error: any) {
          console.error('Error uploading thumbnail:', error)
          uploadErrors.push(`Thumbnail: ${error.message}`)
          toast.error(`Thumbnail upload failed: ${error.message}`)
        }
      }

      if (formData.screenshot) {
        try {
          console.log('Uploading screenshot...')
          const screenshotResult = await uploadComponentImages(formData.screenshot, 'screenshots') as UploadResult
          screenshotUrl = screenshotResult.downloadURL
          storageMethodsUsed.push(`Screenshot: ${screenshotResult.storageMethod}`)
          console.log('Screenshot uploaded successfully:', screenshotUrl)
        } catch (error: any) {
          console.error('Error uploading screenshot:', error)
          uploadErrors.push(`Screenshot: ${error.message}`)
          toast.error(`Screenshot upload failed: ${error.message}`)
        }
      }

      if (formData.componentImage) {
        try {
          console.log('Uploading component image...')
          const componentImageResult = await uploadComponentImages(formData.componentImage, 'component-images') as UploadResult
          componentImageUrl = componentImageResult.downloadURL
          storageMethodsUsed.push(`Component Image: ${componentImageResult.storageMethod}`)
          console.log('Component image uploaded successfully:', componentImageUrl)
        } catch (error: any) {
          console.error('Error uploading component image:', error)
          uploadErrors.push(`Component Image: ${error.message}`)
          toast.error(`Component image upload failed: ${error.message}`)
        }
      }

      // Create component data with validation
      const componentData = {
        title: formData.name || 'Untitled Component',
        name: formData.name || 'Untitled Component',
        description: formData.description || 'No description provided',
        category: formData.category || 'other',
        framework: formData.frameworks[0] || 'react',
        frameworks: formData.frameworks || ['react'],
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        license: formData.license || 'MIT',
        code: formData.code || '// No code provided',
        componentImage: componentImageUrl,
        githubUrl: formData.githubUrl || '',
        thumbnail: thumbnailUrl,
        thumbnailImage: thumbnailUrl,
        previewImage: screenshotUrl,
        authorId: user.uid,
        authorName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        authorEmail: user.email || '',
        authorAvatar: user.photoURL || '',
        isPublic: true,
        isPublished: true,
        isPremium: false,
        isFeatured: false,
        language: 'typescript',
        styling: 'tailwind',
        dependencies: [],
        likes: 0,
        views: 0,
        copies: 0,
        version: '1.0.0',
        sourceType: 'custom',
        stats: {
          views: 0,
          downloads: 0,
          likes: 0,
          rating: 0,
          totalRatings: 0
        }
      }

      console.log('Creating component with data:', componentData)
      
      // Create component in Firestore
      const componentId = await createComponent(componentData)
      console.log('Component created successfully with ID:', componentId)
      
      // Show success message with storage method information
      if (uploadErrors.length > 0) {
        toast.success(
          `Component uploaded successfully! Note: Some images failed to upload: ${uploadErrors.join(', ')}`
        )
      } else {
        let storageInfo = ''
        if (storageMethodsUsed.length > 0) {
          const methods = storageMethodsUsed.map(m => m.split(': ')[1])
          const uniqueMethods = [...new Set(methods)]
          if (uniqueMethods.includes('imgbb')) {
            storageInfo = ' (Images hosted on ImgBB)'
          } else if (uniqueMethods.includes('base64') || uniqueMethods.includes('base64_compressed')) {
            storageInfo = ' (Images stored as base64)'
          }
        }
        toast.success(`Component uploaded successfully with all images!${storageInfo}`)
      }
      
      setShowSuccess(true)
      
      setTimeout(() => {
        setShowSuccess(false)
        onSuccess()
      }, 2500)

    } catch (error: any) {
      console.error('Error submitting component:', error)
      
      // Enhanced error messaging
      let errorMessage = 'Failed to upload component'
      
      if (error?.code === 'permission-denied') {
        errorMessage = 'Permission denied. Please check Firestore security rules and ensure you are authenticated.'
        console.log('🔧 To fix permission errors:')
        console.log('1. Go to Firebase Console → Firestore → Rules')
        console.log('2. Copy rules from firestore-rules-updated.txt file')
        console.log('3. Publish the new rules')
        console.log('4. Make sure you are signed in')
      } else if (error?.code === 'unavailable') {
        errorMessage = 'Service temporarily unavailable. Please try again.'
      } else if (error?.code === 'deadline-exceeded') {
        errorMessage = 'Request timeout. Please check your connection and try again.'
      } else if (error?.code === 'unauthenticated') {
        errorMessage = 'Authentication required. Please sign in and try again.'
      } else if (error?.message) {
        errorMessage = `Upload failed: ${error.message}`
      }
      
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showSuccess) {
    return (
      <Card className="max-w-2xl mx-auto bg-slate-900/50 backdrop-blur-sm border-2 border-slate-700/50">
        <CardContent className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Component Uploaded!</h3>
          <p className="text-gray-400">Your component has been successfully uploaded and is now available to the community.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-4xl mx-auto bg-slate-900/50 backdrop-blur-sm border-2 border-slate-700/50">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-white">Upload Component</CardTitle>
            <CardDescription className="text-gray-400">Step {step} of {totalSteps}</CardDescription>
          </div>
          <Badge variant="secondary" className="bg-amber-500/20 text-amber-300 border-amber-400/30">
            {Math.round(progress)}% Complete
          </Badge>
        </div>
        <Progress value={progress} className="h-2 bg-slate-800" />
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Component Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Animated Card Component"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-slate-800/50 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your component's features and use cases..."
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-slate-800/50 border-slate-700 text-white"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-white">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Frameworks *</Label>
                <div className="grid grid-cols-2 gap-2">
                  {frameworks.map((framework) => (
                    <div key={framework} className="flex items-center space-x-2">
                      <Checkbox
                        id={framework}
                        checked={formData.frameworks.includes(framework)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              frameworks: [...formData.frameworks, framework]
                            })
                          } else {
                            setFormData({
                              ...formData,
                              frameworks: formData.frameworks.filter(f => f !== framework)
                            })
                          }
                        }}
                      />
                      <Label htmlFor={framework} className="text-sm text-gray-300">
                        {framework}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Code & Image */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="code" className="text-white">Code *</Label>
              <Textarea
                id="code"
                placeholder="Paste your component code here..."
                rows={12}
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="bg-slate-800/50 border-slate-700 text-white font-mono text-sm"
              />
            </div>

            {/* Component Image Upload */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-white">Component Image</Label>
                <p className="text-sm text-gray-400">Upload a visual representation of your component</p>
              </div>
              
              {!imagePreview ? (
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-amber-500 transition-colors cursor-pointer"
                     onClick={() => document.getElementById('component-image')?.click()}>
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-white mb-2">Upload Component Image</h4>
                  <p className="text-gray-400 mb-4">
                    Click to browse or drag and drop your component image here
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, JPEG up to 5MB
                  </p>
                  <input
                    id="component-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Component preview"
                    className="w-full max-h-64 object-contain rounded-lg bg-slate-800"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveImage}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              )}
            </div>

            {/* GitHub URL */}
            <div className="space-y-2">
              <Label htmlFor="githubUrl" className="text-white">GitHub URL (Optional)</Label>
              <Input
                id="githubUrl"
                placeholder="https://github.com/username/repo"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="bg-slate-800/50 border-slate-700 text-white"
              />
              <p className="text-sm text-gray-400">Link to your component's source code repository</p>
            </div>
          </div>
        )}

        {/* Step 3: Additional Images */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="thumbnail" className="text-white">Thumbnail Image</Label>
              <Input
                id="thumbnail"
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.files?.[0] || null })}
                className="bg-slate-800/50 border-slate-700 text-white"
              />
              <p className="text-sm text-gray-400">Small preview image for cards and listings (Recommended: 400x300px, max 2MB)</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="screenshot" className="text-white">Screenshot</Label>
              <Input
                id="screenshot"
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, screenshot: e.target.files?.[0] || null })}
                className="bg-slate-800/50 border-slate-700 text-white"
              />
              <p className="text-sm text-gray-400">Detailed component preview image for the component page (max 5MB)</p>
            </div>
          </div>
        )}

        {/* Step 4: Metadata */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-white">Tags</Label>
              <Input
                id="tags"
                placeholder="animation, card, hover, gradient (comma separated)"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="bg-slate-800/50 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="license" className="text-white">License *</Label>
              <Select
                value={formData.license}
                onValueChange={(value) => setFormData({ ...formData, license: value })}
              >
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                  <SelectValue placeholder="Select a license" />
                </SelectTrigger>
                <SelectContent>
                  {licenses.map((license) => (
                    <SelectItem key={license} value={license}>
                      {license}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Summary */}
            <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700">
              <h4 className="font-semibold text-white mb-2">Component Summary</h4>
              <div className="space-y-1 text-sm text-gray-400">
                <p><span className="text-white">Name:</span> {formData.name || 'Not specified'}</p>
                <p><span className="text-white">Category:</span> {formData.category || 'Not specified'}</p>
                <p><span className="text-white">Frameworks:</span> {formData.frameworks.join(', ') || 'Not specified'}</p>
                <p><span className="text-white">License:</span> {formData.license || 'Not specified'}</p>
                <p><span className="text-white">Component Image:</span> {formData.componentImage ? 'Uploaded' : 'Not uploaded'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={step === 1}
            className="bg-slate-800/50 border-slate-700 text-gray-300 hover:bg-slate-700"
          >
            Previous
          </Button>
          
          {step < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={!formData.name || !formData.description || formData.frameworks.length === 0}
              className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:from-amber-600 hover:to-yellow-600"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.code || !formData.license}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Submit Component
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Analytics Section Component
function AnalyticsSection({ 
  chartData, 
  pieData, 
  userStats, 
  activities 
}: { 
  chartData: any[]; 
  pieData: any[]; 
  userStats: UserStats;
  activities: Activity[];
}) {
  return (
    <div className="space-y-6">
      {/* Analytics Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-slate-900/50 backdrop-blur-sm border-2 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Component Performance</CardTitle>
            <CardDescription className="text-gray-400">Views, downloads, and likes over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }} 
                />
                <Legend />
                <Bar dataKey="views" fill="#3B82F6" name="Views" />
                <Bar dataKey="downloads" fill="#10B981" name="Downloads" />
                <Bar dataKey="likes" fill="#F59E0B" name="Likes" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 backdrop-blur-sm border-2 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Component Status</CardTitle>
            <CardDescription className="text-gray-400">Published vs draft components</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-slate-900/50 backdrop-blur-sm border-2 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription className="text-gray-400">Your latest actions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          {activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={activity.id || index} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full flex items-center justify-center">
                    <ActivityIcon type={activity.type} />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.description}</p>
                    <p className="text-gray-400 text-xs">
                      {activity.createdAt instanceof Date 
                        ? activity.createdAt.toLocaleDateString() 
                        : 'Recently'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Zap className="h-12 w-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">No recent activity</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Activity Icon Helper
function ActivityIcon({ type }: { type: string }) {
  switch (type) {
    case 'upload':
      return <Upload className="h-4 w-4 text-black" />
    case 'like':
      return <Heart className="h-4 w-4 text-black" />
    case 'comment':
      return <MessageSquare className="h-4 w-4 text-black" />
    case 'collection':
      return <FolderPlus className="h-4 w-4 text-black" />
    case 'follow':
      return <Users className="h-4 w-4 text-black" />
    default:
      return <Zap className="h-4 w-4 text-black" />
  }
}