import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Category, Scripture } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Import all scripture files
import sriParameshvaraSamhita from '@/data/scriptures/sri-parameshvara-samhita.json'
import gitarthasangraha from '@/data/scriptures/gitarthasangraha.json'
import brahmaSutraAdhyayaOne from '@/data/scriptures/brahma-sutra-adhyaya-one.json'
import brahmaSutraAdhyayaTwo from '@/data/scriptures/brahma-sutra-adhyaya-two.json'
import brahmaSutraAdhyayaThree from '@/data/scriptures/brahma-sutra-adhyaya-three.json'
import brahmaSutraAdhyayaFour from '@/data/scriptures/brahma-sutra-adhyaya-four.json'
import purushakaramimamsa from '@/data/scriptures/purushakara-mimamsa.json'
import stotraratna from '@/data/scriptures/stotraratna.json'
import vedarthasangraha from '@/data/scriptures/vedarthasangraha.json'
import bhagavadgita from '@/data/scriptures/bhagavad-gita.json'
import natvachandrika from '@/data/scriptures/natvacandrika.json'

// Create a map of all scriptures
const scripturesData: Scripture[] = [
  sriParameshvaraSamhita,
  gitarthasangraha,
  brahmaSutraAdhyayaOne,
  brahmaSutraAdhyayaTwo,
  brahmaSutraAdhyayaThree,
  brahmaSutraAdhyayaFour,
  purushakaramimamsa,
  stotraratna,
  vedarthasangraha,
  bhagavadgita,
  natvachandrika
]

export function getScriptType(text: string): 'devanagari' | 'tamil' | 'latin' | 'mixed' {
  // Devanagari Unicode range: 0900-097F
  const devanagariPattern = /[\u0900-\u097F]/
  // Tamil Unicode range: 0B80-0BFF
  const tamilPattern = /[\u0B80-\u0BFF]/

  const hasDevanagari = devanagariPattern.test(text)
  const hasTamil = tamilPattern.test(text)

  if (hasDevanagari && hasTamil) return 'mixed'
  if (hasDevanagari) return 'devanagari'
  if (hasTamil) return 'tamil'
  return 'latin'
}

export async function getScripture(slug: string): Promise<Scripture | null> {
  const scripture = scripturesData.find(s => s.metadata.slug === slug)
  return scripture || null
}

export async function getAllScriptures(): Promise<Scripture[]> {
  return scripturesData
}

export async function getScripturesByCategory(category: string): Promise<Scripture[]> {
  return scripturesData.filter(scripture => scripture.metadata.category === category)
}

