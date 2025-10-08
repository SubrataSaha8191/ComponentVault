"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ArrowLeft,
  Save,
  Eye,
  Code,
  Image as ImageIcon,
  Loader2,
  X,
  Upload,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ComponentData {
  id: string
  name: string
  title: string
  description: string
  code: string
  category: string
  framework: string
  thumbnail: string
  previewImage: string
  authorId: string
  authorName: string
  downloads: number
  views: number
  likes: number
  tags?: string[]
  version?: string
  createdAt: any
  updatedAt: any
  isPublished: boolean
  language?: string
  styling?: string
  dependencies?: string[]
  license?: string
}

export default function EditComponentPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const componentId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [component, setComponent] = useState<ComponentData | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    code: "",
    category: "",
    framework: "",
    language: "typescript",
    styling: "tailwind",
    tags: [] as string[],
    license: "MIT",
    isPublished: true,
    version: "1.0.0",
  })

  const [tagInput, setTagInput] = useState("")
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)

  const frameworks = ["React", "Vue", "Angular", "Svelte", "Solid", "Next.js", "Nuxt", "SvelteKit"]
  const categories = ["button", "card", "form", "input", "navigation", "modal", "table", "layout", "chart", "authentication", "dashboard", "animation"]
  const languages = ["typescript", "javascript"]
  const stylings = ["tailwind", "css", "scss", "styled-components", "emotion"]
  const licenses = ["MIT", "Apache-2.0", "GPL-3.0", "BSD-3-Clause", "ISC"]

  // Fetch component data
  useEffect(() => {
    const fetchComponent = async () => {
      if (!user) {
        router.push('/auth/sign-in')
        return
      }

      try {
        setLoading(true)
        
        const response = await fetch(`/api/components/${componentId}`)
        if (!response.ok) {
          throw new Error('Component not found')
        }
        
        const data = await response.json()
        
        // Check if user is the author
        if (data.authorId !== user.uid) {
          toast.error('You can only edit your own components')
          router.push(`/component/${componentId}`)
          return
        }

        setComponent(data)
        
        // Populate form with existing data
        setFormData({
          name: data.name || data.title || "",
          description: data.description || "",
          code: data.code || "",
          category: data.category || "",
          framework: data.framework || "React",
          language: data.language || "typescript",
          styling: data.styling || "tailwind",
          tags: data.tags || [],
          license: data.license || "MIT",
          isPublished: data.isPublished !== false,
          version: data.version || "1.0.0",
        })
        
        // Set thumbnail preview
        if (data.thumbnail || data.previewImage) {
          setThumbnailPreview(data.thumbnail || data.previewImage)
        }

      } catch (error) {
        console.error('Error fetching component:', error)
        toast.error('Failed to load component')
        router.push('/my-components')
      } finally {
        setLoading(false)
      }
    }

    if (componentId && user) {
      fetchComponent()
    }
  }, [componentId, user, router])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      setThumbnailFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveThumbnail = () => {
    setThumbnailFile(null)
    setThumbnailPreview(component?.thumbnail || component?.previewImage || null)
  }

  const handleSave = async () => {
    if (!user) {
      toast.error('Please sign in to save changes')
      return
    }

    // Validation
    if (!formData.name.trim()) {
      toast.error('Component name is required')
      return
    }
    if (!formData.code.trim()) {
      toast.error('Component code is required')
      return
    }
    if (!formData.category) {
      toast.error('Please select a category')
      return
    }

    try {
      setSaving(true)

      // Get auth token
      const idToken = await user.getIdToken()

      // Prepare update data
      const updateData: any = {
        name: formData.name,
        title: formData.name, // Keep title in sync with name
        description: formData.description,
        code: formData.code,
        category: formData.category,
        framework: formData.framework,
        language: formData.language,
        styling: formData.styling,
        tags: formData.tags,
        license: formData.license,
        isPublished: formData.isPublished,
        version: formData.version,
        updatedAt: new Date().toISOString(),
      }

      // Upload new thumbnail if changed
      if (thumbnailFile) {
        const formDataUpload = new FormData()
        formDataUpload.append('file', thumbnailFile)
        formDataUpload.append('folder', 'thumbnails')

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${idToken}`,
          },
          body: formDataUpload,
        })

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json()
          updateData.thumbnail = uploadResult.url
          updateData.previewImage = uploadResult.url
        }
      }

      // Update component via API
      const response = await fetch(`/api/components/${componentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        throw new Error('Failed to update component')
      }

      toast.success('Component updated successfully!')
      router.push(`/component/${componentId}`)

    } catch (error) {
      console.error('Error updating component:', error)
      toast.error('Failed to update component')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading component...</p>
        </div>
      </div>
    )
  }

  if (!component) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Component not found</h2>
          <Button onClick={() => router.push('/my-components')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Components
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/20 to-background dark:from-background dark:via-purple-950/10">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push(`/component/${componentId}`)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Component
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Edit Component
              </h1>
              <p className="text-muted-foreground mt-2">Update your component details and code</p>
            </div>
            <Badge variant={formData.isPublished ? "default" : "secondary"}>
              {formData.isPublished ? "Published" : "Draft"}
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column - Form */}
          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-purple-600" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Component Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Animated Button"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe your component..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="framework">Framework *</Label>
                    <Select
                      value={formData.framework}
                      onValueChange={(value) => handleInputChange("framework", value)}
                    >
                      <SelectTrigger id="framework">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {frameworks.map((fw) => (
                          <SelectItem key={fw} value={fw}>
                            {fw}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleInputChange("category", value)}
                    >
                      <SelectTrigger id="category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={formData.language}
                      onValueChange={(value) => handleInputChange("language", value)}
                    >
                      <SelectTrigger id="language">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {lang.charAt(0).toUpperCase() + lang.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="styling">Styling</Label>
                    <Select
                      value={formData.styling}
                      onValueChange={(value) => handleInputChange("styling", value)}
                    >
                      <SelectTrigger id="styling">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {stylings.map((style) => (
                          <SelectItem key={style} value={style}>
                            {style.charAt(0).toUpperCase() + style.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Code Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-purple-600" />
                  Component Code *
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={formData.code}
                  onChange={(e) => handleInputChange("code", e.target.value)}
                  placeholder="Paste your component code here..."
                  className="font-mono text-sm h-[400px] resize-none overflow-y-auto"
                />
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                    placeholder="Add a tag..."
                  />
                  <Button onClick={handleAddTag} variant="outline">
                    Add
                  </Button>
                </div>
                
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => handleRemoveTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Preview & Settings */}
          <div className="space-y-6">
            {/* Thumbnail */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-purple-600" />
                  Component Thumbnail
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {thumbnailPreview ? (
                  <div className="relative">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-full rounded-lg border aspect-video object-cover"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveThumbnail}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload a thumbnail image
                    </p>
                  </div>
                )}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('thumbnail-upload')?.click()}
                  className="w-full justify-start"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {thumbnailPreview ? 'Change File' : 'Choose File'}
                </Button>
                <input
                  id="thumbnail-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground">
                  Recommended: 16:9 aspect ratio, max 5MB
                </p>
              </CardContent>
            </Card>

            {/* Additional Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="version">Version</Label>
                  <Input
                    id="version"
                    value={formData.version}
                    onChange={(e) => handleInputChange("version", e.target.value)}
                    placeholder="1.0.0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="license">License</Label>
                  <Select
                    value={formData.license}
                    onValueChange={(value) => handleInputChange("license", value)}
                  >
                    <SelectTrigger id="license">
                      <SelectValue />
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

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="published"
                    checked={formData.isPublished}
                    onCheckedChange={(checked) => 
                      handleInputChange("isPublished", checked)
                    }
                  />
                  <Label htmlFor="published" className="cursor-pointer">
                    Publish component (make it visible to others)
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-purple-600 hover:bg-purple-700"
                size="lg"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push(`/component/${componentId}`)}
                className="w-full"
                disabled={saving}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview Component
              </Button>

              <Button
                variant="ghost"
                onClick={() => router.push('/my-components')}
                className="w-full"
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
