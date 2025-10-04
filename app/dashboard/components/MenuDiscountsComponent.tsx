// app/dashboard/components/menu/MenuDiscountsComponent.tsx

"use client"

import { useState } from 'react'
import { Plus, Edit, Trash2, Loader2, Percent, Calendar, Users, Target } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

interface Discount {
  id: string
  name: string
  description: string
  type: 'percentage' | 'fixed' | 'bogo'
  value: number
  code: string
  isActive: boolean
  startDate: string
  endDate: string
  usageLimit: number
  usedCount: number
  minOrderValue: number
  applicableItems: string[]
  conditions: string
}

export default function MenuDiscountsComponent() {
  const { theme, isLoaded: themeLoaded, isDark } = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'expired' | 'scheduled'>('all')

  // Mock data - replace with actual data fetching
  const [discounts] = useState<Discount[]>([
    {
      id: '1',
      name: 'Grand Opening Sale',
      description: '20% off on all orders above $50',
      type: 'percentage',
      value: 20,
      code: 'GRAND20',
      isActive: true,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      usageLimit: 1000,
      usedCount: 245,
      minOrderValue: 50,
      applicableItems: ['all'],
      conditions: 'Valid for first-time customers only'
    },
    {
      id: '2',
      name: 'Student Discount',
      description: '$5 off for students with valid ID',
      type: 'fixed',
      value: 5,
      code: 'STUDENT5',
      isActive: true,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      usageLimit: 500,
      usedCount: 89,
      minOrderValue: 25,
      applicableItems: ['pizzas', 'burgers'],
      conditions: 'Must present valid student ID'
    },
    {
      id: '3',
      name: 'Buy One Get One Pizza',
      description: 'Buy any large pizza, get medium pizza free',
      type: 'bogo',
      value: 0,
      code: 'BOGOPIZZA',
      isActive: false,
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      usageLimit: 200,
      usedCount: 156,
      minOrderValue: 0,
      applicableItems: ['pizzas'],
      conditions: 'Valid on weekdays only'
    },
    {
      id: '4',
      name: 'Weekend Special',
      description: '15% off on weekend orders',
      type: 'percentage',
      value: 15,
      code: 'WEEKEND15',
      isActive: true,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      usageLimit: 0, // unlimited
      usedCount: 67,
      minOrderValue: 30,
      applicableItems: ['all'],
      conditions: 'Valid on Saturday and Sunday only'
    },
    {
      id: '5',
      name: 'Holiday Feast',
      description: '25% off holiday catering orders',
      type: 'percentage',
      value: 25,
      code: 'HOLIDAY25',
      isActive: false,
      startDate: '2024-12-20',
      endDate: '2025-01-05',
      usageLimit: 50,
      usedCount: 0,
      minOrderValue: 100,
      applicableItems: ['catering'],
      conditions: 'For catering orders of 10+ people'
    }
  ])

  const getFilteredDiscounts = () => {
    const now = new Date()
    return discounts.filter(discount => {
      const startDate = new Date(discount.startDate)
      const endDate = new Date(discount.endDate)
      
      switch (activeTab) {
        case 'active':
          return discount.isActive && now >= startDate && now <= endDate
        case 'expired':
          return now > endDate
        case 'scheduled':
          return now < startDate
        default:
          return true
      }
    })
  }

  const filteredDiscounts = getFilteredDiscounts()

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
  
  const activeTabBg = isDark 
    ? 'bg-gradient-to-r from-[#0f0f0f] via-[#1a1a1a] to-[#2a2a2a] text-white border-[#444444]' 
    : 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white border-blue-600'

  const secondaryButtonBg = isDark 
    ? 'bg-gradient-to-r from-[#1a1a1a] via-[#222222] to-[#2a2a2a] hover:from-[#222222] hover:via-[#2a2a2a] hover:to-[#333333] text-gray-300 border-[#333333]' 
    : 'bg-gradient-to-r from-gray-100 via-gray-150 to-gray-200 hover:from-gray-150 hover:via-gray-200 hover:to-gray-250 text-gray-700 border-gray-400'

  const getDiscountTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage': return <Percent className="h-5 w-5" />
      case 'fixed': return <span className="text-lg font-bold">$</span>
      case 'bogo': return <span className="text-sm font-bold">B1G1</span>
      default: return <Percent className="h-5 w-5" />
    }
  }

  const getDiscountValue = (discount: Discount) => {
    switch (discount.type) {
      case 'percentage': return `${discount.value}% OFF`
      case 'fixed': return `$${discount.value} OFF`
      case 'bogo': return 'BUY 1 GET 1'
      default: return 'DISCOUNT'
    }
  }

  const getStatusColor = (discount: Discount) => {
    const now = new Date()
    const startDate = new Date(discount.startDate)
    const endDate = new Date(discount.endDate)
    
    if (!discount.isActive) return 'bg-gray-100 text-gray-800'
    if (now > endDate) return 'bg-red-100 text-red-800'
    if (now < startDate) return 'bg-blue-100 text-blue-800'
    return 'bg-green-100 text-green-800'
  }

  const getStatusText = (discount: Discount) => {
    const now = new Date()
    const startDate = new Date(discount.startDate)
    const endDate = new Date(discount.endDate)
    
    if (!discount.isActive) return 'Inactive'
    if (now > endDate) return 'Expired'
    if (now < startDate) return 'Scheduled'
    return 'Active'
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className={`${cardBg} p-8 border shadow-lg transition-colors duration-300`} style={{ borderRadius: '1.5rem' }}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className={`text-4xl font-bold ${textPrimary} mb-2 transition-colors duration-300`}>Discount Management</h1>
            <p className={`${textSecondary} transition-colors duration-300`}>Create and manage promotional offers</p>
          </div>
          <button
            className={`${primaryButtonBg} px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-2xl hover:scale-110 transition-all border font-medium`}
          >
            <Plus className="h-4 w-4" />
            Create Discount
          </button>
        </div>
      </div>

      {/* Discount Tabs */}
      <div className={`${cardBg} p-3 border shadow-lg flex gap-2 transition-colors duration-300`} style={{ borderRadius: '1.5rem' }}>
        {[
          { id: 'all', label: 'All Discounts' },
          { id: 'active', label: 'Active' },
          { id: 'scheduled', label: 'Scheduled' },
          { id: 'expired', label: 'Expired' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all border
              ${activeTab === tab.id
                ? `${activeTabBg} shadow-md`
                : `${secondaryButtonBg}`
              }
              hover:shadow-md
            `}
          >
            {tab.label} ({getFilteredDiscounts().length})
          </button>
        ))}
      </div>

      {/* Discounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDiscounts.map((discount, index) => (
          <div
            key={discount.id}
            className={`${cardBg} p-6 border shadow-lg hover:shadow-xl transition-all duration-300`}
            style={{
              borderRadius: index % 3 === 0 ? '1.5rem' : index % 3 === 1 ? '2rem' : '1rem',
            }}
          >
            {/* Discount Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`${isDark ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-orange-400 to-red-400'} p-3 rounded-xl text-white`}>
                  {getDiscountTypeIcon(discount.type)}
                </div>
                <div>
                  <h3 className={`${textPrimary} font-semibold text-lg`}>{discount.name}</h3>
                  <p className={`${textSecondary} text-sm`}>{discount.description}</p>
                </div>
              </div>
              
              <div className="flex gap-1">
                <button 
                  className={`${textSecondary} ${isDark ? 'hover:text-white' : 'hover:text-gray-900'} p-1 transition-colors duration-300`} 
                  title="Edit Discount"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  className={`${textSecondary} hover:text-red-400 p-1 transition-colors duration-300`} 
                  title="Delete Discount"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Discount Value */}
            <div className="text-center mb-4">
              <div className={`inline-block ${isDark ? 'bg-gradient-to-r from-green-600 to-blue-600' : 'bg-gradient-to-r from-green-500 to-blue-500'} text-white px-4 py-2 rounded-xl font-bold text-lg`}>
                {getDiscountValue(discount)}
              </div>
              <div className={`${textSecondary} text-sm mt-2`}>
                Code: <span className={`${textPrimary} font-mono font-bold`}>{discount.code}</span>
              </div>
            </div>

            {/* Discount Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Users className={`h-4 w-4 ${textSecondary}`} />
                </div>
                <div className={`${textPrimary} font-bold text-sm`}>
                  {discount.usedCount}
                </div>
                <div className={`${textSecondary} text-xs`}>used</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Target className={`h-4 w-4 ${textSecondary}`} />
                </div>
                <div className={`${textPrimary} font-bold text-sm`}>
                  {discount.usageLimit === 0 ? '∞' : discount.usageLimit}
                </div>
                <div className={`${textSecondary} text-xs`}>limit</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <span className={`text-lg ${textSecondary}`}>$</span>
                </div>
                <div className={`${textPrimary} font-bold text-sm`}>
                  {discount.minOrderValue}
                </div>
                <div className={`${textSecondary} text-xs`}>min order</div>
              </div>
            </div>

            {/* Discount Period */}
            <div className={`${innerCardBg} p-3 border rounded-lg mb-4`}>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className={`h-4 w-4 ${textSecondary}`} />
                <span className={`${textSecondary} text-sm font-medium`}>Valid Period</span>
              </div>
              <div className={`${textPrimary} text-sm`}>
                {new Date(discount.startDate).toLocaleDateString()} - {new Date(discount.endDate).toLocaleDateString()}
              </div>
            </div>

            {/* Status and Conditions */}
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(discount)}`}>
                {getStatusText(discount)}
              </span>
              <div className={`${textSecondary} text-xs`}>
                {discount.conditions}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Discount Stats Overview */}
      <div className={`${cardBg} p-6 border shadow-lg transition-colors duration-300`} style={{ borderRadius: '1.5rem' }}>
        <h2 className={`text-xl font-bold ${textPrimary} mb-4`}>Discount Overview</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`${textPrimary} text-2xl font-bold`}>{discounts.length}</div>
            <div className={`${textSecondary} text-sm`}>Total Discounts</div>
          </div>
          <div className="text-center">
            <div className={`${textPrimary} text-2xl font-bold`}>
              {discounts.filter(d => {
                const now = new Date()
                const startDate = new Date(d.startDate)
                const endDate = new Date(d.endDate)
                return d.isActive && now >= startDate && now <= endDate
              }).length}
            </div>
            <div className={`${textSecondary} text-sm`}>Active Now</div>
          </div>
          <div className="text-center">
            <div className={`${textPrimary} text-2xl font-bold`}>
              {discounts.reduce((sum, d) => sum + d.usedCount, 0)}
            </div>
            <div className={`${textSecondary} text-sm`}>Total Uses</div>
          </div>
          <div className="text-center">
            <div className={`${textPrimary} text-2xl font-bold`}>
              ${Math.round(discounts.reduce((sum, d) => sum + (d.type === 'fixed' ? d.value * d.usedCount : 0), 0))}
            </div>
            <div className={`${textSecondary} text-sm`}>Est. Savings</div>
          </div>
        </div>
      </div>
    </div>
  )
}