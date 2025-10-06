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
  Trophy,
  Sparkles,
  ImageIcon,
  ChevronRight,
  Check,
  AlertCircle,
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
    // Verify userId is valid
    if (!userId) {
      console.warn("getUserComponents called without valid userId")
      return []
    }

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
  } catch (error: any) {
    console.error("Error fetching user components:", error)
    if (error?.code === 'permission-denied') {
      console.error("Permission denied: Make sure you're authenticated and Firestore rules allow reading your components")
    }
    return []
  }
}

const getUserCollections = async (userId: string): Promise<Collection[]> => {
  try {
    // Verify userId is valid
    if (!userId) {
      console.warn("getUserCollections called without valid userId")
      return []
    }

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
  } catch (error: any) {
    console.error("Error fetching user collections:", error)
    if (error?.code === 'permission-denied') {
      console.error("Permission denied: Make sure you're authenticated and Firestore rules allow reading your collections")
    }
    return []
  }
}

const getUserActivities = async (userId: string): Promise<Activity[]> => {
  try {
    // Verify userId is valid
    if (!userId) {
      console.warn("getUserActivities called without valid userId")
      return []
    }

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
  } catch (error: any) {
    console.error("Error fetching user activities:", error)
    if (error?.code === 'permission-denied') {
      console.error("Permission denied: Make sure you're authenticated and Firestore rules allow reading your activities")
    }
    return []
  }
}

