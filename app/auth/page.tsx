"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  Quote,
  Moon,
  Sun,
  Sparkles,
  Zap
} from "lucide-react"
import Link from "next/link"

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

const testimonials = [
  {
    text: "X-SevenAI transformed our restaurant's customer service. We now handle 3x more orders with instant WhatsApp responses. Game changer!",
    author: "Maria Santos",
    role: "Restaurant Owner",
    business: "Casa Bella Italian"
  },
  {
    text: "Our beauty salon bookings increased by 150% since implementing X-SevenAI. Customers love the instant appointment confirmations.",
    author: "Priya Sharma",
    role: "Salon Manager", 
    business: "Glam Studio"
  },
  {
    text: "As an auto repair shop, quick communication is crucial. X-SevenAI helps us update customers instantly about their car status.",
    author: "James Rodriguez",
    role: "Shop Owner",
    business: "Rodriguez Auto Care"
  }
]

export default function SlidingSignupPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState("")
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [darkMode, setDarkMode] = useState(false)
  const [hoveredCategory, setHoveredCategory] = useState(null)
  const [focusedField, setFocusedField] = useState(null)
  const [mounted, setMounted] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [formData, setFormData] = useState({
    businessName: "",
    businessDescription: "",
    websiteUrl: "",
    ownerName: "",
    email: "",
    phone: ""
  })

  // Enhanced toggle dark mode with smooth transition
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    
    // Add smooth transition class
    document.documentElement.style.transition = 'all 0.3s ease-in-out'
    
    if (newDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    
    // Remove transition after animation
    setTimeout(() => {
      document.documentElement.style.transition = ''
    }, 300)
  }

  // Check for saved dark mode preference on component mount
  useEffect(() => {
    setMounted(true)
    const savedDarkMode = false // Removed localStorage usage
    setDarkMode(savedDarkMode)
    
    if (savedDarkMode) {
      document.documentElement.classList.add("dark")
    }

    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Auto-rotate testimonials with fade effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
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

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    // Add slight delay for better animation feel
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
      // Simulate API call with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock successful response
      const result = { success: true, businessId: 'mock-id' }
      setCurrentStep(2)
      
      setTimeout(() => {
        // In real app: window.location.href = "/dashboard"
        console.log("Would redirect to dashboard")
      }, 3000)

    } catch (error) {
      console.error("Registration error:", error)
      setSubmitError(error.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = () => {
    return formData.ownerName.trim() && 
           formData.businessName.trim() && 
           formData.businessDescription.trim().length >= 20 && 
           formData.email.trim() && 
           /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
  }

  // Don't render until mounted to prevent hydration issues
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
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative z-10 text-center max-w-lg">
          <div className="mb-8">
            {/* Logo with overflow container */}
            <div className="overflow-hidden mb-6">
              <div className={`w-16 h-16 bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 rounded-2xl flex items-center justify-center mx-auto transition-all duration-500 hover:scale-110 hover:rotate-3 hover:shadow-xl group transform transition-all duration-1000 delay-200 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent font-bold text-xl group-hover:from-pink-500 group-hover:to-orange-500 transition-all duration-300">X7</span>
              </div>
            </div>
            
            {/* Main headline with overflow container */}
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
            
            {/* Subtitle with overflow container */}
            <div className="overflow-hidden">
              <p className={`text-xl text-gray-600 dark:text-gray-300 leading-relaxed transform transition-all duration-1000 delay-800 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                Scale your customer support with AI that never sleeps
              </p>
            </div>
          </div>

          {/* Enhanced Stats with overflow container */}
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
              className={`flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed lg:hidden transform hover:scale-105 active:scale-95 transform transition-all duration-1000 delay-200 ease-out ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}
              disabled={currentStep === 0 || loading}
            >
              <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
              <span>Back</span>
            </button>
            
            <div className={`lg:hidden flex items-center space-x-2 transform transition-all duration-1000 delay-300 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-400 rounded-lg flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:rotate-3">
                <span className="text-white font-bold text-sm">X7</span>
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-white">X-SevenAI</span>
            </div>
            
            <div className={`flex items-center space-x-4 transform transition-all duration-1000 delay-400 ease-out ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
              {/* Enhanced Progress Dots */}
              <div className="flex space-x-2">
                {[0, 1, 2].map((step) => (
                  <div
                    key={step}
                    className={`w-2 h-2 rounded-full transition-all duration-500 transform ${
                      step <= currentStep ? 'bg-black dark:bg-white scale-125' : 'bg-gray-300 dark:bg-gray-600 scale-100'
                    } ${step === currentStep ? 'animate-pulse' : ''}`}
                  />
                ))}
              </div>
              
              {/* Enhanced Dark Mode Toggle */}
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
          {/* Step 0: Enhanced Category Selection */}
          <div 
            className={`transition-all duration-700 transform h-full ${
              currentStep === 0 ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 absolute inset-0 p-4 lg:p-8 xl:p-12'
            }`}
          >
            <div className="text-center mb-8">
              {/* Step indicator with overflow container */}
              <div className="overflow-hidden mb-4">
                <div className={`flex items-center justify-center transform transition-all duration-800 delay-500 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                  <Sparkles className="h-6 w-6 text-orange-500 mr-2" />
                  <span className="text-sm font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wide">Step 1 of 3</span>
                </div>
              </div>
              
              {/* Main heading with overflow container */}
              <div className="overflow-hidden mb-4">
                <h2 className={`text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight transform transition-all duration-1200 delay-700 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                  Choose Your Business Type
                </h2>
              </div>
              
              {/* Subtitle with overflow container */}
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
                    onMouseEnter={() => setHoveredCategory(category.id)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    {/* Animated Background */}
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

          {/* Step 1: Enhanced Business Details Form */}
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
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">Step 2 of 3</span>
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
                {/* Enhanced Form Fields with animations */}
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

                {/* Enhanced Textarea */}
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

                {/* Enhanced Website URL Field */}
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

                {/* Enhanced Submit Button */}
                <div className="overflow-hidden">
                  <Button
                    onClick={handleSubmit}
                    disabled={loading || !isFormValid()}
                    className={`w-full bg-black dark:bg-white text-white dark:text-black text-lg py-3 hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-500 font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 hover:shadow-2xl group relative overflow-hidden transform transition-all duration-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                    style={{animationDelay: '1700ms'}}
                  >
                    {/* Button Background Animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10 flex items-center space-x-2">
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Setting up your AI...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5 group-hover:animate-pulse" />
                          <span>Start Free Trial</span>
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

          {/* Step 2: Enhanced Success */}
          <div 
            className={`transition-all duration-700 transform h-full ${
              currentStep === 2 ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 absolute inset-0 p-4 lg:p-8 xl:p-12'
            }`}
          >
            <div className="max-w-md mx-auto text-center h-full flex flex-col justify-center">
              {/* Success Animation */}
              <div className="overflow-hidden mb-6">
                <div className={`w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center group relative overflow-hidden transform transition-all duration-1000 delay-200 ease-out ${isLoaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-75'}`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-full"></div>
                  <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-500 animate-bounce relative z-10" />
                </div>
              </div>
              
              <div className="overflow-hidden mb-4">
                <div className={`flex items-center justify-center transform transition-all duration-800 delay-400 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                  <Star className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-sm font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">Success!</span>
                </div>
              </div>
              
              <div className="overflow-hidden mb-4">
                <h2 className={`text-3xl font-bold text-gray-900 dark:text-white transform transition-all duration-1200 delay-600 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                  Welcome to X-SevenAI!
                </h2>
              </div>
              
              <div className="overflow-hidden mb-8">
                <p className={`text-lg text-gray-600 dark:text-gray-300 transform transition-all duration-1000 delay-800 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                  Your AI assistant for {selectedCategory?.name} is being set up. 
                  Redirecting to your dashboard...
                </p>
              </div>

              {/* Enhanced Next Steps */}
              <div className="overflow-hidden mb-8">
                <div className={`space-y-4 text-left bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group relative overflow-hidden transform transition-all duration-1000 delay-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-center mb-4 relative z-10">What's Next?</h3>
                  
                  {[
                    { step: 1, text: "Complete dashboard setup" },
                    { step: 2, text: "Connect your WhatsApp" },
                    { step: 3, text: "Start engaging customers" }
                  ].map((item, index) => (
                    <div 
                      key={item.step}
                      className="overflow-hidden"
                    >
                      <div className={`flex items-start space-x-3 group/item relative z-10 transform transition-all duration-800 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{animationDelay: `${1200 + index * 100}ms`}}>
                        <div className="w-6 h-6 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5 transition-all duration-300 group-hover/item:scale-110">
                          {item.step}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm transition-all duration-300 group-hover/item:text-gray-900 dark:group-hover/item:text-white">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="space-y-4 overflow-hidden">
                <div className={`transform transition-all duration-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{animationDelay: '1500ms'}}>
                  <Button
                    onClick={() => console.log("Would redirect to dashboard")}
                    className="w-full bg-black dark:bg-white text-white dark:text-black text-lg py-3 hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-500 font-semibold transform hover:scale-105 active:scale-95 hover:shadow-2xl group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                    <div className="relative z-10 flex items-center justify-center space-x-2">
                      <Zap className="h-5 w-5 group-hover:animate-pulse" />
                      <span>Go to Dashboard</span>
                    </div>
                  </Button>
                </div>

                <div className={`transform transition-all duration-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{animationDelay: '1600ms'}}>
                  <Button
                    onClick={() => console.log("Would redirect to home")}
                    className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-700 hover:border-gray-900 dark:hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-500 text-lg py-3 transform hover:scale-105 active:scale-95 group"
                  >
                    <span className="group-hover:animate-pulse">Back to Home</span>
                  </Button>
                </div>
              </div>

              {/* Floating Success Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-r from-green-400/20 to-blue-500/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay with Animation */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in-0 duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-500">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Setting up your AI assistant...
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