"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [scriptureData, setScriptureData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  useEffect(() => {
    const fetchScriptures = async () => {
      try {
        const response = await fetch("/api/scriptures");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setScriptureData(data);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch scriptures:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScriptures();
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      setShowPlaceholder(true);
      return;
    }

    setShowPlaceholder(false);
    const lower = searchTerm.toLowerCase();
    const results = scriptureData.filter(item =>
      (item.book && item.book.toLowerCase().includes(lower)) ||
      (item.original_text && item.original_text.toLowerCase().includes(lower)) ||
      (item.english_translation && item.english_translation.toLowerCase().includes(lower)) ||
      (item.commentaries_text && item.commentaries_text.toLowerCase().includes(lower)) ||
      (item.id && item.id.toLowerCase().includes(lower))
    );
    setSearchResults(results);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="container mx-auto max-w-4xl space-y-8">
        {/* Search Input */}
        <div className="bg-white rounded-xl shadow p-4 flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search scriptures by book, verse, translation, or commentary..."
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>

        {/* Loading/Error/Placeholder/Results */}
        {isLoading ? (
          <Card className="text-center p-12">
            <CardContent className="space-y-6">
              <p className="text-xl font-semibold text-blue-600">Loading scriptures...</p>
              <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full mx-auto"></div>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="text-center p-12 bg-red-100 border border-red-400">
            <CardContent className="space-y-6">
              <p className="text-xl font-semibold text-red-700">Error: {error}</p>
              <p className="text-red-600">Could not load scripture data. Please check the API route and JSON files.</p>
            </CardContent>
          </Card>
        ) : showPlaceholder ? (
          <Card className="text-center p-12">
            <CardContent className="space-y-6">
              <Construction className="h-16 w-16 mx-auto text-blue-600" />
              <h1 className="text-3xl font-bold text-blue-600">We're Still Working on Search</h1>
              <p className="text-gray-600 max-w-lg mx-auto">
                We're currently building a powerful search feature to help you find exactly what you're looking for.
                Check back soon for updates!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Search Results:</h2>
            {searchResults.length > 0 ? (
              <ul className="space-y-4">
                {searchResults.map(item => (
                  <li
                    key={item.id}
                    className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <p className="text-lg font-semibold">{item.book} {item.chapter}:{item.verse_number}</p>
                    {item.original_text && (
                      <p className="text-gray-700 mt-1 text-right font-serif">{item.original_text}</p>
                    )}
                    {item.english_translation && (
                      <p className="text-gray-700 mt-1">{item.english_translation}</p>
                    )}
                    {item.commentaries_text && item.commentaries_text.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200 text-sm italic text-gray-500">
                        Commentaries: {item.commentaries_text.substring(0, 200)}...
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 text-center py-8">No results found for "{searchTerm}".</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
