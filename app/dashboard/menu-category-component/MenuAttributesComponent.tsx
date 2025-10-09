// app/dashboard/components/menu/MenuAttributesComponent.tsx
"use client"

import { useState } from 'react'
import { Plus, Edit, Trash2, Loader2, Tags } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

export default function MenuAttributesComponent() {
  const { isDark } = useTheme()
  const [attributes] = useState([
    { id: '1', name: 'Spicy', type: 'boolean', value: 'true/false', items: 15 },
    { id: '2', name: 'Vegetarian', type: 'boolean', value: 'true/false', items: 22 },
    { id: '3', name: 'Calories', type: 'number', value: '0-2000', items: 35 },
    { id: '4', name: 'Allergens', type: 'text', value: 'nuts, dairy, etc', items: 28 }
  ])

  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'

  return (
    <div className="p-6 space-y-6">
      <div className={`${cardBg} p-8 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>Custom Attributes</h1>
            <p className={`${textSecondary}`}>Manage custom properties for menu items</p>
          </div>
          <button className={`${isDark ? 'bg-[#2a2a2a] hover:bg-[#333]' : 'bg-gray-100 hover:bg-gray-200'} ${textPrimary} px-4 py-2 rounded-lg flex items-center gap-2 transition-all`}>
            <Plus className="h-4 w-4" />
            Add Attribute
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {attributes.map((attr, index) => (
          <div key={attr.id} className={`${innerCardBg} p-5 border hover:shadow-xl transition-all`} style={{ borderRadius: index % 2 === 0 ? '1.5rem' : '1rem' }}>
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <Tags className={`h-5 w-5 ${textSecondary}`} />
                <div>
                  <h3 className={`${textPrimary} font-semibold`}>{attr.name}</h3>
                  <p className={`${textSecondary} text-sm`}>Type: {attr.type}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button className={`${textSecondary} hover:text-blue-400 p-1`}><Edit className="h-4 w-4" /></button>
                <button className={`${textSecondary} hover:text-red-400 p-1`}><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
            <div className={`${textSecondary} text-sm mb-2`}>Values: {attr.value}</div>
            <div className={`${textSecondary} text-xs`}>Applied to {attr.items} items</div>
          </div>
        ))}
      </div>
    </div>
  )
}
