"use client"

import { useState, useEffect } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { useMenuAnalytics } from '@/hooks/use-menu'
import { 
  Utensils, 
  TrendingUp, 
  Star,
  DollarSign,
  BarChart3,
  PieChart,
  RefreshCw,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Zap,
  Target,
  Award,
  Activity
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
  const { getTopMenuItems, getCategoryPerformance, analyzeProfitMargins, loading, error } = useMenuAnalytics(businessId)
  
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'profitability'>('overview')
  const [period, setPeriod] = useState<'1d' | '7d' | '30d' | '90d'>('7d')
  const [topItemsData, setTopItemsData] = useState<any[]>([])
  const [categoryData, setCategoryData] = useState<any[]>([])
  const [profitData, setProfitData] = useState<any>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    if (businessId) {
      loadAnalyticsData()
    }
  }, [businessId, period])

  const loadAnalyticsData = async () => {
    try {
      const [topItems, categories, profits] = await Promise.all([
        getTopMenuItems(period, 10),
        getCategoryPerformance(period),
        analyzeProfitMargins()
      ])
      setTopItemsData(topItems)
      setCategoryData(categories)
      setProfitData(profits)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to load analytics data:', error)
    }
  }

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`
  const formatNumber = (num: number) => num.toLocaleString()

  // Enhanced mock data with more realistic and modern metrics
  const mockData = {
    totalMenuItems: 45,
    popularItems: 12,
    averageRating: 4.6,
    totalCategories: 8,
    itemsGrowth: 15.2,
    ratingGrowth: 2.1,
    categoriesGrowth: 8.7,
    popularityGrowth: 12.3,
    
    // Modern chart data
    topSellingItems: [
      { name: 'Margherita Pizza', sales: 156, revenue: 2340, margin: 68.5 },
      { name: 'Caesar Salad', sales: 134, revenue: 2010, margin: 72.3 },
      { name: 'Chicken Burger', sales: 128, revenue: 1920, margin: 65.8 },
      { name: 'Pasta Carbonara', sales: 112, revenue: 1680, margin: 70.2 },
      { name: 'Fish & Chips', sales: 98, revenue: 1470, margin: 63.4 }
    ],
    
    categoryPerformance: [
      { category: 'Appetizers', revenue: 12500, items: 8, avgPrice: 15.6, growth: 12.5 },
      { category: 'Main Courses', revenue: 45200, items: 18, avgPrice: 25.1, growth: 8.3 },
      { category: 'Desserts', revenue: 8900, items: 7, avgPrice: 12.7, growth: 15.2 },
      { category: 'Beverages', revenue: 15600, items: 12, avgPrice: 8.9, growth: 6.8 }
    ],
    
    profitTrend: [
      { day: 'Mon', profit: 1200, margin: 68.5 },
      { day: 'Tue', profit: 1450, margin: 70.2 },
      { day: 'Wed', profit: 1680, margin: 72.1 },
      { day: 'Thu', profit: 1520, margin: 69.8 },
      { day: 'Fri', profit: 1890, margin: 71.5 },
      { day: 'Sat', profit: 2100, margin: 73.2 },
      { day: 'Sun', profit: 1750, margin: 70.8 }
    ],
    
    marginAnalysis: [
      { range: 'High (>70%)', count: 12, percentage: 26.7, color: '#10b981' },
      { range: 'Good (50-70%)', count: 18, percentage: 40.0, color: '#3b82f6' },
      { range: 'Average (30-50%)', count: 10, percentage: 22.2, color: '#f59e0b' },
      { range: 'Low (<30%)', count: 5, percentage: 11.1, color: '#ef4444' }
    ]
  }

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Top Selling Items Chart */}
      <ChartContainer
        title="Top Selling Items"
        subtitle="Best performing menu items by sales volume"
        isDark={isDark}
      >
        <ModernBarChart
          data={mockData.topSellingItems}
          dataKey="sales"
          nameKey="name"
          isDark={isDark}
          colors={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']}
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
            data={mockData.categoryPerformance}
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
            data={mockData.marginAnalysis}
            dataKey="count"
            nameKey="range"
            isDark={isDark}
            colors={['#10b981', '#3b82f6', '#f59e0b', '#ef4444']}
          />
        </ChartContainer>
      </div>

      {/* Profit Trend */}
      <ChartContainer
        title="Weekly Profit Trend"
        subtitle="Daily profit margins and trends"
        isDark={isDark}
      >
        <ModernLineChart
          data={mockData.profitTrend}
          dataKey="profit"
          nameKey="day"
          isDark={isDark}
          color="#10b981"
          type="area"
        />
      </ChartContainer>
    </div>
  )

  const renderPerformanceTab = () => (
    <div className="space-y-6">
      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`${isDark ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30' : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'} p-6 rounded-2xl border`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
              <Target className="h-6 w-6 text-blue-500" />
            </div>
            <span className={`text-sm font-medium ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>+12.5%</span>
          </div>
          <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>87.3%</h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Menu Performance Score</p>
        </div>

        <div className={`${isDark ? 'bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30' : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'} p-6 rounded-2xl border`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${isDark ? 'bg-green-500/20' : 'bg-green-100'}`}>
              <Award className="h-6 w-6 text-green-500" />
            </div>
            <span className={`text-sm font-medium ${isDark ? 'text-green-300' : 'text-green-600'}`}>+8.3%</span>
          </div>
          <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>4.6</h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Average Rating</p>
        </div>

        <div className={`${isDark ? 'bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30' : 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'} p-6 rounded-2xl border`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
              <Zap className="h-6 w-6 text-purple-500" />
            </div>
            <span className={`text-sm font-medium ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>+15.2%</span>
          </div>
          <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>12</h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Popular Items</p>
        </div>

        <div className={`${isDark ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/30' : 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200'} p-6 rounded-2xl border`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${isDark ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
              <Activity className="h-6 w-6 text-orange-500" />
            </div>
            <span className={`text-sm font-medium ${isDark ? 'text-orange-300' : 'text-orange-600'}`}>+6.8%</span>
          </div>
          <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>45</h3>
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
          data={mockData.categoryPerformance}
          dataKey="revenue"
          nameKey="category"
          isDark={isDark}
          colors={['#3b82f6', '#10b981', '#f59e0b', '#ef4444']}
        />
      </ChartContainer>

      {/* Top Items Performance */}
      <div className={`${isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'} p-6 border rounded-2xl shadow-lg`}>
        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>Top Performing Items</h3>
        <div className="space-y-4">
          {mockData.topSellingItems.map((item, index) => (
            <div key={item.name} className={`${isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'} p-4 border rounded-xl`}>
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
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{item.sales} sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`${isDark ? 'text-white' : 'text-gray-900'} font-bold`}>{formatCurrency(item.revenue)}</div>
                  <div className={`text-sm ${item.margin > 70 ? 'text-green-500' : item.margin > 50 ? 'text-blue-500' : 'text-orange-500'}`}>
                    {formatPercentage(item.margin)} margin
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderProfitabilityTab = () => (
    <div className="space-y-6">
      {/* Profitability Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={isDark ? 'bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30 p-6 rounded-2xl border' : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200 p-6 rounded-2xl border'}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-xl ${isDark ? 'bg-green-500/20' : 'bg-green-100'}`}>
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>High Margin Items</h3>
          </div>
          <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>12</div>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Items with &gt;70% margin</p>
        </div>

        <div className={isDark ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30 p-6 rounded-2xl border' : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 p-6 rounded-2xl border'}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-xl ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
              <BarChart3 className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Average Margin</h3>
          </div>
          <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>68.5%</div>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Overall profit margin</p>
        </div>

        <div className={isDark ? 'bg-gradient-to-br from-red-500/20 to-red-600/20 border-red-500/30 p-6 rounded-2xl border' : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200 p-6 rounded-2xl border'}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-xl ${isDark ? 'bg-red-500/20' : 'bg-red-100'}`}>
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Low Margin Items</h3>
          </div>
          <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>5</div>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Items with &lt;30% margin</p>
        </div>
      </div>

      {/* Profit Trend Chart */}
      <ChartContainer
        title="Profit Margin Trend"
        subtitle="Daily profit margins over time"
        isDark={isDark}
      >
        <ModernLineChart
          data={mockData.profitTrend}
          dataKey="margin"
          nameKey="day"
          isDark={isDark}
          color="#10b981"
          type="line"
        />
      </ChartContainer>

      {/* Margin Distribution */}
      <ChartContainer
        title="Profit Margin Distribution"
        subtitle="Breakdown of items by margin ranges"
        isDark={isDark}
      >
        <ModernPieChart
          data={mockData.marginAnalysis}
          dataKey="count"
          nameKey="range"
          isDark={isDark}
          colors={['#10b981', '#3b82f6', '#f59e0b', '#ef4444']}
        />
      </ChartContainer>

      {/* Recommendations */}
      <div className={`${isDark ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20' : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'} p-6 border rounded-2xl`}>
        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
          <Zap className="h-5 w-5 text-blue-500" />
          Smart Recommendations
        </h3>
        <div className="space-y-3">
          <div className={`${isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-white border-gray-200'} p-4 border rounded-xl`}>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
              <div>
                <p className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium`}>Optimize pricing for low-margin items</p>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mt-1`}>Consider increasing prices for Fish & Chips and similar items</p>
              </div>
            </div>
          </div>
          <div className={`${isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-white border-gray-200'} p-4 border rounded-xl`}>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
              <div>
                <p className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium`}>Promote high-margin appetizers</p>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mt-1`}>Focus marketing on Caesar Salad and other high-margin items</p>
              </div>
            </div>
          </div>
          <div className={`${isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-white border-gray-200'} p-4 border rounded-xl`}>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-500 mt-2" />
              <div>
                <p className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium`}>Bundle strategy for desserts</p>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mt-1`}>Create dessert combos to increase average order value</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Menu Items"
          value={formatNumber(mockData.totalMenuItems)}
          icon={<Utensils className="h-6 w-6 text-blue-500" />}
          trend={{ value: mockData.itemsGrowth, isPositive: mockData.itemsGrowth > 0 }}
          isLoading={loading}
          isDark={isDark}
        />
        
        <MetricCard
          title="Popular Items"
          value={formatNumber(mockData.popularItems)}
          icon={<Star className="h-6 w-6 text-yellow-500" />}
          trend={{ value: mockData.popularityGrowth, isPositive: mockData.popularityGrowth > 0 }}
          isLoading={loading}
          isDark={isDark}
        />
        
        <MetricCard
          title="Average Rating"
          value={mockData.averageRating.toFixed(1)}
          icon={<TrendingUp className="h-6 w-6 text-green-500" />}
          trend={{ value: mockData.ratingGrowth, isPositive: mockData.ratingGrowth > 0 }}
          isLoading={loading}
          isDark={isDark}
        />
        
        <MetricCard
          title="Categories"
          value={formatNumber(mockData.totalCategories)}
          icon={<BarChart3 className="h-6 w-6 text-purple-500" />}
          trend={{ value: mockData.categoriesGrowth, isPositive: mockData.categoriesGrowth > 0 }}
          isLoading={loading}
          isDark={isDark}
        />
      </div>

      {/* Modern Tab Navigation */}
      <div className={`${isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'} p-2 border shadow-lg rounded-2xl`}>
        <div className="flex gap-2">
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
          <button
            onClick={() => setActiveTab('profitability')}
            className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2
              ${activeTab === 'profitability'
                ? `${isDark ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg' : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'}`
                : `${isDark ? 'text-gray-400 hover:text-white hover:bg-[#2a2a2a]' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`
              }
            `}
          >
            <DollarSign className="h-5 w-5" />
            Profitability
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={`${isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'} p-6 border shadow-lg rounded-2xl transition-colors duration-300`}>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : (
          <>
            {activeTab === 'overview' && renderOverviewTab()}
            {activeTab === 'performance' && renderPerformanceTab()}
            {activeTab === 'profitability' && renderProfitabilityTab()}
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