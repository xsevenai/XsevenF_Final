"use client"

import React from "react"
import { useSignupState } from "./hooks/useSignupState"
import { createSignupActions } from "./utils/signupActions"
import CategorySelection from "./components/CategorySelection"
import BusinessDetailsForm from "./components/BusinessDetails"
import PlanSelection from "./components/PlanSelection"
import VirtualNumber from "./components/VirtualNumber"
import DashboardCreation from "./components/DashboardCreation"
import { ThemeSelection } from "./components/ThemeSelection"
import { SignupForm } from "./components/SignupForm"

export default function SignupPage() {
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

  if (!state.mounted) {
    return null
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

  // Step 1: Signup Form
  if (state.step === 1) {
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
  if (state.step === 2) {
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