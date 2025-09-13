"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Building2,
  Users,
  Phone,
  Mail,
  MapPin,
  Globe,
  Eye,
  EyeOff,
  Check,
  Star,
  MessageSquare,
  TrendingUp,
  User,
} from "lucide-react"
import Link from "next/link"

export default function BusinessSignupPage() {
  const [formData, setFormData] = useState({
    accountType: "",
    businessCategory: "",
    businessName: "",
    email: "",
    location: "",
    website: "",
    adminName: "",
    adminEmail: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleAccountTypeSelect = (type: string) => {
    setFormData({ ...formData, accountType: type })
    if (type === "business") {
      setCurrentStep(2)
    }
  }

  const handleCategorySelect = (category: string) => {
    setFormData({ ...formData, businessCategory: category })
    setCurrentStep(3)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Business signup:", formData)
  }

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/20 via-transparent to-[#B76E79]/20"
          style={{ animation: "pulse 8s ease-in-out infinite" }}
        ></div>
        <div
          className="absolute top-1/4 left-1/4 w-48 h-48 md:w-96 md:h-96 bg-[#FFD700]/10 rounded-full blur-3xl"
          style={{ animation: "bounce 6s ease-in-out infinite" }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-40 h-40 md:w-80 md:h-80 bg-[#B76E79]/10 rounded-full blur-3xl"
          style={{ animation: "pulse 10s ease-in-out infinite" }}
        ></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-4 md:p-6 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-5 w-5 text-[#FFD700]" />
            <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#FFD700] to-[#B76E79] bg-clip-text text-transparent">
              X-SevenAI
            </div>
          </Link>
          <Link href="/auth" className="text-white/80 hover:text-[#FFD700] transition-colors">
            Already have an account? Login
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 min-h-[600px]">
            {/* Left Side - Features */}
            <div className="space-y-6 flex flex-col justify-center">
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#FFD700] to-[#B76E79] bg-clip-text text-transparent">
                  Start Your 7-Day Free Trial
                </h1>
                <p className="text-lg md:text-xl text-white/80 mb-6">
                  Join 500+ businesses already capturing missed revenue with AI
                </p>
                <div className="flex flex-wrap gap-3 mb-8">
                  <Badge className="bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30 px-3 py-2">
                    €400+ daily revenue
                  </Badge>
                  <Badge className="bg-[#B76E79]/20 text-[#B76E79] border border-[#B76E79]/30 px-3 py-2">
                    30% more bookings
                  </Badge>
                  <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-2">
                    2 sec response time
                  </Badge>
                </div>
              </div>

              <Card className="bg-white/15 backdrop-blur-md border-white/20 p-6 hover:bg-white/20 transition-all duration-300">
                <h3 className="text-xl font-bold mb-4 text-[#FFD700]">Why Choose X-SevenAI?</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-[#FFD700] mr-3 flex-shrink-0" />
                    <span className="text-sm text-white/90">Never miss calls - AI answers 24/7</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 text-[#B76E79] mr-3 flex-shrink-0" />
                    <span className="text-sm text-white/90">Multi-channel support (WhatsApp, calls, QR codes)</span>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-[#FFD700] mr-3 flex-shrink-0" />
                    <span className="text-sm text-white/90">Real-time analytics and insights</span>
                  </div>
                </div>
              </Card>

              <Card className="bg-white/15 backdrop-blur-md border-white/20 p-6">
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-[#FFD700] fill-current" />
                  ))}
                </div>
                <blockquote className="text-white/90 mb-3 italic text-sm">
                  "X-SevenAI increased our daily revenue by €400 from calls we used to miss. Setup took 15 minutes!"
                </blockquote>
                <cite className="text-[#FFD700] font-semibold text-sm">— Maria, Restaurant Owner</cite>
              </Card>
            </div>

            {/* Right Side - Registration Flow */}
            <div className="flex flex-col justify-center">
              <Card className="bg-white/20 backdrop-blur-md border-white/30 p-6 md:p-8 min-h-[500px] flex flex-col justify-center">
                {currentStep === 1 && (
                  <div className="space-y-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-[#FFD700] to-[#B76E79] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building2 className="h-8 w-8 text-black" />
                      </div>
                      <h2 className="text-2xl font-bold mb-2">Choose Account Type</h2>
                      <p className="text-white/70 text-sm">Select the option that best describes you</p>
                    </div>

                    <div className="space-y-4">
                      <button
                        onClick={() => handleAccountTypeSelect("personal")}
                        className="w-full p-6 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-[#FFD700]/50 rounded-lg transition-all duration-300 text-left group"
                      >
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-[#FFD700]/20 rounded-lg flex items-center justify-center mr-4 group-hover:bg-[#FFD700]/30 transition-colors">
                            <User className="h-6 w-6 text-[#FFD700]" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold">Personal Account</h3>
                            <p className="text-white/70 text-sm">For individual users and customers</p>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleAccountTypeSelect("business")}
                        className="w-full p-6 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-[#FFD700]/50 rounded-lg transition-all duration-300 text-left group"
                      >
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-[#B76E79]/20 rounded-lg flex items-center justify-center mr-4 group-hover:bg-[#B76E79]/30 transition-colors">
                            <Building2 className="h-6 w-6 text-[#B76E79]" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold">Business Account</h3>
                            <p className="text-white/70 text-sm">For businesses wanting to use our AI platform</p>
                          </div>
                        </div>
                      </button>
                    </div>

                    <div className="text-center pt-4">
                      <div className="flex items-center justify-center space-x-2 text-white/60 text-xs">
                        <Check className="h-4 w-4 text-green-400" />
                        <span>No credit card required</span>
                        <span>•</span>
                        <span>7-day free trial</span>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <button onClick={prevStep} className="text-[#FFD700] hover:text-[#FFD700]/80 mb-4">
                        ← Back
                      </button>
                      <h2 className="text-2xl font-bold mb-8">Select Your Business Category</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { id: "restaurant", name: "Restaurant/Cafe", icon: "🍽️" },
                        { id: "beauty", name: "Beauty Salon/Spa", icon: "💄" },
                        { id: "medical", name: "Medical/Dental", icon: "🏥" },
                        { id: "auto", name: "Auto Repair", icon: "🔧" },
                        { id: "fitness", name: "Fitness/Gym", icon: "💪" },
                        { id: "retail", name: "Retail Store", icon: "🛍️" },
                        { id: "services", name: "Local Services", icon: "🔨" },
                        { id: "other", name: "Other", icon: "📋" },
                      ].map((category) => (
                        <button
                          key={category.id}
                          onClick={() => handleCategorySelect(category.id)}
                          className="p-4 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-[#FFD700]/50 rounded-lg transition-all duration-300 text-center"
                        >
                          <div className="text-2xl mb-2">{category.icon}</div>
                          <div className="text-sm font-medium">{category.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <button onClick={prevStep} className="text-[#FFD700] hover:text-[#FFD700]/80 mb-4">
                        ← Back
                      </button>
                      <h2 className="text-2xl font-bold mb-8">Business Details</h2>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Business Name *</label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                          <input
                            type="text"
                            name="businessName"
                            required
                            className="w-full bg-white/10 text-white placeholder-white/60 border border-white/20 rounded-lg pl-10 pr-4 py-3 outline-none focus:border-[#FFD700]"
                            placeholder="Your Business Name"
                            value={formData.businessName}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Business Email *</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                          <input
                            type="email"
                            name="email"
                            required
                            className="w-full bg-white/10 text-white placeholder-white/60 border border-white/20 rounded-lg pl-10 pr-4 py-3 outline-none focus:border-[#FFD700]"
                            placeholder="business@example.com"
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Location *</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                          <input
                            type="text"
                            name="location"
                            required
                            className="w-full bg-white/10 text-white placeholder-white/60 border border-white/20 rounded-lg pl-10 pr-4 py-3 outline-none focus:border-[#FFD700]"
                            placeholder="City, Country"
                            value={formData.location}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Website (Optional)</label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                          <input
                            type="url"
                            name="website"
                            className="w-full bg-white/10 text-white placeholder-white/60 border border-white/20 rounded-lg pl-10 pr-4 py-3 outline-none focus:border-[#FFD700]"
                            placeholder="https://yourbusiness.com"
                            value={formData.website}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <Button onClick={nextStep} className="w-full bg-[#FFD700] text-black hover:bg-[#FFD700]/90 py-3">
                        Continue
                      </Button>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <button onClick={prevStep} className="text-[#FFD700] hover:text-[#FFD700]/80 mb-4">
                        ← Back
                      </button>
                      <h2 className="text-2xl font-bold mb-8">Admin Account Setup</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Admin Name *</label>
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                          <input
                            type="text"
                            name="adminName"
                            required
                            className="w-full bg-white/10 text-white placeholder-white/60 border border-white/20 rounded-lg pl-10 pr-4 py-3 outline-none focus:border-[#FFD700]"
                            placeholder="Your Full Name"
                            value={formData.adminName}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Admin Email *</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                          <input
                            type="email"
                            name="adminEmail"
                            required
                            className="w-full bg-white/10 text-white placeholder-white/60 border border-white/20 rounded-lg pl-10 pr-4 py-3 outline-none focus:border-[#FFD700]"
                            placeholder="admin@yourbusiness.com"
                            value={formData.adminEmail}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Password *</label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            required
                            className="w-full bg-white/10 text-white placeholder-white/60 border border-white/20 rounded-lg px-4 py-3 pr-12 outline-none focus:border-[#FFD700]"
                            placeholder="Create a strong password"
                            value={formData.password}
                            onChange={handleInputChange}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>

                      <div className="bg-white/10 rounded-lg p-4 space-y-2">
                        <h3 className="font-semibold text-[#FFD700] mb-2">What happens next:</h3>
                        <div className="flex items-center text-sm text-white/80">
                          <Check className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                          <span>7-day free trial starts immediately</span>
                        </div>
                        <div className="flex items-center text-sm text-white/80">
                          <Check className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                          <span>15-minute setup call with our team</span>
                        </div>
                        <div className="flex items-center text-sm text-white/80">
                          <Check className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                          <span>No credit card required</span>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#FFD700] to-[#B76E79] text-black hover:scale-105 transition-transform py-3"
                      >
                        Start My Free Trial
                      </Button>
                    </form>

                    <div className="text-center text-sm text-white/60">
                      By signing up, you agree to our Terms of Service and Privacy Policy
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
