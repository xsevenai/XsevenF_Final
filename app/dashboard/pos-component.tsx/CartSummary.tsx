"use client"

import { useTheme } from "@/hooks/useTheme"
import { useState } from "react"
import { ArrowLeft, Trash2, Plus, Minus, DollarSign } from "lucide-react"
import PaymentScreen from "./PaymentScreen"

interface Product {
  id: string
  name: string
  price: number
  quantity: number
}

interface CartSummaryProps {
  cart: Product[]
  onBack: () => void
  onOrderComplete: (paymentMethod: string, discount?: number) => void
}

export default function CartSummary({ cart, onBack, onOrderComplete }: CartSummaryProps) {
  const { isDark } = useTheme()
  const [localCart, setLocalCart] = useState<Product[]>(cart)
  const [showPayment, setShowPayment] = useState(false)

  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'
  const buttonBg = isDark ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
  const smallButtonBg = isDark ? 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'

  const updateQuantity = (productId: string, delta: number) => {
    setLocalCart(prev => prev.map(p => p.id === productId ? { ...p, quantity: Math.max(1, p.quantity + delta) } : p))
  }

  const removeItem = (productId: string) => {
    setLocalCart(prev => prev.filter(p => p.id !== productId))
  }

  const subtotal = localCart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const tax = subtotal * 0.08
  const total = subtotal + tax

  if (showPayment) {
    return (
      <PaymentScreen 
        cart={localCart} 
        onBack={() => setShowPayment(false)} 
        onOrderComplete={onOrderComplete} 
      />
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className={`${cardBg} p-6 border shadow-lg flex justify-between items-center`} style={{ borderRadius: '1.5rem' }}>
        <button
          onClick={onBack}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${buttonBg}`}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </button>
        <h1 className={`text-3xl font-bold ${textPrimary}`}>Cart Summary</h1>
      </div>

      {/* Cart Items */}
      <div className={`${cardBg} p-6 border shadow-lg space-y-4`} style={{ borderRadius: '1.5rem' }}>
        {localCart.length === 0 && (
          <p className={`${textSecondary} text-center py-6`}>Your cart is empty</p>
        )}
        {localCart.map(item => (
          <div key={item.id} className="flex justify-between items-center border-b pb-2">
            <div className="flex-1">
              <h3 className={`${textPrimary} font-semibold`}>{item.name}</h3>
              <p className={`${textSecondary}`}>${item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => updateQuantity(item.id, -1)} 
                className={`p-1 rounded ${smallButtonBg}`}
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className={`${textPrimary}`}>{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.id, 1)} 
                className={`p-1 rounded ${smallButtonBg}`}
              >
                <Plus className="h-3 w-3" />
              </button>
              <button 
                onClick={() => removeItem(item.id)} 
                className={`p-2 rounded ${smallButtonBg} hover:bg-red-500 hover:text-white transition-colors`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary & Checkout */}
      <div className={`${cardBg} p-6 border shadow-lg space-y-4`} style={{ borderRadius: '1.5rem' }}>
        <div className="flex justify-between">
          <span className={`${textPrimary} font-medium`}>Subtotal:</span>
          <span className={`${textSecondary}`}>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className={`${textPrimary} font-medium`}>Tax (8%):</span>
          <span className={`${textSecondary}`}>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-xl">
          <span>Total:</span>
          <span className="text-green-500">${total.toFixed(2)}</span>
        </div>
        <button
          onClick={() => setShowPayment(true)}
          className={`w-full px-6 py-3 rounded-xl font-bold transition-colors ${buttonBg}`}
          disabled={localCart.length === 0}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  )
}
