// app/dashboard/inventory-management/components/modals/DeleteConfirmationModal.tsx

"use client"

import React from 'react'
import { Trash2, Loader2 } from "lucide-react"
import { useTheme } from "@/hooks/useTheme"

interface DeleteConfirmationModalProps {
  title: string
  message: string
  itemName: string
  itemDetails?: string[]
  onConfirm: () => void
  onCancel: () => void
  loading: boolean
  loadingText?: string
}

export default function DeleteConfirmationModal({
  title,
  message,
  itemName,
  itemDetails = [],
  onConfirm,
  onCancel,
  loading,
  loadingText = "Deleting..."
}: DeleteConfirmationModalProps) {
  const { isDark } = useTheme()

  const cardBg = isDark ? "bg-[#171717] border-[#2a2a2a]" : "bg-white border-gray-200"
  const textPrimary = isDark ? "text-white" : "text-gray-900"
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600"

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${cardBg} p-6 rounded-xl border shadow-xl max-w-md w-full mx-4 transition-colors duration-300`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-xl font-bold ${textPrimary} transition-colors duration-300`}>{title}</h3>
          <button
            onClick={onCancel}
            className={`${textSecondary} hover:text-red-400 p-1 transition-colors duration-300`}
          >
            ×
          </button>
        </div>
        
        <div className="mb-6">
          <p className={`${textSecondary} mb-4 transition-colors duration-300`}>
            {message}
          </p>
          <div className={`${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-100'} p-4 rounded-lg border transition-colors duration-300`}>
            <h4 className={`${textPrimary} font-medium mb-2 transition-colors duration-300`}>{itemName}</h4>
            {itemDetails.map((detail, index) => (
              <p key={index} className={`${textSecondary} text-sm transition-colors duration-300`}>
                {detail}
              </p>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className={`px-6 py-2 ${isDark ? 'bg-[#1f1f1f] text-gray-400 border-[#2a2a2a] hover:bg-[#2a2a2a]' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'} border rounded-lg font-medium transition-all duration-200`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 flex items-center gap-2`}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            {loading ? loadingText : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
