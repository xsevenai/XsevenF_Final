"use client"

import React, { useState, useEffect } from "react"

// Types and interfaces
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

export interface SignupState {
  step: number
  selectedTheme: any
  selectedCategory: BusinessCategory | null
  selectedPlan: SubscriptionPlan | null
  numberSelection: { type: 'virtual' | 'custom', number?: string, customNumber?: string } | null
  email: string
  password: string
  showPassword: boolean
  errors: { email: string; password: string }
  businessErrors: FormErrors
  loading: boolean
  mounted: boolean
  isLoaded: boolean
  focusedField: string | null
  submitError: string
  signupResult: any
  formData: FormData
}

export const useSignupState = () => {
  const [state, setState] = useState<SignupState>({
    step: 0,
    selectedTheme: null,
    selectedCategory: null,
    selectedPlan: null,
    numberSelection: null,
    email: "",
    password: "",
    showPassword: false,
    errors: { email: "", password: "" },
    businessErrors: {},
    loading: false,
    mounted: false,
    isLoaded: false,
    focusedField: null,
    submitError: "",
    signupResult: null,
    formData: {
      businessName: "",
      businessDescription: "",
      websiteUrl: "",
      ownerName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: ""
    }
  })

  useEffect(() => {
    setState(prev => ({ ...prev, mounted: true }))
    
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('themePreference')
      
      if (savedTheme) {
        setState(prev => ({ ...prev, selectedTheme: savedTheme, step: 1 }))
        
        if (savedTheme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }

      // Check for Google user data from callback
      const googleUserData = sessionStorage.getItem('googleUserData')
      if (googleUserData) {
        try {
          const userData = JSON.parse(googleUserData)
          setState(prev => ({
            ...prev,
            email: userData.email || '',
            formData: {
              ...prev.formData,
              email: userData.email || '',
              ownerName: userData.name || ''
            },
            step: 2 // Skip to category selection for Google users
          }))
          // Clear the session storage
          sessionStorage.removeItem('googleUserData')
        } catch (error) {
          console.error('Error parsing Google user data:', error)
        }
      }

      // Check URL parameters for Google OAuth flow
      const urlParams = new URLSearchParams(window.location.search)
      const isGoogleAuth = urlParams.get('google') === 'true'
      const stepParam = urlParams.get('step')
      
      if (isGoogleAuth && stepParam) {
        setState(prev => ({ ...prev, step: parseInt(stepParam) }))
      }
    }

    const timer = setTimeout(() => {
      setState(prev => ({ ...prev, isLoaded: true }))
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const updateState = (updates: Partial<SignupState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }

  const applyTheme = (isDark: boolean) => {
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

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    return password.length >= 8
  }

  const navigateToStep = (newStep: number, delay = 300) => {
    updateState({ isLoaded: false })
    setTimeout(() => {
      updateState({ step: newStep, isLoaded: true })
    }, delay)
  }

  return {
    state,
    updateState,
    applyTheme,
    validateEmail,
    validatePassword,
    navigateToStep
  }
}