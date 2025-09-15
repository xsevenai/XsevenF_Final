"use client"

import React from "react"
import { 
  Zap, 
  CheckCircle,
  Loader2
} from "lucide-react"

const dashboardSteps = [
  { name: "Initializing AI Core", progress: 15 },
  { name: "Setting up WhatsApp Integration", progress: 30 },
  { name: "Configuring Business Profile", progress: 50 },
  { name: "Training AI with Your Data", progress: 70 },
  { name: "Optimizing Response Templates", progress: 85 },
  { name: "Finalizing Setup", progress: 100 }
]

interface DashboardCreationProps {
  dashboardProgress: number
  isLoaded: boolean
}

export default function DashboardCreation({
  dashboardProgress,
  isLoaded
}: DashboardCreationProps) {
  return (
    <div className="max-w-md mx-auto text-center h-full flex flex-col justify-center">
      <div className="overflow-hidden mb-8">
        <div className={`transform transition-all duration-1000 delay-200 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <div className="w-32 h-32 mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-full border-8 border-gray-200 dark:border-gray-700"></div>
            <div 
              className="absolute inset-0 rounded-full border-8 border-transparent transition-all duration-1000 ease-out"
              style={{
                background: `conic-gradient(from 0deg, #3b82f6 ${dashboardProgress}%, transparent ${dashboardProgress}%)`,
                borderRadius: '50%'
              }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dashboardProgress}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Complete
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="overflow-hidden mb-4">
        <div className={`flex items-center justify-center transform transition-all duration-800 delay-400 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <Zap className="h-5 w-5 text-blue-500 mr-2 animate-pulse" />
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">Step 5 of 6</span>
        </div>
      </div>
      
      <div className="overflow-hidden mb-4">
        <h2 className={`text-3xl font-bold text-gray-900 dark:text-white transform transition-all duration-1200 delay-600 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
          Creating Your Dashboard
        </h2>
      </div>
      
      <div className="overflow-hidden mb-8">
        <p className={`text-lg text-gray-600 dark:text-gray-300 transform transition-all duration-1000 delay-800 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          Setting up your AI-powered business assistant...
        </p>
      </div>

      <div className="overflow-hidden mb-8">
        <div className={`bg-gray-50 dark:bg-gray-800 rounded-xl p-6 transition-all duration-1000 delay-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <div className="space-y-4">
            {dashboardSteps.map((step, index) => {
              const isActive = dashboardProgress >= step.progress
              const isCurrent = dashboardProgress < step.progress && (index === 0 || dashboardProgress >= dashboardSteps[index - 1]?.progress)
              
              return (
                <div 
                  key={index}
                  className={`flex items-center space-x-3 transition-all duration-500 ${
                    isActive ? 'text-green-600 dark:text-green-400' : 
                    isCurrent ? 'text-blue-600 dark:text-blue-400' : 
                    'text-gray-400 dark:text-gray-600'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {isActive ? (
                      <CheckCircle className="h-5 w-5 animate-pulse" />
                    ) : isCurrent ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-current"></div>
                    )}
                  </div>
                  <span className="text-sm font-medium">
                    {step.name}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}