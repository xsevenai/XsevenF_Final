// app/dashboard/components/customer/CustomerFeedbackComponent.tsx
"use client"

import { useState } from 'react'
import { Star, MessageCircle, ThumbsUp, ThumbsDown } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

export default function CustomerFeedbackComponent() {
  const { isDark } = useTheme()
  const [feedback] = useState([
    { id: '1', customer: 'Alice Johnson', rating: 5, comment: 'Amazing food and service!', date: '2024-01-15', type: 'positive' },
    { id: '2', customer: 'Mike Brown', rating: 4, comment: 'Good food, could improve delivery time', date: '2024-01-14', type: 'neutral' },
    { id: '3', customer: 'Sarah Davis', rating: 2, comment: 'Food was cold when delivered', date: '2024-01-13', type: 'negative' }
  ])

  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'positive': return <ThumbsUp className="h-4 w-4 text-green-500" />
      case 'negative': return <ThumbsDown className="h-4 w-4 text-red-500" />
      default: return <MessageCircle className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className={`${cardBg} p-8 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>Customer Feedback</h1>
        <p className={`${textSecondary}`}>View and manage customer reviews and feedback</p>
      </div>

      <div className="space-y-4">
        {feedback.map((item) => (
          <div key={item.id} className={`${cardBg} p-5 border hover:shadow-lg transition-all rounded-xl`}>
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                {getTypeIcon(item.type)}
                <div>
                  <h3 className={`${textPrimary} font-semibold`}>{item.customer}</h3>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < item.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                    <span className={`${textSecondary} text-sm ml-2`}>{item.rating}/5</span>
                  </div>
                </div>
              </div>
              <span className={`${textSecondary} text-sm`}>{item.date}</span>
            </div>
            <p className={`${textPrimary} text-sm`}>{item.comment}</p>
          </div>
        ))}
      </div>
    </div>
  )
}