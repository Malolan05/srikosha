"use client";
import { useState } from "react";
import { searchVersesAndCommentaries } from "@/lib/search";
import SearchResults from "@/components/search-results";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    const res = await searchVersesAndCommentaries(query);
    setResults(res);
    setLoading(false);
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <form onSubmit={handleSearch} className="mb-6">
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Search verses or commentaries…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button type="submit" className="mt-2 px-4 py-2 bg-primary text-white rounded">
          Search
        </button>
      </form>
      {loading ? (
        <div>Searching…</div>
      ) : (
        <SearchResults results={results} query={query} />
      )}
    </div>
  );
}
