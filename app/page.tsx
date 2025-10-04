"use client"

import { useState, useEffect } from "react"
import { 
  Search, Sparkles, Eye, Accessibility, Layers, Star, Download, Heart, Copy, Check,
  Zap, Code, Palette, Shield, TrendingUp, Users, ArrowRight, PlayCircle,
  CheckCircle, Github, Trophy, Rocket, Package
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

// Mock data for components
const mockComponents = [
  {
    id: 1,
    name: "Animated Card",
    description: "A beautiful card with hover animations",
    category: "cards",
    frameworks: ["React", "Vue"],
    accessibilityScore: 95,
    downloads: 1234,
    rating: 4.8,
    thumbnail: "/animated-card-component.jpg",
  },
  {
    id: 2,
    name: "Navigation Menu",
    description: "Responsive navigation with dropdown support",
    category: "navigation",
    frameworks: ["React", "Svelte"],
    accessibilityScore: 98,
    downloads: 3456,
    rating: 4.9,
    thumbnail: "/navigation-menu-component.jpg",
  },
  {
    id: 3,
    name: "Form Builder",
    description: "Dynamic form with validation",
    category: "forms",
    frameworks: ["React", "Vue", "Svelte"],
    accessibilityScore: 92,
    downloads: 2345,
    rating: 4.7,
    thumbnail: "/form-builder-component.jpg",
  },
  {
    id: 4,
    name: "Data Table",
    description: "Sortable and filterable data table",
    category: "tables",
    frameworks: ["React"],
    accessibilityScore: 90,
    downloads: 4567,
    rating: 4.6,
    thumbnail: "/data-table-component.png",
  },
  {
    id: 5,
    name: "Modal Dialog",
    description: "Accessible modal with animations",
    category: "overlays",
    frameworks: ["React", "Vue"],
    accessibilityScore: 96,
    downloads: 5678,
    rating: 4.9,
    thumbnail: "/modal-dialog-component.png",
  },
  {
    id: 6,
    name: "Pricing Cards",
    description: "Beautiful pricing section layout",
    category: "cards",
    frameworks: ["React", "Svelte"],
    accessibilityScore: 94,
    downloads: 3210,
    rating: 4.8,
    thumbnail: "/pricing-cards-component.jpg",
  },
  {
    id: 7,
    name: "Sidebar Navigation",
    description: "Collapsible sidebar with icons",
    category: "navigation",
    frameworks: ["React"],
    accessibilityScore: 97,
    downloads: 2890,
    rating: 4.7,
    thumbnail: "/sidebar-navigation-component.jpg",
  },
  {
    id: 8,
    name: "Toast Notifications",
    description: "Customizable toast messages",
    category: "feedback",
    frameworks: ["React", "Vue", "Svelte"],
    accessibilityScore: 93,
    downloads: 6789,
    rating: 4.9,
    thumbnail: "/toast-notifications-component.jpg",
  },
]

const features = [
  {
    icon: Sparkles,
    title: "AI Search",
    description: "Find components using natural language powered by AI",
  },
  {
    icon: Eye,
    title: "Live Preview",
    description: "See components in action before you use them",
  },
  {
    icon: Layers,
    title: "Multi-Framework",
    description: "Support for React, Vue, and Svelte frameworks",
  },
  {
    icon: Accessibility,
    title: "Accessibility Scores",
    description: "Every component rated for accessibility compliance",
  },
]

// Enhanced features data
const enhancedFeatures = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized components that load instantly and perform flawlessly",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: Code,
    title: "Clean Code",
    description: "Well-documented, maintainable code following best practices",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Palette,
    title: "Customizable",
    description: "Easily adapt components to match your brand and design system",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Shield,
    title: "Accessible",
    description: "WCAG compliant components ensuring everyone can use your product",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Layers,
    title: "Multi-Framework",
    description: "Support for React, Vue, Svelte and more popular frameworks",
    gradient: "from-red-500 to-rose-500",
  },
  {
    icon: Sparkles,
    title: "AI-Powered",
    description: "Intelligent search and recommendations powered by AI",
    gradient: "from-indigo-500 to-purple-500",
  },
]

