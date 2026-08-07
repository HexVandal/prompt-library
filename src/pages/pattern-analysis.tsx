import React, { useMemo } from 'react'
import { Palette, Type, Box, BarChart3, Layers } from 'lucide-react'
import { PROMPTS_DATA } from '@/data/prompts'

export function PatternAnalysis() {
  // Compute color frequencies dynamically
  const colorStats = useMemo(() => {
    const counts: Record<string, number> = {}
    PROMPTS_DATA.forEach(p => {
      p.patterns.colors.forEach(c => {
        const hex = c.toLowerCase()
        counts[hex] = (counts[hex] || 0) + 1
      })
    })
    return Object.entries(counts)
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 16)
  }, [])

  // Compute font frequencies dynamically
  const fontStats = useMemo(() => {
    const counts: Record<string, number> = {}
    PROMPTS_DATA.forEach(p => {
      p.patterns.fonts.forEach(f => {
        counts[f] = (counts[f] || 0) + 1
      })
    })
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }, [])

  // Compute component frequencies
  const componentStats = useMemo(() => {
    const counts: Record<string, number> = {}
    PROMPTS_DATA.forEach(p => {
      p.components.forEach(c => {
        const type = c.type.replace('_', ' ')
        counts[type] = (counts[type] || 0) + 1
      })
    })
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }, [])

  // Compute category distribution
  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {}
    PROMPTS_DATA.forEach(p => {
      const mainTag = p.tags[0] || 'General'
      counts[mainTag] = (counts[mainTag] || 0) + 1
    })
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }, [])

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="glass-panel rounded-3xl p-8 border border-zinc-800 space-y-3 bg-gradient-to-r from-purple-950/20 via-zinc-900/40 to-[#08090d]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill border-purple-500/30 text-purple-300 text-xs font-semibold">
          <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
          Library Analytics & Design System Intelligence
        </div>
        <h1 className="text-3xl font-bold font-serif text-white tracking-tight">
          Design Tokens & Pattern Analysis
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl">
          Aggregated analysis of color palettes, typography specs, component architectures, and layout categories across all {PROMPTS_DATA.length} prompts.
        </p>
      </div>

      {/* Grid of Token Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Color Palette Analysis */}
        <div className="glass-panel p-6 rounded-2xl border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-400" />
              Most Popular Color Palettes
            </h3>
            <span className="text-xs text-zinc-500 font-mono">{colorStats.length} Unique Swatches</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {colorStats.map((item, idx) => (
              <div key={idx} className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 flex items-center gap-3">
                <span 
                  className="w-6 h-6 rounded-lg border border-white/20 shadow-sm flex-shrink-0"
                  style={{ backgroundColor: item.value }}
                />
                <div className="truncate">
                  <div className="text-xs font-mono text-zinc-200">{item.value}</div>
                  <div className="text-[10px] text-purple-400 font-semibold">{item.count} prompts</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Font Families Analysis */}
        <div className="glass-panel p-6 rounded-2xl border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Type className="w-4 h-4 text-cyan-400" />
              Top Typography Families
            </h3>
            <span className="text-xs text-zinc-500 font-mono">{fontStats.length} Fonts</span>
          </div>

          <div className="space-y-3">
            {fontStats.slice(0, 8).map((font, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 bg-zinc-900/60 rounded-xl border border-zinc-800/80">
                <span className="text-xs font-semibold text-zinc-200">{font.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-cyan-500 h-full rounded-full"
                      style={{ width: `${Math.min(100, (font.count / PROMPTS_DATA.length) * 100 * 3)}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-cyan-300 w-12 text-right">{font.count} prompts</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Component Architecture Breakdown */}
        <div className="glass-panel p-6 rounded-2xl border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Box className="w-4 h-4 text-amber-400" />
              Component Types Breakdown
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {componentStats.slice(0, 8).map((comp, idx) => (
              <div key={idx} className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80 flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-300 capitalize">{comp.name.toLowerCase()}</span>
                <span className="text-xs font-bold px-2 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-md">
                  {comp.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="glass-panel p-6 rounded-2xl border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Prompt Categories
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {categoryStats.slice(0, 8).map((cat, idx) => (
              <div key={idx} className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80 flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-300 capitalize">{cat.name}</span>
                <span className="text-xs font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-md">
                  {cat.count}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}