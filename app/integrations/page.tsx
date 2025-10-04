"use client"

import { useState } from 'react'
import { CodeEditor, InlineCodeEditor } from '@/components/code-editor'
import { analyzeComponent, generateComponentSummary } from '@/lib/ast-parser'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Code, Search, Sparkles } from 'lucide-react'

const defaultCode = `import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  title: string
  count?: number
}

export default function Counter({ title, count = 0 }: Props) {
  const [value, setValue] = useState(count)

  useEffect(() => {
    console.log('Counter mounted')
  }, [])

  return (
    <div className="p-4">
      <h2>{title}</h2>
      <p>Count: {value}</p>
      <Button onClick={() => setValue(value + 1)}>
        Increment
      </Button>
    </div>
  )
}
`

export default function IntegrationsDemo() {
  const [code, setCode] = useState(defaultCode)
  const [analysis, setAnalysis] = useState<any>(null)
  const [summary, setSummary] = useState<string>('')

  const handleAnalyze = () => {
    const result = analyzeComponent(code)
    const summaryText = generateComponentSummary(code)
    setAnalysis(result)
    setSummary(summaryText)
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 text-white">
            <Sparkles className="inline h-3 w-3 mr-1" />
            Integrations Demo
          </Badge>
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
              Monaco Editor • AST Parser • Algolia Search
            </span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience live code editing, component analysis, and powerful search capabilities
          </p>
        </div>

        <Tabs defaultValue="editor" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="editor">
              <Code className="h-4 w-4 mr-2" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="parser">
              <Sparkles className="h-4 w-4 mr-2" />
              Parser
            </TabsTrigger>
            <TabsTrigger value="search">
              <Search className="h-4 w-4 mr-2" />
              Search
            </TabsTrigger>
          </TabsList>

          {/* Monaco Editor Demo */}
          <TabsContent value="editor" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Monaco Editor - Live Code Editing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Full-featured code editor with syntax highlighting, IntelliSense, and theme support
                </p>
                <CodeEditor
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  language="typescript"
                  height="500px"
                  minimap={true}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inline Editor Example</CardTitle>
              </CardHeader>
              <CardContent>
                <InlineCodeEditor
                  value="const greeting = 'Hello World'"
                  onChange={(value) => console.log(value)}
                  language="javascript"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* AST Parser Demo */}
          <TabsContent value="parser" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Component Analysis with AST Parser</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Parse and analyze React components to extract props, hooks, and dependencies
                </p>

                <Button onClick={handleAnalyze} className="bg-amber-500 hover:bg-amber-600">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Analyze Component
                </Button>

                {analysis && (
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Summary */}
                    <Card className="bg-muted/50">
                      <CardHeader>
                        <CardTitle className="text-lg">Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <pre className="text-sm whitespace-pre-wrap font-mono">
                          {summary}
                        </pre>
                      </CardContent>
                    </Card>

                    {/* Detailed Analysis */}
                    <Card className="bg-muted/50">
                      <CardHeader>
                        <CardTitle className="text-lg">Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Props ({analysis.props.length})</h4>
                          <div className="space-y-1">
                            {analysis.props.map((prop: any, i: number) => (
                              <Badge key={i} variant="secondary">
                                {prop.name} {prop.required && '*'}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Hooks ({analysis.hooks.length})</h4>
                          <div className="space-y-1">
                            {Array.from(new Set(analysis.hooks)).map((hook: any, i: number) => (
                              <Badge key={i} variant="outline" className="mr-1">
                                {hook}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Dependencies ({analysis.dependencies.length})</h4>
                          <div className="space-y-1">
                            {analysis.dependencies.map((dep: string, i: number) => (
                              <Badge key={i} className="bg-purple-500/10 text-purple-700 dark:text-purple-300 mr-1">
                                {dep}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Metrics</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Type:</span>
                              <span className="font-medium">{analysis.type}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Complexity:</span>
                              <span className="font-medium">{analysis.complexity}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">TypeScript:</span>
                              <span className="font-medium">{analysis.hasTypeScript ? 'Yes' : 'No'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Exports:</span>
                              <span className="font-medium">{analysis.exports.length}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Algolia Search Demo */}
          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Algolia Search Integration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-amber-700 dark:text-amber-400">Setup Required</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    To use Algolia search, you need to configure your API credentials:
                  </p>
                  <ol className="text-sm space-y-2 text-muted-foreground list-decimal list-inside">
                    <li>Create an account at <a href="https://www.algolia.com" target="_blank" className="text-amber-500 hover:underline">algolia.com</a></li>
                    <li>Get your Application ID and Search API Key</li>
                    <li>Add to your <code className="bg-muted px-1 py-0.5 rounded">.env.local</code>:</li>
                  </ol>
                  <pre className="mt-3 bg-black/50 text-white p-3 rounded text-xs overflow-x-auto">
{`NEXT_PUBLIC_ALGOLIA_APP_ID=your_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=your_search_key`}
                  </pre>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Features</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500">✓</span>
                      <span>Instant search with typo-tolerance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500">✓</span>
                      <span>Advanced filtering by category, framework, and tags</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500">✓</span>
                      <span>Faceted search with result counts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500">✓</span>
                      <span>Pagination and infinite scroll support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500">✓</span>
                      <span>Highlighting of search terms</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Usage Example</h4>
                  <pre className="text-xs overflow-x-auto">
{`import { AlgoliaSearch } from '@/components/algolia-search'

export default function SearchPage() {
  return <AlgoliaSearch />
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Documentation Cards */}
        <div className="grid md:grid-cols-3 gap-6 pt-8">
          <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent">
            <CardHeader>
              <CardTitle className="text-lg">Monaco Editor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Location: <code className="bg-muted px-1 py-0.5 rounded">components/code-editor.tsx</code></p>
              <p>Features: Syntax highlighting, IntelliSense, theme support</p>
            </CardContent>
          </Card>

          <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent">
            <CardHeader>
              <CardTitle className="text-lg">AST Parser</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Location: <code className="bg-muted px-1 py-0.5 rounded">lib/ast-parser.ts</code></p>
              <p>Features: Extract props, hooks, dependencies, complexity</p>
            </CardContent>
          </Card>

          <Card className="border-pink-500/20 bg-gradient-to-br from-pink-500/5 to-transparent">
            <CardHeader>
              <CardTitle className="text-lg">Algolia Search</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Location: <code className="bg-muted px-1 py-0.5 rounded">lib/algolia-config.ts</code></p>
              <p>Features: Instant search, filters, facets, pagination</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
