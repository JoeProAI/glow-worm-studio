import { NextRequest, NextResponse } from 'next/server';
import { EnhancedAIService } from '../../../../lib/enhanced-ai-service';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const processingMode = formData.get('processingMode') as string || 'auto';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    console.log(`🚀 Enhanced analysis request: ${file.name} (${file.size} bytes, ${file.type})`);

    let analysis;

    // Route to appropriate enhanced analysis method
    if (file.type.startsWith('image/')) {
      analysis = await EnhancedAIService.analyzeImage(file, userId);
    } else if (file.type.startsWith('video/')) {
      analysis = await EnhancedAIService.analyzeVideo(file, userId);
    } else if (file.type.startsWith('audio/')) {
      analysis = await EnhancedAIService.analyzeAudio(file, userId);
    } else {
      // Fallback for unsupported file types
      analysis = {
        description: `File: ${file.name} (${file.type})`,
        objects: ['document', 'file'],
        colors: [],
        mood: 'neutral',
        confidence: 0.3,
        tags: [file.type.split('/')[1] || 'unknown', 'document'],
        processingMethod: 'local' as const,
        processingTime: 100,
        complexity: 'simple' as const
      };
    }

    console.log(`✅ Enhanced analysis completed: ${analysis.processingMethod} processing in ${analysis.processingTime}ms`);

    return NextResponse.json({
      success: true,
      analysis,
      metadata: {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        processingMethod: analysis.processingMethod,
        complexity: analysis.complexity,
        processingTime: analysis.processingTime,
        sandboxId: analysis.sandboxId,
        resourceUsage: analysis.resourceUsage
      }
    });

  } catch (error: any) {
    console.error('Enhanced analysis API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Enhanced analysis failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Health check endpoint
  return NextResponse.json({
    status: 'healthy',
    service: 'Enhanced AI Analysis with Daytona SDK',
    features: [
      'Sandbox processing for large files',
      'Automatic complexity detection',
      'Resource usage monitoring',
      'Fallback to local processing',
      'Batch processing support'
    ],
    endpoints: {
      POST: 'Upload file for enhanced AI analysis',
      GET: 'Health check and service info'
    }
  });
}
