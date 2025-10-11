// app/dashboard/kds-component/components/CreateKDSOrderModal.tsx

"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Plus,
  X,
  Clock,
  ChefHat,
  Save,
  Loader2,
  AlertCircle
} from "lucide-react"
import type { KDSOrderCreate } from "@/src/api/generated/models/KDSOrderCreate"
import type { KDSOrderItem } from "@/src/api/generated/models/KDSOrderItem"
import type { MenuItem } from "@/src/api/generated/models/MenuItem"
import { MenuManagementService } from "@/src/api/generated/services/MenuManagementService"
import { configureAPI } from "@/lib/api-config"

interface CreateKDSOrderModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateOrder: (orderData: KDSOrderCreate) => Promise<void>
  businessId: string
  isDark?: boolean
}

// Helper type for the form state (with optional fields for the form)
type KDSOrderItemForm = Partial<KDSOrderItem> & {
  menu_item_id: string
  name: string
  quantity: number
  modifiers: string[]
  special_instructions?: string
}

export default function CreateKDSOrderModal({ 
  isOpen, 
  onClose, 
  onCreateOrder,
  businessId,
  isDark = false 
}: CreateKDSOrderModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [menuItemsLoading, setMenuItemsLoading] = useState(false)
  const [menuItemsError, setMenuItemsError] = useState<string | null>(null)
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

  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'

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
      const items = await MenuManagementService.listMenuItemsApiV1MenuItemsGet(
        businessId,
        null, // categoryId
        null, // isAvailable
        null, // search
        100   // limit
      )
      console.log('Fetched menu items:', items.length, 'items')
      setMenuItems(items)
    } catch (err: any) {
      console.error('Error fetching menu items:', err)
      setMenuItemsError(err.message || 'Failed to fetch menu items')
    } finally {
      setMenuItemsLoading(false)
    }
  }

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      const newOrderId = generateOrderId()
      setOrderData({
        order_id: newOrderId,
        business_id: businessId,
        station: '',
        items: [],
        priority: 1,
        target_time: ''
      })
      setNewItem({
        menu_item_id: '',
        name: '',
        quantity: 1,
        modifiers: [],
        special_instructions: ''
      })
      setNewModifier('')
      setValidationErrors([])
      
      // Fetch menu items when modal opens
      fetchMenuItems()
    }
  }, [isOpen, businessId])

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

    if (errors.length > 0) {
      setValidationErrors(errors)
      return
    }

    setValidationErrors([])
    setIsSubmitting(true)
    try {
      // Ensure business_id is set
      const orderToCreate: KDSOrderCreate = {
        ...orderData,
        business_id: businessId,
        order_id: orderData.order_id!,
        station: orderData.station!,
        items: orderData.items!,
        priority: orderData.priority || 1,
        target_time: orderData.target_time || undefined
      }
      
      await onCreateOrder(orderToCreate)
      onClose()
    } catch (error) {
      console.error('Failed to create KDS order:', error)
      setValidationErrors(['Failed to create order. Please try again.'])
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-4xl max-h-[90vh] overflow-y-auto ${isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'}`}>
        <DialogHeader>
          <DialogTitle className={`${textPrimary} text-2xl font-bold flex items-center gap-3`}>
            <Plus className="h-6 w-6" />
            Create New KDS Order
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className={`${isDark ? 'bg-red-900/20 border-red-500' : 'bg-red-50 border-red-200'} border rounded-lg p-4`}>
              <h4 className={`${isDark ? 'text-red-400' : 'text-red-600'} font-semibold mb-2`}>Please fix the following errors:</h4>
              <ul className={`${isDark ? 'text-red-300' : 'text-red-600'} text-sm space-y-1`}>
                {validationErrors.map((error: string, index: number) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Order Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className={textPrimary}>Order ID</Label>
              <Input
                value={orderData.order_id || ''}
                readOnly
                className={`${innerCardBg} opacity-75 cursor-not-allowed`}
                placeholder="Auto-generated..."
              />
              <p className={`${textSecondary} text-xs`}>Order ID is automatically generated</p>
            </div>

            <div className="space-y-2">
              <Label className={textPrimary}>Station *</Label>
              <Select 
                value={orderData.station} 
                onValueChange={(value: string) => setOrderData((prev: Partial<KDSOrderCreate>) => ({ ...prev, station: value }))}
              >
                <SelectTrigger className={innerCardBg}>
                  <SelectValue placeholder="Select station" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grill">Grill</SelectItem>
                  <SelectItem value="salad">Salad Station</SelectItem>
                  <SelectItem value="pizza">Pizza Station</SelectItem>
                  <SelectItem value="dessert">Dessert Station</SelectItem>
                  <SelectItem value="beverage">Beverage Station</SelectItem>
                  <SelectItem value="appetizer">Appetizer Station</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className={textPrimary}>Priority</Label>
              <Select 
                value={orderData.priority?.toString()} 
                onValueChange={(value: string) => setOrderData((prev: Partial<KDSOrderCreate>) => ({ ...prev, priority: parseInt(value) }))}
              >
                <SelectTrigger className={innerCardBg}>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Low (1)</SelectItem>
                  <SelectItem value="2">Medium (2)</SelectItem>
                  <SelectItem value="3">High (3)</SelectItem>
                  <SelectItem value="4">Urgent (4)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className={textPrimary}>Target Time</Label>
              <Input
                type="datetime-local"
                value={orderData.target_time || ''}
                onChange={(e) => setOrderData((prev: Partial<KDSOrderCreate>) => ({ ...prev, target_time: e.target.value }))}
                className={innerCardBg}
              />
            </div>
          </div>

          {/* Add New Item */}
            <Card className={`${innerCardBg} p-4`}>
              <h3 className={`${textPrimary} text-lg font-semibold mb-4`}>Add Menu Item</h3>
              
              {/* Menu Items Loading State */}
              {menuItemsLoading && (
                <div className={`${isDark ? 'bg-blue-900/20 border-blue-500' : 'bg-blue-50 border-blue-200'} border rounded-lg p-4 mb-4`}>
                  <div className="flex items-center gap-2">
                    <Loader2 className={`h-4 w-4 ${isDark ? 'text-blue-400' : 'text-blue-600'} animate-spin`} />
                    <p className={`${isDark ? 'text-blue-300' : 'text-blue-600'} text-sm`}>
                      Loading menu items...
                    </p>
                  </div>
                </div>
              )}

              {/* Menu Items Error State */}
              {menuItemsError && (
                <div className={`${isDark ? 'bg-red-900/20 border-red-500' : 'bg-red-50 border-red-200'} border rounded-lg p-4 mb-4`}>
                  <div className="flex items-center gap-2">
                    <AlertCircle className={`h-4 w-4 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
                    <p className={`${isDark ? 'text-red-300' : 'text-red-600'} text-sm`}>
                      {menuItemsError}
                    </p>
                  </div>
                  <Button 
                    onClick={fetchMenuItems} 
                    size="sm" 
                    variant="outline" 
                    className="mt-2"
                  >
                    Retry
                  </Button>
                </div>
              )}

              {/* Menu Items Empty State */}
              {!menuItemsLoading && !menuItemsError && menuItems.length === 0 && (
                <div className={`${isDark ? 'bg-yellow-900/20 border-yellow-500' : 'bg-yellow-50 border-yellow-200'} border rounded-lg p-4 mb-4`}>
                  <div className="flex items-center gap-2">
                    <AlertCircle className={`h-4 w-4 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
                    <p className={`${isDark ? 'text-yellow-300' : 'text-yellow-600'} text-sm`}>
                      No menu items available. Please add menu items first.
                    </p>
                  </div>
                </div>
              )}
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label className={textPrimary}>Menu Item *</Label>
                <Select 
                  value={newItem.menu_item_id} 
                  onValueChange={handleMenuItemSelect}
                  disabled={Boolean(menuItemsLoading || menuItemsError || menuItems.length === 0)}
                >
                  <SelectTrigger className={innerCardBg}>
                    <SelectValue placeholder={
                      menuItemsLoading 
                        ? "Loading menu items..." 
                        : menuItemsError 
                          ? "Error loading menu items"
                          : menuItems.length === 0 
                            ? "No menu items available" 
                            : "Select menu item"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {menuItems.map((item: MenuItem) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name} - ${item.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className={textPrimary}>Quantity *</Label>
                <Input
                  type="number"
                  min="1"
                  value={newItem.quantity || 1}
                  onChange={(e) => setNewItem((prev: KDSOrderItemForm) => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                  className={innerCardBg}
                  disabled={Boolean(menuItemsLoading || menuItemsError || menuItems.length === 0)}
                />
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <Label className={textPrimary}>Special Instructions</Label>
              <Textarea
                value={newItem.special_instructions || ''}
                onChange={(e) => setNewItem((prev: KDSOrderItemForm) => ({ ...prev, special_instructions: e.target.value }))}
                placeholder="Any special cooking instructions..."
                className={innerCardBg}
                disabled={Boolean(menuItemsLoading || menuItemsError || menuItems.length === 0)}
              />
            </div>

            {/* Modifiers */}
            <div className="space-y-2 mb-4">
              <Label className={textPrimary}>Modifiers</Label>
              <div className="flex gap-2">
                <Input
                  value={newModifier}
                  onChange={(e) => setNewModifier(e.target.value)}
                  placeholder="Add modifier..."
                  className={innerCardBg}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddModifier()}
                  disabled={Boolean(menuItemsLoading || menuItemsError || menuItems.length === 0)}
                />
                <Button 
                  onClick={handleAddModifier} 
                  size="sm" 
                  variant="outline"
                  disabled={Boolean(menuItemsLoading || menuItemsError || menuItems.length === 0 || !newModifier.trim())}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {newItem.modifiers && newItem.modifiers.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {newItem.modifiers.map((modifier: string, index: number) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {modifier}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => handleRemoveModifier(index)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Button 
              onClick={handleAddItem} 
              className="w-full"
              disabled={Boolean(menuItemsLoading || menuItemsError || menuItems.length === 0 || !newItem.menu_item_id || !newItem.name || !newItem.quantity)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item to Order
            </Button>
          </Card>

          {/* Order Items List */}
          {orderData.items && orderData.items.length > 0 && (
            <div>
              <h3 className={`${textPrimary} text-lg font-semibold mb-4`}>Order Items ({orderData.items.length})</h3>
              <div className="space-y-3">
                {orderData.items.map((item: KDSOrderItem, index: number) => (
                  <Card key={index} className={`${innerCardBg} p-4`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className={`${textPrimary} font-semibold`}>{item.name}</h4>
                        <p className={`${textSecondary} text-sm`}>Quantity: {item.quantity}</p>
                        
                        {item.special_instructions && (
                          <p className={`${textSecondary} text-sm italic mt-1`}>
                            Instructions: {item.special_instructions}
                          </p>
                        )}

                        {item.modifiers && item.modifiers.length > 0 && (
                          <div className="mt-2">
                            <p className={`${textSecondary} text-sm`}>Modifiers:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.modifiers.map((modifier: string, modIndex: number) => (
                                <Badge key={modIndex} variant="outline" className="text-xs">
                                  {modifier}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleRemoveItem(index)}
                        className="ml-4"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={onClose} className="flex-1">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting || !orderData.order_id || !orderData.station || !orderData.items?.length}
              className="flex-1"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Create Order
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}