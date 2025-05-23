// app/api/scriptures/route.ts (or .js if you prefer JavaScript)
import path from 'path';
import { promises as fs } from 'fs';
import { NextResponse } from 'next/server'; // Import NextResponse for API routes

// The 'type { Scripture } from '@/lib/data'' import is not used in this file
// and might be causing issues if '@/lib/data' is not correctly set up or exported.
// For now, I will remove it to ensure the API route functions.
// If you need to enforce types for your scripture data, you can define an interface
// or type alias directly in this file or a shared types file.

export async function GET(request) {
  try {
    // Define the path to your 'data/scriptures' directory
    const dataDirectory = path.join(process.cwd(), 'data', 'scriptures');

    // Read all file names in the directory
    const filenames = await fs.readdir(dataDirectory);

    let allSearchableVerses = [];

    // Loop through each file, read its content, and parse it as JSON
    for (const filename of filenames) {
      if (filename.endsWith('.json')) { // Ensure we only process JSON files
        const filePath = path.join(dataDirectory, filename);
        const fileContents = await fs.readFile(filePath, 'utf8');
        try {
          const scriptureDoc = JSON.parse(fileContents);

          // Extract metadata for the book name
          const bookName = scriptureDoc.metadata?.scripture_name || 'Unknown Scripture';
          const slug = scriptureDoc.metadata?.slug || 'unknown-slug'; // Use slug for unique ID part

          // Iterate through sections and their verses
          if (scriptureDoc.content && Array.isArray(scriptureDoc.content.sections)) {
            scriptureDoc.content.sections.forEach(section => {
              if (section.verses && Array.isArray(section.verses)) {
                section.verses.forEach(verse => {
                  // Process commentaries: join all commentary texts into a single string
                  // Now specifically looking for the 'commentary' property within each object in the array
                  const joinedCommentaries = Array.isArray(verse.commentaries)
                    ? verse.commentaries
                        .map(commentObj => {
                          // Check if commentObj is an object and has a 'commentary' property
                          if (typeof commentObj === 'object' && commentObj !== null && commentObj.commentary) {
                            return commentObj.commentary;
                          }
                          return ''; // Handle unexpected commentary formats
                        })
                        .filter(Boolean) // Remove empty strings
                        .join(' ')
                    : ''; // If commentaries is not an array, default to empty string

                  // Create a flattened object for each verse suitable for searching
                  allSearchableVerses.push({
                    // Create a unique ID for each verse
                    id: `${slug}-${section.number}-${verse.verse_number}`,
                    book: bookName,
                    chapter: section.number,
                    verse_number: verse.verse_number,
                    original_text: verse.original_text,
                    english_translation: verse.english_translation,
                    commentaries_text: joinedCommentaries, // Add the joined commentaries here
                  });
                });
              }
            });
          }

        } catch (parseError) {
          console.error(`Error parsing JSON from ${filename}:`, parseError);
        }
      }
    }

    // Send the combined, flattened verse data as a JSON response
    return NextResponse.json(allSearchableVerses, { status: 200 });

  } catch (error) {
    console.error('Error reading scripture files:', error);
    return NextResponse.json(
      { message: 'Error loading scriptures', error: error.message },
      { status: 500 }
    );
  }
}