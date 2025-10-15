"use client"

import { motion } from 'framer-motion'

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  isLoading?: boolean
  isDark: boolean
  className?: string
}

export default function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  isLoading = false,
  isDark,
  className = ''
}: MetricCardProps) {
  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const iconBg = isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className={`${cardBg} p-4 border shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
      style={{ borderRadius: '1.5rem' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`${iconBg} p-2 rounded-lg`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${
            trend.isPositive ? 'text-green-500' : 'text-red-500'
          }`}>
            <span>{trend.isPositive ? '↗' : '↘'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      
      <h3 className={`${textSecondary} text-xs font-medium uppercase tracking-wider mb-1`}>
        {title}
      </h3>
      
      <div className={`${textPrimary} text-2xl font-bold mb-1`}>
        {isLoading ? (
          <div className="animate-pulse bg-gray-300 h-6 w-20 rounded"></div>
        ) : (
          value
        )}
      </div>
      
      {subtitle && (
        <div className={`${textSecondary} text-xs`}>{subtitle}</div>
      )}
    </motion.div>
  )
}
