import { Button } from "../../components/ui/button";
import { Sparkles, Upload, Brain, Images, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-green-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                Glow Worm Studio
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-white hover:text-green-400">
                Features
              </Button>
              <Button variant="ghost" className="text-white hover:text-green-400">
                Pricing
              </Button>
              <Button variant="glow">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Illuminate
              </span>
              <br />
              <span className="text-white">Your Media</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              AI-powered media intelligence that transforms how you create, discover, and interact with your content.
              Upload your content and watch it come alive with intelligent categorization and stunning galleries.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" variant="glow" className="text-lg px-8 py-4">
              <Upload className="w-5 h-5 mr-2" />
              Start Creating
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-green-500/50 text-green-400 hover:bg-green-500/10">
              <Images className="w-5 h-5 mr-2" />
              View Gallery
            </Button>
          </div>

          {/* Feature Preview */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20 hover:border-green-500/40 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">AI Categorization</h3>
              <p className="text-gray-400">
                Intelligent tagging and organization powered by OpenAI and XAI for perfect content discovery.
              </p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Images className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Next Level Galleries</h3>
              <p className="text-gray-400">
                Immersive 3D experiences, constellation views, and interactive timelines that bring your media to life.
              </p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">AI Generation</h3>
              <p className="text-gray-400">
                Create stunning videos with Luma AI integration and enhance your content with cutting-edge AI tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-900/20 to-blue-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Media?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of creators who are already using AI to revolutionize their content workflow.
          </p>
          <Button size="lg" variant="glow" className="text-lg px-12 py-4">
            <Sparkles className="w-5 h-5 mr-2" />
            Get Started Free
          </Button>
        </div>
      </section>
    </div>
  );
}
