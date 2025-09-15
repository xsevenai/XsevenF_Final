"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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
    description: "Perfect for testing our AI capabilities",
    features: [
      "Up to 100 messages/month",
      "Basic AI responses",
      "WhatsApp integration",
      "Email support",
      "Basic analytics"
    ],
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    hoverColor: "hover:bg-green-100",
    gradient: "from-green-500 to-emerald-500",
    popular: false
  },
  {
    id: "starter",
    name: "Starter",
    price: "$29",
    period: "per month",
    description: "Great for small businesses getting started",
    features: [
      "Up to 1,000 messages/month",
      "Advanced AI responses",
      "WhatsApp + SMS integration",
      "Priority support",
      "Advanced analytics",
      "Custom responses"
    ],
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    hoverColor: "hover:bg-blue-100",
    gradient: "from-blue-500 to-cyan-500",
    popular: true
  },
  {
    id: "professional",
    name: "Professional", 
    price: "$79",
    period: "per month",
    description: "Perfect for growing businesses",
    features: [
      "Up to 5,000 messages/month",
      "Premium AI responses",
      "All integrations included",
      "24/7 phone support",
      "Advanced analytics + reports",
      "AI training & customization",
      "Multi-language support"
    ],
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200", 
    hoverColor: "hover:bg-purple-100",
    gradient: "from-purple-500 to-indigo-500",
    popular: false
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For large businesses with custom needs",
    features: [
      "Unlimited messages",
      "Custom AI development",
      "All integrations + APIs",
      "Dedicated account manager",
      "Custom analytics dashboard",
      "White-label options",
      "SLA guarantees"
    ],
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    hoverColor: "hover:bg-orange-100", 
    gradient: "from-orange-500 to-red-500",
    popular: false
  }
]

interface PlanSelectionProps {
  selectedPlan: SubscriptionPlan | null
  onPlanSelect: (plan: SubscriptionPlan) => void
  loading: boolean
  isLoaded: boolean
}

export default function PlanSelection({
  selectedPlan,
  onPlanSelect,
  loading,
  isLoaded
}: PlanSelectionProps) {
  return (
    <div className="max-w-4xl mx-auto overflow-y-auto h-full">
      <div className="text-center mb-8">
        <div className="overflow-hidden mb-4">
          <div className={`flex items-center justify-center transform transition-all duration-800 delay-500 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Star className="h-6 w-6 text-purple-500 mr-2" />
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide">Step 4 of 6</span>
          </div>
        </div>
        
        <div className="overflow-hidden mb-4">
          <h2 className={`text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight transform transition-all duration-1200 delay-700 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
            Choose Your Plan
          </h2>
        </div>
        
        <div className="overflow-hidden">
          <p className={`text-lg text-gray-600 dark:text-gray-300 transform transition-all duration-1000 delay-900 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            Select the perfect plan for your business needs
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {subscriptionPlans.map((plan, index) => (
          <Card
            key={plan.id}
            className={`relative cursor-pointer border-2 transition-all duration-500 hover:shadow-2xl dark:bg-gray-800 group overflow-hidden transform hover:scale-105 active:scale-95 ${
              plan.popular 
                ? 'border-purple-500 shadow-lg scale-105' 
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-900 dark:hover:border-gray-300'
            } ${
              selectedPlan?.id === plan.id ? 'border-black dark:border-white shadow-xl scale-105' : ''
            } transition-all duration-800 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
            style={{animationDelay: `${1100 + index * 100}ms`}}
            onClick={() => !loading && onPlanSelect(plan)}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-xs font-semibold animate-pulse">
                  Most Popular
                </div>
              </div>
            )}

            <div className={`absolute inset-0 bg-gradient-to-r ${plan.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
            
            <div className="p-6 relative z-10">
              <div className="text-center mb-6">
                <div className={`w-12 h-12 rounded-xl ${plan.bgColor} dark:bg-opacity-20 flex items-center justify-center mx-auto mb-3 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                  <Star className={`h-6 w-6 ${plan.color} transition-all duration-300 group-hover:scale-125`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <div className="mb-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  {plan.period !== "contact us" && (
                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                      /{plan.period}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {plan.description}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                className={`w-full transition-all duration-300 ${
                  plan.popular 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                } group/btn relative overflow-hidden`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${plan.gradient} opacity-0 group-hover/btn:opacity-10 transition-opacity duration-500`}></div>
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <span>{plan.id === 'free' ? 'Start Free Trial' : 'Choose Plan'}</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </span>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center mt-8 overflow-hidden">
        <div className={`transform transition-all duration-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{animationDelay: '1500ms'}}>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            All plans include WhatsApp integration, 24/7 AI responses, and can be upgraded anytime
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
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