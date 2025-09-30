"use client"

import React from "react"
import { AlertCircle, ChevronLeft } from "lucide-react"
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
           formData.businessDescription.trim().length >= 20
  }

  return (
    <div className="h-screen bg-black text-white overflow-hidden flex flex-col">
      {/* Header with Logo */}
      <div className="flex items-center p-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8">
            <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="mask0" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
                <rect width="100" height="100" fill="#D9D9D9"/>
              </mask>
              <g mask="url(#mask0)">
                <path d="M199.939 7.77539C199.979 8.80162 200 9.83244 200 10.8672C200 60.0925 155.228 99.998 99.9998 99.998C76.1256 99.998 54.2058 92.54 37.0116 80.0967L56.3123 65.6543C68.6382 73.4766 83.7162 78.0771 99.9998 78.0771C141.645 78.0771 175.406 47.9874 175.407 10.8691H199.939V7.77539ZM24.6014 11.8418C24.7614 21.8758 27.389 31.3777 31.9666 39.8877L12.6707 54.3232C4.60097 41.4676 0.000196561 26.6472 -0.000152588 10.8691V0H24.5936V10.8691L24.6014 11.8418Z" fill="#E3D7D7"/>
                <path d="M99.9998 0.00012207V25.1818L-0.000183105 100L-15.6848 83.3468L66.6639 21.7394H-0.000183105V21.7384H32.1727C31.4657 18.2104 31.0975 14.5775 31.0975 10.8683V0.00012207H99.9998Z" fill="#C1FD3A"/>
              </g>
            </svg>
          </div>
          <span className="text-white text-xl font-semibold">XsevenAI</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className={`text-2xl font-bold text-white mb-3 transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              Help us personalize your experience
            </h1>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {submitError && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-2 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-400">{submitError}</p>
              </div>
            )}

            {/* Owner Name */}
            <div className={`transform transition-all duration-1000 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <label className="block text-sm font-normal text-white mb-1.5">
                What's your name?
              </label>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={onInputChange}
                onFocus={() => onFocus('ownerName')}
                onBlur={onBlur}
                className="w-full px-3 py-2.5 bg-transparent border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors text-sm"
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
            <div className={`transform transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <label className="block text-sm font-normal text-white mb-1.5">
                Business Name *
              </label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={onInputChange}
                onFocus={() => onFocus('businessName')}
                onBlur={onBlur}
                className="w-full px-3 py-2.5 bg-transparent border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors text-sm"
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
            <div className={`transform transition-all duration-1000 delay-400 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <label className="block text-sm font-normal text-white mb-1.5">
                Business Description *
              </label>
              <textarea
                name="businessDescription"
                value={formData.businessDescription}
                onChange={onInputChange}
                onFocus={() => onFocus('businessDescription')}
                onBlur={onBlur}
                rows={2}
                className="w-full px-3 py-2.5 bg-transparent border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors resize-none text-sm"
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

            {/* Phone Number */}
            <div className={`transform transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <label className="block text-sm font-normal text-white mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={onInputChange}
                onFocus={() => onFocus('phone')}
                onBlur={onBlur}
                className="w-full px-3 py-2.5 bg-transparent border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors text-sm"
                placeholder="+1 234 567 8900"
              />
            </div>

            {/* Website URL */}
            <div className={`transform transition-all duration-1000 delay-600 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <label className="block text-sm font-normal text-white mb-1.5">
                Website URL
              </label>
              <input
                type="url"
                name="websiteUrl"
                value={formData.websiteUrl}
                onChange={onInputChange}
                onFocus={() => onFocus('websiteUrl')}
                onBlur={onBlur}
                className="w-full px-3 py-2.5 bg-transparent border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors text-sm"
                placeholder="https://yourbusiness.com"
              />
            </div>

            {/* Buttons */}
            <div className={`flex justify-between items-center pt-4 transform transition-all duration-1000 delay-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              {/* Back Button */}
              <button
                onClick={onBack}
                disabled={loading}
                className="w-fit h-fit px-3 py-2 text-gray-400 hover:text-white transition-colors flex items-center gap-2 rounded-lg border border-gray-800 hover:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>

              {/* Next Button */}
              <button
                onClick={onSubmit}
                disabled={loading || !isFormValid()}
                className="px-6 py-2.5 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? 'Processing...' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center gap-2 pb-6 flex-shrink-0">
        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
        <div className="w-2 h-2 rounded-full bg-white"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
      </div>
    </div>
  )
}