"use client"

import { motion } from 'framer-motion'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  isDark: boolean
  className?: string
}

export default function SectionHeader({ 
  title, 
  subtitle, 
  isDark, 
  className = '' 
}: SectionHeaderProps) {
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`py-4 ${className}`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={`h-1 w-8 ${isDark ? 'bg-blue-500' : 'bg-blue-600'} rounded-full`}></div>
        <h2 className={`${textPrimary} text-xl font-bold`}>{title}</h2>
      </div>
      {subtitle && (
        <p className={`${textSecondary} text-sm ml-11`}>{subtitle}</p>
      )}
    </motion.div>
  )
}
