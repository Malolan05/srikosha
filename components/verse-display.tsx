"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface VerseDisplayProps {
  verse: {
    original: string
    transliteration: string
    translation: string
  }
}

export default function VerseDisplay({ verse }: VerseDisplayProps) {
  return (
    <Tabs defaultValue="original" className="w-full">
      <TabsList className="w-full mb-4">
        <TabsTrigger value="original" className="flex-1">Original</TabsTrigger>
        <TabsTrigger value="transliteration" className="flex-1">Transliteration</TabsTrigger>
        <TabsTrigger value="translation" className="flex-1">Translation</TabsTrigger>
      </TabsList>
      <TabsContent value="original">
        <div className="text-2xl text-center leading-relaxed font-tamil">
          {verse.original}
        </div>
      </TabsContent>
      <TabsContent value="transliteration">
        <div className="text-2xl text-center leading-relaxed">
          {verse.transliteration}
        </div>
      </TabsContent>
      <TabsContent value="translation">
        {verse.translation && (
          <div className="text-xl text-center leading-relaxed">
            {verse.translation}
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}

