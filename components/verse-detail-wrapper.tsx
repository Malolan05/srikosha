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
  const [selectedTab, setSelectedTab] = useState<string>(() => {
    // Try to get the saved tab preference from localStorage during initialization
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedVerseTab') || 'original'
    }
    return 'original'
  })

  // Update localStorage when tab changes
  const handleTabChange = (value: string) => {
    setSelectedTab(value)
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedVerseTab', value)
    }
  }

  const handleNavigation = (direction: "prev" | "next") => {
    const newVerseNumber = direction === "prev" ? prevVerseNumber : nextVerseNumber
    if (newVerseNumber) {
      router.push(`/scripture/${scriptureSlug}/verse/${newVerseNumber}`)
    }
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