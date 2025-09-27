"use client"

import React from "react"
import { 
  CheckCircle,
  Sparkles,
  Phone,
  Star,
  Zap,
  ArrowRight,
  ArrowLeft
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
  onDashboardClick: () => void
  onBack: () => void
}

export default function WelcomeScreen({
  selectedCategory,
  selectedPlan,
  formData,
  isLoaded,
  onDashboardClick,
  onBack
}: WelcomeScreenProps) {
  return (
    <div className="h-full">
      {/* Back Button */}
      <div className={`mb-6 transform transition-all duration-700 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 group"
        >
          <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          <span>Back</span>
        </button>
      </div>

      <div className="max-w-2xl mx-auto text-center flex flex-col justify-center">
     
        
        <div className="overflow-hidden mb-4">
          <div className={`flex items-center justify-center transform transition-all duration-800 delay-400 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <span className="text-sm font-medium text-gray-400 uppercase tracking-wide">Setup Complete!</span>
          </div>
        </div>
        
        <div className="overflow-hidden mb-4">
          <h2 className={`text-3xl font-bold text-white transform transition-all duration-1200 delay-600 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
            Welcome to X-SevenAI!
          </h2>
        </div>
        
        <div className="overflow-hidden mb-8">
          <p className={`text-lg text-gray-400 transform transition-all duration-1000 delay-800 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            Your AI assistant for {selectedCategory?.name} is ready to transform your customer communication.
          </p>
        </div>

        <div className="overflow-hidden mb-8">
          <div className={`space-y-4 text-left bg-[#1a1a1a] border border-gray-700 rounded-xl p-6 hover:border-gray-500 transition-all duration-300 group relative overflow-hidden transform transition-all duration-1000 delay-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            <h3 className="font-semibold text-white text-center mb-4 relative z-10">Your Account Setup</h3>
            
            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Business:</span>
                <span className="text-sm font-medium text-white">{formData.businessName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Category:</span>
                <span className="text-sm font-medium text-white">{selectedCategory?.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Plan:</span>
                <span className="text-sm font-medium text-white">{selectedPlan?.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Email:</span>
                <span className="text-sm font-medium text-white">{formData.email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden mb-8">
          <div className={`bg-[#1a1a1a] border border-gray-700 rounded-xl p-6 transition-all duration-1000 delay-1200 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            <h3 className="font-semibold text-white text-center mb-4">Quick Start Guide</h3>
            
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
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold transition-all duration-300 group-hover/item:scale-110">
                    {item.step}
                  </div>
                  <div className="flex items-center space-x-2 flex-1">
                    <item.icon className="h-4 w-4 text-gray-400 group-hover/item:text-orange-500 transition-colors duration-300" />
                    <span className="text-sm text-gray-300 transition-all duration-300 group-hover/item:text-white">
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
            <button
              onClick={onDashboardClick}
              className="w-full bg-white text-black py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
              <Zap className="h-5 w-5 group-hover:animate-pulse" />
              <span>Enter Dashboard</span>
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>

          <div className={`grid grid-cols-2 gap-3 transform transition-all duration-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{animationDelay: '1800ms'}}>
            <button
              onClick={() => console.log("Download mobile app")}
              className="bg-[#1a1a1a] text-white border-2 border-gray-700 hover:border-white hover:bg-[#252525] transition-all duration-300 py-3 rounded-xl transform hover:scale-105 active:scale-95 group flex items-center justify-center gap-2"
            >
              <Phone className="h-4 w-4" />
              <span className="text-sm">Get App</span>
            </button>
            
            <button
              onClick={() => console.log("View tutorials")}
              className="bg-[#1a1a1a] text-white border-2 border-gray-700 hover:border-white hover:bg-[#252525] transition-all duration-300 py-3 rounded-xl transform hover:scale-105 active:scale-95 group flex items-center justify-center gap-2"
            >
              <Star className="h-4 w-4" />
              <span className="text-sm">Tutorials</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}