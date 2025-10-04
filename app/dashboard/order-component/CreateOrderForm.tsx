// app/dashboard/order-component/CreateOrderForm.tsx

"use client"

import { useState, useEffect } from "react"
import { Plus, Minus, ShoppingCart, User, Phone, MapPin, ArrowLeft, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useMenuItems, useMenuCategories } from "@/hooks/use-menu"
import { useOrders } from "@/hooks/use-orders"
import { useTheme } from "@/hooks/useTheme"
import { CreateOrderData, PaymentMethod } from "@/lib/order-api"

interface OrderItem {
  menu_item_id: number
  name: string
  quantity: number
  price: number
  special_instructions?: string
}

interface CustomerInfo {
  name: string
  phone: string
  email: string
  table_id?: number
}

interface CreateOrderFormProps {
  onBack: () => void
  onOrderCreated: (order: any) => void
}

export default function CreateOrderForm({ onBack, onOrderCreated }: CreateOrderFormProps) {
  const { items: menuItems, loading: menuLoading } = useMenuItems()
  const { categories, loading: categoriesLoading } = useMenuCategories()
  const { createOrder } = useOrders()
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()

  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    phone: "",
    email: "",
    table_id: undefined
  })
  const [orderType, setOrderType] = useState<"dine-in" | "takeout" | "delivery">("dine-in")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH)
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!themeLoaded || !mounted) {
    return (
      <div className="flex-1 bg-gray-100 dark:bg-gray-900 flex items-center justify-center transition-all duration-300">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  // Theme-based styling variables
  const mainPanelBg = isDark ? 'bg-[#111111]' : 'bg-gray-50'
  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const inputBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'
  const buttonHoverBg = isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-100'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'

  const addToOrder = (menuItem: any) => {
    const existingItem = orderItems.find(item => item.menu_item_id === parseInt(menuItem.id))
    if (existingItem) {
      setOrderItems(prev => 
        prev.map(item => 
          item.menu_item_id === parseInt(menuItem.id)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      )
    } else {
      setOrderItems(prev => [...prev, {
        menu_item_id: parseInt(menuItem.id),
        name: menuItem.name,
        quantity: 1,
        price: menuItem.price,
        special_instructions: ""
      }])
    }
  }

  const updateQuantity = (menuItemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      setOrderItems(prev => prev.filter(item => item.menu_item_id !== menuItemId))
    } else {
      setOrderItems(prev => 
        prev.map(item => 
          item.menu_item_id === menuItemId
            ? { ...item, quantity: newQuantity }
            : item
        )
      )
    }
  }

  const updateItemInstructions = (menuItemId: number, instructions: string) => {
    setOrderItems(prev => 
      prev.map(item => 
        item.menu_item_id === menuItemId
          ? { ...item, special_instructions: instructions }
          : item
      )
    )
  }

  const calculateSubtotal = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const calculateTax = (subtotal: number) => {
    return subtotal * 0.08 // 8% tax rate
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const tax = calculateTax(subtotal)
    return subtotal + tax
  }

  const handleSubmitOrder = async () => {
    if (orderItems.length === 0) {
      setSubmitError("Please add items to your order")
      return
    }

    if (orderType !== "dine-in" && (!customerInfo.name || !customerInfo.phone)) {
      setSubmitError("Please fill in customer information")
      return
    }

    if (orderType === "dine-in" && !customerInfo.table_id) {
      setSubmitError("Please enter table number for dine-in orders")
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const orderData = {
        order_type: orderType,
        items: orderItems.map(item => ({
          menu_item_id: Number(item.menu_item_id),
          name: String(item.name),
          quantity: Number(item.quantity),
          price: Number(item.price),
          ...(item.special_instructions && { special_instructions: String(item.special_instructions) })
        })),
        payment_method: paymentMethod,
        ...(specialInstructions && { special_instructions: String(specialInstructions) }),
        ...(orderType !== "dine-in" && {
          customer_name: String(customerInfo.name),
          customer_phone: String(customerInfo.phone),
          ...(customerInfo.email && { customer_email: String(customerInfo.email) })
        }),
        ...(orderType === "dine-in" && customerInfo.table_id && {
          table_id: Number(customerInfo.table_id)
        })
      }

      const createdOrder = await createOrder(orderData)
      onOrderCreated(createdOrder)
      
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to create order")
    } finally {
      setIsSubmitting(false)
    }
  }

  const categories_list = [...new Set(menuItems.map(item => {
    const category = categories.find(cat => cat.id === item.category_id)
    return category ? category.name : 'Uncategorized'
  }))]

  if (menuLoading || categoriesLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className={`flex items-center gap-3 ${textSecondary}`}>
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading menu items...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex-1 ${mainPanelBg} h-screen overflow-y-auto transition-colors duration-300`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className={`${cardBg} p-8 border shadow-lg relative overflow-hidden`} style={{ borderRadius: '1.5rem' }}>
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className={`${textSecondary} ${buttonHoverBg} p-2 rounded-xl transition-all duration-200 hover:scale-110`}
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>Create New Order</h1>
              <p className={`${textSecondary}`}>Add items and customer information to create a new order</p>
            </div>
          </div>
        </div>

        {submitError && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-500 font-medium">{submitError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu Items Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Type Selection */}
            <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
              <div className="p-6">
                <h3 className={`text-xl font-semibold ${textPrimary} mb-4`}>Order Type</h3>
                <div className="flex gap-3">
                  {[
                    { id: "dine-in", label: "Dine In", icon: User },
                    { id: "takeout", label: "Takeout", icon: ShoppingCart },
                    { id: "delivery", label: "Delivery", icon: MapPin }
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setOrderType(id as any)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 border ${
                        orderType === id
                          ? `${isDark ? 'bg-[#2a2a2a] border-[#3a3a3a]' : 'bg-gray-100 border-gray-300'} ${textPrimary} shadow-lg`
                          : `${innerCardBg} border ${textSecondary} hover:shadow-md hover:scale-105`
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
              <div className="p-6">
                <h3 className={`text-xl font-semibold ${textPrimary} mb-4`}>Payment Method</h3>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                >
                  <option value={PaymentMethod.CASH}>Cash</option>
                  <option value={PaymentMethod.CARD}>Card</option>
                  <option value={PaymentMethod.DIGITAL_WALLET}>Digital Wallet</option>
                  <option value={PaymentMethod.BANK_TRANSFER}>Bank Transfer</option>
                </select>
              </div>
            </div>

            {/* Menu Items by Category */}
            {categories_list.map((categoryName, index) => (
              <div key={categoryName} className={`${cardBg} border shadow-lg`}
                style={{ 
                  borderRadius: index % 3 === 0 ? '1.5rem' : index % 3 === 1 ? '2rem' : '1rem'
                }}>
                <div className="p-6">
                  <h3 className={`text-xl font-semibold ${textPrimary} mb-4`}>{categoryName}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {menuItems
                      .filter(item => {
                        const category = categories.find(cat => cat.id === item.category_id)
                        return (category ? category.name : 'Uncategorized') === categoryName
                      })
                      .filter(item => item.is_available)
                      .map(item => (
                        <div
                          key={item.id}
                          className={`${innerCardBg} border rounded-xl p-4 hover:shadow-md transition-all duration-200 hover:scale-[1.02]`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className={`${textPrimary} font-medium`}>{item.name}</h4>
                            <span className="text-green-500 font-semibold">${item.price.toFixed(2)}</span>
                          </div>
                          {item.description && (
                            <p className={`${textSecondary} text-sm mb-3`}>{item.description}</p>
                          )}
                          <button
                            onClick={() => addToOrder(item)}
                            className={`w-full flex items-center justify-center gap-2 px-3 py-2 ${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535] border-[#3a3a3a]' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'} ${textPrimary} rounded-xl border transition-all duration-200 hover:shadow-lg hover:scale-105`}
                          >
                            <Plus className="h-4 w-4" />
                            Add to Order
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Section */}
          <div className="space-y-6">
            {/* Customer Information */}
            {orderType !== "dine-in" && (
              <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
                <div className="p-6">
                  <h3 className={`text-xl font-semibold ${textPrimary} mb-4`}>Customer Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className={`block ${textPrimary} text-sm font-medium mb-2`}>Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                        className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                        placeholder="Customer name"
                        required
                      />
                    </div>
                    <div>
                      <label className={`block ${textPrimary} text-sm font-medium mb-2`}>Phone <span className="text-red-500">*</span></label>
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                        className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                        placeholder="Phone number"
                        required
                      />
                    </div>
                    <div>
                      <label className={`block ${textPrimary} text-sm font-medium mb-2`}>Email</label>
                      <input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                        className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                        placeholder="Email address"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {orderType === "dine-in" && (
              <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
                <div className="p-6">
                  <h3 className={`text-xl font-semibold ${textPrimary} mb-4`}>Table Information</h3>
                  <div>
                    <label className={`block ${textPrimary} text-sm font-medium mb-2`}>Table Number <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      value={customerInfo.table_id || ""}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, table_id: parseInt(e.target.value) || undefined }))}
                      className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                      placeholder="Table number"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
              <div className="p-6">
                <h3 className={`text-xl font-semibold ${textPrimary} mb-4`}>Special Instructions</h3>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200 resize-none`}
                  placeholder="Any special instructions for this order..."
                  rows={3}
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
              <div className="p-6">
                <h3 className={`text-xl font-semibold ${textPrimary} mb-4`}>Order Summary</h3>
                
                {orderItems.length === 0 ? (
                  <p className={`${textSecondary} text-center py-6`}>No items added yet</p>
                ) : (
                  <div className="space-y-3">
                    {orderItems.map(item => (
                      <div key={item.menu_item_id} className={`${innerCardBg} border rounded-xl p-4 space-y-3`}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className={`${textPrimary} font-medium text-sm`}>{item.name}</h4>
                            <p className={`${textSecondary} text-xs`}>${item.price.toFixed(2)} each</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.menu_item_id, item.quantity - 1)}
                              className={`w-8 h-8 ${innerCardBg} ${buttonHoverBg} border rounded-lg ${textPrimary} flex items-center justify-center transition-all duration-200 hover:scale-110`}
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className={`${textPrimary} w-8 text-center font-medium`}>{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.menu_item_id, item.quantity + 1)}
                              className={`w-8 h-8 ${innerCardBg} ${buttonHoverBg} border rounded-lg ${textPrimary} flex items-center justify-center transition-all duration-200 hover:scale-110`}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <div className="text-green-500 font-semibold ml-3 min-w-[60px] text-right">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                        <input
                          type="text"
                          value={item.special_instructions || ""}
                          onChange={(e) => updateItemInstructions(item.menu_item_id, e.target.value)}
                          className={`w-full ${inputBg} ${textPrimary} px-3 py-2 rounded-lg text-xs border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                          placeholder="Special instructions for this item..."
                        />
                      </div>
                    ))}
                    
                    <div className={`border-t ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'} pt-4 mt-4 space-y-3`}>
                      <div className={`flex justify-between items-center text-sm ${textSecondary}`}>
                        <span>Subtotal:</span>
                        <span>${calculateSubtotal().toFixed(2)}</span>
                      </div>
                      <div className={`flex justify-between items-center text-sm ${textSecondary}`}>
                        <span>Tax (8%):</span>
                        <span>${calculateTax(calculateSubtotal()).toFixed(2)}</span>
                      </div>
                      <div className={`flex justify-between items-center text-lg font-bold ${textPrimary}`}>
                        <span>Total:</span>
                        <span className="text-green-500">${calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={handleSubmitOrder}
                  disabled={orderItems.length === 0 || isSubmitting}
                  className={`w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 ${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535] border-[#3a3a3a]' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'} ${textPrimary} rounded-xl font-medium border transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creating Order...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5" />
                      Create Order
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}