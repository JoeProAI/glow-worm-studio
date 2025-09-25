import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { fileId, files } = await request.json();
    
    if (!fileId || !files) {
      return NextResponse.json({ error: 'File ID and files required' }, { status: 400 });
    }

    const targetFile = files.find((f: any) => f.id === fileId);
    if (!targetFile) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Calculate similarity scores based on AI analysis
    const recommendations = files
      .filter((file: any) => file.id !== fileId)
      .map((file: any) => {
        let score = 0;
        let reasons = [];

        // Mood similarity
        if (targetFile.aiAnalysis?.mood && file.aiAnalysis?.mood === targetFile.aiAnalysis.mood) {
          score += 0.4;
          reasons.push('similar mood');
        }

        // Color similarity
        const targetColors = targetFile.aiAnalysis?.colors || [];
        const fileColors = file.aiAnalysis?.colors || [];
        const colorOverlap = targetColors.filter((color: string) => fileColors.includes(color)).length;
        if (colorOverlap > 0) {
          score += (colorOverlap / Math.max(targetColors.length, fileColors.length)) * 0.3;
          reasons.push('similar colors');
        }

        // Object similarity
        const targetObjects = targetFile.aiAnalysis?.objects || [];
        const fileObjects = file.aiAnalysis?.objects || [];
        const objectOverlap = targetObjects.filter((obj: string) => fileObjects.includes(obj)).length;
        if (objectOverlap > 0) {
          score += (objectOverlap / Math.max(targetObjects.length, fileObjects.length)) * 0.3;
          reasons.push('similar objects');
        }

        // Tag similarity
        const targetTags = targetFile.tags || [];
        const fileTags = file.tags || [];
        const tagOverlap = targetTags.filter((tag: string) => fileTags.includes(tag)).length;
        if (tagOverlap > 0) {
          score += (tagOverlap / Math.max(targetTags.length, fileTags.length)) * 0.2;
          reasons.push('similar tags');
        }

        // File type similarity
        if (targetFile.type === file.type) {
          score += 0.1;
          reasons.push('same type');
        }

        // Time proximity (uploaded around the same time)
        const timeDiff = Math.abs(new Date(targetFile.uploadedAt).getTime() - new Date(file.uploadedAt).getTime());
        const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
        if (daysDiff < 7) {
          score += 0.1;
          reasons.push('uploaded recently');
        }

        return {
          id: file.id,
          score: Math.min(score, 1), // Cap at 1.0
          reason: reasons.join(', '),
          file
        };
      })
      .filter(item => item.score > 0.1) // Only show items with meaningful similarity
      .sort((a, b) => b.score - a.score)
      .slice(0, 12); // Top 12 recommendations

    return NextResponse.json({ recommendations });

  } catch (error) {
    console.error('Recommendations API error:', error);
    return NextResponse.json(
      { error: 'Recommendations failed' },
      { status: 500 }
    );
  }
}
