// AST Parser Utility for Component Analysis
import * as parser from '@babel/parser'
import traverse from '@babel/traverse'
import * as t from '@babel/types'

// Type augmentation for traverse
// @ts-ignore
const traverseDefault = traverse.default || traverse

export interface ComponentAnalysis {
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

export interface PropDefinition {
  name: string
  type?: string
  required: boolean
  defaultValue?: any
}

export interface ImportDefinition {
  source: string
  specifiers: string[]
  isDefault: boolean
}

export interface ExportDefinition {
  name: string
  isDefault: boolean
}

/**
 * Parse component code and extract analysis data
 */
export function analyzeComponent(code: string): ComponentAnalysis {
  const analysis: ComponentAnalysis = {
    name: 'Unknown',
    type: 'function',
    props: [],
    hooks: [],
    imports: [],
    exports: [],
    dependencies: [],
    complexity: 0,
    hasTypeScript: code.includes('TypeScript') || code.includes(': '),
  }

  try {
    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript', 'decorators-legacy'],
    })

    traverseDefault(ast, {
      // Extract imports
      ImportDeclaration(path: any) {
        const source = path.node.source.value
        const specifiers = path.node.specifiers.map((spec: any) => {
          if (t.isImportDefaultSpecifier(spec)) {
            return spec.local.name
          }
          if (t.isImportSpecifier(spec)) {
            const imported: any = spec.imported
            return imported.name || imported.value || ''
          }
          return ''
        }).filter(Boolean)

        analysis.imports.push({
          source,
          specifiers,
          isDefault: path.node.specifiers.some((s: any) => t.isImportDefaultSpecifier(s)),
        })

        if (!source.startsWith('.') && !source.startsWith('@/')) {
          analysis.dependencies.push(source)
        }
      },

      // Extract function components
      FunctionDeclaration(path: any) {
        if (path.node.id) {
          analysis.name = path.node.id.name
          analysis.type = 'function'
          extractProps(path, analysis)
        }
      },

      // Extract arrow function components
      VariableDeclarator(path: any) {
        if (t.isArrowFunctionExpression(path.node.init) && t.isIdentifier(path.node.id)) {
          analysis.name = path.node.id.name
          analysis.type = 'arrow'
        }
      },

      // Extract class components
      ClassDeclaration(path: any) {
        if (path.node.id) {
          analysis.name = path.node.id.name
          analysis.type = 'class'
        }
      },

      // Extract React hooks
      CallExpression(path: any) {
        if (t.isIdentifier(path.node.callee)) {
          const hookName = path.node.callee.name
          if (hookName.startsWith('use')) {
            analysis.hooks.push(hookName)
          }
        }
      },

      // Extract exports
      ExportNamedDeclaration(path: any) {
        if (path.node.declaration && t.isFunctionDeclaration(path.node.declaration)) {
          if (path.node.declaration.id) {
            analysis.exports.push({
              name: path.node.declaration.id.name,
              isDefault: false,
            })
          }
        }
      },

      ExportDefaultDeclaration(path: any) {
        if (t.isIdentifier(path.node.declaration)) {
          analysis.exports.push({
            name: path.node.declaration.name,
            isDefault: true,
          })
        }
      },
    })

    // Calculate complexity (simplified)
    analysis.complexity = calculateComplexity(ast)

    return analysis
  } catch (error) {
    console.error('Error parsing component:', error)
    return analysis
  }
}

/**
 * Extract props from function component
 */
function extractProps(path: any, analysis: ComponentAnalysis) {
  const params = path.node.params
  if (params.length > 0) {
    const propsParam = params[0]
    
    // Handle destructured props
    if (t.isObjectPattern(propsParam)) {
      propsParam.properties.forEach((prop: any) => {
        if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
          const propValue: any = prop.value
          analysis.props.push({
            name: prop.key.name,
            required: !propValue.optional,
            defaultValue: propValue.default,
          })
        }
      })
    }
  }
}

/**
 * Calculate code complexity
 */
function calculateComplexity(ast: any): number {
  let complexity = 1

  traverse(ast, {
    IfStatement() { complexity++ },
    SwitchCase() { complexity++ },
    ForStatement() { complexity++ },
    WhileStatement() { complexity++ },
    ConditionalExpression() { complexity++ },
    LogicalExpression() { complexity++ },
  })

  return complexity
}

/**
 * Extract component dependencies
 */
export function extractDependencies(code: string): string[] {
  const analysis = analyzeComponent(code)
  return Array.from(new Set(analysis.dependencies))
}

/**
 * Extract React hooks used in component
 */
export function extractHooks(code: string): string[] {
  const analysis = analyzeComponent(code)
  return Array.from(new Set(analysis.hooks))
}

/**
 * Check if component uses TypeScript
 */
export function isTypeScript(code: string): boolean {
  return code.includes('interface') || 
         code.includes('type ') || 
         code.includes(': React.') ||
         /:\s*(string|number|boolean|any|void)/.test(code)
}

/**
 * Generate component summary
 */
export function generateComponentSummary(code: string): string {
  const analysis = analyzeComponent(code)
  
  const lines = [
    `Component: ${analysis.name}`,
    `Type: ${analysis.type} component`,
    `Props: ${analysis.props.length}`,
    `Hooks: ${analysis.hooks.join(', ') || 'None'}`,
    `Dependencies: ${analysis.dependencies.length}`,
    `Complexity: ${analysis.complexity}`,
    `TypeScript: ${analysis.hasTypeScript ? 'Yes' : 'No'}`,
  ]

  return lines.join('\n')
}
