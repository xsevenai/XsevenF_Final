"use client"

import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface ModernBarChartProps {
  data: any[]
  dataKey: string
  nameKey: string
  isDark: boolean
  colors?: string[]
  height?: number
}

export default function ModernBarChart({ 
  data, 
  dataKey, 
  nameKey, 
  isDark, 
  colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'],
  height = 250
}: ModernBarChartProps) {
  const textColor = isDark ? '#ffffff' : '#374151'
  const gridColor = isDark ? '#374151' : '#e5e7eb'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full"
    >
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.3} />
          <XAxis 
            dataKey={nameKey} 
            tick={{ fill: textColor, fontSize: 12 }}
            axisLine={{ stroke: gridColor }}
            tickLine={{ stroke: gridColor }}
          />
          <YAxis 
            tick={{ fill: textColor, fontSize: 12 }}
            axisLine={{ stroke: gridColor }}
            tickLine={{ stroke: gridColor }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1f1f1f' : '#ffffff',
              border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
              borderRadius: '12px',
              color: textColor
            }}
            labelStyle={{ color: textColor }}
          />
          <Bar dataKey={dataKey} radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
