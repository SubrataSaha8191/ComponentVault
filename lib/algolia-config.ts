// Algolia Search Configuration
import { algoliasearch } from 'algoliasearch'

// Initialize Algolia client
// Replace with your actual Algolia credentials
export const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || 'YOUR_APP_ID',
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY || 'YOUR_SEARCH_KEY'
)

// Index names
export const ALGOLIA_INDEX_COMPONENTS = 'components'
export const ALGOLIA_INDEX_COLLECTIONS = 'collections'
export const ALGOLIA_INDEX_USERS = 'users'

// Search configuration
export const searchConfig = {
  hitsPerPage: 12,
  attributesToRetrieve: [
    'name',
    'description',
    'category',
    'tags',
    'framework',
    'downloads',
    'likes',
    'author',
    'thumbnail',
    'objectID'
  ],
  attributesToHighlight: ['name', 'description', 'tags'],
  facets: ['category', 'framework', 'tags'],
}

// Helper function to format component data for Algolia
export function formatComponentForAlgolia(component: any) {
  return {
    objectID: component.id,
    name: component.name,
    description: component.description,
    category: component.category,
    tags: component.tags || [],
    framework: component.framework || 'react',
    downloads: component.downloads || 0,
    likes: component.likes || 0,
    author: component.author,
    thumbnail: component.thumbnail,
    code: component.code,
    createdAt: component.createdAt,
    updatedAt: component.updatedAt,
  }
}

// Helper function to index components in Algolia
export async function indexComponents(components: any[]) {
  const formattedComponents = components.map(formatComponentForAlgolia)
  
  try {
    const responses = await searchClient.saveObjects({
      indexName: ALGOLIA_INDEX_COMPONENTS,
      objects: formattedComponents,
    })
    console.log('Successfully indexed components:', responses)
    return { success: true, responses }
  } catch (error) {
    console.error('Error indexing components:', error)
    return { success: false, error }
  }
}

// Helper function to search components
export async function searchComponents(query: string, filters?: any) {
  try {
    const results = await searchClient.search({
      requests: [
        {
          indexName: ALGOLIA_INDEX_COMPONENTS,
          query,
          ...searchConfig,
          ...filters,
        },
      ],
    })
    return results.results[0]
  } catch (error) {
    console.error('Error searching components:', error)
    return null
  }
}
