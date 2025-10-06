"use client"

import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function DebugPage() {
  const [components, setComponents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAllComponents = async () => {
      try {
        setLoading(true)
        console.log("Fetching ALL components from Firestore...")
        
        const querySnapshot = await getDocs(collection(db, "components"))
        console.log("Total documents found:", querySnapshot.docs.length)
        
        const allComponents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        
        console.log("All components:", allComponents)
        setComponents(allComponents)
      } catch (err: any) {
        console.error("Error fetching components:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAllComponents()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <h1 className="text-3xl font-bold mb-4">Loading components...</h1>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <h1 className="text-3xl font-bold mb-4 text-red-500">Error</h1>
        <p className="text-red-300">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Debug: All Components in Database</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Total Components: {components.length}</h2>
        <p className="text-gray-400">
          Published: {components.filter(c => c.isPublished === true).length} |
          Public: {components.filter(c => c.isPublic === true).length} |
          Both: {components.filter(c => c.isPublished === true && c.isPublic === true).length}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {components.length === 0 ? (
          <Card className="col-span-full bg-gray-900 border-gray-700">
            <CardContent className="p-8 text-center">
              <p className="text-xl text-gray-400">No components found in database</p>
              <p className="text-sm text-gray-500 mt-2">Go to Dashboard and publish a component first</p>
            </CardContent>
          </Card>
        ) : (
          components.map((component) => (
            <Card key={component.id} className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="truncate">{component.title || component.name || "Untitled"}</span>
                  <div className="flex gap-2">
                    {component.isPublished === true && (
                      <Badge className="bg-green-500">Published</Badge>
                    )}
                    {component.isPublic === true && (
                      <Badge className="bg-blue-500">Public</Badge>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-400">ID:</span>
                    <span className="ml-2 text-white font-mono text-xs">{component.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Author:</span>
                    <span className="ml-2 text-white">{component.authorName || "Unknown"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Framework:</span>
                    <span className="ml-2 text-white">{component.framework || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Category:</span>
                    <span className="ml-2 text-white">{component.category || "N/A"}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-700">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-400">isPublished:</span>
                        <span className={`ml-2 ${component.isPublished === true ? 'text-green-400' : 'text-red-400'}`}>
                          {String(component.isPublished)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">isPublic:</span>
                        <span className={`ml-2 ${component.isPublic === true ? 'text-green-400' : 'text-red-400'}`}>
                          {String(component.isPublic)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">isFeatured:</span>
                        <span className="ml-2 text-gray-500">{String(component.isFeatured)}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">isPremium:</span>
                        <span className="ml-2 text-gray-500">{String(component.isPremium)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
