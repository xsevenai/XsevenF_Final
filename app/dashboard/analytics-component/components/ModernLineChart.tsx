"use client"

import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

interface ModernLineChartProps {
  data: any[]
  dataKey: string
  nameKey: string
  isDark: boolean
  color?: string
  height?: number
  type?: 'line' | 'area'
}

export default function ModernLineChart({ 
  data, 
  dataKey, 
  nameKey, 
  isDark, 
  color = '#3b82f6',
  height = 250,
  type = 'line'
}: ModernLineChartProps) {
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
        {type === 'area' ? (
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
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
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              fillOpacity={1} 
              fill="url(#colorGradient)"
              strokeWidth={3}
            />
          </AreaChart>
        ) : (
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              strokeWidth={3}
              dot={{ fill: color, strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: color, strokeWidth: 2 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </motion.div>
  )
}
