"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, ChevronDown, Moon, Sun } from "lucide-react"

export default function ReallAiHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Navigation Header */}
      <header className={`w-full border-b ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'} transform transition-all duration-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className={`flex items-center transform transition-all duration-1000 delay-200 ease-out ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
              <div className="w-6 h-6 mr-3 relative">
                {/* Sunburst icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6">
                    {/* Outer rays */}
                    <g stroke="#ff6b35" strokeWidth="1.5" fill="none">
                      <line x1="12" y1="2" x2="12" y2="4" />
                      <line x1="12" y1="20" x2="12" y2="22" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="2" y1="12" x2="4" y2="12" />
                      <line x1="20" y1="12" x2="22" y2="12" />
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </g>
                    {/* Center circle */}
                    <circle cx="12" cy="12" r="3" fill="#ff6b35" />
                    <circle cx="12" cy="12" r="1.5" fill="white" />
                  </svg>
                </div>
              </div>
              <span className={`font-medium text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>hello@reall.ai</span>
            </div>

            {/* Desktop Navigation */}
            <div className={`hidden md:flex items-center space-x-8 transform transition-all duration-1000 delay-300 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
              <div className={`flex items-center space-x-1 transition-colors cursor-pointer ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                <span className="text-sm font-medium">Products</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              <a href="#" className={`transition-colors text-sm font-medium ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                Customer Stories
              </a>
              <a href="#" className={`transition-colors text-sm font-medium ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                Resources
              </a>
              <a href="#" className={`transition-colors text-sm font-medium ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                Pricing
              </a>
            </div>

            {/* Desktop Action Buttons */}
            <div className={`hidden md:flex items-center space-x-3 transform transition-all duration-1000 delay-400 ease-out ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
              {/* Dark Mode Toggle - Added to the left of Book A Demo */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className={`rounded-full ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              <Button 
                variant="ghost" 
                className={`text-sm font-medium px-4 py-2 ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
              >
                Book A Demo
              </Button>
              <Button className={`text-sm font-medium px-4 py-2 rounded-lg ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}>
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              size="icon"
              variant="ghost"
              className={`md:hidden ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transform transition-all duration-1000 delay-400 ease-out ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className={`md:hidden mt-4 pb-4 border-t pt-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex flex-col space-y-4">
                <div className={`flex items-center space-x-1 py-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span className="text-sm font-medium">Products</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
                <a href="#" className={`py-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Customer Stories</a>
                <a href="#" className={`py-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Resources</a>
                <a href="#" className={`py-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Pricing</a>
                
                {/* Dark Mode Toggle for Mobile */}
                <div className="flex items-center py-2">
                  <Button
                    variant="ghost"
                    className={`text-sm font-medium justify-start pl-0 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                    onClick={toggleDarkMode}
                  >
                    {isDarkMode ? (
                      <>
                        <Sun className="h-5 w-5 mr-2" />
                        Light Mode
                      </>
                    ) : (
                      <>
                        <Moon className="h-5 w-5 mr-2" />
                        Dark Mode
                      </>
                    )}
                  </Button>
                </div>
                
                <div className={`pt-4 border-t space-y-3 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <Button variant="ghost" className={`w-full text-sm font-medium justify-start ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600'}`}>
                    Book A Demo
                  </Button>
                  <Button className={`w-full text-sm font-medium ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}>
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className={`py-12 md:py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          {/* Main Headline with cascading animation */}
          <div className="overflow-hidden mb-6">
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'} transform transition-all duration-1200 delay-500 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
              AI-Driven Conversion<br />
              <span className={`transform transition-all duration-1200 delay-700 ease-out inline-block ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                Growth Right Away
              </span>
            </h1>
          </div>
          
          {/* Subtitle with fade-in from bottom */}
          <div className="overflow-hidden mb-8">
            <p className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transform transition-all duration-1000 delay-900 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              From concept to conversion — manage thousands of successful<br />
              influencer ads seamlessly.
            </p>
          </div>
          
          {/* Call-to-action buttons with slide-in animation */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 transform transition-all duration-1000 delay-1100 ease-out ${isLoaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}`}>
            <button className={`px-8 py-3 rounded-full font-medium text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}>
              Download Free App
            </button>
            <button className={`px-8 py-3 rounded-full font-medium text-sm border transition-all duration-300 hover:scale-105 hover:shadow-lg ${isDarkMode ? 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700' : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'}`}>
              Get Started Free
            </button>
          </div>
        </div>
      </section>

      {/* Laptop Image Section */}
      <section className={`py-12 md:py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative">
            {/* Laptop Image */}
            <div className={`relative mx-auto max-w-3xl transform transition-all duration-1500 delay-1300 ease-out ${isLoaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'}`}>
              <img 
                src="./laptop7.png" 
                alt="Laptop" 
                className="w-full h-auto"
                onError={(e) => {
                  console.log('Image failed to load');
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Built for Your Industry Section */}
      <section className={`py-12 md:py-20 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Title with dramatic entrance */}
          <div className="overflow-hidden mb-8 md:mb-12">
            <h2 className={`text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center ${isDarkMode ? 'bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent' : 'bg-gradient-to-r from-yellow-500 to-pink-500 bg-clip-text text-transparent'} transform transition-all duration-1200 delay-1500 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
              Built for Your Industry
            </h2>
          </div>
          
          {/* Section Description */}
          <div className="text-center mb-12 md:mb-16 overflow-hidden">
            <p className={`text-lg md:text-xl xl:text-2xl mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transform transition-all duration-1000 delay-1700 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              Discover how we help you maximize revenue and optimize operations efficiently.
            </p>
          </div>
          
          {/* Industry Cards with staggered animation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-8 xl:gap-12">
            {/* Card 1 */}
            <div className={`p-6 rounded-2xl transition-all duration-300 hover:scale-105 group ${isDarkMode ? 'bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700/50' : 'bg-white/15 backdrop-blur-md border-white/20 hover:bg-white/20'} shadow-lg transform transition-all duration-800 delay-1900 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 transition-colors ${isDarkMode ? 'bg-yellow-500/20 group-hover:bg-yellow-500/30' : 'bg-yellow-400/20 group-hover:bg-yellow-400/30'}`}>
                  <svg className={`h-6 w-6 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Restaurants & Cafes</h3>
              </div>
              <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Turn tables faster with AI QR ordering and instant reservations
              </p>
            </div>

            {/* Card 2 */}
            <div className={`p-6 rounded-2xl transition-all duration-300 hover:scale-105 group ${isDarkMode ? 'bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700/50' : 'bg-white/15 backdrop-blur-md border-white/20 hover:bg-white/20'} shadow-lg transform transition-all duration-800 delay-2000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 transition-colors ${isDarkMode ? 'bg-pink-500/20 group-hover:bg-pink-500/30' : 'bg-pink-400/20 group-hover:bg-pink-400/30'}`}>
                  <svg className={`h-6 w-6 ${isDarkMode ? 'text-pink-400' : 'text-pink-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Beauty Salons</h3>
              </div>
              <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Fill every appointment slot with smart booking and deposit collection
              </p>
            </div>

            {/* Card 3 */}
            <div className={`p-6 rounded-2xl transition-all duration-300 hover:scale-105 group ${isDarkMode ? 'bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700/50' : 'bg-white/15 backdrop-blur-md border-white/20 hover:bg-white/20'} shadow-lg transform transition-all duration-800 delay-2100 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 transition-colors ${isDarkMode ? 'bg-yellow-500/20 group-hover:bg-yellow-500/30' : 'bg-yellow-400/20 group-hover:bg-yellow-400/30'}`}>
                  <svg className={`h-6 w-6 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Auto Repair</h3>
              </div>
              <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Keep bays busy while AI handles customer questions during repairs
              </p>
            </div>

            {/* Card 4 */}
            <div className={`p-6 rounded-2xl transition-all duration-300 hover:scale-105 group ${isDarkMode ? 'bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700/50' : 'bg-white/15 backdrop-blur-md border-white/20 hover:bg-white/20'} shadow-lg transform transition-all duration-800 delay-2200 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 transition-colors ${isDarkMode ? 'bg-pink-500/20 group-hover:bg-pink-500/30' : 'bg-pink-400/20 group-hover:bg-pink-400/30'}`}>
                  <svg className={`h-6 w-6 ${isDarkMode ? 'text-pink-400' : 'text-pink-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Medical Clinics</h3>
              </div>
              <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Reduce phone calls by 70% with intelligent appointment scheduling
              </p>
            </div>

            {/* Card 5 */}
            <div className={`p-6 rounded-2xl transition-all duration-300 hover:scale-105 group xl:col-span-1 md:col-span-2 lg:col-span-1 ${isDarkMode ? 'bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700/50' : 'bg-white/15 backdrop-blur-md border-white/20 hover:bg-white/20'} shadow-lg transform transition-all duration-800 delay-2300 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 transition-colors ${isDarkMode ? 'bg-yellow-500/20 group-hover:bg-yellow-500/30' : 'bg-yellow-400/20 group-hover:bg-yellow-400/30'}`}>
                  <svg className={`h-6 w-6 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Local Services</h3>
              </div>
              <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Coordinate mobile teams and recurring customers automatically
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Empty content area for rest of page */}
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        {/* Remaining content area left intentionally blank */}
      </div>
    </div>
  )
}