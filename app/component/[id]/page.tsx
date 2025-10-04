"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { CommentsSection } from "@/components/comments-section"
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
  Palette,
  Star,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock component data
const componentData = {
  id: "animated-card",
  name: "Animated Card",
  description: "A beautiful card component with smooth hover animations and glassmorphism effects",
  category: "Cards",
  tags: ["animation", "glassmorphism", "hover-effects", "modern"],
  accessibilityScore: 98,
  accessibilityBreakdown: {
    "Keyboard Navigation": 100,
    "Screen Reader Support": 98,
    "Color Contrast": 95,
    "Focus Indicators": 100,
    "ARIA Labels": 98,
  },
  downloads: 12543,
  rating: 4.8,
  frameworks: ["React", "Vue", "Svelte", "HTML"],
  version: "1.2.0",
  lastUpdated: "2024-01-15",
  author: "ComponentVault Team",
}

const codeExamples = {
  jsx: `import { Card } from '@/components/ui/card'

export function AnimatedCard() {
  return (
    <Card className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-white/20 hover:shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-white mb-2">Card Title</h3>
        <p className="text-gray-300">Beautiful animated card with glassmorphism effect.</p>
      </div>
    </Card>
  )
}`,
  html: `<div class="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-white/20 hover:shadow-2xl">
  <div class="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
  <div class="relative z-10">
    <h3 class="text-xl font-bold text-white mb-2">Card Title</h3>
    <p class="text-gray-300">Beautiful animated card with glassmorphism effect.</p>
  </div>
</div>`,
  css: `.animated-card {
  position: relative;
  overflow: hidden;
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(to bottom right, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1));
  padding: 1.5rem;
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.animated-card:hover {
  transform: scale(1.05);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.animated-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom right, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.animated-card:hover::before {
  opacity: 1;
}`,
  typescript: `import { Card } from '@/components/ui/card'
import { ReactNode } from 'react'

interface AnimatedCardProps {
  title: string
  description: string
  children?: ReactNode
  className?: string
}

export function AnimatedCard({ title, description, children, className }: AnimatedCardProps) {
  return (
    <Card className={cn(
      "group relative overflow-hidden rounded-xl border border-white/10",
      "bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-6",
      "backdrop-blur-sm transition-all duration-300",
      "hover:scale-105 hover:border-white/20 hover:shadow-2xl",
      className
    )}>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-300">{description}</p>
        {children}
      </div>
    </Card>
  )
}
`,
}

// Mock reviews data
const reviewsData = {
  averageRating: 4.8,
  totalReviews: 234,
  ratingBreakdown: {
    5: 180,
    4: 35,
    3: 12,
    2: 5,
    1: 2,
  },
  reviews: [
    {
      id: 1,
      author: "Sarah Chen",
      avatar: "/diverse-avatars.png",
      rating: 5,
      date: "2024-01-15",
      helpful: 24,
      notHelpful: 2,
      comment:
        "Absolutely love this component! The animations are smooth and the glassmorphism effect is perfect. Easy to customize and works great with my project.",
    },
    {
      id: 2,
      author: "Michael Rodriguez",
      avatar: "/diverse-avatars.png",
      rating: 5,
      date: "2024-01-12",
      helpful: 18,
      notHelpful: 1,
      comment:
        "Best card component I've found. The accessibility score is impressive and it's very well documented. Highly recommend!",
    },
    {
      id: 3,
      author: "Emma Thompson",
      avatar: "/diverse-avatars.png",
      rating: 4,
      date: "2024-01-10",
      helpful: 12,
      notHelpful: 0,
      comment:
        "Great component overall. Would love to see more color scheme options out of the box, but the customization panel makes it easy to adjust.",
    },
    {
      id: 4,
      author: "David Kim",
      avatar: "/diverse-avatars.png",
      rating: 5,
      date: "2024-01-08",
      helpful: 15,
      notHelpful: 1,
      comment:
        "Perfect for my landing page. The hover effects are exactly what I needed. Performance is excellent too!",
    },
  ],
}

