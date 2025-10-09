"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Heart,
  Eye,
  Share2,
  MoreVertical,
  Edit,
  Trash2,
  Download,
  Plus,
  Lock,
  Globe,
  Calendar,
  Layers,
  ArrowLeft,
  Star,
  MessageSquare,
  Loader2,
  Search,
  X,
  FolderOpen,
  Upload,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Collection, Component } from "@/lib/firebase/types"
import { useAlert } from "@/hooks/use-alert"

export default function CollectionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const alert = useAlert()
  const collectionId = params.id as string

  const [collection, setCollection] = useState<Collection | null>(null)
  const [components, setComponents] = useState<Component[]>([])
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isAddComponentDialogOpen, setIsAddComponentDialogOpen] = useState(false)
  const [availableComponents, setAvailableComponents] = useState<Component[]>([])
  const [selectedComponentIds, setSelectedComponentIds] = useState<string[]>([])
  const [componentSearchQuery, setComponentSearchQuery] = useState("")
  const [isLoadingComponents, setIsLoadingComponents] = useState(false)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)

  // Fetch collection data
  useEffect(() => {
    const fetchCollection = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/collections?id=${collectionId}`)
        if (!response.ok) {
          throw new Error('Collection not found')
        }
        const data = await response.json()
        console.log('Fetched collection data:', data)
        
        // Check access permissions
        if (!data.isPublic && (!user || data.userId !== user.uid)) {
          router.push('/collections')
          return
        }
        
        setCollection(data)
        
        // Fetch components in this collection
        if (data.componentIds && data.componentIds.length > 0) {
          console.log('Fetching components for IDs:', data.componentIds)
          const componentPromises = data.componentIds.map((id: string) =>
            fetch(`/api/components/${id}`).then(res => res.json())
          )
          const componentsData = await Promise.all(componentPromises)
          console.log('Fetched components data:', componentsData)
          const validComponents = componentsData.filter(c => c && !c.error)
          console.log('Valid components:', validComponents)
          setComponents(validComponents)
        } else {
          // No components in collection yet
          console.log('No componentIds in collection')
          setComponents([])
        }
      } catch (error) {
        console.error('Error fetching collection:', error)
        router.push('/collections')
      } finally {
        setLoading(false)
      }
    }

    if (collectionId) {
      fetchCollection()
    }
  }, [collectionId, user, router])

  // Fetch user's components when add dialog opens
  const fetchUserComponents = async () => {
    if (!user) return
    
    setIsLoadingComponents(true)
    try {
      const idToken = await user.getIdToken()
      // Include private components when fetching user's own components
      const response = await fetch(`/api/components?authorId=${user.uid}&includePrivate=true`, {
        headers: { 'Authorization': `Bearer ${idToken}` }
      })
      
      if (!response.ok) {
        console.error('Failed to fetch components:', response.statusText)
        setAvailableComponents([])
        return
      }
      
      const data = await response.json()
      
      // Ensure data is an array
      if (!Array.isArray(data)) {
        console.error('API returned non-array data:', data)
        setAvailableComponents([])
        return
      }
      
      // Filter out components already in collection
      const alreadyInCollection = collection?.componentIds || []
      setAvailableComponents(data.filter((c: Component) => !alreadyInCollection.includes(c.id)))
    } catch (error) {
      console.error('Error fetching components:', error)
      setAvailableComponents([])
    } finally {
      setIsLoadingComponents(false)
    }
  }

  // Handle cover image selection with preview and basic validation
  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (!file) {
      setCoverFile(null)
      setCoverPreview(null)
      return
    }
    if (!file.type.startsWith('image/')) {
      alert.showWarning('Invalid File Type', 'Please select a valid image file (JPG, PNG, GIF, etc.)')
      return
    }
    // Preview
    const reader = new FileReader()
    reader.onload = () => setCoverPreview(reader.result as string)
    reader.readAsDataURL(file)
    setCoverFile(file)
  }

  // Compress large images (> 1MB) using canvas and return base64
  const toBase64WithCompression = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const maxW = 1600
          const scale = Math.min(1, maxW / img.width)
          canvas.width = Math.floor(img.width * scale)
          canvas.height = Math.floor(img.height * scale)
          const ctx = canvas.getContext('2d')
          if (!ctx) return reject(new Error('Canvas not supported'))
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          const quality = 0.8
          const base64 = canvas.toDataURL('image/jpeg', quality)
          resolve(base64)
        }
        img.onerror = () => reject(new Error('Failed to load image for compression'))
        img.src = reader.result as string
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }

  // Filter available components by search
  const filteredAvailableComponents = useMemo(() => {
    if (!componentSearchQuery) return availableComponents
    const query = componentSearchQuery.toLowerCase()
    return availableComponents.filter(c =>
      c.name?.toLowerCase().includes(query) ||
      c.title?.toLowerCase().includes(query) ||
      c.description?.toLowerCase().includes(query)
    )
  }, [availableComponents, componentSearchQuery])

  const handleAddComponentsToCollection = async () => {
    if (!user || !collection || selectedComponentIds.length === 0) return

    try {
      console.log('Adding components:', selectedComponentIds)
      const idToken = await user.getIdToken()
      const response = await fetch(`/api/collections/${collectionId}/components`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ componentIds: selectedComponentIds }),
      })

      if (response.ok) {
        console.log('Components added successfully, fetching data...')
        
        // Fetch the newly added components
        const newComponentPromises = selectedComponentIds.map((id: string) =>
          fetch(`/api/components/${id}`).then(res => res.json())
        )
        const newComponentsData = await Promise.all(newComponentPromises)
        const validNewComponents = newComponentsData.filter(c => c && !c.error)
        
        console.log('Fetched new components:', validNewComponents)
        
        // Update components state
        setComponents([...components, ...validNewComponents])
        
        // Update collection state with new componentIds
        const updatedComponentIds = [...(collection.componentIds || []), ...selectedComponentIds]
        setCollection({
          ...collection,
          componentIds: updatedComponentIds
        })
        
        console.log('Updated collection componentIds:', updatedComponentIds)
        
        // Remove added components from available list
        setAvailableComponents(
          availableComponents.filter(c => !selectedComponentIds.includes(c.id))
        )
        
        // Close dialog and reset
        setIsAddComponentDialogOpen(false)
        setSelectedComponentIds([])
        setComponentSearchQuery('')
      } else {
        const errorData = await response.json()
        console.error('Failed to add components:', errorData)
        alert.showError('Failed to Add Components', errorData.error || 'An unknown error occurred while adding components')
      }
    } catch (error) {
      console.error('Error adding components:', error)
      alert.showError('Error', 'Failed to add components to collection')
    }
  }

  const handleRemoveComponent = async (componentId: string) => {
    if (!user || !collection) return
    
    alert.showConfirm(
      'Remove Component?',
      'Are you sure you want to remove this component from the collection?',
      async () => {
        try {
          const idToken = await user.getIdToken()
          const response = await fetch(`/api/collections/${collectionId}/components`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify({ componentId }),
          })

          if (response.ok) {
            setComponents(components.filter(c => c.id !== componentId))
          } else {
            alert.showError('Failed to Remove', 'Could not remove component from collection')
          }
        } catch (error) {
          console.error('Error removing component:', error)
          alert.showError('Error', 'An error occurred while removing the component')
        }
      },
      undefined,
      'warning'
    )
  }

  const handleUpdateCollection = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user || !collection) return

    const formData = new FormData(event.currentTarget)
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const tags = formData.get('tags') as string
    // Prepare cover image payload (base64 string)
    let coverImage: string | undefined
    if (coverFile) {
      const sizeMB = coverFile.size / (1024 * 1024)
      if (sizeMB > 1) {
        coverImage = await toBase64WithCompression(coverFile)
      } else {
        coverImage = await new Promise<string>((resolve, reject) => {
          const r = new FileReader()
          r.onload = () => resolve(r.result as string)
          r.onerror = () => reject(new Error('Failed to read cover image'))
          r.readAsDataURL(coverFile)
        })
      }
    }

    try {
      const idToken = await user.getIdToken()
      const response = await fetch(`/api/collections/${collectionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          name,
          description,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          ...(coverImage ? { coverImage } : {}),
        }),
      })

      if (response.ok) {
        // Update UI without reload
        setIsEditDialogOpen(false)
        setCollection({
          ...collection,
          name,
          description,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          ...(coverImage ? { coverImage } : {}),
        } as any)
        setCoverFile(null)
        setCoverPreview(null)
      } else {
        alert.showError('Update Failed', 'Could not update collection details')
      }
    } catch (error) {
      console.error('Error updating collection:', error)
      alert.showError('Error', 'An error occurred while updating the collection')
    }
  }

  const handleDeleteCollection = async () => {
    if (!user || !collection) return

    try {
      const idToken = await user.getIdToken()
      const response = await fetch(`/api/collections/${collectionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${idToken}` },
      })

      if (response.ok) {
        router.push('/collections')
      } else {
        alert.showError('Delete Failed', 'Could not delete the collection')
      }
    } catch (error) {
      console.error('Error deleting collection:', error)
      alert.showError('Error', 'An error occurred while deleting the collection')
    }
  }

  const formatDate = (date: any) => {
    if (!date) return 'Unknown'
    const dateObj = date.toDate ? date.toDate() : new Date(date)
    return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const formatTimeAgo = (date: any) => {
    if (!date) return 'Unknown'
    const dateObj = date.toDate ? date.toDate() : new Date(date)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60))
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return `${Math.floor(diffInDays / 30)} months ago`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!collection) {
    return null
  }

  const isOwner = user && collection.userId === user.uid

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6 gap-2" asChild>
          <Link href="/collections">
            <ArrowLeft className="h-4 w-4" />
            Back to Collections
          </Link>
        </Button>

        {/* Hero Section */}
        <Card className="mb-8 overflow-hidden">
          <div className="relative aspect-[3/1] bg-muted">
            {collection.coverImage ? (
              <img
                src={collection.coverImage}
                alt={collection.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-primary/10 to-primary/5">
                <FolderOpen className="h-24 w-24 text-muted-foreground" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant={collection.isPublic ? "default" : "secondary"} className="gap-1">
                      {collection.isPublic ? (
                        <>
                          <Globe className="h-3 w-3" />
                          Public
                        </>
                      ) : (
                        <>
                          <Lock className="h-3 w-3" />
                          Private
                        </>
                      )}
                    </Badge>
                  </div>
                  <h1 className="text-4xl font-bold mb-3">{collection.name}</h1>
                  <p className="text-lg text-muted-foreground max-w-3xl">{collection.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={isLiked ? "default" : "outline"}
                    size="lg"
                    className="gap-2"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                    {(collection.likes || 0) + (isLiked ? 1 : 0)}
                  </Button>
                  <Button variant="outline" size="lg" className="gap-2">
                    <Share2 className="h-5 w-5" />
                    Share
                  </Button>
                  {isOwner && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="lg">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Collection
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setIsAddComponentDialogOpen(true)
                          fetchUserComponents()
                        }}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Components
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Collection
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats and Author */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Collection Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Layers className="h-5 w-5" />
                  <span>Components</span>
                </div>
                <span className="text-2xl font-bold">{components.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Heart className="h-5 w-5" />
                  <span>Likes</span>
                </div>
                <span className="text-2xl font-bold">{collection.likes || 0}</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-5 w-5" />
                  <span>Created</span>
                </div>
                <span className="font-medium">{formatDate(collection.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-5 w-5" />
                  <span>Updated</span>
                </div>
                <span className="font-medium">{formatTimeAgo(collection.updatedAt)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Author */}
          <Card>
            <CardHeader>
              <CardTitle>Created By</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-16 w-16">
                  <AvatarFallback>{collection.userName?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{collection.userName}</h3>
                  <p className="text-muted-foreground text-sm">Collection Owner</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Components Grid */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Components in this Collection</CardTitle>
                <CardDescription>{components.length} components</CardDescription>
              </div>
              {isOwner && (
                <Button onClick={() => {
                  setIsAddComponentDialogOpen(true)
                  fetchUserComponents()
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Components
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {components.length === 0 ? (
              <div className="text-center py-12">
                <Layers className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Components Yet</h3>
                <p className="text-muted-foreground mb-4">
                  {isOwner ? "Start adding components to your collection" : "This collection is empty"}
                </p>
                {isOwner && (
                  <Button onClick={() => {
                    setIsAddComponentDialogOpen(true)
                    fetchUserComponents()
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Component
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {components.map((component) => (
                  <Card key={component.id} className="group hover:shadow-lg transition-shadow">
                    <Link href={`/component/${component.id}`}>
                      <div className="relative aspect-video overflow-hidden bg-muted rounded-t-lg">
                        {component.previewImage || component.thumbnail ? (
                          <img
                            src={component.previewImage || component.thumbnail}
                            alt={component.name || component.title}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full">
                            <Layers className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </Link>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <Link href={`/component/${component.id}`}>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors cursor-pointer">
                            {component.name || component.title}
                          </CardTitle>
                        </Link>
                        {isOwner && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveComponent(component.id)}
                          >
                            <X className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                      <CardDescription className="line-clamp-2">{component.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          <span>{component.downloads || component.stats?.downloads || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{component.stats?.rating || 0}</span>
                        </div>
                      </div>
                      <Badge variant="secondary">{component.framework}</Badge>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleUpdateCollection}>
              <DialogHeader>
                <DialogTitle>Edit Collection</DialogTitle>
                <DialogDescription>Update your collection details</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Collection Name</Label>
                  <Input id="edit-name" name="name" defaultValue={collection.name} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea id="edit-description" name="description" defaultValue={collection.description} rows={3} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-tags">Tags (comma separated)</Label>
                  <Input id="edit-tags" name="tags" defaultValue="" placeholder="dashboard, analytics" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-cover">Thumbnail (optional)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('edit-cover')?.click()}
                    className="w-full justify-start"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {coverPreview ? 'Change File' : 'Choose File'}
                  </Button>
                  <input
                    id="edit-cover"
                    type="file"
                    accept="image/*"
                    onChange={handleCoverChange}
                    className="hidden"
                  />
                  <div className="flex items-center gap-3">
                    {(coverPreview || collection.coverImage) && (
                      <img
                        src={coverPreview || (collection.coverImage as any)}
                        alt="Cover Preview"
                        className="h-20 w-32 object-cover rounded border"
                      />
                    )}
                    <p className="text-xs text-muted-foreground">Max ~1MB recommended. Larger images will be compressed.</p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => {
                  setIsEditDialogOpen(false)
                  setCoverFile(null)
                  setCoverPreview(null)
                }}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Collection</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this collection? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteCollection}>
                Delete Collection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Component Dialog */}
        <Dialog open={isAddComponentDialogOpen} onOpenChange={setIsAddComponentDialogOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Add Components to Collection</DialogTitle>
              <DialogDescription>Select components from your library to add to this collection</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search your components..."
                  value={componentSearchQuery}
                  onChange={(e) => setComponentSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="max-h-[400px] overflow-y-auto space-y-2 border rounded-lg p-4">
                {isLoadingComponents ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : filteredAvailableComponents.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    {componentSearchQuery ? 'No components found matching your search' : 'No components available to add'}
                  </p>
                ) : (
                  filteredAvailableComponents.map((component) => (
                    <div key={component.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted">
                      <Checkbox
                        id={component.id}
                        checked={selectedComponentIds.includes(component.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedComponentIds([...selectedComponentIds, component.id])
                          } else {
                            setSelectedComponentIds(selectedComponentIds.filter(id => id !== component.id))
                          }
                        }}
                      />
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-16 h-16 rounded bg-muted flex-shrink-0 overflow-hidden">
                          {component.previewImage || component.thumbnail ? (
                            <img
                              src={component.previewImage || component.thumbnail}
                              alt={component.name || component.title}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full">
                              <Layers className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <label htmlFor={component.id} className="font-medium cursor-pointer">
                            {component.name || component.title}
                          </label>
                          <p className="text-sm text-muted-foreground line-clamp-1">{component.description}</p>
                        </div>
                        <Badge variant="secondary">{component.framework}</Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {selectedComponentIds.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {selectedComponentIds.length} component{selectedComponentIds.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsAddComponentDialogOpen(false)
                setSelectedComponentIds([])
                setComponentSearchQuery('')
              }}>
                Cancel
              </Button>
              <Button
                onClick={handleAddComponentsToCollection}
                disabled={selectedComponentIds.length === 0}
              >
                Add {selectedComponentIds.length > 0 && `(${selectedComponentIds.length})`} to Collection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
