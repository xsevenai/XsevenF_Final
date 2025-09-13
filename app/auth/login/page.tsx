"use client"

import React, { useState, useEffect } from "react"
import { 
  ArrowLeft, 
  Moon,
  Sun,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  Mail,
  Lock
} from "lucide-react"
import Link from "next/link"

interface FormData {
  email: string
  password: string
}

interface FormErrors {
  [key: string]: string
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState("")
  const [darkMode, setDarkMode] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: ""
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setSubmitError("")

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Login failed')
      }

      // Success - redirect to dashboard
      if (typeof window !== 'undefined') {
        window.location.href = "/dashboard"
      }

    } catch (error) {
      console.error('Login error:', error)
      setSubmitError(error instanceof Error ? error.message : 'Login failed')
    } finally {
      setLoading(false)
    }
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
                Welcome Back to 
                <div className="overflow-hidden">
                  <span className={`bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent transform transition-all duration-1200 delay-600 ease-out inline-block ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                    Your AI Assistant
                  </span>
                </div>
              </h1>
            </div>
            
            <div className="overflow-hidden">
              <p className={`text-xl text-gray-600 dark:text-gray-300 leading-relaxed transform transition-all duration-1000 delay-800 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                Continue managing your business with intelligent automation
              </p>
            </div>
          </div>

          <div className="overflow-hidden">
            <div className={`bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 rounded-2xl p-8 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 hover:shadow-xl transition-all duration-300 group transform transition-all duration-1000 delay-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center transform transition-all duration-300 group-hover:scale-105">
                  <div className="text-3xl font-bold text-orange-500 mb-2">24/7</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">AI Support</div>
                </div>
                <div className="text-center transform transition-all duration-300 group-hover:scale-105">
                  <div className="text-3xl font-bold text-pink-500 mb-2">Smart</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Automation</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 bg-white dark:bg-gray-900 flex flex-col relative">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-800 p-4 lg:p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
          <div className="flex items-center justify-between">
            <Link 
              href="/"
              className={`flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95 transform transition-all duration-1000 delay-200 ease-out ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}
            >
              <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
              <span>Back to Home</span>
            </Link>
            
            <div className={`flex items-center space-x-4 transform transition-all duration-1000 delay-400 ease-out ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
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

        {/* Login Form */}
        <div className="flex-1 p-4 lg:p-8 xl:p-12 overflow-y-auto relative flex items-center justify-center">
          <div className={`w-full max-w-md space-y-8 transform transition-all duration-1000 delay-600 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            {/* Form Header */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Sign In
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Access your business dashboard
              </p>
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center space-x-3 animate-in fade-in-0 slide-in-from-top-5 duration-500">
                <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                <p className="text-sm text-red-700 dark:text-red-400">{submitError}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 ${
                      errors.email 
                        ? 'border-red-300 dark:border-red-600 focus:ring-red-500/20 focus:border-red-500' 
                        : focusedField === 'email'
                        ? 'border-blue-300 dark:border-blue-600 focus:ring-blue-500/20 focus:border-blue-500'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1 animate-in fade-in-0 slide-in-from-top-2 duration-300">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full pl-10 pr-12 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 ${
                      errors.password 
                        ? 'border-red-300 dark:border-red-600 focus:ring-red-500/20 focus:border-red-500' 
                        : focusedField === 'password'
                        ? 'border-blue-300 dark:border-blue-600 focus:ring-blue-500/20 focus:border-blue-500'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1 animate-in fade-in-0 slide-in-from-top-2 duration-300">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link 
                  href="/auth/forgot-password"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl disabled:shadow-md flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link 
                  href="/auth"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200 hover:underline font-medium"
                >
                  Sign up here
                </Link>
              </p>
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
                Signing You In...
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Please wait while we authenticate your account
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}