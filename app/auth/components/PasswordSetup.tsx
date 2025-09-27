"use client"

import React, { useState } from "react"
import { 
  Shield, 
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Sparkles,
  Eye,
  EyeOff
} from "lucide-react"

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

interface PasswordSetupProps {
  formData: FormData
  errors: FormErrors
  focusedField: string | null
  loading: boolean
  isLoaded: boolean
  submitError: string
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onSubmit: () => void
  onFocus: (fieldName: string) => void
  onBlur: () => void
  onBack: () => void
}

export default function PasswordSetup({
  formData,
  errors,
  focusedField,
  loading,
  isLoaded,
  submitError,
  onInputChange,
  onSubmit,
  onFocus,
  onBlur,
  onBack
}: PasswordSetupProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const isPasswordFormValid = () => {
    return formData.password.length >= 8 && 
           /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password) &&
           formData.password === formData.confirmPassword
  }

  return (
    <div className="h-full">
      {/* Back Button */}
      <div className={`mb-6 transform transition-all duration-700 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <button
          onClick={onBack}
          disabled={loading}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          <span>Back</span>
        </button>
      </div>

      <div className="text-center mb-8">
        <div className="overflow-hidden mb-4">
          <div className={`flex items-center justify-center transform transition-all duration-800 delay-500 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Sparkles className="h-6 w-6 text-orange-500 mr-2" />
            <span className="text-sm font-medium text-gray-400 uppercase tracking-wide">Step 3 of 6</span>
          </div>
        </div>
        
        <div className="overflow-hidden mb-4">
          <h2 className={`text-3xl lg:text-4xl font-bold text-white leading-tight transform transition-all duration-1200 delay-700 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
            Secure Your Account
          </h2>
        </div>
        
        <div className="overflow-hidden">
          <p className={`text-lg text-gray-400 transform transition-all duration-1000 delay-900 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            Create a strong password for your account
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {submitError && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-3 animate-in fade-in-0 slide-in-from-top-2 duration-300">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-500">{submitError}</p>
          </div>
        )}

        <div className={`transform transition-all duration-700 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Password *
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={onInputChange}
              onFocus={() => onFocus('password')}
              onBlur={onBlur}
              className={`w-full px-4 py-3 pr-12 bg-[#1a1a1a] border-2 ${
                errors.password ? 'border-red-500' : focusedField === 'password' ? 'border-white' : 'border-gray-700'
              } rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300`}
              placeholder="Enter a strong password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.password}
            </p>
          )}
        </div>

        <div className={`transform transition-all duration-700 delay-400 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Confirm Password *
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={onInputChange}
              onFocus={() => onFocus('confirmPassword')}
              onBlur={onBlur}
              className={`w-full px-4 py-3 pr-12 bg-[#1a1a1a] border-2 ${
                errors.confirmPassword ? 'border-red-500' : focusedField === 'confirmPassword' ? 'border-white' : 'border-gray-700'
              } rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300`}
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div className={`transform transition-all duration-700 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Password Requirements:</h4>
            <ul className="space-y-2">
              <li className={`flex items-center gap-2 text-sm transition-colors duration-300 ${
                formData.password.length >= 8 ? 'text-green-400' : 'text-gray-500'
              }`}>
                <CheckCircle className={`h-4 w-4 ${
                  formData.password.length >= 8 ? 'text-green-500' : 'text-gray-600'
                }`} />
                <span>At least 8 characters</span>
              </li>
              <li className={`flex items-center gap-2 text-sm transition-colors duration-300 ${
                /(?=.*[a-z])/.test(formData.password) ? 'text-green-400' : 'text-gray-500'
              }`}>
                <CheckCircle className={`h-4 w-4 ${
                  /(?=.*[a-z])/.test(formData.password) ? 'text-green-500' : 'text-gray-600'
                }`} />
                <span>One lowercase letter</span>
              </li>
              <li className={`flex items-center gap-2 text-sm transition-colors duration-300 ${
                /(?=.*[A-Z])/.test(formData.password) ? 'text-green-400' : 'text-gray-500'
              }`}>
                <CheckCircle className={`h-4 w-4 ${
                  /(?=.*[A-Z])/.test(formData.password) ? 'text-green-500' : 'text-gray-600'
                }`} />
                <span>One uppercase letter</span>
              </li>
              <li className={`flex items-center gap-2 text-sm transition-colors duration-300 ${
                /(?=.*\d)/.test(formData.password) ? 'text-green-400' : 'text-gray-500'
              }`}>
                <CheckCircle className={`h-4 w-4 ${
                  /(?=.*\d)/.test(formData.password) ? 'text-green-500' : 'text-gray-600'
                }`} />
                <span>One number</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={`transform transition-all duration-700 delay-600 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <button
            onClick={onSubmit}
            disabled={loading || !isPasswordFormValid()}
            className="w-full bg-white text-black py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                Securing Account...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}