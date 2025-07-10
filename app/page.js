'use client'

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight, Brain, Zap, Youtube, GraduationCap, CheckCircle, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation Bar */}
      <nav className="container mx-auto py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain size={30} className="text-primary" />
          <h1 className="text-2xl font-bold text-primary">Edu-Care</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/workspace" className="text-gray-600 hover:text-primary transition-colors">
            Sign In
          </Link>
          <Link href="/workspace/explore">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-16 pb-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles size={16} />
              AI-Powered Learning Platform
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Learn Smarter with <br />
            <span className="text-primary">AI-Generated Courses</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience personalized learning with AI-powered course content and curated YouTube videos. 
            Start your educational journey today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/workspace/explore">
              <Button size="lg" className="gap-2 px-8">
                Explore Courses <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/workspace">
              <Button size="lg" variant="outline" className="gap-2 px-8">
                Create Course <Brain size={16} />
              </Button>
            </Link>
          </div>

          {/* Hero Image */}
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute -top-4 -left-4 w-full h-full rounded-2xl bg-primary/10"></div>
            <Image 
              src="/hero-image.jpg" 
              alt="AI-powered learning" 
              width={800} 
              height={500} 
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
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Edu-Care?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform creates personalized learning experiences with cutting-edge technology
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Generated Content</h3>
              <p className="text-gray-600">
                Smart algorithms create personalized course content tailored to your learning style and pace.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Youtube className="text-red-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Curated Videos</h3>
              <p className="text-gray-600">
                Access carefully selected YouTube videos that complement your learning journey perfectly.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="bg-yellow-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="text-yellow-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Learning</h3>
              <p className="text-gray-600">
                Adaptive learning paths that evolve with your progress and optimize your educational outcomes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-3xl font-bold mb-2">1000+</h3>
              <p className="text-blue-100">AI-Generated Courses</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-2">50K+</h3>
              <p className="text-blue-100">Active Learners</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-2">95%</h3>
              <p className="text-blue-100">Success Rate</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-2">24/7</h3>
              <p className="text-blue-100">AI Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Learning?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              Join thousands of learners who are already experiencing the future of education with AI-powered courses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/workspace/explore">
                <Button size="lg" variant="secondary" className="px-8">
                  Start Learning Now
                </Button>
              </Link>
              <Link href="/workspace">
                <Button size="lg" variant="outline" className="px-8 text-white border-white hover:bg-white hover:text-primary">
                  Create Your Course
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Brain size={24} />
              <h3 className="text-xl font-bold">Edu-Care</h3>
            </div>
            
            <div className="flex items-center gap-6">
              <Link href="/workspace/explore" className="text-gray-400 hover:text-white">Courses</Link>
              <Link href="#" className="text-gray-400 hover:text-white">About</Link>
              <Link href="#" className="text-gray-400 hover:text-white">Contact</Link>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Edu-Care. Empowering minds with AI-powered education.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}