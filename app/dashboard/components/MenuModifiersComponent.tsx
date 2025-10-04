// app/dashboard/components/menu/MenuModifiersComponent.tsx

"use client"

import { useState } from 'react'
import { Plus, Edit, Trash2, Loader2, Settings, ToggleLeft, ToggleRight } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

interface ModifierOption {
  id: string
  name: string
  price: number
  isDefault: boolean
}

interface Modifier {
  id: string
  name: string
  description: string
  type: 'single' | 'multiple'
  isRequired: boolean
  isActive: boolean
  minSelections: number
  maxSelections: number
  options: ModifierOption[]
  appliedToItems: number
}

export default function MenuModifiersComponent() {
  const { theme, isLoaded: themeLoaded, isDark } = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'required' | 'optional'>('all')

  // Mock data - replace with actual data fetching
  const [modifiers] = useState<Modifier[]>([
    {
      id: '1',
      name: 'Pizza Size',
      description: 'Choose your pizza size',
      type: 'single',
      isRequired: true,
      isActive: true,
      minSelections: 1,
      maxSelections: 1,
      appliedToItems: 12,
      options: [
        { id: '1a', name: 'Small (10")', price: 0, isDefault: false },
        { id: '1b', name: 'Medium (12")', price: 3, isDefault: true },
        { id: '1c', name: 'Large (14")', price: 6, isDefault: false },
        { id: '1d', name: 'Extra Large (16")', price: 9, isDefault: false }
      ]
    },
    {
      id: '2',
      name: 'Toppings',
      description: 'Add extra toppings to your pizza',
      type: 'multiple',
      isRequired: false,
      isActive: true,
      minSelections: 0,
      maxSelections: 5,
      appliedToItems: 12,
      options: [
        { id: '2a', name: 'Pepperoni', price: 2, isDefault: false },
        { id: '2b', name: 'Mushrooms', price: 1.5, isDefault: false },
        { id: '2c', name: 'Bell Peppers', price: 1.5, isDefault: false },
        { id: '2d', name: 'Extra Cheese', price: 2.5, isDefault: false },
        { id: '2e', name: 'Olives', price: 1, isDefault: false }
      ]
    },
    {
      id: '3',
      name: 'Spice Level',
      description: 'How spicy would you like it?',
      type: 'single',
      isRequired: true,
      isActive: true,
      minSelections: 1,
      maxSelections: 1,
      appliedToItems: 8,
      options: [
        { id: '3a', name: 'Mild', price: 0, isDefault: true },
        { id: '3b', name: 'Medium', price: 0, isDefault: false },
        { id: '3c', name: 'Hot', price: 0, isDefault: false },
        { id: '3d', name: 'Extra Hot', price: 0.5, isDefault: false }
      ]
    },
    {
      id: '4',
      name: 'Drink Size',
      description: 'Choose your drink size',
      type: 'single',
      isRequired: false,
      isActive: false,
      minSelections: 0,
      maxSelections: 1,
      appliedToItems: 6,
      options: [
        { id: '4a', name: 'Small', price: 0, isDefault: true },
        { id: '4b', name: 'Medium', price: 1, isDefault: false },
        { id: '4c', name: 'Large', price: 2, isDefault: false }
      ]
    },
    {
      id: '5',
      name: 'Sauce Selection',
      description: 'Choose your preferred sauce',
      type: 'multiple',
      isRequired: false,
      isActive: true,
      minSelections: 0,
      maxSelections: 3,
      appliedToItems: 15,
      options: [
        { id: '5a', name: 'Ranch', price: 0.5, isDefault: false },
        { id: '5b', name: 'BBQ', price: 0.5, isDefault: false },
        { id: '5c', name: 'Hot Sauce', price: 0.5, isDefault: false },
        { id: '5d', name: 'Garlic Aioli', price: 0.75, isDefault: false }
      ]
    }
  ])

  const filteredModifiers = modifiers.filter(modifier => {
    if (activeTab === 'required') return modifier.isRequired
    if (activeTab === 'optional') return !modifier.isRequired
    return true
  })

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

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className={`${cardBg} p-8 border shadow-lg transition-colors duration-300`} style={{ borderRadius: '1.5rem' }}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className={`text-4xl font-bold ${textPrimary} mb-2 transition-colors duration-300`}>Menu Modifiers</h1>
            <p className={`${textSecondary} transition-colors duration-300`}>Manage customization options for menu items</p>
          </div>
          <button
            className={`${primaryButtonBg} px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-2xl hover:scale-110 transition-all border font-medium`}
          >
            <Plus className="h-4 w-4" />
            Add Modifier
          </button>
        </div>
      </div>

      {/* Modifier Tabs */}
      <div className={`${cardBg} p-3 border shadow-lg flex gap-2 transition-colors duration-300`} style={{ borderRadius: '1.5rem' }}>
        {[
          { id: 'all', label: 'All Modifiers' },
          { id: 'required', label: 'Required' },
          { id: 'optional', label: 'Optional' }
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
            {tab.label} ({tab.id === 'all' ? modifiers.length : 
              tab.id === 'required' ? modifiers.filter(m => m.isRequired).length :
              modifiers.filter(m => !m.isRequired).length})
          </button>
        ))}
      </div>

      {/* Modifiers List */}
      <div className="space-y-4">
        {filteredModifiers.map((modifier, index) => (
          <div
            key={modifier.id}
            className={`${cardBg} p-6 border shadow-lg hover:shadow-xl transition-all duration-300`}
            style={{
              borderRadius: index % 3 === 0 ? '1.5rem' : index % 3 === 1 ? '2rem' : '1rem',
            }}
          >
            {/* Modifier Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className={`${textPrimary} font-semibold text-lg`}>{modifier.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    modifier.isRequired 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {modifier.isRequired ? 'Required' : 'Optional'}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    modifier.type === 'single' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {modifier.type === 'single' ? 'Single Choice' : 'Multiple Choice'}
                  </span>
                </div>
                <p className={`${textSecondary} text-sm mb-2`}>{modifier.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className={`${textSecondary}`}>
                    Applied to {modifier.appliedToItems} items
                  </span>
                  <span className={`${textSecondary}`}>
                    {modifier.minSelections}-{modifier.maxSelections} selections
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Active Toggle */}
                <button className={`${modifier.isActive ? 'text-green-500' : 'text-gray-400'}`}>
                  {modifier.isActive ? (
                    <ToggleRight className="h-6 w-6" />
                  ) : (
                    <ToggleLeft className="h-6 w-6" />
                  )}
                </button>
                
                {/* Action Buttons */}
                <button 
                  className={`${textSecondary} ${isDark ? 'hover:text-white' : 'hover:text-gray-900'} p-2 transition-colors duration-300`} 
                  title="Edit Modifier"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  className={`${textSecondary} hover:text-red-400 p-2 transition-colors duration-300`} 
                  title="Delete Modifier"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Modifier Options */}
            <div className={`${innerCardBg} p-4 border rounded-xl`}>
              <h4 className={`${textPrimary} font-medium text-sm mb-3`}>Options ({modifier.options.length})</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {modifier.options.map((option) => (
                  <div
                    key={option.id}
                    className={`flex items-center justify-between p-3 ${isDark ? 'bg-[#2a2a2a]' : 'bg-white'} rounded-lg border`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`${textPrimary} text-sm font-medium`}>{option.name}</span>
                      {option.isDefault && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <span className={`${isDark ? 'text-green-400' : 'text-green-600'} text-sm font-bold`}>
                      {option.price > 0 ? `+${option.price.toFixed(2)}` : 'Free'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modifier Stats Overview */}
      <div className={`${cardBg} p-6 border shadow-lg transition-colors duration-300`} style={{ borderRadius: '1.5rem' }}>
        <h2 className={`text-xl font-bold ${textPrimary} mb-4`}>Modifier Overview</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`${textPrimary} text-2xl font-bold`}>{modifiers.length}</div>
            <div className={`${textSecondary} text-sm`}>Total Modifiers</div>
          </div>
          <div className="text-center">
            <div className={`${textPrimary} text-2xl font-bold`}>{modifiers.filter(m => m.isActive).length}</div>
            <div className={`${textSecondary} text-sm`}>Active</div>
          </div>
          <div className="text-center">
            <div className={`${textPrimary} text-2xl font-bold`}>{modifiers.filter(m => m.isRequired).length}</div>
            <div className={`${textSecondary} text-sm`}>Required</div>
          </div>
          <div className="text-center">
            <div className={`${textPrimary} text-2xl font-bold`}>
              {modifiers.reduce((sum, m) => sum + m.options.length, 0)}
            </div>
            <div className={`${textSecondary} text-sm`}>Total Options</div>
          </div>
        </div>
      </div>
    </div>
  )
}