import { notFound } from "next/navigation"
import { getAllScriptures, getScripture } from "@/lib/utils"

interface ScripturePageProps {
  params: {
    category: string
    scripture: string
  }
}

export async function generateStaticParams() {
  const scriptures = await getAllScriptures()
  return scriptures.map((scripture) => ({
    category: scripture.metadata.category.toLowerCase().replace(/\s+/g, "-"),
    scripture: scripture.metadata.scripture_name.toLowerCase().replace(/\s+/g, "-"),
  }))
}

export function generateMetadata({
  params,
}: {
  params: { category: string; scripture: string }
}) {
  const scripture = scriptures.find((s) => s.slug === params.scripture && s.category === params.category)

  if (!scripture) {
    return {
      title: "Scripture Not Found",
    }
  }

  return {
    title: `${scripture.title} | Sri Vaishnava Scriptures`,
    description: scripture.description,
  }
}

export default async function ScripturePage({ params }: ScripturePageProps) {
  const scripture = await getScripture(params.scripture)

  if (!scripture) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 sm:mb-4 text-primary">
          {scripture.metadata.scripture_name}
        </h1>
        <div className="text-lg text-muted-foreground space-y-2">
          <p>By {scripture.metadata.author}</p>
          <p>Composed in {scripture.metadata.year_of_composition}</p>
          <p>{scripture.metadata.total_chapters} chapters • {scripture.metadata.total_verses} verses</p>
        </div>
      </div>

      <div className="flex-1">
        {scripture.content.sections.map((section) => (
          <div key={section.number} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
            {section.verses.map((verse) => (
              <div key={verse.verse_number} className="mb-4 p-4 rounded-lg bg-muted/40">
                <div className="text-sm text-muted-foreground mb-2">Verse {verse.verse_number}</div>
                <div className="text-foreground">{verse.text}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

