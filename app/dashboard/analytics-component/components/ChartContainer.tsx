"use client"

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface ChartContainerProps {
  children: ReactNode
  title: string
  subtitle?: string
  className?: string
  isDark: boolean
}

export default function ChartContainer({ 
  children, 
  title, 
  subtitle, 
  className = '', 
  isDark 
}: ChartContainerProps) {
  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${cardBg} p-6 border shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
      style={{ borderRadius: '1.5rem' }}
    >
      <div className="mb-6">
        <h3 className={`${textPrimary} font-semibold text-lg mb-2`}>{title}</h3>
        {subtitle && (
          <p className={`${textSecondary} text-sm`}>{subtitle}</p>
        )}
      </div>
      <div className="relative">
        {children}
      </div>
    </motion.div>
  )
}
