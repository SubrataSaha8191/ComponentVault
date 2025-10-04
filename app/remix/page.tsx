"use client"

import type React from "react"

import { useState, useRef } from "react"
import {
  Save,
  Download,
  Undo2,
  Redo2,
  Search,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Layers,
  Settings,
  GripVertical,
  Monitor,
  Tablet,
  Smartphone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Component library data
const componentLibrary = [
  { id: "button", name: "Button", category: "Basic", icon: "🔘" },
  { id: "card", name: "Card", category: "Layout", icon: "🃏" },
  { id: "input", name: "Input", category: "Forms", icon: "📝" },
  { id: "navbar", name: "Navbar", category: "Navigation", icon: "🧭" },
  { id: "hero", name: "Hero Section", category: "Sections", icon: "🎯" },
  { id: "footer", name: "Footer", category: "Sections", icon: "📄" },
  { id: "modal", name: "Modal", category: "Overlays", icon: "🪟" },
  { id: "table", name: "Data Table", category: "Data", icon: "📊" },
  { id: "form", name: "Form", category: "Forms", icon: "📋" },
  { id: "sidebar", name: "Sidebar", category: "Navigation", icon: "📑" },
]

interface CanvasComponent {
  id: string
  type: string
  name: string
  x: number
  y: number
  width: number
  height: number
  styles: {
    backgroundColor: string
    padding: number
    margin: number
    borderRadius: number
  }
  children?: CanvasComponent[]
}

export default function RemixPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [canvasComponents, setCanvasComponents] = useState<CanvasComponent[]>([])
  const [selectedComponent, setSelectedComponent] = useState<CanvasComponent | null>(null)
  const [draggedComponent, setDraggedComponent] = useState<string | null>(null)
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [deviceView, setDeviceView] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [history, setHistory] = useState<CanvasComponent[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const canvasRef = useRef<HTMLDivElement>(null)

  const filteredComponents = componentLibrary.filter(
    (comp) =>
      comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const categories = Array.from(new Set(componentLibrary.map((c) => c.category)))

  const handleDragStart = (componentId: string) => {
    setDraggedComponent(componentId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingOver(true)
  }

  const handleDragLeave = () => {
    setIsDraggingOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingOver(false)

    if (!draggedComponent || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const component = componentLibrary.find((c) => c.id === draggedComponent)
    if (!component) return

    const newComponent: CanvasComponent = {
      id: `${component.id}-${Date.now()}`,
      type: component.id,
      name: component.name,
      x,
      y,
      width: 200,
      height: 100,
      styles: {
        backgroundColor: "#ffffff",
        padding: 16,
        margin: 8,
        borderRadius: 8,
      },
    }

    const newComponents = [...canvasComponents, newComponent]
    setCanvasComponents(newComponents)
    addToHistory(newComponents)
    setDraggedComponent(null)
  }

  const addToHistory = (components: CanvasComponent[]) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(components)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setCanvasComponents(history[historyIndex - 1])
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setCanvasComponents(history[historyIndex + 1])
    }
  }

  const handleDeleteComponent = (id: string) => {
    const newComponents = canvasComponents.filter((c) => c.id !== id)
    setCanvasComponents(newComponents)
    addToHistory(newComponents)
    if (selectedComponent?.id === id) {
      setSelectedComponent(null)
    }
  }

  const handleSelectComponent = (component: CanvasComponent) => {
    setSelectedComponent(component)
  }

  const updateComponentStyle = (property: string, value: any) => {
    if (!selectedComponent) return

    const newComponents = canvasComponents.map((c) =>
      c.id === selectedComponent.id
        ? {
            ...c,
            styles: {
              ...c.styles,
              [property]: value,
            },
          }
        : c,
    )

    setCanvasComponents(newComponents)
    setSelectedComponent({
      ...selectedComponent,
      styles: {
        ...selectedComponent.styles,
        [property]: value,
      },
    })
    addToHistory(newComponents)
  }

  const handleSave = () => {
    const data = JSON.stringify(canvasComponents, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "component-composition.json"
    a.click()
  }

  const handleExport = () => {
    // Export as code
    console.log("Exporting composition...")
  }

  const getDeviceWidth = () => {
    switch (deviceView) {
      case "mobile":
        return "375px"
      case "tablet":
        return "768px"
      default:
        return "100%"
    }
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Toolbar */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Component Remix Studio</h1>
            <Badge variant="secondary">Beta</Badge>
          </div>

          <div className="flex items-center gap-2">
            {/* Undo/Redo */}
            <Button variant="outline" size="sm" onClick={handleUndo} disabled={historyIndex <= 0} title="Undo (Ctrl+Z)">
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-border mx-2" />

            {/* Device View */}
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              <Button
                variant={deviceView === "desktop" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setDeviceView("desktop")}
                title="Desktop View"
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant={deviceView === "tablet" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setDeviceView("tablet")}
                title="Tablet View"
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant={deviceView === "mobile" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setDeviceView("mobile")}
                title="Mobile View"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>

            <div className="w-px h-6 bg-border mx-2" />

            {/* Preview Mode */}
            <Button
              variant={previewMode ? "default" : "outline"}
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
            >
              {previewMode ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {previewMode ? "Edit Mode" : "Preview"}
            </Button>

            <div className="w-px h-6 bg-border mx-2" />

            {/* Save/Export */}
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button size="sm" onClick={handleExport} className="bg-purple-600 hover:bg-purple-700">
              <Download className="h-4 w-4 mr-2" />
              Export Code
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Component Library */}
        {!previewMode && (
          <div className="w-80 border-r bg-card/30 backdrop-blur-sm overflow-y-auto">
            <div className="p-4 space-y-4">
              <div>
                <h2 className="text-lg font-semibold mb-3">Component Library</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search components..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Component List by Category */}
              <div className="space-y-4">
                {categories.map((category) => {
                  const categoryComponents = filteredComponents.filter((c) => c.category === category)
                  if (categoryComponents.length === 0) return null

                  return (
                    <div key={category}>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">{category}</h3>
                      <div className="space-y-2">
                        {categoryComponents.map((component) => (
                          <Card
                            key={component.id}
                            draggable
                            onDragStart={() => handleDragStart(component.id)}
                            className="p-3 cursor-move hover:bg-accent transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">{component.icon}</div>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{component.name}</p>
                                <p className="text-xs text-muted-foreground">{component.category}</p>
                              </div>
                              <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto bg-muted/20 p-8">
          <div className="mx-auto" style={{ width: getDeviceWidth(), maxWidth: "100%" }}>
            <div
              ref={canvasRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`min-h-[600px] bg-background rounded-lg border-2 border-dashed transition-all ${
                isDraggingOver
                  ? "border-purple-500 bg-purple-50/50 dark:bg-purple-950/20"
                  : "border-border hover:border-muted-foreground/50"
              } ${previewMode ? "border-solid" : ""}`}
            >
              {canvasComponents.length === 0 && !previewMode ? (
                <div className="h-full min-h-[600px] flex items-center justify-center">
                  <div className="text-center space-y-3">
                    <div className="text-6xl">🎨</div>
                    <h3 className="text-xl font-semibold">Start Building</h3>
                    <p className="text-muted-foreground max-w-sm">
                      Drag components from the left panel to start creating your composition
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative p-4">
                  {canvasComponents.map((component) => (
                    <div
                      key={component.id}
                      onClick={() => handleSelectComponent(component)}
                      className={`absolute cursor-pointer transition-all ${
                        selectedComponent?.id === component.id && !previewMode
                          ? "ring-2 ring-purple-500 ring-offset-2"
                          : "hover:ring-2 hover:ring-purple-300"
                      }`}
                      style={{
                        left: component.x,
                        top: component.y,
                        width: component.width,
                        height: component.height,
                        backgroundColor: component.styles.backgroundColor,
                        padding: component.styles.padding,
                        margin: component.styles.margin,
                        borderRadius: component.styles.borderRadius,
                      }}
                    >
                      <div className="h-full flex items-center justify-center border border-border rounded bg-card/50 backdrop-blur-sm">
                        <div className="text-center">
                          <p className="font-medium">{component.name}</p>
                          <p className="text-xs text-muted-foreground">{component.type}</p>
                        </div>
                      </div>

                      {!previewMode && selectedComponent?.id === component.id && (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteComponent(component.id)
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Properties */}
        {!previewMode && (
          <div className="w-80 border-l bg-card/30 backdrop-blur-sm overflow-y-auto">
            <div className="p-4 space-y-6">
              <Tabs defaultValue="properties" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="properties">
                    <Settings className="h-4 w-4 mr-2" />
                    Properties
                  </TabsTrigger>
                  <TabsTrigger value="layers">
                    <Layers className="h-4 w-4 mr-2" />
                    Layers
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="properties" className="space-y-6 mt-4">
                  {selectedComponent ? (
                    <>
                      <div>
                        <h3 className="font-semibold mb-2">{selectedComponent.name}</h3>
                        <p className="text-sm text-muted-foreground">Type: {selectedComponent.type}</p>
                      </div>

                      {/* Background Color */}
                      <div className="space-y-2">
                        <Label>Background Color</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={selectedComponent.styles.backgroundColor}
                            onChange={(e) => updateComponentStyle("backgroundColor", e.target.value)}
                            className="w-16 h-10 p-1"
                          />
                          <Input
                            type="text"
                            value={selectedComponent.styles.backgroundColor}
                            onChange={(e) => updateComponentStyle("backgroundColor", e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>

                      {/* Padding */}
                      <div className="space-y-2">
                        <Label>Padding: {selectedComponent.styles.padding}px</Label>
                        <Slider
                          value={[selectedComponent.styles.padding]}
                          onValueChange={(value) => updateComponentStyle("padding", value[0])}
                          max={64}
                          step={4}
                        />
                      </div>

                      {/* Margin */}
                      <div className="space-y-2">
                        <Label>Margin: {selectedComponent.styles.margin}px</Label>
                        <Slider
                          value={[selectedComponent.styles.margin]}
                          onValueChange={(value) => updateComponentStyle("margin", value[0])}
                          max={64}
                          step={4}
                        />
                      </div>

                      {/* Border Radius */}
                      <div className="space-y-2">
                        <Label>Border Radius: {selectedComponent.styles.borderRadius}px</Label>
                        <Slider
                          value={[selectedComponent.styles.borderRadius]}
                          onValueChange={(value) => updateComponentStyle("borderRadius", value[0])}
                          max={32}
                          step={2}
                        />
                      </div>

                      {/* Actions */}
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          className="w-full bg-transparent"
                          onClick={() => {
                            const newComponent = {
                              ...selectedComponent,
                              id: `${selectedComponent.type}-${Date.now()}`,
                              x: selectedComponent.x + 20,
                              y: selectedComponent.y + 20,
                            }
                            const newComponents = [...canvasComponents, newComponent]
                            setCanvasComponents(newComponents)
                            addToHistory(newComponents)
                          }}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </Button>
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={() => handleDeleteComponent(selectedComponent.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Settings className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Select a component to edit its properties</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="layers" className="space-y-2 mt-4">
                  {canvasComponents.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Layers className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No components added yet</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {canvasComponents.map((component, index) => (
                        <Card
                          key={component.id}
                          onClick={() => handleSelectComponent(component)}
                          className={`p-3 cursor-pointer transition-colors ${
                            selectedComponent?.id === component.id
                              ? "bg-purple-100 dark:bg-purple-950"
                              : "hover:bg-accent"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium text-sm">{component.name}</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {index + 1}
                            </Badge>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
