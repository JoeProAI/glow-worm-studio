import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { query, files, userId } = await request.json();
    
    if (!query || !files) {
      return NextResponse.json({ error: 'Query and files required' }, { status: 400 });
    }

    // Use OpenAI to understand the search intent and find relevant files
    const searchResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an AI search assistant for a media library. Analyze the user's search query and match it against the provided media files. Return a JSON array of file IDs ranked by relevance (0-1 score).

          Consider:
          - Semantic meaning of the query
          - File names, descriptions, tags
          - AI analysis data (objects, colors, moods)
          - Context and intent

          Return format: [{"id": "file_id", "score": 0.95, "reason": "why this matches"}]`
        },
        {
          role: "user",
          content: `Search query: "${query}"
          
          Available files:
          ${files.map((file: any) => `
          ID: ${file.id}
          Name: ${file.name}
          Description: ${file.aiAnalysis?.description || 'No description'}
          Tags: ${file.tags?.join(', ') || 'No tags'}
          Objects: ${file.aiAnalysis?.objects?.join(', ') || 'No objects'}
          Colors: ${file.aiAnalysis?.colors?.join(', ') || 'No colors'}
          Mood: ${file.aiAnalysis?.mood || 'No mood'}
          `).join('\n---\n')}`
        }
      ],
      max_tokens: 1000
    });

    const content = searchResponse.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: 'No search results' }, { status: 500 });
    }

    try {
      const results = JSON.parse(content);
      return NextResponse.json({ results });
    } catch (parseError) {
      // Fallback to simple text matching
      const simpleResults = files
        .map((file: any) => {
          const searchTerm = query.toLowerCase();
          let score = 0;
          let reasons = [];

          // Name matching
          if (file.name.toLowerCase().includes(searchTerm)) {
            score += 0.8;
            reasons.push('filename match');
          }

          // Tag matching
          if (file.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm))) {
            score += 0.6;
            reasons.push('tag match');
          }

          // Description matching
          if (file.aiAnalysis?.description?.toLowerCase().includes(searchTerm)) {
            score += 0.4;
            reasons.push('description match');
          }

          return score > 0 ? {
            id: file.id,
            score,
            reason: reasons.join(', ')
          } : null;
        })
        .filter(Boolean)
        .sort((a: any, b: any) => b.score - a.score);

      return NextResponse.json({ results: simpleResults });
    }

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
