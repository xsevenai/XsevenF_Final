// app/dashboard/components/customer/CustomerDirectoryComponent.tsx
"use client"

import { useState } from 'react'
import { Plus, Search, UserCheck, Phone, Mail } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

export default function CustomerDirectoryComponent() {
  const { isDark } = useTheme()
  const [customers] = useState([
    { id: '1', name: 'John Doe', email: 'john@email.com', phone: '+1-555-0123', orders: 12, lastVisit: '2024-01-15' },
    { id: '2', name: 'Jane Smith', email: 'jane@email.com', phone: '+1-555-0124', orders: 8, lastVisit: '2024-01-10' },
    { id: '3', name: 'Bob Wilson', email: 'bob@email.com', phone: '+1-555-0125', orders: 15, lastVisit: '2024-01-12' }
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
            <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>Customer Directory</h1>
            <p className={`${textSecondary}`}>Manage customer information and profiles</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${textSecondary}`} />
              <input className={`${innerCardBg} pl-10 pr-4 py-2 rounded-lg border ${textPrimary}`} placeholder="Search customers..." />
            </div>
            <button className={`${isDark ? 'bg-[#2a2a2a] hover:bg-[#333]' : 'bg-gray-100 hover:bg-gray-200'} ${textPrimary} px-4 py-2 rounded-lg flex items-center gap-2`}>
              <Plus className="h-4 w-4" />
              Add Customer
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {customers.map((customer) => (
          <div key={customer.id} className={`${cardBg} p-4 border hover:shadow-lg transition-all rounded-xl`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-xl flex items-center justify-center`}>
                  <UserCheck className={`h-6 w-6 ${textPrimary}`} />
                </div>
                <div>
                  <h3 className={`${textPrimary} font-semibold`}>{customer.name}</h3>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`${textSecondary} flex items-center gap-1`}>
                      <Mail className="h-3 w-3" />
                      {customer.email}
                    </span>
                    <span className={`${textSecondary} flex items-center gap-1`}>
                      <Phone className="h-3 w-3" />
                      {customer.phone}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`${textPrimary} font-bold`}>{customer.orders} orders</div>
                <div className={`${textSecondary} text-sm`}>Last: {customer.lastVisit}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}