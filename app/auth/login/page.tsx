"use client"

import React, { useState, useEffect } from "react"
import { 
  ArrowLeft, 
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
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: ""
  })

  useEffect(() => {
    setMounted(true)
    
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

      // Store auth data in localStorage
      localStorage.setItem('auth_token', result.auth.access_token)
      localStorage.setItem('refresh_token', result.auth.refresh_token)
      localStorage.setItem('user_info', JSON.stringify(result.user_info))
      localStorage.setItem('business', JSON.stringify(result.business))
      
      if (result.subscription) {
        localStorage.setItem('subscription', JSON.stringify(result.subscription))
      }
      
      // Set expiry time if available
      if (result.auth.expires_at) {
        localStorage.setItem('token_expiry', String(result.auth.expires_at))
      }
      
      console.log('Login successful, redirecting to dashboard')

      // Redirect to dashboard
      if (typeof window !== 'undefined') {
        window.location.href = "/dashboard"
      }

    } catch (error) {
      console.error('Login error:', error)
      
      // Handle specific error messages from the API
      if (error instanceof Error) {
        setSubmitError(error.message)
      } else {
        setSubmitError('Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-black">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 bg-black flex flex-col relative z-10">
        {/* Header with Logo */}
        <div className="p-4 lg:p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-black rounded-sm flex items-center justify-center">
                <div className="w-2 h-2 bg-black rounded-full"></div>
              </div>
            </div>
            <span className="text-white text-2xl font-semibold ml-3">XSevenAI</span>
          </div>
        </div>

        {/* Login Form */}
        <div className="flex-1 p-4 lg:p-8 xl:p-12 overflow-y-auto relative flex items-center justify-center">
          <div className={`w-full max-w-md space-y-8 transform transition-all duration-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            {/* Back to Home Link */}
            <Link 
              href="/"
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95 group"
            >
              <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
              <span>Back to Home</span>
            </Link>
            
            {/* Form Header */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-400">
                Sign in to continue to your dashboard
              </p>
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center space-x-3 animate-in fade-in-0 slide-in-from-top-5 duration-500">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-400">{submitError}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-300">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    disabled={loading}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-800 text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.email 
                        ? 'border-red-600 focus:ring-red-500/20 focus:border-red-500' 
                        : focusedField === 'email'
                        ? 'border-blue-600 focus:ring-blue-500/20 focus:border-blue-500'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-400 flex items-center space-x-1 animate-in fade-in-0 slide-in-from-top-2 duration-300">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    disabled={loading}
                    className={`w-full pl-10 pr-12 py-3 border rounded-xl bg-gray-800 text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.password 
                        ? 'border-red-600 focus:ring-red-500/20 focus:border-red-500' 
                        : focusedField === 'password'
                        ? 'border-blue-600 focus:ring-blue-500/20 focus:border-blue-500'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors duration-200 disabled:opacity-50"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-400 flex items-center space-x-1 animate-in fade-in-0 slide-in-from-top-2 duration-300">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link 
                  href="/auth/forgot-password"
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none active:scale-95 group"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Signing In...</span>
                  </div>
                ) : (
                  <span className="group-hover:tracking-wide transition-all duration-300">
                    Sign In
                  </span>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center pt-6 border-t border-gray-800">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <Link 
                  href="/auth"
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Video Background */}
      <div className="hidden lg:block lg:w-1/2 relative">
        {/* This is an empty container to maintain layout */}
      </div>
      
      {/* Fixed Video Container - Outside the flex layout */}
      <div className="hidden lg:block fixed top-1/2 right-0 -translate-y-1/2 w-1/2 pointer-events-none">
        <div className="flex items-center justify-center px-6">
          <div className="relative w-[100%] h-[725px] rounded-2xl overflow-hidden shadow-2xl pointer-events-auto">
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
            
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in-0 duration-300">
          <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-500">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Signing In...
              </h3>
              <p className="text-gray-300 text-sm">
                Verifying your credentials
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}