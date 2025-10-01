import { SignupState } from '../hooks/useSignupState'


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

export const createSignupActions = (
  state: SignupState,
  updateState: (updates: Partial<SignupState>) => void,
  applyTheme: (isDark: boolean) => void,
  validateEmail: (email: string) => boolean,
  validatePassword: (password: string) => boolean,
  navigateToStep: (step: number, delay?: number) => void
) => {
  
  const handleThemeSelect = (theme: any) => {
    updateState({ selectedTheme: theme })
    const isDark = theme === 'dark'
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('themePreference', theme)
    }
    
    applyTheme(isDark)
    
    setTimeout(() => {
      updateState({ step: 1 })
    }, 500)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    updateState({ 
      email: value,
      errors: state.errors.email ? { ...state.errors, email: "" } : state.errors
    })
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    updateState({ 
      password: value,
      errors: state.errors.password ? { ...state.errors, password: "" } : state.errors
    })
  }

  const handleSubmit = () => {
    const newErrors = { email: "", password: "" }
    
    if (!state.email) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(state.email)) {
      newErrors.email = "Please enter a valid email"
    }
    
    if (!state.password) {
      newErrors.password = "Password is required"
    } else if (!validatePassword(state.password)) {
      newErrors.password = "Password must be at least 8 characters"
    }
    
    if (newErrors.email || newErrors.password) {
      updateState({ errors: newErrors })
      return
    }
    
    updateState({
      formData: {
        ...state.formData,
        email: state.email,
        password: state.password
      }
    })
    
    navigateToStep(2)
  }

  const handleCategorySelect = (category: BusinessCategory) => {
    updateState({ selectedCategory: category })
    navigateToStep(3)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    updateState({
      formData: {
        ...state.formData,
        [name]: value
      }
    })
  }

  const handleBusinessDetailsSubmit = () => {
    navigateToStep(4)
  }

  const handlePlanSelect = async (plan: SubscriptionPlan) => {
    updateState({ selectedPlan: plan, loading: true, submitError: "" })
    
    try {
      const signupData: SignupApiData = {
        businessName: state.formData.businessName,
        businessDescription: state.formData.businessDescription,
        websiteUrl: state.formData.websiteUrl || "",
        ownerName: state.formData.ownerName,
        email: state.formData.email || state.email,
        phone: state.formData.phone || "",
        password: state.formData.password || state.password,
        category: state.selectedCategory?.id || "",
        planId: plan.id
      }

      console.log('Sending signup data:', signupData)

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
      updateState({ signupResult: result })
      
      navigateToStep(5)

    } catch (error) {
      console.error('Signup error:', error)
      updateState({ 
        submitError: error instanceof Error ? error.message : 'Signup failed. Please try again.'
      })
    } finally {
      updateState({ loading: false })
    }
  }

  const handleNumberSelection = (selection: { type: 'virtual' | 'custom', number?: string, customNumber?: string }) => {
    updateState({ numberSelection: selection })
    navigateToStep(6)
  }

  const handleDashboardCreation = async (dashboardData: any) => {
    updateState({ loading: true, submitError: "" })
    
    try {
      const completeSignupData = {
        theme: state.selectedTheme,
        signupResult: state.signupResult,
        category: state.selectedCategory?.id,
        categoryName: state.selectedCategory?.name,
        formData: state.formData,
        selectedPlan: state.selectedPlan,
        numberSelection: state.numberSelection,
        dashboardSetup: dashboardData
      }

      console.log('Complete Signup Data:', completeSignupData)

      const response = await fetch('/api/dashboard/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          businessId: state.signupResult?.businessId,
          dashboardType: dashboardData.type,
          businessData: completeSignupData
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Dashboard creation failed')
      }

      console.log('Dashboard creation successful:', result)
      
      if (state.signupResult?.businessId) {
        alert(`Setup complete! Business created with ID: ${state.signupResult.businessId}. Dashboard created successfully.`)
        window.location.href = '/dashboard'
      } else {
        alert(`Setup complete! Dashboard created successfully.`)
      }

    } catch (error) {
      console.error('Dashboard creation error:', error)
      updateState({ 
        submitError: error instanceof Error ? error.message : 'Dashboard creation failed. Please try again.'
      })
    } finally {
      updateState({ loading: false })
    }
  }

  const handleGoogleSignup = async () => {
    try {
      // Import signIn from next-auth/react
      const { signIn } = await import('next-auth/react')
      
      // Trigger Google OAuth sign-in
      const result = await signIn('google', {
        callbackUrl: '/auth/google-callback', // Custom callback to handle post-signin
        redirect: false
      })

      if (result?.error) {
        updateState({ 
          submitError: 'Google sign-in failed. Please try again.' 
        })
      }
    } catch (error) {
      console.error('Google signup error:', error)
      updateState({ 
        submitError: 'Google sign-in failed. Please try again.' 
      })
    }
  }

  // Navigation handlers
  const handleBackFromCategorySelection = () => navigateToStep(1)
  const handleBackFromBusinessDetails = () => navigateToStep(2)
  const handleBackFromPlanSelection = () => navigateToStep(3)
  const handleBackFromVirtualNumber = () => navigateToStep(4)
  const handleBackFromDashboard = () => navigateToStep(5)

  return {
    handleThemeSelect,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
    handleCategorySelect,
    handleInputChange,
    handleBusinessDetailsSubmit,
    handlePlanSelect,
    handleNumberSelection,
    handleDashboardCreation,
    handleGoogleSignup,
    handleBackFromCategorySelection,
    handleBackFromBusinessDetails,
    handleBackFromPlanSelection,
    handleBackFromVirtualNumber,
    handleBackFromDashboard
  }
}