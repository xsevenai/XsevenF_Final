// app/dashboard/kds-component/components/KDSPerformanceDashboard.tsx

"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp,
  Clock,
  Target,
  Users,
  ChefHat,
  BarChart3,
  RefreshCw,
  Loader2,
  AlertCircle,
  Calendar,
  Timer
} from "lucide-react"
import { useKDSPerformance } from "@/hooks/use-kds"

interface KDSPerformanceDashboardProps {
  businessId: string
  isDark?: boolean
}

export default function KDSPerformanceDashboard({ 
  businessId,
  isDark = false 
}: KDSPerformanceDashboardProps) {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days ago
    endDate: new Date().toISOString().split('T')[0] // today
  })

  const { 
    performance, 
    loading, 
    error, 
    fetchPerformance,
    clearError 
  } = useKDSPerformance(businessId)

  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'

  useEffect(() => {
    if (businessId) {
      fetchPerformance(dateRange.startDate, dateRange.endDate)
    }
  }, [businessId, dateRange.startDate, dateRange.endDate, fetchPerformance])

  const handleDateRangeChange = (field: 'startDate' | 'endDate', value: string) => {
    setDateRange(prev => ({ ...prev, [field]: value }))
  }

  const handleRefresh = () => {
    clearError()
    fetchPerformance(dateRange.startDate, dateRange.endDate)
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${Math.round(minutes)}m`
    }
    const hours = Math.floor(minutes / 60)
    const mins = Math.round(minutes % 60)
    return `${hours}h ${mins}m`
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  const getPerformanceColor = (value: number, threshold: number, reverse = false) => {
    const isGood = reverse ? value <= threshold : value >= threshold
    return isGood ? 'text-green-500' : 'text-red-500'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`${textPrimary} text-2xl font-bold`}>Kitchen Performance</h2>
          <p className={`${textSecondary}`}>Monitor kitchen efficiency and order processing metrics</p>
        </div>
        <Button 
          onClick={handleRefresh}
          disabled={loading}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Date Range Selector */}
      <Card className={`${cardBg} p-6 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <div className="flex items-center gap-4">
          <Calendar className="h-5 w-5 text-gray-500" />
          <h3 className={`${textPrimary} font-semibold`}>Date Range</h3>
          
          <div className="flex items-center gap-2">
            <Label className={`${textSecondary} text-sm`}>From:</Label>
            <Input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
              className={innerCardBg}
            />
          </div>

          <div className="flex items-center gap-2">
            <Label className={`${textSecondary} text-sm`}>To:</Label>
            <Input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
              className={innerCardBg}
            />
          </div>
        </div>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card className={`${cardBg} p-12 border shadow-lg text-center`} style={{ borderRadius: '1.5rem' }}>
          <Loader2 className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-spin" />
          <h3 className={`${textPrimary} text-xl font-semibold mb-2`}>Loading Performance Data...</h3>
          <p className={`${textSecondary}`}>Please wait while we fetch the latest metrics.</p>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className={`${cardBg} p-12 border shadow-lg text-center`} style={{ borderRadius: '1.5rem' }}>
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h3 className={`${textPrimary} text-xl font-semibold mb-2`}>Error Loading Performance Data</h3>
          <p className={`${textSecondary} mb-4`}>{error}</p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </Card>
      )}

      {/* Performance Metrics */}
      {performance && !loading && !error && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className={`${cardBg} p-6 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
              <div className="flex items-center justify-between mb-4">
                <div className={`${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} p-3 rounded-2xl`}>
                  <BarChart3 className={`h-6 w-6 ${textPrimary}`} />
                </div>
                <Badge variant="outline">Total</Badge>
              </div>
              <h3 className={`${textSecondary} text-xs font-medium uppercase tracking-wider mb-2`}>Total Orders</h3>
              <div className={`${textPrimary} text-3xl font-bold`}>{formatNumber(performance.total_orders || 0)}</div>
            </Card>

            <Card className={`${cardBg} p-6 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
              <div className="flex items-center justify-between mb-4">
                <div className={`${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} p-3 rounded-2xl`}>
                  <CheckCircle className={`h-6 w-6 ${textPrimary}`} />
                </div>
                <Badge variant="outline">Completed</Badge>
              </div>
              <h3 className={`${textSecondary} text-xs font-medium uppercase tracking-wider mb-2`}>Completed Orders</h3>
              <div className={`${textPrimary} text-3xl font-bold`}>{formatNumber(performance.completed_orders || 0)}</div>
            </Card>

            <Card className={`${cardBg} p-6 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
              <div className="flex items-center justify-between mb-4">
                <div className={`${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} p-3 rounded-2xl`}>
                  <Timer className={`h-6 w-6 ${textPrimary}`} />
                </div>
                <Badge variant="outline">Avg Time</Badge>
              </div>
              <h3 className={`${textSecondary} text-xs font-medium uppercase tracking-wider mb-2`}>Avg Prep Time</h3>
              <div className={`${textPrimary} text-3xl font-bold`}>
                {performance.average_prep_time ? formatDuration(performance.average_prep_time) : 'N/A'}
              </div>
            </Card>

            <Card className={`${cardBg} p-6 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
              <div className="flex items-center justify-between mb-4">
                <div className={`${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} p-3 rounded-2xl`}>
                  <TrendingUp className={`h-6 w-6 ${textPrimary}`} />
                </div>
                <Badge variant="outline">Rate</Badge>
              </div>
              <h3 className={`${textSecondary} text-xs font-medium uppercase tracking-wider mb-2`}>Orders/Hour</h3>
              <div className={`${textPrimary} text-3xl font-bold`}>
                {performance.orders_per_hour ? performance.orders_per_hour.toFixed(1) : 'N/A'}
              </div>
            </Card>
          </div>

          {/* Completion Rate */}
          <Card className={`${cardBg} p-6 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
            <h3 className={`${textPrimary} text-xl font-bold mb-4`}>Completion Rate</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className={`${textSecondary} text-sm`}>Completion Rate</span>
                  <span className={`${textPrimary} font-semibold`}>
                    {performance.total_orders > 0 
                      ? `${((performance.completed_orders / performance.total_orders) * 100).toFixed(1)}%`
                      : '0%'
                    }
                  </span>
                </div>
                <div className={`${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-full h-3`}>
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all duration-500"
                    style={{ 
                      width: performance.total_orders > 0 
                        ? `${(performance.completed_orders / performance.total_orders) * 100}%`
                        : '0%'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </Card>

          {/* Station Performance */}
          {performance.station_performance && performance.station_performance.length > 0 && (
            <Card className={`${cardBg} p-6 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
              <h3 className={`${textPrimary} text-xl font-bold mb-4`}>Station Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {performance.station_performance.map((station, index) => (
                  <Card key={index} className={`${innerCardBg} p-4`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} p-2 rounded-lg`}>
                        <ChefHat className={`h-4 w-4 ${textPrimary}`} />
                      </div>
                      <h4 className={`${textPrimary} font-semibold`}>{station.station}</h4>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`${textSecondary} text-sm`}>Orders:</span>
                        <span className={`${textPrimary} font-medium`}>{formatNumber(station.orders_count)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`${textSecondary} text-sm`}>Avg Time:</span>
                        <span className={`${textPrimary} font-medium`}>
                          {formatDuration(station.average_prep_time)}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          )}

          {/* Performance Insights */}
          <Card className={`${cardBg} p-6 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
            <h3 className={`${textPrimary} text-xl font-bold mb-4`}>Performance Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className={`${textPrimary} font-semibold mb-3`}>Efficiency Metrics</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`${textSecondary}`}>Completion Rate:</span>
                    <span className={`${getPerformanceColor(
                      performance.total_orders > 0 ? (performance.completed_orders / performance.total_orders) * 100 : 0,
                      80
                    )} font-medium`}>
                      {performance.total_orders > 0 
                        ? `${((performance.completed_orders / performance.total_orders) * 100).toFixed(1)}%`
                        : '0%'
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`${textSecondary}`}>Avg Prep Time:</span>
                    <span className={`${getPerformanceColor(
                      performance.average_prep_time || 0,
                      30,
                      true
                    )} font-medium`}>
                      {performance.average_prep_time ? formatDuration(performance.average_prep_time) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`${textSecondary}`}>Orders/Hour:</span>
                    <span className={`${getPerformanceColor(
                      performance.orders_per_hour || 0,
                      5
                    )} font-medium`}>
                      {performance.orders_per_hour ? performance.orders_per_hour.toFixed(1) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className={`${textPrimary} font-semibold mb-3`}>Recommendations</h4>
                <div className="space-y-2">
                  {performance.total_orders > 0 && (performance.completed_orders / performance.total_orders) < 0.8 && (
                    <div className={`${isDark ? 'bg-yellow-900/20 border-yellow-500' : 'bg-yellow-50 border-yellow-200'} border rounded-lg p-3`}>
                      <p className={`${isDark ? 'text-yellow-300' : 'text-yellow-600'} text-sm`}>
                        Consider optimizing workflow to improve completion rate
                      </p>
                    </div>
                  )}
                  {performance.average_prep_time && performance.average_prep_time > 30 && (
                    <div className={`${isDark ? 'bg-orange-900/20 border-orange-500' : 'bg-orange-50 border-orange-200'} border rounded-lg p-3`}>
                      <p className={`${isDark ? 'text-orange-300' : 'text-orange-600'} text-sm`}>
                        Average prep time is high - consider streamlining processes
                      </p>
                    </div>
                  )}
                  {performance.orders_per_hour && performance.orders_per_hour < 5 && (
                    <div className={`${isDark ? 'bg-blue-900/20 border-blue-500' : 'bg-blue-50 border-blue-200'} border rounded-lg p-3`}>
                      <p className={`${isDark ? 'text-blue-300' : 'text-blue-600'} text-sm`}>
                        Consider adding more staff during peak hours
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
