"use client"

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts'

interface ModernBarChartProps {
  data: any[]
  dataKey: string
  nameKey: string
  isDark: boolean
  colors?: string[]
  height?: number
  valueLabel?: string
}

export default function ModernBarChart({ 
  data, 
  dataKey, 
  nameKey, 
  isDark, 
  colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'],
  height = 250,
  valueLabel = 'Quantity'
}: ModernBarChartProps) {
  const [selectedItem, setSelectedItem] = useState<{name: string, value: number} | null>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const textColor = isDark ? '#ffffff' : '#374151'
  const gridColor = isDark ? '#374151' : '#e5e7eb'

  const handleBarHover = (data: any) => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    
    if (data && data[nameKey]) {
      setSelectedItem({
        name: data[nameKey],
        value: data[dataKey]
      })
    }
  }

  const handleBarLeave = () => {
    // Add a small delay to prevent flickering when moving between bars
    hoverTimeoutRef.current = setTimeout(() => {
      setSelectedItem(null)
    }, 100)
  }

  return (
    <div className="relative w-full">
      {/* Selected Item Display */}
      {selectedItem && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`absolute top-2 left-1/2 transform -translate-x-1/2 z-10 px-4 py-2 rounded-lg shadow-lg ${
            isDark 
              ? 'bg-gray-800 border border-gray-700 text-white' 
              : 'bg-white border border-gray-200 text-gray-900'
          }`}
        >
          <div className="text-sm font-medium">{selectedItem.name}</div>
          <div className="text-xs opacity-75">{valueLabel}: {selectedItem.value}</div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full"
      >
        <ResponsiveContainer width="100%" height={height}>
          <BarChart 
            data={data} 
            margin={{ top: selectedItem ? 60 : 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.3} />
            <XAxis 
              dataKey={nameKey} 
              tick={{ fill: textColor, fontSize: 0 }}
              axisLine={{ stroke: gridColor }}
              tickLine={{ stroke: gridColor }}
              height={30}
            />
            <YAxis 
              tick={{ fill: textColor, fontSize: 12 }}
              axisLine={{ stroke: gridColor }}
              tickLine={{ stroke: gridColor }}
            />
            <Bar 
              dataKey={dataKey} 
              radius={[8, 8, 0, 0]}
              onMouseEnter={handleBarHover}
              onMouseLeave={handleBarLeave}
              style={{ cursor: 'pointer' }}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        
      </motion.div>
    </div>
  )
}