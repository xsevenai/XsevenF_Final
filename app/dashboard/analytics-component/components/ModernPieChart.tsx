"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface ModernPieChartProps {
  data: any[]
  dataKey: string
  nameKey: string
  isDark: boolean
  colors?: string[]
  height?: number
  showLabels?: boolean
  valueLabel?: string
}

export default function ModernPieChart({ 
  data, 
  dataKey, 
  nameKey, 
  isDark, 
  colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'],
  height = 250,
  showLabels = true,
  valueLabel = 'Items'
}: ModernPieChartProps) {
  const [hoveredSegment, setHoveredSegment] = useState<any>(null)
  const textColor = isDark ? '#ffffff' : '#374151'

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const cleanName = data[nameKey]?.toString().replace(/^\d+\s*/, '') || 'Unknown'
      return (
        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-3 border rounded-lg shadow-lg`}>
          <p className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium`}>{cleanName}</p>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
            {valueLabel}: {data[dataKey]}
          </p>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
            Percentage: {data.percentage?.toFixed(1)}%
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full"
      >
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={showLabels ? ({ name, percent, value }) => {
                // Remove numeric prefixes and show only meaningful names
                const cleanName = name.toString().replace(/^\d+\s*/, '')
                return `${cleanName}\n${(percent * 100).toFixed(1)}%`
              } : false}
              outerRadius={80}
              fill="#8884d8"
              dataKey={dataKey}
              onMouseEnter={(data) => setHoveredSegment(data)}
              onMouseLeave={() => setHoveredSegment(null)}
            >
              {data.map((entry, index) => (
                <Cell 
                  fill={colors[index % colors.length]}
                  stroke={hoveredSegment === entry ? '#ffffff' : 'none'}
                  strokeWidth={hoveredSegment === entry ? 2 : 0}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ color: textColor }}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>
      
      {/* Color Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        {data.map((entry, index) => {
          const cleanName = entry[nameKey]?.toString().replace(/^\d+\s*/, '') || `Category ${index + 1}`
          return (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {cleanName}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
