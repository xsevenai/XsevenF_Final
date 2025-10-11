// app/dashboard/kds-component/components/KDSStatsOverview.tsx

"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Clock, 
  Users, 
  ChefHat, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Timer,
  Target
} from "lucide-react"
import type { KDSOrderWithMetrics, KDSStatus } from "@/src/api/generated/models/KDSOrderWithMetrics"

interface KDSStatsOverviewProps {
  orders: KDSOrderWithMetrics[]
  performance?: any
  onStatusFilter?: (status: string) => void
  selectedStatus?: string
  isDark?: boolean
}

export default function KDSStatsOverview({ 
  orders, 
  performance, 
  onStatusFilter, 
  selectedStatus = "all",
  isDark = false 
}: KDSStatsOverviewProps) {
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'

  // Calculate status counts
  const statusCounts = {
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    served: orders.filter(o => o.status === 'served').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  }

  // Calculate performance metrics
  const totalOrders = orders.length
  const activeOrders = orders.filter(o => ['pending', 'preparing', 'ready'].includes(o.status)).length
  const completedOrders = orders.filter(o => o.status === 'served').length
  
  // Calculate average prep time
  const ordersWithPrepTime = orders.filter(o => o.prep_start_time && o.prep_end_time)
  const avgPrepTime = ordersWithPrepTime.length > 0 
    ? ordersWithPrepTime.reduce((sum, order) => {
        const start = new Date(order.prep_start_time!)
        const end = new Date(order.prep_end_time!)
        return sum + (end.getTime() - start.getTime())
      }, 0) / ordersWithPrepTime.length / 60000 // Convert to minutes
    : 0

  const getStatusColor = (status: KDSStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500'
      case 'preparing': return 'bg-blue-500'
      case 'ready': return 'bg-green-500'
      case 'served': return 'bg-gray-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: KDSStatus) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'preparing': return <ChefHat className="h-4 w-4" />
      case 'ready': return <CheckCircle className="h-4 w-4" />
      case 'served': return <Users className="h-4 w-4" />
      case 'cancelled': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Status Counts */}
      <div className="grid grid-cols-5 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div 
            key={status}
            className={`${cardBg} p-5 border shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105`}
            style={{ borderRadius: '1.5rem' }}
            onClick={() => onStatusFilter?.(status === selectedStatus ? "all" : status)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`${getStatusColor(status as KDSStatus)} p-2 rounded-lg`}>
                {getStatusIcon(status as KDSStatus)}
              </div>
              <Badge variant={selectedStatus === status ? "default" : "secondary"}>
                {count}
              </Badge>
            </div>
            <h3 className={`${textSecondary} text-xs font-medium uppercase tracking-wider mb-1`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </h3>
            <div className={`${textPrimary} text-2xl font-bold`}>{count}</div>
          </div>
        ))}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Orders */}
        <Card className={`${cardBg} p-6 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
          <div className="flex items-center justify-between mb-4">
            <div className={`${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} p-3 rounded-2xl`}>
              <TrendingUp className={`h-6 w-6 ${textPrimary}`} />
            </div>
            <Badge variant="outline">Total</Badge>
          </div>
          <h3 className={`${textSecondary} text-xs font-medium uppercase tracking-wider mb-2`}>Total Orders</h3>
          <div className={`${textPrimary} text-3xl font-bold`}>{totalOrders}</div>
        </Card>

        {/* Active Orders */}
        <Card className={`${cardBg} p-6 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
          <div className="flex items-center justify-between mb-4">
            <div className={`${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} p-3 rounded-2xl`}>
              <Timer className={`h-6 w-6 ${textPrimary}`} />
            </div>
            <Badge variant="outline">Active</Badge>
          </div>
          <h3 className={`${textSecondary} text-xs font-medium uppercase tracking-wider mb-2`}>Active Orders</h3>
          <div className={`${textPrimary} text-3xl font-bold`}>{activeOrders}</div>
        </Card>

        {/* Average Prep Time */}
        <Card className={`${cardBg} p-6 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
          <div className="flex items-center justify-between mb-4">
            <div className={`${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} p-3 rounded-2xl`}>
              <Target className={`h-6 w-6 ${textPrimary}`} />
            </div>
            <Badge variant="outline">Avg</Badge>
          </div>
          <h3 className={`${textSecondary} text-xs font-medium uppercase tracking-wider mb-2`}>Avg Prep Time</h3>
          <div className={`${textPrimary} text-3xl font-bold`}>
            {avgPrepTime > 0 ? `${Math.round(avgPrepTime)}m` : 'N/A'}
          </div>
        </Card>
      </div>

      {/* Performance Data */}
      {performance && (
        <Card className={`${cardBg} p-6 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
          <h3 className={`${textPrimary} text-xl font-bold mb-4`}>Performance Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`${textSecondary} text-sm mb-1`}>Orders Completed</div>
              <div className={`${textPrimary} text-2xl font-bold`}>{completedOrders}</div>
            </div>
            <div className="text-center">
              <div className={`${textSecondary} text-sm mb-1`}>Completion Rate</div>
              <div className={`${textPrimary} text-2xl font-bold`}>
                {totalOrders > 0 ? `${Math.round((completedOrders / totalOrders) * 100)}%` : '0%'}
              </div>
            </div>
            <div className="text-center">
              <div className={`${textSecondary} text-sm mb-1`}>Active Stations</div>
              <div className={`${textPrimary} text-2xl font-bold`}>
                {new Set(orders.map(o => o.station)).size}
              </div>
            </div>
            <div className="text-center">
              <div className={`${textSecondary} text-sm mb-1`}>Orders/Hour</div>
              <div className={`${textPrimary} text-2xl font-bold`}>
                {performance.orders_per_hour || 'N/A'}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
