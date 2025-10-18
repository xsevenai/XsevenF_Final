"use client"

import { useState } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Target, 
  BarChart3,
  Star,
  Activity,
  Award,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ChartContainer from './ChartContainer'
import ModernBarChart from './ModernBarChart'
import ModernPieChart from './ModernPieChart'

interface CategoryPerformanceProps {
  data: any[]
  period: string
  isLoading?: boolean
}

export default function CategoryPerformance({ data, period, isLoading = false }: CategoryPerformanceProps) {
  const { isDark } = useTheme()
  const [sortBy, setSortBy] = useState<'performance' | 'revenue' | 'growth' | 'margin'>('performance')
  const [viewMode, setViewMode] = useState<'cards' | 'chart'>('cards')

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`
  const formatNumber = (num: number) => num.toLocaleString()

  // Sort categories based on selected criteria
  const sortedData = [...data].sort((a, b) => {
    switch (sortBy) {
      case 'performance':
        return b.performance_score - a.performance_score
      case 'revenue':
        return b.total_revenue - a.total_revenue
      case 'growth':
        return b.growth_percentage - a.growth_percentage
      case 'margin':
        return b.profit_margin_percentage - a.profit_margin_percentage
      default:
        return 0
    }
  })

  // Transform data for charts
  const chartData = sortedData.map(category => ({
    name: category.category_name,
    revenue: category.total_revenue,
    sales: category.total_sales,
    margin: category.profit_margin_percentage,
    performance: category.performance_score,
    growth: category.growth_percentage
  }))

  const revenueData = chartData.map(item => ({
    category: item.name,
    revenue: item.revenue,
    sales: item.sales,
    margin: item.margin
  }))

  const marginData = chartData.map(item => ({
    range: `${item.margin.toFixed(0)}%`,
    count: 1,
    percentage: 100 / chartData.length,
    color: item.margin > 70 ? '#10b981' : 
           item.margin > 50 ? '#3b82f6' : 
           item.margin > 30 ? '#f59e0b' : '#ef4444'
  }))

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-blue-500'
    if (score >= 40) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getPerformanceIcon = (score: number) => {
    if (score >= 80) return <Award className="h-4 w-4 text-green-500" />
    if (score >= 60) return <Star className="h-4 w-4 text-blue-500" />
    if (score >= 40) return <Target className="h-4 w-4 text-yellow-500" />
    return <Activity className="h-4 w-4 text-red-500" />
  }

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <ArrowUpRight className="h-4 w-4 text-green-500" />
    if (growth < 0) return <ArrowDownRight className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-gray-500" />
  }

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-500'
    if (growth < 0) return 'text-red-500'
    return 'text-gray-500'
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className={`ml-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Loading category performance data...
          </span>
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <BarChart3 className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
          No Category Data Available
        </h3>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} text-center max-w-md`}>
          Category performance data will appear here once you have menu categories and items with sales data.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-2">
          <Button
            onClick={() => setViewMode('cards')}
            variant={viewMode === 'cards' ? 'default' : 'outline'}
            size="sm"
            className="text-xs"
          >
            <BarChart3 className="h-3 w-3 mr-1" />
            Cards
          </Button>
          <Button
            onClick={() => setViewMode('chart')}
            variant={viewMode === 'chart' ? 'default' : 'outline'}
            size="sm"
            className="text-xs"
          >
            <Activity className="h-3 w-3 mr-1" />
            Charts
          </Button>
        </div>

        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors
              ${isDark 
                ? 'bg-[#1f1f1f] border-[#2a2a2a] text-white' 
                : 'bg-white border-gray-200 text-gray-900'
              }
            `}
          >
            <option value="performance">Performance Score</option>
            <option value="revenue">Revenue</option>
            <option value="growth">Growth</option>
            <option value="margin">Profit Margin</option>
          </select>
        </div>
      </div>

      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedData.map((category, index) => (
            <div
              key={category.category_id}
              className={`${isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-white border-gray-200'} 
                p-6 border rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm
                    ${index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 
                      index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' : 
                      index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-500' : 
                      'bg-gradient-to-r from-blue-400 to-blue-500'}
                  `}>
                    {index + 1}
                  </div>
                  <div>
                    <h3 className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold text-sm`}>
                      {category.category_name}
                    </h3>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs`}>
                      {category.total_items} items
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {getPerformanceIcon(category.performance_score)}
                  <span className={`text-sm font-bold ${getPerformanceColor(category.performance_score)}`}>
                    {category.performance_score.toFixed(0)}
                  </span>
                </div>
              </div>

              {/* Metrics */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Revenue</span>
                  </div>
                  <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {formatCurrency(category.total_revenue)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-blue-500" />
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Sales</span>
                  </div>
                  <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {formatNumber(category.total_sales)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-purple-500" />
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Margin</span>
                  </div>
                  <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {formatPercentage(category.profit_margin_percentage)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getGrowthIcon(category.growth_percentage)}
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Growth</span>
                  </div>
                  <span className={`text-sm font-semibold ${getGrowthColor(category.growth_percentage)}`}>
                    {formatPercentage(category.growth_percentage)}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <Badge 
                    variant={category.is_active ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {category.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    {category.available_items}/{category.total_items} available
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Revenue Chart */}
          <ChartContainer
            title="Category Revenue Performance"
            subtitle={`Revenue breakdown by category (${period})`}
            isDark={isDark}
          >
            <ModernBarChart
              data={revenueData}
              dataKey="revenue"
              nameKey="category"
              isDark={isDark}
              colors={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']}
              valueLabel="Revenue"
            />
          </ChartContainer>

          {/* Profit Margin Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartContainer
              title="Profit Margin Distribution"
              subtitle="Margin percentage by category"
              isDark={isDark}
            >
              <ModernPieChart
                data={marginData}
                dataKey="count"
                nameKey="range"
                isDark={isDark}
                colors={['#10b981', '#3b82f6', '#f59e0b', '#ef4444']}
              />
            </ChartContainer>

            <ChartContainer
              title="Sales Volume"
              subtitle="Total sales by category"
              isDark={isDark}
            >
              <ModernBarChart
                data={revenueData}
                dataKey="sales"
                nameKey="category"
                isDark={isDark}
                colors={['#8b5cf6', '#06b6d4', '#84cc16', '#f97316']}
                valueLabel="Sales"
              />
            </ChartContainer>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className={`${isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'} 
        p-6 border rounded-xl`}>
        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
          Performance Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {data.length}
            </div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Total Categories
            </div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold text-green-500`}>
              {formatCurrency(data.reduce((sum, cat) => sum + cat.total_revenue, 0))}
            </div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Total Revenue
            </div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold text-blue-500`}>
              {formatPercentage(data.reduce((sum, cat) => sum + cat.profit_margin_percentage, 0) / data.length)}
            </div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Avg Margin
            </div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold text-purple-500`}>
              {formatPercentage(data.reduce((sum, cat) => sum + cat.performance_score, 0) / data.length)}
            </div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Avg Performance
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
