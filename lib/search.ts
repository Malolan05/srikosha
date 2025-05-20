import { getAllScriptures } from "@/lib/utils";

// Type definitions for clarity (adjust to your actual types)
interface SearchResult {
  scriptureSlug: string;
  scriptureName: string;
  verseNumber: number;
  verseText: string;
  matchType: "verse" | "commentary";
  matchText: string;
  commentaryAuthor?: string;
}

export async function searchVersesAndCommentaries(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const scriptures = await getAllScriptures();
  const results: SearchResult[] = [];

  for (const scripture of scriptures) {
    for (const section of scripture.content.sections || []) {
      for (const verse of section.verses || []) {
        // Verse match
        if (
          verse.original_text?.toLowerCase().includes(q) ||
          verse.english_translation?.toLowerCase().includes(q)
        ) {
          results.push({
            scriptureSlug: scripture.metadata.slug,
            scriptureName: scripture.metadata.scripture_name,
            verseNumber: verse.verse_number,
            verseText: verse.english_translation || verse.original_text || "",
            matchType: "verse",
            matchText: verse.english_translation?.toLowerCase().includes(q)
              ? verse.english_translation
              : verse.original_text,
          });
        }
        // Commentary match
        for (const comm of verse.commentaries || []) {
          if (comm.commentary?.toLowerCase().includes(q)) {
            results.push({
              scriptureSlug: scripture.metadata.slug,
              scriptureName: scripture.metadata.scripture_name,
              verseNumber: verse.verse_number,
              verseText: verse.english_translation || verse.original_text || "",
              matchType: "commentary",
              matchText: comm.commentary,
              commentaryAuthor: comm.author,
            });
          }
        }
      }
    }
  }
  return results;
}
