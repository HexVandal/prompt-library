import React, { useState, useMemo } from 'react'
import { 
  Search, 
  Sparkles, 
  Grid3X3, 
  Grid2X2, 
  Bookmark, 
  RotateCcw,
  Wand2,
  SlidersHorizontal,
  Flame
} from 'lucide-react'
import { PROMPTS_DATA } from '@/data/prompts'
import type { LibraryPrompt } from '@/types'
import { PromptCard } from '@/components/prompt-card'
import { PromptModal } from '@/components/prompt-modal'

export function PromptList() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false)
  const [viewMode, setViewMode] = useState<'grid3' | 'grid2'>('grid3')
  const [selectedPrompt, setSelectedPrompt] = useState<LibraryPrompt | null>(null)
  
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('prompt_bookmarks')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Categories
  const categories = [
    'All',
    'Hero Section',
    'SaaS',
    '3D Website',
    'Mobile',
    'Footer Section',
    'Pricing',
    'Waitlist',
    'Features',
    'CTA',
    'About',
    '404'
  ]

  const handleToggleBookmark = (id: string) => {
    setBookmarks(prev => {
      const updated = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
      localStorage.setItem('prompt_bookmarks', JSON.stringify(updated))
      return updated
    })
  }

  // Filter Logic
  const filteredPrompts = useMemo(() => {
    return PROMPTS_DATA.filter(prompt => {
      // Category match
      if (selectedCategory !== 'All') {
        const catLower = selectedCategory.toLowerCase()
        const hasCat = (prompt?.tags || []).some(t => t.toLowerCase().includes(catLower)) ||
                       (prompt?.title || '').toLowerCase().includes(catLower)
        if (!hasCat) return false
      }

      // Bookmarked match
      if (showBookmarksOnly && !bookmarks.includes(prompt.id)) {
        return false
      }

      // Search query match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchesTitle = (prompt?.title || '').toLowerCase().includes(query)
        const matchesDesc = (prompt?.description || '').toLowerCase().includes(query)
        const matchesContent = (prompt?.content || '').toLowerCase().includes(query)
        const matchesTags = (prompt?.tags || []).some(t => t.toLowerCase().includes(query))
        return matchesTitle || matchesDesc || matchesContent || matchesTags
      }

      return true
    })
  }, [searchQuery, selectedCategory, showBookmarksOnly, bookmarks])

  return (
    <div className="space-y-8 pb-16">
      
      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden glass-panel p-8 sm:p-12 border border-zinc-800/80 bg-gradient-to-b from-purple-950/20 via-zinc-900/50 to-[#08090d]">
        <div className="relative z-10 max-w-3xl space-y-4">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill border-purple-500/30 text-purple-300 text-xs font-semibold">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Official Collection of 132 AI Website & App Prompts
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif text-white tracking-tight leading-[1.08]">
            MotionPrompt <span className="italic font-serif gradient-text-purple">AI Design Library</span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
            Beautiful Website Prompts for <strong className="text-white">Lovable, Bolt, Cursor, and Claude Code</strong>. Build stunning 3D & animated websites with AI. Just copy, paste, and launch.
          </p>

          {/* Search Bar */}
          <div className="pt-3">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search 132 prompts by keyword, font, color, or style (e.g. '3D', 'Inter', 'Glassmorphism', '#7b39fc')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-20 py-3.5 bg-zinc-950/90 border border-zinc-800 focus:border-purple-500/60 rounded-2xl text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all shadow-inner"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white px-2.5 py-1 bg-zinc-800 rounded-lg"
                >
                  Clear
                </button>
              ) : (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-mono text-zinc-500 pointer-events-none hidden sm:inline-block">
                  132 Prompts
                </span>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20 border border-purple-400/30'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 border border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* View Controls & Filter Toggles */}
        <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
          <button
            onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
              showBookmarksOnly
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-zinc-200'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${showBookmarksOnly ? 'fill-current' : ''}`} />
            Starred ({bookmarks.length})
          </button>

          <div className="flex items-center bg-zinc-900/80 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setViewMode('grid3')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid3' ? 'bg-zinc-800 text-purple-300' : 'text-zinc-500 hover:text-zinc-300'}`}
              title="3 Columns Grid"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid2')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid2' ? 'bg-zinc-800 text-purple-300' : 'text-zinc-500 hover:text-zinc-300'}`}
              title="2 Columns Grid"
            >
              <Grid2X2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Info Bar */}
      <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-800/60">
        <div>
          Showing <strong className="text-white">{filteredPrompts.length}</strong> of {PROMPTS_DATA.length} free prompts
          {selectedCategory !== 'All' && <span className="ml-1 text-purple-400">• Filter: {selectedCategory}</span>}
          {searchQuery && <span className="ml-1 text-cyan-400">• Query: "{searchQuery}"</span>}
        </div>

        {(searchQuery || selectedCategory !== 'All' || showBookmarksOnly) && (
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('All')
              setShowBookmarksOnly(false)
            }}
            className="flex items-center gap-1 text-purple-400 hover:text-purple-300 text-xs font-semibold"
          >
            <RotateCcw className="w-3 h-3" />
            Reset All Filters
          </button>
        )}
      </div>

      {/* Prompts Cards Gallery Grid */}
      {filteredPrompts.length > 0 ? (
        <div className={`grid gap-6 ${
          viewMode === 'grid3' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1 md:grid-cols-2'
        }`}>
          {filteredPrompts.map(prompt => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onInspect={(p) => setSelectedPrompt(p)}
              isBookmarked={bookmarks.includes(prompt.id)}
              onToggleBookmark={handleToggleBookmark}
            />
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-2xl p-12 text-center space-y-3 border border-zinc-800">
          <Sparkles className="w-8 h-8 text-zinc-600 mx-auto" />
          <h3 className="text-base font-semibold text-zinc-300">No prompts match your filter</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Try clearing search keywords or choosing another category.
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('All')
              setShowBookmarksOnly(false)
            }}
            className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-semibold transition-all"
          >
            Show All 132 Prompts
          </button>
        </div>
      )}

      {/* Inspector Modal */}
      <PromptModal
        prompt={selectedPrompt}
        onClose={() => setSelectedPrompt(null)}
        isBookmarked={selectedPrompt ? bookmarks.includes(selectedPrompt.id) : false}
        onToggleBookmark={handleToggleBookmark}
      />
    </div>
  )
}