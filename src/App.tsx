import React, { Component, Suspense, lazy, type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Layout } from '@/components/layout'
import '@/index.css'

const PromptList = lazy(() => import('@/pages/prompt-list').then(m => ({ default: m.PromptList })))
const PromptDetail = lazy(() => import('@/pages/prompt-detail').then(m => ({ default: m.PromptDetail })))
const PatternAnalysis = lazy(() => import('@/pages/pattern-analysis').then(m => ({ default: m.PatternAnalysis })))
const DiffView = lazy(() => import('@/pages/diff-view').then(m => ({ default: m.DiffView })))
const Settings = lazy(() => import('@/pages/settings').then(m => ({ default: m.Settings })))

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#08090d] text-white p-8 flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-red-950/60 border border-red-500/40 rounded-2xl max-w-xl w-full">
            <h2 className="text-lg font-bold text-red-400 mb-2">Application Error Detected</h2>
            <pre className="text-xs font-mono bg-black/60 p-3 rounded-xl overflow-x-auto text-red-200">
              {this.state.error?.toString()}
              {'\n'}
              {this.state.error?.stack}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

function PageFallback() {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="h-6 w-6 rounded-full border-2 border-purple-500/30 border-t-purple-400 animate-spin" />
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<PromptList />} />
                <Route path="prompts" element={<PromptList />} />
                <Route path="prompts/:id" element={<PromptDetail />} />
                <Route path="patterns" element={<PatternAnalysis />} />
                <Route path="diff/:id" element={<DiffView />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </Suspense>
          <Toaster position="bottom-right" theme="dark" />
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App