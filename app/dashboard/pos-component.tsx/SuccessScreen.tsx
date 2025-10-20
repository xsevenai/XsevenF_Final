"use client"

import { useTheme } from "@/hooks/useTheme"
import { CheckCircle2 } from "lucide-react"

interface SuccessScreenProps {
  orderId: string
  amount: number
  onDone: () => void
}

export default function SuccessScreen({ orderId, amount, onDone }: SuccessScreenProps) {
  const { isDark } = useTheme()
  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'

  return (
    <div className="p-6 space-y-6 flex items-center justify-center min-h-[60vh]">
      <div className={`${cardBg} p-10 border shadow-xl text-center`} style={{ borderRadius: '1.5rem' }}>
        <CheckCircle2 className="h-14 w-14 text-green-500 mx-auto mb-4" />
        <h1 className={`text-3xl font-bold ${textPrimary} mb-2`}>Payment Successful</h1>
        <p className={`${textSecondary} mb-6`}>Order {orderId} has been completed.</p>
        <div className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'} mb-6`}>₹{amount.toFixed(2)}</div>
        <button onClick={onDone} className={`${isDark ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'} px-6 py-3 rounded-xl font-semibold`}>Done</button>
      </div>
    </div>
  )
}


