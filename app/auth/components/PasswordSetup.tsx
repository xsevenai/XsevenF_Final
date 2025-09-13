"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Shield, 
  AlertCircle,
  ArrowRight,
  Loader2,
  CheckCircle
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
  onBlur
}: PasswordSetupProps) {
  const isPasswordFormValid = () => {
    return formData.password.length >= 8 && 
           /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password) &&
           formData.password === formData.confirmPassword
  }

  return (
    <div className="max-w-md mx-auto h-full">
      <div className="text-center mb-8">
        <div className="overflow-hidden mb-4">
          <div className={`flex items-center justify-center transform transition-all duration-800 delay-500 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Shield className="h-6 w-6 text-blue-500 mr-2" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">Step 3 of 6</span>
          </div>
        </div>
        
        <div className="overflow-hidden mb-4">
          <h2 className={`text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight transform transition-all duration-1200 delay-700 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
            Secure Your Account
          </h2>
        </div>
        
        <div className="overflow-hidden">
          <p className={`text-lg text-gray-600 dark:text-gray-300 transform transition-all duration-1000 delay-900 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            Create a strong password for your account
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
        <div className="space-y-2 overflow-hidden">
          <div className={`transform transition-all duration-800 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{animationDelay: '1100ms'}}>
            <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium flex items-center space-x-2">
              <Shield className={`h-4 w-4 transition-all duration-300 ${focusedField === 'password' ? 'text-blue-500 scale-110' : ''}`} />
              <span>Password *</span>
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={onInputChange}
              onFocus={() => onFocus('password')}
              onBlur={onBlur}
              disabled={loading}
              className={`border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-800 dark:text-white disabled:opacity-50 transition-all duration-300 transform focus:scale-105 ${
                errors.password ? 'border-red-500 shake' : ''
              } ${focusedField === 'password' ? 'shadow-lg' : ''}`}
              placeholder="Enter a strong password"
            />
            {errors.password && (
              <p className="text-red-500 dark:text-red-400 text-sm flex items-center space-x-1 animate-in slide-in-from-left-2 duration-300">
                <AlertCircle className="h-3 w-3 animate-pulse" />
                <span>{errors.password}</span>
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2 overflow-hidden">
          <div className={`transform transition-all duration-800 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{animationDelay: '1200ms'}}>
            <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300 font-medium flex items-center space-x-2">
              <Shield className={`h-4 w-4 transition-all duration-300 ${focusedField === 'confirmPassword' ? 'text-blue-500 scale-110' : ''}`} />
              <span>Confirm Password *</span>
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={onInputChange}
              onFocus={() => onFocus('confirmPassword')}
              onBlur={onBlur}
              disabled={loading}
              className={`border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-800 dark:text-white disabled:opacity-50 transition-all duration-300 transform focus:scale-105 ${
                errors.confirmPassword ? 'border-red-500 shake' : ''
              } ${focusedField === 'confirmPassword' ? 'shadow-lg' : ''}`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 dark:text-red-400 text-sm flex items-center space-x-1 animate-in slide-in-from-left-2 duration-300">
                <AlertCircle className="h-3 w-3 animate-pulse" />
                <span>{errors.confirmPassword}</span>
              </p>
            )}
          </div>
        </div>

        <div className="overflow-hidden">
          <div className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-4 transform transition-all duration-800 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{animationDelay: '1300ms'}}>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password Requirements:</h4>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li className={`flex items-center space-x-2 transition-colors duration-300 ${formData.password.length >= 8 ? 'text-green-600 dark:text-green-400' : ''}`}>
                <CheckCircle className={`h-3 w-3 ${formData.password.length >= 8 ? 'text-green-500' : 'text-gray-400'}`} />
                <span>At least 8 characters</span>
              </li>
              <li className={`flex items-center space-x-2 transition-colors duration-300 ${/(?=.*[a-z])/.test(formData.password) ? 'text-green-600 dark:text-green-400' : ''}`}>
                <CheckCircle className={`h-3 w-3 ${/(?=.*[a-z])/.test(formData.password) ? 'text-green-500' : 'text-gray-400'}`} />
                <span>One lowercase letter</span>
              </li>
              <li className={`flex items-center space-x-2 transition-colors duration-300 ${/(?=.*[A-Z])/.test(formData.password) ? 'text-green-600 dark:text-green-400' : ''}`}>
                <CheckCircle className={`h-3 w-3 ${/(?=.*[A-Z])/.test(formData.password) ? 'text-green-500' : 'text-gray-400'}`} />
                <span>One uppercase letter</span>
              </li>
              <li className={`flex items-center space-x-2 transition-colors duration-300 ${/(?=.*\d)/.test(formData.password) ? 'text-green-600 dark:text-green-400' : ''}`}>
                <CheckCircle className={`h-3 w-3 ${/(?=.*\d)/.test(formData.password) ? 'text-green-500' : 'text-gray-400'}`} />
                <span>One number</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="overflow-hidden">
          <Button
            onClick={onSubmit}
            disabled={loading || !isPasswordFormValid()}
            className={`w-full bg-black dark:bg-white text-white dark:text-black text-lg py-3 hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-500 font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 hover:shadow-2xl group relative overflow-hidden transform transition-all duration-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            style={{animationDelay: '1400ms'}}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            
            <div className="relative z-10 flex items-center space-x-2">
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Securing Account...</span>
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5 group-hover:animate-pulse" />
                  <span>Continue</span>
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}