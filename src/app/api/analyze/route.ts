import { NextRequest, NextResponse } from 'next/server';
import { analyzeImage, analyzeVideo, generateTags } from '../../../../lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    let analysis;
    
    if (file.type.startsWith('image/')) {
      analysis = await analyzeImage(file);
    } else if (file.type.startsWith('video/')) {
      analysis = await analyzeVideo(file);
    } else {
      // For other file types, return basic analysis
      analysis = {
        description: `File: ${file.name}`,
        objects: ['document', 'file'],
        colors: ['unknown'],
        mood: 'neutral',
        confidence: 0.6,
        tags: ['document', 'uploaded']
      };
    }

    // Generate additional tags
    const enhancedTags = await generateTags(analysis);
    analysis.tags = [...new Set([...analysis.tags, ...enhancedTags])];

    return NextResponse.json({
      success: true,
      analysis,
      fileInfo: {
        name: file.name,
        size: file.size,
        type: file.type
      }
    });

  } catch (error) {
    console.error('Analysis API error:', error);
    return NextResponse.json(
      { error: 'Analysis failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
