"use client"

import { useTheme } from "@/hooks/useTheme"
import { useMemo, useState } from "react"
import { ArrowLeft, ShoppingCart, Grid } from "lucide-react"
import { useTables } from "@/hooks/use-tables"

interface Product {
  id: string
  name: string
  price: number
  category: string
  available: boolean
  quantity?: number
}

export type ServiceMode = "dine-in" | "takeaway"

interface CombinedPosScreenProps {
  cart: Product[]
  onBack?: () => void
  onAddToCart: (product: Product) => void
  onUpdateQuantity: (productId: string, delta: number) => void
  onRemoveItem: (productId: string) => void
  onProceedToPayment: (mode: ServiceMode, tableId?: string) => void
}

export default function CombinedPosScreen({ cart, onBack, onAddToCart, onUpdateQuantity, onRemoveItem, onProceedToPayment }: CombinedPosScreenProps) {
  const { isDark } = useTheme()
  const { tables, loading: tablesLoading } = useTables()
  const [mode, setMode] = useState<ServiceMode>("takeaway")
  const [selectedTableId, setSelectedTableId] = useState<string | undefined>(undefined)
  const [searchTerm, setSearchTerm] = useState<string>("")

  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'
  const actionBtn = isDark ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'

  const selectedToggleBg = isDark 
    ? 'bg-white text-gray-900 border-gray-300 shadow-md' 
    : 'bg-gray-900 text-white border-gray-700 shadow-md'
  const unselectedToggleBg = isDark 
    ? 'bg-[#1f1f1f] text-gray-400 border-[#2a2a2a]' 
    : 'bg-white text-gray-600 border-gray-200'

  const products: Product[] = [
    { id: "P001", name: "Chicken Burger", price: 12.99, category: "Burgers", available: true },
    { id: "P002", name: "Pizza Margherita", price: 14.99, category: "Pizza", available: true },
    { id: "P003", name: "Caesar Salad", price: 8.99, category: "Salads", available: true },
    { id: "P004", name: "Coca Cola", price: 2.99, category: "Drinks", available: true },
    { id: "P005", name: "French Fries", price: 4.99, category: "Sides", available: true },
  ]

  const searchResults = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    if (!q) return [] as Product[]
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    ).slice(0, 8)
  }, [searchTerm])

  const subtotal = cart.reduce((acc, item) => acc + (item.price * (item.quantity || 0)), 0)

  return (
    <div className="p-4">
      {/* Mode Toggle (styled like menu top buttons) */}
      <div className="flex items-center justify-start mb-4">
        <div className={`${cardBg} p-1 border shadow-lg flex gap-2 transition-colors duration-300`} style={{ borderRadius: '1rem' }}>
          <button
            onClick={() => setMode('takeaway')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
              mode === 'takeaway' ? selectedToggleBg : unselectedToggleBg
            }`}
          >
            Takeaway
          </button>
          <button
            onClick={() => setMode('dine-in')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
              mode === 'dine-in' ? selectedToggleBg : unselectedToggleBg
            }`}
          >
            Dine-in
          </button>
        </div>
      </div>

      {mode === 'takeaway' ? (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-7 space-y-4">
            <div className={`${cardBg} p-4 border`} style={{ borderRadius: '1rem' }}>
              <div className="flex items-center gap-2 mb-3">
                <Grid className="h-5 w-5" />
                <h2 className={`text-xl font-semibold ${textPrimary}`}>Search Items</h2>
              </div>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.currentTarget.value)}
                placeholder="Search by name or category..."
                className={`${innerCardBg} border w-full px-4 py-2 rounded-lg ${textPrimary}`}
              />
              {searchTerm && (
                <div className="mt-3 space-y-2 max-h-64 overflow-auto">
                  {searchResults.length === 0 ? (
                    <div className={`${textSecondary} text-sm`}>No matches</div>
                  ) : (
                    searchResults.map(p => (
                      <button key={p.id} disabled={!p.available} onClick={() => onAddToCart(p)} className={`${innerCardBg} border w-full px-3 py-2 rounded-lg text-left flex items-center justify-between ${!p.available ? 'opacity-50' : 'hover:bg-opacity-80'}`}>
                        <div>
                          <div className={`${textPrimary} font-medium`}>{p.name}</div>
                          <div className={`${textSecondary} text-xs`}>{p.category}</div>
                        </div>
                        <div className={`${isDark ? 'text-green-400' : 'text-green-600'} font-semibold`}>${p.price.toFixed(2)}</div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="col-span-5">
            <div className={`${cardBg} p-4 border`} style={{ borderRadius: '1rem' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2"><ShoppingCart className="h-5 w-5"/><h3 className={`font-semibold ${textPrimary}`}>Cart</h3></div>
                <div className={`${textSecondary} text-sm`}>Items: {cart.reduce((a,i)=>a+(i.quantity||0),0)}</div>
              </div>
              {cart.length === 0 ? (
                <div className={`${textSecondary} text-sm`}>No items added</div>
              ) : (
                <div className="space-y-2">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <div className={`${textPrimary} font-medium`}>{item.name}</div>
                        <div className={`${textSecondary} text-xs`}>${item.price.toFixed(2)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => onUpdateQuantity(item.id, -1)} className={`${innerCardBg} border px-2 rounded`}>-</button>
                        <span className={`${textPrimary}`}>{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.id, 1)} className={`${innerCardBg} border px-2 rounded`}>+</button>
                        <button onClick={() => onRemoveItem(item.id)} className={`${innerCardBg} border px-2 rounded`}>x</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between mt-4">
                <div className={`${textSecondary}`}>Subtotal</div>
                <div className={`${isDark ? 'text-green-400' : 'text-green-600'} font-bold`}>${subtotal.toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                {onBack && (
                  <button onClick={onBack} className={`${unselectedToggleBg} px-4 py-2 rounded-lg border w-40 flex items-center justify-center`}> <ArrowLeft className="h-4 w-4 inline mr-1"/> Back</button>
                )}
                <button disabled={cart.length===0} onClick={() => onProceedToPayment('takeaway', undefined)} className={`${actionBtn} px-4 py-2 rounded-lg w-full font-semibold`}>
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-xl">
          <div className={`${cardBg} p-4 border`} style={{ borderRadius: '1rem' }}>
            <label className={`${textPrimary} text-sm font-medium mb-2 block`}>Select Table</label>
            <select disabled={tablesLoading} value={selectedTableId || ''} onChange={e => setSelectedTableId(e.target.value)} className={`${innerCardBg} border w-full px-3 py-2 rounded-lg ${textPrimary}`}>
              <option value="" disabled>Select...</option>
              {tables.filter(t => t.status !== 'maintenance').map(t => (
                <option key={t.id} value={t.id}>Table {t.number} • {t.seats} seats • {t.status}</option>
              ))}
            </select>
            <div className="flex items-center gap-2 mt-3">
              {onBack && (
                <button onClick={onBack} className={`${unselectedToggleBg} px-4 py-2 rounded-lg border w-40 flex items-center justify-center`}> <ArrowLeft className="h-4 w-4 inline mr-1"/> Back</button>
              )}
              <button disabled={!selectedTableId} onClick={() => onProceedToPayment('dine-in', selectedTableId)} className={`${actionBtn} px-4 py-2 rounded-lg w-full font-semibold`}>
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


