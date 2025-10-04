# Integrations Documentation

This document explains how to use the three powerful integrations added to ComponentVault:

## 1. Monaco Editor (Live Code Editing)

### Overview
Monaco Editor is the code editor that powers VS Code. It provides syntax highlighting, IntelliSense, and many advanced editing features.

### Files
- `components/code-editor.tsx` - Main editor components
- Usage: Import and use the CodeEditor component

### Components

#### CodeEditor
Full-featured code editor with syntax highlighting and IntelliSense.

```tsx
import { CodeEditor } from '@/components/code-editor'

<CodeEditor
  value={code}
  onChange={(value) => setCode(value || '')}
  language="typescript"
  height="500px"
  minimap={true}
  readOnly={false}
/>
```

**Props:**
- `value` (string): The code content
- `onChange` (function): Callback when code changes
- `language` (string): Programming language (typescript, javascript, css, etc.)
- `height` (string): Editor height (default: "400px")
- `readOnly` (boolean): Make editor read-only (default: false)
- `minimap` (boolean): Show minimap (default: false)
- `showLineNumbers` (boolean): Show line numbers (default: true)

#### InlineCodeEditor
Compact editor for small code snippets.

```tsx
import { InlineCodeEditor } from '@/components/code-editor'

<InlineCodeEditor
  value="const x = 10"
  onChange={(value) => console.log(value)}
  language="javascript"
/>
```

### Features
- ✅ Syntax highlighting for all major languages
- ✅ IntelliSense (autocomplete)
- ✅ Theme support (light/dark)
- ✅ Keyboard shortcuts (Ctrl/Cmd+S for save)
- ✅ Bracket pair colorization
- ✅ Format on paste/type
- ✅ Smooth cursor animation

### Example Use Cases
- Live code preview
- Component code editor
- Code snippet editing
- Tutorial/documentation with live examples

---

## 2. AST Parser (Component Analysis)

### Overview
Uses Babel to parse JavaScript/TypeScript code and extract component information like props, hooks, dependencies, and complexity.

### Files
- `lib/ast-parser.ts` - AST parsing utilities

### Functions

#### analyzeComponent
Comprehensive component analysis.

```tsx
import { analyzeComponent } from '@/lib/ast-parser'

const analysis = analyzeComponent(code)
console.log(analysis)
// {
//   name: 'MyComponent',
//   type: 'function',
//   props: [...],
//   hooks: ['useState', 'useEffect'],
//   imports: [...],
//   dependencies: ['react', 'lucide-react'],
//   complexity: 5,
//   hasTypeScript: true
// }
```

#### extractDependencies
Extract external dependencies from code.

```tsx
import { extractDependencies } from '@/lib/ast-parser'

const deps = extractDependencies(code)
// ['react', 'lucide-react', '@/components/ui/button']
```

#### extractHooks
Extract React hooks used in component.

```tsx
import { extractHooks } from '@/lib/ast-parser'

const hooks = extractHooks(code)
// ['useState', 'useEffect', 'useRef']
```

#### generateComponentSummary
Generate human-readable summary.

```tsx
import { generateComponentSummary } from '@/lib/ast-parser'

const summary = generateComponentSummary(code)
console.log(summary)
// Component: Counter
// Type: function component
// Props: 2
// Hooks: useState, useEffect
// Dependencies: 3
// Complexity: 5
// TypeScript: Yes
```

### Analysis Output

```typescript
interface ComponentAnalysis {
  name: string
  type: 'function' | 'class' | 'arrow'
  props: PropDefinition[]
  hooks: string[]
  imports: ImportDefinition[]
  exports: ExportDefinition[]
  dependencies: string[]
  complexity: number
  hasTypeScript: boolean
}
```

### Features
- ✅ Extract component props with types
- ✅ Detect React hooks usage
- ✅ List all imports and dependencies
- ✅ Calculate code complexity
- ✅ TypeScript support
- ✅ Handle function, class, and arrow function components

### Example Use Cases
- Component documentation generation
- Dependency tracking
- Code quality metrics
- Automated prop documentation
- Component search indexing

---

## 3. Algolia Search

### Overview
Algolia provides powerful instant search with typo-tolerance, faceted filtering, and blazing-fast performance.

### Setup

