"use client"

import React, { useState, useEffect } from "react"
import { 
  ArrowLeft, 
  ArrowRight, 
  Moon,
  Sun,
  Loader2,
  AlertCircle
} from "lucide-react"
import { BusinessCategory, SubscriptionPlan } from "@/lib/types"

import CategorySelection from "./components/CategorySelection"
import BusinessDetailsForm from "./components/BusinessDetails"
import PasswordSetup from "./components/PasswordSetup"
import PlanSelection from "./components/PlanSelection"
import DashboardCreation from "./components/DashboardCreation"
import WelcomeScreen from "./components/WelcomeScreen"

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

interface FormErrors {
  [key: string]: string
}

interface SignupData {
  businessName: string
  businessDescription: string
  websiteUrl: string
  ownerName: string
  email: string
  phone: string
  password: string
  category: string
  planId: string
}

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<BusinessCategory | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState("")
  const [darkMode, setDarkMode] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [dashboardProgress, setDashboardProgress] = useState(0)
  const [signupResult, setSignupResult] = useState<any>(null)
  const [formData, setFormData] = useState<FormData>({
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    const newErrors: FormErrors = {}

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
    const newErrors: FormErrors = {}

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

  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })
      
      const data = await response.json()
      return data.exists
    } catch (error) {
      console.error('Error checking email:', error)
      return false
    }
  }

  const handleCategorySelect = (category: BusinessCategory) => {
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

  const handleBusinessDetailsSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setSubmitError("")

    try {
      const emailExists = await checkEmailExists(formData.email)
      if (emailExists) {
        setErrors({
          ...errors,
          email: "This email is already registered"
        })
        setLoading(false)
        return
      }

      await new Promise(resolve => setTimeout(resolve, 1500))
      setCurrentStep(2)
    } catch (error) {
      console.error("Email validation error:", error)
      setSubmitError("Failed to validate email. Please try again.")
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
      setSubmitError((error as Error).message || "Password setup failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handlePlanSelect = async (plan: SubscriptionPlan) => {
    setSelectedPlan(plan)
    setLoading(true)
    setSubmitError("")
    
    try {
      const signupData: SignupData = {
        businessName: formData.businessName,
        businessDescription: formData.businessDescription,
        websiteUrl: formData.websiteUrl,
        ownerName: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        category: selectedCategory?.id || '',
        planId: plan.id
      }

      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signupData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Signup failed')
      }

      setSignupResult(result)
      
      setTimeout(() => {
        setCurrentStep(4)
        startDashboardCreation()
      }, 500)

    } catch (error) {
      console.error('Signup error:', error)
      setSubmitError(error instanceof Error ? error.message : 'Signup failed')
      setLoading(false)
    }
  }

  const dashboardSteps = [
    { name: "Initializing AI Core", progress: 15 },
    { name: "Setting up WhatsApp Integration", progress: 30 },
    { name: "Configuring Business Profile", progress: 50 },
    { name: "Training AI with Your Data", progress: 70 },
    { name: "Optimizing Response Templates", progress: 85 },
    { name: "Finalizing Setup", progress: 100 }
  ]

  const startDashboardCreation = () => {
    setDashboardProgress(0)
     setLoading(false)
    
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

  const handleDashboardNavigation = async () => {
    try {
      if (signupResult?.userId) {
        if (typeof window !== 'undefined') {
          window.location.href = "/dashboard"
        }
      }
    } catch (error) {
      console.error('Navigation error:', error)
    }
  }

  if (!mounted) {
    return null
  }

  const renderCurrentStep = () => {
    const stepClass = `transition-all duration-700 transform h-full ${
      currentStep === 0 ? 'translate-x-0 opacity-100' : 
      currentStep > 0 ? '-translate-x-full opacity-0 absolute inset-0 p-4 lg:p-8 xl:p-12' : 
      'translate-x-full opacity-0 absolute inset-0 p-4 lg:p-8 xl:p-12'
    }`

    switch (currentStep) {
      case 0:
        return (
          <div className={stepClass}>
            <CategorySelection
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
              loading={loading}
              isLoaded={isLoaded}
            />
          </div>
        )
      
      // In the renderCurrentStep function, update the case 1:
case 1:
  return (
    <div className={`transition-all duration-700 transform h-full ${
      currentStep === 1 ? 'translate-x-0 opacity-100' : 
      currentStep > 1 ? '-translate-x-full opacity-0 absolute inset-0 p-4 lg:p-8 xl:p-12' : 
      'translate-x-full opacity-0 absolute inset-0 p-4 lg:p-8 xl:p-12'
    }`}>
      <BusinessDetailsForm
        selectedCategory={selectedCategory}
        formData={formData}
        errors={errors}
        focusedField={focusedField}
        loading={loading}
        isLoaded={isLoaded}
        submitError={submitError}
        onInputChange={handleInputChange}
        onSubmit={handleBusinessDetailsSubmit}
        onFocus={setFocusedField}
        onBlur={() => setFocusedField(null)}
        onBack={handleBack}
      />
    </div>
  )
      
      case 2:
        return (
          <div className={`transition-all duration-700 transform h-full ${
            currentStep === 2 ? 'translate-x-0 opacity-100' : 
            currentStep > 2 ? '-translate-x-full opacity-0 absolute inset-0 p-4 lg:p-8 xl:p-12' : 
            'translate-x-full opacity-0 absolute inset-0 p-4 lg:p-8 xl:p-12'
          }`}>
            <PasswordSetup
              formData={formData}
              errors={errors}
              focusedField={focusedField}
              loading={loading}
              isLoaded={isLoaded}
              submitError={submitError}
              onInputChange={handleInputChange}
              onSubmit={handlePasswordSubmit}
              onFocus={setFocusedField}
              onBlur={() => setFocusedField(null)}
              onBack={handleBack}
            />
          </div>
        )
      
      case 3:
        return (
          <div className={`transition-all duration-700 transform h-full ${
            currentStep === 3 ? 'translate-x-0 opacity-100' : 
            currentStep > 3 ? '-translate-x-full opacity-0 absolute inset-0 p-4 lg:p-8 xl:p-12' : 
            'translate-x-full opacity-0 absolute inset-0 p-4 lg:p-8 xl:p-12'
          }`}>
            <PlanSelection
              selectedPlan={selectedPlan}
              onPlanSelect={handlePlanSelect}
              loading={loading}
              isLoaded={isLoaded}
              onBack={handleBack}
            />
          </div>
        )
      
      case 4:
        return (
          <div className={`transition-all duration-700 transform h-full ${
            currentStep === 4 ? 'translate-x-0 opacity-100' : 
            currentStep > 4 ? '-translate-x-full opacity-0 absolute inset-0 p-4 lg:p-8 xl:p-12' : 
            'translate-x-full opacity-0 absolute inset-0 p-4 lg:p-8 xl:p-12'
          }`}>
            <WelcomeScreen
        selectedCategory={selectedCategory}
        selectedPlan={selectedPlan}
        formData={formData}
        isLoaded={isLoaded}
        onDashboardClick={handleDashboardNavigation}
        onBack={handleBack}
            />
          </div>
        )
      
      case 5:
        return (
          <div className={`transition-all duration-700 transform h-full ${
            currentStep === 5 ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 absolute inset-0 p-4 lg:p-8 xl:p-12'
          }`}>
      <WelcomeScreen
        selectedCategory={selectedCategory}
        selectedPlan={selectedPlan}
        formData={formData}
        isLoaded={isLoaded}
        onDashboardClick={handleDashboardNavigation}
        onBack={handleBack}
            />
          </div>
        )
      
      default:
        return null
    }
  }

// Replace the return section of your SignupPage component with this:

return (
  <div className="min-h-screen flex relative overflow-hidden bg-black">
    {/* Left Side - Form */}
    <div className="w-full lg:w-1/2 bg-black flex flex-col relative z-10">
      {/* Header with Logo */}
      <div className="border-b border-gray-800 p-4 lg:p-6 backdrop-blur-sm bg-black/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-black rounded-sm flex items-center justify-center">
                <div className="w-2 h-2 bg-black rounded-full"></div>
              </div>
            </div>
            <span className="text-white text-2xl font-semibold">Company</span>
          </div>
          
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-900 transition-all duration-300 transform hover:scale-110 active:scale-95 group"
            aria-label="Toggle dark mode"
          >
            <div className="relative">
              {darkMode ? (
                <Sun className="h-5 w-5 text-gray-400 transition-all duration-300 group-hover:text-yellow-500 group-hover:rotate-180" />
              ) : (
                <Moon className="h-5 w-5 text-gray-400 transition-all duration-300 group-hover:text-blue-500 group-hover:-rotate-12" />
              )}
            </div>
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 lg:p-8 xl:p-12 overflow-y-auto relative">
        {renderCurrentStep()}
      </div>
    </div>

    {/* Right Side - Video Background */}
    <div className="hidden lg:block lg:w-1/2 relative">
      
    </div>
    
    {/* Fixed Video Container - Outside the flex layout */}
    <div className="hidden lg:block fixed top-1/2 right-0 -translate-y-1/2 w-1/2 pointer-events-none">
      <div className="flex items-center justify-center px-6">
        <div className="relative w-[90%] h-[750px] rounded-2xl overflow-hidden shadow-2xl pointer-events-auto">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/left.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Optional: Dark overlay for better contrast */}
          <div className="absolute inset-0 bg-black/10"></div>
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
              {currentStep === 3 ? 'Creating Your Account...' : 'Processing...'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {currentStep === 3 ? 'Setting up your business profile' : 'This will only take a moment'}
            </p>
          </div>
        </div>
      </div>
    )}
  </div>
)
}