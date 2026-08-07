import { useState } from 'react'
import type { LibraryPrompt } from '@/data/prompts'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Monitor, Tablet, Smartphone, Play, Pause, Menu, X, Sparkles, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PromptVisualPreviewProps {
  prompt: LibraryPrompt
}

export function PromptVisualPreview({ prompt }: PromptVisualPreviewProps) {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [copiedColor, setCopiedColor] = useState<string | null>(null)

  // Extract brand name from prompt title or content
  const brandName = (() => {
    const content = prompt.content
    const match = content.match(/(?:called|for|brand|app)\s+['"]?([A-Z][a-zA-Z0-9.\s®]+?)['"]?\s+(?:using|with|landing|platform|website|hero|section)/i)
    if (match && match[1] && match[1].trim().length < 20) {
      return match[1].trim()
    }
    if (prompt.title.includes('Mindloop')) return 'Mindloop'
    if (prompt.title.includes('Bloom')) return 'Bloom'
    if (prompt.title.includes('Neuralyn')) return 'Neuralyn'
    if (prompt.title.includes('CodeNest')) return 'CodeNest'
    if (prompt.title.includes('Orbis')) return 'Orbis.Nft'
    if (prompt.title.includes('Stellar')) return 'Stellar.ai'
    if (prompt.title.includes('Viktor')) return 'Viktor Oddy'
    if (prompt.title.includes('DesignPro')) return 'DesignPro'
    return 'Velorah®'
  })()

  // Primary colors
  const primaryColor = prompt.patterns.colors[0] || '#7b39fc'
  const isDarkTheme = prompt.tags.includes('dark-mode') || prompt.tags.includes('monochrome') || prompt.content.toLowerCase().includes('dark')

  const copyHex = (color: string) => {
    navigator.clipboard.writeText(color)
    setCopiedColor(color)
    setTimeout(() => setCopiedColor(null), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border p-3 rounded-xl shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider px-2">Viewport</span>
          <div className="flex items-center bg-muted p-1 rounded-lg">
            <Button
              variant={viewport === 'desktop' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewport('desktop')}
              className="h-8 gap-1.5 text-xs"
            >
              <Monitor className="h-3.5 w-3.5" />
              Desktop (1440px)
            </Button>
            <Button
              variant={viewport === 'tablet' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewport('tablet')}
              className="h-8 gap-1.5 text-xs"
            >
              <Tablet className="h-3.5 w-3.5" />
              Tablet (768px)
            </Button>
            <Button
              variant={viewport === 'mobile' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewport('mobile')}
              className="h-8 gap-1.5 text-xs"
            >
              <Smartphone className="h-3.5 w-3.5" />
              Mobile (375px)
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {prompt.videoUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="h-8 gap-1.5 text-xs"
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {isPlaying ? 'Pause Background' : 'Play Background'}
            </Button>
          )}

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">Colors:</span>
            {prompt.patterns.colors.slice(0, 4).map((color) => (
              <button
                key={color}
                onClick={() => copyHex(color)}
                className="w-5 h-5 rounded-full border border-white/20 transition-transform hover:scale-125 focus:outline-none relative group"
                style={{ backgroundColor: color }}
                title={`Click to copy ${color}`}
              >
                {copiedColor === color && (
                  <Check className="h-3 w-3 text-white absolute inset-0 m-auto bg-black/60 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Visual Renderer Sandbox Canvas */}
      <div className="w-full flex justify-center bg-zinc-950 p-4 sm:p-8 rounded-2xl border shadow-2xl overflow-hidden">
        <div
          className={cn(
            'transition-all duration-300 relative rounded-xl overflow-hidden shadow-2xl border border-white/10 flex flex-col min-h-[580px]',
            viewport === 'desktop' && 'w-full max-w-5xl',
            viewport === 'tablet' && 'w-[768px]',
            viewport === 'mobile' && 'w-[375px]',
            isDarkTheme ? 'bg-zinc-950 text-white' : 'bg-slate-900 text-white'
          )}
        >
          {/* Background Layer (Video or Animated Gradient) */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {prompt.videoUrl && isPlaying ? (
              <video
                src={prompt.videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-50 transition-opacity duration-700"
              />
            ) : (
              <div
                className="w-full h-full opacity-40"
                style={{
                  background: `radial-gradient(circle at 50% 30%, ${primaryColor}55 0%, rgba(10,10,20,0.95) 75%)`,
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
          </div>

          {/* Navigation Bar */}
          <header className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-white/10 backdrop-blur-md bg-white/5">
            <div className="flex items-center gap-8">
              <span className="text-xl font-bold tracking-tight font-serif flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: primaryColor }} />
                {brandName}
              </span>
              <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-300">
                <a href="#home" className="hover:text-white transition-colors font-medium">Home</a>
                <a href="#services" className="hover:text-white transition-colors">Services</a>
                <a href="#about" className="hover:text-white transition-colors">About</a>
                <a href="#contact" className="hover:text-white transition-colors">Contact</a>
              </nav>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" size="sm" className="text-xs text-zinc-300 hover:text-white">
                Sign In
              </Button>
              <Button
                size="sm"
                className="text-xs rounded-full px-5 shadow-lg transition-transform hover:scale-105"
                style={{ backgroundColor: primaryColor, color: '#ffffff' }}
              >
                Get Started
              </Button>
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-zinc-300 hover:text-white focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </header>

          {/* Mobile Overlay Menu */}
          {isMobileMenuOpen && (
            <div className="absolute inset-0 z-30 bg-zinc-950/95 backdrop-blur-xl flex flex-col p-6 space-y-6 md:hidden">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-lg font-bold font-serif">{brandName}</span>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-6 w-6 text-zinc-400" />
                </button>
              </div>
              <div className="flex flex-col space-y-4 text-lg">
                <a href="#home" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
                <a href="#services" onClick={() => setIsMobileMenuOpen(false)}>Services</a>
                <a href="#about" onClick={() => setIsMobileMenuOpen(false)}>About</a>
                <a href="#contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
              </div>
              <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
                <Button variant="outline" className="w-full">Sign In</Button>
                <Button className="w-full" style={{ backgroundColor: primaryColor }}>Get Started</Button>
              </div>
            </div>
          )}

          {/* Hero Content Section */}
          <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-16 sm:py-24 max-w-4xl mx-auto space-y-6">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 bg-white/10 backdrop-blur-md text-xs font-medium shadow-xl">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold text-white uppercase tracking-wider" style={{ backgroundColor: primaryColor }}>
                New
              </span>
              <span className="text-zinc-200">Say Hello to {brandName} v3.2</span>
              <Sparkles className="h-3 w-3 text-amber-400" />
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight font-serif max-w-3xl">
              {prompt.title}
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-base text-zinc-300/80 max-w-2xl leading-relaxed font-sans">
              {prompt.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
              <Button
                size="lg"
                className="rounded-full px-8 text-sm font-semibold shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                style={{ backgroundColor: primaryColor, color: '#ffffff' }}
              >
                Begin Journey
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 text-sm font-semibold border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/15 text-white"
              >
                Learn More
              </Button>
            </div>

            {/* Component Specs Chips */}
            <div className="pt-8 flex flex-wrap justify-center gap-2 opacity-80">
              {prompt.components.map((comp) => (
                <Badge key={comp.name} variant="outline" className="border-white/10 bg-black/40 text-[11px] text-zinc-400">
                  {comp.name} ({comp.type})
                </Badge>
              ))}
            </div>
          </main>

          {/* Footer Bar */}
          <footer className="relative z-10 px-6 py-3 border-t border-white/10 bg-black/30 backdrop-blur-sm flex justify-between items-center text-[11px] text-zinc-400">
            <span>Powered by Prompt Library Engine</span>
            <span className="flex items-center gap-1">
              Fonts: {prompt.patterns.fonts.slice(0, 2).join(', ')}
            </span>
          </footer>
        </div>
      </div>
    </div>
  )
}
