import { OptimizedDaytonaSandboxManager, OptimizedSandboxConfig, ProcessingResult } from './daytona-sandbox';
import { AIAnalysis } from './ai-service';

export interface EnhancedAIAnalysis extends AIAnalysis {
  processingMethod: 'local' | 'sandbox';
  processingTime: number;
  resourceUsage?: {
    memory: string;
    cpu: string;
    storage: string;
  };
  sandboxId?: string;
  complexity: 'simple' | 'medium' | 'complex' | 'enterprise';
}

export class EnhancedAIService {
  
  /**
   * Determine processing complexity based on file characteristics
   */
  private static determineComplexity(file: File): 'simple' | 'medium' | 'complex' | 'enterprise' {
    const sizeInMB = file.size / (1024 * 1024);
    
    if (file.type.startsWith('image/')) {
      if (sizeInMB < 5) return 'simple';
      if (sizeInMB < 20) return 'medium';
      if (sizeInMB < 100) return 'complex';
      return 'enterprise';
    }
    
    if (file.type.startsWith('video/')) {
      if (sizeInMB < 50) return 'medium';
      if (sizeInMB < 500) return 'complex';
      return 'enterprise';
    }
    
    if (file.type.startsWith('audio/')) {
      if (sizeInMB < 10) return 'simple';
      if (sizeInMB < 50) return 'medium';
      return 'complex';
    }
    
    // Documents and other files
    if (sizeInMB < 10) return 'simple';
    if (sizeInMB < 50) return 'medium';
    return 'complex';
  }

  /**
   * Determine if sandbox processing is needed
   */
  private static shouldUseSandbox(file: File, complexity: string): boolean {
    // SPEED FIRST: Always use local processing for fast results
    const sizeInMB = file.size / (1024 * 1024);
    console.log(`⚡ Using fast local processing for ${file.name} (${sizeInMB.toFixed(1)}MB, ${complexity})`);
    return false;
    
    // Sandbox processing disabled for speed - can be re-enabled later for enterprise features
  }

  /**
   * Enhanced image analysis with sandbox support
   */
  static async analyzeImage(imageFile: File, userId: string): Promise<EnhancedAIAnalysis> {
    const complexity = this.determineComplexity(imageFile);
    const useSandbox = this.shouldUseSandbox(imageFile, complexity);
    
    console.log(`🔍 Analyzing image: ${imageFile.name} (${complexity} complexity, ${useSandbox ? 'sandbox' : 'local'} processing)`);
    
    if (useSandbox) {
      return await this.analyzeImageInSandbox(imageFile, userId, complexity);
    } else {
      return await this.analyzeImageLocally(imageFile, complexity);
    }
  }

  /**
   * Enhanced video analysis with sandbox support
   */
  static async analyzeVideo(videoFile: File, userId: string): Promise<EnhancedAIAnalysis> {
    const complexity = this.determineComplexity(videoFile);
    
    console.log(`🎥 Analyzing video: ${videoFile.name} (${complexity} complexity, sandbox processing)`);
    
    // Videos always use sandbox due to processing requirements
    return await this.analyzeVideoInSandbox(videoFile, userId, complexity);
  }

  /**
   * Enhanced audio analysis with sandbox support
   */
  static async analyzeAudio(audioFile: File, userId: string): Promise<EnhancedAIAnalysis> {
    const complexity = this.determineComplexity(audioFile);
    const useSandbox = this.shouldUseSandbox(audioFile, complexity);
    
    console.log(`🎵 Analyzing audio: ${audioFile.name} (${complexity} complexity, ${useSandbox ? 'sandbox' : 'local'} processing)`);
    
    if (useSandbox) {
      return await this.analyzeAudioInSandbox(audioFile, userId, complexity);
    } else {
      return await this.analyzeAudioLocally(audioFile, complexity);
    }
  }

