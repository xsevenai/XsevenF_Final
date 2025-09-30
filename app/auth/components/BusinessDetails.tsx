"use client"

import React from "react"
import { AlertCircle } from "lucide-react"
import { BusinessCategory } from "@/lib/types"

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

interface BusinessDetailsFormProps {
  selectedCategory: BusinessCategory | null
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

export default function BusinessDetailsForm({
  selectedCategory,
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
}: BusinessDetailsFormProps) {
  const isFormValid = () => {
    return formData.ownerName.trim() && 
           formData.businessName.trim() && 
           formData.businessDescription.trim().length >= 20 && 
           formData.email.trim() && 
           /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
  }

  return (
    <div className="h-screen bg-[#0a0a0a] flex items-center justify-center px-6 overflow-hidden">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            Help us personalize your experience
          </h1>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {submitError && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-400">{submitError}</p>
            </div>
          )}

          {/* Owner Name */}
          <div>
            <label className="block text-sm font-normal text-white mb-2">
              What's your name?
            </label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={onInputChange}
              onFocus={() => onFocus('ownerName')}
              onBlur={onBlur}
              className="w-full px-4 py-2.5 bg-transparent border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors text-sm"
              placeholder="Elizabeth"
            />
            {errors.ownerName && (
              <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.ownerName}
              </p>
            )}
          </div>

          {/* Business Name */}
          <div>
            <label className="block text-sm font-normal text-white mb-2">
              Business Name *
            </label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={onInputChange}
              onFocus={() => onFocus('businessName')}
              onBlur={onBlur}
              className="w-full px-4 py-2.5 bg-transparent border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors text-sm"
              placeholder="My Business"
            />
            {errors.businessName && (
              <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.businessName}
              </p>
            )}
          </div>

          {/* Business Description */}
          <div>
            <label className="block text-sm font-normal text-white mb-2">
              Business Description *
            </label>
            <textarea
              name="businessDescription"
              value={formData.businessDescription}
              onChange={onInputChange}
              onFocus={() => onFocus('businessDescription')}
              onBlur={onBlur}
              rows={2}
              className="w-full px-4 py-2.5 bg-transparent border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors resize-none text-sm"
              placeholder="Describe what your business does..."
            />
            <div className="flex justify-end mt-1">
              <p className={`text-xs ${
                formData.businessDescription.length < 20 ? 'text-red-400' : 'text-gray-500'
              }`}>
                {formData.businessDescription.length}/20 min
              </p>
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-sm font-normal text-white mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onInputChange}
              onFocus={() => onFocus('email')}
              onBlur={onBlur}
              className="w-full px-4 py-2.5 bg-transparent border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors text-sm"
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-normal text-white mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={onInputChange}
              onFocus={() => onFocus('phone')}
              onBlur={onBlur}
              className="w-full px-4 py-2.5 bg-transparent border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors text-sm"
              placeholder="+1 234 567 8900"
            />
          </div>

          {/* Website URL */}
          <div>
            <label className="block text-sm font-normal text-white mb-2">
              Website URL
            </label>
            <input
              type="url"
              name="websiteUrl"
              value={formData.websiteUrl}
              onChange={onInputChange}
              onFocus={() => onFocus('websiteUrl')}
              onBlur={onBlur}
              className="w-full px-4 py-2.5 bg-transparent border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors text-sm"
              placeholder="https://yourbusiness.com"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onBack}
              disabled={loading}
              className="px-6 py-2.5 text-white text-sm font-medium rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <button
              onClick={onSubmit}
              disabled={loading || !isFormValid()}
              className="flex-1 px-6 py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Next'}
            </button>
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mt-8">
          <div className="w-2 h-2 rounded-full bg-gray-700"></div>
          <div className="w-2 h-2 rounded-full bg-white"></div>
          <div className="w-2 h-2 rounded-full bg-gray-700"></div>
          <div className="w-2 h-2 rounded-full bg-gray-700"></div>
          <div className="w-2 h-2 rounded-full bg-gray-700"></div>
          <div className="w-2 h-2 rounded-full bg-gray-700"></div>
          <div className="w-2 h-2 rounded-full bg-gray-700"></div>
          <div className="w-2 h-2 rounded-full bg-gray-700"></div>
        </div>
      </div>
    </div>
  )
}