"use client"

import React, { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Markdown } from "@/components/markdown"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your content here...",
  minHeight = "150px",
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<string>("write")

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className="border rounded-md">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex items-center justify-between px-2 border-b">
          <TabsList className="h-10 bg-transparent">
            <TabsTrigger
              value="write"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-10"
            >
              Write
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-10"
            >
              Preview
            </TabsTrigger>
          </TabsList>
          
          <div className="text-xs text-muted-foreground px-2 py-1">
            Supports Markdown
          </div>
        </div>

        <TabsContent value="write" className="mt-0">
          <Textarea
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className="border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
            style={{ minHeight }}
          />
        </TabsContent>
        
        <TabsContent value="preview" className="mt-0">
          <div
            className="p-4 prose prose-sm dark:prose-invert max-w-none"
            style={{ minHeight }}
          >
            {value ? (
              <Markdown content={value} />
            ) : (
              <p className="text-muted-foreground italic">
                Nothing to preview
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 