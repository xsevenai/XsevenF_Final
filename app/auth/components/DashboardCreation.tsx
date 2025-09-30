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
    <div className="h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors duration-300 overflow-hidden flex flex-col">
      {/* Header with Logo and Back Button */}
      <div className="flex items-center justify-between p-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8">
            <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="mask0" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
                <rect width="100" height="100" fill="#D9D9D9"/>
              </mask>
              <g mask="url(#mask0)">
                <path d="M199.939 7.77539C199.979 8.80162 200 9.83244 200 10.8672C200 60.0925 155.228 99.998 99.9998 99.998C76.1256 99.998 54.2058 92.54 37.0116 80.0967L56.3123 65.6543C68.6382 73.4766 83.7162 78.0771 99.9998 78.0771C141.645 78.0771 175.406 47.9874 175.407 10.8691H199.939V7.77539ZM24.6014 11.8418C24.7614 21.8758 27.389 31.3777 31.9666 39.8877L12.6707 54.3232C4.60097 41.4676 0.000196561 26.6472 -0.000152588 10.8691V0H24.5936V10.8691L24.6014 11.8418Z" fill="#E3D7D7"/>
                <path d="M99.9998 0.00012207V25.1818L-0.000183105 100L-15.6848 83.3468L66.6639 21.7394H-0.000183105V21.7384H32.1727C31.4657 18.2104 31.0975 14.5775 31.0975 10.8683V0.00012207H99.9998Z" fill="#C1FD3A"/>
              </g>
            </svg>
          </div>
          <span className="text-gray-900 dark:text-white text-xl font-semibold">XsevenAI</span>
        </div>
        
       
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className={`transition-all duration-700 transform ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          {/* Centered Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Select the dashboard type that fits your business needs
            </p>
          </div>

          {/* Dashboard Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-items-center relative">
            <button
              onClick={() => handleDashboardSelect('xsevenai')}
              className={`group relative w-80 h-96 rounded-2xl border-2 transition-all duration-300 ${
                selectedDashboardType === 'xsevenai' 
                  ? 'border-blue-500 shadow-xl scale-105' 
                  : 'border-gray-300 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-700 hover:scale-102'
              } bg-white dark:bg-gray-900 overflow-hidden text-left`}
            >
              <div className="absolute inset-0 p-6 flex flex-col">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">XSevenAI Dashboard</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">AI-powered analytics & insights</p>
                  </div>
                </div>

                {/* Features */}
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Features</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-900 dark:text-white">AI Analytics</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-900 dark:text-white">Smart Insights</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-900 dark:text-white">Automation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-900 dark:text-white">Real-time Data</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-900 dark:text-white">Custom Reports</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-900 dark:text-white">Predictive Analytics</span>
                    </div>
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleDashboardSelect('integration')}
              className={`group relative w-80 h-96 rounded-2xl border-2 transition-all duration-300 ${
                selectedDashboardType === 'integration' 
                  ? 'border-blue-500 shadow-xl scale-105' 
                  : 'border-gray-300 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-700 hover:scale-102'
              } bg-white dark:bg-gray-900 overflow-hidden text-left`}
            >
              <div className="absolute inset-0 p-6 flex flex-col">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Dashboard Integration</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Connect with existing tools</p>
                  </div>
                </div>

                {/* Features */}
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Features</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-900 dark:text-white">API Integrations</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-900 dark:text-white">Third-party Tools</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-900 dark:text-white">Data Sync</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-900 dark:text-white">Custom Webhooks</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-900 dark:text-white">Multi-platform</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-900 dark:text-white">Secure Transfer</span>
                    </div>
                  </div>
                </div>
              </div>
            </button>

            {/* Back Button positioned below XSevenAI Dashboard card */}
            <div className="sm:col-start-1 sm:row-start-2 col-span-1">
              <button
                onClick={onBack}
                className="w-fit h-fit px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-700 bg-white dark:bg-transparent text-sm mt-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center gap-2 pb-6 flex-shrink-0">
        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="w-2 h-2 rounded-full bg-gray-900 dark:bg-white"></div>
      </div>
    </div>
  )
}