// Statistics data
const stats = [
  { label: "Components", value: "1,200+", icon: Package },
  { label: "Developers", value: "50K+", icon: Users },
  { label: "Downloads", value: "2M+", icon: Download },
  { label: "Frameworks", value: "15+", icon: Code },
]

// Testimonials data
const testimonials = [
  {
    name: "Sarah Chen",
    role: "Lead Designer at TechCorp",
    avatar: "/placeholder-user.jpg",
    content: "ComponentVault has saved our team countless hours. The quality and variety of components is outstanding!",
    rating: 5,
  },
  {
    name: "Michael Rodriguez",
    role: "Frontend Developer",
    avatar: "/placeholder-user.jpg",
    content: "The best component library I've used. Everything is accessible, well-documented, and just works.",
    rating: 5,
  },
  {
    name: "Emma Thompson",
    role: "Product Manager",
    avatar: "/placeholder-user.jpg",
    content: "Our development speed increased by 3x after adopting ComponentVault. Highly recommended!",
    rating: 5,
  },
]

export default function ComponentVault() {
  const [searchQuery, setSearchQuery] = useState("")
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [favorites, setFavorites] = useState<number[]>([])
  const [counters, setCounters] = useState({ components: 0, developers: 0, downloads: 0 })

  // Animated counter effect
  useEffect(() => {
    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      setCounters({
        components: Math.floor(1200 * progress),
        developers: Math.floor(50000 * progress),
        downloads: Math.floor(2000000 * progress),
      })
      if (step >= steps) clearInterval(timer)
    }, interval)

    return () => clearInterval(timer)
  }, [])

  const handleCopy = (id: number) => {
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero Section - Luxurious Premium Design */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">
        {/* Animated Background with Luxury Pattern */}
        <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-5" />
        
        {/* Elegant Gold Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-yellow-500/10 animate-gradient-xy" />
        
        {/* Floating Gold Elements */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-amber-400/20 to-yellow-300/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-gradient-to-tl from-yellow-400/15 to-amber-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-amber-500/5 to-yellow-500/5 rounded-full blur-3xl animate-pulse-slow" />
        
        {/* Premium Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/5 to-transparent animate-shimmer" style={{ backgroundSize: "200% 100%" }} />
        
        <div className="relative mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Luxury Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 backdrop-blur-sm border border-amber-400/30 shadow-lg shadow-amber-500/20 animate-in fade-in duration-500">
              <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
              <span className="text-sm font-semibold bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 bg-clip-text text-transparent">
                Trusted by 50,000+ developers worldwide
              </span>
            </div>
            
            {/* Main Heading with Premium White-Gold Texture */}
            <h1 className="text-balance text-6xl font-bold tracking-tight sm:text-7xl lg:text-8xl animate-in fade-in duration-700 delay-100">
              <span className="bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 bg-clip-text text-transparent">
                Build Faster with
              </span>
              <span className="block mt-4 relative">
                {/* White-Gold Luxury Text with Multiple Layers */}
                <span className="absolute inset-0 bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 bg-clip-text text-transparent blur-sm opacity-50"></span>
                <span className="relative bg-gradient-to-r from-amber-300 via-yellow-50 to-amber-300 bg-clip-text text-transparent animate-gradient-x" style={{ backgroundSize: "200% auto" }}>
                  Premium
                </span>
                <span className="relative ml-4 bg-gradient-to-r from-gray-100 via-white to-gray-100 bg-clip-text text-transparent">
                  Components
                </span>
              </span>
            </h1>
            
            {/* Subtitle with Elegant Color */}
            <p className="mt-6 text-pretty text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-in fade-in duration-700 delay-200">
              Discover <span className="text-amber-300 font-semibold">1,200+</span> production-ready UI components. Copy, customize, and ship beautiful interfaces in minutes, not days.
            </p>

            {/* Search Bar - Luxury Gold Glow */}
            <div className="mx-auto mt-12 max-w-3xl animate-in fade-in duration-700 delay-300">
              <div className="relative group">
                {/* Gold Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/40 via-yellow-300/40 to-amber-400/40 rounded-2xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-2xl blur-xl" />
                
                <div className="relative">
                  <Search className="absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-amber-400 z-10" />
                  <Input
                    type="text"
                    placeholder="Search 1,200+ luxury components..."
                    className="h-16 pl-14 pr-32 text-lg bg-white/95 dark:bg-gray-800/95 dark:text-white text-gray-900 placeholder:text-gray-400 dark:placeholder:text-gray-500 border border-amber-400/30 rounded-2xl shadow-2xl shadow-amber-500/20 focus:ring-4 focus:ring-amber-500/30 focus:border-amber-500/50 transition-all backdrop-blur-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button 
                    size="lg" 
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold px-6 shadow-lg shadow-amber-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/40"
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </div>

            {/* Premium CTA Buttons */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4 animate-in fade-in duration-700 delay-400">
              <Link href="/browse">
                <Button size="lg" className="relative overflow-hidden bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-black font-bold text-lg px-10 py-6 rounded-xl shadow-2xl shadow-amber-500/30 hover:shadow-3xl hover:shadow-amber-500/40 hover:scale-105 transition-all duration-300 group">
                  <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <Eye className="h-5 w-5 mr-2 relative z-10" />
                  <span className="relative z-10">Browse Components</span>
                </Button>
              </Link>
              <Link href="/submit">
                <Button
                  size="lg"
                  variant="outline"
                  className="relative overflow-hidden border-2 border-amber-400/50 text-amber-100 hover:bg-amber-500/10 hover:border-amber-400 text-lg px-10 py-6 rounded-xl bg-white/5 backdrop-blur-sm shadow-xl shadow-amber-500/10 hover:shadow-2xl hover:shadow-amber-500/20 hover:scale-105 transition-all duration-300 group"
                >
                  <PlayCircle className="h-5 w-5 mr-2" />
                  Watch Demo
                </Button>
              </Link>
            </div>

            {/* Luxury Trust Badges */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-amber-200/80 animate-in fade-in duration-700 delay-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">Free Forever Plan</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">Cancel Anytime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 w-full">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-24 fill-slate-50 dark:fill-slate-900" style={{ display: 'block' }}>
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" />
          </svg>
        </div>
      </section>

      {/* Luxury Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-slate-50 to-background dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 p-2">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group relative animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Animated Gradient Border Container */}
                <div className="absolute -inset-[2px] bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-xl blur-sm opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-x"></div>
                
                {/* Card */}
                <Card className="relative h-full bg-black dark:bg-black border-0 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <CardContent className="p-8 text-center relative z-10 h-full flex flex-col justify-center">
                  {/* Premium Icon */}
                  <div className="relative inline-block mb-4">
                    <stat.icon className="h-12 w-12 mx-auto text-amber-400 dark:text-amber-300 group-hover:scale-110 group-hover:text-amber-300 transition-all duration-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                  </div>
                  
                  {/* White-Gold Number */}
                  <div className="text-4xl font-bold bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="mx-auto max-w-7xl">
          {/* Luxury Section Header */}
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Badge className="mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 text-white dark:from-purple-500 dark:via-pink-500 dark:to-purple-500 dark:text-white border-0 px-6 py-2 shadow-lg shadow-purple-500/30">
              <Sparkles className="inline h-3 w-3 mr-1" />
              Why ComponentVault
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                Everything you need to
              </span>
              <span className="block mt-2 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 bg-clip-text text-transparent animate-gradient-x" style={{ backgroundSize: "200% auto" }}>
                build amazing products
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              <span className="font-semibold text-amber-600 dark:text-amber-400">Premium</span> components with enterprise-grade quality. Built by experts, trusted by professionals.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {enhancedFeatures.map((feature, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-2 hover:border-purple-500/50 dark:hover:border-purple-400/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient Orb */}
                <div className={`absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br ${feature.gradient} opacity-10 rounded-full blur-3xl group-hover:opacity-20 group-hover:scale-150 transition-all duration-700`} />
                
                <CardContent className="p-8 relative">
                  <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:bg-gradient-to-r group-hover:from-amber-600 group-hover:to-yellow-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/30 to-background">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Badge className="mb-4 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 px-4 py-2">
              <Trophy className="h-4 w-4 mr-2 inline" />
              Loved by Developers
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Join 50,000+ happy developers
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what developers are saying about ComponentVault
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-2 bg-white dark:bg-gray-900 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-8">
                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  {/* Content */}
                  <p className="text-muted-foreground mb-6 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                  
                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 ring-2 ring-purple-500/20">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                        {testimonial.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Components Section - Simplified */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">Popular Components</h2>
              <p className="text-muted-foreground text-lg">Explore our most downloaded and highly rated components</p>
            </div>
            <Link href="/browse">
              <Button size="lg" variant="outline" className="group">
                View All
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {mockComponents.slice(0, 6).map((component, index) => (
              <Card
                key={component.id}
                className="group overflow-hidden border-2 hover:border-purple-500/50 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                    {/* Thumbnail */}
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      <img
                        src={component.thumbnail || "/placeholder.svg"}
                        alt={component.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge
                          className={`${
                            component.accessibilityScore >= 95
                              ? "bg-emerald-500 hover:bg-emerald-600"
                              : component.accessibilityScore >= 90
                                ? "bg-blue-500 hover:bg-blue-600"
                                : "bg-yellow-500 hover:bg-yellow-600"
                          } text-white`}
                        >
                          A11y: {component.accessibilityScore}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg">{component.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{component.description}</p>
                      </div>

                      {/* Tags and Frameworks */}
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {component.category}
                        </Badge>
                        {component.frameworks.map((framework) => (
                          <Badge key={framework} variant="outline" className="text-xs">
                            {framework}
                          </Badge>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{component.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          <span>{component.downloads.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleCopy(component.id)}>
                          {copiedId === component.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => toggleFavorite(component.id)}>
                          <Heart
                            className={`h-4 w-4 ${favorites.includes(component.id) ? "fill-red-500 text-red-500" : ""}`}
                          />
                        </Button>
                      </div>
                    </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Luxury CTA Section - Final Call to Action */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Premium Dark Background with Gold Accents */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-black" />
        <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-5" />
        
        {/* Gold Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-yellow-500/10" />
        
        {/* Elegant Floating Gold Elements */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-amber-400/20 to-yellow-300/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-gradient-to-tl from-yellow-400/15 to-amber-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        
        <div className="relative mx-auto max-w-4xl text-center text-white">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 backdrop-blur-sm border border-amber-400/30 mb-8 animate-bounce-subtle shadow-lg shadow-amber-500/20">
            <Rocket className="h-5 w-5 text-amber-300" />
            <span className="text-sm font-semibold bg-gradient-to-r from-amber-200 to-yellow-100 bg-clip-text text-transparent">Start building today</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-100 via-white to-gray-100 bg-clip-text text-transparent">
              Ready to build something
            </span>
            <span className="block mt-2 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent animate-gradient-x" style={{ backgroundSize: "200% auto" }}>
              amazing?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join <span className="text-amber-300 font-semibold">thousands</span> of developers who are already building faster with ComponentVault. Get started for free, no credit card required.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/browse">
              <Button size="lg" className="relative overflow-hidden bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-black font-bold text-lg px-12 py-8 rounded-2xl shadow-2xl shadow-amber-500/30 hover:shadow-3xl hover:shadow-amber-500/50 hover:scale-105 transition-all duration-300 group">
                <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <Rocket className="h-6 w-6 mr-2 relative z-10" />
                <span className="relative z-10">Get Started Free</span>
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-amber-400/50 text-amber-100 hover:bg-amber-500/10 hover:border-amber-400 text-lg px-12 py-8 rounded-2xl bg-white/5 backdrop-blur-sm shadow-2xl shadow-amber-500/10 hover:shadow-amber-500/20 hover:scale-105 transition-all duration-300 font-semibold"
              >
                <Github className="h-6 w-6 mr-2" />
                View on GitHub
              </Button>
            </Link>
          </div>
          
          <div className="mt-16 flex items-center justify-center gap-12 text-purple-200">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{counters.components.toLocaleString()}+</div>
              <div className="text-sm">Components</div>
            </div>
            <div className="w-px h-12 bg-purple-400/30" />
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{counters.developers.toLocaleString()}+</div>
              <div className="text-sm">Developers</div>
            </div>
            <div className="w-px h-12 bg-purple-400/30" />
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{(counters.downloads / 1000).toFixed(1)}M+</div>
              <div className="text-sm">Downloads</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}