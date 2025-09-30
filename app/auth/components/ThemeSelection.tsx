import React from "react"

interface ThemeSelectionProps {
  selectedTheme: string | null
  isLoaded: boolean
  onThemeSelect: (theme: string) => void
}

export function ThemeSelection({ selectedTheme, isLoaded, onThemeSelect }: ThemeSelectionProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      <div className={`transition-all duration-700 transform ${
        isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}>
        <div className="w-full max-w-2xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Choose your style
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <button
              onClick={() => onThemeSelect('light')}
              className={`group relative w-64 h-72 rounded-3xl border-2 transition-all duration-300 ${
                selectedTheme === 'light' 
                  ? 'border-blue-500 shadow-xl scale-105' 
                  : 'border-gray-300 hover:border-gray-400 hover:scale-102'
              } bg-white overflow-hidden`}
            >
              <div className="absolute inset-0 p-8 flex flex-col">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-3 h-3 rounded-full bg-gray-800"></div>
                    <div className="flex gap-2">
                      <div className="w-16 h-1.5 bg-gray-300 rounded"></div>
                      <div className="w-8 h-8 bg-gray-800 rounded-lg"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mt-8">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gray-200 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-12"></div>
                        <div className="h-2 bg-gray-100 rounded w-32"></div>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded w-full"></div>
                    <div className="h-2 bg-gray-100 rounded w-3/4"></div>
                  </div>
                </div>
                
                <div className="text-center mt-6">
                  <span className="text-xl font-semibold text-gray-900">Light</span>
                </div>
              </div>
            </button>

            <button
              onClick={() => onThemeSelect('dark')}
              className={`group relative w-64 h-72 rounded-3xl border-2 transition-all duration-300 ${
                selectedTheme === 'dark' 
                  ? 'border-blue-500 shadow-xl scale-105' 
                  : 'border-gray-700 hover:border-gray-600 hover:scale-102'
              } bg-gray-900 overflow-hidden`}
            >
              <div className="absolute inset-0 p-8 flex flex-col">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-3 h-3 rounded-full bg-white"></div>
                    <div className="flex gap-2">
                      <div className="w-16 h-1.5 bg-gray-700 rounded"></div>
                      <div className="w-8 h-8 bg-white rounded-lg"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mt-8">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gray-800 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-800 rounded w-12"></div>
                        <div className="h-2 bg-gray-700 rounded w-32"></div>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-700 rounded w-full"></div>
                    <div className="h-2 bg-gray-700 rounded w-3/4"></div>
                  </div>
                </div>
                
                <div className="text-center mt-6">
                  <span className="text-xl font-semibold text-white">Dark</span>
                </div>
              </div>
            </button>
          </div>

          <div className="flex justify-center gap-2 mt-12">
            <div className="w-2 h-2 rounded-full bg-gray-900 dark:bg-white"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
    </div>
  )
}