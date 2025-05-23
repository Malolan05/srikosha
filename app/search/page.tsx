'use client';

import React, { useEffect, useState } from 'react';

interface ScriptureVerse {
  id: string;
  book: string;
  chapter: number;
  verse_number: number;
  original_text: string;
  english_translation: string;
  commentaries_text: string;
}

const SearchPage = () => {
  const [scriptureData, setScriptureData] = useState<ScriptureVerse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/scriptures');
        if (!res.ok) throw new Error('Failed to fetch data from the server.');
        const data = await res.json();
        setScriptureData(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
        console.error('Failed to fetch scriptures:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Scriptures</h1>
      {scriptureData.map((verse) => (
        <div key={verse.id} className="mb-6 p-4 border rounded shadow">
          <p className="text-sm text-gray-500">
            {verse.book} {verse.chapter}:{verse.verse_number}
          </p>
          <p className="text-lg font-semibold mt-1">{verse.original_text}</p>
          <p className="text-md text-gray-700 mt-1 italic">{verse.english_translation}</p>
          {verse.commentaries_text && (
            <p className="text-sm text-gray-600 mt-2">Commentary: {verse.commentaries_text}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default SearchPage;
