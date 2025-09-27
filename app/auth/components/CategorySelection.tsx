"use client"

import React from "react"
import { 
  Sparkles
} from "lucide-react"
import { BusinessCategory } from "@/lib/types"

const businessCategories = [
  {
    id: "restaurants",
    name: "Restaurants & Cafes",
    description: "Restaurants, cafes, food delivery, catering services"
  },
  {
    id: "beauty",
    name: "Beauty Salons",
    description: "Hair salons, nail studios, spa services, beauty treatments"
  },
  {
    id: "auto",
    name: "Auto Repair",
    description: "Car repair shops, auto maintenance, tire services"
  },
  {
    id: "medical",
    name: "Medical Clinics",
    description: "Clinics, hospitals, dental practices, healthcare services"
  }
]

interface CategorySelectionProps {
  selectedCategory: BusinessCategory | null
  onCategorySelect: (category: BusinessCategory) => void
  loading: boolean
  isLoaded: boolean
}

export default function CategorySelection({ 
  selectedCategory, 
  onCategorySelect, 
  loading, 
  isLoaded 
}: CategorySelectionProps) {
  return (
    <div className="h-full">
      <div className="text-center mb-8">
        <div className="overflow-hidden mb-4">
          <div className={`flex items-center justify-center transform transition-all duration-800 delay-500 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Sparkles className="h-6 w-6 text-orange-500 mr-2" />
            <span className="text-sm font-medium text-gray-400 uppercase tracking-wide">Step 1 of 6</span>
          </div>
        </div>
        
        <div className="overflow-hidden mb-4">
          <h2 className={`text-3xl lg:text-4xl font-bold text-white leading-tight transform transition-all duration-1200 delay-700 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
            Choose Your Business Type
          </h2>
        </div>
        
        <div className="overflow-hidden">
          <p className={`text-lg text-gray-400 transform transition-all duration-1000 delay-900 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            Select the category that best describes your business
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {businessCategories.map((category, index) => {
          const isSelected = selectedCategory?.id === category.id
          
          return (
            <div
              key={category.id}
              className={`
                ${isSelected ? 'bg-white text-black' : 'bg-[#1a1a1a] text-white'}
                rounded-2xl 
                p-5
                cursor-pointer 
                transition-all 
                duration-300
                hover:bg-[#252525]
                hover:text-white
                group
                transform 
                hover:scale-[1.02]
                active:scale-[0.98]
                h-48
                flex
                flex-col
                justify-center
                ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}
              `}
              style={{
                transitionDelay: `${1100 + index * 100}ms`
              }}
              onClick={() => !loading && onCategorySelect(category)}
            >
              <h3 className={`text-lg font-bold mb-3 transition-colors ${isSelected ? 'text-black' : 'text-white group-hover:text-white'}`}>
                {category.name}
              </h3>
              <p className={`text-sm leading-relaxed transition-colors ${isSelected ? 'text-gray-700' : 'text-gray-400 group-hover:text-gray-300'}`}>
                {category.description}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}