"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { 
  Utensils, 
  ShoppingBag, 
  Building, 
  Stethoscope, 
  Store,
  ArrowRight,
  Sparkles
} from "lucide-react"
import { BusinessCategory } from "@/lib/types"

const businessCategories = [
  {
    id: "restaurants",
    name: "Restaurants & Cafes",
    icon: Utensils,
    description: "Restaurants, cafes, food delivery, catering services",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    hoverColor: "hover:bg-orange-100",
    gradient: "from-orange-500 to-red-500"
  },
  {
    id: "beauty",
    name: "Beauty Salons",
    icon: ShoppingBag,
    description: "Hair salons, nail studios, spa services, beauty treatments",
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    hoverColor: "hover:bg-pink-100",
    gradient: "from-pink-500 to-purple-500"
  },
  {
    id: "auto",
    name: "Auto Repair",
    icon: Building,
    description: "Car repair shops, auto maintenance, tire services",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    hoverColor: "hover:bg-blue-100",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    id: "medical",
    name: "Medical Clinics",
    icon: Stethoscope,
    description: "Clinics, hospitals, dental practices, healthcare services",
    color: "text-green-600",
    bgColor: "bg-green-50",
    hoverColor: "hover:bg-green-100",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    id: "services",
    name: "Local Services",
    icon: Store,
    description: "Plumbing, electrical, cleaning, home services",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    hoverColor: "hover:bg-purple-100",
    gradient: "from-purple-500 to-indigo-500"
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
            <span className="text-sm font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wide">Step 1 of 6</span>
          </div>
        </div>
        
        <div className="overflow-hidden mb-4">
          <h2 className={`text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight transform transition-all duration-1200 delay-700 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
            Choose Your Business Type
          </h2>
        </div>
        
        <div className="overflow-hidden">
          <p className={`text-lg text-gray-600 dark:text-gray-300 transform transition-all duration-1000 delay-900 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            Select the category that best describes your business
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
        {businessCategories.map((category, index) => {
          const IconComponent = category.icon
          return (
            <Card
              key={category.id}
              className={`p-6 cursor-pointer border-2 border-gray-200 dark:border-gray-700 hover:border-gray-900 dark:hover:border-gray-300 transition-all duration-500 hover:shadow-2xl dark:bg-gray-800 group relative overflow-hidden transform hover:scale-105 active:scale-95 transition-all duration-800 ease-out ${
                selectedCategory?.id === category.id ? 'border-black dark:border-white shadow-xl scale-105' : ''
              } ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
              style={{animationDelay: `${1100 + index * 100}ms`}}
              onClick={() => !loading && onCategorySelect(category)}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${category.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              <div className="flex items-center space-x-4 relative z-10">
                <div className={`w-12 h-12 rounded-xl ${category.bgColor} dark:bg-opacity-20 flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                  <IconComponent className={`h-6 w-6 ${category.color} transition-all duration-300 group-hover:scale-125`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 transition-all duration-300 group-hover:text-gray-700 dark:group-hover:text-gray-200">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 transition-all duration-300">
                    {category.description}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 transition-all duration-300 group-hover:text-gray-700 dark:group-hover:text-gray-300 group-hover:translate-x-1" />
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}