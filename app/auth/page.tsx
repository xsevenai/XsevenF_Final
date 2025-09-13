"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { authService } from "@/lib/auth"
import { BusinessCategory, SubscriptionPlan } from "@/lib/types"
import { 
  ArrowLeft, 
  ArrowRight, 
  Store, 
  Utensils, 
  ShoppingBag, 
  Stethoscope, 
  Building,
  Globe,
  Mail,
  User,
  CheckCircle,
  Loader2,
  Phone,
  AlertCircle,
  Star,
  Moon,
  Sun,
  Sparkles,
  Zap,
  Shield
} from "lucide-react"

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

const dashboardSteps = [
  { name: "Initializing AI Core", progress: 15 },
  { name: "Setting up WhatsApp Integration", progress: 30 },
  { name: "Configuring Business Profile", progress: 50 },
  { name: "Training AI with Your Data", progress: 70 },
  { name: "Optimizing Response Templates", progress: 85 },
  { name: "Finalizing Setup", progress: 100 }
]

export default function SlidingSignupPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState("")
  const [darkMode, setDarkMode] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const [mounted, setMounted] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [dashboardProgress, setDashboardProgress] = useState(0)
  const [formData, setFormData] = useState({
    businessName: "",
    businessDescription: "",
    websiteUrl: "",
    ownerName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  })

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    
    document.documentElement.style.transition = 'all 0.3s ease-in-out'
    
    if (newDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    
    setTimeout(() => {
      document.documentElement.style.transition = ''
    }, 300)
  }

  useEffect(() => {
    setMounted(true)
    const savedDarkMode = false
    setDarkMode(savedDarkMode)
    
    if (savedDarkMode) {
      document.documentElement.classList.add("dark")
    }

    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      })
    }
    
    if (submitError) {
      setSubmitError("")
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.ownerName.trim()) {
      newErrors.ownerName = "Owner name is required"
    }

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required"
    }

    if (!formData.businessDescription.trim()) {
      newErrors.businessDescription = "Business description is required"
    } else if (formData.businessDescription.trim().length < 20) {
      newErrors.businessDescription = "Description should be at least 20 characters"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (formData.websiteUrl.trim() && !/^https?:\/\/.+/.test(formData.websiteUrl)) {
      newErrors.websiteUrl = "Please enter a valid URL (include http:// or https://)"
    }

    if (formData.phone.trim() && !/^[\+]?[1-9][\d]{3,14}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = "Please enter a valid phone number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePasswordForm = () => {
    const newErrors = {}

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    setTimeout(() => {
      setCurrentStep(1)
    }, 150)
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setSubmitError("")

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setCurrentStep(2)
    } catch (error) {
      console.error("Registration error:", error)
      setSubmitError(error.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async () => {
    if (!validatePasswordForm()) {
      return
    }

    setLoading(true)
    setSubmitError("")

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setCurrentStep(3)
    } catch (error) {
      console.error("Password setup error:", error)
      setSubmitError(error.message || "Password setup failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan)
    setTimeout(() => {
      setCurrentStep(4)
      startDashboardCreation()
    }, 500)
  }

  const startDashboardCreation = () => {
    setDashboardProgress(0)
    
    dashboardSteps.forEach((step, index) => {
      setTimeout(() => {
        setDashboardProgress(step.progress)
        if (step.progress === 100) {
          setTimeout(() => {
            setCurrentStep(5)
          }, 1000)
        }
      }, (index + 1) * 2000)
    })
  }

  const isFormValid = () => {
    return formData.ownerName.trim() && 
           formData.businessName.trim() && 
           formData.businessDescription.trim().length >= 20 && 
           formData.email.trim() && 
           /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
  }

  const isPasswordFormValid = () => {
    return formData.password.length >= 8 && 
           /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password) &&
           formData.password === formData.confirmPassword
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen flex dark:bg-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-orange-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-400/10 to-blue-600/10 rounded-full blur-3xl animate-spin" style={{animationDuration: '20s'}}></div>
      </div>

      {/* Left Side - Content */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-50 dark:bg-gray-800 flex-col justify-center items-center p-8 xl:p-12 relative overflow-hidden border-r border-gray-200 dark:border-gray-700">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative z-10 text-center max-w-lg">
          <div className="mb-8">
            <div className="overflow-hidden mb-6">
              <div className={`w-16 h-16 bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 rounded-2xl flex items-center justify-center mx-auto transition-all duration-500 hover:scale-110 hover:rotate-3 hover:shadow-xl group transform transition-all duration-1000 delay-200 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent font-bold text-xl group-hover:from-pink-500 group-hover:to-orange-500 transition-all duration-300">X7</span>
              </div>
            </div>
            
            <div className="overflow-hidden mb-6">
              <h1 className={`text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white leading-tight transform transition-all duration-1200 delay-400 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                Transform Your 
                <div className="overflow-hidden">
                  <span className={`bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent transform transition-all duration-1200 delay-600 ease-out inline-block ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                    Business Communication
                  </span>
                </div>
              </h1>
            </div>
            
            <div className="overflow-hidden">
              <p className={`text-xl text-gray-600 dark:text-gray-300 leading-relaxed transform transition-all duration-1000 delay-800 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                Scale your customer support with AI that never sleeps
              </p>
            </div>
          </div>

          <div className="overflow-hidden">
            <div className={`bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 rounded-2xl p-8 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 hover:shadow-xl transition-all duration-300 group transform transition-all duration-1000 delay-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center transform transition-all duration-300 group-hover:scale-105">
                  <div className="text-3xl font-bold text-orange-500 mb-2">Instant</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Responses</div>
                </div>
                <div className="text-center transform transition-all duration-300 group-hover:scale-105">
                  <div className="text-3xl font-bold text-pink-500 mb-2">10x</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Efficiency</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 bg-white dark:bg-gray-900 flex flex-col relative">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-800 p-4 lg:p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
          <div className="flex items-center justify-between">
            <button 
              onClick={handleBack}
              className={`flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 transform transition-all duration-1000 delay-200 ease-out ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}
              disabled={currentStep === 0 || loading}
            >
              <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
              <span>Back</span>
            </button>
            
            <div className={`flex items-center space-x-4 transform transition-all duration-1000 delay-400 ease-out ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
              <div className="flex space-x-2">
                {[0, 1, 2, 3, 4, 5].map((step) => (
                  <div
                    key={step}
                    className={`w-2 h-2 rounded-full transition-all duration-500 transform ${
                      step <= currentStep ? 'bg-black dark:bg-white scale-125' : 'bg-gray-300 dark:bg-gray-600 scale-100'
                    } ${step === currentStep ? 'animate-pulse' : ''}`}
                  />
                ))}
              </div>
              
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-110 active:scale-95 group"
                aria-label="Toggle dark mode"
              >
                <div className="relative">
                  {darkMode ? (
                    <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300 transition-all duration-300 group-hover:text-yellow-500 group-hover:rotate-180" />
                  ) : (
                    <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300 transition-all duration-300 group-hover:text-blue-500 group-hover:-rotate-12" />
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 p-4 lg:p-8 xl:p-12 overflow-y-auto relative">
          {/* Step 0: Category Selection */}
          <div 
            className={`transition-all duration-700 transform h-full ${
              currentStep === 0 ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 absolute inset-0 p-4 lg:p-8 xl:p-12'
            }`}
          >
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
                    onClick={() => !loading && handleCategorySelect(category)}
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

          {/* Step 1: Business Details Form */}
          <div 
            className={`transition-all duration-700 transform h-full ${
              currentStep === 1 ? 'translate-x-0 opacity-100' : 
              currentStep > 1 ? '-translate-x-full opacity-0 absolute inset-0 p-4 lg:p-8 xl:p-12' : 'translate-x-full opacity-0 absolute inset-0 p-4 lg:p-8 xl:p-12'
            }`}
          >
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                {selectedCategory && (
                  <div className="overflow-hidden mb-4">
                    <div className={`flex items-center justify-center transform transition-all duration-800 delay-500 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                      <div className={`w-10 h-10 rounded-xl ${selectedCategory.bgColor} dark:bg-opacity-20 flex items-center justify-center mr-3 transform transition-all duration-500 hover:scale-110 hover:rotate-3`}>
                        <selectedCategory.icon className={`h-5 w-5 ${selectedCategory.color}`} />
                      </div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                        {selectedCategory.name}
                      </h2>
                    </div>
                  </div>
                )}
                <div className="overflow-hidden mb-4">
                  <div className={`flex items-center justify-center transform transition-all duration-800 delay-700 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <Zap className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">Step 2 of 6</span>
                  </div>
                </div>
                <div className="overflow-hidden">
                  <p className={`text-lg text-gray-600 dark:text-gray-300 transform transition-all duration-1000 delay-900 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    Tell us about your business
                  </p>
                </div>
              </div>

              {submitError && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3 animate-in slide-in-from-top-4 duration-500">
                  <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5 animate-pulse" />
                  <p className="text-red-700 dark:text-red-300 text-sm">{submitError}</p>
                </div>
              )}

              <div className="space-y-6">
                {[
                  { name: 'ownerName', label: 'Your Name', icon: User, type: 'text', placeholder: 'Your full name', required: true },
                  { name: 'businessName', label: 'Business Name', icon: Store, type: 'text', placeholder: 'Enter your business name', required: true },
                  { name: 'email', label: 'Email Address', icon: Mail, type: 'email', placeholder: 'your@email.com', required: true },
                  { name: 'phone', label: 'Phone Number', icon: Phone, type: 'tel', placeholder: '+1234567890', required: false },
                ].map((field, index) => (
                  <div key={field.name} className="space-y-2 overflow-hidden">
                    <div className={`transform transition-all duration-800 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{animationDelay: `${1100 + index * 100}ms`}}>
                      <Label 
                        htmlFor={field.name} 
                        className="text-gray-700 dark:text-gray-300 font-medium flex items-center space-x-2 transition-all duration-300"
                      >
                        <field.icon className={`h-4 w-4 transition-all duration-300 ${focusedField === field.name ? 'text-blue-500 scale-110' : ''}`} />
                        <span>{field.label} {field.required && '*'}</span>
                      </Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField(field.name)}
                        onBlur={() => setFocusedField(null)}
                        disabled={loading}
                        className={`border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-800 dark:text-white disabled:opacity-50 transition-all duration-300 transform focus:scale-105 ${
                          errors[field.name] ? 'border-red-500 shake' : ''
                        } ${focusedField === field.name ? 'shadow-lg' : ''}`}
                        placeholder={field.placeholder}
                      />
                      {errors[field.name] && (
                        <p className="text-red-500 dark:text-red-400 text-sm flex items-center space-x-1 animate-in slide-in-from-left-2 duration-300">
                          <AlertCircle className="h-3 w-3 animate-pulse" />
                          <span>{errors[field.name]}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                <div className="space-y-2 overflow-hidden">
                  <div className={`transform transition-all duration-800 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{animationDelay: '1500ms'}}>
                    <Label htmlFor="businessDescription" className="text-gray-700 dark:text-gray-300 font-medium">
                      Business Description *
                    </Label>
                    <Textarea
                      id="businessDescription"
                      name="businessDescription"
                      value={formData.businessDescription}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('businessDescription')}
                      onBlur={() => setFocusedField(null)}
                      disabled={loading}
                      className={`border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-800 dark:text-white min-h-[100px] resize-none disabled:opacity-50 transition-all duration-300 transform focus:scale-105 ${
                        errors.businessDescription ? 'border-red-500' : ''
                      } ${focusedField === 'businessDescription' ? 'shadow-lg' : ''}`}
                      placeholder="Describe your business and services... (minimum 20 characters)"
                    />
                    <div className="flex justify-between items-start">
                      <div>
                        {errors.businessDescription && (
                          <p className="text-red-500 dark:text-red-400 text-sm flex items-center space-x-1 animate-in slide-in-from-left-2 duration-300">
                            <AlertCircle className="h-3 w-3 animate-pulse" />
                            <span>{errors.businessDescription}</span>
                          </p>
                        )}
                      </div>
                      <p className={`text-xs transition-all duration-300 ${
                        formData.businessDescription.length < 20 ? 'text-red-500 dark:text-red-400 animate-pulse' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {formData.businessDescription.length}/20 min
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 overflow-hidden">
                  <div className={`transform transition-all duration-800 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{animationDelay: '1600ms'}}>
                    <Label htmlFor="websiteUrl" className="text-gray-700 dark:text-gray-300 font-medium flex items-center space-x-2">
                      <Globe className={`h-4 w-4 transition-all duration-300 ${focusedField === 'websiteUrl' ? 'text-blue-500 scale-110' : ''}`} />
                      <span>Website URL</span>
                    </Label>
                    <Input
                      id="websiteUrl"
                      name="websiteUrl"
                      type="url"
                      value={formData.websiteUrl}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('websiteUrl')}
                      onBlur={() => setFocusedField(null)}
                      disabled={loading}
                      className={`border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-800 dark:text-white disabled:opacity-50 transition-all duration-300 transform focus:scale-105 ${
                        errors.websiteUrl ? 'border-red-500' : ''
                      } ${focusedField === 'websiteUrl' ? 'shadow-lg' : ''}`}
                      placeholder="https://yourwebsite.com"
                    />
                    {errors.websiteUrl && (
                      <p className="text-red-500 dark:text-red-400 text-sm flex items-center space-x-1 animate-in slide-in-from-left-2 duration-300">
                        <AlertCircle className="h-3 w-3 animate-pulse" />
                        <span>{errors.websiteUrl}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="overflow-hidden">
                  <Button
                    onClick={handleSubmit}
                    disabled={loading || !isFormValid()}
                    className={`w-full bg-black dark:bg-white text-white dark:text-black text-lg py-3 hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-500 font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 hover:shadow-2xl group relative overflow-hidden transform transition-all duration-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                    style={{animationDelay: '1700ms'}}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10 flex items-center space-x-2">
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5 group-hover:animate-pulse" />
                          <span>Continue</span>
                          <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </>
                      )}
                    </div>
                  </Button>
                </div>

                <div className="overflow-hidden">
                  <p className={`text-gray-500 dark:text-gray-400 text-sm text-center transform transition-all duration-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{animationDelay: '1800ms'}}>
                    * Required fields
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Password Setup */}
          <div 
            className={`transition-all duration-700 transform h-full ${
              currentStep === 2 ? 'translate-x-0 opacity-100' : 
              currentStep > 2 ? '-translate-x-full opacity-0 absolute inset-0 p-4 lg:p-8 xl:p-12' : 'translate-x-full opacity-0 absolute inset-0 p-4 lg:p-8 xl:p-12'
            }`}
          >
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <div className="overflow-hidden mb-4">
                  <div className={`flex items-center justify-center transform transition-all duration-800 delay-500 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <Shield className="h-6 w-6 text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">Step 3 of 6</span>
                  </div>
                </div>
                
                <div className="overflow-hidden mb-4">
                  <h2 className={`text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight transform transition-all duration-1200 delay-700 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                    Secure Your Account
                  </h2>
                </div>
                
                <div className="overflow-hidden">
                  <p className={`text-lg text-gray-600 dark:text-gray-300 transform transition-all duration-1000 delay-900 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    Create a strong password for your account
                  </p>
                </div>
              </div>

              {submitError && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3 animate-in slide-in-from-top-4 duration-500">
                  <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5 animate-pulse" />
                  <p className="text-red-700 dark:text-red-300 text-sm">{submitError}</p>
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-2 overflow-hidden">
                  <div className={`transform transition-all duration-800 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{animationDelay: '1100ms'}}>
                    <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium flex items-center space-x-2">
                      <Shield className={`h-4 w-4 transition-all duration-300 ${focusedField === 'password' ? 'text-blue-500 scale-110' : ''}`} />
                      <span>Password *</span>
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      disabled={loading}
                      className={`border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-800 dark:text-white disabled:opacity-50 transition-all duration-300 transform focus:scale-105 ${
                        errors.password ? 'border-red-500 shake' : ''
                      } ${focusedField === 'password' ? 'shadow-lg' : ''}`}
                      placeholder="Enter a strong password"
                    />
                    {errors.password && (
                      <p className="text-red-500 dark:text-red-400 text-sm flex items-center space-x-1 animate-in slide-in-from-left-2 duration-300">
                        <AlertCircle className="h-3 w-3 animate-pulse" />
                        <span>{errors.password}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 overflow-hidden">
                  <div className={`transform transition-all duration-800 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{animationDelay: '1200ms'}}>
                    <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300 font-medium flex items-center space-x-2">
                      <Shield className={`h-4 w-4 transition-all duration-300 ${focusedField === 'confirmPassword' ? 'text-blue-500 scale-110' : ''}`} />
                      <span>Confirm Password *</span>
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('confirmPassword')}
                      onBlur={() => setFocusedField(null)}
                      disabled={loading}
                      className={`border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-800 dark:text-white disabled:opacity-50 transition-all duration-300 transform focus:scale-105 ${
                        errors.confirmPassword ? 'border-red-500 shake' : ''
                      } ${focusedField === 'confirmPassword' ? 'shadow-lg' : ''}`}
                      placeholder="Confirm your password"
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 dark:text-red-400 text-sm flex items-center space-x-1 animate-in slide-in-from-left-2 duration-300">
                        <AlertCircle className="h-3 w-3 animate-pulse" />
                        <span>{errors.confirmPassword}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="overflow-hidden">
                  <div className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-4 transform transition-all duration-800 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{animationDelay: '1300ms'}}>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password Requirements:</h4>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      <li className={`flex items-center space-x-2 transition-colors duration-300 ${formData.password.length >= 8 ? 'text-green-600 dark:text-green-400' : ''}`}>
                        <CheckCircle className={`h-3 w-3 ${formData.password.length >= 8 ? 'text-green-500' : 'text-gray-400'}`} />
                        <span>At least 8 characters</span>
                      </li>
                      <li className={`flex items-center space-x-2 transition-colors duration-300 ${/(?=.*[a-z])/.test(formData.password) ? 'text-green-600 dark:text-green-400' : ''}`}>
                        <CheckCircle className={`h-3 w-3 ${/(?=.*[a-z])/.test(formData.password) ? 'text-green-500' : 'text-gray-400'}`} />
                        <span>One lowercase letter</span>
                      </li>
                      <li className={`flex items-center space-x-2 transition-colors duration-300 ${/(?=.*[A-Z])/.test(formData.password) ? 'text-green-600 dark:text-green-400' : ''}`}>
                        <CheckCircle className={`h-3 w-3 ${/(?=.*[A-Z])/.test(formData.password) ? 'text-green-500' : 'text-gray-400'}`} />
                        <span>One uppercase letter</span>
                      </li>
                      <li className={`flex items-center space-x-2 transition-colors duration-300 ${/(?=.*\d)/.test(formData.password) ? 'text-green-600 dark:text-green-400' : ''}`}>
                        <CheckCircle className={`h-3 w-3 ${/(?=.*\d)/.test(formData.password) ? 'text-green-500' : 'text-gray-400'}`} />
                        <span>One number</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="overflow-hidden">
                  <Button
                    onClick={handlePasswordSubmit}
                    disabled={loading || !isPasswordFormValid()}
                    className={`w-full bg-black dark:bg-white text-white dark:text-black text-lg py-3 hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-500 font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 hover:shadow-2xl group relative overflow-hidden transform transition-all duration-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                    style={{animationDelay: '1400ms'}}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10 flex items-center space-x-2">
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Securing Account...</span>
                        </>
                      ) : (
                        <>
                          <Shield className="h-5 w-5 group-hover:animate-pulse" />
                          <span>Continue</span>
                          <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </>
                      )}
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Subscription Plans */}
          <div 
            className={`transition-all duration-700 transform h-full ${
              currentStep === 3 ? 'translate-x-0 opacity-100' : 
              currentStep > 3 ? '-translate-x-full opacity-0 absolute inset-0 p-4 lg:p-8 xl:p-12' : 'translate-x-full opacity-0 absolute inset-0 p-4 lg:p-8 xl:p-12'
            }`}
          >
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
                    onClick={() => !loading && handlePlanSelect(plan)}
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
          </div>

          {/* Step 4: Dashboard Creation */}
          <div 
            className={`transition-all duration-700 transform h-full ${
              currentStep === 4 ? 'translate-x-0 opacity-100' : 
              currentStep > 4 ? '-translate-x-full opacity-0 absolute inset-0 p-4 lg:p-8 xl:p-12' : 'translate-x-full opacity-0 absolute inset-0 p-4 lg:p-8 xl:p-12'
            }`}
          >
            <div className="max-w-md mx-auto text-center h-full flex flex-col justify-center">
              <div className="overflow-hidden mb-8">
                <div className={`transform transition-all duration-1000 delay-200 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                  <div className="w-32 h-32 mx-auto mb-6 relative">
                    <div className="absolute inset-0 rounded-full border-8 border-gray-200 dark:border-gray-700"></div>
                    <div 
                      className="absolute inset-0 rounded-full border-8 border-transparent transition-all duration-1000 ease-out"
                      style={{
                        background: `conic-gradient(from 0deg, #3b82f6 ${dashboardProgress}%, transparent ${dashboardProgress}%)`,
                        borderRadius: '50%'
                      }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {dashboardProgress}%
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Complete
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="overflow-hidden mb-4">
                <div className={`flex items-center justify-center transform transition-all duration-800 delay-400 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                  <Zap className="h-5 w-5 text-blue-500 mr-2 animate-pulse" />
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">Step 5 of 6</span>
                </div>
              </div>
              
              <div className="overflow-hidden mb-4">
                <h2 className={`text-3xl font-bold text-gray-900 dark:text-white transform transition-all duration-1200 delay-600 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                  Creating Your Dashboard
                </h2>
              </div>
              
              <div className="overflow-hidden mb-8">
                <p className={`text-lg text-gray-600 dark:text-gray-300 transform transition-all duration-1000 delay-800 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                  Setting up your AI-powered business assistant...
                </p>
              </div>

              <div className="overflow-hidden mb-8">
                <div className={`bg-gray-50 dark:bg-gray-800 rounded-xl p-6 transition-all duration-1000 delay-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                  <div className="space-y-4">
                    {dashboardSteps.map((step, index) => {
                      const isActive = dashboardProgress >= step.progress
                      const isCurrent = dashboardProgress < step.progress && (index === 0 || dashboardProgress >= dashboardSteps[index - 1]?.progress)
                      
                      return (
                        <div 
                          key={index}
                          className={`flex items-center space-x-3 transition-all duration-500 ${
                            isActive ? 'text-green-600 dark:text-green-400' : 
                            isCurrent ? 'text-blue-600 dark:text-blue-400' : 
                            'text-gray-400 dark:text-gray-600'
                          }`}
                        >
                          <div className="flex-shrink-0">
                            {isActive ? (
                              <CheckCircle className="h-5 w-5 animate-pulse" />
                            ) : isCurrent ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-current"></div>
                            )}
                          </div>
                          <span className="text-sm font-medium">
                            {step.name}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 5: Final Success */}
          <div 
            className={`transition-all duration-700 transform h-full ${
              currentStep === 5 ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 absolute inset-0 p-4 lg:p-8 xl:p-12'
            }`}
          >
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
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in-0 duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-500">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Processing...
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                This will only take a moment
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}