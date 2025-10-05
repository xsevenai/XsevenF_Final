// app/dashboard/components/NotificationComponent.tsx

"use client"

import { useState } from 'react'
import { Check, Clock, AlertCircle, ShoppingCart, Users, Package, Bell, CheckCheck } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

interface Notification {
  id: string
  type: 'order' | 'alert' | 'customer' | 'inventory'
  title: string
  message: string
  time: string
  isRead: boolean
}

export default function NotificationComponent() {
  const { isDark } = useTheme()
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'order',
      title: 'New Order Received',
      message: 'Order #1234 from Table 5 - $45.50',
      time: '2 min ago',
      isRead: false
    },
    {
      id: '2',
      type: 'alert',
      title: 'Low Stock Alert',
      message: 'Tomatoes running low - 5 items left',
      time: '15 min ago',
      isRead: false
    },
    {
      id: '3',
      type: 'customer',
      title: 'New Customer Review',
      message: 'John D. left a 5-star review',
      time: '1 hour ago',
      isRead: true
    },
    {
      id: '4',
      type: 'inventory',
      title: 'Restock Complete',
      message: 'Fresh vegetables delivery received',
      time: '3 hours ago',
      isRead: true
    }
  ])

  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'

  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingCart className="h-5 w-5 text-green-500" />
      case 'alert': return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'customer': return <Users className="h-5 w-5 text-blue-500" />
      case 'inventory': return <Package className="h-5 w-5 text-yellow-500" />
      default: return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className={`${cardBg} p-8 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>Notifications</h1>
            <p className={`${textSecondary}`}>Stay updated with your restaurant activities</p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className={`${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535] border-[#3a3a3a]' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'} ${textPrimary} px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:shadow-xl hover:scale-105 transition-all border font-medium`}
            >
              <CheckCheck className="h-4 w-4" />
              Mark All Read ({unreadCount})
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <div className="p-6">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className={`h-16 w-16 ${textSecondary} mx-auto mb-4`} />
              <h3 className={`text-xl font-semibold ${textPrimary} mb-2`}>No notifications yet</h3>
              <p className={`${textSecondary}`}>You'll see updates about orders, alerts, and more here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className={`${innerCardBg} p-5 border cursor-pointer hover:shadow-lg transition-all duration-300 ${
                    !notification.isRead ? 'ring-2 ring-blue-500/20' : ''
                  }`}
                  style={{ borderRadius: index % 2 === 0 ? '1rem' : '1.5rem' }}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{getIcon(notification.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`font-semibold ${textPrimary}`}>{notification.title}</h3>
                        {!notification.isRead ? (
                          <div className="w-3 h-3 bg-blue-500 rounded-full" />
                        ) : (
                          <Check className={`h-4 w-4 ${textSecondary}`} />
                        )}
                      </div>
                      <p className={`${textSecondary} mb-3`}>{notification.message}</p>
                      <div className="flex items-center gap-2">
                        <Clock className={`h-4 w-4 ${textSecondary}`} />
                        <span className={`text-sm ${textSecondary}`}>{notification.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}