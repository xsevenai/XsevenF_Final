"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    // Clear error when user starts typing
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const supabase = createClient()

      if (isLogin) {
        // Sign in existing user
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })

        if (signInError) {
          throw new Error(signInError.message)
        }

        if (data.user && data.session) {
          // Check if profile exists
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single()

          if (profileError && profileError.code !== 'PGRST116') {
            console.error('Profile fetch error:', profileError)
          }

          // Store session and redirect
          localStorage.setItem("supabase_session", JSON.stringify(data.session))
          localStorage.setItem("x7_auth", data.session.access_token)
          
          // Try to integrate with FastAPI
          await checkOrCreateBusinessAccount(data.user, data.session.access_token)
          
          window.location.href = "/dashboard"
        }
      } else {
        // Sign up new user
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match")
          return
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
            },
          },
        })

        if (signUpError) {
          throw new Error(signUpError.message)
        }

        if (data.user) {
          if (data.user.email_confirmed_at && data.session) {
            // User is immediately confirmed, create profile and redirect
            await createUserProfile(data.user, data.session.access_token)
            
            localStorage.setItem("supabase_session", JSON.stringify(data.session))
            localStorage.setItem("x7_auth", data.session.access_token)
            
            // Try to integrate with FastAPI
            await checkOrCreateBusinessAccount(data.user, data.session.access_token)
            
            window.location.href = "/dashboard"
          } else {
            // User needs to confirm email, but still create profile for when they confirm
            if (data.user.id) {
              await createUserProfile(data.user)
            }
            setError("Please check your email and click the confirmation link to complete your registration.")
          }
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error)
      setError(error.message || "Authentication failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const createUserProfile = async (user: any, accessToken?: string) => {
    try {
      const supabase = createClient()
      
      // Check if profile already exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      if (checkError && checkError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              user_id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || formData.name || null,
              role: 'user', // default role
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          ])

        if (insertError) {
          console.error('Profile creation error:', insertError)
          throw new Error('Failed to create user profile')
        }
      }
    } catch (error) {
      console.error('Error creating user profile:', error)
      // Don't throw error here as we don't want to break the auth flow
    }
  }

  const checkOrCreateBusinessAccount = async (user: any, accessToken: string) => {
    try {
      const baseUrl = localStorage.getItem("x7_api_base_url") || "https://cabcb9e430f1.ngrok-free.app"

      const response = await fetch(`${baseUrl}/api/business/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      })

      if (response.ok) {
        const businessData = await response.json()
        localStorage.setItem("x7_business_data", JSON.stringify(businessData))
      } else if (response.status === 404) {
        const createResponse = await fetch(`${baseUrl}/api/business/create`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({
            name: user.user_metadata?.full_name || formData.name || user.email,
            email: user.email,
            user_id: user.id,
            category: "restaurant",
          }),
        })

        if (createResponse.ok) {
          const newBusinessData = await createResponse.json()
          localStorage.setItem("x7_business_data", JSON.stringify(newBusinessData))
        }
      }
    } catch (error) {
      console.error("FastAPI integration error:", error)
      // Continue anyway, as this is optional
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-hidden">
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

      <nav className="relative z-10 p-4 md:p-6 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-white/80 hover:text-[#FFD700] transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
          <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white via-[#FFD700] to-[#B76E79] bg-clip-text text-transparent">
            X-SevenAI
          </div>
          <div className="w-24"></div>
        </div>
      </nav>

      <section className="relative z-10 px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-[#FFD700] to-[#B76E79] bg-clip-text text-transparent">
              {isLogin ? "Welcome Back" : "Join X-SevenAI"}
            </h1>
            <p className="text-white/80 text-lg">
              {isLogin ? "Sign in to your liquid intelligence" : "Start your AI journey today"}
            </p>
          </div>

          <Card className="bg-white/15 backdrop-blur-md border-white/20 p-6 md:p-8 hover:bg-white/20 transition-all duration-300">
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white/90 flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Full Name</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required={!isLogin}
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-[#FFD700] focus:ring-[#FFD700] disabled:opacity-50"
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/90 flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-[#FFD700] focus:ring-[#FFD700] disabled:opacity-50"
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/90 flex items-center space-x-2">
                  <Lock className="h-4 w-4" />
                  <span>Password</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-[#FFD700] focus:ring-[#FFD700] pr-10 disabled:opacity-50"
                    placeholder="Enter your password"
                  />
                  <Button
                    type="button"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent hover:bg-white/10 text-white/60 hover:text-white h-8 w-8 disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white/90 flex items-center space-x-2">
                    <Lock className="h-4 w-4" />
                    <span>Confirm Password</span>
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required={!isLogin}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-[#FFD700] focus:ring-[#FFD700] disabled:opacity-50"
                    placeholder="Confirm your password"
                  />
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#FFD700] to-[#B76E79] text-black text-lg py-3 hover:scale-105 transition-transform font-semibold disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>{isLogin ? "Signing In..." : "Creating Account..."}</span>
                  </div>
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Start Free Trial"
                )}
              </Button>

              {isLogin && (
                <div className="text-center">
                  <Link href="#" className="text-[#FFD700] hover:text-[#FFD700]/80 text-sm">
                    Forgot your password?
                  </Link>
                </div>
              )}
            </form>

            <div className="mt-8 pt-6 border-t border-white/20 text-center">
              <p className="text-white/80 mb-4">{isLogin ? "Don't have an account?" : "Already have an account?"}</p>
              <Button
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError("")
                  setFormData({ name: "", email: "", password: "", confirmPassword: "" })
                }}
                disabled={loading}
                className="bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-[#FFD700] transition-all disabled:opacity-50"
              >
                {isLogin ? "Create Account" : "Sign In Instead"}
              </Button>
            </div>

            {!isLogin && (
              <div className="mt-6 text-center">
                <Card className="bg-white/10 backdrop-blur-md border-white/20 p-4">
                  <p className="text-white/80 text-sm mb-2">✨ What you get with your free trial:</p>
                  <ul className="text-white/70 text-sm space-y-1">
                    <li>• 100 AI interactions</li>
                    <li>• WhatsApp integration</li>
                    <li>• 14 days free access</li>
                    <li>• No credit card required</li>
                  </ul>
                </Card>
              </div>
            )}
          </Card>
        </div>
      </section>
    </div>
  )
}