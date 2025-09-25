import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AIAnalysis {
  description: string;
  objects: string[];
  colors: string[];
  mood: string;
  confidence: number;
  tags: string[];
}

export async function analyzeImage(imageFile: File): Promise<AIAnalysis> {
  try {
    // Convert file to base64
    const base64 = await fileToBase64(imageFile);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this image and provide a detailed analysis in JSON format with the following structure:
              {
                "description": "A detailed description of the image",
                "objects": ["list", "of", "main", "objects"],
                "colors": ["dominant", "colors"],
                "mood": "overall mood/emotion",
                "confidence": 0.95,
                "tags": ["relevant", "searchable", "tags"]
              }
              
              Focus on being accurate and helpful for media organization. Include specific details that would help someone find this image later.`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64}`
              }
            }
          ]
        }
      ],
      max_tokens: 500
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('No analysis received');

    // Parse the JSON response
    const analysis = JSON.parse(content);
    
    return {
      description: analysis.description || 'AI analysis completed',
      objects: analysis.objects || [],
      colors: analysis.colors || [],
      mood: analysis.mood || 'neutral',
      confidence: analysis.confidence || 0.8,
      tags: analysis.tags || []
    };

  } catch (error) {
    console.error('AI analysis failed:', error);
    
    // Fallback analysis
    return {
      description: 'Image uploaded successfully',
      objects: ['image'],
      colors: ['unknown'],
      mood: 'neutral',
      confidence: 0.5,
      tags: ['uploaded', 'unprocessed']
    };
  }
}

export async function analyzeVideo(videoFile: File): Promise<AIAnalysis> {
  // For now, return a basic analysis for videos
  // In the future, we could extract frames and analyze them
  return {
    description: `Video file: ${videoFile.name}`,
    objects: ['video', 'media'],
    colors: ['unknown'],
    mood: 'dynamic',
    confidence: 0.7,
    tags: ['video', 'media', 'uploaded']
  };
}

export async function generateTags(analysis: AIAnalysis): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert at generating searchable tags for media files. Generate 5-10 relevant, specific tags that would help someone find this content later."
        },
        {
          role: "user",
          content: `Generate tags for this media analysis:
          Description: ${analysis.description}
          Objects: ${analysis.objects.join(', ')}
          Colors: ${analysis.colors.join(', ')}
          Mood: ${analysis.mood}
          
          Return only a JSON array of tags: ["tag1", "tag2", "tag3"]`
        }
      ],
      max_tokens: 100
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return analysis.tags;

    const tags = JSON.parse(content);
    return Array.isArray(tags) ? tags : analysis.tags;

  } catch (error) {
    console.error('Tag generation failed:', error);
    return analysis.tags;
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
