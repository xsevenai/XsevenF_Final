// app/dashboard/menu-category-component/MenuAnalyticsComponent.tsx

"use client"

import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, DollarSign, PieChart, ArrowLeft, Loader2, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { useMenuAnalytics } from '@/hooks/use-menu'

interface AnalyticsProps {
  onBack: () => void
}

export default function MenuAnalyticsComponent({ onBack }: AnalyticsProps) {
  const { theme, isLoaded: themeLoaded, isDark } = useTheme()
  const businessId = typeof window !== "undefined" ? localStorage.getItem("businessId") || "" : ""
  const { getTopMenuItems, getCategoryPerformance, analyzeProfitMargins, loading, error } = useMenuAnalytics(businessId)
  
  const [activeTab, setActiveTab] = useState<'top-items' | 'category-performance' | 'profit-margins'>('top-items')
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
      if (activeTab === 'top-items') {
        const data = await getTopMenuItems(period, 10)
        setTopItemsData(data)
      } else if (activeTab === 'category-performance') {
        const data = await getCategoryPerformance(period)
        setCategoryData(data)
      } else if (activeTab === 'profit-margins') {
        const data = await analyzeProfitMargins()
        setProfitData(data)
      }
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to load analytics data:', error)
    }
  }

  const handleTabChange = async (newTab: typeof activeTab) => {
    setActiveTab(newTab)
    // Load data for the new tab
    try {
      if (newTab === 'top-items') {
        const data = await getTopMenuItems(period, 10)
        setTopItemsData(data)
      } else if (newTab === 'category-performance') {
        const data = await getCategoryPerformance(period)
        setCategoryData(data)
      } else if (newTab === 'profit-margins') {
        const data = await analyzeProfitMargins()
        setProfitData(data)
      }
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to load analytics data:', error)
    }
  }

  if (!themeLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'
  
  const primaryButtonBg = isDark 
    ? 'bg-gradient-to-r from-[#0f0f0f] via-[#1a1a1a] to-[#2a2a2a] hover:from-[#1a1a1a] hover:via-[#222222] hover:to-[#333333] text-white border-[#444444]' 
    : 'bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200 hover:from-gray-100 hover:via-gray-200 hover:to-gray-300 text-gray-900 border-gray-300'
  
  const secondaryButtonBg = isDark 
    ? 'bg-gradient-to-r from-[#1a1a1a] via-[#222222] to-[#2a2a2a] hover:from-[#222222] hover:via-[#2a2a2a] hover:to-[#333333] text-gray-300 border-[#333333]' 
    : 'bg-gradient-to-r from-gray-100 via-gray-150 to-gray-200 hover:from-gray-150 hover:via-gray-200 hover:to-gray-250 text-gray-700 border-gray-400'
  
  const activeTabBg = isDark 
    ? 'bg-gradient-to-r from-[#0f0f0f] via-[#1a1a1a] to-[#2a2a2a] text-white border-[#444444]' 
    : 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white border-blue-600'

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`

  const renderTopItems = () => (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className={`${innerCardBg} p-4 border rounded-lg`}>
        <div className="flex items-center justify-between">
          <h4 className={`${textPrimary} font-medium`}>Time Period</h4>
          <div className="flex gap-2">
            {[
              { value: '1d', label: '1 Day' },
              { value: '7d', label: '7 Days' },
              { value: '30d', label: '30 Days' },
              { value: '90d', label: '90 Days' }
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setPeriod(value as any)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all
                  ${period === value
                    ? 'bg-blue-500 text-white'
                    : `${secondaryButtonBg}`
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top Items List */}
      <div className="space-y-4">
        {topItemsData.map((item, index) => (
          <div
            key={item.item_id}
            className={`${cardBg} p-6 border shadow-lg hover:shadow-xl transition-all duration-300`}
            style={{ borderRadius: index % 3 === 0 ? '1.5rem' : index % 3 === 1 ? '1rem' : '2rem' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg
                  ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-blue-500'}
                `}>
                  {index + 1}
                </div>
                <div>
                  <h4 className={`${textPrimary} font-semibold text-lg`}>{item.name}</h4>
                  <p className={`${textSecondary} text-sm`}>Price: {formatCurrency(item.price)}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`${textPrimary} text-xl font-bold`}>{item.sales_count}</div>
                <div className={`${textSecondary} text-sm`}>sales</div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className={`${textPrimary} font-bold`}>{formatCurrency(item.total_revenue)}</div>
                <div className={`${textSecondary} text-xs`}>Revenue</div>
              </div>
              <div className="text-center">
                <div className={`${textPrimary} font-bold`}>{formatCurrency(item.total_cost)}</div>
                <div className={`${textSecondary} text-xs`}>Cost</div>
              </div>
              <div className="text-center">
                <div className={`${textPrimary} font-bold`}>{formatCurrency(item.profit_margin)}</div>
                <div className={`${textSecondary} text-xs`}>Profit</div>
              </div>
              <div className="text-center">
                <div className={`${textPrimary} font-bold`}>{formatPercentage(item.profit_margin_percentage)}</div>
                <div className={`${textSecondary} text-xs`}>Margin</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderCategoryPerformance = () => (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className={`${innerCardBg} p-4 border rounded-lg`}>
        <div className="flex items-center justify-between">
          <h4 className={`${textPrimary} font-medium`}>Time Period</h4>
          <div className="flex gap-2">
            {[
              { value: '1d', label: '1 Day' },
              { value: '7d', label: '7 Days' },
              { value: '30d', label: '30 Days' },
              { value: '90d', label: '90 Days' }
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setPeriod(value as any)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all
                  ${period === value
                    ? 'bg-blue-500 text-white'
                    : `${secondaryButtonBg}`
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Performance List */}
      <div className="space-y-4">
        {categoryData.map((category, index) => (
          <div
            key={category.category_id}
            className={`${cardBg} p-6 border shadow-lg hover:shadow-xl transition-all duration-300`}
            style={{ borderRadius: index % 3 === 0 ? '1.5rem' : index % 3 === 1 ? '1rem' : '2rem' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className={`${textPrimary} font-semibold text-lg`}>{category.category_name}</h4>
                <p className={`${textSecondary} text-sm`}>
                  {category.total_items} items • {category.available_items} available
                </p>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${category.performance_score > 0.7 ? 'text-green-500' : category.performance_score > 0.4 ? 'text-yellow-500' : 'text-red-500'}`}>
                  {formatPercentage(category.performance_score * 100)}
                </div>
                <div className={`${textSecondary} text-sm`}>Performance</div>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className={`${textPrimary} font-bold`}>{formatCurrency(category.avg_price)}</div>
                <div className={`${textSecondary} text-xs`}>Avg Price</div>
              </div>
              <div className="text-center">
                <div className={`${textPrimary} font-bold`}>{formatCurrency(category.avg_cost)}</div>
                <div className={`${textSecondary} text-xs`}>Avg Cost</div>
              </div>
              <div className="text-center">
                <div className={`${textPrimary} font-bold`}>{formatCurrency(category.avg_profit_margin)}</div>
                <div className={`${textSecondary} text-xs`}>Avg Profit</div>
              </div>
              <div className="text-center">
                <div className={`${textPrimary} font-bold`}>{formatPercentage(category.profit_margin_percentage)}</div>
                <div className={`${textSecondary} text-xs`}>Margin %</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderProfitMargins = () => (
    <div className="space-y-6">
      {/* Overall Analysis */}
      {profitData && (
        <div className={`${cardBg} p-6 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
          <h3 className={`${textPrimary} font-semibold text-lg mb-4`}>Overall Profit Analysis</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`${textPrimary} text-2xl font-bold`}>{profitData.total_items}</div>
              <div className={`${textSecondary} text-sm`}>Total Items</div>
            </div>
            <div className="text-center">
              <div className={`${textPrimary} text-2xl font-bold`}>{formatCurrency(profitData.overall_analysis.total_revenue)}</div>
              <div className={`${textSecondary} text-sm`}>Total Revenue</div>
            </div>
            <div className="text-center">
              <div className={`${textPrimary} text-2xl font-bold`}>{formatCurrency(profitData.overall_analysis.total_cost)}</div>
              <div className={`${textSecondary} text-sm`}>Total Cost</div>
            </div>
            <div className="text-center">
              <div className={`${textPrimary} text-2xl font-bold ${profitData.overall_analysis.overall_margin_percentage > 20 ? 'text-green-500' : 'text-red-500'}`}>
                {formatPercentage(profitData.overall_analysis.overall_margin_percentage)}
              </div>
              <div className={`${textSecondary} text-sm`}>Overall Margin</div>
            </div>
          </div>
        </div>
      )}

      {/* High Margin Items */}
      {profitData?.high_margin_items && profitData.high_margin_items.length > 0 && (
        <div className={`${cardBg} p-6 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
          <h3 className={`${textPrimary} font-semibold text-lg mb-4 flex items-center gap-2`}>
            <CheckCircle className="h-5 w-5 text-green-500" />
            High Margin Items (&gt;30%)
          </h3>
          <div className="space-y-3">
            {profitData.high_margin_items.slice(0, 5).map((item: any, index: number) => (
              <div key={item.item_id} className={`${innerCardBg} p-4 border rounded-lg`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className={`${textPrimary} font-medium`}>{item.name}</h5>
                    <p className={`${textSecondary} text-sm`}>Price: {formatCurrency(item.price)} • Cost: {formatCurrency(item.cost)}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold text-green-500`}>{formatPercentage(item.margin_percentage)}</div>
                    <div className={`${textSecondary} text-sm`}>Margin</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Low Margin Items */}
      {profitData?.low_margin_items && profitData.low_margin_items.length > 0 && (
        <div className={`${cardBg} p-6 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
          <h3 className={`${textPrimary} font-semibold text-lg mb-4 flex items-center gap-2`}>
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Low Margin Items (&lt;10%)
          </h3>
          <div className="space-y-3">
            {profitData.low_margin_items.slice(0, 5).map((item: any, index: number) => (
              <div key={item.item_id} className={`${innerCardBg} p-4 border rounded-lg`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className={`${textPrimary} font-medium`}>{item.name}</h5>
                    <p className={`${textSecondary} text-sm`}>Price: {formatCurrency(item.price)} • Cost: {formatCurrency(item.cost)}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold text-red-500`}>{formatPercentage(item.margin_percentage)}</div>
                    <div className={`${textSecondary} text-sm`}>Margin</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {profitData?.recommendations && profitData.recommendations.length > 0 && (
        <div className={`${cardBg} p-6 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
          <h3 className={`${textPrimary} font-semibold text-lg mb-4`}>Recommendations</h3>
          <div className="space-y-3">
            {profitData.recommendations.map((rec: any, index: number) => (
              <div key={index} className={`${innerCardBg} p-4 border rounded-lg`}>
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    rec.priority === 'high' ? 'bg-red-500' : 
                    rec.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div className="flex-1">
                    <p className={`${textPrimary} font-medium`}>{rec.message}</p>
                    {rec.affected_items && rec.affected_items.length > 0 && (
                      <p className={`${textSecondary} text-sm mt-1`}>
                        Affected items: {rec.affected_items.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className={`${cardBg} p-8 border shadow-lg transition-colors duration-300`} style={{ borderRadius: '1.5rem' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className={`${textSecondary} ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-200'} p-2 rounded-xl transition-all duration-200 hover:scale-110`}
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className={`text-4xl font-bold ${textPrimary} mb-2 transition-colors duration-300`}>
                Menu Analytics
              </h1>
              <p className={`${textSecondary} transition-colors duration-300`}>
                Analyze your menu performance and profitability
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className={`${textSecondary} text-sm`}>
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={loadAnalyticsData}
              disabled={loading}
              className={`${primaryButtonBg} px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all border font-medium disabled:opacity-50`}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={`${cardBg} p-3 border shadow-lg flex gap-2 transition-colors duration-300`} style={{ borderRadius: '1.5rem' }}>
        <button
          onClick={() => handleTabChange('top-items')}
          className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all border
            ${activeTab === 'top-items'
              ? `${activeTabBg} shadow-md`
              : `${secondaryButtonBg} ${isDark ? 'text-gray-300' : 'text-gray-600'}`
            }
            hover:shadow-md
          `}
        >
          <TrendingUp className="h-4 w-4 inline mr-2" />
          Top Items
        </button>
        <button
          onClick={() => handleTabChange('category-performance')}
          className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all border
            ${activeTab === 'category-performance'
              ? `${activeTabBg} shadow-md`
              : `${secondaryButtonBg} ${isDark ? 'text-gray-300' : 'text-gray-600'}`
            }
            hover:shadow-md
          `}
        >
          <PieChart className="h-4 w-4 inline mr-2" />
          Categories
        </button>
        <button
          onClick={() => handleTabChange('profit-margins')}
          className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all border
            ${activeTab === 'profit-margins'
              ? `${activeTabBg} shadow-md`
              : `${secondaryButtonBg} ${isDark ? 'text-gray-300' : 'text-gray-600'}`
            }
            hover:shadow-md
          `}
        >
          <DollarSign className="h-4 w-4 inline mr-2" />
          Profit Margins
        </button>
      </div>

      {/* Content */}
      <div className={`${cardBg} p-6 border shadow-lg transition-colors duration-300`} style={{ borderRadius: '1.5rem' }}>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : (
          <>
            {activeTab === 'top-items' && renderTopItems()}
            {activeTab === 'category-performance' && renderCategoryPerformance()}
            {activeTab === 'profit-margins' && renderProfitMargins()}
          </>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className={`${cardBg} p-4 border border-red-500/20 bg-red-500/10 rounded-lg`}>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-red-500 font-medium">Error: {error}</span>
          </div>
        </div>
      )}
    </div>
  )
}