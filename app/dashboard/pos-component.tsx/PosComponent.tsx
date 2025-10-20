"use client"

import { useMemo, useState } from "react"
import PosInitial from "./PosInitial"
import PaymentScreen from "./PaymentScreen"
import CombinedPosScreen, { type ServiceMode } from "./CombinedPosScreen"
import SuccessScreen from "./SuccessScreen"

type View = "home" | "main" | "payment" | "success"

interface Product {
  id: string
  name: string
  price: number
  category?: string
  available?: boolean
  quantity?: number
}

export default function PosComponent() {
  const [view, setView] = useState<View>("home")
  const [cart, setCart] = useState<Product[]>([])
  const [lastPaidTotal, setLastPaidTotal] = useState<number>(0)
  const [lastOrderId, setLastOrderId] = useState<string>("")
  const [mode, setMode] = useState<ServiceMode>("table")
  const [tableId, setTableId] = useState<string | undefined>(undefined)

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id)
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: (p.quantity || 1) + 1 } : p)
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(p => p.id === productId ? { ...p, quantity: Math.max(1, (p.quantity || 1) + delta) } : p))
  }

  const removeItem = (productId: string) => {
    setCart(prev => prev.filter(p => p.id !== productId))
  }

  const clearCart = () => setCart([])

  const totals = useMemo(() => {
    const subtotal = cart.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0)
    return { subtotal }
  }, [cart])

  const handleOrderComplete = (_paymentMethod: string, _discount?: number) => {
    // TODO: integrate with backend orders & print receipt
    const subtotal = cart.reduce((acc, i) => acc + (i.price || 0) * (i.quantity || 0), 0)
    setLastPaidTotal(subtotal)
    setLastOrderId(`ORD-${Math.random().toString(36).slice(2, 8).toUpperCase()}`)
    clearCart()
    setView("success")
  }

  if (view === "main") {
    return (
      <CombinedPosScreen
        cart={cart}
        onBack={() => setView("home")}
        onAddToCart={addToCart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onProceedToPayment={(m, t) => { setMode(m); setTableId(t); setView("payment") }}
      />
    )
  }

  if (view === "payment") {
    return (
      <PaymentScreen
        cart={cart as Required<Product>[]}
        onBack={() => setView("main")}
        onOrderComplete={handleOrderComplete}
      />
    )
  }

  if (view === "success") {
    return (
      <SuccessScreen
        orderId={lastOrderId || "ORD-XXXXXX"}
        amount={lastPaidTotal}
        onDone={() => setView("home")}
      />
    )
  }

  return (
    <PosInitial
      onStartNewOrder={() => setView("main")}
      lastSubtotal={totals.subtotal}
      onResumeOrder={() => setView("main")}
    />
  )
}
