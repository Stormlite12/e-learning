import React from "react";
import { Sparkles, BookOpen, TrendingUp, Brain, Youtube, Zap } from "lucide-react";

function WelcomeBanner(){
    return (
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-8 mb-8 shadow-xl">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
            
            {/* Content */}
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                        <Brain className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="font-bold text-3xl md:text-4xl text-white"> 
                        Welcome to Edu-Care
                    </h1>
                </div>
                
                <p className="text-blue-100 text-lg mb-6 max-w-2xl">
                    Embark on your learning journey with AI-powered courses and curated video content designed to help you grow and succeed.
                </p>
                
                {/* Stats or features */}
                <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2 text-white/90">
                        <BookOpen className="w-5 h-5" />
                        <span className="text-sm font-medium">AI-Generated Content</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/90">
                        <Youtube className="w-5 h-5" />
                        <span className="text-sm font-medium">Curated Videos</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/90">
                        <Zap className="w-5 h-5" />
                        <span className="text-sm font-medium">Smart Learning</span>
                    </div>
                </div>
            </div>
            
            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent pointer-events-none"></div>
        </div>
    )
}

export default WelcomeBanner