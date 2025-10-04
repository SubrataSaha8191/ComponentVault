"use client"

import { useState } from 'react'
import { InstantSearch, SearchBox, Hits, RefinementList, Stats, Pagination, Configure } from 'react-instantsearch'
import { searchClient, ALGOLIA_INDEX_COMPONENTS } from '@/lib/algolia-config'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Download, Heart } from 'lucide-react'
import Link from 'next/link'

interface ComponentHitProps {
  hit: any
}

/**
 * Component search result item
 */
function ComponentHit({ hit }: ComponentHitProps) {
  return (
    <Link href={`/component/${hit.objectID}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <CardContent className="p-0">
          {/* Thumbnail */}
          {hit.thumbnail && (
            <div className="relative overflow-hidden rounded-t-lg aspect-video bg-gradient-to-br from-amber-500/10 to-purple-500/10">
              <img
                src={hit.thumbnail}
                alt={hit.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Title */}
            <h3 className="font-semibold text-lg group-hover:text-amber-500 transition-colors line-clamp-1">
              {hit.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2">
              {hit.description}
            </p>

            {/* Tags */}
            {hit.tags && hit.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {hit.tags.slice(0, 3).map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
              <div className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                <span>{hit.views || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="h-3.5 w-3.5" />
                <span>{hit.downloads || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-3.5 w-3.5" />
                <span>{hit.likes || 0}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

/**
 * Main Algolia search component with filters
 */
export function AlgoliaSearch() {
  const [showFilters, setShowFilters] = useState(true)

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={ALGOLIA_INDEX_COMPONENTS}
      future={{ preserveSharedStateOnUnmount: true }}
    >
      <Configure hitsPerPage={12} />

      <div className="space-y-6">
        {/* Search Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 max-w-2xl">
            <SearchBox
              placeholder="Search components..."
              classNames={{
                root: 'w-full',
                form: 'relative',
                input: 'w-full px-4 py-3 pl-10 pr-4 text-sm border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500',
                submit: 'absolute left-3 top-1/2 -translate-y-1/2',
                reset: 'absolute right-3 top-1/2 -translate-y-1/2',
                submitIcon: 'h-4 w-4 text-muted-foreground',
                resetIcon: 'h-4 w-4 text-muted-foreground',
              }}
            />
          </div>

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="shrink-0"
          >
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
        </div>

        {/* Stats */}
        <div className="text-sm text-muted-foreground">
          <Stats
            classNames={{
              root: 'text-muted-foreground',
            }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <aside className="lg:col-span-1 space-y-6">
              {/* Category Filter */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Category</h3>
                <RefinementList
                  attribute="category"
                  classNames={{
                    root: 'space-y-2',
                    list: 'space-y-2',
                    item: 'flex items-center gap-2',
                    label: 'flex items-center gap-2 cursor-pointer text-sm',
                    checkbox: 'h-4 w-4 rounded border-input',
                    count: 'ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full',
                  }}
                />
              </div>

              {/* Framework Filter */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Framework</h3>
                <RefinementList
                  attribute="framework"
                  classNames={{
                    root: 'space-y-2',
                    list: 'space-y-2',
                    item: 'flex items-center gap-2',
                    label: 'flex items-center gap-2 cursor-pointer text-sm',
                    checkbox: 'h-4 w-4 rounded border-input',
                    count: 'ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full',
                  }}
                />
              </div>

              {/* Tags Filter */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Tags</h3>
                <RefinementList
                  attribute="tags"
                  limit={10}
                  showMore
                  classNames={{
                    root: 'space-y-2',
                    list: 'space-y-2',
                    item: 'flex items-center gap-2',
                    label: 'flex items-center gap-2 cursor-pointer text-sm',
                    checkbox: 'h-4 w-4 rounded border-input',
                    count: 'ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full',
                    showMore: 'text-sm text-amber-500 hover:text-amber-600 mt-2',
                  }}
                />
              </div>
            </aside>
          )}

          {/* Results */}
          <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
            <Hits
              hitComponent={ComponentHit}
              classNames={{
                root: 'space-y-6',
                list: 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6',
                item: '',
              }}
            />

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <Pagination
                classNames={{
                  root: 'flex gap-2',
                  list: 'flex gap-2',
                  item: '',
                  link: 'px-3 py-2 rounded-lg border border-input hover:bg-accent transition-colors',
                  selectedItem: 'bg-amber-500 text-white border-amber-500',
                  disabledItem: 'opacity-50 cursor-not-allowed',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </InstantSearch>
  )
}

/**
 * Simple inline search component
 */
export function SimpleSearch() {
  return (
    <InstantSearch searchClient={searchClient} indexName={ALGOLIA_INDEX_COMPONENTS}>
      <Configure hitsPerPage={5} />
      
      <div className="space-y-4">
        <SearchBox
          placeholder="Quick search..."
          classNames={{
            input: 'w-full px-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500',
          }}
        />
        
        <Hits
          hitComponent={({ hit }: any) => (
            <Link href={`/component/${hit.objectID}`}>
              <div className="p-3 hover:bg-accent rounded-lg transition-colors cursor-pointer">
                <h4 className="font-medium">{hit.name}</h4>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {hit.description}
                </p>
              </div>
            </Link>
          )}
          classNames={{
            list: 'space-y-2',
          }}
        />
      </div>
    </InstantSearch>
  )
}
