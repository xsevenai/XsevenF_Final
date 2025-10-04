// contexts/ThemeContext.tsx
"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type ThemeType = 'light' | 'dark'

interface ThemeContextType {
  currentTheme: ThemeType
  isDark: boolean
  isLight: boolean
  isLoaded: boolean
  toggleTheme: () => void
  setTheme: (theme: ThemeType) => void
  theme: ThemeColors
}

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
  primaryBg: 'bg-[#2a2a2a]',
  secondaryBg: 'bg-[#333333]',
  cardBg: 'bg-[#333333] border-[#404040]',
  headerBg: 'bg-[#333333] border-[#404040]',
  borderPrimary: 'border-[#404040]',
  borderSecondary: 'border-[#4a4a4a]',
  textPrimary: 'text-white',
  textSecondary: 'text-gray-300',
  textMuted: 'text-gray-400',
  accentPrimary: 'bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] text-white',
  accentSecondary: 'bg-purple-500/20 text-purple-400',
  success: 'text-green-400',
  warning: 'text-yellow-400',
  error: 'text-red-400',
  info: 'text-blue-400',
  hover: 'hover:bg-[#3a3a3a]',
  active: 'bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] text-white'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('dark')
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    console.log('🎨 Theme Provider initializing...')
    
    try {
      const savedTheme = localStorage.getItem('themePreference') as ThemeType
      console.log('📱 Saved theme from localStorage:', savedTheme)
      
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        console.log('✅ Valid theme found, applying:', savedTheme)
        setCurrentTheme(savedTheme)
        applyThemeToDocument(savedTheme)
      } else {
        console.log('⚠️ No valid theme found, using dark as default')
        setCurrentTheme('dark')
        applyThemeToDocument('dark')
        localStorage.setItem('themePreference', 'dark')
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error)
      setCurrentTheme('dark')
      applyThemeToDocument('dark')
    }
    
    setIsLoaded(true)
    console.log('🚀 Theme Provider loaded successfully')
  }, [isMounted])

  const applyThemeToDocument = (theme: ThemeType) => {
    if (typeof document === 'undefined') return
    
    // Apply theme transition
    document.documentElement.style.transition = 'all 0.3s ease-in-out'
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
      console.log('🌙 Dark mode classes added to document')
    } else {
      document.documentElement.classList.remove('dark')
      console.log('☀️ Light mode classes applied to document')
    }
    
    // Remove transition after animation
    setTimeout(() => {
      document.documentElement.style.transition = ''
    }, 300)
  }

  const toggleTheme = () => {
    if (!isMounted) return

    const newTheme: ThemeType = currentTheme === 'light' ? 'dark' : 'light'
    console.log('🔄 Toggling theme from', currentTheme, 'to', newTheme)
    
    setCurrentTheme(newTheme)
    localStorage.setItem('themePreference', newTheme)
    applyThemeToDocument(newTheme)
  }

  const setTheme = (theme: ThemeType) => {
    if (!isMounted) return

    console.log('🎯 Setting theme to:', theme)
    setCurrentTheme(theme)
    localStorage.setItem('themePreference', theme)
    applyThemeToDocument(theme)
  }

  const theme = currentTheme === 'light' ? lightTheme : darkTheme

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      isDark: currentTheme === 'dark',
      isLight: currentTheme === 'light',
      isLoaded: isLoaded && isMounted,
      toggleTheme,
      setTheme,
      theme
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}