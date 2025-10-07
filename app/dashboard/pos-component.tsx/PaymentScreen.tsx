"use client"

import { useTheme } from "@/hooks/useTheme"
import { useState } from "react"
import { ArrowLeft, DollarSign, CreditCard, Wallet, Tag } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  quantity: number
}

interface PaymentScreenProps {
  cart: Product[]
  onBack: () => void
  onOrderComplete: (paymentMethod: string, discount?: number) => void
}

export default function PaymentScreen({ cart, onBack, onOrderComplete }: PaymentScreenProps) {
  const { isDark } = useTheme()
  const [selectedPayment, setSelectedPayment] = useState<string>("cash")
  const [discount, setDiscount] = useState<number>(0)

  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'
  
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + tax - discount

  const handleCompleteOrder = () => {
    onOrderComplete(selectedPayment, discount)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className={`${cardBg} p-6 border shadow-lg flex justify-between items-center`} style={{ borderRadius: '1.5rem' }}>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </button>
        <h1 className={`text-3xl font-bold ${textPrimary}`}>Payment & Checkout</h1>
      </div>

      {/* Order Summary */}
      <div className={`${cardBg} p-6 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <h2 className={`${textPrimary} text-xl font-semibold mb-4`}>Order Summary</h2>
        <div className="space-y-2">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between">
              <span className={`${textPrimary}`}>{item.quantity}x {item.name}</span>
              <span className={`${textSecondary}`}>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span className={`${textPrimary} font-medium`}>Subtotal:</span>
            <span className={`${textSecondary}`}>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className={`${textPrimary} font-medium`}>Tax (8%):</span>
            <span className={`${textSecondary}`}>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className={`${textPrimary} font-medium`}>Discount:</span>
            <input
              type="number"
              min={0}
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className={`w-20 px-2 py-1 rounded border ${innerCardBg} ${textPrimary}`}
            />
          </div>
          <div className="flex justify-between font-bold text-2xl mt-2">
            <span>Total:</span>
            <span className="text-green-500">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className={`${cardBg} p-6 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <h2 className={`${textPrimary} text-xl font-semibold mb-4`}>Select Payment Method</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setSelectedPayment("cash")}
            className={`flex-1 p-4 rounded-xl flex flex-col items-center gap-2 font-semibold transition-colors
              ${selectedPayment === "cash" ? 'bg-blue-500 text-white' : `${innerCardBg} ${textPrimary}`}`}
          >
            <DollarSign className="h-6 w-6" />
            Cash
          </button>
          <button
            onClick={() => setSelectedPayment("card")}
            className={`flex-1 p-4 rounded-xl flex flex-col items-center gap-2 font-semibold transition-colors
              ${selectedPayment === "card" ? 'bg-blue-500 text-white' : `${innerCardBg} ${textPrimary}`}`}
          >
            <CreditCard className="h-6 w-6" />
            Card
          </button>
          <button
            onClick={() => setSelectedPayment("wallet")}
            className={`flex-1 p-4 rounded-xl flex flex-col items-center gap-2 font-semibold transition-colors
              ${selectedPayment === "wallet" ? 'bg-blue-500 text-white' : `${innerCardBg} ${textPrimary}`}`}
          >
            <Wallet className="h-6 w-6" />
            Wallet
          </button>
        </div>
      </div>

      {/* Complete Order */}
      <div className="flex justify-end">
        <button
          onClick={handleCompleteOrder}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold transition-colors"
        >
          Complete Order & Print
        </button>
      </div>
    </div>
  )
}
