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

export async function GET() {
  try {
    const dataDirectory = path.join(process.cwd(), 'public', 'data', 'scriptures');
    
    let filenames: string[];
    try {
      filenames = await fs.readdir(dataDirectory);
    } catch (error) {
      const altDirectory = path.join(process.cwd(), 'data', 'scriptures');
      try {
        filenames = await fs.readdir(altDirectory);
        const workingDirectory = altDirectory;
        return await processFiles(workingDirectory, filenames);
      } catch {
        return NextResponse.json(
          { error: 'Scripture data directory not found' },
          { status: 404 }
        );
      }
    }

    return await processFiles(dataDirectory, filenames);
  } catch (error: any) {
    console.error('Error in scripture API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function processFiles(dataDirectory: string, filenames: string[]) {
  const allSearchableVerses: SearchableVerse[] = [];

  for (const filename of filenames) {
    if (!filename.endsWith('.json')) continue;

    const filePath = path.join(dataDirectory, filename);
    
    try {
      const fileContents = await fs.readFile(filePath, 'utf8');
      const scriptureDoc: ScriptureDocument = JSON.parse(fileContents);

      const bookName = scriptureDoc.metadata?.scripture_name || 'Unknown Scripture';
      const slug = scriptureDoc.metadata?.slug || filename.replace('.json', '');

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
                      : typeof commentObj === 'string'
                      ? commentObj
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
      console.error(`Error processing ${filename}:`, parseError);
      continue;
    }
  }

  return NextResponse.json(allSearchableVerses, {
    status: 200,
    headers: {
      'Cache-Control': 'public, max-age=3600',
    },
  });
}