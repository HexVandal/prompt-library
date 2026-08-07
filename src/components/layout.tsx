import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import {
  Sparkles,
  Layers,
  BarChart3,
  Download,
  ExternalLink,
  FolderDown,
  Search,
  Bookmark
} from 'lucide-react'

export function Layout() {
  const location = useLocation()
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  const handleExportJSON = async () => {
    const { PROMPTS_DATA } = await import('@/data/prompts')
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(PROMPTS_DATA, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute("href", dataStr)
    downloadAnchor.setAttribute("download", "motion_prompt_library_132.json")
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
    setDownloadSuccess(true)
    setTimeout(() => setDownloadSuccess(false), 3000)
  }

  const handleExportTxt = async () => {
    const { PROMPTS_DATA } = await import('@/data/prompts')
    const txtContent = PROMPTS_DATA.map(p => `# ${p.title}\nCategory: ${p.tags[0] || 'General'}\n\n${p.content}`).join("\n\n---\n\n")
    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(txtContent)
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute("href", dataStr)
    downloadAnchor.setAttribute("download", "all_prompts.txt")
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  return (
    <div className="min-h-screen bg-[#08090d] text-zinc-100 flex flex-col selection:bg-purple-500/30 font-sans">
      
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/3 w-[600px] h-[400px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-1/2 right-1/4 w-[500px] h-[350px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Top Header Navbar */}
      <header className="sticky top-0 z-40 glass-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow">
              <div className="w-full h-full bg-[#0d0f17] rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-4.5 h-4.5 text-purple-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white font-display">
                  Motion<span className="text-purple-400">Prompt</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-full">
                  132 Free Prompts
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 font-medium">3D & Animated AI Website Prompts</span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="flex items-center gap-1 bg-zinc-900/80 p-1.5 rounded-xl border border-zinc-800/80">
            <Link
              to="/"
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                location.pathname === '/' || location.pathname === '/prompts'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Prompt Library
            </Link>

            <Link
              to="/patterns"
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                location.pathname === '/patterns'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Design System Tokens
            </Link>
          </nav>

          {/* Export Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-300 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-colors shadow-sm"
              title="Export all 132 prompts to JSON"
            >
              <Download className="w-3.5 h-3.5 text-purple-400" />
              {downloadSuccess ? 'Exported!' : 'Export JSON'}
            </button>

            <button
              onClick={handleExportTxt}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-300 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-colors shadow-sm"
              title="Export all prompts to text file"
            >
              <FolderDown className="w-3.5 h-3.5 text-cyan-400" />
              Export .txt
            </button>

            <a
              href="https://motionsites.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-purple-200 bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600/30 rounded-xl transition-all shadow-sm"
            >
              MotionSites AI
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          </div>
        </div>
      </header>

      {/* Main App Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-[#050609] py-8 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-zinc-300 font-semibold">MotionPrompt Library</span>
            <span className="text-zinc-500">• 132 Curated AI Prompts</span>
          </div>
          <div className="text-zinc-400 font-medium">
            Compatible with Claude Code, Cursor, Lovable, Bolt.new, and Windsurf
          </div>
        </div>
      </footer>
    </div>
  )
}