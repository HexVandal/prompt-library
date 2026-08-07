import React, { useState } from 'react'
import { 
  X, 
  Copy, 
  Check, 
  Play, 
  Sparkles, 
  Code2, 
  Palette, 
  Layers, 
  Type, 
  Wand2,
  ExternalLink,
  Bookmark
} from 'lucide-react'
import type { LibraryPrompt } from '@/types'
import { toast } from 'sonner'

interface PromptModalProps {
  prompt: LibraryPrompt | null
  onClose: () => void
  isBookmarked: boolean
  onToggleBookmark: (id: string) => void
}

export function PromptModal({ prompt, onClose, isBookmarked, onToggleBookmark }: PromptModalProps) {
  if (!prompt) return null

  const [copied, setCopied] = useState(false)
  const [copiedColor, setCopiedColor] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'prompt' | 'tokens' | 'components'>('prompt')

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt.content)
    setCopied(true)
    toast.success("Full prompt copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyTool = (toolName: string) => {
    const formatted = `/* Prompt tailored for ${toolName} */\n${prompt.content}`
    navigator.clipboard.writeText(formatted)
    toast.success(`Copied tailored prompt for ${toolName}!`)
  }

  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color)
    setCopiedColor(color)
    toast.success(`Color hex ${color} copied!`)
    setTimeout(() => setCopiedColor(null), 2000)
  }

  const isVideo = prompt.videoUrl?.endsWith('.mp4') || prompt.videoUrl?.includes('mux') || prompt.videoUrl?.includes('cloudfront')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div 
        className="w-full max-w-4xl max-h-[90vh] bg-[#0d0f17] border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
                {prompt.title}
              </h2>
              <p className="text-xs text-zinc-400">
                {prompt.tags.join(' • ')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleBookmark(prompt.id)}
              className={`p-2 rounded-xl border transition-colors ${
                isBookmarked 
                  ? 'bg-purple-600/20 text-purple-300 border-purple-500/40' 
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
              title="Bookmark prompt"
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="px-6 border-b border-zinc-800/80 bg-zinc-950/60 flex items-center gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('prompt')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'prompt' 
                ? 'border-purple-500 text-purple-300 font-semibold' 
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Full Prompt Text
          </button>
          <button
            onClick={() => setActiveTab('tokens')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'tokens' 
                ? 'border-purple-500 text-purple-300 font-semibold' 
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            Design Tokens & Colors
          </button>
          <button
            onClick={() => setActiveTab('components')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'components' 
                ? 'border-purple-500 text-purple-300 font-semibold' 
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Components ({prompt.components.length})
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Video or Image Preview */}
          {prompt.videoUrl && (
            <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 max-h-64 relative group">
              {isVideo ? (
                <video
                  src={prompt.videoUrl}
                  controls
                  autoPlay
                  loop
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={prompt.videoUrl}
                  alt={prompt.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          )}

          {activeTab === 'prompt' && (
            <div className="space-y-4">
              
              {/* Quick AI Tool Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
                <span className="text-xs text-zinc-400 mr-2 font-medium">Quick Copy for:</span>
                {['Claude Code', 'Cursor', 'Lovable', 'Bolt.new', 'Windsurf'].map((tool) => (
                  <button
                    key={tool}
                    onClick={() => handleCopyTool(tool)}
                    className="px-2.5 py-1 bg-zinc-800/80 hover:bg-purple-600/20 text-zinc-300 hover:text-purple-200 border border-zinc-700/60 hover:border-purple-500/40 rounded-lg text-xs font-medium transition-all"
                  >
                    + {tool}
                  </button>
                ))}
              </div>

              {/* Prompt Text Code Box */}
              <div className="relative rounded-xl border border-zinc-800 bg-[#090a0f] p-4 text-xs font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                {prompt.content}
              </div>
            </div>
          )}

          {activeTab === 'tokens' && (
            <div className="space-y-6">
              
              {/* Color Palette */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-purple-400" />
                  Color Palette Swatches
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {prompt.patterns.colors.map((hex, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleCopyColor(hex)}
                      className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl flex items-center gap-3 hover:border-purple-500/40 transition-all text-left"
                    >
                      <span 
                        className="w-7 h-7 rounded-lg border border-white/20 shadow-sm flex-shrink-0"
                        style={{ backgroundColor: hex }}
                      />
                      <div className="truncate">
                        <div className="text-xs font-mono text-zinc-200 font-medium">{hex}</div>
                        <div className="text-[10px] text-zinc-500">
                          {copiedColor === hex ? 'Copied!' : 'Click to copy'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Fonts Used */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
                  <Type className="w-4 h-4 text-cyan-400" />
                  Font Families
                </h4>
                <div className="flex flex-wrap gap-2">
                  {prompt.patterns.fonts.map((font, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-xl font-medium"
                    >
                      {font}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'components' && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                Extracted Component Specifications
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {prompt.components.map((comp, idx) => (
                  <div key={idx} className="p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-300">{comp.name}</span>
                      <span className="text-[10px] uppercase font-semibold text-zinc-500 px-2 py-0.5 bg-zinc-800 rounded">
                        {comp.type}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">{comp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between">
          <span className="text-xs text-zinc-500">
            ID: <code className="text-zinc-400">{prompt.id}</code>
          </span>

          <button
            onClick={handleCopyPrompt}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-lg ${
              copied 
                ? 'bg-emerald-600/80 text-white' 
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-500/20'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied Full Prompt!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Full Prompt Text
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  )
}
