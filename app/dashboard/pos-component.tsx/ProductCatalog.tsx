"use client"

import { useTheme } from "@/hooks/useTheme"
import { useState } from "react"
import CartSummary from "./CartSummary"
import { ArrowLeft } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  category: string
  available: boolean
  quantity?: number
}

export default function ProductCatalog({ onBack }: { onBack: () => void }) {
  const { isDark } = useTheme()
  const [cart, setCart] = useState<Product[]>([])
  const [showCart, setShowCart] = useState(false)

  const products: Product[] = [
    { id: "P001", name: "Chicken Burger", price: 12.99, category: "Burgers", available: true },
    { id: "P002", name: "Pizza Margherita", price: 14.99, category: "Pizza", available: true },
    { id: "P003", name: "Caesar Salad", price: 8.99, category: "Salads", available: true },
    { id: "P004", name: "Coca Cola", price: 2.99, category: "Drinks", available: true },
    { id: "P005", name: "French Fries", price: 4.99, category: "Sides", available: true },
  ]

  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'
  const buttonBg = isDark ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
  const cartButtonBg = isDark ? 'bg-black text-white hover:bg-gray-800' : 'bg-green-500 text-white hover:bg-green-600'
  const addButtonBg = isDark ? 'bg-black text-white hover:bg-gray-800' : 'bg-blue-500 text-white hover:bg-blue-600'
  const disabledButtonBg = 'bg-gray-400 cursor-not-allowed text-white'

  const addToCart = (product: Product) => {
    setCart(prev => {
      const exists = prev.find(p => p.id === product.id)
      if (exists) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: (p.quantity || 1) + 1 } : p)
      } else {
        return [...prev, { ...product, quantity: 1 }]
      }
    })
  }

  if (showCart) {
    return (
      <CartSummary
        cart={cart}
        onBack={() => setShowCart(false)}
        onUpdateCart={(updatedCart) => setCart(updatedCart)}
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
          Back
        </button>
        <h1 className={`text-3xl font-bold ${textPrimary}`}>Product Catalog</h1>
        <button
          onClick={() => setShowCart(true)}
          className={`px-3 py-2 rounded-lg font-semibold transition-colors ${cartButtonBg}`}
        >
          View Cart ({cart.length})
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.id} className={`${innerCardBg} p-4 border rounded-xl flex flex-col justify-between`}>
            <h3 className={`${textPrimary} font-semibold mb-2`}>{product.name}</h3>
            <p className={`${textPrimary} font-bold mb-4`}>${product.price.toFixed(2)}</p>
            <button
              disabled={!product.available}
              onClick={() => addToCart(product)}
              className={`w-full py-2 rounded-xl font-semibold transition-colors ${
                product.available ? addButtonBg : disabledButtonBg
              }`}
            >
              {product.available ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
