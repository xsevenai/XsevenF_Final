// app/dashboard/kds-component/components/KDSCreateOrderForm.tsx

"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Loader2, Plus, X, ChefHat } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "@/hooks/useTheme"
import { configureAPI } from "@/lib/api-config"
import { MenuManagementService } from "@/src/api/generated/services/MenuManagementService"
import type { KDSOrderCreate } from "@/src/api/generated/models/KDSOrderCreate"
import type { KDSOrderItem } from "@/src/api/generated/models/KDSOrderItem"
import type { MenuItem } from "@/src/api/generated/models/MenuItem"

interface KDSCreateOrderFormProps {
  businessId: string
  onBack: () => void
  onCreateOrder: (orderData: KDSOrderCreate) => Promise<void>
  isDark?: boolean
}

interface KDSOrderItemForm {
  menu_item_id: string
  name: string
  quantity: number
  modifiers: string[]
  special_instructions: string
}

export default function KDSCreateOrderForm({ 
  businessId, 
  onBack, 
  onCreateOrder,
  isDark = false 
}: KDSCreateOrderFormProps) {
  const { theme, isLoaded: themeLoaded, isDark: themeIsDark, currentTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // Form state
  const [orderData, setOrderData] = useState<Partial<KDSOrderCreate>>({
    order_id: '',
    business_id: businessId,
    station: '',
    items: [],
    priority: 1,
    target_time: ''
  })
  
  const [newItem, setNewItem] = useState<KDSOrderItemForm>({
    menu_item_id: '',
    name: '',
    quantity: 1,
    modifiers: [],
    special_instructions: ''
  })
  
  const [newModifier, setNewModifier] = useState('')
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  
  // Menu items state
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [menuItemsLoading, setMenuItemsLoading] = useState(true)
  const [menuItemsError, setMenuItemsError] = useState<string | null>(null)

  // Generate unique order ID
  const generateOrderId = (): string => {
    return crypto.randomUUID()
  }

  // Fetch menu items
  const fetchMenuItems = async () => {
    try {
      setMenuItemsLoading(true)
      setMenuItemsError(null)
      configureAPI()
      
      console.log('Fetching menu items for business:', businessId)
      const items = await MenuManagementService.listMenuItemsApiV1MenuItemsGet({
        businessId,
        categoryId: null,
        isAvailable: null,
        search: null,
        limit: 100
      })
      console.log('Fetched menu items:', items.length, 'items')
      setMenuItems(items)
    } catch (err: any) {
      console.error('Error fetching menu items:', err)
      setMenuItemsError(err.message || 'Failed to fetch menu items')
    } finally {
      setMenuItemsLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    const newOrderId = generateOrderId()
    setOrderData({
      order_id: newOrderId,
      business_id: businessId,
      station: '',
      items: [],
      priority: 1,
      target_time: ''
    })
    fetchMenuItems()
  }, [businessId])

  // Simulate loading state like MenuForms
  const [localLoading, setLocalLoading] = useState(true)

  useEffect(() => {
    if (themeLoaded && mounted) {
      setLocalLoading(false)
    }
  }, [themeLoaded, mounted])

  if (localLoading) {
    return (
      <div className={`flex-1 flex items-center justify-center min-h-screen ${isDark ? "bg-[#111]" : "bg-gray-50"}`}>
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  // Theme-based styling variables - matching MenuForms
  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'
  const inputBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'

  const handleAddItem = () => {
    if (!newItem.menu_item_id || !newItem.name || !newItem.quantity) {
      return
    }

    const item: KDSOrderItem = {
      menu_item_id: newItem.menu_item_id,
      name: newItem.name,
      quantity: newItem.quantity,
      modifiers: newItem.modifiers || [],
      special_instructions: newItem.special_instructions || undefined
    }

    setOrderData((prev: Partial<KDSOrderCreate>) => ({
      ...prev,
      items: [...(prev.items || []), item]
    }))

    // Reset new item form
    setNewItem({
      menu_item_id: '',
      name: '',
      quantity: 1,
      modifiers: [],
      special_instructions: ''
    })
    setNewModifier('')
  }

  const handleRemoveItem = (index: number) => {
    setOrderData((prev: Partial<KDSOrderCreate>) => ({
      ...prev,
      items: prev.items?.filter((_: KDSOrderItem, i: number) => i !== index) || []
    }))
  }

  const handleAddModifier = () => {
    if (!newModifier.trim()) return
    
    setNewItem((prev: KDSOrderItemForm) => ({
      ...prev,
      modifiers: [...(prev.modifiers || []), newModifier.trim()]
    }))
    setNewModifier('')
  }

  const handleRemoveModifier = (index: number) => {
    setNewItem((prev: KDSOrderItemForm) => ({
      ...prev,
      modifiers: prev.modifiers?.filter((_: string, i: number) => i !== index) || []
    }))
  }

  const handleSubmit = async () => {
    const errors: string[] = []
    
    if (!orderData.station) {
      errors.push('Station is required')
    }
    if (!orderData.items?.length) {
      errors.push('At least one menu item is required')
    }
    
    // Validate target_time format if provided
    if (orderData.target_time && orderData.target_time.trim() !== '') {
      const date = new Date(orderData.target_time)
      if (isNaN(date.getTime())) {
        errors.push('Target time must be a valid date and time')
      }
    }

    if (errors.length > 0) {
      setValidationErrors(errors)
      return
    }

    setValidationErrors([])
    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)
    
    try {
      // Ensure business_id is set and format target_time properly
      const orderToCreate: KDSOrderCreate = {
        ...orderData,
        business_id: businessId,
        order_id: orderData.order_id!,
        station: orderData.station!,
        items: orderData.items!,
        priority: orderData.priority || 1,
        target_time: orderData.target_time && orderData.target_time.trim() !== '' 
          ? new Date(orderData.target_time).toISOString() 
          : null
      }
      
      await onCreateOrder(orderToCreate)
      setSubmitSuccess(true)
      
      setTimeout(() => {
        onBack()
      }, 1500)
    } catch (error) {
      console.error('Failed to create KDS order:', error)
      setSubmitError('Failed to create order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMenuItemSelect = (menuItemId: string) => {
    const menuItem = menuItems?.find(item => item.id === menuItemId)
    if (menuItem) {
      setNewItem((prev: KDSOrderItemForm) => ({
        ...prev,
        menu_item_id: menuItemId,
        name: menuItem.name
      }))
    }
  }

  // Safe menu items array
  const safeMenuItems = menuItems || []

  return (
    <div className="p-6 space-y-6">
      {/* Header - matching MenuForms style */}
      <div className={`${cardBg} p-8 border shadow-lg transition-colors duration-300`} style={{ borderRadius: '1.5rem' }}>
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className={`${textSecondary} ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-200'} p-2 rounded-xl transition-all duration-200 hover:scale-110`}
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className={`text-4xl font-bold ${textPrimary} mb-2 transition-colors duration-300`}>
              Create KDS Order
            </h1>
            <p className={`${textSecondary} transition-colors duration-300`}>
              Create a new kitchen display system order for your restaurant
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className={`${cardBg} border shadow-lg transition-colors duration-300`} style={{ borderRadius: '1.5rem' }}>
        <div className="p-8">
          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <p className="text-green-500 font-medium">
                KDS order created successfully!
              </p>
            </div>
          )}
          
          {submitError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-500 font-medium">{submitError}</p>
            </div>
          )}

          {validationErrors.length > 0 && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <ul className="text-red-500">
                {validationErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-6">
            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block ${textPrimary} font-medium mb-3 transition-colors duration-300`}>
                  Station <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={orderData.station || ''}
                  onChange={(e) => setOrderData(prev => ({ ...prev, station: e.target.value }))}
                  className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200 transition-colors duration-300`}
                  placeholder="e.g., Grill, Salad, Pizza"
                  required
                />
              </div>
              
              <div>
                <label className={`block ${textPrimary} font-medium mb-3 transition-colors duration-300`}>
                  Priority
                </label>
                <select
                  value={orderData.priority || 1}
                  onChange={(e) => setOrderData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                  className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200 transition-colors duration-300`}
                >
                  <option value={1}>Low (1)</option>
                  <option value={2}>Medium (2)</option>
                  <option value={3}>High (3)</option>
                  <option value={4}>Urgent (4)</option>
                </select>
              </div>
            </div>

            {/* Target Time */}
            <div>
              <label className={`block ${textPrimary} font-medium mb-3 transition-colors duration-300`}>
                Target Time (Optional)
              </label>
              <input
                type="datetime-local"
                value={orderData.target_time || ''}
                onChange={(e) => setOrderData(prev => ({ ...prev, target_time: e.target.value }))}
                className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200 transition-colors duration-300`}
              />
            </div>

            {/* Add Menu Item */}
            <div className={`${innerCardBg} p-6 rounded-xl border`}>
              <h3 className={`${textPrimary} text-lg font-semibold mb-4`}>Add Menu Item</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={`block ${textSecondary} text-sm font-medium mb-2`}>
                    Menu Item <span className="text-red-500">*</span>
                  </label>
                  {menuItemsLoading ? (
                    <div className={`flex items-center gap-2 ${textSecondary}`}>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading menu items...</span>
                    </div>
                  ) : menuItemsError ? (
                    <div className={`${textSecondary} text-sm`}>
                      Error loading menu items
                    </div>
                  ) : (
                    <select
                      value={newItem.menu_item_id}
                      onChange={(e) => handleMenuItemSelect(e.target.value)}
                      className={`w-full ${inputBg} ${textPrimary} px-3 py-2 rounded-lg text-sm border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                    >
                      <option value="">Select menu item</option>
                      {safeMenuItems.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} - ${item.price}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                
                <div>
                  <label className={`block ${textSecondary} text-sm font-medium mb-2`}>
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                    className={`w-full ${inputBg} ${textPrimary} px-3 py-2 rounded-lg text-sm border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                  />
                </div>
              </div>

              {/* Modifiers */}
              <div className="mb-4">
                <label className={`block ${textSecondary} text-sm font-medium mb-2`}>
                  Modifiers
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newModifier}
                    onChange={(e) => setNewModifier(e.target.value)}
                    placeholder="Add modifier (e.g., Extra cheese)"
                    className={`flex-1 ${inputBg} ${textPrimary} px-3 py-2 rounded-lg text-sm border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddModifier())}
                  />
                  <Button
                    type="button"
                    onClick={handleAddModifier}
                    size="sm"
                    variant="outline"
                    disabled={!newModifier.trim()}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                
                {newItem.modifiers && newItem.modifiers.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {newItem.modifiers.map((modifier, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {modifier}
                        <button
                          type="button"
                          onClick={() => handleRemoveModifier(index)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Special Instructions */}
              <div className="mb-4">
                <label className={`block ${textSecondary} text-sm font-medium mb-2`}>
                  Special Instructions
                </label>
                <textarea
                  value={newItem.special_instructions}
                  onChange={(e) => setNewItem(prev => ({ ...prev, special_instructions: e.target.value }))}
                  placeholder="Any special cooking instructions..."
                  rows={2}
                  className={`w-full ${inputBg} ${textPrimary} px-3 py-2 rounded-lg text-sm border focus:border-blue-500 focus:outline-none transition-all duration-200 resize-none`}
                />
              </div>

              <Button
                type="button"
                onClick={handleAddItem}
                disabled={!newItem.menu_item_id || !newItem.name || !newItem.quantity}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item to Order
              </Button>
            </div>

            {/* Order Items */}
            {orderData.items && orderData.items.length > 0 && (
              <div>
                <h3 className={`${textPrimary} text-lg font-semibold mb-4`}>Order Items</h3>
                <div className="space-y-3">
                  {orderData.items.map((item, index) => (
                    <div key={index} className={`${innerCardBg} p-4 rounded-lg border`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className={`${textPrimary} font-medium`}>{item.name}</h4>
                          <p className={`${textSecondary} text-sm`}>Quantity: {item.quantity}</p>
                          {item.special_instructions && (
                            <p className={`${textSecondary} text-sm italic`}>
                              Note: {item.special_instructions}
                            </p>
                          )}
                          {item.modifiers && item.modifiers.length > 0 && (
                            <div className="mt-2">
                              <p className={`${textSecondary} text-xs`}>Modifiers:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {item.modifiers.map((modifier, modIndex) => (
                                  <Badge key={modIndex} variant="outline" className="text-xs">
                                    {modifier}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <Button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          size="sm"
                          variant="outline"
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                onClick={onBack}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !orderData.station || !orderData.items?.length}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Order...
                  </>
                ) : (
                  <>
                    <ChefHat className="h-4 w-4 mr-2" />
                    Create Order
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
