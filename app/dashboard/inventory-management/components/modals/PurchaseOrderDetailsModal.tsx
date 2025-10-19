// app/dashboard/inventory-management/components/modals/PurchaseOrderDetailsModal.tsx

"use client"

import React from 'react'
import { useTheme } from "@/hooks/useTheme"
import type { PurchaseOrder } from '@/src/api/generated/models/PurchaseOrder'

interface PurchaseOrderDetailsModalProps {
  purchaseOrder: PurchaseOrder
  inventoryItems: any[]
  onClose: () => void
}

export default function PurchaseOrderDetailsModal({ 
  purchaseOrder, 
  inventoryItems, 
  onClose 
}: PurchaseOrderDetailsModalProps) {
  const { isDark } = useTheme()

  const cardBg = isDark ? "bg-[#171717] border-[#2a2a2a]" : "bg-white border-gray-200"
  const textPrimary = isDark ? "text-white" : "text-gray-900"
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600"

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${cardBg} p-6 rounded-xl border shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-xl font-bold ${textPrimary}`}>Purchase Order Details</h3>
          <button
            onClick={onClose}
            className={`${isDark ? 'text-white hover:text-red-400' : 'text-gray-600 hover:text-red-400'} p-1 transition-colors duration-300`}
          >
            ×
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className={`${textSecondary} text-sm`}>Order Number:</span>
              <p className={`${textPrimary} font-medium`}>{purchaseOrder.order_number}</p>
            </div>
            <div>
              <span className={`${textSecondary} text-sm`}>Status:</span>
              <p className={`${textPrimary} font-medium`}>{purchaseOrder.status}</p>
            </div>
            <div>
              <span className={`${textSecondary} text-sm`}>Total Amount:</span>
              <p className={`${textPrimary} font-medium`}>${parseFloat(purchaseOrder.total_amount).toFixed(2)}</p>
            </div>
            <div>
              <span className={`${textSecondary} text-sm`}>Order Date:</span>
              <p className={`${textPrimary} font-medium`}>
                {new Date(purchaseOrder.order_date).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div>
            <h4 className={`${textPrimary} font-semibold mb-2`}>Items</h4>
            <div className="space-y-3">
              {purchaseOrder.items.map((item, index) => {
                const inventoryItem = inventoryItems.find(inv => inv.id === item.inventory_item_id)
                const itemName = inventoryItem ? `${inventoryItem.name} (${inventoryItem.category})` : `Item: ${item.inventory_item_id}`
                
                return (
                  <div key={index} className={`${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-100'} p-4 rounded-lg`}>
                    <div className="space-y-2">
                      <h5 className={`${textPrimary} font-medium`}>
                        {itemName}
                      </h5>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className={`${textSecondary}`}>Quantity:</span>
                          <span className={`${textPrimary}`}>{item.quantity}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className={`${textSecondary}`}>Unit Cost:</span>
                          <span className={`${textPrimary}`}>${parseFloat(item.unit_cost).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium">
                          <span className={`${textSecondary}`}>Total:</span>
                          <span className={`${textPrimary}`}>${(Number(item.unit_cost) * Number(item.quantity)).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
