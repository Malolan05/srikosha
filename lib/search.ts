import { getAllScriptures } from "@/lib/utils";

// Exported type for use in other files
export interface SearchResult {
  scriptureSlug: string;
  scriptureName: string;
  verseNumber: number;
  verseText: string;
  matchType: "verse" | "commentary";
  matchText: string;
  commentaryAuthor?: string;
}

/**
 * Searches all verses and commentaries for the given query string.
 * Returns an array of matches with relevant details.
 */
export async function searchVersesAndCommentaries(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const scriptures = await getAllScriptures();
  const results: SearchResult[] = [];

  for (const scripture of scriptures) {
    for (const section of scripture.content.sections || []) {
      for (const verse of section.verses || []) {
        // Search for a match in the verse text (original or translation)
        if (
          (verse.original_text && verse.original_text.toLowerCase().includes(q)) ||
          (verse.english_translation && verse.english_translation.toLowerCase().includes(q))
        ) {
          results.push({
            scriptureSlug: scripture.metadata.slug,
            scriptureName: scripture.metadata.scripture_name,
            verseNumber: verse.verse_number,
            verseText: verse.english_translation || verse.original_text || "",
            matchType: "verse",
            matchText:
              verse.english_translation?.toLowerCase().includes(q)
                ? verse.english_translation
                : verse.original_text || "",
          });
        }
        // Search for a match in commentaries
        for (const comm of verse.commentaries || []) {
          if (comm.commentary && comm.commentary.toLowerCase().includes(q)) {
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
