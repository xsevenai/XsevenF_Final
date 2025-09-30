"use client"

import React from "react"
import { ChevronLeft } from "lucide-react"

import { BusinessCategory } from "@/lib/types"

const businessCategories = [
  {
    id: "restaurants",
    name: "Restaurants & Cafes"
  },
  {
    id: "beauty",
    name: "Beauty Salons"
  },
  {
    id: "auto",
    name: "Auto Repair"
  },
  {
    id: "medical",
    name: "Medical Clinics"
  },
  {
    id: "retail",
    name: "Retail Stores"
  },
  {
    id: "fitness",
    name: "Fitness & Gyms"
  },
  {
    id: "education",
    name: "Education & Training"
  },
  {
    id: "consulting",
    name: "Consulting Services"
  }
]

interface CategorySelectionProps {
  selectedCategory: BusinessCategory | null
  onCategorySelect: (category: BusinessCategory) => void
  loading: boolean
  isLoaded: boolean
  onBack?: () => void
}

export default function CategorySelection({ 
  selectedCategory, 
  onCategorySelect, 
  loading, 
  isLoaded,
  onBack
}: CategorySelectionProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors duration-300">
      {/* Header with Logo */}
      <div className="flex items-center p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10">
            <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="mask0" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
                <rect width="100" height="100" fill="#D9D9D9"/>
              </mask>
              <g mask="url(#mask0)">
                <path d="M199.939 7.77539C199.979 8.80162 200 9.83244 200 10.8672C200 60.0925 155.228 99.998 99.9998 99.998C76.1256 99.998 54.2058 92.54 37.0116 80.0967L56.3123 65.6543C68.6382 73.4766 83.7162 78.0771 99.9998 78.0771C141.645 78.0771 175.406 47.9874 175.407 10.8691H199.939V7.77539ZM24.6014 11.8418C24.7614 21.8758 27.389 31.3777 31.9666 39.8877L12.6707 54.3232C4.60097 41.4676 0.000196561 26.6472 -0.000152588 10.8691V0H24.5936V10.8691L24.6014 11.8418Z" fill="#E3D7D7"/>
                <path d="M99.9998 0.00012207V25.1818L-0.000183105 100L-15.6848 83.3468L66.6639 21.7394H-0.000183105V21.7384H32.1727C31.4657 18.2104 31.0975 14.5775 31.0975 10.8683V0.00012207H99.9998Z" fill="#C1FD3A"/>
              </g>
            </svg>
          </div>
          <span className="text-gray-900 dark:text-white text-2xl font-semibold">XsevenAI</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-6">
        <div className="text-center mb-12">
          <h1 className={`text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            Choose Your Business Type
          </h1>
          <p className={`text-lg text-gray-600 dark:text-gray-400 transform transition-all duration-1000 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            Select the category that best describes your business
          </p>
        </div>

        {/* Business Categories Grid with Back Button */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full relative">
          {businessCategories.map((category, index) => {
            const isSelected = selectedCategory?.id === category.id
            
            return (
              <button
                key={category.id}
                className={`
                  ${isSelected 
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-black border-gray-900 dark:border-white' 
                    : 'bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 border border-gray-300 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-700'
                  }
                  rounded-xl 
                  p-6
                  cursor-pointer 
                  transition-all 
                  duration-300
                  text-left
                  h-20
                  flex
                  items-center
                  justify-center
                  transform 
                  hover:scale-[1.02]
                  active:scale-[0.98]
                  ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}
                `}
                style={{
                  transitionDelay: `${400 + index * 100}ms`
                }}
                onClick={() => !loading && onCategorySelect(category)}
              >
                <h3 className={`font-medium text-center transition-colors ${
                  isSelected 
                    ? 'text-white dark:text-black' 
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {category.name}
                </h3>
              </button>
            )
          })}

          {/* Back Button positioned below Retail Stores (index 4, position 5) */}
          <div className="md:col-start-1 md:row-start-3 col-span-1">
            <button
              onClick={onBack}
              className="w-fit h-fit px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-700 bg-white dark:bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex justify-center gap-2">
        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="w-2 h-2 rounded-full bg-gray-900 dark:bg-white"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
      </div>
    </div>
  )
}