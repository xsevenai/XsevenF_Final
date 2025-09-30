"use client"

import React, { useState } from "react"
import { 
  Phone, 
  CheckCircle,
  ArrowRight,
  Search,
  Globe,
  ChevronLeft
} from "lucide-react"

interface VirtualNumberProps {
  loading: boolean
  isLoaded: boolean
  onBack: () => void
  onContinue: (selection: { type: 'virtual' | 'custom', number?: string, customNumber?: string }) => void
}

const virtualNumbers = [
  { id: "1", number: "+1 (555) 123-4567", country: "USA", location: "New York" },
  { id: "2", number: "+1 (555) 234-5678", country: "USA", location: "Los Angeles" },
  { id: "3", number: "+1 (555) 345-6789", country: "USA", location: "Chicago" },
  { id: "4", number: "+44 20 1234 5678", country: "UK", location: "London" },
  { id: "5", number: "+91 98765 43210", country: "India", location: "Mumbai" },
  { id: "6", number: "+61 2 1234 5678", country: "Australia", location: "Sydney" },
]

export default function VirtualNumber({
  loading,
  isLoaded,
  onBack,
  onContinue
}: VirtualNumberProps) {
  const [selectionType, setSelectionType] = useState<'virtual' | 'custom' | null>(null)
  const [selectedNumber, setSelectedNumber] = useState<string | null>(null)
  const [customNumber, setCustomNumber] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredNumbers = virtualNumbers.filter(num => 
    num.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    num.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    num.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleVirtualNumberSelect = (number: string) => {
    setSelectionType('virtual')
    setSelectedNumber(number)
    setCustomNumber("")
  }

  const handleCustomNumberSelect = () => {
    setSelectionType('custom')
    setSelectedNumber(null)
  }

  const handleContinue = () => {
    if (selectionType === 'virtual' && selectedNumber) {
      onContinue({ type: 'virtual', number: selectedNumber })
    } else if (selectionType === 'custom' && customNumber.trim()) {
      onContinue({ type: 'custom', customNumber: customNumber.trim() })
    }
  }

  const isValid = (selectionType === 'virtual' && selectedNumber) || 
                   (selectionType === 'custom' && customNumber.trim().length >= 10)

  return (
    <div className="h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors duration-300 overflow-hidden flex flex-col">
      {/* Header with Logo */}
      <div className="flex items-center p-4 flex-shrink-0">
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
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Choose Your Business Number
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Select a virtual number or use your existing one
            </p>
          </div>

          {/* Selection Type Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Custom Number Option */}
            <div
              onClick={() => handleCustomNumberSelect()}
              className={`cursor-pointer border-2 rounded-xl p-5 transition-all duration-300 hover:scale-[1.02] ${
                selectionType === 'custom'
                  ? 'border-gray-900 dark:border-white bg-gray-100 dark:bg-white/5'
                  : 'border-gray-300 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-700 bg-white dark:bg-transparent'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                    Use My Number
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Connect your existing business number
                  </p>
                </div>
              </div>
              {selectionType === 'custom' && (
                <div className="mt-4">
                  <input
                    type="tel"
                    value={customNumber}
                    onChange={(e) => setCustomNumber(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-2.5 bg-white dark:bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-gray-500 transition-colors text-sm"
                  />
                </div>
              )}
            </div>

            {/* Virtual Number Option */}
            <div
              onClick={() => setSelectionType('virtual')}
              className={`cursor-pointer border-2 rounded-xl p-5 transition-all duration-300 hover:scale-[1.02] ${
                selectionType === 'virtual'
                  ? 'border-gray-900 dark:border-white bg-gray-100 dark:bg-white/5'
                  : 'border-gray-300 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-700 bg-white dark:bg-transparent'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Globe className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                    Get Virtual Number
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Choose from available numbers worldwide
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Virtual Numbers List */}
          {selectionType === 'virtual' && (
            <div className="mb-6">
              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by country, location, or number..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-gray-500 transition-colors text-sm"
                />
              </div>

              {/* Numbers Grid */}
              <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {filteredNumbers.map((num) => (
                  <div
                    key={num.id}
                    onClick={() => handleVirtualNumberSelect(num.number)}
                    className={`cursor-pointer border-2 rounded-lg p-4 transition-all duration-200 ${
                      selectedNumber === num.number
                        ? 'border-gray-900 dark:border-white bg-gray-100 dark:bg-white/5'
                        : 'border-gray-300 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-700 bg-white dark:bg-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10">
                          <Phone className="h-4 w-4 text-gray-900 dark:text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {num.number}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {num.location}, {num.country}
                          </p>
                        </div>
                      </div>
                      {selectedNumber === num.number && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Info */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-500">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>SMS & Voice enabled</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Instant activation</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Change anytime</span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center gap-3">
            <button
              onClick={onBack}
              disabled={loading}
              className="w-fit h-fit px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-700 bg-white dark:bg-transparent disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={handleContinue}
              disabled={loading || !isValid}
              className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
            >
              {loading ? 'Processing...' : 'Continue'}
              <ArrowRight className="h-4 w-4" />
            </button>
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
        <div className="w-2 h-2 rounded-full bg-gray-900 dark:bg-white"></div>
                <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>

      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgb(156 163 175);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #374151;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgb(107 114 128);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4b5563;
        }
      `}</style>
    </div>
  )
}