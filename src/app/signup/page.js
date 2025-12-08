'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signup } from '@/lib/auth';
import {
  ChevronDown,
  Sparkles,
  Users,
  Image as ImageIcon,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  ArrowRight
} from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(0);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const sections = [
    {
      id: 'hero',
      title: 'Professional Social Networking',
      subtitle: 'Connect, Share, and Grow Your Network',
      description: 'A modern platform designed for meaningful connections and professional growth. Share your insights, build your network, and engage with a global community.',
      gradient: 'from-blue-950 via-blue-900 to-blue-950',
      icon: Globe,
      stats: [
        { label: 'Active Users', value: '10K+' },
        { label: 'Posts Shared', value: '50K+' },
        { label: 'Countries', value: '120+' }
      ]
    },
    {
      id: 'features',
      title: 'Rich Media Sharing',
      subtitle: 'Express Yourself with Powerful Tools',
      description: 'Upload high-quality photos and videos. Share your professional portfolio, creative work, or personal moments with advanced media management.',
      gradient: 'from-blue-900 via-indigo-900 to-blue-900',
      icon: ImageIcon,
      features: [
        { icon: ImageIcon, title: 'HD Media', desc: 'Upload photos & videos' },
        { icon: Shield, title: 'Privacy Control', desc: 'Your data, your rules' },
        { icon: Zap, title: 'Fast Upload', desc: 'Lightning quick sharing' }
      ]
    },
    {
      id: 'community',
      title: 'Build Meaningful Connections',
      subtitle: 'Engage with Like-Minded Professionals',
      description: 'Join conversations that matter. Comment, like, and interact with content from professionals and creators worldwide.',
      gradient: 'from-indigo-900 via-blue-900 to-cyan-900',
      icon: Users,
      features: [
        { icon: Users, title: 'Global Network', desc: 'Connect worldwide' },
        { icon: TrendingUp, title: 'Trending Topics', desc: 'Stay updated' },
        { icon: Sparkles, title: 'Smart Feed', desc: 'Personalized content' }
      ]
    },
    {
      id: 'cta',
      title: 'Ready to Get Started?',
      subtitle: 'Join Our Growing Community',
      description: 'Create your free account and start connecting with professionals from around the world. No credit card required.',
      gradient: 'from-blue-900 via-indigo-900 to-blue-900',
      icon: Zap,
      cta: true
    }
  ];

  useEffect(() => {
    const handleScroll = (e) => {
      if (showAuthForm) return;

      const delta = e.deltaY;
      if (Math.abs(delta) > 10) {
        if (delta > 0 && currentSection < sections.length - 1) {
          setCurrentSection(prev => prev + 1);
        } else if (delta < 0 && currentSection > 0) {
          setCurrentSection(prev => prev - 1);
        }
      }
    };

    window.addEventListener('wheel', handleScroll, { passive: true });
    return () => window.removeEventListener('wheel', handleScroll);
  }, [currentSection, showAuthForm, sections.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signup(name, email, password);
      localStorage.setItem("token", res.token);
      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (showAuthForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <Sparkles className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Create Account
              </h2>
              <p className="text-gray-300">Join the community today</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-xl bg-red-500/20 p-4 border border-red-500/50">
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                  placeholder="Minimum 6 characters"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 transition-all"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>

              <div className="text-center pt-4">
                <p className="text-sm text-gray-300">
                  Already have an account?{' '}
                  <Link href="/login" className="font-semibold text-primary hover:text-accent transition-colors">
                    Sign In
                  </Link>
                </p>
              </div>
            </form>

            <button
              onClick={() => setShowAuthForm(false)}
              className="w-full mt-6 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentSectionData = sections[currentSection];
  const Icon = currentSectionData.icon;

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 relative">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary via-primary-light to-accent flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-primary to-accent rounded-2xl opacity-20 blur-md"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Nexus</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="px-6 py-2 text-white hover:text-gray-300 transition-colors font-medium"
            >
              Sign In
            </Link>
            <button
              onClick={() => setShowAuthForm(true)}
              className="px-6 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Progress Indicator */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3">
        {sections.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSection(index)}
            className={`w-2 h-2 rounded-full transition-all ${index === currentSection
              ? 'bg-primary h-8'
              : 'bg-white/30 hover:bg-white/50'
              }`}
          />
        ))}
      </div>

      {/* Main Content */}
      <div
        className="h-full transition-all duration-700 ease-in-out"
        style={{ transform: `translateY(-${currentSection * 100}vh)` }}
      >
        {sections.map((section, index) => (
          <div
            key={section.id}
            className="h-screen w-full flex items-center justify-center px-6 absolute top-0"
            style={{ transform: `translateY(${index * 100}vh)` }}
          >
            <div className="max-w-6xl w-full pt-20">
              {section.stats ? (
                // Hero Section
                <div className="text-center">
                  <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-gray-300 mb-6">
                    Professional Social Platform
                  </div>
                  <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
                    {section.title}
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                    {section.description}
                  </p>
                  <div className="flex flex-wrap justify-center gap-6 mb-12">
                    {section.stats.map((stat, i) => (
                      <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 min-w-[150px]">
                        <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-sm text-gray-400">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentSection(currentSection + 1)}
                    className="animate-bounce mt-8"
                  >
                    <ChevronDown className="w-10 h-10 text-white/50" />
                  </button>
                </div>
              ) : section.features ? (
                // Features Section
                <div>
                  <div className="text-center mb-16">
                    <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                      {section.title}
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                      {section.description}
                    </p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {section.features.map((feature, i) => {
                      const FeatureIcon = feature.icon;
                      return (
                        <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                            <FeatureIcon className="w-7 h-7 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                          <p className="text-gray-400">{feature.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-center">
                    <button
                      onClick={() => setCurrentSection(currentSection + 1)}
                      className="animate-bounce"
                    >
                      <ChevronDown className="w-10 h-10 text-white/50" />
                    </button>
                  </div>
                </div>
              ) : (
                // CTA Section
                <div className="text-center">
                  <h2 className="text-6xl md:text-7xl font-bold text-white mb-6">
                    {section.title}
                  </h2>
                  <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
                    {section.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => setShowAuthForm(true)}
                      className="px-10 py-4 bg-gradient-to-r from-primary to-accent text-white text-lg font-semibold rounded-xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all inline-flex items-center justify-center gap-2"
                    >
                      Create Free Account
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    <Link
                      href="/login"
                      className="px-10 py-4 bg-white/10 backdrop-blur-sm text-white text-lg font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all inline-flex items-center justify-center"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
