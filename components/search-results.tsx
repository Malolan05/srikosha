import Link from "next/link";

export default function SearchResults({ results, query }) {
  if (!results.length && query) return <div>No results found.</div>;
  if (!results.length) return null;

  return (
    <div>
      {results.map((res, i) => (
        <div key={i}>
          <Link href={`/scripture/${res.scriptureSlug}/verse/${res.verseNumber}`}>
            {res.scriptureName} - Verse {res.verseNumber}
          </Link>
          <div>{res.verseText}</div>
          {res.matchType === "commentary" && (
            <div>
              Commentary by {res.commentaryAuthor}:<br />
              {res.matchText}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
