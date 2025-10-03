// hooks/useTheme.ts - SSR Safe Version
"use client"

import { useState, useEffect } from 'react'

export type ThemeType = 'light' | 'dark'

interface ThemeColors {
  primaryBg: string
  secondaryBg: string
  cardBg: string
  headerBg: string
  borderPrimary: string
  borderSecondary: string
  textPrimary: string
  textSecondary: string
  textMuted: string
  accentPrimary: string
  accentSecondary: string
  success: string
  warning: string
  error: string
  info: string
  hover: string
  active: string
}

const lightTheme: ThemeColors = {
  primaryBg: 'bg-gray-50',
  secondaryBg: 'bg-white',
  cardBg: 'bg-white border-gray-200',
  headerBg: 'bg-white border-gray-200',
  borderPrimary: 'border-gray-200',
  borderSecondary: 'border-gray-100',
  textPrimary: 'text-gray-900',
  textSecondary: 'text-gray-600',
  textMuted: 'text-gray-500',
  accentPrimary: 'bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#B76E79] text-white',
  accentSecondary: 'bg-orange-50 text-orange-600',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  error: 'text-red-600',
  info: 'text-orange-600',
  hover: 'hover:bg-gray-100',
  active: 'bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#B76E79] text-white'
}

const darkTheme: ThemeColors = {
  primaryBg: 'bg-black',
  secondaryBg: 'bg-gray-900',
  cardBg: 'bg-gray-900 border-gray-800',
  headerBg: 'bg-gray-900 border-gray-800',
  borderPrimary: 'border-gray-800',
  borderSecondary: 'border-gray-700',
  textPrimary: 'text-white',
  textSecondary: 'text-gray-300',
  textMuted: 'text-gray-400',
  accentPrimary: 'bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] text-white',
  accentSecondary: 'bg-purple-500/20 text-purple-400',
  success: 'text-green-400',
  warning: 'text-yellow-400',
  error: 'text-red-400',
  info: 'text-blue-400',
  hover: 'hover:bg-gray-800',
  active: 'bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] text-white'
}

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('dark')
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    console.log('🎨 Theme hook initializing...')
    
    try {
      // Get theme from localStorage
      const savedTheme = localStorage.getItem('themePreference') as ThemeType
      console.log('📱 Saved theme from localStorage:', savedTheme)
      
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        console.log('✅ Valid theme found, applying:', savedTheme)
        setCurrentTheme(savedTheme)
        
        // Apply theme to document
        if (savedTheme === 'dark') {
          document.documentElement.classList.add('dark')
          console.log('🌙 Dark mode classes added to document')
        } else {
          document.documentElement.classList.remove('dark')
          console.log('☀️ Light mode classes applied to document')
        }
      } else {
        console.log('⚠️ No valid theme found, using dark as default')
        setCurrentTheme('dark')
        document.documentElement.classList.add('dark')
        localStorage.setItem('themePreference', 'dark')
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error)
      setCurrentTheme('dark')
      if (typeof document !== 'undefined') {
        document.documentElement.classList.add('dark')
      }
    }
    
    setIsLoaded(true)
    console.log('🚀 Theme hook loaded successfully')
  }, [isMounted])

  const toggleTheme = () => {
    if (!isMounted) return

    const newTheme: ThemeType = currentTheme === 'light' ? 'dark' : 'light'
    setCurrentTheme(newTheme)
    localStorage.setItem('themePreference', newTheme)
    
    // Apply theme transition
    document.documentElement.style.transition = 'all 0.3s ease-in-out'
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    // Remove transition after animation
    setTimeout(() => {
      document.documentElement.style.transition = ''
    }, 300)
  }

  const setTheme = (theme: ThemeType) => {
    if (!isMounted) return

    setCurrentTheme(theme)
    localStorage.setItem('themePreference', theme)
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const theme = currentTheme === 'light' ? lightTheme : darkTheme

  return {
    currentTheme,
    theme,
    isLoaded: isLoaded && isMounted,
    toggleTheme,
    setTheme,
    isDark: currentTheme === 'dark',
    isLight: currentTheme === 'light'
  }
}