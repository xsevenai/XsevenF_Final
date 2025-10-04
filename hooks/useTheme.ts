// hooks/useTheme.ts
"use client"

// This hook is now just a re-export of the context hook
// You can either use this or import directly from the context
export { useTheme, type ThemeType } from '@/app/contexts/ThemeContext'

// Helper function for getting theme colors (for backward compatibility)
export const getThemeColors = (isDark: boolean) => {
  if (isDark) {
    return {
      mainPanelBg: 'bg-[#111111]',
      cardBg: 'bg-[#171717] border-[#2a2a2a]',
      textPrimary: 'text-white',
      textSecondary: 'text-gray-400',
      innerCardBg: 'bg-[#1f1f1f] border-[#2a2a2a]',
      inputBg: 'bg-[#1f1f1f] border-[#2a2a2a]',
      hoverBg: 'hover:bg-[#2a2a2a]',
      iconBg: 'bg-[#2a2a2a]',
      gradientText: 'bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent',
      buttonPrimary: 'bg-white text-gray-900 hover:bg-gray-100',
      borderColor: 'border-gray-700/50'
    }
  } else {
    return {
      mainPanelBg: 'bg-gray-50',
      cardBg: 'bg-white border-gray-200',
      textPrimary: 'text-gray-900',
      textSecondary: 'text-gray-600',
      innerCardBg: 'bg-gray-50 border-gray-200',
      inputBg: 'bg-white border-gray-300',
      hoverBg: 'hover:bg-gray-100',
      iconBg: 'bg-gray-200',
      gradientText: 'bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 bg-clip-text text-transparent',
      buttonPrimary: 'bg-gray-900 text-white hover:bg-gray-800',
      borderColor: 'border-gray-200'
    }
  }
}