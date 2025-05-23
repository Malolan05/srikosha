// route.ts or route.js for /api/scriptures
import path from 'path';
import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const dataDirectory = path.join(process.cwd(), 'data', 'scriptures');
    const filenames = await fs.readdir(dataDirectory);

    let allVerses = [];

    for (const filename of filenames) {
      if (!filename.endsWith('.json')) continue;

      const filePath = path.join(dataDirectory, filename);
      const fileContents = await fs.readFile(filePath, 'utf8');

      try {
        const scriptureDoc = JSON.parse(fileContents);
        const bookName = scriptureDoc.metadata?.scripture_name || 'Unknown Scripture';
        const slug = scriptureDoc.metadata?.slug || 'unknown-slug';

        if (Array.isArray(scriptureDoc?.content?.sections)) {
          for (const section of scriptureDoc.content.sections) {
            if (!Array.isArray(section.verses)) continue;

            for (const verse of section.verses) {
              const commentaries = Array.isArray(verse.commentaries)
                ? verse.commentaries
                    .map(c => (typeof c === 'object' && c?.commentary ? c.commentary : ''))
                    .filter(Boolean)
                    .join(' ')
                : '';

              allVerses.push({
                id: `${slug}-${section.number}-${verse.verse_number}`,
                book: bookName,
                chapter: section.number,
                verse_number: verse.verse_number,
                original_text: verse.original_text || '',
                english_translation: verse.english_translation || '',
                commentaries_text: commentaries,
              });
            }
          }
        }
      } catch (err) {
        console.error(`Failed to parse ${filename}:`, err);
      }
    }

    return NextResponse.json(allVerses, { status: 200 });

  } catch (error) {
    console.error('Error loading scripture files:', error);
    return NextResponse.json(
      { message: 'Error loading scriptures', error: error.message },
      { status: 500 }
    );
  }
}
