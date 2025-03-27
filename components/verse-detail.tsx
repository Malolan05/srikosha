"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import VerseDisplay from "@/components/verse-display"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import ScriptText from "@/components/script-text"
import { ChevronsUpDown } from "lucide-react"

export interface VerseDetailProps {
  verse: {
    number: number
    original: string
    transliteration: string
    translation: string
    commentaries: { [key: string]: string }
    sectionInfo?: {
      path: (number | string)[] // Array of section numbers representing the full path
      title: string
    }
  }
  hasNextVerse: boolean
  hasPrevVerse: boolean
  totalVerses: number
  onNavigate: (direction: "prev" | "next") => void
  selectedTab: string
  onTabChange: (value: string) => void
}

export function VerseDetail({ 
  verse, 
  hasNextVerse, 
  hasPrevVerse, 
  totalVerses, 
  onNavigate,
  selectedTab,
  onTabChange
}: VerseDetailProps) {
  const [selectedCommentators, setSelectedCommentators] = useState<string[]>([
    Object.keys(verse.commentaries)[0]
  ])

  const commentators = Object.keys(verse.commentaries)

  // Format the verse number based on the section path
  const getFormattedVerseNumber = () => {
    if (!verse.sectionInfo?.path) return `Verse ${verse.number}`
    return `Verse ${[...verse.sectionInfo.path, verse.number].join('.')}`
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="px-4 sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:mb-6">
          {verse.sectionInfo && (
            <div className="text-sm text-muted-foreground">
              Chapter {verse.sectionInfo.path[0]}
            </div>
          )}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <h2 className="text-xl sm:text-2xl font-bold text-primary">
              {verse.sectionInfo ? `Verse ${verse.sectionInfo.path[0]}.${verse.number}` : `Verse ${verse.number}`}
            </h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="secondary"
                onClick={() => onNavigate("prev")}
                disabled={!hasPrevVerse}
                className="flex-1 sm:flex-none"
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                onClick={() => onNavigate("next")}
                disabled={!hasNextVerse}
                className="flex-1 sm:flex-none"
              >
                Next
              </Button>
            </div>
          </div>
        </div>

        <div>
          <Tabs value={selectedTab} onValueChange={onTabChange} className="w-full">
            <TabsList className="w-full justify-start mb-4 sm:mb-6">
              <TabsTrigger value="original" className="flex-1">Original</TabsTrigger>
              <TabsTrigger value="transliteration" className="flex-1">Transliteration</TabsTrigger>
              <TabsTrigger value="translation" className="flex-1">Translation</TabsTrigger>
            </TabsList>

            <TabsContent value="original" className="text-base sm:text-lg">
              <div className="break-words whitespace-pre-wrap">
                <ScriptText text={verse.original} />
              </div>
            </TabsContent>
            <TabsContent value="transliteration" className="text-base sm:text-lg">
              <div className="break-words whitespace-pre-wrap">
                <ScriptText text={verse.transliteration} isTransliteration />
              </div>
            </TabsContent>
            <TabsContent value="translation" className="text-base sm:text-lg">
              <div className="break-words whitespace-pre-wrap">
                {verse.translation}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {commentators.length > 0 && (
          <div className="mt-6 sm:mt-8">
            <h3 className="text-xl sm:text-2xl font-bold text-primary mb-3 sm:mb-4">Commentaries</h3>
            <Select
              value={selectedCommentators.length === commentators.length ? "all" : "default"}
              onValueChange={(value) => {
                if (value === "all") {
                  setSelectedCommentators(commentators)
                  return
                }
                const commentator = value
                setSelectedCommentators((prev) => {
                  if (prev.includes(commentator)) {
                    // Don't allow deselecting if it's the last selected item
                    if (prev.length === 1) return prev
                    return prev.filter((item) => item !== commentator)
                  }
                  return [...prev, commentator]
                })
              }}
            >
              <SelectTrigger className="w-full sm:w-[250px] mb-3 sm:mb-4 bg-background text-base">
                <SelectValue>
                  {selectedCommentators.length === commentators.length
                    ? "All Commentaries"
                    : selectedCommentators.length === 0
                    ? "Select commentaries"
                    : `${selectedCommentators.length} selected`}
                </SelectValue>
              </SelectTrigger>
              <SelectContent position="item-aligned" side="bottom" align="start" className="max-h-[300px]">
                <SelectItem value="all" className="text-base">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      selectedCommentators.length === commentators.length ? "bg-primary" : "bg-muted"
                    )} />
                    All Commentaries
                  </div>
                </SelectItem>
                {commentators.map((commentator) => (
                  <SelectItem key={commentator} value={commentator} className="text-base">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        selectedCommentators.includes(commentator) ? "bg-primary" : "bg-muted"
                      )} />
                      {commentator}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="space-y-4 sm:space-y-6">
              {selectedCommentators.map((commentator) => (
                <div key={commentator} className="prose prose-zinc dark:prose-invert max-w-none">
                  <h4 className="text-lg sm:text-xl font-semi-bold text-primary">Commentary by {commentator}</h4>
                  <div className="break-words whitespace-pre-wrap">
                    <ScriptText text={verse.commentaries[commentator]} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 