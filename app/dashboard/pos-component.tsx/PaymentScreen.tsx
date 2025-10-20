"use client"

import { useTheme } from "@/hooks/useTheme"
import { useState } from "react"
import { ArrowLeft, Euro, CreditCard, Wallet, Percent } from "lucide-react"

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
  const [selectedPayment, setSelectedPayment] = useState<string>("card")
  const [discountType, setDiscountType] = useState<"amount" | "percent">("amount")
  const [discount, setDiscount] = useState<number>(0)
  const [vatPercent, setVatPercent] = useState<number>(20)
  const [tipPercent, setTipPercent] = useState<number>(0)
  const [serviceChargePercent, setServiceChargePercent] = useState<number>(0)

  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'
  
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const discountValue = discountType === 'percent' ? (subtotal * (discount / 100)) : discount
  const serviceCharge = (subtotal - discountValue) * (serviceChargePercent / 100)
  const tip = (subtotal - discountValue) * (tipPercent / 100)
  const baseForTax = Math.max(0, subtotal - discountValue + serviceCharge)
  const vat = baseForTax * (vatPercent / 100)
  const grossTotal = baseForTax + vat + tip

  const handleCompleteOrder = () => {
    onOrderComplete(selectedPayment, discount)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className={`${cardBg} p-6 border shadow-lg flex justify-between items-center`} style={{ borderRadius: '1.5rem' }}>
        <h1 className={`text-3xl font-bold ${textPrimary}`}>Payment</h1>
        <button
          onClick={onBack}
          className={`${isDark ? 'bg-white text-gray-900 border-gray-300' : 'bg-gray-900 text-white border-gray-700'} px-4 py-2 rounded-lg font-semibold border`}
        >
          <ArrowLeft className="h-4 w-4 inline mr-1" /> Back
        </button>
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

        <div className="mt-4 border-t pt-4 space-y-3">
          <div className="flex justify-between">
            <span className={`${textPrimary} font-medium`}>Subtotal:</span>
            <span className={`${textSecondary}`}>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className={`${textPrimary} font-medium`}>Discount:</span>
            <select
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as any)}
              className={`px-2 py-1 rounded border ${innerCardBg} ${textPrimary}`}
            >
              <option value="amount">Amount</option>
              <option value="percent">Percent</option>
            </select>
            <input
              type="number"
              min={0}
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className={`w-24 px-2 py-1 rounded border ${innerCardBg} ${textPrimary}`}
            />
            {discountType === 'percent' && <Percent className={`${textSecondary} h-4 w-4`} />}
            <span className={`${textSecondary} text-sm`}>
              -${discountValue.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className={`${textPrimary} font-medium`}>Service Charge:</span>
            <input type="number" min={0} value={serviceChargePercent} onChange={e => setServiceChargePercent(Number(e.target.value))} className={`w-24 px-2 py-1 rounded border ${innerCardBg} ${textPrimary}`} />
            <span className={`${textSecondary}`}>%</span>
            <span className={`${textSecondary} ml-auto`}>+${serviceCharge.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className={`${textPrimary} font-medium`}>Tip:</span>
            <input type="number" min={0} value={tipPercent} onChange={e => setTipPercent(Number(e.target.value))} className={`w-24 px-2 py-1 rounded border ${innerCardBg} ${textPrimary}`} />
            <span className={`${textSecondary}`}>%</span>
            <span className={`${textSecondary} ml-auto`}>+${tip.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className={`${textPrimary} font-medium`}>VAT:</span>
            <input type="number" min={0} max={27} value={vatPercent} onChange={e => setVatPercent(Number(e.target.value))} className={`w-20 px-2 py-1 rounded border ${innerCardBg} ${textPrimary}`} />
            <span className={`${textSecondary}`}>%</span>
            <span className={`${textSecondary} ml-auto`}>VAT: €{vat.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-2xl mt-2">
            <span>Total:</span>
            <span className="text-green-500">€{grossTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className={`${cardBg} p-6 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <h2 className={`${textPrimary} text-xl font-semibold mb-4`}>Select Payment Method</h2>
        <div className="flex gap-4">
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
          <button
            onClick={() => setSelectedPayment("cash")}
            className={`flex-1 p-4 rounded-xl flex flex-col items-center gap-2 font-semibold transition-colors
              ${selectedPayment === "cash" ? 'bg-blue-500 text-white' : `${innerCardBg} ${textPrimary}`}`}
          >
            <Euro className="h-6 w-6" />
            Cash
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
