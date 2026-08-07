import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Edit, Copy, Download, Tag, FileCode, GitCompare, ChevronLeft, Layout, Sparkles, Palette, Type, Box, Sun, Info, Zap, Eye, Check } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'
import { PROMPTS_DATA } from '@/data/prompts'
import { PromptVisualPreview } from '@/components/prompt-visual-preview'
import { toast } from 'sonner'

export function PromptDetail() {
  const { id } = useParams<{ id: string }>()
  const [copied, setCopied] = useState(false)
  
  const prompt = PROMPTS_DATA.find((p) => p.id === id) || PROMPTS_DATA[0]

  const handleCopyContent = () => {
    navigator.clipboard.writeText(prompt.content)
    setCopied(true)
    toast.success('Prompt copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(prompt, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `${prompt.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
    toast.success('Exported prompt as JSON')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/prompts">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <span>v{prompt.version}</span>
              <span>•</span>
              <span>Updated {formatRelativeTime(prompt.updatedAt)}</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{prompt.title}</h1>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" asChild>
            <Link to={`/prompts/${prompt.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to={`/diff/${prompt.id}`}>
              <GitCompare className="h-4 w-4 mr-2" />
              History
            </Link>
          </Button>
          <Button variant="outline" onClick={handleCopyContent}>
            {copied ? <Check className="h-4 w-4 mr-2 text-green-500" /> : <Copy className="h-4 w-4 mr-2" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button variant="outline" onClick={handleExportJson}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="visual" className="space-y-4">
            <TabsList className="bg-muted p-1">
              <TabsTrigger value="visual" className="gap-2">
                <Eye className="h-4 w-4 text-purple-500" />
                Visual Preview
              </TabsTrigger>
              <TabsTrigger value="content" className="gap-2">
                <FileCode className="h-4 w-4" />
                Prompt Text
              </TabsTrigger>
              <TabsTrigger value="components" className="gap-2">
                <Layout className="h-4 w-4" />
                Components ({prompt.components.length})
              </TabsTrigger>
              <TabsTrigger value="patterns" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Patterns & Design System
              </TabsTrigger>
            </TabsList>

            {/* Visual Sandbox Preview Tab */}
            <TabsContent value="visual" className="mt-4">
              <PromptVisualPreview prompt={prompt} />
            </TabsContent>

            {/* Prompt Raw Text Tab */}
            <TabsContent value="content">
              <Card>
                <CardContent className="pt-6">
                  <pre className="whitespace-pre-wrap font-mono text-sm bg-muted/80 p-4 rounded-lg max-h-[600px] overflow-auto border">
                    {prompt.content}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Extracted Components Tab */}
            <TabsContent value="components">
              <div className="grid gap-4 sm:grid-cols-2">
                {prompt.components.map((component) => (
                  <Card key={component.name} className="hover:border-primary/40 transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-base">{component.name}</h4>
                          <Badge variant="outline" className="mt-1">{component.type}</Badge>
                          <p className="text-sm text-muted-foreground mt-2">{component.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Design System & Patterns Tab */}
            <TabsContent value="patterns">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-4 w-4 text-primary" />
                      Colors & Theme Swatches
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {prompt.patterns.colors.map((color) => (
                        <Badge key={color} variant="outline" className="gap-2 py-1.5 px-3">
                          <div className="w-4 h-4 rounded-full border border-black/20" style={{ backgroundColor: color }} />
                          <span className="font-mono text-xs">{color}</span>
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Type className="h-4 w-4" />
                        Fonts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {prompt.patterns.fonts.map((font) => (
                          <Badge key={font} variant="secondary">{font}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Box className="h-4 w-4" />
                        Border Radius
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {prompt.patterns.borderRadius.map((radius) => (
                          <Badge key={radius} variant="outline">{radius}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Sun className="h-4 w-4" />
                        Shadow Specs
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {prompt.patterns.shadows.map((shadow) => (
                          <Badge key={shadow} variant="outline">{shadow}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Zap className="h-4 w-4" />
                        Animations & Motion
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {prompt.patterns.animations.map((anim) => (
                            <Badge key={anim} variant="secondary">{anim}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Sidebar Metadata */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Tag className="h-4 w-4" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {prompt.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1 text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Info className="h-4 w-4" />
                Prompt Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Updated</span>
                <span>{formatRelativeTime(prompt.updatedAt)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Version</span>
                <span>v{prompt.version}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Components</span>
                <span>{prompt.components.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Length</span>
                <span>{prompt.content.length.toLocaleString()} characters</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2" onClick={handleCopyContent}>
                <Copy className="h-4 w-4" />
                Copy Full Prompt
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={handleExportJson}>
                <Download className="h-4 w-4" />
                Export JSON Spec
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" asChild>
                <Link to={`/diff/${prompt.id}`}>
                  <GitCompare className="h-4 w-4" />
                  View Version History
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}