"use client"

import { useState, useEffect } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { useMenuAnalytics } from '@/hooks/use-menu-analytics'
import { 
  Utensils, 
  TrendingUp, 
  Star,
  DollarSign,
  BarChart3,
  PieChart,
  Loader2,
  AlertTriangle,
  Target,
  Activity,
  Award,
  Zap
} from 'lucide-react'
import MetricCard from './components/MetricCard'
import ChartContainer from './components/ChartContainer'
import ModernBarChart from './components/ModernBarChart'
import ModernLineChart from './components/ModernLineChart'
import ModernPieChart from './components/ModernPieChart'

interface MenuAnalyticsProps {
  timeRange: string
}

export default function MenuAnalytics({ timeRange }: MenuAnalyticsProps) {
  const { isDark } = useTheme()
  const businessId = typeof window !== "undefined" ? localStorage.getItem("businessId") || "" : ""
  const { 
    getMenuAnalyticsOverview,
    getTopMenuItems, 
    getCategoryPerformance, 
    analyzeProfitMargins, 
    getMenuAnalyticsDashboard,
    getReviewStats,
    loading, 
    error,
    lastUpdated 
  } = useMenuAnalytics(businessId)
  
  const [activeTab, setActiveTab] = useState<'overview' | 'performance'>('overview')
  const [period, setPeriod] = useState<'1d' | '7d' | '30d' | '90d'>('7d')
  const [topItemsData, setTopItemsData] = useState<any[]>([])
  const [categoryData, setCategoryData] = useState<any[]>([])
  const [profitData, setProfitData] = useState<any>(null)
  const [overviewData, setOverviewData] = useState<any>(null)

  useEffect(() => {
    if (businessId) {
      loadAnalyticsData()
    }
  }, [businessId, period])

  const loadAnalyticsData = async () => {
    try {
      // Use the comprehensive dashboard endpoint for better performance
      const dashboardData = await getMenuAnalyticsDashboard(period, true)
      
      // Extract data from the dashboard response
      setOverviewData(dashboardData.overview)
      setTopItemsData(dashboardData.top_items.items)
      setCategoryData(dashboardData.category_performance.categories)
      setProfitData(dashboardData.profit_margins)
      // lastUpdated is now managed by the hook
    } catch (error) {
      console.error('Failed to load analytics data:', error)
      // Fallback to individual calls if dashboard fails
      try {
        const [overview, topItems, categories, profits] = await Promise.all([
          getMenuAnalyticsOverview(period, true),
          getTopMenuItems(period, 10),
          getCategoryPerformance(period),
          analyzeProfitMargins()
        ])
        setOverviewData(overview)
        setTopItemsData(topItems.items)
        setCategoryData(categories.categories)
        setProfitData(profits)
        // lastUpdated is now managed by the hook
      } catch (fallbackError) {
        console.error('Fallback analytics loading also failed:', fallbackError)
      }
    }
  }

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`
  const formatNumber = (num: number) => num.toLocaleString()

  const renderOverviewTab = () => {
    // Transform API data for charts
    const topSellingItemsData = topItemsData.map(item => ({
      name: item.name,
      sales: item.sales_count,
      revenue: item.total_revenue,
      margin: item.margin_percentage
    }))

    const categoryPerformanceData = categoryData.map(category => ({
      category: category.category_name,
      revenue: category.total_revenue,
      items: category.total_items,
      avgPrice: category.avg_price,
      growth: category.growth_percentage
    }))

    const marginAnalysisData = profitData?.margin_distribution?.map((item: any) => ({
      range: item.range,
      count: item.count,
      percentage: item.percentage,
      color: item.range.includes('High') ? '#10b981' : 
             item.range.includes('Medium') ? '#3b82f6' : 
             item.range.includes('Low') ? '#ef4444' : '#f59e0b'
    })) || []

    return (
      <div className="space-y-6">
        {/* Top Selling Items Chart */}
        <ChartContainer
          title="Top Selling Items"
          subtitle="Best performing menu items by sales volume"
          isDark={isDark}
        >
          <ModernBarChart
            data={topSellingItemsData}
            dataKey="sales"
            nameKey="name"
            isDark={isDark}
            colors={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']}
            valueLabel="Sales"
          />
        </ChartContainer>

        {/* Category Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartContainer
            title="Category Revenue Distribution"
            subtitle="Revenue breakdown by menu category"
            isDark={isDark}
          >
            <ModernPieChart
              data={categoryPerformanceData}
              dataKey="revenue"
              nameKey="category"
              isDark={isDark}
              colors={['#3b82f6', '#10b981', '#f59e0b', '#ef4444']}
            />
          </ChartContainer>

          <ChartContainer
            title="Profit Margin Analysis"
            subtitle="Distribution of items by profit margin ranges"
            isDark={isDark}
          >
            <ModernPieChart
              data={marginAnalysisData}
              dataKey="count"
              nameKey="range"
              isDark={isDark}
              colors={['#10b981', '#3b82f6', '#f59e0b', '#ef4444']}
            />
          </ChartContainer>
        </div>

        {/* Profit Trend - Note: Daily trends not available in current API */}
        {profitData?.overall_analysis && (
          <ChartContainer
            title="Profit Analysis"
            subtitle="Overall profit margin analysis"
            isDark={isDark}
          >
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className={`text-4xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'} mb-2`}>
                  {formatPercentage(profitData.overall_analysis.overall_margin_percentage)}
                </div>
                <div className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Overall Profit Margin
                </div>
                <div className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'} mt-2`}>
                  Revenue: {formatCurrency(profitData.overall_analysis.total_revenue)} | 
                  Cost: {formatCurrency(profitData.overall_analysis.total_cost)}
                </div>
              </div>
            </div>
          </ChartContainer>
        )}
      </div>
    )
  }

  const renderPerformanceTab = () => {
    // Transform API data for charts
    const categoryPerformanceData = categoryData.map(category => ({
      category: category.category_name,
      revenue: category.total_revenue,
      items: category.total_items,
      avgPrice: category.avg_price,
      growth: category.growth_percentage
    }))

    return (
      <div className="space-y-6">
        {/* Performance Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`${isDark ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30' : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'} p-6 rounded-2xl border`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                <Target className="h-6 w-6 text-blue-500" />
              </div>
              <span className={`text-sm font-medium ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                {overviewData?.items_growth ? `+${overviewData.items_growth.toFixed(1)}%` : 'N/A'}
              </span>
            </div>
            <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
              {overviewData?.performance_score ? `${overviewData.performance_score.toFixed(1)}%` : 'N/A'}
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Menu Performance Score</p>
          </div>

          <div className={`${isDark ? 'bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30' : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'} p-6 rounded-2xl border`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${isDark ? 'bg-green-500/20' : 'bg-green-100'}`}>
                <Award className="h-6 w-6 text-green-500" />
              </div>
              <span className={`text-sm font-medium ${isDark ? 'text-green-300' : 'text-green-600'}`}>
                {overviewData?.rating_growth ? `+${overviewData.rating_growth.toFixed(1)}%` : 'N/A'}
              </span>
            </div>
            <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
              {overviewData?.average_rating ? overviewData.average_rating.toFixed(1) : 'N/A'}
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Average Rating</p>
          </div>

          <div className={`${isDark ? 'bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30' : 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'} p-6 rounded-2xl border`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                <Zap className="h-6 w-6 text-purple-500" />
              </div>
              <span className={`text-sm font-medium ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>
                {overviewData?.popularity_growth ? `+${overviewData.popularity_growth.toFixed(1)}%` : 'N/A'}
              </span>
            </div>
            <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
              {overviewData?.popular_items || 'N/A'}
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Popular Items</p>
          </div>

          <div className={`${isDark ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/30' : 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200'} p-6 rounded-2xl border`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${isDark ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
                <Activity className="h-6 w-6 text-orange-500" />
              </div>
              <span className={`text-sm font-medium ${isDark ? 'text-orange-300' : 'text-orange-600'}`}>
                {overviewData?.categories_growth ? `+${overviewData.categories_growth.toFixed(1)}%` : 'N/A'}
              </span>
            </div>
            <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
              {overviewData?.total_menu_items || 'N/A'}
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Items</p>
          </div>
        </div>

        {/* Category Performance Chart */}
        <ChartContainer
          title="Category Performance Analysis"
          subtitle="Revenue and growth by category"
          isDark={isDark}
        >
          <ModernBarChart
            data={categoryPerformanceData}
            dataKey="revenue"
            nameKey="category"
            isDark={isDark}
            colors={['#3b82f6', '#10b981', '#f59e0b', '#ef4444']}
            valueLabel="Revenue"
          />
        </ChartContainer>

        {/* Top Items Performance */}
        <div className={`${isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'} p-6 border rounded-2xl shadow-lg`}>
          <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>Top Performing Items</h3>
          <div className="space-y-4">
            {topItemsData.map((item, index) => (
              <div key={item.item_id} className={`${isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'} p-4 border rounded-xl`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm
                      ${index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 
                        index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' : 
                        index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-500' : 
                        'bg-gradient-to-r from-blue-400 to-blue-500'}
                    `}>
                      {index + 1}
                    </div>
                    <div>
                      <h4 className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold`}>{item.name}</h4>
                      <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{item.sales_count} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`${isDark ? 'text-white' : 'text-gray-900'} font-bold`}>{formatCurrency(item.total_revenue)}</div>
                    <div className={`text-sm ${item.margin_percentage > 70 ? 'text-green-500' : item.margin_percentage > 50 ? 'text-blue-500' : 'text-orange-500'}`}>
                      {formatPercentage(item.margin_percentage)} margin
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }


  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Menu Items"
          value={formatNumber(overviewData?.total_menu_items || 0)}
          icon={<Utensils className="h-6 w-6 text-blue-500" />}
          trend={{ value: overviewData?.items_growth || 0, isPositive: (overviewData?.items_growth || 0) > 0 }}
          isLoading={loading}
          isDark={isDark}
        />
        
        <MetricCard
          title="Popular Items"
          value={formatNumber(overviewData?.popular_items || 0)}
          icon={<Star className="h-6 w-6 text-yellow-500" />}
          trend={{ value: overviewData?.popularity_growth || 0, isPositive: (overviewData?.popularity_growth || 0) > 0 }}
          isLoading={loading}
          isDark={isDark}
        />
        
        <MetricCard
          title="Average Rating"
          value={overviewData?.average_rating ? overviewData.average_rating.toFixed(1) : 'N/A'}
          icon={<TrendingUp className="h-6 w-6 text-green-500" />}
          trend={{ value: overviewData?.rating_growth || 0, isPositive: (overviewData?.rating_growth || 0) > 0 }}
          isLoading={loading}
          isDark={isDark}
        />
        
        <MetricCard
          title="Categories"
          value={formatNumber(overviewData?.total_categories || 0)}
          icon={<BarChart3 className="h-6 w-6 text-purple-500" />}
          trend={{ value: overviewData?.categories_growth || 0, isPositive: (overviewData?.categories_growth || 0) > 0 }}
          isLoading={loading}
          isDark={isDark}
        />
      </div>

      {/* Modern Tab Navigation */}
      <div className={`${isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'} p-2 border shadow-lg rounded-2xl`}>
        <div className="flex gap-2 items-center justify-between">
          <div className="flex gap-2 flex-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2
              ${activeTab === 'overview'
                ? `${isDark ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'}`
                : `${isDark ? 'text-gray-400 hover:text-white hover:bg-[#2a2a2a]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`
              }
            `}
          >
            <BarChart3 className="h-5 w-5" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2
              ${activeTab === 'performance'
                ? `${isDark ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg' : 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'}`
                : `${isDark ? 'text-gray-400 hover:text-white hover:bg-[#2a2a2a]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`
              }
            `}
          >
            <Activity className="h-5 w-5" />
            Performance
          </button>
          </div>
          
        </div>
      </div>

      {/* Content */}
      <div className={`${isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'} p-6 border shadow-lg rounded-2xl transition-colors duration-300`}>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            <span className={`ml-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading analytics data...</span>
          </div>
        ) : !overviewData && !topItemsData.length && !categoryData.length && !profitData ? (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
              No Analytics Data Available
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} text-center max-w-md`}>
              Analytics data will appear here once you have menu items, orders, and reviews in your system.
            </p>
            <button
              onClick={() => loadAnalyticsData()}
              className={`mt-4 px-4 py-2 rounded-lg font-medium transition-colors
                ${isDark ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}
              `}
            >
              Refresh Data
            </button>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && renderOverviewTab()}
            {activeTab === 'performance' && renderPerformanceTab()}
          </>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className={`${isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'} p-4 border rounded-xl`}>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-red-500 font-medium">Error: {error}</span>
          </div>
        </div>
      )}
    </div>
  )
}