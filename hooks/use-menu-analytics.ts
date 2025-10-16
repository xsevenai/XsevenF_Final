// hooks/use-menu-analytics.ts
import { useState, useEffect } from 'react'
import { configureAPI } from '@/lib/api-config'

// Import the generated services
import { MenuAnalyticsService } from '@/src/api/generated/services/MenuAnalyticsService'
import { MenuReviewsService } from '@/src/api/generated/services/MenuReviewsService'

// Import the generated types
import type { MenuAnalyticsOverview } from '@/src/api/generated/models/MenuAnalyticsOverview'
import type { MenuItemPerformance } from '@/src/api/generated/models/MenuItemPerformance'
import type { TopMenuItemsResponse } from '@/src/api/generated/models/TopMenuItemsResponse'
import type { CategoryPerformance } from '@/src/api/generated/models/CategoryPerformance'
import type { CategoryPerformanceResponse } from '@/src/api/generated/models/CategoryPerformanceResponse'
import type { ProfitMarginResponse } from '@/src/api/generated/models/ProfitMarginResponse'
import type { MenuAnalyticsResponse } from '@/src/api/generated/models/MenuAnalyticsResponse'
import type { ReviewStats } from '@/src/api/generated/models/ReviewStats'

export function useMenuAnalytics(businessId: string) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Get Menu Analytics Overview
  const getMenuAnalyticsOverview = async (
    period: '1d' | '7d' | '30d' | '90d' = '7d',
    includeTrends: boolean = true
  ): Promise<MenuAnalyticsOverview> => {
    try {
      setLoading(true)
      setError(null)
      configureAPI()
      
      const result = await MenuAnalyticsService.getMenuAnalyticsOverviewApiV1AnalyticsMenuOverviewBusinessIdGet({
        businessId,
        period,
        includeTrends
      })
      setLastUpdated(new Date())
      
      return {
        ...result,
        trends_included: result.trends_included ?? false
      } as MenuAnalyticsOverview
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get menu analytics overview'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Get Top Menu Items
  const getTopMenuItems = async (
    period: '1d' | '7d' | '30d' | '90d' = '7d',
    limit: number = 10,
    sortBy: 'sales' | 'revenue' | 'margin' = 'revenue'
  ): Promise<TopMenuItemsResponse> => {
    try {
      setLoading(true)
      setError(null)
      configureAPI()
      
      const result = await MenuAnalyticsService.getTopMenuItemsApiV1AnalyticsMenuTopItemsBusinessIdGet({
        businessId,
        period,
        limit,
        sortBy
      })
      setLastUpdated(new Date())
      
      return {
        ...result,
        items: result.items.map(item => ({
          ...item,
          image_url: item.image_url ?? undefined
        }))
      } as TopMenuItemsResponse
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get top menu items'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Get Category Performance
  const getCategoryPerformance = async (
    period: '1d' | '7d' | '30d' | '90d' = '7d',
    includeDetails: boolean = true
  ): Promise<CategoryPerformanceResponse> => {
    try {
      setLoading(true)
      setError(null)
      configureAPI()
      
      const result = await MenuAnalyticsService.getCategoryPerformanceApiV1AnalyticsMenuCategoryPerformanceBusinessIdGet({
        businessId,
        period,
        includeDetails
      })
      setLastUpdated(new Date())
      
      return {
        ...result,
        categories: result.categories.map(category => ({
          ...category,
          description: category.description ?? undefined
        }))
      } as CategoryPerformanceResponse
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get category performance'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Analyze Profit Margins
  const analyzeProfitMargins = async (
    includeRecommendations: boolean = true,
    marginThresholdHigh: number = 70.0,
    marginThresholdLow: number = 30.0
  ): Promise<ProfitMarginResponse> => {
    try {
      setLoading(true)
      setError(null)
      configureAPI()
      
      const result = await MenuAnalyticsService.analyzeProfitMarginsApiV1AnalyticsMenuProfitMarginsBusinessIdGet({
        businessId,
        includeRecommendations,
        marginThresholdHigh,
        marginThresholdLow
      })
      setLastUpdated(new Date())
      
      return {
        ...result,
        overall_analysis: {
          total_revenue: result.overall_analysis?.total_revenue ?? 0,
          total_cost: result.overall_analysis?.total_cost ?? 0,
          overall_profit_margin: result.overall_analysis?.overall_profit_margin ?? 0,
          overall_margin_percentage: result.overall_analysis?.overall_margin_percentage ?? 0,
          ...result.overall_analysis
        }
      } as ProfitMarginResponse
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to analyze profit margins'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Get Complete Dashboard Data
  const getMenuAnalyticsDashboard = async (
    period: '1d' | '7d' | '30d' | '90d' = '7d',
    includeTrends: boolean = true
  ): Promise<MenuAnalyticsResponse> => {
    try {
      setLoading(true)
      setError(null)
      configureAPI()
      
      const result = await MenuAnalyticsService.getMenuAnalyticsDashboardApiV1AnalyticsMenuDashboardBusinessIdGet({
        businessId,
        period,
        includeTrends
      })
      setLastUpdated(new Date())
      
      return {
        ...result,
        overview: {
          ...result.overview,
          trends_included: result.overview.trends_included ?? false
        }
      } as MenuAnalyticsResponse
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get menu analytics dashboard'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Get Review Statistics
  const getReviewStats = async (menuItemId?: string): Promise<ReviewStats> => {
    try {
      setLoading(true)
      setError(null)
      configureAPI()
      
      const result = await MenuReviewsService.getReviewStatsApiV1ReviewsBusinessIdStatsGet({
        businessId,
        menuItemId: menuItemId ?? null
      })
      setLastUpdated(new Date())
      
      return result
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get review statistics'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Refresh Analytics Data
  const refreshMenuAnalytics = async (forceRefresh: boolean = false): Promise<void> => {
    try {
      setLoading(true)
      setError(null)
      configureAPI()
      
      await MenuAnalyticsService.refreshMenuAnalyticsApiV1AnalyticsMenuRefreshBusinessIdPost({
        businessId,
        forceRefresh
      })
      
      setLastUpdated(new Date())
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to refresh menu analytics'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    lastUpdated,
    getMenuAnalyticsOverview,
    getTopMenuItems,
    getCategoryPerformance,
    analyzeProfitMargins,
    getMenuAnalyticsDashboard,
    getReviewStats,
    refreshMenuAnalytics
  }
}
