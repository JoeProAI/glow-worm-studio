import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const generationId = searchParams.get('id');
    
    if (!generationId) {
      return NextResponse.json(
        { error: 'Generation ID is required' },
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

    console.log('🔍 Checking video status:', generationId);

    // Check Luma AI generation status
    const response = await fetch(`https://api.lumalabs.ai/dream-machine/v1/generations/${generationId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${lumaApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Luma API error:', error);
      return NextResponse.json(
        { error: 'Failed to check video status' },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log('🔍 Video status:', result.state);

    return NextResponse.json({
      success: true,
      id: result.id,
      status: result.state,
      videoUrl: result.assets?.video || null,
      thumbnailUrl: result.assets?.thumbnail || null,
      prompt: result.prompt
    });

  } catch (error) {
    console.error('Video status check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
