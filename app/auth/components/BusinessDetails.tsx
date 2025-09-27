"use client"

import React from "react"
import { 
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles
} from "lucide-react"
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
        {selectedCategory && (
          <div className="overflow-hidden mb-4">
            <div className={`transform transition-all duration-800 delay-500 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h2 className="text-2xl lg:text-3xl font-bold text-white">
                {selectedCategory.name}
              </h2>
            </div>
          </div>
        )}
        <div className="overflow-hidden mb-4">
          <div className={`flex items-center justify-center transform transition-all duration-800 delay-700 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            
            <span className="text-sm font-medium text-gray-400 uppercase tracking-wide">Step 2 of 6</span>
          </div>
        </div>
        <div className="overflow-hidden">
          <p className={`text-lg text-gray-400 transform transition-all duration-1000 delay-900 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            Tell us about your business
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
            Owner Name *
          </label>
          <input
            type="text"
            name="ownerName"
            value={formData.ownerName}
            onChange={onInputChange}
            onFocus={() => onFocus('ownerName')}
            onBlur={onBlur}
            className={`w-full px-4 py-3 bg-[#1a1a1a] border-2 ${
              errors.ownerName ? 'border-red-500' : focusedField === 'ownerName' ? 'border-white' : 'border-gray-700'
            } rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300`}
            placeholder="John Doe"
          />
          {errors.ownerName && (
            <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.ownerName}
            </p>
          )}
        </div>

        <div className={`transform transition-all duration-700 delay-400 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Business Name *
          </label>
          <input
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={onInputChange}
            onFocus={() => onFocus('businessName')}
            onBlur={onBlur}
            className={`w-full px-4 py-3 bg-[#1a1a1a] border-2 ${
              errors.businessName ? 'border-red-500' : focusedField === 'businessName' ? 'border-white' : 'border-gray-700'
            } rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300`}
            placeholder="My Business"
          />
          {errors.businessName && (
            <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.businessName}
            </p>
          )}
        </div>

        <div className={`transform transition-all duration-700 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Business Description *
          </label>
          <textarea
            name="businessDescription"
            value={formData.businessDescription}
            onChange={onInputChange}
            onFocus={() => onFocus('businessDescription')}
            onBlur={onBlur}
            rows={4}
            className={`w-full px-4 py-3 bg-[#1a1a1a] border-2 ${
              errors.businessDescription ? 'border-red-500' : focusedField === 'businessDescription' ? 'border-white' : 'border-gray-700'
            } rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 resize-none`}
            placeholder="Describe what your business does..."
          />
          <div className="flex justify-between items-start mt-2">
            {errors.businessDescription && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.businessDescription}
              </p>
            )}
            <p className={`text-xs ml-auto ${
              formData.businessDescription.length < 20 ? 'text-red-500' : 'text-gray-500'
            }`}>
              {formData.businessDescription.length}/20 min
            </p>
          </div>
        </div>

        <div className={`transform transition-all duration-700 delay-600 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onInputChange}
            onFocus={() => onFocus('email')}
            onBlur={onBlur}
            className={`w-full px-4 py-3 bg-[#1a1a1a] border-2 ${
              errors.email ? 'border-red-500' : focusedField === 'email' ? 'border-white' : 'border-gray-700'
            } rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300`}
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.email}
            </p>
          )}
        </div>

        <div className={`transform transition-all duration-700 delay-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={onInputChange}
            onFocus={() => onFocus('phone')}
            onBlur={onBlur}
            className={`w-full px-4 py-3 bg-[#1a1a1a] border-2 ${
              errors.phone ? 'border-red-500' : focusedField === 'phone' ? 'border-white' : 'border-gray-700'
            } rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300`}
            placeholder="+1 234 567 8900"
          />
          {errors.phone && (
            <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.phone}
            </p>
          )}
        </div>

        <div className={`transform transition-all duration-700 delay-800 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Website URL
          </label>
          <input
            type="url"
            name="websiteUrl"
            value={formData.websiteUrl}
            onChange={onInputChange}
            onFocus={() => onFocus('websiteUrl')}
            onBlur={onBlur}
            className={`w-full px-4 py-3 bg-[#1a1a1a] border-2 ${
              errors.websiteUrl ? 'border-red-500' : focusedField === 'websiteUrl' ? 'border-white' : 'border-gray-700'
            } rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300`}
            placeholder="https://yourbusiness.com"
          />
          {errors.websiteUrl && (
            <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.websiteUrl}
            </p>
          )}
        </div>

        <div className={`transform transition-all duration-700 delay-900 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <button
            onClick={onSubmit}
            disabled={loading || !isFormValid()}
            className="w-full bg-white text-black py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </div>

        <div className={`transform transition-all duration-700 delay-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <p className="text-gray-500 text-sm text-center">
            * Required fields
          </p>
        </div>
      </div>
    </div>
  )
}