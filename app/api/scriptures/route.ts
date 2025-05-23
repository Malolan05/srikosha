import path from 'path';
import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';

interface Commentary {
  commentary: string;
}

interface Verse {
  verse_number: string;
  original_text?: string;
  english_translation?: string;
  commentaries?: (Commentary | null | string)[];
}

interface Section {
  number: string;
  verses: Verse[];
}

interface ScriptureDocument {
  metadata?: {
    scripture_name?: string;
    slug?: string;
  };
  content?: {
    sections?: Section[];
  };
}

interface SearchableVerse {
  id: string;
  book: string;
  chapter: string;
  verse_number: string;
  original_text?: string;
  english_translation?: string;
  commentaries_text: string;
}

export async function GET(_request: Request) {
  try {
    const dataDirectory = path.join(process.cwd(), 'data', 'scriptures');
    const filenames = await fs.readdir(dataDirectory);

    let allSearchableVerses: any[] = [];
    const allSearchableVerses: SearchableVerse[] = [];

    for (const filename of filenames) {
      if (!filename.endsWith('.json')) continue;

      const filePath = path.join(dataDirectory, filename);
      const fileContents = await fs.readFile(filePath, 'utf8');

      try {
        const scriptureDoc: ScriptureDocument = JSON.parse(fileContents);

        const bookName = scriptureDoc.metadata?.scripture_name || 'Unknown Scripture';
        const slug = scriptureDoc.metadata?.slug || 'unknown-slug';

        scriptureDoc.content?.sections?.forEach((section) => {
          section.verses?.forEach((verse) => {
            const joinedCommentaries =
              Array.isArray(verse.commentaries)
                ? verse.commentaries
                    .map((commentObj) =>
                      typeof commentObj === 'object' &&
                      commentObj !== null &&
                      'commentary' in commentObj &&
                      typeof commentObj.commentary === 'string'
                        ? commentObj.commentary
                        : ''
                    )
                    .filter(Boolean)
                    .join(' ')
                : '';

            allSearchableVerses.push({
              id: `${slug}-${section.number}-${verse.verse_number}`,
              book: bookName,
              chapter: section.number,
              verse_number: verse.verse_number,
              original_text: verse.original_text,
              english_translation: verse.english_translation,
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