#### Step 1: Get Algolia Credentials
1. Create account at [algolia.com](https://www.algolia.com)
2. Create an application
3. Get your Application ID and API Keys from the dashboard

#### Step 2: Configure Environment
Create `.env.local` file:

```env
NEXT_PUBLIC_ALGOLIA_APP_ID=your_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=your_search_key
ALGOLIA_ADMIN_API_KEY=your_admin_key
```

#### Step 3: Index Your Data
```tsx
import { indexComponents } from '@/lib/algolia-config'

// Format and index your components
const components = [
  {
    id: '1',
    name: 'Button',
    description: 'A customizable button component',
    category: 'Form',
    tags: ['button', 'form', 'input'],
    framework: 'react',
    downloads: 1000,
    likes: 50,
    author: 'John Doe',
    thumbnail: '/button.png',
    code: '...',
  },
  // ... more components
]

await indexComponents(components)
```

### Files
- `lib/algolia-config.ts` - Algolia client and helpers
- `components/algolia-search.tsx` - Search UI components

### Components

#### AlgoliaSearch
Full-featured search with filters.

```tsx
import { AlgoliaSearch } from '@/components/algolia-search'

<AlgoliaSearch />
```

Features:
- Search box with instant results
- Category filter
- Framework filter
- Tags filter with "Show more"
- Result stats
- Pagination
- Responsive grid layout

#### SimpleSearch
Minimal search for quick lookups.

```tsx
import { SimpleSearch } from '@/components/algolia-search'

<SimpleSearch />
```

### Helper Functions

#### searchComponents
Programmatic search.

```tsx
import { searchComponents } from '@/lib/algolia-config'

const results = await searchComponents('button', {
  filters: 'category:Form',
  hitsPerPage: 10,
})
```

#### formatComponentForAlgolia
Format data for indexing.

```tsx
import { formatComponentForAlgolia } from '@/lib/algolia-config'

const formatted = formatComponentForAlgolia(component)
```

### Features
- ✅ Instant search (as-you-type)
- ✅ Typo-tolerance
- ✅ Faceted filtering
- ✅ Highlighting search terms
- ✅ Result ranking
- ✅ Analytics
- ✅ Pagination
- ✅ Customizable UI

### Example Use Cases
- Component library search
- User search
- Collection search
- Multi-index search
- Search analytics

---

## Demo Page

Visit `/integrations` to see all three integrations in action:

```
http://localhost:3000/integrations
```

The demo page includes:
- Live Monaco editor with syntax highlighting
- AST parser analyzing React components
- Algolia search setup instructions

---

## Package Versions

```json
{
  "@monaco-editor/react": "4.7.0",
  "monaco-editor": "0.53.0",
  "algoliasearch": "5.39.0",
  "react-instantsearch": "7.16.3",
  "@babel/parser": "7.28.4",
  "@babel/traverse": "7.28.4",
  "@babel/types": "7.28.4"
}
```

---

## Best Practices

### Monaco Editor
1. **Lazy Loading**: Import dynamically if not needed on initial load
2. **Theme Sync**: Use `useTheme()` to match editor theme with app theme
3. **Memory**: Dispose of editor instances when unmounting
4. **Large Files**: Use virtualization for files > 1000 lines

### AST Parser
1. **Error Handling**: Wrap parsing in try-catch
2. **Performance**: Cache analysis results
3. **Validation**: Check if code is valid before parsing
4. **Security**: Don't execute parsed code

### Algolia
1. **API Keys**: Never expose Admin API key in frontend
2. **Indexing**: Index data server-side or in build process
3. **Pagination**: Use pagination for large result sets
4. **Caching**: Enable query caching
5. **Security**: Use secured API keys with restrictions

---

## Troubleshooting

### Monaco Editor not loading
- Check if `monaco-editor` is installed
- Ensure webpack config allows worker files
- Clear `.next` cache

### AST Parser errors
- Verify code syntax is valid
- Enable correct Babel plugins for your code
- Check for unsupported syntax

### Algolia not working
- Verify environment variables are set
- Check API key permissions
- Ensure index exists and has data
- Check browser console for errors

---

## Next Steps

1. **Monaco Editor**: Add custom themes, snippets, or language support
2. **AST Parser**: Extend analysis to extract more information
3. **Algolia**: Configure replica indices for different sorting
4. **Integration**: Combine all three for a code search feature

---

## Resources

- [Monaco Editor Docs](https://microsoft.github.io/monaco-editor/)
- [Babel AST Explorer](https://astexplorer.net/)
- [Algolia Docs](https://www.algolia.com/doc/)
- [React InstantSearch](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/react/)
