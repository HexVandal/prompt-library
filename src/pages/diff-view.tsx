import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { GitCompare, ChevronLeft, ArrowRightLeft, Palette, Type, Layers, Copy, Check } from 'lucide-react'
import { PROMPTS_DATA } from '@/data/prompts'
import type { LibraryPrompt } from '@/types'
import { toast } from 'sonner'

export function DiffView() {
  const [promptAId, setPromptAId] = useState<string>(PROMPTS_DATA[0]?.id || '1')
  const [promptBId, setPromptBId] = useState<string>(PROMPTS_DATA[1]?.id || '2')
  const [copiedA, setCopiedA] = useState(false)
  const [copiedB, setCopiedB] = useState(false)

  const promptA = PROMPTS_DATA.find(p => p.id === promptAId) || PROMPTS_DATA[0]
  const promptB = PROMPTS_DATA.find(p => p.id === promptBId) || PROMPTS_DATA[1]

  const handleCopy = (content: string, setCopiedFn: (val: boolean) => void) => {
    navigator.clipboard.writeText(content)
    setCopiedFn(true)
    toast.success("Prompt text copied!")
    setTimeout(() => setCopiedFn(false), 2000)
  }

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="glass-panel rounded-3xl p-8 border border-zinc-800 space-y-3 bg-gradient-to-r from-purple-950/20 via-zinc-900/40 to-[#08090d]">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill border-purple-500/30 text-purple-300 text-xs font-semibold">
            <GitCompare className="w-3.5 h-3.5 text-purple-400" />
            Prompt Architecture & Specification Comparator
          </div>
        </div>
        <h1 className="text-3xl font-bold font-serif text-white tracking-tight">
          Compare Prompt Specifications
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl">
          Select any two prompts from the library to compare design systems, typography choices, component structures, and prompt instructions side by side.
        </p>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        
        {/* Selector A */}
        <div className="p-4 bg-zinc-900/60 rounded-2xl border border-zinc-800 space-y-2">
          <label className="text-xs font-semibold text-purple-400 uppercase tracking-wider block">
            Select Prompt A
          </label>
          <select
            value={promptAId}
            onChange={(e) => setPromptAId(e.target.value)}
            className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-100 font-medium focus:outline-none focus:border-purple-500"
          >
            {PROMPTS_DATA.map(p => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.tags[0] || 'General'})
              </option>
            ))}
          </select>
        </div>

        {/* Selector B */}
        <div className="p-4 bg-zinc-900/60 rounded-2xl border border-zinc-800 space-y-2">
          <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block">
            Select Prompt B
          </label>
          <select
            value={promptBId}
            onChange={(e) => setPromptBId(e.target.value)}
            className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-100 font-medium focus:outline-none focus:border-cyan-500"
          >
            {PROMPTS_DATA.map(p => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.tags[0] || 'General'})
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Side by Side Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Column A */}
        <div className="glass-panel p-6 rounded-2xl border border-zinc-800 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded">
                {promptA.tags[0] || 'General'}
              </span>
              <h3 className="text-lg font-bold text-white mt-1">{promptA.title}</h3>
            </div>

            <button
              onClick={() => handleCopy(promptA.content, setCopiedA)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-600/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5"
            >
              {copiedA ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedA ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* Video Preview A */}
          {promptA.videoUrl && (
            <div className="rounded-xl overflow-hidden aspect-video bg-zinc-950 border border-zinc-800">
              {promptA.videoUrl.endsWith('.mp4') || promptA.videoUrl.includes('mux') ? (
                <video src={promptA.videoUrl} controls muted className="w-full h-full object-cover" />
              ) : (
                <img src={promptA.videoUrl} alt={promptA.title} className="w-full h-full object-cover" />
              )}
            </div>
          )}

          {/* Color Palette A */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-purple-400" /> Color Swatches
            </h4>
            <div className="flex items-center gap-2 flex-wrap">
              {promptA.patterns.colors.map((c, i) => (
                <div key={i} className="flex items-center gap-1.5 px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-[11px] font-mono">
                  <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: c }} />
                  {c}
                </div>
              ))}
            </div>
          </div>

          {/* Fonts A */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-purple-400" /> Fonts
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {promptA.patterns.fonts.map((f, i) => (
                <span key={i} className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-medium text-zinc-200">
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Prompt Text A */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Prompt Specification</h4>
            <pre className="p-4 bg-[#090a0f] border border-zinc-800 rounded-xl text-xs font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
              {promptA.content}
            </pre>
          </div>
        </div>

        {/* Column B */}
        <div className="glass-panel p-6 rounded-2xl border border-zinc-800 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded">
                {promptB.tags[0] || 'General'}
              </span>
              <h3 className="text-lg font-bold text-white mt-1">{promptB.title}</h3>
            </div>

            <button
              onClick={() => handleCopy(promptB.content, setCopiedB)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5"
            >
              {copiedB ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedB ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* Video Preview B */}
          {promptB.videoUrl && (
            <div className="rounded-xl overflow-hidden aspect-video bg-zinc-950 border border-zinc-800">
              {promptB.videoUrl.endsWith('.mp4') || promptB.videoUrl.includes('mux') ? (
                <video src={promptB.videoUrl} controls muted className="w-full h-full object-cover" />
              ) : (
                <img src={promptB.videoUrl} alt={promptB.title} className="w-full h-full object-cover" />
              )}
            </div>
          )}

          {/* Color Palette B */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-cyan-400" /> Color Swatches
            </h4>
            <div className="flex items-center gap-2 flex-wrap">
              {promptB.patterns.colors.map((c, i) => (
                <div key={i} className="flex items-center gap-1.5 px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-[11px] font-mono">
                  <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: c }} />
                  {c}
                </div>
              ))}
            </div>
          </div>

          {/* Fonts B */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-cyan-400" /> Fonts
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {promptB.patterns.fonts.map((f, i) => (
                <span key={i} className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-medium text-zinc-200">
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Prompt Text B */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Prompt Specification</h4>
            <pre className="p-4 bg-[#090a0f] border border-zinc-800 rounded-xl text-xs font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
              {promptB.content}
            </pre>
          </div>
        </div>

      </div>
    </div>
  )
}