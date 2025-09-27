"use client"

import React from "react"
import { 
  Star, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles
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
    <div className="h-full overflow-y-auto">
      {/* Back Button */}
      <div className={`mb-6 transform transition-all duration-700 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <button
          onClick={onBack}
          disabled={loading}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          <span>Back</span>
        </button>
      </div>

      <div className="text-center mb-8">
        <div className="overflow-hidden mb-4">
          <div className={`flex items-center justify-center transform transition-all duration-800 delay-500 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Sparkles className="h-6 w-6 text-orange-500 mr-2" />
            <span className="text-sm font-medium text-gray-400 uppercase tracking-wide">Step 4 of 6</span>
          </div>
        </div>
        
        <div className="overflow-hidden mb-4">
          <h2 className={`text-3xl lg:text-4xl font-bold text-white leading-tight transform transition-all duration-1200 delay-700 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
            Choose Your Plan
          </h2>
        </div>
        
        <div className="overflow-hidden">
          <p className={`text-lg text-gray-400 transform transition-all duration-1000 delay-900 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            Select the perfect plan for your business needs
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-8">
        {subscriptionPlans.map((plan, index) => (
          <div
            key={plan.id}
            className={`relative cursor-pointer border-2 rounded-xl transition-all duration-500 hover:shadow-2xl group overflow-hidden transform hover:scale-[1.03] active:scale-95 ${
              plan.popular 
                ? 'border-orange-500 shadow-lg shadow-orange-500/20 scale-[1.02]' 
                : 'border-gray-700 hover:border-gray-500'
            } ${
              selectedPlan?.id === plan.id ? 'border-white shadow-xl shadow-white/20 scale-[1.02] bg-[#2a2a2a]' : 'bg-[#1a1a1a]'
            } transition-all duration-800 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
            style={{animationDelay: `${1100 + index * 100}ms`}}
            onClick={() => !loading && onPlanSelect(plan)}
          >
            {plan.popular && (
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-20">
                <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-0.5 rounded-full text-xs font-semibold">
                  Most Popular
                </div>
              </div>
            )}
            
            <div className="p-5 relative z-10">
              <div className="text-center mb-4">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mx-auto mb-2 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <Star className="h-5 w-5 text-orange-500 transition-all duration-300 group-hover:scale-125" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  {plan.name}
                </h3>
                <div className="mb-2">
                  <span className="text-2xl font-bold text-white">
                    {plan.price}
                  </span>
                  {plan.period !== "contact us" && (
                    <span className="text-gray-400 text-xs">
                      /{plan.period}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400">
                  {plan.description}
                </p>
              </div>

              <div className="space-y-2 mb-4">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start space-x-2">
                    <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-300">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  plan.popular 
                    ? 'bg-white text-black hover:bg-gray-100' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                } group/btn`}
              >
                <span>{plan.id === 'free' ? 'Start Free Trial' : 'Choose Plan'}</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center overflow-hidden">
        <div className={`transform transition-all duration-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{animationDelay: '1500ms'}}>
          <p className="text-gray-400 text-sm mb-4">
            All plans include WhatsApp integration, 24/7 AI responses, and can be upgraded anytime
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>No setup fees</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>30-day money back</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}