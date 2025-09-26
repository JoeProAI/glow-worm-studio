import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const lumaApiKey = process.env.LUMA_API_KEY;
    if (!lumaApiKey) {
      return NextResponse.json(
        { error: 'Luma API key not configured' },
        { status: 500 }
      );
    }

    console.log('🎬 Generating video with Luma AI:', prompt);

    // Call Luma AI API
    const response = await fetch('https://api.lumalabs.ai/dream-machine/v1/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lumaApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        aspect_ratio: '16:9',
        loop: false,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Luma API error:', error);
      return NextResponse.json(
        { error: 'Failed to generate video' },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log('🎬 Video generation started:', result.id);

    return NextResponse.json({
      success: true,
      generationId: result.id,
      status: result.state,
      message: 'Video generation started'
    });

  } catch (error) {
    console.error('Video generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
