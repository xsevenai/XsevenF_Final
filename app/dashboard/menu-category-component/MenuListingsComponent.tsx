// app/dashboard/components/menu/MenuListingsComponent.tsx

"use client"

import { useState } from 'react'
import { Plus, Edit, Trash2, Loader2, ExternalLink, ToggleLeft, ToggleRight } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

interface Platform {
  id: string
  name: string
  logo: string
  isConnected: boolean
  isActive: boolean
  syncStatus: 'synced' | 'pending' | 'error'
  lastSync: string
  itemCount: number
}

export default function MenuListingsComponent() {
  const { theme, isLoaded: themeLoaded, isDark } = useTheme()
  const [isLoading, setIsLoading] = useState(false)

  // Mock data - replace with actual data fetching
  const [platforms] = useState<Platform[]>([
    {
      id: '1',
      name: 'Uber Eats',
      logo: 'https://logo.clearbit.com/ubereats.com',
      isConnected: true,
      isActive: true,
      syncStatus: 'synced',
      lastSync: '2 minutes ago',
      itemCount: 45
    },
    {
      id: '2',
      name: 'DoorDash',
      logo: 'https://logo.clearbit.com/doordash.com',
      isConnected: true,
      isActive: false,
      syncStatus: 'pending',
      lastSync: '1 hour ago',
      itemCount: 42
    },
    {
      id: '3',
      name: 'Grubhub',
      logo: 'https://logo.clearbit.com/grubhub.com',
      isConnected: false,
      isActive: false,
      syncStatus: 'error',
      lastSync: 'Never',
      itemCount: 0
    },
    {
      id: '4',
      name: 'Swiggy',
      logo: 'https://logo.clearbit.com/swiggy.com',
      isConnected: true,
      isActive: true,
      syncStatus: 'synced',
      lastSync: '5 minutes ago',
      itemCount: 38
    }
  ])

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'synced': return 'text-green-500'
      case 'pending': return 'text-yellow-500'
      case 'error': return 'text-red-500'
      default: return textSecondary
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'synced': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className={`${cardBg} p-8 border shadow-lg transition-colors duration-300`} style={{ borderRadius: '1.5rem' }}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className={`text-4xl font-bold ${textPrimary} mb-2 transition-colors duration-300`}>Channel Listings</h1>
            <p className={`${textSecondary} transition-colors duration-300`}>Manage your menu across different delivery platforms</p>
          </div>
          <button
            className={`${isDark ? 'bg-gradient-to-r from-[#0f0f0f] via-[#1a1a1a] to-[#2a2a2a] hover:from-[#1a1a1a] hover:via-[#222222] hover:to-[#333333] text-white border-[#444444]' : 'bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200 hover:from-gray-100 hover:via-gray-200 hover:to-gray-300 text-gray-900 border-gray-300'} px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-2xl hover:scale-110 transition-all border font-medium`}
          >
            <Plus className="h-4 w-4" />
            Connect Platform
          </button>
        </div>
      </div>

      {/* Platform Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {platforms.map((platform, index) => (
          <div
            key={platform.id}
            className={`${innerCardBg} p-6 border hover:shadow-xl transition-all duration-300`}
            style={{
              borderRadius: index % 3 === 0 ? '2rem' : index % 3 === 1 ? '1rem' : '1.5rem',
            }}
          >
            {/* Platform Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-white p-2">
                  <img 
                    src={platform.logo} 
                    alt={platform.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'><rect width='40' height='40' fill='%23f3f4f6'/><text x='20' y='25' text-anchor='middle' fill='%236b7280' font-size='12'>${platform.name.charAt(0)}</text></svg>`
                    }}
                  />
                </div>
                <div>
                  <h3 className={`${textPrimary} font-semibold text-lg`}>{platform.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBg(platform.syncStatus)}`}>
                      {platform.syncStatus.charAt(0).toUpperCase() + platform.syncStatus.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Connection Toggle */}
              <button className={`${getStatusColor(platform.isConnected ? 'synced' : 'error')}`}>
                {platform.isConnected ? (
                  <ToggleRight className="h-8 w-8" />
                ) : (
                  <ToggleLeft className="h-8 w-8" />
                )}
              </button>
            </div>

            {/* Platform Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className={`${textSecondary} text-sm`}>Menu Items</p>
                <p className={`${textPrimary} text-xl font-bold`}>{platform.itemCount}</p>
              </div>
              <div>
                <p className={`${textSecondary} text-sm`}>Last Sync</p>
                <p className={`${textPrimary} text-sm font-medium`}>{platform.lastSync}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                disabled={!platform.isConnected}
                className={`flex-1 ${
                  platform.isConnected 
                    ? isDark 
                      ? 'bg-[#2a2a2a] hover:bg-[#333333] text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                } px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2`}
              >
                <Edit className="h-4 w-4" />
                Manage
              </button>
              <button
                disabled={!platform.isConnected}
                className={`flex-1 ${
                  platform.isConnected 
                    ? isDark 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                } px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2`}
              >
                <ExternalLink className="h-4 w-4" />
                Sync Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className={`${cardBg} p-6 border shadow-lg transition-colors duration-300`} style={{ borderRadius: '1.5rem' }}>
        <h2 className={`text-xl font-bold ${textPrimary} mb-4`}>Platform Overview</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`${textPrimary} text-2xl font-bold`}>{platforms.filter(p => p.isConnected).length}</div>
            <div className={`${textSecondary} text-sm`}>Connected</div>
          </div>
          <div className="text-center">
            <div className={`${textPrimary} text-2xl font-bold`}>{platforms.filter(p => p.isActive).length}</div>
            <div className={`${textSecondary} text-sm`}>Active</div>
          </div>
          <div className="text-center">
            <div className={`${textPrimary} text-2xl font-bold`}>{platforms.reduce((sum, p) => sum + p.itemCount, 0)}</div>
            <div className={`${textSecondary} text-sm`}>Total Items</div>
          </div>
          <div className="text-center">
            <div className={`${textPrimary} text-2xl font-bold`}>{platforms.filter(p => p.syncStatus === 'synced').length}</div>
            <div className={`${textSecondary} text-sm`}>In Sync</div>
          </div>
        </div>
      </div>
    </div>
  )
}