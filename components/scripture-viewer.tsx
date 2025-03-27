"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Scripture, ScriptureContent } from "@/lib/types"
import VerseDisplay from "@/components/verse-display"

interface ScriptureViewerProps {
  scripture: Scripture
  content: ScriptureContent
}

export default function ScriptureViewer({ scripture, content }: ScriptureViewerProps) {
  const searchParams = useSearchParams()
  const verseParam = searchParams.get("verse")

  const [currentVerseIndex, setCurrentVerseIndex] = useState(0)
  const [selectedCommentary, setSelectedCommentary] = useState(content.verses[0].commentaries[0]?.id || "")

  // Handle direct navigation to a specific verse
  useEffect(() => {
    if (verseParam) {
      const verseNumber = Number.parseInt(verseParam, 10)
      const index = content.verses.findIndex((v) => v.number === verseNumber)
      if (index !== -1) {
        setCurrentVerseIndex(index)
        // Update selected commentary if the current one doesn't exist in the new verse
        const newVerse = content.verses[index]
        if (!newVerse.commentaries.some((c) => c.id === selectedCommentary)) {
          setSelectedCommentary(newVerse.commentaries[0]?.id || "")
        }
      }
    }
  }, [verseParam, content.verses, selectedCommentary])

  const currentVerse = content.verses[currentVerseIndex]
  const totalVerses = content.verses.length

  const handlePreviousVerse = () => {
    if (currentVerseIndex > 0) {
      setCurrentVerseIndex(currentVerseIndex - 1)
      // Update selected commentary if the current one doesn't exist in the new verse
      const newVerse = content.verses[currentVerseIndex - 1]
      if (!newVerse.commentaries.some((c) => c.id === selectedCommentary)) {
        setSelectedCommentary(newVerse.commentaries[0]?.id || "")
      }
    }
  }

  const handleNextVerse = () => {
    if (currentVerseIndex < totalVerses - 1) {
      setCurrentVerseIndex(currentVerseIndex + 1)
      // Update selected commentary if the current one doesn't exist in the new verse
      const newVerse = content.verses[currentVerseIndex + 1]
      if (!newVerse.commentaries.some((c) => c.id === selectedCommentary)) {
        setSelectedCommentary(newVerse.commentaries[0]?.id || "")
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handlePreviousVerse}
              disabled={currentVerseIndex === 0}
              className="px-4 py-2 rounded-md bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="text-center">
              <span className="text-lg font-medium">
                Verse {currentVerseIndex + 1} of {totalVerses}
              </span>
            </div>
            <button
              onClick={handleNextVerse}
              disabled={currentVerseIndex === totalVerses - 1}
              className="px-4 py-2 rounded-md bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>

          <VerseDisplay verse={currentVerse} />

          {currentVerse.commentaries.length > 0 && (
            <div className="mt-8 pt-6 border-t">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <h3 className="text-xl font-semibold">Commentaries</h3>
                <Select value={selectedCommentary} onValueChange={setSelectedCommentary}>
                  <SelectTrigger className="w-full sm:w-[250px]">
                    <SelectValue placeholder="Select a commentary" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentVerse.commentaries.map((commentary) => (
                      <SelectItem key={commentary.id} value={commentary.id}>
                        {commentary.author}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCommentary && (
                <div className="prose dark:prose-invert max-w-none">
                  {currentVerse.commentaries.find((c) => c.id === selectedCommentary)?.text}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

