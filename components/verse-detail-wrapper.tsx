"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { VerseDetail } from "@/components/verse-detail"

interface VerseDetailWrapperProps {
  verse: {
    number: number
    original: string
    transliteration: string
    translation: string
    commentaries: {
      [key: string]: string
    }
    sectionInfo?: {
      path: (number | string)[]
      title: string
    }
  }
  hasNextVerse: boolean
  hasPrevVerse: boolean
  totalVerses: number
  scriptureSlug: string
  nextVerseNumber?: number
  prevVerseNumber?: number
}

export function VerseDetailWrapper({ 
  verse, 
  hasNextVerse, 
  hasPrevVerse, 
  totalVerses, 
  scriptureSlug,
  nextVerseNumber,
  prevVerseNumber
}: VerseDetailWrapperProps) {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState('original')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTab = localStorage.getItem('selectedVerseTab')
    if (savedTab) {
      setSelectedTab(savedTab)
    }
  }, [])

  const handleTabChange = (value: string) => {
    setSelectedTab(value)
    localStorage.setItem('selectedVerseTab', value)
  }

  const handleNavigation = (direction: "prev" | "next") => {
    const newVerseNumber = direction === "prev" ? prevVerseNumber : nextVerseNumber
    if (newVerseNumber) {
      router.push(`/scripture/${scriptureSlug}/verse/${newVerseNumber}`)
    }
  }

  if (!mounted) {
    return (
      <VerseDetail
        verse={verse}
        hasNextVerse={hasNextVerse}
        hasPrevVerse={hasPrevVerse}
        totalVerses={totalVerses}
        onNavigate={handleNavigation}
        selectedTab="original"
        onTabChange={handleTabChange}
      />
    )
  }

  return (
    <VerseDetail
      verse={verse}
      hasNextVerse={hasNextVerse}
      hasPrevVerse={hasPrevVerse}
      totalVerses={totalVerses}
      onNavigate={handleNavigation}
      selectedTab={selectedTab}
      onTabChange={handleTabChange}
    />
  )
} 