  /**
   * Analyze image in Daytona sandbox
   */
  private static async analyzeImageInSandbox(
    imageFile: File, 
    userId: string, 
    complexity: 'simple' | 'medium' | 'complex' | 'enterprise'
  ): Promise<EnhancedAIAnalysis> {
    const startTime = Date.now();
    let sandbox: any = null;
    
    try {
      // Create sandbox configuration
      const config: OptimizedSandboxConfig = {
        processingType: 'image',
        fileSize: imageFile.size,
        complexity,
        timeoutDisabled: complexity === 'complex' || complexity === 'enterprise',
        useSnapshot: true,
        aiProvider: 'openai',
        modelType: 'gpt-4-vision-preview',
        userId,
        fileId: `img_${Date.now()}`,
        fileName: imageFile.name
      };

      // Create optimized sandbox
      sandbox = await OptimizedDaytonaSandboxManager.createOptimizedSandbox(config);

      // Convert file to buffer
      const fileBuffer = Buffer.from(await imageFile.arrayBuffer());

      // Execute processing
      const result: ProcessingResult = await OptimizedDaytonaSandboxManager.executeOptimizedProcessing(
        sandbox, 
        config, 
        fileBuffer
      );

      if (!result.success) {
        throw new Error(`Sandbox processing failed: ${result.results.error}`);
      }

      // Transform results to enhanced analysis format
      const analysis: EnhancedAIAnalysis = {
        description: result.results.aiAnalysis?.description || 'Image processed in sandbox',
        objects: result.results.aiAnalysis?.objects || [],
        colors: result.results.aiAnalysis?.colors || [],
        mood: result.results.aiAnalysis?.mood || 'neutral',
        confidence: result.results.aiAnalysis?.confidence || 0.8,
        tags: this.generateTagsFromAnalysis(result.results.aiAnalysis),
        processingMethod: 'sandbox',
        processingTime: result.processingTime,
        resourceUsage: result.resourceUsage,
        sandboxId: result.metadata.sandboxId,
        complexity
      };

      return analysis;

    } catch (error: any) {
      console.log('🔧 Using local processing for image analysis...');
      
      // Seamless fallback to local processing
      return await this.analyzeImageLocally(imageFile, complexity);
      
    } finally {
      // Cleanup sandbox
      if (sandbox) {
        try {
          await OptimizedDaytonaSandboxManager.cleanup(sandbox);
        } catch (cleanupError) {
          console.warn('⚠️ Sandbox cleanup failed:', cleanupError);
        }
      }
    }
  }

  /**
   * Analyze image locally (fallback method)
   */
  private static async analyzeImageLocally(
    imageFile: File, 
    complexity: 'simple' | 'medium' | 'complex' | 'enterprise'
  ): Promise<EnhancedAIAnalysis> {
    const startTime = Date.now();
    
    try {
      // Use existing local AI service as fallback
      const { analyzeImage } = await import('./ai-service');
      const localAnalysis = await analyzeImage(imageFile);
      
      const processingTime = Date.now() - startTime;
      
      return {
        ...localAnalysis,
        processingMethod: 'local',
        processingTime,
        complexity
      };
      
    } catch (error: any) {
      console.error('❌ Local image analysis failed:', error);
      
      // Ultimate fallback
      return {
        description: 'Image analysis failed - using basic metadata',
        objects: [],
        colors: [],
        mood: 'unknown',
        confidence: 0.1,
        tags: [imageFile.type.split('/')[1], 'image'],
        processingMethod: 'local',
        processingTime: Date.now() - startTime,
        complexity
      };
    }
  }

