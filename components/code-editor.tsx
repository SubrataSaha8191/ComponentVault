"use client"

import { useRef, useEffect } from 'react'
import Editor, { Monaco } from '@monaco-editor/react'
import { useTheme } from 'next-themes'

interface CodeEditorProps {
  value: string
  onChange?: (value: string | undefined) => void
  language?: string
  height?: string
  readOnly?: boolean
  minimap?: boolean
  showLineNumbers?: boolean
  onMount?: (editor: any, monaco: Monaco) => void
}

/**
 * Monaco Editor Component for live code editing
 * Supports syntax highlighting, IntelliSense, and theme switching
 */
export function CodeEditor({
  value,
  onChange,
  language = 'typescript',
  height = '400px',
  readOnly = false,
  minimap = false,
  showLineNumbers = true,
  onMount,
}: CodeEditorProps) {
  const { theme } = useTheme()
  const editorRef = useRef<any>(null)

  const handleEditorMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor

    // Configure Monaco editor
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.React,
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
    })

    // Add React type definitions
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `
      declare module 'react' {
        export function useState<T>(initialState: T): [T, (value: T) => void];
        export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
        export function useRef<T>(initialValue: T): { current: T };
        // Add more React types as needed
      }
      `,
      'react.d.ts'
    )

    // Custom editor commands
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Save action
      console.log('Save triggered')
    })

    if (onMount) {
      onMount(editor, monaco)
    }
  }

  const editorOptions = {
    readOnly,
    minimap: { enabled: minimap },
    lineNumbers: (showLineNumbers ? 'on' : 'off') as 'on' | 'off',
    fontSize: 14,
    tabSize: 2,
    wordWrap: 'on' as const,
    automaticLayout: true,
    scrollBeyondLastLine: false,
    smoothScrolling: true,
    cursorBlinking: 'smooth' as const,
    cursorSmoothCaretAnimation: 'on' as const,
    formatOnPaste: true,
    formatOnType: true,
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnCommitCharacter: true,
    quickSuggestions: true,
    padding: { top: 16, bottom: 16 },
    bracketPairColorization: {
      enabled: true,
    },
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-background">
      <Editor
        height={height}
        language={language}
        value={value}
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        onChange={onChange}
        onMount={handleEditorMount}
        options={editorOptions}
        loading={
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          </div>
        }
      />
    </div>
  )
}

/**
 * Code Diff Editor for comparing code versions
 */
interface CodeDiffEditorProps {
  original: string
  modified: string
  language?: string
  height?: string
}

export function CodeDiffEditor({
  original,
  modified,
  language = 'typescript',
  height = '400px',
}: CodeDiffEditorProps) {
  const { theme } = useTheme()
  const diffEditorRef = useRef<any>(null)

  const handleDiffMount = (editor: any, monaco: Monaco) => {
    diffEditorRef.current = editor
    
    const originalModel = monaco.editor.createModel(original, language)
    const modifiedModel = monaco.editor.createModel(modified, language)
    
    editor.setModel({
      original: originalModel,
      modified: modifiedModel,
    })
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-background">
      <Editor
        height={height}
        language={language}
        value={modified}
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        onMount={handleDiffMount}
        options={{
          readOnly: true,
          minimap: { enabled: false },
          fontSize: 14,
        }}
      />
    </div>
  )
}

/**
 * Inline Code Editor for small code snippets
 */
interface InlineCodeEditorProps {
  value: string
  onChange?: (value: string | undefined) => void
  language?: string
  placeholder?: string
}

export function InlineCodeEditor({
  value,
  onChange,
  language = 'typescript',
  placeholder = 'Enter code...',
}: InlineCodeEditorProps) {
  const { theme } = useTheme()

  return (
    <div className="border rounded-md overflow-hidden bg-background">
      <Editor
        height="120px"
        language={language}
        value={value}
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          lineNumbers: 'off',
          fontSize: 13,
          scrollbar: {
            vertical: 'hidden',
            horizontal: 'auto',
          },
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          padding: { top: 8, bottom: 8 },
        }}
      />
    </div>
  )
}
