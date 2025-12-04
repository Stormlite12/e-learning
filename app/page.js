'use client'

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Brain, Sparkles, BookOpen, Video, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="text-primary" size={32} />
            <span className="text-2xl font-bold">GenCourse</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/workspace">
              <Button variant="ghost" size="lg">Sign In</Button>
            </Link>
            <Link href="/workspace/explore">
              <Button size="lg">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-6 py-3 rounded-full text-base font-medium mb-8">
            <Sparkles size={20} />
            AI-Powered Learning Platform
          </div>
          
          <h1 className="text-6xl font-bold text-gray-900 mb-8 leading-tight">
            Learn Anything with <span className="text-primary">AI</span>
          </h1>
          
          <p className="text-2xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Generate personalized courses on any topic in seconds with AI-powered content
          </p>
          
          <div className="flex gap-6 justify-center mb-16">
            <Link href="/workspace">
              <Button size="lg" className="text-lg px-8 py-6">Create a Course</Button>
            </Link>
            <Link href="/workspace/explore">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">Browse Courses</Button>
            </Link>
          </div>

          {/* Hero Image */}
          <div className="relative max-w-4xl mx-auto mt-12">
            <div className="absolute -top-6 -left-6 w-full h-full rounded-2xl bg-primary/10"></div>
            <Image 
              src="/hero-image.jpg" 
              alt="AI-powered learning" 
              width={1000} 
              height={600} 
              className="rounded-2xl shadow-2xl relative z-10"
              priority
              onError={(e) => {
                e.target.src = "/learning.jpg"
                e.target.srcset = ""
              }}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose GenCourse?</h2>
            <p className="text-xl text-gray-600">
              Everything you need for AI-powered learning
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="text-blue-600" size={36} />
              </div>
              <h3 className="font-semibold text-2xl mb-4">AI-Generated</h3>
              <p className="text-gray-600 text-lg">
                Courses created by advanced AI technology in seconds
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Video className="text-red-600" size={36} />
              </div>
              <h3 className="font-semibold text-2xl mb-4">Video Learning</h3>
              <p className="text-gray-600 text-lg">
                Curated YouTube videos for each topic to enhance learning
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="text-yellow-600" size={36} />
              </div>
              <h3 className="font-semibold text-2xl mb-4">Quick & Easy</h3>
              <p className="text-gray-600 text-lg">
                Start learning in under 2 minutes with no hassle
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-5xl font-bold mb-6">Ready to start learning?</h2>
            <p className="text-xl text-gray-600 mb-10">
              Create your first AI-powered course today and unlock unlimited knowledge
            </p>
            <Link href="/workspace">
              <Button size="lg" className="gap-3 text-lg px-10 py-7">
                <BookOpen size={24} />
                Create Free Course
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-base text-gray-600">
            <div className="flex items-center gap-3 mb-6 md:mb-0">
              <Brain size={28} className="text-primary" />
              <span className="font-semibold text-xl">GenCourse</span>
            </div>
            <p className="text-lg">© 2025 GenCourse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}