export default function ComponentDetailPage() {
  const [selectedFramework, setSelectedFramework] = useState("React")
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [copiedCode, setCopiedCode] = useState(false)
  const [selectedCodeTab, setSelectedCodeTab] = useState("jsx")

  // Customization state
  const [primaryColor, setPrimaryColor] = useState("#8B5CF6")
  const [secondaryColor, setSecondaryColor] = useState("#3B82F6")
  const [padding, setPadding] = useState(24)
  const [borderRadius, setBorderRadius] = useState(12)
  const [fontSize, setFontSize] = useState(16)

  // Review-related state
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [reviewSort, setReviewSort] = useState<"newest" | "helpful">("helpful")
  const [helpfulVotes, setHelpfulVotes] = useState<Record<number, "up" | "down" | null>>({})

  const previewSizes = {
    desktop: "w-full",
    tablet: "w-[768px] mx-auto",
    mobile: "w-[375px] mx-auto",
  }

  const handleCopyCode = () => {
    const code = codeExamples[selectedCodeTab as keyof typeof codeExamples]
    navigator.clipboard.writeText(code)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const handleDownloadCode = () => {
    const code = codeExamples[selectedCodeTab as keyof typeof codeExamples]
    const extensions = { jsx: "jsx", html: "html", css: "css", typescript: "tsx" }
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `animated-card.${extensions[selectedCodeTab as keyof typeof extensions]}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleShare = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    alert("Link copied to clipboard!")
  }

  const handleSubmitReview = () => {
    if (userRating === 0) {
      alert("Please select a rating")
      return
    }
    console.log("Submitting review:", { rating: userRating, comment: reviewText })
    setUserRating(0)
    setReviewText("")
    alert("Review submitted successfully!")
  }

  const handleHelpfulVote = (reviewId: number, vote: "up" | "down") => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [reviewId]: prev[reviewId] === vote ? null : vote,
    }))
  }

  const sortedReviews = [...reviewsData.reviews].sort((a, b) => {
    if (reviewSort === "newest") {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    }
    return b.helpful - a.helpful
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-400">
          <a href="/" className="hover:text-white transition-colors">
            Home
          </a>
          <span>/</span>
          <a href="/browse" className="hover:text-white transition-colors">
            Browse
          </a>
          <span>/</span>
          <span className="text-white">{componentData.name}</span>
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
                  <span className="text-gray-400">Version</span>
                  <span className="text-white font-medium">{componentData.version}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Downloads</span>
                  <span className="text-white font-medium">{componentData.downloads.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Rating</span>
                  <span className="text-white font-medium">⭐ {componentData.rating}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Updated</span>
                  <span className="text-white font-medium">{componentData.lastUpdated}</span>
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
                  {componentData.frameworks.map((framework) => (
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
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - componentData.accessibilityScore / 100)}`}
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
                {Object.entries(componentData.accessibilityBreakdown).map(([key, value]) => (
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

            {/* Install Instructions */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Code2 className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Installation</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400 mb-2">Install dependencies:</p>
                  <div className="bg-black/30 rounded-lg p-3 font-mono text-sm text-gray-300">
                    npm install @/components/ui/card
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-2">Import component:</p>
                  <div className="bg-black/30 rounded-lg p-3 font-mono text-sm text-gray-300">
                    import {"{ Card }"} from '@/components/ui/card'
                  </div>
                </div>
              </div>
            </Card>

            {/* Tags */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {componentData.tags.map((tag) => (
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
          </div>

          {/* Main Content Area */}
          <div className="space-y-6">
            {/* Preview Section */}
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

                  {/* Share Button */}
                  <Button size="sm" variant="ghost" onClick={handleShare} className="h-8 w-8 p-0">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Preview Container */}
              <div
                className={cn("rounded-lg p-8 transition-all duration-300", isDarkMode ? "bg-gray-950" : "bg-white")}
              >
                <div className={cn("transition-all duration-300", previewSizes[previewMode])}>
                  {/* Live Component Preview */}
                  <div
                    className="group relative overflow-hidden rounded-xl border transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    style={{
                      borderColor: `${primaryColor}20`,
                      background: `linear-gradient(to bottom right, ${primaryColor}10, ${secondaryColor}10)`,
                      padding: `${padding}px`,
                      borderRadius: `${borderRadius}px`,
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{
                        background: `linear-gradient(to bottom right, ${primaryColor}20, ${secondaryColor}20)`,
                      }}
                    />
                    <div className="relative z-10">
                      <h3
                        className={cn("font-bold mb-2", isDarkMode ? "text-white" : "text-gray-900")}
                        style={{ fontSize: `${fontSize * 1.25}px` }}
                      >
                        Card Title
                      </h3>
                      <p
                        className={cn(isDarkMode ? "text-gray-300" : "text-gray-600")}
                        style={{ fontSize: `${fontSize}px` }}
                      >
                        Beautiful animated card with glassmorphism effect.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Customization Panel */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <Palette className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Customization</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Color Pickers */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-gray-400 mb-2 block">Primary Color</Label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-12 h-12 rounded-lg border border-white/10 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-gray-400 mb-2 block">Secondary Color</Label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-12 h-12 rounded-lg border border-white/10 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Sliders */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm text-gray-400">Padding</Label>
                      <span className="text-sm text-white font-medium">{padding}px</span>
                    </div>
                    <Slider
                      value={[padding]}
                      onValueChange={(value) => setPadding(value[0])}
                      min={8}
                      max={48}
                      step={4}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm text-gray-400">Border Radius</Label>
                      <span className="text-sm text-white font-medium">{borderRadius}px</span>
                    </div>
                    <Slider
                      value={[borderRadius]}
                      onValueChange={(value) => setBorderRadius(value[0])}
                      min={0}
                      max={32}
                      step={2}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm text-gray-400">Font Size</Label>
                      <span className="text-sm text-white font-medium">{fontSize}px</span>
                    </div>
                    <Slider
                      value={[fontSize]}
                      onValueChange={(value) => setFontSize(value[0])}
                      min={12}
                      max={24}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Code Section */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Code</h3>
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

              <Tabs value={selectedCodeTab} onValueChange={setSelectedCodeTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-white/5">
                  <TabsTrigger
                    value="jsx"
                    className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300"
                  >
                    JSX
                  </TabsTrigger>
                  <TabsTrigger
                    value="html"
                    className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300"
                  >
                    HTML
                  </TabsTrigger>
                  <TabsTrigger
                    value="css"
                    className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300"
                  >
                    CSS
                  </TabsTrigger>
                  <TabsTrigger
                    value="typescript"
                    className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300"
                  >
                    TypeScript
                  </TabsTrigger>
                </TabsList>

                {Object.entries(codeExamples).map(([key, code]) => (
                  <TabsContent key={key} value={key} className="mt-4">
                    <div className="relative">
                      <pre className="bg-black/30 rounded-lg p-4 overflow-x-auto">
                        <code className="text-sm text-gray-300 font-mono leading-relaxed">{code}</code>
                      </pre>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </Card>

            {/* Ratings & Reviews Section */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">Ratings & Reviews</h3>
              </div>

              {/* Rating Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-white/10">
                {/* Average Rating */}
                <div className="flex flex-col items-center justify-center">
                  <div className="text-6xl font-bold text-white mb-2">{reviewsData.averageRating}</div>
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "w-6 h-6",
                          star <= Math.round(reviewsData.averageRating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-600",
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm">{reviewsData.totalReviews} reviews</p>
                </div>

                {/* Rating Breakdown */}
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = reviewsData.ratingBreakdown[rating as keyof typeof reviewsData.ratingBreakdown]
                    const percentage = (count / reviewsData.totalReviews) * 100
                    return (
                      <div key={rating} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-16">
                          <span className="text-sm text-gray-400">{rating}</span>
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        </div>
                        <Progress value={percentage} className="flex-1 h-2" />
                        <span className="text-sm text-gray-400 w-12 text-right">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Write a Review */}
              <div className="mb-8 pb-8 border-b border-white/10">
                <h4 className="text-white font-semibold mb-4">Write a Review</h4>
                <div className="space-y-4">
                  {/* Star Rating Input */}
                  <div>
                    <Label className="text-sm text-gray-400 mb-2 block">Your Rating</Label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setUserRating(star)}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            className={cn(
                              "w-8 h-8 transition-colors",
                              star <= (hoverRating || userRating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-600 hover:text-gray-500",
                            )}
                          />
                        </button>
                      ))}
                      {userRating > 0 && <span className="text-white ml-2">{userRating} / 5</span>}
                    </div>
                  </div>

                  {/* Review Text */}
                  <div>
                    <Label className="text-sm text-gray-400 mb-2 block">Your Review</Label>
                    <Textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share your experience with this component..."
                      className="min-h-[100px] bg-white/5 border-white/10 text-white placeholder:text-gray-500 resize-none"
                    />
                  </div>

                  <Button
                    onClick={handleSubmitReview}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  >
                    Submit Review
                  </Button>
                </div>
              </div>

              {/* Reviews List */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-semibold">Reviews ({reviewsData.totalReviews})</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Sort by:</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setReviewSort("helpful")}
                      className={cn(
                        "h-8",
                        reviewSort === "helpful" ? "bg-purple-500/20 text-purple-300" : "text-gray-400",
                      )}
                    >
                      Most Helpful
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setReviewSort("newest")}
                      className={cn(
                        "h-8",
                        reviewSort === "newest" ? "bg-purple-500/20 text-purple-300" : "text-gray-400",
                      )}
                    >
                      Newest
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {sortedReviews.map((review) => (
                    <div key={review.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-start gap-4">
                        <img
                          src={review.avatar || "/placeholder.svg"}
                          alt={review.author}
                          className="w-10 h-10 rounded-full border border-white/10"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h5 className="text-white font-medium">{review.author}</h5>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={cn(
                                        "w-4 h-4",
                                        star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600",
                                      )}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-400">{review.date}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-300 mb-3 leading-relaxed">{review.comment}</p>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-400">Was this helpful?</span>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleHelpfulVote(review.id, "up")}
                                className={cn(
                                  "h-8 gap-1",
                                  helpfulVotes[review.id] === "up"
                                    ? "bg-emerald-500/20 text-emerald-300"
                                    : "text-gray-400 hover:text-emerald-300",
                                )}
                              >
                                <ThumbsUp className="w-4 h-4" />
                                <span>{review.helpful + (helpfulVotes[review.id] === "up" ? 1 : 0)}</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleHelpfulVote(review.id, "down")}
                                className={cn(
                                  "h-8 gap-1",
                                  helpfulVotes[review.id] === "down"
                                    ? "bg-red-500/20 text-red-300"
                                    : "text-gray-400 hover:text-red-300",
                                )}
                              >
                                <ThumbsDown className="w-4 h-4" />
                                <span>{review.notHelpful + (helpfulVotes[review.id] === "down" ? 1 : 0)}</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Comments Section */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm p-6">
              <CommentsSection componentId={componentData.id} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