const getUserFavorites = async (userId: string): Promise<Component[]> => {
  try {
    // Verify userId is valid
    if (!userId) {
      console.warn("getUserFavorites called without valid userId")
      return []
    }

    // Get user's favorite component IDs
    const favoritesQuery = query(
      collection(db, "favorites"), 
      where("userId", "==", userId)
    )
    const favoritesSnapshot = await getDocs(favoritesQuery)
    const favoriteComponentIds = favoritesSnapshot.docs.map(doc => doc.data().componentId).filter(Boolean)
    
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
  } catch (error: any) {
    console.error("Error fetching user favorites:", error)
    // Provide more specific error message for permission errors
    if (error?.code === 'permission-denied') {
      console.error("Permission denied: Make sure Firestore rules allow reading favorites for authenticated users")
    }
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
  const { user, loading: authLoading } = useAuth()
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
      // Wait for auth to finish loading
      if (authLoading) {
        return
      }

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
  }, [user, authLoading])

  // Show loading state while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background dark:from-slate-950 dark:via-slate-900 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-amber-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background dark:from-slate-950 dark:via-slate-900 dark:to-black flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center bg-card/50 backdrop-blur-sm border-border">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-black" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Please Sign In</h2>
            <p className="text-muted-foreground mb-4">You need to be authenticated to access your dashboard</p>
            <Link href="/auth/signin">
              <Button className="bg-amber-500 hover:bg-amber-600 text-black dark:text-black">
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
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background dark:from-slate-950 dark:via-slate-900 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-amber-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background dark:from-slate-950 dark:via-slate-900 dark:to-black">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-5 pointer-events-none" />
      <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-amber-400/10 to-yellow-300/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-gradient-to-tl from-purple-400/10 to-blue-300/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container relative mx-auto px-4 py-8">
        {/* Enhanced Dashboard Header */}
        <div className="relative mb-12 overflow-hidden rounded-2xl">
          {/* Background Gradient Blurs */}
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-br from-amber-400/20 to-yellow-400/20 rounded-full blur-3xl" />
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-3xl" />
          
          {/* Content */}
          <div className="relative z-10 bg-card/50 backdrop-blur-xl border-2 border-border rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Left Section */}
              <div className="flex-1">
                {/* Welcome Badge */}
                <div className="inline-flex items-center px-4 py-2 mb-4 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/30 backdrop-blur-sm shadow-lg shadow-amber-500/10">
                  <Sparkles className="h-4 w-4 mr-2 text-amber-500 dark:text-amber-400 animate-pulse" />
                  <span className="text-sm font-semibold bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-amber-300 dark:to-yellow-300 bg-clip-text text-transparent">
                    Welcome back, {user.displayName || 'Creator'}!
                  </span>
                </div>
                
                {/* Title */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 flex flex-wrap items-center gap-3">
                  <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 dark:from-gray-100 dark:via-purple-100 dark:to-gray-100 bg-clip-text text-transparent">
                    Dashboard
                  </span>
                  <Badge variant="secondary" className="bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-400/20 animate-pulse">
                    <Zap className="h-3 w-3 mr-1" />
                    Live
                  </Badge>
                </h1>
                
                {/* Description */}
                <p className="text-muted-foreground text-sm sm:text-base lg:text-lg flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  Manage your components and track performance
                </p>
              </div>
              
              {/* Right Section - Quick Stats */}
              <div className="flex flex-col gap-3 lg:items-end">
                <div className="flex items-center justify-between gap-2 px-4 py-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-400/20 backdrop-blur-sm hover:scale-105 transition-transform min-w-[160px]">
                  <Code className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground whitespace-nowrap">Components</div>
                    <div className="text-lg font-bold text-foreground">{userStats.totalComponents}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between gap-2 px-4 py-3 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-xl border border-amber-400/20 backdrop-blur-sm hover:scale-105 transition-transform min-w-[160px]">
                  <Eye className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground whitespace-nowrap">Views</div>
                    <div className="text-lg font-bold text-foreground">{userStats.totalViews.toLocaleString()}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-xl border border-emerald-400/20 backdrop-blur-sm hover:scale-105 transition-transform min-w-[160px]">
                  <Download className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground whitespace-nowrap">Downloads</div>
                    <div className="text-lg font-bold text-foreground">{userStats.totalDownloads.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 sm:space-y-8">
          {/* Tabs - Responsive for all devices */}
          <div className="w-full">
            {/* Mobile: Scrollable horizontal tabs */}
            <div className="overflow-x-auto overflow-y-hidden pb-3 -mx-4 px-4 sm:hidden scrollbar-hide">
              <TabsList className="inline-flex w-auto h-auto bg-muted/50 dark:bg-slate-800/50 backdrop-blur-sm border border-amber-400/20 p-1 rounded-xl shadow-lg shadow-amber-500/10">
                <TabsTrigger 
                  value="my-components" 
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-black transition-all duration-300 font-medium text-xs whitespace-nowrap"
                >
                  <LayoutGrid className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="font-semibold">Components</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="favorites" 
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-black transition-all duration-300 font-medium text-xs whitespace-nowrap"
                >
                  <Heart className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="font-semibold">Favorites</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="submissions" 
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-black transition-all duration-300 font-medium text-xs whitespace-nowrap"
                >
                  <Upload className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="font-semibold">Submit</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-black transition-all duration-300 font-medium text-xs whitespace-nowrap"
                >
                  <BarChart3 className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="font-semibold">Analytics</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tablet & Desktop: Full width tabs */}
            <div className="hidden sm:flex justify-center lg:justify-start">
              <TabsList className="inline-flex w-full max-w-2xl lg:max-w-none h-auto bg-muted/50 dark:bg-slate-800/50 backdrop-blur-sm border border-amber-400/20 p-1.5 rounded-xl shadow-lg shadow-amber-500/10">
                <TabsTrigger 
                  value="my-components" 
                  className="flex-1 flex items-center justify-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 rounded-lg text-muted-foreground hover:text-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-black transition-all duration-300 font-medium text-sm whitespace-nowrap"
                >
                  <LayoutGrid className="h-4 w-4 flex-shrink-0" />
                  <span className="font-semibold hidden md:inline">My Components</span>
                  <span className="font-semibold md:hidden">Components</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="favorites" 
                  className="flex-1 flex items-center justify-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 rounded-lg text-muted-foreground hover:text-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-black transition-all duration-300 font-medium text-sm whitespace-nowrap"
                >
                  <Heart className="h-4 w-4 flex-shrink-0" />
                  <span className="font-semibold">Favorites</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="submissions" 
                  className="flex-1 flex items-center justify-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 rounded-lg text-muted-foreground hover:text-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-black transition-all duration-300 font-medium text-sm whitespace-nowrap"
                >
                  <Upload className="h-4 w-4 flex-shrink-0" />
                  <span className="font-semibold">Submit</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className="flex-1 flex items-center justify-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 rounded-lg text-muted-foreground hover:text-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-black transition-all duration-300 font-medium text-sm whitespace-nowrap"
                >
                  <BarChart3 className="h-4 w-4 flex-shrink-0" />
                  <span className="font-semibold">Analytics</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* My Components Tab */}
          <TabsContent value="my-components" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-2 border-border hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 group">
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-blue-300/10 rounded-full blur-2xl group-hover:blur-3xl transition-all" />
                <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-purple-400/20">
                  <LayoutGrid className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardHeader className="pb-3 relative z-10">
                  <CardDescription className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                    Total Components
                  </CardDescription>
                  <CardTitle className="text-4xl bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 dark:from-purple-200 dark:via-blue-100 dark:to-purple-200 bg-clip-text text-transparent">
                    {userStats.totalComponents}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-purple-600 dark:text-purple-400">
                      <Code className="h-4 w-4 mr-1" />
                      <span>{userComponents.filter(c => c.isPublished !== false).length} published</span>
                    </div>
                    {userComponents.filter(c => c.isPublished === false).length > 0 && (
                      <Badge variant="secondary" className="bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-400/20">
                        {userComponents.filter(c => c.isPublished === false).length} draft
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-2 border-border hover:border-amber-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 group">
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-yellow-300/10 rounded-full blur-2xl group-hover:blur-3xl transition-all" />
                <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-amber-400/20">
                  <Eye className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <CardHeader className="pb-3 relative z-10">
                  <CardDescription className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                    Total Views
                  </CardDescription>
                  <CardTitle className="text-4xl bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-600 dark:from-amber-200 dark:via-yellow-100 dark:to-amber-200 bg-clip-text text-transparent">
                    {userStats.totalViews.toLocaleString()}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span>All time</span>
                    </div>
                    <Badge variant="secondary" className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-400/20">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-2 border-border hover:border-yellow-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10 group">
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-amber-300/10 rounded-full blur-2xl group-hover:blur-3xl transition-all" />
                <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-yellow-400/20">
                  <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400 fill-yellow-500" />
                </div>
                <CardHeader className="pb-3 relative z-10">
                  <CardDescription className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                    Avg Rating
                  </CardDescription>
                  <CardTitle className="text-4xl text-foreground flex items-center gap-2">
                    {userStats.avgRating.toFixed(1)}
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.round(userStats.avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} 
                        />
                      ))}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Heart className="h-4 w-4 mr-1 fill-pink-400 text-pink-400" />
                      <span>{userStats.totalLikes} likes</span>
                    </div>
                    {userStats.avgRating >= 4.5 && (
                      <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-400/20">
                        <Trophy className="h-3 w-3 mr-1" />
                        Top Rated
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-2 border-border hover:border-emerald-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 group">
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-green-300/10 rounded-full blur-2xl group-hover:blur-3xl transition-all" />
                <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-emerald-400/20">
                  <Download className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardHeader className="pb-3 relative z-10">
                  <CardDescription className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    Downloads
                  </CardDescription>
                  <CardTitle className="text-4xl text-foreground">
                    {userStats.totalDownloads.toLocaleString()}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span>Total downloads</span>
                    </div>
                    {userStats.totalDownloads > 100 && (
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-400/20">
                        <Zap className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Components Grid */}
            {(userComponents?.length || 0) > 0 && (
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg flex items-center justify-center border border-purple-400/20">
                    <LayoutGrid className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Your Components</h2>
                    <p className="text-sm text-muted-foreground">Manage and track your published work</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-400/20">
                  {userComponents.length} Total
                </Badge>
              </div>
            )}
            
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
                  <Card className="relative overflow-hidden p-12 text-center bg-card/30 border-2 border-dashed border-border hover:border-purple-400/50 transition-all">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-purple-400/10 to-blue-400/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-amber-400/10 to-yellow-400/10 rounded-full blur-3xl" />
                    <div className="relative z-10">
                      <div className="w-20 h-20 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-amber-400/20">
                        <Code className="h-10 w-10 text-amber-600 dark:text-amber-400" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-300 dark:to-blue-300 bg-clip-text text-transparent">
                        No Components Yet
                      </h3>
                      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                        Start your journey by uploading your first component and share your creativity with the community
                      </p>
                      <Button 
                        onClick={() => setActiveTab("submissions")}
                        className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black dark:text-black hover:from-amber-600 hover:to-yellow-600 shadow-lg shadow-amber-500/20"
                        size="lg"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Upload Your First Component
                      </Button>
                    </div>
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
    <Card className="group relative overflow-hidden bg-card/50 backdrop-blur-sm border-2 border-border hover:border-amber-400/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/20">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="relative z-10">
        <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-lg mb-3 overflow-hidden relative">
          {component.previewImage || component.thumbnail ? (
            <img 
              src={component.previewImage || component.thumbnail} 
              alt={component.name || component.title || 'Component preview'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Code className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          <Badge 
            className={`absolute top-2 left-2 ${getStatusColor(component.isPublished !== false)}`}
          >
            {component.isPublished !== false ? 'Published' : 'Draft'}
          </Badge>
        </div>
        <CardTitle className="text-lg group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
          {component.name || component.title || 'Untitled Component'}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {component.description || 'No description available'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 relative z-10">
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span>{component.stats?.views || 0}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Download className="h-4 w-4" />
            <span>{component.stats?.downloads || 0}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{component.stats?.rating?.toFixed(1) || "N/A"}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-xs">
            {component.framework || 'react'}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {component.category || 'other'}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1 hover:bg-amber-500 hover:text-black hover:border-amber-400 transition-all"
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
            className="flex-1 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white hover:border-red-400 transition-all"
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500/10 to-red-500/10 rounded-lg flex items-center justify-center border border-pink-400/20">
            <Heart className="h-5 w-5 text-pink-600 dark:text-pink-400 fill-pink-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Favorite Components</h2>
            <p className="text-sm text-muted-foreground">Components you loved from the community</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-pink-500/10 text-pink-700 dark:text-pink-300 border-pink-400/20">
          <Heart className="h-3 w-3 mr-1 fill-pink-500" />
          {favorites.length} saved
        </Badge>
      </div>
      
      {favorites.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((component) => (
            <Card key={component.id} className="group relative overflow-hidden bg-card/50 backdrop-blur-sm border-2 border-border hover:border-pink-400/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-lg mb-3 overflow-hidden relative">
                  {component.previewImage || component.thumbnail ? (
                    <img 
                      src={component.previewImage || component.thumbnail} 
                      alt={component.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Code className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <Button size="icon" variant="secondary" className="absolute top-2 right-2 h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background">
                    <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                  </Button>
                </div>
                <CardTitle className="text-lg">{component.name}</CardTitle>
                <CardDescription>by {component.authorName}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{component.stats?.rating?.toFixed(1) || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Download className="h-4 w-4" />
                    <span>{component.stats?.downloads || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="relative overflow-hidden p-12 text-center bg-card/30 border-2 border-dashed border-border hover:border-pink-400/50 transition-all">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-pink-400/10 to-red-400/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-pink-400/20">
              <Heart className="h-10 w-10 text-pink-600 dark:text-pink-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-pink-600 to-red-600 dark:from-pink-300 dark:to-red-300 bg-clip-text text-transparent">
              No Favorites Yet
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Discover amazing components from the community and save your favorites for quick access
            </p>
            <Button asChild className="bg-gradient-to-r from-pink-500 to-red-500 text-white dark:text-white hover:from-pink-600 hover:to-red-600 shadow-lg shadow-pink-500/20" size="lg">
              <Link href="/browse">
                <Search className="h-5 w-5 mr-2" />
                Explore Components
              </Link>
            </Button>
          </div>
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
      <Card className="max-w-2xl mx-auto bg-card/50 backdrop-blur-sm border-2 border-emerald-400/30 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-emerald-400/20 to-green-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl" />
        <CardContent className="text-center py-12 relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30 animate-bounce">
            <CheckCircle2 className="h-10 w-10 text-white dark:text-white" />
          </div>
          <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-300 dark:to-emerald-300 bg-clip-text text-transparent">
            Component Uploaded Successfully!
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Your component has been published and is now available to the community. Great work!
          </p>
          <div className="flex gap-2 justify-center">
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-400/20">
              <Sparkles className="h-3 w-3 mr-1" />
              Published
            </Badge>
            <Badge variant="secondary" className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-400/20">
              <Users className="h-3 w-3 mr-1" />
              Live Now
            </Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-4xl mx-auto bg-card/50 backdrop-blur-sm border-2 border-border">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 rounded-xl flex items-center justify-center border border-amber-400/20">
              <Upload className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                Upload Component
                {step > 1 && (
                  <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-300 border-green-400/20">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Step {step} of {totalSteps}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                {step === 1 && "Basic information about your component"}
                {step === 2 && "Add code and preview images"}
                {step === 3 && "Upload additional screenshots"}
                {step === 4 && "Final details and metadata"}
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-400/30">
            <Sparkles className="h-3 w-3 mr-1" />
            {Math.round(progress)}%
          </Badge>
        </div>
        <Progress value={progress} className="h-2 bg-muted">
          <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 transition-all rounded-full" style={{ width: `${progress}%` }} />
        </Progress>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Component Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Animated Card Component"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your component's features and use cases..."
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
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
                <Label>Frameworks *</Label>
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
                      <Label htmlFor={framework} className="text-sm">
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
              <Label htmlFor="code">Code *</Label>
              <Textarea
                id="code"
                placeholder="Paste your component code here..."
                rows={12}
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="font-mono text-sm"
              />
            </div>

            {/* Component Image Upload */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Component Image</Label>
                <p className="text-sm text-muted-foreground">Upload a visual representation of your component</p>
              </div>
              
              {!imagePreview ? (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-amber-500 transition-colors cursor-pointer"
                     onClick={() => document.getElementById('component-image')?.click()}>
                  <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h4 className="text-lg font-medium mb-2">Upload Component Image</h4>
                  <p className="text-muted-foreground mb-4">
                    Click to browse or drag and drop your component image here
                  </p>
                  <p className="text-sm text-muted-foreground">
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
                    className="w-full max-h-64 object-contain rounded-lg bg-muted"
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
              <Label htmlFor="githubUrl">GitHub URL (Optional)</Label>
              <Input
                id="githubUrl"
                placeholder="https://github.com/username/repo"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              />
              <p className="text-sm text-muted-foreground">Link to your component's source code repository</p>
            </div>
          </div>
        )}

        {/* Step 3: Additional Images */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail Image</Label>
              <Input
                id="thumbnail"
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.files?.[0] || null })}
              />
              <p className="text-sm text-muted-foreground">Small preview image for cards and listings (Recommended: 400x300px, max 2MB)</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="screenshot">Screenshot</Label>
              <Input
                id="screenshot"
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, screenshot: e.target.files?.[0] || null })}
              />
              <p className="text-sm text-muted-foreground">Detailed component preview image for the component page (max 5MB)</p>
            </div>
          </div>
        )}

        {/* Step 4: Metadata */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="animation, card, hover, gradient (comma separated)"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="license">License *</Label>
              <Select
                value={formData.license}
                onValueChange={(value) => setFormData({ ...formData, license: value })}
              >
                <SelectTrigger>
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
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <h4 className="font-semibold mb-2">Component Summary</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p><span className="text-foreground">Name:</span> {formData.name || 'Not specified'}</p>
                <p><span className="text-foreground">Category:</span> {formData.category || 'Not specified'}</p>
                <p><span className="text-foreground">Frameworks:</span> {formData.frameworks.join(', ') || 'Not specified'}</p>
                <p><span className="text-foreground">License:</span> {formData.license || 'Not specified'}</p>
                <p><span className="text-foreground">Component Image:</span> {formData.componentImage ? 'Uploaded' : 'Not uploaded'}</p>
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
          >
            Previous
          </Button>
          
          {step < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={!formData.name || !formData.description || formData.frameworks.length === 0}
              className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black dark:text-black hover:from-amber-600 hover:to-yellow-600"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.code || !formData.license}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white dark:text-white hover:from-green-600 hover:to-emerald-600"
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
      {/* Analytics Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg flex items-center justify-center border border-blue-400/20">
          <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Analytics Dashboard</h2>
          <p className="text-sm text-muted-foreground">Track your component performance and engagement</p>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card/50 backdrop-blur-sm border-2 border-border hover:border-blue-400/50 transition-all">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Component Performance
                </CardTitle>
                <CardDescription>Views, downloads, and likes over time</CardDescription>
              </div>
              <Badge variant="secondary" className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-400/20">
                <BarChart3 className="h-3 w-3 mr-1" />
                Chart
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted-foreground/20" />
                <XAxis dataKey="name" className="text-muted-foreground" stroke="currentColor" />
                <YAxis className="text-muted-foreground" stroke="currentColor" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
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

        <Card className="bg-card/50 backdrop-blur-sm border-2 border-border hover:border-purple-400/50 transition-all">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  Component Status
                </CardTitle>
                <CardDescription>Published vs draft components</CardDescription>
              </div>
              <Badge variant="secondary" className="bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-400/20">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Status
              </Badge>
            </div>
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
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-card/50 backdrop-blur-sm border-2 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Your latest actions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          {activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={activity.id || index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full flex items-center justify-center">
                    <ActivityIcon type={activity.type} />
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground text-sm">{activity.description}</p>
                    <p className="text-muted-foreground text-xs">
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
              <Zap className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">No recent activity</p>
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