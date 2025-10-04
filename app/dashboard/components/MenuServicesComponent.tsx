// app/dashboard/components/MenuServicesComponent.tsx

"use client"

import { useState } from 'react'
import { Plus, Edit, Trash2, Clock, Users, DollarSign } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

export default function MenuServicesComponent() {
  const { isDark } = useTheme()
  const [services] = useState([
    { id: '1', name: 'Private Dining', description: 'Exclusive dining experience', price: 150, duration: 180, capacity: 12, bookings: 24 },
    { id: '2', name: 'Wedding Catering', description: 'Full-service wedding catering', price: 75, duration: 480, capacity: 200, bookings: 8 },
    { id: '3', name: 'Corporate Events', description: 'Business meeting catering', price: 35, duration: 240, capacity: 50, bookings: 15 }
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
            <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>Service Library</h1>
            <p className={`${textSecondary}`}>Manage additional services and offerings</p>
          </div>
          <button className={`${isDark ? 'bg-[#2a2a2a] hover:bg-[#333]' : 'bg-gray-100 hover:bg-gray-200'} ${textPrimary} px-4 py-2 rounded-lg flex items-center gap-2 transition-all`}>
            <Plus className="h-4 w-4" />
            Add Service
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <div key={service.id} className={`${innerCardBg} p-6 border hover:shadow-xl transition-all`} style={{ borderRadius: index % 2 === 0 ? '1.5rem' : '1rem' }}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className={`${textPrimary} font-semibold text-lg mb-1`}>{service.name}</h3>
                <p className={`${textSecondary} text-sm mb-3`}>{service.description}</p>
              </div>
              <div className="flex gap-1">
                <button className={`${textSecondary} hover:text-blue-400 p-1`}><Edit className="h-4 w-4" /></button>
                <button className={`${textSecondary} hover:text-red-400 p-1`}><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center">
                <DollarSign className={`h-4 w-4 mx-auto mb-1 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                <div className={`${isDark ? 'text-green-400' : 'text-green-600'} font-bold text-sm`}>${service.price}</div>
                <div className={`${textSecondary} text-xs`}>per person</div>
              </div>
              <div className="text-center">
                <Clock className={`h-4 w-4 mx-auto mb-1 ${textSecondary}`} />
                <div className={`${textPrimary} font-bold text-sm`}>{Math.floor(service.duration / 60)}h {service.duration % 60}m</div>
                <div className={`${textSecondary} text-xs`}>duration</div>
              </div>
              <div className="text-center">
                <Users className={`h-4 w-4 mx-auto mb-1 ${textSecondary}`} />
                <div className={`${textPrimary} font-bold text-sm`}>{service.capacity}</div>
                <div className={`${textSecondary} text-xs`}>max guests</div>
              </div>
            </div>

            <div className={`pt-3 border-t ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'} text-center`}>
              <span className={`text-xs ${textSecondary}`}>{service.bookings} bookings</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}