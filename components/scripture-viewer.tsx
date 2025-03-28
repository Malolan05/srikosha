"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Scripture, ScriptureContent } from "@/lib/types"
import VerseDisplay from "@/components/verse-display"
import { Button } from "@/components/ui/button"

interface ScriptureViewerProps {
  scripture: Scripture
  content: ScriptureContent
}

export default function ScriptureViewer({ scripture, content }: ScriptureViewerProps) {
  const searchParams = useSearchParams()
  const verseParam = searchParams.get("verse")
  const [mounted, setMounted] = useState(false)
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0)
  const [selectedCommentary, setSelectedCommentary] = useState("")

  useEffect(() => {
    setMounted(true)
    // Initialize selected commentary after mounting
    if (content.verses[0]?.commentaries[0]?.author) {
      setSelectedCommentary(content.verses[0].commentaries[0].author)
    }
  }, [content.verses])

  // Handle direct navigation to a specific verse
  useEffect(() => {
    if (verseParam) {
      const verseNumber = Number.parseInt(verseParam, 10)
      const index = content.verses.findIndex((v) => v.verse_number === verseNumber)
      if (index !== -1) {
        setCurrentVerseIndex(index)
        // Update selected commentary if the current one doesn't exist in the new verse
        const newVerse = content.verses[index]
        if (!newVerse.commentaries.some((c) => c.author === selectedCommentary)) {
          setSelectedCommentary(newVerse.commentaries[0]?.author || "")
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
      if (!newVerse.commentaries.some((c) => c.author === selectedCommentary)) {
        setSelectedCommentary(newVerse.commentaries[0]?.author || "")
      }
    }
  }

  const handleNextVerse = () => {
    if (currentVerseIndex < totalVerses - 1) {
      setCurrentVerseIndex(currentVerseIndex + 1)
      // Update selected commentary if the current one doesn't exist in the new verse
      const newVerse = content.verses[currentVerseIndex + 1]
      if (!newVerse.commentaries.some((c) => c.author === selectedCommentary)) {
        setSelectedCommentary(newVerse.commentaries[0]?.author || "")
      }
    }
  }

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button onClick={handlePreviousVerse} disabled={currentVerseIndex === 0}>
            Previous Verse
          </Button>
          <span className="text-sm text-muted-foreground">
            Verse {currentVerse.verse_number} of {totalVerses}
          </span>
          <Button onClick={handleNextVerse} disabled={currentVerseIndex === totalVerses - 1}>
            Next Verse
          </Button>
        </div>

        <VerseDisplay verse={{
          original: currentVerse.original_text,
          transliteration: currentVerse.iast_text || "",
          translation: currentVerse.english_translation || ""
        }} />

        {currentVerse.commentaries.length > 0 && (
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Commentaries</h3>
            <Select value={currentVerse.commentaries[0]?.author || ""} onValueChange={() => {}}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a commentary" />
              </SelectTrigger>
              <SelectContent>
                {currentVerse.commentaries.map((commentary) => (
                  <SelectItem key={commentary.author} value={commentary.author}>
                    {commentary.author}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="mt-4 prose prose-zinc dark:prose-invert">
              {currentVerse.commentaries[0]?.commentary}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button onClick={handlePreviousVerse} disabled={currentVerseIndex === 0}>
          Previous Verse
        </Button>
        <span className="text-sm text-muted-foreground">
          Verse {currentVerse.verse_number} of {totalVerses}
        </span>
        <Button onClick={handleNextVerse} disabled={currentVerseIndex === totalVerses - 1}>
          Next Verse
        </Button>
      </div>

      <VerseDisplay verse={{
        original: currentVerse.original_text,
        transliteration: currentVerse.iast_text || "",
        translation: currentVerse.english_translation || ""
      }} />

      {currentVerse.commentaries.length > 0 && (
        <div className="mt-8 pt-6 border-t">
          <h3 className="text-lg font-semibold mb-4">Commentaries</h3>
          <Select value={selectedCommentary} onValueChange={setSelectedCommentary}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a commentary" />
            </SelectTrigger>
            <SelectContent>
              {currentVerse.commentaries.map((commentary) => (
                <SelectItem key={commentary.author} value={commentary.author}>
                  {commentary.author}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="mt-4 prose prose-zinc dark:prose-invert">
            {currentVerse.commentaries.find(c => c.author === selectedCommentary)?.commentary}
          </div>
        </div>
      )}
    </div>
  )
}

