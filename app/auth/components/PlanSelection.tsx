"use client"

import React from "react"
import { 
  Star, 
  CheckCircle,
  ChevronLeft
} from "lucide-react"
import { SubscriptionPlan } from "@/lib/types"

const subscriptionPlans = [
  {
    id: "starter",
    name: "Starter",
    price: "$29",
    period: "per month",
    description: "For small businesses",
    features: [
      "1,000 messages/month",
      "Advanced AI responses"
    ],
    popular: false
  },
  {
    id: "professional",
    name: "Professional", 
    price: "$79",
    period: "per month",
    description: "For growing businesses",
    features: [
      "5,000 messages/month",
      "Premium AI responses"
    ],
    popular: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "Custom enterprise needs",
    features: [
      "Unlimited messages",
      "Custom AI development"
    ],
    popular: false
  }
]

interface PlanSelectionProps {
  selectedPlan: SubscriptionPlan | null
  onPlanSelect: (plan: SubscriptionPlan) => void
  loading: boolean
  isLoaded: boolean
  onBack: () => void
}

export default function PlanSelection({
  selectedPlan,
  onPlanSelect,
  loading,
  isLoaded,
  onBack
}: PlanSelectionProps) {
  return (
    <div className="h-screen bg-black text-white overflow-hidden flex flex-col">
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
          <span className="text-white text-xl font-semibold">XsevenAI</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className={`text-3xl font-bold text-white mb-4 transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              Choose Your Plan
            </h1>
            <p className={`text-lg text-gray-400 transform transition-all duration-1000 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              Select the perfect plan for your business needs
            </p>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {subscriptionPlans.map((plan, index) => (
              <div
                key={plan.id}
                onClick={() => !loading && onPlanSelect(plan)}
                className={`relative cursor-pointer border-2 rounded-xl p-6 transition-all duration-300 hover:scale-[1.02] transform ${
                  selectedPlan?.id === plan.id 
                    ? 'border-white bg-white text-black' 
                    : 'border-gray-800 hover:border-gray-700 bg-black text-white'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
                style={{
                  transitionDelay: `${400 + index * 100}ms`
                }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <div className={`w-12 h-12 rounded-xl ${selectedPlan?.id === plan.id ? 'bg-black' : 'bg-white/10'} flex items-center justify-center mx-auto mb-4`}>
                    <Star className={`h-6 w-6 ${selectedPlan?.id === plan.id ? 'text-white' : 'text-blue-500'}`} />
                  </div>
                  
                  <h3 className={`text-xl font-bold mb-2 ${selectedPlan?.id === plan.id ? 'text-black' : 'text-white'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm mb-4 ${selectedPlan?.id === plan.id ? 'text-gray-700' : 'text-gray-400'}`}>
                    {plan.description}
                  </p>
                  
                  <div className="mb-6">
                    <span className={`text-3xl font-bold ${selectedPlan?.id === plan.id ? 'text-black' : 'text-white'}`}>
                      {plan.price}
                    </span>
                    {plan.period !== "contact us" && (
                      <span className={`text-sm ml-2 ${selectedPlan?.id === plan.id ? 'text-gray-700' : 'text-gray-400'}`}>
                        /{plan.period}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className={`h-5 w-5 flex-shrink-0 ${selectedPlan?.id === plan.id ? 'text-green-600' : 'text-green-500'}`} />
                      <span className={`text-sm ${selectedPlan?.id === plan.id ? 'text-gray-700' : 'text-gray-300'}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto">
                  {selectedPlan?.id === plan.id ? (
                    <div className="flex items-center justify-center gap-2 py-3 bg-green-100 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-green-700">Selected</span>
                    </div>
                  ) : (
                    <button className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium">
                      Select Plan
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Back Button */}
          <div className={`flex justify-start mb-4 transform transition-all duration-1000 delay-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <button
              onClick={onBack}
              disabled={loading}
              className="w-fit h-fit px-4 py-2 text-gray-400 hover:text-white transition-colors flex items-center gap-2 rounded-lg border border-gray-800 hover:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center gap-2 pb-6 flex-shrink-0">
        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
        <div className="w-2 h-2 rounded-full bg-white"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
      </div>
    </div>
  )
}