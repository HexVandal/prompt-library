import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Database, Search, Key, Palette, Bell, Shield, Trash2, Download, Upload, Wrench, Info, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Settings() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your prompt library preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="database">
            <Database className="h-4 w-4 mr-2" />
            Database
          </TabsTrigger>
          <TabsTrigger value="search">
            <Search className="h-4 w-4 mr-2" />
            Search
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="advanced">
            <Wrench className="h-4 w-4 mr-2" />
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Application Info
              </CardTitle>
              <CardDescription>Current version and environment details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label>Version</Label>
                  <Input value="1.0.0" readOnly className="bg-muted" />
                </div>
                <div className="space-y-1">
                  <Label>Environment</Label>
                  <Input value="Development" readOnly className="bg-muted" />
                </div>
                <div className="space-y-1">
                  <Label>Node Version</Label>
                  <Input value="v20.10.0" readOnly className="bg-muted" />
                </div>
                <div className="space-y-1">
                  <Label>Database</Label>
                  <Input value="PostgreSQL (Prisma)" readOnly className="bg-muted" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </CardTitle>
              <CardDescription>Configure how you receive updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive email updates about new features</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Browser push notifications for important events</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Weekly Digest</p>
                  <p className="text-sm text-muted-foreground">Summary of your prompt library activity</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Database Connection
              </CardTitle>
              <CardDescription>Configure your PostgreSQL connection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label>Database URL</Label>
                <Input
                  type="password"
                  placeholder="postgresql://user:pass@host:5432/db"
                  value="postgresql://***:***@localhost:5432/prompt_library"
                />
                <p className="text-sm text-muted-foreground">Stored in .env file. Restart required after changes.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label>Connection Pool Size</Label>
                  <Input type="number" value="10" />
                </div>
                <div className="space-y-1">
                  <Label>Query Timeout (ms)</Label>
                  <Input type="number" value="30000" />
                </div>
              </div>
              <Button>Test Connection</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Database Actions
              </CardTitle>
              <CardDescription>Maintenance operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium">Run Migrations</p>
                  <p className="text-sm text-muted-foreground">Apply pending Prisma migrations</p>
                </div>
                <Button>Run Migrations</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium">Generate Prisma Client</p>
                  <p className="text-sm text-muted-foreground">Regenerate TypeScript client from schema</p>
                </div>
                <Button>Generate Client</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium">Seed Database</p>
                  <p className="text-sm text-muted-foreground">Populate with 13 sample prompts</p>
                </div>
                <Button>Seed Data</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-destructive/50">
                <div>
                  <p className="font-medium text-destructive">Reset Database</p>
                  <p className="text-sm text-muted-foreground">Delete all data and re-run migrations</p>
                </div>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                Meilisearch Configuration
              </CardTitle>
              <CardDescription>Configure Meilisearch Cloud connection for full-text search</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label>Meilisearch Host</Label>
                <Input placeholder="https://your-instance.meilisearch.cloud" value="https://***.meilisearch.cloud" />
              </div>
              <div className="space-y-1">
                <Label>API Key</Label>
                <Input type="password" placeholder="ms_************" value="ms_***" />
              </div>
              <div className="space-y-1">
                <Label>Index Name</Label>
                <Input value="prompts" />
              </div>
              <Button>Test Connection</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Search Settings
              </CardTitle>
              <CardDescription>Fine-tune search behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label>Searchable Attributes Priority</Label>
                  <Select defaultValue="default">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default (title, description, content, tags)</SelectItem>
                      <SelectItem value="title-first">Title First</SelectItem>
                      <SelectItem value="content-first">Content First</SelectItem>
                      <SelectItem value="tags-only">Tags Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Typo Tolerance</Label>
                  <Select defaultValue="default">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default (1 typo for 5+ chars)</SelectItem>
                      <SelectItem value="strict">Strict (no typos)</SelectItem>
                      <SelectItem value="lenient">Lenient (2 typos)</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1">
                  <Label>Min Word Size for 1 Typo</Label>
                  <Input type="number" value="5" />
                </div>
                <div className="space-y-1">
                  <Label>Min Word Size for 2 Typos</Label>
                  <Input type="number" value="9" />
                </div>
                <div className="space-y-1">
                  <Label>Max Results per Query</Label>
                  <Input type="number" value="100" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Index Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium">Reindex All Prompts</p>
                  <p className="text-sm text-muted-foreground">Rebuild the Meilisearch index from database</p>
                </div>
                <Button>Reindex</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium">Clear Index</p>
                  <p className="text-sm text-muted-foreground">Remove all documents from search index</p>
                </div>
                <Button variant="destructive">Clear Index</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Theme
              </CardTitle>
              <CardDescription>Choose your preferred color scheme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <Button
                  variant="outline"
                  className="h-24 flex-col gap-2"
                >
                  <div className="w-full h-16 rounded-lg border-2 bg-white dark:bg-gray-900" />
                  <span>Light</span>
                </Button>
                <Button
                  variant="default"
                  className="h-24 flex-col gap-2"
                >
                  <div className="w-full h-16 rounded-lg border-2 bg-gray-900 dark:bg-gray-950" />
                  <span>Dark</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex-col gap-2"
                >
                  <div className="w-full h-16 rounded-lg border-2 bg-gradient-to-r from-yellow-100 to-orange-200 dark:from-gray-800 dark:to-gray-900" />
                  <span>System</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Accent Color
              </CardTitle>
              <CardDescription>Primary color used throughout the application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {['blue', 'purple', 'green', 'orange', 'red', 'pink', 'indigo', 'teal'].map((color) => (
                  <button
                    key={color}
                    className={cn(
                      'w-10 h-10 rounded-full border-2 transition-all',
                      `bg-${color}-500`,
                      color === 'blue' ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-transparent hover:ring-2 hover:ring-offset-2'
                    )}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Density
              </CardTitle>
              <CardDescription>Adjust spacing and compactness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Button variant="outline">Compact</Button>
                <Button variant="default">Comfortable</Button>
                <Button variant="outline">Spacious</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Data
              </CardTitle>
              <CardDescription>Download your prompt library data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium">Export as JSON</p>
                  <p className="text-sm text-muted-foreground">Complete backup including prompts, tags, and patterns</p>
                </div>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Export JSON
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium">Export as CSV</p>
                  <p className="text-sm text-muted-foreground">Prompts only, compatible with spreadsheet apps</p>
                </div>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium">Export Patterns Only</p>
                  <p className="text-sm text-muted-foreground">Extracted design patterns and tokens</p>
                </div>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Export Patterns
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Import Data
              </CardTitle>
              <CardDescription>Restore or migrate data from exports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium">Import from JSON</p>
                  <p className="text-sm text-muted-foreground">Restore full backup with all data</p>
                </div>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Import JSON
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium">Import from CSV</p>
                  <p className="text-sm text-muted-foreground">Import prompts from spreadsheet export</p>
                </div>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Import CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Danger Zone
              </CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-destructive/50">
                <div>
                  <p className="font-medium text-destructive">Delete All Prompts</p>
                  <p className="text-sm text-muted-foreground">Permanently remove all prompts and associated data</p>
                </div>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete All
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-destructive/50">
                <div>
                  <p className="font-medium text-destructive">Delete Account Data</p>
                  <p className="text-sm text-muted-foreground">Remove all data including settings and preferences</p>
                </div>
                <Button variant="destructive">Delete Everything</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}