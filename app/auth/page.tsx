"use client"

import React, { useState, useEffect } from "react"
import { Eye, EyeOff } from "lucide-react"
import CategorySelection from "./components/CategorySelection"
import BusinessDetailsForm from "./components/BusinessDetails"
import PlanSelection from "./components/PlanSelection"
import VirtualNumber from "./components/VirtualNumber"
import DashboardCreation from "./components/DashboardCreation"
import { ThemeSelection } from "./components/ThemeSelection"
import { SignupForm } from "./components/SignupForm"

interface BusinessCategory {
  id: string
  name: string
  description: string
}

interface SubscriptionPlan {
  id: string
  name: string
  price: string
  period: string
  description: string
  features: string[]
  popular: boolean
}

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

// Interface for API payload
interface SignupApiData {
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
  const [step, setStep] = useState(0)
  const [selectedTheme, setSelectedTheme] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState<BusinessCategory | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)
  const [numberSelection, setNumberSelection] = useState<{ type: 'virtual' | 'custom', number?: string, customNumber?: string } | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({ email: "", password: "" })
  const [businessErrors, setBusinessErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState("")
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

  useEffect(() => {
    setMounted(true)
    
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('themePreference')
      
      if (savedTheme) {
        setSelectedTheme(savedTheme)
        setStep(1)
        
        if (savedTheme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    }

    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const applyTheme = (isDark) => {
    document.documentElement.style.transition = 'all 0.3s ease-in-out'
    
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    
    setTimeout(() => {
      document.documentElement.style.transition = ''
    }, 300)
  }

  const handleBackFromCategorySelection = () => {
    setIsLoaded(false)
    setTimeout(() => {
      setStep(1) // Go back to SignupForm
      setIsLoaded(true)
    }, 300)
  }

  const handleThemeSelect = (theme) => {
    setSelectedTheme(theme)
    const isDark = theme === 'dark'
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('themePreference', theme)
    }
    
    applyTheme(isDark)
    
    setTimeout(() => {
      setStep(1)
    }, 500)
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    return password.length >= 8
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    if (errors.email) {
      setErrors({ ...errors, email: "" })
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    if (errors.password) {
      setErrors({ ...errors, password: "" })
    }
  }

  const handleSubmit = () => {
    const newErrors = { email: "", password: "" }
    
    if (!email) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email"
    }
    
    if (!password) {
      newErrors.password = "Password is required"
    } else if (!validatePassword(password)) {
      newErrors.password = "Password must be at least 8 characters"
    }
    
    if (newErrors.email || newErrors.password) {
      setErrors(newErrors)
      return
    }
    
    // Update formData with email and password from signup form
    setFormData(prev => ({
      ...prev,
      email: email,
      password: password
    }))
    
    setIsLoaded(false)
    setTimeout(() => {
      setStep(2)
      setIsLoaded(true)
    }, 300)
  }

  const handleCategorySelect = (category: BusinessCategory) => {
    setSelectedCategory(category)
    setIsLoaded(false)
    
    setTimeout(() => {
      setStep(3)
      setIsLoaded(true)
    }, 300)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleBusinessDetailsSubmit = () => {
    setIsLoaded(false)
    setTimeout(() => {
      setStep(4)
      setIsLoaded(true)
    }, 300)
  }

  const handlePlanSelect = async (plan: SubscriptionPlan) => {
    setSelectedPlan(plan)
    setLoading(true)
    setSubmitError("")
    
    try {
      // Prepare signup data for API
      const signupData: SignupApiData = {
        businessName: formData.businessName,
        businessDescription: formData.businessDescription,
        websiteUrl: formData.websiteUrl || "",
        ownerName: formData.ownerName,
        email: formData.email || email, // Use formData.email or fallback to email state
        phone: formData.phone || "",
        password: formData.password || password, // Use formData.password or fallback to password state
        category: selectedCategory?.id || "",
        planId: plan.id
      }

      console.log('Sending signup data:', signupData)

      // Call the signup API
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

      console.log('Signup successful:', result)
      setSignupResult(result)
      
      // Continue to next step after successful signup
      setIsLoaded(false)
      setTimeout(() => {
        setStep(5)
        setIsLoaded(true)
      }, 300)

    } catch (error) {
      console.error('Signup error:', error)
      setSubmitError(error instanceof Error ? error.message : 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleNumberSelection = (selection: { type: 'virtual' | 'custom', number?: string, customNumber?: string }) => {
    setNumberSelection(selection)
    
    setIsLoaded(false)
    setTimeout(() => {
      setStep(6)
      setIsLoaded(true)
    }, 300)
  }

  const handleDashboardCreation = async (dashboardData: any) => {
    setLoading(true)
    setSubmitError("")
    
    try {
      const completeSignupData = {
        theme: selectedTheme,
        signupResult: signupResult, // Include the API response
        category: selectedCategory?.id,
        categoryName: selectedCategory?.name,
        formData: formData,
        selectedPlan: selectedPlan,
        numberSelection: numberSelection,
        dashboardSetup: dashboardData
      }

      console.log('Complete Signup Data:', completeSignupData)

      // Call dashboard creation API
      const response = await fetch('/api/dashboard/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          businessId: signupResult?.businessId,
          dashboardType: dashboardData.type,
          businessData: completeSignupData
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Dashboard creation failed')
      }

      console.log('Dashboard creation successful:', result)
      
      // Show success message and redirect
      if (signupResult?.businessId) {
        alert(`Setup complete! Business created with ID: ${signupResult.businessId}. Dashboard created successfully.`)
        
        // Redirect to dashboard
        window.location.href = '/dashboard'
      } else {
        alert(`Setup complete! Dashboard created successfully.`)
      }

    } catch (error) {
      console.error('Dashboard creation error:', error)
      setSubmitError(error instanceof Error ? error.message : 'Dashboard creation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Navigation handlers
  const handleBackFromBusinessDetails = () => {
    setIsLoaded(false)
    setTimeout(() => {
      setStep(2)
      setIsLoaded(true)
    }, 300)
  }

  const handleBackFromPlanSelection = () => {
    setIsLoaded(false)
    setTimeout(() => {
      setStep(3)
      setIsLoaded(true)
    }, 300)
  }

  const handleBackFromVirtualNumber = () => {
    setIsLoaded(false)
    setTimeout(() => {
      setStep(4)
      setIsLoaded(true)
    }, 300)
  }

  const handleBackFromDashboard = () => {
    setIsLoaded(false)
    setTimeout(() => {
      setStep(5)
      setIsLoaded(true)
    }, 300)
  }

  const handleGoogleSignup = () => {
    console.log('Google signup clicked')
    // Implement Google OAuth signup here
  }

  if (!mounted) {
    return null
  }

  // Step 0: Theme Selection
  if (step === 0) {
    return (
      <ThemeSelection
        selectedTheme={selectedTheme}
        isLoaded={isLoaded}
        onThemeSelect={handleThemeSelect}
      />
    )
  }

  // Step 1: Signup Form
  if (step === 1) {
    return (
      <SignupForm
        email={email}
        password={password}
        showPassword={showPassword}
        errors={errors}
        loading={loading}
        isLoaded={isLoaded}
        onEmailChange={handleEmailChange}
        onPasswordChange={handlePasswordChange}
        onShowPasswordToggle={() => setShowPassword(!showPassword)}
        onSubmit={handleSubmit}
        onGoogleSignup={handleGoogleSignup}
      />
    )
  }

  // Step 2: Category Selection
  if (step === 2) {
    return (
      <CategorySelection
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
        loading={loading}
        isLoaded={isLoaded}
        onBack={handleBackFromCategorySelection}
      />
    )
  }

  // Step 3: Business Details Form
  if (step === 3) {
    return (
      <BusinessDetailsForm
        selectedCategory={selectedCategory}
        formData={formData}
        errors={businessErrors}
        focusedField={focusedField}
        loading={loading}
        isLoaded={isLoaded}
        submitError={submitError}
        onInputChange={handleInputChange}
        onSubmit={handleBusinessDetailsSubmit}
        onFocus={setFocusedField}
        onBlur={() => setFocusedField(null)}
        onBack={handleBackFromBusinessDetails}
      />
    )
  }

  // Step 4: Plan Selection
  if (step === 4) {
    return (
      <PlanSelection
        selectedPlan={selectedPlan}
        onPlanSelect={handlePlanSelect}
        loading={loading}
        isLoaded={isLoaded}
        onBack={handleBackFromPlanSelection}
        submitError={submitError} // Pass the error to show in the component
      />
    )
  }

  // Step 5: Virtual Number Selection
  if (step === 5) {
    return (
      <VirtualNumber
        loading={loading}
        isLoaded={isLoaded}
        onBack={handleBackFromVirtualNumber}
        onContinue={handleNumberSelection}
      />
    )
  }

  // Step 6: Dashboard Creation
  if (step === 6) {
    return (
      <DashboardCreation
        businessData={{
          category: selectedCategory,
          formData: formData,
          plan: selectedPlan,
          numberSelection: numberSelection,
          signupResult: signupResult // Pass the signup result
        }}
        loading={loading}
        isLoaded={isLoaded}
        onBack={handleBackFromDashboard}
        onComplete={handleDashboardCreation}
      />
    )
  }

  return null
}