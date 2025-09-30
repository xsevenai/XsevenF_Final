import React, { useState } from "react"
import { ChevronLeft, CheckCircle, Zap, Settings } from "lucide-react"

interface BusinessData {
  category: any
  formData: any
  plan: any
  numberSelection: any
}

interface DashboardCreationProps {
  businessData: BusinessData
  loading: boolean
  isLoaded: boolean
  onBack: () => void
  onComplete: (dashboardData: any) => void
}

export default function DashboardCreation({ businessData, loading, isLoaded, onBack, onComplete }: DashboardCreationProps) {
  const [selectedDashboardType, setSelectedDashboardType] = useState<string | null>(null)

  const handleDashboardSelect = (type: string) => {
    setSelectedDashboardType(type)
    
    setTimeout(() => {
      const dashboardData = {
        type: type,
        businessName: businessData.formData?.businessName || 'My Business',
        createdAt: new Date().toISOString()
      }
      
      onComplete(dashboardData)
    }, 500)
  }

  return (
    <div className={`transition-all duration-700 transform ${
      isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
    }`}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Choose Your Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Select the dashboard type that fits your business needs
          </p>
        </div>
      </div>

      {/* Dashboard Options */}
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
        <button
          onClick={() => handleDashboardSelect('xsevenai')}
          className={`group relative w-64 h-72 rounded-3xl border-2 transition-all duration-300 ${
            selectedDashboardType === 'xsevenai' 
              ? 'border-blue-500 shadow-xl scale-105' 
              : 'border-gray-300 hover:border-gray-400 hover:scale-102'
          } bg-white dark:bg-gray-900 overflow-hidden`}
        >
          <div className="absolute inset-0 p-8 flex flex-col">
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <div className="flex gap-2">
                  <div className="w-16 h-1.5 bg-blue-200 rounded"></div>
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mt-8">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-blue-100 rounded w-12"></div>
                    <div className="h-2 bg-blue-50 rounded w-32"></div>
                  </div>
                </div>
                <div className="h-2 bg-blue-50 rounded w-full"></div>
                <div className="h-2 bg-blue-50 rounded w-3/4"></div>
              </div>
            </div>
            
            <div className="text-center mt-6">
              <span className="text-xl font-semibold text-gray-900 dark:text-white">XSevenAI Dashboard</span>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                AI-powered analytics & insights
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => handleDashboardSelect('integration')}
          className={`group relative w-64 h-72 rounded-3xl border-2 transition-all duration-300 ${
            selectedDashboardType === 'integration' 
              ? 'border-blue-500 shadow-xl scale-105' 
              : 'border-gray-300 hover:border-gray-400 hover:scale-102'
          } bg-white dark:bg-gray-900 overflow-hidden`}
        >
          <div className="absolute inset-0 p-8 flex flex-col">
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="flex gap-2">
                  <div className="w-16 h-1.5 bg-green-200 rounded"></div>
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <Settings className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mt-8">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-green-100 rounded w-12"></div>
                    <div className="h-2 bg-green-50 rounded w-32"></div>
                  </div>
                </div>
                <div className="h-2 bg-green-50 rounded w-full"></div>
                <div className="h-2 bg-green-50 rounded w-3/4"></div>
              </div>
            </div>
            
            <div className="text-center mt-6">
              <span className="text-xl font-semibold text-gray-900 dark:text-white">Dashboard Integration</span>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Connect with existing tools
              </p>
            </div>
          </div>
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-12">
        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
        <div className="w-2 h-2 rounded-full bg-gray-900 dark:bg-white"></div>
      </div>
    </div>
  )
}