"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  User, 
  Store, 
  Mail, 
  Phone, 
  Globe,
  AlertCircle,
  ArrowRight,
  Loader2,
  Sparkles,
  Zap
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
  onBlur
}: BusinessDetailsFormProps) {
  const isFormValid = () => {
    return formData.ownerName.trim() && 
           formData.businessName.trim() && 
           formData.businessDescription.trim().length >= 20 && 
           formData.email.trim() && 
           /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
  }

  return (
    <div className="max-w-md mx-auto h-full">
      <div className="text-center mb-8">
        {selectedCategory && (
          <div className="overflow-hidden mb-4">
            <div className={`flex items-center justify-center transform transition-all duration-800 delay-500 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className={`w-10 h-10 rounded-xl ${selectedCategory.bgColor} dark:bg-opacity-20 flex items-center justify-center mr-3 transform transition-all duration-500 hover:scale-110 hover:rotate-3`}>
                <selectedCategory.icon className={`h-5 w-5 ${selectedCategory.color}`} />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                {selectedCategory.name}
              </h2>
            </div>
          </div>
        )}
        <div className="overflow-hidden mb-4">
          <div className={`flex items-center justify-center transform transition-all duration-800 delay-700 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Zap className="h-5 w-5 text-blue-500 mr-2" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">Step 2 of 6</span>
          </div>
        </div>
        <div className="overflow-hidden">
          <p className={`text-lg text-gray-600 dark:text-gray-300 transform transition-all duration-1000 delay-900 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            Tell us about your business
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
        {[
          { name: 'ownerName', label: 'Your Name', icon: User, type: 'text', placeholder: 'Your full name', required: true },
          { name: 'businessName', label: 'Business Name', icon: Store, type: 'text', placeholder: 'Enter your business name', required: true },
          { name: 'email', label: 'Email Address', icon: Mail, type: 'email', placeholder: 'your@email.com', required: true },
          { name: 'phone', label: 'Phone Number', icon: Phone, type: 'tel', placeholder: '+1234567890', required: false },
        ].map((field, index) => (
          <div key={field.name} className="space-y-2 overflow-hidden">
            <div className={`transform transition-all duration-800 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{animationDelay: `${1100 + index * 100}ms`}}>
              <Label 
                htmlFor={field.name} 
                className="text-gray-700 dark:text-gray-300 font-medium flex items-center space-x-2 transition-all duration-300"
              >
                <field.icon className={`h-4 w-4 transition-all duration-300 ${focusedField === field.name ? 'text-blue-500 scale-110' : ''}`} />
                <span>{field.label} {field.required && '*'}</span>
              </Label>
              <Input
                id={field.name}
                name={field.name}
                type={field.type}
                value={formData[field.name as keyof FormData]}
                onChange={onInputChange}
                onFocus={() => onFocus(field.name)}
                onBlur={onBlur}
                disabled={loading}
                className={`border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-800 dark:text-white disabled:opacity-50 transition-all duration-300 transform focus:scale-105 ${
                  errors[field.name] ? 'border-red-500 shake' : ''
                } ${focusedField === field.name ? 'shadow-lg' : ''}`}
                placeholder={field.placeholder}
              />
              {errors[field.name] && (
                <p className="text-red-500 dark:text-red-400 text-sm flex items-center space-x-1 animate-in slide-in-from-left-2 duration-300">
                  <AlertCircle className="h-3 w-3 animate-pulse" />
                  <span>{errors[field.name]}</span>
                </p>
              )}
            </div>
          </div>
        ))}

        <div className="space-y-2 overflow-hidden">
          <div className={`transform transition-all duration-800 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{animationDelay: '1500ms'}}>
            <Label htmlFor="businessDescription" className="text-gray-700 dark:text-gray-300 font-medium">
              Business Description *
            </Label>
            <Textarea
              id="businessDescription"
              name="businessDescription"
              value={formData.businessDescription}
              onChange={onInputChange}
              onFocus={() => onFocus('businessDescription')}
              onBlur={onBlur}
              disabled={loading}
              className={`border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-800 dark:text-white min-h-[100px] resize-none disabled:opacity-50 transition-all duration-300 transform focus:scale-105 ${
                errors.businessDescription ? 'border-red-500' : ''
              } ${focusedField === 'businessDescription' ? 'shadow-lg' : ''}`}
              placeholder="Describe your business and services... (minimum 20 characters)"
            />
            <div className="flex justify-between items-start">
              <div>
                {errors.businessDescription && (
                  <p className="text-red-500 dark:text-red-400 text-sm flex items-center space-x-1 animate-in slide-in-from-left-2 duration-300">
                    <AlertCircle className="h-3 w-3 animate-pulse" />
                    <span>{errors.businessDescription}</span>
                  </p>
                )}
              </div>
              <p className={`text-xs transition-all duration-300 ${
                formData.businessDescription.length < 20 ? 'text-red-500 dark:text-red-400 animate-pulse' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {formData.businessDescription.length}/20 min
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2 overflow-hidden">
          <div className={`transform transition-all duration-800 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{animationDelay: '1600ms'}}>
            <Label htmlFor="websiteUrl" className="text-gray-700 dark:text-gray-300 font-medium flex items-center space-x-2">
              <Globe className={`h-4 w-4 transition-all duration-300 ${focusedField === 'websiteUrl' ? 'text-blue-500 scale-110' : ''}`} />
              <span>Website URL</span>
            </Label>
            <Input
              id="websiteUrl"
              name="websiteUrl"
              type="url"
              value={formData.websiteUrl}
              onChange={onInputChange}
              onFocus={() => onFocus('websiteUrl')}
              onBlur={onBlur}
              disabled={loading}
              className={`border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-800 dark:text-white disabled:opacity-50 transition-all duration-300 transform focus:scale-105 ${
                errors.websiteUrl ? 'border-red-500' : ''
              } ${focusedField === 'websiteUrl' ? 'shadow-lg' : ''}`}
              placeholder="https://yourwebsite.com"
            />
            {errors.websiteUrl && (
              <p className="text-red-500 dark:text-red-400 text-sm flex items-center space-x-1 animate-in slide-in-from-left-2 duration-300">
                <AlertCircle className="h-3 w-3 animate-pulse" />
                <span>{errors.websiteUrl}</span>
              </p>
            )}
          </div>
        </div>

        <div className="overflow-hidden">
          <Button
            onClick={onSubmit}
            disabled={loading || !isFormValid()}
            className={`w-full bg-black dark:bg-white text-white dark:text-black text-lg py-3 hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-500 font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 hover:shadow-2xl group relative overflow-hidden transform transition-all duration-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            style={{animationDelay: '1700ms'}}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            
            <div className="relative z-10 flex items-center space-x-2">
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 group-hover:animate-pulse" />
                  <span>Continue</span>
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </div>
          </Button>
        </div>

        <div className="overflow-hidden">
          <p className={`text-gray-500 dark:text-gray-400 text-sm text-center transform transition-all duration-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{animationDelay: '1800ms'}}>
            * Required fields
          </p>
        </div>
      </div>
    </div>
  )
}