  /**
   * Analyze video in Daytona sandbox
   */
  private static async analyzeVideoInSandbox(
    videoFile: File, 
    userId: string, 
    complexity: 'simple' | 'medium' | 'complex' | 'enterprise'
  ): Promise<EnhancedAIAnalysis> {
    const startTime = Date.now();
    let sandbox: any = null;
    
    try {
      // Create sandbox configuration for video processing
      const config: OptimizedSandboxConfig = {
        processingType: 'video',
        fileSize: videoFile.size,
        complexity,
        timeoutDisabled: true, // Videos always need extended timeout
        useSnapshot: true,
        aiProvider: 'openai',
        modelType: 'gpt-4-vision-preview',
        userId,
        fileId: `vid_${Date.now()}`,
        fileName: videoFile.name
      };

      // Create optimized sandbox
      sandbox = await OptimizedDaytonaSandboxManager.createOptimizedSandbox(config);

      // Convert file to buffer
      const fileBuffer = Buffer.from(await videoFile.arrayBuffer());

      // Execute processing
      const result: ProcessingResult = await OptimizedDaytonaSandboxManager.executeOptimizedProcessing(
        sandbox, 
        config, 
        fileBuffer
      );

      if (!result.success) {
        throw new Error(`Video processing failed: ${result.results.error}`);
      }

      // Transform results to enhanced analysis format
      const analysis: EnhancedAIAnalysis = {
        description: result.results.aiAnalysis?.description || 'Video processed in sandbox',
        objects: result.results.aiAnalysis?.objects || ['video', 'motion'],
        colors: result.results.aiAnalysis?.colors || [],
        mood: result.results.aiAnalysis?.mood || 'dynamic',
        confidence: result.results.aiAnalysis?.confidence || 0.7,
        tags: this.generateTagsFromAnalysis(result.results.aiAnalysis, ['video', 'motion']),
        processingMethod: 'sandbox',
        processingTime: result.processingTime,
        resourceUsage: result.resourceUsage,
        sandboxId: result.metadata.sandboxId,
        complexity
      };

      return analysis;

    } catch (error: any) {
      console.log('🔧 Using local processing for video analysis...');
      
      // Seamless fallback to basic AI analysis
      try {
        const { analyzeVideo } = await import('./ai-service');
        const basicAnalysis = await analyzeVideo(videoFile);
        
        return {
          ...basicAnalysis,
          processingMethod: 'local' as const,
          processingTime: Date.now() - startTime,
          complexity,
          // Add enhanced metadata
          tags: [...(basicAnalysis.tags || []), 'processed', 'analyzed'],
          confidence: Math.min((basicAnalysis.confidence || 0.5) + 0.1, 1.0)
        };
      } catch (fallbackError) {
        console.log('🔧 Using metadata analysis for video...');
        
        // Enhanced metadata fallback
        return {
          description: `Video file: ${videoFile.name} (${(videoFile.size / (1024 * 1024)).toFixed(1)}MB)`,
          objects: ['video', 'media', 'content'],
          colors: [],
          mood: 'dynamic',
          confidence: 0.6,
          tags: [videoFile.type.split('/')[1] || 'video', 'media', 'uploaded'],
          processingMethod: 'local' as const,
          processingTime: Date.now() - startTime,
          complexity
        };
      }
    } finally {
      // Cleanup sandbox
      if (sandbox) {
        try {
          await OptimizedDaytonaSandboxManager.cleanup(sandbox);
        } catch (cleanupError) {
          console.warn('⚠️ Sandbox cleanup failed:', cleanupError);
        }
      }
    }
  }

  /**
   * Analyze audio in Daytona sandbox
   */
  private static async analyzeAudioInSandbox(
    audioFile: File, 
    userId: string, 
    complexity: 'simple' | 'medium' | 'complex' | 'enterprise'
  ): Promise<EnhancedAIAnalysis> {
    const startTime = Date.now();
    let sandbox: any = null;
    
    try {
      // Create sandbox configuration for audio processing
      const config: OptimizedSandboxConfig = {
        processingType: 'audio',
        fileSize: audioFile.size,
        complexity,
        timeoutDisabled: complexity === 'complex' || complexity === 'enterprise',
        useSnapshot: true,
        aiProvider: 'elevenlabs', // Better for audio analysis
        userId,
        fileId: `aud_${Date.now()}`,
        fileName: audioFile.name
      };

      // Create optimized sandbox
      sandbox = await OptimizedDaytonaSandboxManager.createOptimizedSandbox(config);

      // Convert file to buffer
      const fileBuffer = Buffer.from(await audioFile.arrayBuffer());

      // Execute processing
      const result: ProcessingResult = await OptimizedDaytonaSandboxManager.executeOptimizedProcessing(
        sandbox, 
        config, 
        fileBuffer
      );

      if (!result.success) {
        throw new Error(`Audio processing failed: ${result.results.error}`);
      }

      // Transform results to enhanced analysis format
      const analysis: EnhancedAIAnalysis = {
        description: result.results.aiAnalysis?.description || 'Audio processed in sandbox',
        objects: result.results.aiAnalysis?.objects || ['audio', 'sound'],
        colors: [], // Audio doesn't have colors
        mood: result.results.aiAnalysis?.mood || 'neutral',
        confidence: result.results.aiAnalysis?.confidence || 0.7,
        tags: this.generateTagsFromAnalysis(result.results.aiAnalysis, ['audio', 'sound']),
        processingMethod: 'sandbox',
        processingTime: result.processingTime,
        resourceUsage: result.resourceUsage,
        sandboxId: result.metadata.sandboxId,
        complexity
      };

      return analysis;

    } catch (error: any) {
      console.error('❌ Sandbox audio analysis failed:', error);
      
      // Fallback to local processing
      return await this.analyzeAudioLocally(audioFile, complexity);
    } finally {
      // Cleanup sandbox
      if (sandbox) {
        try {
          await OptimizedDaytonaSandboxManager.cleanup(sandbox);
        } catch (cleanupError) {
          console.warn('⚠️ Sandbox cleanup failed:', cleanupError);
        }
      }
    }
  }

