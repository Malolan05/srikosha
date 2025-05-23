import path from 'path';
import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const dataDirectory = path.join(process.cwd(), 'data', 'scriptures');
    const filenames = await fs.readdir(dataDirectory);

    let allSearchableVerses = [];
    for (const filename of filenames) {
      if (filename.endsWith('.json')) {
        const filePath = path.join(dataDirectory, filename);
        const fileContents = await fs.readFile(filePath, 'utf8');
        try {
          const scriptureDoc = JSON.parse(fileContents);
          const bookName = scriptureDoc.metadata?.scripture_name || 'Unknown Scripture';
          const slug = scriptureDoc.metadata?.slug || 'unknown-slug';
          if (scriptureDoc.content && Array.isArray(scriptureDoc.content.sections)) {
            scriptureDoc.content.sections.forEach(section => {
              if (section.verses && Array.isArray(section.verses)) {
                section.verses.forEach(verse => {
                  const joinedCommentaries = Array.isArray(verse.commentaries)
                    ? verse.commentaries
                        .map(commentObj => {
                          if (typeof commentObj === 'object' && commentObj !== null && commentObj.commentary) {
                            return commentObj.commentary;
                          }
                          return ''; 
                        })
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
              }
            });
          }

        } catch (parseError) {
          console.error(`Error parsing JSON from ${filename}:`, parseError);
        }
      }
    }
    
    return NextResponse.json(allSearchableVerses, { status: 200 });

  } catch (error) {
    console.error('Error reading scripture files:', error);
    return NextResponse.json(
      { message: 'Error loading scriptures', error: error.message },
      { status: 500 }
    );
  }
}
import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import type { Scripture } from '@/lib/data'

export async function GET() {
  try {
    const scripturePath = path.join(process.cwd(), 'data', 'scriptures')
    const files = await fs.readdir(scripturePath)
    const scriptureFiles = files.filter(file => file.endsWith('.json'))

    const scriptures = await Promise.all(
      scriptureFiles.map(async file => {
        const filePath = path.join(scripturePath, file)
        const content = await fs.readFile(filePath, 'utf8')
        return JSON.parse(content) as Scripture
      })
    )

    return NextResponse.json(scriptures)
  } catch (error) {
    console.error('Error loading scriptures:', error)
    return new NextResponse('Error loading scriptures', { status: 500 })
  }
} 
