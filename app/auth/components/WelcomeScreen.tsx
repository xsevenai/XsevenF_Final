"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { 
  CheckCircle,
  Sparkles,
  Phone,
  Star,
  Zap,
  ArrowRight
} from "lucide-react"
import { BusinessCategory, SubscriptionPlan } from "@/lib/types"

interface FormData {
  businessName: string
  businessDescription: string
  websiteUrl: string
  ownerName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

interface WelcomeScreenProps {
  selectedCategory: BusinessCategory | null
  selectedPlan: SubscriptionPlan | null
  formData: FormData
  isLoaded: boolean
}

export default function WelcomeScreen({
  selectedCategory,
  selectedPlan,
  formData,
  isLoaded
}: WelcomeScreenProps) {
  return (
    <div className="max-w-md mx-auto text-center h-full flex flex-col justify-center">
      <div className="overflow-hidden mb-6">
        <div className={`w-24 h-24 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center group relative overflow-hidden transform transition-all duration-1000 delay-200 ease-out ${isLoaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-75'}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-full"></div>
          <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-500 animate-bounce relative z-10" />
        </div>
      </div>
      
      <div className="overflow-hidden mb-4">
        <div className={`flex items-center justify-center transform transition-all duration-800 delay-400 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <Sparkles className="h-6 w-6 text-green-500 mr-2 animate-pulse" />
          <span className="text-sm font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">Setup Complete!</span>
        </div>
      </div>
      
      <div className="overflow-hidden mb-4">
        <h2 className={`text-3xl font-bold text-gray-900 dark:text-white transform transition-all duration-1200 delay-600 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
          Welcome to X-SevenAI!
        </h2>
      </div>
      
      <div className="overflow-hidden mb-8">
        <p className={`text-lg text-gray-600 dark:text-gray-300 transform transition-all duration-1000 delay-800 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          Your AI assistant for {selectedCategory?.name} is ready to transform your customer communication.
        </p>
      </div>

      <div className="overflow-hidden mb-8">
        <div className={`space-y-4 text-left bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group relative overflow-hidden transform transition-all duration-1000 delay-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-center mb-4 relative z-10">Your Account Setup</h3>
          
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Business:</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{formData.businessName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Category:</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedCategory?.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Plan:</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedPlan?.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Email:</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{formData.email}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden mb-8">
        <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 transition-all duration-1000 delay-1200 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <h3 className="font-semibold text-gray-900 dark:text-white text-center mb-4">Quick Start Guide</h3>
          
          {[
            { step: 1, text: "Connect your WhatsApp Business", icon: Phone },
            { step: 2, text: "Customize AI responses", icon: Sparkles },
            { step: 3, text: "Start engaging customers", icon: Zap }
          ].map((item, index) => (
            <div 
              key={item.step}
              className="overflow-hidden"
            >
              <div className={`flex items-start space-x-3 py-2 group/item transform transition-all duration-800 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{animationDelay: `${1400 + index * 100}ms`}}>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold transition-all duration-300 group-hover/item:scale-110">
                  {item.step}
                </div>
                <div className="flex items-center space-x-2 flex-1">
                  <item.icon className="h-4 w-4 text-gray-400 group-hover/item:text-blue-500 transition-colors duration-300" />
                  <span className="text-sm text-gray-700 dark:text-gray-300 transition-all duration-300 group-hover/item:text-gray-900 dark:group-hover/item:text-white">
                    {item.text}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 overflow-hidden">
        <div className={`transform transition-all duration-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{animationDelay: '1700ms'}}>
          <Button
            onClick={() => {
              // In production, this would navigate to the dashboard
              if (typeof window !== 'undefined') {
                window.location.href = "/dashboard"
              }
            }}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg py-4 transition-all duration-500 font-semibold transform hover:scale-105 active:scale-95 hover:shadow-2xl group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
            <div className="relative z-10 flex items-center justify-center space-x-2">
              <Zap className="h-6 w-6 group-hover:animate-pulse" />
              <span>Enter Dashboard</span>
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </Button>
        </div>

        <div className={`grid grid-cols-2 gap-3 transform transition-all duration-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{animationDelay: '1800ms'}}>
          <Button
            onClick={() => console.log("Download mobile app")}
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-700 hover:border-gray-900 dark:hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-500 py-3 transform hover:scale-105 active:scale-95 group"
          >
            <div className="flex items-center justify-center space-x-2">
              <Phone className="h-4 w-4 group-hover:animate-pulse" />
              <span className="text-sm">Get App</span>
            </div>
          </Button>
          
          <Button
            onClick={() => console.log("View tutorials")}
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-700 hover:border-gray-900 dark:hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-500 py-3 transform hover:scale-105 active:scale-95 group"
          >
            <div className="flex items-center justify-center space-x-2">
              <Star className="h-4 w-4 group-hover:animate-pulse" />
              <span className="text-sm">Tutorials</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}