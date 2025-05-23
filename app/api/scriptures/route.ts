import path from 'path';
import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';

interface Commentary {
  commentary?: string;
  [key: string]: any;
}

interface Verse {
  verse_number: number;
  original_text?: string;
  english_translation?: string;
  commentaries?: Commentary[];
}

interface Section {
  number: number;
  verses: Verse[];
}

interface ScriptureContent {
  sections: Section[];
}

interface ScriptureMetadata {
  scripture_name?: string;
  slug?: string;
}

interface ScriptureDoc {
  metadata?: ScriptureMetadata;
  content?: ScriptureContent;
}

interface SearchableVerse {
  id: string;
  book: string;
  chapter: number;
  verse_number: number;
  original_text?: string;
  english_translation?: string;
  commentaries_text: string;
}

export async function GET() {
  try {
    const dataDirectory = path.join(process.cwd(), 'data', 'scriptures');
    const filenames = await fs.readdir(dataDirectory);

    const allSearchableVerses: SearchableVerse[] = [];

    for (const filename of filenames) {
      if (!filename.endsWith('.json')) continue;

      const filePath = path.join(dataDirectory, filename);
      const fileContents = await fs.readFile(filePath, 'utf8');

      try {
        const scriptureDoc: ScriptureDoc = JSON.parse(fileContents);

        const bookName = scriptureDoc.metadata?.scripture_name || 'Unknown Scripture';
        const slug = scriptureDoc.metadata?.slug || 'unknown-slug';

        scriptureDoc.content?.sections?.forEach(section => {
          section.verses?.forEach(verse => {
            const joinedCommentaries = Array.isArray(verse.commentaries)
              ? verse.commentaries
                  .map((c: Commentary) =>
                    typeof c === 'object' && c?.commentary ? c.commentary : ''
                  )
                  .filter(Boolean)
                  .join(' ')
              : '';

            allSearchableVerses.push({
              id: `${slug}-${section.number}-${verse.verse_number}`,
              book: bookName,
              chapter: section.number,
              verse_number: verse.verse_number,
              original_text: verse.original_text || '',
              english_translation: verse.english_translation || '',
              commentaries_text: joinedCommentaries,
            });
          });
        });
      } catch (parseError) {
        console.error(`Error parsing JSON from ${filename}:`, parseError);
      }
    }

    return NextResponse.json(allSearchableVerses, { status: 200 });
  } catch (error: any) {
    console.error('Error reading scripture files:', error);
    return NextResponse.json(
      { message: 'Error loading scriptures', error: error.message },
      { status: 500 }
    );
  }
}
