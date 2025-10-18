// Example usage of the updated OrdersAnalytics component
// This file shows how to integrate the OrdersAnalytics component with the new hook

import OrdersAnalytics from '@/app/dashboard/analytics-component/OrdersAnalytics'

// Example parent component that uses OrdersAnalytics
export default function AnalyticsDashboard() {
  const businessId = "your-business-id-here" // Replace with actual business ID
  const timeRange = "7d" // Can be "1d", "7d", "30d", or "90d"

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Orders Analytics Dashboard</h1>
      
      {/* The component now requires both timeRange and businessId props */}
      <OrdersAnalytics 
        timeRange={timeRange} 
        businessId={businessId} 
      />
    </div>
  )
}

// Alternative: Using the hook directly in a custom component
import { useOrderAnalytics } from '@/hooks/use-order-analytics'

export function CustomOrdersAnalytics({ businessId }: { businessId: string }) {
  const { 
    loading, 
    error, 
    getOrdersOverview,
    getOrdersTrend,
    getOrdersByHour,
    getOrderStatusDistribution,
    getOrderTypesDistribution,
    getTopSellingItems,
    getOrdersAnalyticsDashboard 
  } = useOrderAnalytics(businessId)

  const handleFetchData = async () => {
    try {
      // Fetch individual endpoints
      const overview = await getOrdersOverview('7d')
      const trend = await getOrdersTrend('7d')
      const hourly = await getOrdersByHour('7d')
      
      console.log('Orders Overview:', overview)
      console.log('Orders Trend:', trend)
      console.log('Orders by Hour:', hourly)
      
      // Or fetch all data at once
      const dashboardData = await getOrdersAnalyticsDashboard('7d')
      console.log('Complete Dashboard Data:', dashboardData)
      
    } catch (err) {
      console.error('Failed to fetch analytics:', err)
    }
  }

  return (
    <div>
      <button 
        onClick={handleFetchData}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Fetch Analytics Data'}
      </button>
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}
    </div>
  )
}
