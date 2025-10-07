"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Monitor,
  Tablet,
  Smartphone,
  Sun,
  Moon,
  Copy,
  Download,
  Share2,
  Check,
  Package,
  Shield,
  Tag,
  Code2,
  Eye,
  Download as DownloadIcon,
  Heart,
  Edit,
  Trash2,
  Loader2,
  Image as ImageIcon,
  Video,
  TrendingUp,
  Star,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { downloadComponent } from "@/lib/download-utils"

interface Component {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  accessibilityScore?: number;
  accessibilityBreakdown?: Record<string, number>;
  downloads?: number;
  views?: number;
  rating?: number;
  frameworks?: string[];
  version?: string;
  lastUpdated?: string;
  updatedAt?: string;
  createdAt?: string;
  author?: string;
  authorId?: string;
  authorName?: string;
  thumbnail?: string;
  previewImage?: string;
  videoUrl?: string;
  stats?: {
    views: number;
    downloads: number;
    likes: number;
    rating: number;
  };
  code?: string;
  dependencies?: string[];
}

export default function ComponentOwnerViewPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const componentId = params.id as string

  // Loading states
  const [isLoading, setIsLoading] = useState(true)
  
  // Data states
  const [componentData, setComponentData] = useState<Component | null>(null)
  
  // UI states
  const [selectedFramework, setSelectedFramework] = useState("React")
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [copiedCode, setCopiedCode] = useState(false)
  const [selectedMediaTab, setSelectedMediaTab] = useState<"thumbnail" | "preview" | "video">("preview")

  // Fetch component data
  useEffect(() => {
    const fetchComponentData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/components/${componentId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch component')
        }
        
        const data = await response.json()
        
        // Check if user is the owner
        if (user && data.authorId !== user.uid) {
          // Redirect to regular component view
          router.push(`/component/${componentId}`)
          return
        }
        
        setComponentData(data)
        
        // Set framework from component data if available
        if (data.frameworks && data.frameworks.length > 0) {
          setSelectedFramework(data.frameworks[0])
        }
        
      } catch (error) {
        console.error('Error fetching component:', error)
        toast.error('Failed to load component details')
      } finally {
        setIsLoading(false)
      }
    }

    if (componentId && user) {
      fetchComponentData()
    }
  }, [componentId, user, router])

  // Get the actual component code
  const componentCode = componentData?.code || '// No code available for this component'

  const previewSizes = {
    desktop: "w-full",
    tablet: "w-[768px] mx-auto",
    mobile: "w-[375px] mx-auto",
  }

  const handleCopyCode = () => {
    if (componentCode) {
      navigator.clipboard.writeText(componentCode)
      setCopiedCode(true)
      toast.success("Code copied to clipboard!")
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  const handleDownloadCode = () => {
    if (!componentCode) return
    
    // Determine file extension based on code content or default to .jsx
    let extension = 'jsx'
    if (componentCode.includes('<!DOCTYPE') || componentCode.includes('<html')) {
      extension = 'html'
    } else if (componentCode.includes('@apply') || componentCode.startsWith('.') || componentCode.startsWith('#')) {
      extension = 'css'
    } else if (componentCode.includes('interface ') || componentCode.includes(': React.FC')) {
      extension = 'tsx'
    }
    
    const blob = new Blob([componentCode], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${componentData?.name || 'component'}.${extension}`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Code downloaded successfully!")
  }

  const handleDownloadComponent = async () => {
    if (!componentData) return
    
    try {
      toast.loading("Preparing download...")
      await downloadComponent(componentData as any)
      toast.success("Component downloaded successfully!")
    } catch (error) {
      console.error("Error downloading component:", error)
      toast.error("Failed to download component")
    }
  }

  const handleShare = () => {
    const url = window.location.href.replace('/owner-view', '')
    navigator.clipboard.writeText(url)
    toast.success("Public link copied to clipboard!")
  }

  const handleEdit = () => {
    router.push(`/component/${componentId}/edit`)
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this component? This action cannot be undone.")) {
      return
    }

    try {
      const idToken = await user?.getIdToken()
      const response = await fetch(`/api/components/${componentId}?authorId=${componentData?.authorId}&previewUrl=${componentData?.previewImage}&thumbnailUrl=${componentData?.thumbnail}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete component')
      }

      toast.success("Component deleted successfully!")
      router.push('/my-components')
    } catch (error) {
      console.error('Error deleting component:', error)
      toast.error('Failed to delete component')
    }
  }

  // Loading state
  if (isLoading || !componentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading component...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <a href="/" className="hover:text-white transition-colors">
              Home
            </a>
            <span>/</span>
            <a href="/my-components" className="hover:text-white transition-colors">
              My Components
            </a>
            <span>/</span>
            <span className="text-white">{componentData.name}</span>
          </div>
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40">
            Owner View
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="mb-6 flex items-center gap-3 justify-end">
          <Button
            variant="outline"
            className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
            onClick={handleEdit}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button
            variant="outline"
            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
            onClick={handleDelete}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-6">
          {/* Left Sidebar */}
          <div className="space-y-6">
            {/* Component Metadata */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm p-6">
              <h1 className="text-2xl font-bold text-white mb-2">{componentData.name}</h1>
              <p className="text-gray-400 mb-4">{componentData.description}</p>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Category</span>
                  <Badge variant="secondary">{componentData.category}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Version</span>
                  <span className="text-white font-medium">{componentData.version || '1.0.0'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Created</span>
                  <span className="text-white font-medium">
                    {componentData.createdAt ? new Date(componentData.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Updated</span>
                  <span className="text-white font-medium">
                    {componentData.updatedAt ? new Date(componentData.updatedAt).toLocaleDateString() : 
                     componentData.lastUpdated || 'Recently'}
                  </span>
                </div>
              </div>
            </Card>

            {/* Statistics Card */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Statistics</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-gray-400">Views</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {(componentData.stats?.views || componentData.views || 0).toLocaleString()}
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <DownloadIcon className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-gray-400">Downloads</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {(componentData.stats?.downloads || componentData.downloads || 0).toLocaleString()}
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-red-400" />
                    <span className="text-xs text-gray-400">Favorites</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {componentData.stats?.likes || 0}
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs text-gray-400">Rating</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {componentData.stats?.rating?.toFixed(1) || componentData.rating || 'N/A'}
                  </p>
                </div>
              </div>
            </Card>

            {/* Framework Selector */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Framework</h3>
              </div>
              <Tabs value={selectedFramework} onValueChange={setSelectedFramework} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/5">
                  {(componentData.frameworks || ['React', 'HTML']).slice(0, 4).map((framework) => (
                    <TabsTrigger
                      key={framework}
                      value={framework}
                      className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
                    >
                      {framework}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </Card>

            {/* Accessibility Score */}
            {componentData.accessibilityScore && (
              <Card className="border-white/10 bg-white/5 backdrop-blur-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-semibold text-white">Accessibility</h3>
                </div>

                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-white/10"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - (componentData.accessibilityScore || 95) / 100)}`}
                        className="text-emerald-400 transition-all duration-1000"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">{componentData.accessibilityScore}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {Object.entries(componentData.accessibilityBreakdown || {}).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1 text-sm">
                        <span className="text-gray-400">{key}</span>
                        <span className="text-white font-medium">{value}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Tags */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {componentData.tags?.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-purple-500/10 text-purple-300 border-purple-500/20 hover:bg-purple-500/20"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Dependencies */}
            {componentData.dependencies && componentData.dependencies.length > 0 && (
              <Card className="border-white/10 bg-white/5 backdrop-blur-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Dependencies</h3>
                </div>
                <div className="space-y-2">
                  {componentData.dependencies.map((dep, index) => (
                    <div key={index} className="bg-black/30 rounded-lg p-2 font-mono text-sm text-gray-300">
                      {dep}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Main Content Area */}
          <div className="space-y-6">
            {/* Media Preview Section */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">Media Preview</h3>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={handleDownloadComponent} className="h-9 gap-2">
                    <Download className="w-4 h-4" />
                    Download All
                  </Button>
                </div>
              </div>

              {/* Media Tabs */}
              <Tabs value={selectedMediaTab} onValueChange={(v) => setSelectedMediaTab(v as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-white/5 mb-4">
                  {componentData.thumbnail && (
                    <TabsTrigger
                      value="thumbnail"
                      className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Thumbnail
                    </TabsTrigger>
                  )}
                  {componentData.previewImage && (
                    <TabsTrigger
                      value="preview"
                      className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </TabsTrigger>
                  )}
                  {componentData.videoUrl && (
                    <TabsTrigger
                      value="video"
                      className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Video
                    </TabsTrigger>
                  )}
                </TabsList>

                {componentData.thumbnail && (
                  <TabsContent value="thumbnail">
                    <div className="rounded-lg overflow-hidden bg-black/30">
                      <img
                        src={componentData.thumbnail}
                        alt={`${componentData.name} - Thumbnail`}
                        className="w-full h-auto object-contain max-h-[600px]"
                      />
                    </div>
                  </TabsContent>
                )}

                {componentData.previewImage && (
                  <TabsContent value="preview">
                    <div className="rounded-lg overflow-hidden bg-black/30">
                      <img
                        src={componentData.previewImage}
                        alt={`${componentData.name} - Preview`}
                        className="w-full h-auto object-contain max-h-[600px]"
                      />
                    </div>
                  </TabsContent>
                )}

                {componentData.videoUrl && (
                  <TabsContent value="video">
                    <div className="rounded-lg overflow-hidden bg-black/30 aspect-video">
                      <video
                        src={componentData.videoUrl}
                        controls
                        className="w-full h-full object-contain"
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </Card>

            {/* Live Preview Section */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">Live Preview</h3>
                </div>

                <div className="flex items-center gap-2">
                  {/* Preview Mode Selector */}
                  <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setPreviewMode("desktop")}
                      className={cn("h-8 w-8 p-0", previewMode === "desktop" && "bg-purple-500/20 text-purple-300")}
                    >
                      <Monitor className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setPreviewMode("tablet")}
                      className={cn("h-8 w-8 p-0", previewMode === "tablet" && "bg-purple-500/20 text-purple-300")}
                    >
                      <Tablet className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setPreviewMode("mobile")}
                      className={cn("h-8 w-8 p-0", previewMode === "mobile" && "bg-purple-500/20 text-purple-300")}
                    >
                      <Smartphone className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Theme Toggle */}
                  <Button size="sm" variant="ghost" onClick={() => setIsDarkMode(!isDarkMode)} className="h-8 w-8 p-0">
                    {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Preview Container */}
              <div
                className={cn("rounded-lg p-8 transition-all duration-300 min-h-[400px] flex items-center justify-center", 
                  isDarkMode ? "bg-gray-950" : "bg-white"
                )}
              >
                <div className={cn("transition-all duration-300", previewSizes[previewMode])}>
                  {componentData.previewImage ? (
                    <div className="space-y-4">
                      <img
                        src={componentData.previewImage}
                        alt="Live preview"
                        className="w-full h-auto rounded-lg shadow-2xl"
                      />
                      {componentCode && componentCode.includes('<') && (
                        <div className="text-xs text-center text-gray-400">
                          Preview image • Live rendering available in component detail page
                        </div>
                      )}
                    </div>
                  ) : componentCode && componentCode.includes('<') ? (
                    <div className="w-full">
                      <div className="text-xs text-center text-gray-400 mb-4">
                        Rendered preview (experimental)
                      </div>
                      <div 
                        className="w-full p-4 border border-white/10 rounded-lg"
                        dangerouslySetInnerHTML={{ __html: componentCode }}
                      />
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>No preview available</p>
                      <p className="text-sm mt-2">Upload a preview image when editing this component</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Code Section */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Source Code</h3>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={handleCopyCode} className="h-9 gap-2">
                    {copiedCode ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleDownloadCode} className="h-9 gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              </div>

              <div className="relative max-h-[600px] overflow-auto">
                <pre className="bg-black/30 rounded-lg p-4">
                  <code className="text-sm text-gray-300 font-mono leading-relaxed whitespace-pre-wrap break-words">
                    {componentCode}
                  </code>
                </pre>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
