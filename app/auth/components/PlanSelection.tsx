"use client"

import React from "react"
import { 
  Star, 
  CheckCircle,
  ArrowRight
} from "lucide-react"
import { SubscriptionPlan } from "@/lib/types"

const subscriptionPlans = [
  {
    id: "free",
    name: "Free Trial",
    price: "Free",
    period: "14 days",
    description: "Test our AI capabilities",
    features: [
      "100 messages/month",
      "Basic AI responses",
      "WhatsApp integration",
      "Email support"
    ],
    popular: false
  },
  {
    id: "starter",
    name: "Starter",
    price: "$29",
    period: "per month",
    description: "For small businesses",
    features: [
      "1,000 messages/month",
      "Advanced AI responses",
      "WhatsApp + SMS",
      "Priority support",
      "Advanced analytics"
    ],
    popular: true
  },
  {
    id: "professional",
    name: "Professional", 
    price: "$79",
    period: "per month",
    description: "For growing businesses",
    features: [
      "5,000 messages/month",
      "Premium AI responses",
      "All integrations",
      "24/7 phone support",
      "AI customization"
    ],
    popular: false
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "Custom enterprise needs",
    features: [
      "Unlimited messages",
      "Custom AI development",
      "All integrations + APIs",
      "Dedicated manager",
      "White-label options"
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
    <div className="h-screen bg-[#0a0a0a] flex items-center justify-center px-6 overflow-hidden">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            Choose Your Plan
          </h1>
          <p className="text-sm text-gray-400">
            Select the perfect plan for your business needs
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => !loading && onPlanSelect(plan)}
              className={`relative cursor-pointer border rounded-lg p-5 transition-all duration-300 hover:scale-[1.02] ${
                selectedPlan?.id === plan.id 
                  ? 'border-white bg-white/5' 
                  : 'border-gray-700 hover:border-gray-500'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-0.5 rounded-full text-xs font-semibold">
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Star className="h-5 w-5 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-white mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-gray-400 mb-2">
                    {plan.description}
                  </p>
                  <div>
                    <span className="text-xl font-bold text-white">
                      {plan.price}
                    </span>
                    {plan.period !== "contact us" && (
                      <span className="text-gray-400 text-xs ml-1">
                        /{plan.period}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 mb-4">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-300">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                  selectedPlan?.id === plan.id
                    ? 'bg-white text-black'
                    : plan.popular 
                      ? 'bg-white text-black hover:bg-gray-100' 
                      : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <span>
                  {selectedPlan?.id === plan.id 
                    ? 'Selected' 
                    : plan.id === 'free' 
                      ? 'Start Free Trial' 
                      : 'Choose Plan'}
                </span>
                {selectedPlan?.id === plan.id && (
                  <CheckCircle className="h-4 w-4" />
                )}
              </button>
            </div>
          ))}
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
            onClick={() => selectedPlan && onPlanSelect(selectedPlan)}
            disabled={loading || !selectedPlan}
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
          <div className="w-2 h-2 rounded-full bg-white"></div>
          <div className="w-2 h-2 rounded-full bg-gray-700"></div>
          <div className="w-2 h-2 rounded-full bg-gray-700"></div>
          <div className="w-2 h-2 rounded-full bg-gray-700"></div>
          <div className="w-2 h-2 rounded-full bg-gray-700"></div>
        </div>
      </div>
    </div>
  )
}