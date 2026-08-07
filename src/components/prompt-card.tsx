import React, { useState, useRef } from 'react'
import { 
  Copy, 
  Check, 
  Eye, 
  Bookmark, 
  Play, 
  Sparkles 
} from 'lucide-react'
import type { LibraryPrompt } from '@/types'
import { toast } from 'sonner'

interface PromptCardProps {
  prompt: LibraryPrompt
  onInspect: (prompt: LibraryPrompt) => void
  isBookmarked: boolean
  onToggleBookmark: (id: string) => void
}

export function PromptCard({ prompt, onInspect, isBookmarked, onToggleBookmark }: PromptCardProps) {
  const [copied, setCopied] = useState(false)
  const [isPlayingVideo, setIsPlayingVideo] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const categoryTag = prompt?.tags?.[0] || 'general'
  const isVideo = Boolean(
    prompt?.videoUrl && 
    (prompt.videoUrl.endsWith('.mp4') || prompt.videoUrl.includes('mux') || prompt.videoUrl.includes('cloudfront'))
  )

  const handleCopyPrompt = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!prompt?.content) return
    navigator.clipboard.writeText(prompt.content)
    setCopied(true)
    toast.success(`Copied "${prompt.title || 'Prompt'}" to clipboard!`)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
      setIsPlayingVideo(true)
    }
  }

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      setIsPlayingVideo(false)
    }
  }

  const colors = prompt?.patterns?.colors || []
  const fonts = prompt?.patterns?.fonts || []

  return (
    <div 
      className="glass-card rounded-2xl overflow-hidden flex flex-col group cursor-pointer border border-zinc-800/80 hover:border-purple-500/40 relative"
      onClick={() => onInspect(prompt)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Media / Video Preview Header */}
      <div className="relative aspect-video w-full bg-zinc-950 overflow-hidden border-b border-zinc-800/60">
        {prompt?.videoUrl ? (
          isVideo ? (
            <video
              ref={videoRef}
              src={prompt.videoUrl}
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <img
              src={prompt.videoUrl}
              alt={prompt.title || 'Prompt Preview'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-950/30 via-zinc-900 to-zinc-950">
            <Sparkles className="w-10 h-10 text-purple-500/30 group-hover:scale-110 transition-transform" />
          </div>
        )}

        {/* Top Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase bg-black/60 backdrop-blur-md text-purple-300 border border-purple-500/30 rounded-lg shadow-sm">
            {categoryTag}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation()
              if (prompt?.id) onToggleBookmark(prompt.id)
            }}
            className={`p-1.5 rounded-lg backdrop-blur-md border pointer-events-auto transition-all ${
              isBookmarked 
                ? 'bg-purple-600/80 text-white border-purple-400' 
                : 'bg-black/60 text-zinc-400 border-white/10 hover:text-white hover:bg-black/80'
            }`}
            title={isBookmarked ? "Remove bookmark" : "Save bookmark"}
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>

        {/* Video Playing Indicator */}
        {isVideo && (
          <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] text-zinc-300 flex items-center gap-1.5 pointer-events-none">
            {isPlayingVideo ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Playing
              </>
            ) : (
              <>
                <Play className="w-2.5 h-2.5 text-zinc-400" />
                Hover to Preview
              </>
            )}
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-semibold text-base text-zinc-100 group-hover:text-purple-300 transition-colors line-clamp-1 mb-2">
            {prompt?.title || 'Untitled Prompt'}
          </h3>

          <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
            {prompt?.description || (prompt?.content ? prompt.content.slice(0, 120) + '...' : '')}
          </p>
        </div>

        {/* Extracted Tokens (Fonts & Palette) */}
        <div className="space-y-3 pt-2 border-t border-zinc-800/60">
          
          {/* Colors & Fonts Row */}
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            {/* Color Swatches */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-zinc-500 mr-1">Colors:</span>
              {colors.slice(0, 5).map((color, idx) => (
                <span
                  key={idx}
                  className="w-3.5 h-3.5 rounded-full border border-white/20 inline-block shadow-sm"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>

            {/* Fonts */}
            {fonts.length > 0 && (
              <span className="px-2 py-0.5 bg-zinc-900 text-zinc-300 border border-zinc-800 rounded text-[10px] font-mono">
                {fonts[0]}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleCopyPrompt}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                copied 
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40' 
                  : 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 border border-purple-500/30'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-purple-400" />
                  Copy Prompt
                </>
              )}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                onInspect(prompt)
              }}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
              title="Inspect Full Details"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
