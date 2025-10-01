"use client"

import React, { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useSignupState } from "./hooks/useSignupState"
import { createSignupActions } from "./utils/signupActions"
import CategorySelection from "./components/CategorySelection"
import BusinessDetailsForm from "./components/BusinessDetails"
import PlanSelection from "./components/PlanSelection"
import VirtualNumber from "./components/VirtualNumber"
import DashboardCreation from "./components/DashboardCreation"
import { ThemeSelection } from "./components/ThemeSelection"
import { SignupForm } from "./components/SignupForm"

export default function AuthPage() {
  const { data: session, status } = useSession()
  
  const {
    state,
    updateState,
    applyTheme,
    validateEmail,
    validatePassword,
    navigateToStep
  } = useSignupState()

  const actions = createSignupActions(
    state,
    updateState,
    applyTheme,
    validateEmail,
    validatePassword,
    navigateToStep
  )

  // Handle Google OAuth session data
  useEffect(() => {
    // Check for Google auth data from callback
    const googleAuthData = sessionStorage.getItem('googleAuthData')
    const urlParams = new URLSearchParams(window.location.search)
    const isGoogleAuth = urlParams.get('google') === 'true'
    const stepParam = urlParams.get('step')
    
    if (googleAuthData && isGoogleAuth && !state.isGoogleAuth) {
      try {
        const userData = JSON.parse(googleAuthData)
        
        updateState({
          email: userData.email || '',
          formData: {
            ...state.formData,
            email: userData.email || '',
            ownerName: userData.name || ''
          },
          isGoogleAuth: true,
          step: stepParam ? parseInt(stepParam) : 2
        })
        
        // Store Google ID for later use
        if (userData.googleId) {
          sessionStorage.setItem('googleId', userData.googleId)
        }
        
        // Clear the auth data and clean URL
        sessionStorage.removeItem('googleAuthData')
        window.history.replaceState({}, '', '/auth')
        
      } catch (error) {
        console.error('Error parsing Google auth data:', error)
      }
    }
  }, [state.isGoogleAuth, updateState])

  if (!state.mounted) {
    return null
  }

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Step 0: Theme Selection
  if (state.step === 0) {
    return (
      <ThemeSelection
        selectedTheme={state.selectedTheme}
        isLoaded={state.isLoaded}
        onThemeSelect={actions.handleThemeSelect}
      />
    )
  }

  // Step 1: Signup Form (skip if Google authenticated)
  if (state.step === 1 && !state.isGoogleAuth) {
    return (
      <SignupForm
        email={state.email}
        password={state.password}
        showPassword={state.showPassword}
        errors={state.errors}
        loading={state.loading}
        isLoaded={state.isLoaded}
        onEmailChange={actions.handleEmailChange}
        onPasswordChange={actions.handlePasswordChange}
        onShowPasswordToggle={() => updateState({ showPassword: !state.showPassword })}
        onSubmit={actions.handleSubmit}
        onGoogleSignup={actions.handleGoogleSignup}
      />
    )
  }

  // Step 2: Category Selection
  if (state.step === 2 || (state.step === 1 && state.isGoogleAuth)) {
    return (
      <CategorySelection
        selectedCategory={state.selectedCategory}
        onCategorySelect={actions.handleCategorySelect}
        loading={state.loading}
        isLoaded={state.isLoaded}
        onBack={actions.handleBackFromCategorySelection}
      />
    )
  }

  // Step 3: Business Details Form
  if (state.step === 3) {
    return (
      <BusinessDetailsForm
        selectedCategory={state.selectedCategory}
        formData={state.formData}
        errors={state.businessErrors}
        focusedField={state.focusedField}
        loading={state.loading}
        isLoaded={state.isLoaded}
        submitError={state.submitError}
        onInputChange={actions.handleInputChange}
        onSubmit={actions.handleBusinessDetailsSubmit}
        onFocus={(field) => updateState({ focusedField: field })}
        onBlur={() => updateState({ focusedField: null })}
        onBack={actions.handleBackFromBusinessDetails}
      />
    )
  }

  // Step 4: Plan Selection
  if (state.step === 4) {
    return (
      <PlanSelection
        selectedPlan={state.selectedPlan}
        onPlanSelect={actions.handlePlanSelect}
        loading={state.loading}
        isLoaded={state.isLoaded}
        onBack={actions.handleBackFromPlanSelection}
        submitError={state.submitError}
      />
    )
  }

  // Step 5: Virtual Number Selection
  if (state.step === 5) {
    return (
      <VirtualNumber
        loading={state.loading}
        isLoaded={state.isLoaded}
        onBack={actions.handleBackFromVirtualNumber}
        onContinue={actions.handleNumberSelection}
      />
    )
  }

  // Step 6: Dashboard Creation
  if (state.step === 6) {
    return (
      <DashboardCreation
        businessData={{
          category: state.selectedCategory,
          formData: state.formData,
          plan: state.selectedPlan,
          numberSelection: state.numberSelection,
          signupResult: state.signupResult
        }}
        loading={state.loading}
        isLoaded={state.isLoaded}
        onBack={actions.handleBackFromDashboard}
        onComplete={actions.handleDashboardCreation}
      />
    )
  }

  return null
}