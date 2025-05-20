import Link from "next/link";
import type { SearchResult } from "@/lib/search";

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
}

export default function SearchResults({ results, query }: SearchResultsProps) {
  if (!results.length && query) return <div>No results found.</div>;
  if (!results.length) return null;

  return (
    <div>
      {results.map((res, i) => (
        <div key={i} className="mb-6 border-b pb-4">
          <Link href={`/scripture/${res.scriptureSlug}/verse/${res.verseNumber}`}>
            <span className="font-semibold text-primary">
              {res.scriptureName} – Verse {res.verseNumber}
            </span>
          </Link>
          <div className="mt-1">{res.verseText}</div>
          {res.matchType === "commentary" && (
            <div className="mt-2 text-sm text-muted-foreground">
              Commentary by {res.commentaryAuthor}:<br />
              <span className="italic">{res.matchText}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
