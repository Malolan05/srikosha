"use client";
import React, {
  useState,
  useEffect,
  ReactNode,
  KeyboardEvent,
} from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card = ({ children, className = "" }: CardProps) => (
  <div className={`bg-white rounded-xl shadow-lg ${className}`}>{children}</div>
);

const CardContent = ({ children, className = "" }: CardProps) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

interface IconProps {
  className?: string;
}

const ConstructionIcon = ({ className = "" }: IconProps) => (

import React, { useState, useEffect, KeyboardEvent } from "react";

interface ComponentProps {
  children: React.ReactNode;
  className?: string;
}

interface ScriptureItem {
  id: string;
  book: string;
  chapter: string;
  verse_number: string;
  original_text?: string;
  english_translation?: string;
  commentaries_text?: string;
}

const Card = ({ children, className = "" }: ComponentProps) => (
  <div className={`bg-white rounded-xl shadow-lg ${className}`}>{children}</div>
);

const CardContent = ({ children, className = "" }: ComponentProps) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const ConstructionIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="6" width="20" height="12" rx="2" ry="2" />
    <path d="M12 18V6" />
    <path d="M7 18V6" />
    <path d="M17 18V6" />
  </svg>
);

interface ScriptureItem {
  id: string;
  book?: string;
  chapter?: number;
  verse_number?: number;
  original_text?: string;
  english_translation?: string;
  commentaries_text?: string;
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [scriptureData, setScriptureData] = useState<ScriptureItem[]>([]);
  const [searchResults, setSearchResults] = useState<ScriptureItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showPlaceholder, setShowPlaceholder] = useState<boolean>(true);

  useEffect(() => {
    const fetchScriptures = async () => {
      try {
        const response = await fetch("/api/scriptures");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ScriptureItem[] = await response.json();
        setScriptureData(data);
      } catch (err: any) {
        setError(err.message);
        setError(err.message || "Unknown error");
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

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filteredResults = scriptureData.filter((item) =>
      item.book?.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.original_text?.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.english_translation?.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.commentaries_text?.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.id?.toLowerCase().includes(lowerCaseSearchTerm)
    );

    setSearchResults(filteredResults);
    const lower = searchTerm.toLowerCase();
    const filtered = scriptureData.filter(
      (item) =>
        item.book?.toLowerCase().includes(lower) ||
        item.original_text?.toLowerCase().includes(lower) ||
        item.english_translation?.toLowerCase().includes(lower) ||
        item.commentaries_text?.toLowerCase().includes(lower) ||
        item.id?.toLowerCase().includes(lower)
    );
    setSearchResults(filtered);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12 px-4 font-sans">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col items-center space-y-8 w-full">
          <div className="w-full max-w-2xl">
            <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-md">
              <input
                type="text"
                placeholder="Search scriptures by book, verse, translation, or commentary..."
                className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out"
              >
                Search
              </button>
            </div>
          </div>

          {isLoading ? (
            <Card className="text-center p-12 w-full max-w-2xl">
              <CardContent className="space-y-6">
                <p className="text-xl font-semibold text-blue-600">Loading scriptures...</p>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="text-center p-12 w-full max-w-2xl bg-red-100 border border-red-400">
              <CardContent className="space-y-6">
                <p className="text-xl font-semibold text-red-700">Error: {error}</p>
                <p className="text-red-600">
                  Could not load scripture data. Please check the API route and JSON files.
                </p>
              </CardContent>
            </Card>
          ) : showPlaceholder ? (
            <Card className="text-center p-12 w-full max-w-2xl">
              <CardContent className="space-y-6">
                <ConstructionIcon className="h-16 w-16 mx-auto text-blue-600" />
                <h1 className="text-3xl font-bold text-blue-600">We're Still Working on Search</h1>
                <p className="text-gray-600 max-w-lg mx-auto">
                  We're currently building a powerful search feature to help you find exactly what you're looking for.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-6 mt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Search Results:</h2>
              {searchResults.length > 0 ? (
                <ul className="space-y-4">
                  {searchResults.map((item) => (
                    <li
                      key={item.id}
                      className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-150 ease-in-out"
                    >
                      <p className="text-lg font-semibold text-gray-900">
                        {item.book} {item.chapter}:{item.verse_number}
                      </p>
                      {item.original_text && (
                        <p className="text-gray-700 mt-1 text-right font-serif">{item.original_text}</p>
                      )}
                      {item.english_translation && (
                        <p className="text-gray-700 mt-1">{item.english_translation}</p>
                      )}
                      {item.commentaries_text && item.commentaries_text.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-200 text-sm text-gray-500 italic">
                          <p>Commentaries: {item.commentaries_text.substring(0, 200)}...</p>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 text-center py-8">
                  No results found for "{searchTerm}". Try a different search term.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
