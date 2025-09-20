// app/dashboard/order-component/CreateOrderForm.tsx

"use client"

import { useState } from "react"
import { Plus, Minus, ShoppingCart, User, Phone, MapPin, ArrowLeft, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useMenuItems, useMenuCategories } from "@/hooks/use-menu"
import { useOrders } from "@/hooks/use-orders"
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
      // Ensure all numeric values are regular JavaScript numbers
      const orderData = {
        order_type: orderType,
        items: orderItems.map(item => ({
          menu_item_id: Number(item.menu_item_id),
          name: String(item.name),
          quantity: Number(item.quantity),
          price: Number(item.price), // Ensure it's a regular number
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
        <div className="flex items-center gap-3 text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading menu items...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-gray-300 hover:text-white transition-all duration-200 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </button>
        
        <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          Create New Order
        </h2>
        <p className="text-gray-400">Add items and customer information to create a new order</p>
      </div>

      {submitError && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400">{submitError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu Items Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Type Selection */}
          <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Order Type</h3>
            <div className="flex gap-3">
              {[
                { id: "dine-in", label: "Dine In", icon: User },
                { id: "takeout", label: "Takeout", icon: ShoppingCart },
                { id: "delivery", label: "Delivery", icon: MapPin }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setOrderType(id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    orderType === id
                      ? "bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] text-white"
                      : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </Card>

          {/* Payment Method Selection */}
          <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Payment Method</h3>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
            >
              <option value={PaymentMethod.CASH}>Cash</option>
              <option value={PaymentMethod.CARD}>Card</option>
              <option value={PaymentMethod.DIGITAL_WALLET}>Digital Wallet</option>
              <option value={PaymentMethod.BANK_TRANSFER}>Bank Transfer</option>
            </select>
          </Card>

          {/* Menu Items by Category */}
          {categories_list.map(categoryName => (
            <Card key={categoryName} className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">{categoryName}</h3>
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
                      className="bg-gray-700/30 rounded-lg p-4 hover:bg-gray-600/30 transition-all duration-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-white font-medium">{item.name}</h4>
                        <span className="text-green-400 font-semibold">${item.price.toFixed(2)}</span>
                      </div>
                      {item.description && (
                        <p className="text-gray-400 text-sm mb-3">{item.description}</p>
                      )}
                      <button
                        onClick={() => addToOrder(item)}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] text-white rounded-lg hover:from-[#6d28d9] hover:to-[#7c3aed] transition-all duration-200"
                      >
                        <Plus className="h-4 w-4" />
                        Add to Order
                      </button>
                    </div>
                  ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Order Summary Section */}
        <div className="space-y-6">
          {/* Customer Information */}
          {orderType !== "dine-in" && (
            <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Customer Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Name *</label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                    placeholder="Customer name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                    placeholder="Phone number"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Email</label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                    placeholder="Email address"
                  />
                </div>
              </div>
            </Card>
          )}

          {orderType === "dine-in" && (
            <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Table Information</h3>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Table Number *</label>
                <input
                  type="number"
                  value={customerInfo.table_id || ""}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, table_id: parseInt(e.target.value) || undefined }))}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                  placeholder="Table number"
                  required
                />
              </div>
            </Card>
          )}

          {/* Special Instructions */}
          <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Special Instructions</h3>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
              placeholder="Any special instructions for this order..."
              rows={3}
            />
          </Card>

          {/* Order Summary */}
          <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
            
            {orderItems.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No items added yet</p>
            ) : (
              <div className="space-y-3">
                {orderItems.map(item => (
                  <div key={item.menu_item_id} className="bg-gray-700/30 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm">{item.name}</h4>
                        <p className="text-gray-400 text-xs">${item.price.toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.menu_item_id, item.quantity - 1)}
                          className="w-6 h-6 bg-gray-600 hover:bg-gray-500 rounded text-white flex items-center justify-center"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-white w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.menu_item_id, item.quantity + 1)}
                          className="w-6 h-6 bg-gray-600 hover:bg-gray-500 rounded text-white flex items-center justify-center"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="text-green-400 font-semibold ml-2 min-w-[60px] text-right">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                    <input
                      type="text"
                      value={item.special_instructions || ""}
                      onChange={(e) => updateItemInstructions(item.menu_item_id, e.target.value)}
                      className="w-full bg-gray-600/50 text-white px-2 py-1 rounded text-xs"
                      placeholder="Special instructions for this item..."
                    />
                  </div>
                ))}
                
                <div className="border-t border-gray-600 pt-3 mt-4 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Subtotal:</span>
                    <span className="text-white">${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Tax (8%):</span>
                    <span className="text-white">${calculateTax(calculateSubtotal()).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span className="text-white">Total:</span>
                    <span className="text-green-400">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
            
            <button
              onClick={handleSubmitOrder}
              disabled={orderItems.length === 0 || isSubmitting}
              className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] text-white rounded-lg font-medium hover:from-[#6d28d9] hover:to-[#7c3aed] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
          </Card>
        </div>
      </div>
    </div>
  )
}