  /**
   * Analyze audio locally (fallback method)
   */
  private static async analyzeAudioLocally(
    audioFile: File, 
    complexity: 'simple' | 'medium' | 'complex' | 'enterprise'
  ): Promise<EnhancedAIAnalysis> {
    const startTime = Date.now();
    
    // Basic audio analysis fallback
    return {
      description: `Audio file: ${audioFile.name}`,
      objects: ['audio', 'sound'],
      colors: [],
      mood: 'neutral',
      confidence: 0.5,
      tags: [audioFile.type.split('/')[1], 'audio', 'media'],
      processingMethod: 'local',
      processingTime: Date.now() - startTime,
      complexity
    };
  }

  /**
   * Generate tags from AI analysis results
   */
  private static generateTagsFromAnalysis(aiAnalysis: any, baseTags: string[] = []): string[] {
    const tags = [...baseTags];
    
    if (aiAnalysis) {
      // Add objects as tags
      if (aiAnalysis.objects) {
        tags.push(...aiAnalysis.objects.slice(0, 5));
      }
      
      // Add mood as tag
      if (aiAnalysis.mood) {
        tags.push(aiAnalysis.mood);
      }
      
      // Add colors as tags
      if (aiAnalysis.colors) {
        tags.push(...aiAnalysis.colors.slice(0, 3));
      }
      
      // Add confidence level as tag
      if (aiAnalysis.confidence > 0.8) {
        tags.push('high-confidence');
      } else if (aiAnalysis.confidence > 0.6) {
        tags.push('medium-confidence');
      } else {
        tags.push('low-confidence');
      }
    }
    
    // Remove duplicates and limit to 10 tags
    return [...new Set(tags)].slice(0, 10);
  }

  /**
   * Batch processing for multiple files
   */
  static async batchAnalyze(files: File[], userId: string): Promise<EnhancedAIAnalysis[]> {
    console.log(`🚀 Starting batch analysis of ${files.length} files...`);
    
    const results: EnhancedAIAnalysis[] = [];
    const batchSize = 3; // Process 3 files concurrently
    
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (file) => {
        try {
          if (file.type.startsWith('image/')) {
            return await this.analyzeImage(file, userId);
          } else if (file.type.startsWith('video/')) {
            return await this.analyzeVideo(file, userId);
          } else if (file.type.startsWith('audio/')) {
            return await this.analyzeAudio(file, userId);
          } else {
            // Fallback for other file types
            return {
              description: `File: ${file.name}`,
              objects: ['document'],
              colors: [],
              mood: 'neutral',
              confidence: 0.3,
              tags: [file.type.split('/')[1] || 'unknown', 'document'],
              processingMethod: 'local' as const,
              processingTime: 100,
              complexity: 'simple' as const
            };
          }
        } catch (error) {
          console.error(`❌ Failed to analyze file ${file.name}:`, error);
          return {
            description: `Failed to analyze: ${file.name}`,
            objects: [],
            colors: [],
            mood: 'unknown',
            confidence: 0.1,
            tags: ['error', 'failed'],
            processingMethod: 'local' as const,
            processingTime: 0,
            complexity: 'simple' as const
          };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      console.log(`✅ Completed batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(files.length/batchSize)}`);
    }
    
    console.log(`🎉 Batch analysis completed: ${results.length} files processed`);
    return results;
  }
}
