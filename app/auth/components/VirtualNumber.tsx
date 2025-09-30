"use client"

import React, { useState } from "react"
import { 
  Phone, 
  CheckCircle,
  ArrowRight,
  Search,
  Globe
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
    <div className="h-screen bg-[#0a0a0a] flex items-center justify-center px-6 overflow-hidden">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            Choose Your Business Number
          </h1>
          <p className="text-sm text-gray-400">
            Select a virtual number or use your existing one
          </p>
        </div>

        {/* Selection Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Virtual Number Option */}
          <div
            onClick={() => handleCustomNumberSelect()}
            className={`cursor-pointer border rounded-lg p-5 transition-all duration-300 hover:scale-[1.02] ${
              selectionType === 'custom'
                ? 'border-white bg-white/5'
                : 'border-gray-700 hover:border-gray-500'
            }`}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Phone className="h-5 w-5 text-orange-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-white mb-1">
                  Use My Number
                </h3>
                <p className="text-xs text-gray-400">
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
                  className="w-full px-4 py-2.5 bg-transparent border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors text-sm"
                />
              </div>
            )}
          </div>

          {/* Virtual Number Option */}
          <div
            onClick={() => setSelectionType('virtual')}
            className={`cursor-pointer border rounded-lg p-5 transition-all duration-300 hover:scale-[1.02] ${
              selectionType === 'virtual'
                ? 'border-white bg-white/5'
                : 'border-gray-700 hover:border-gray-500'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Globe className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-white mb-1">
                  Get Virtual Number
                </h3>
                <p className="text-xs text-gray-400">
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
                className="w-full pl-10 pr-4 py-2.5 bg-transparent border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors text-sm"
              />
            </div>

            {/* Numbers Grid */}
            <div className="max-h-64 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {filteredNumbers.map((num) => (
                <div
                  key={num.id}
                  onClick={() => handleVirtualNumberSelect(num.number)}
                  className={`cursor-pointer border rounded-lg p-4 transition-all duration-200 ${
                    selectedNumber === num.number
                      ? 'border-white bg-white/5'
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10">
                        <Phone className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {num.number}
                        </p>
                        <p className="text-xs text-gray-400">
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
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
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
        <div className="flex gap-3">
          <button
            onClick={onBack}
            disabled={loading}
            className="px-6 py-2.5 text-white text-sm font-medium rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <button
            onClick={handleContinue}
            disabled={loading || !isValid}
            className="flex-1 px-6 py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? 'Processing...' : 'Continue'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mt-8">
          <div className="w-2 h-2 rounded-full bg-gray-700"></div>
          <div className="w-2 h-2 rounded-full bg-gray-700"></div>
          <div className="w-2 h-2 rounded-full bg-gray-700"></div>
          <div className="w-2 h-2 rounded-full bg-gray-700"></div>
          <div className="w-2 h-2 rounded-full bg-white"></div>
          <div className="w-2 h-2 rounded-full bg-gray-700"></div>
          <div className="w-2 h-2 rounded-full bg-gray-700"></div>
          <div className="w-2 h-2 rounded-full bg-gray-700"></div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4b5563;
        }
      `}</style>
    </div>
  )
}