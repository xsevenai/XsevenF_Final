// components/GenerateQRModal.tsx

import React, { useState, useEffect } from 'react'
import { X, QrCode, Loader2, Monitor, Menu, Settings } from 'lucide-react'
import { Card } from '@/components/ui/card'
import type { GenerateQRRequest } from '@/lib/food-qr'

interface Table {
  id: string  // UUID string
  table_number: string
  location: string
}

interface GenerateQRModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (request: GenerateQRRequest) => Promise<void>
  loading: boolean
}

export default function GenerateQRModal({ isOpen, onClose, onGenerate, loading }: GenerateQRModalProps) {
  const [formData, setFormData] = useState<GenerateQRRequest>({
    type: 'TABLE',
    size: 256,
    color: '#000000',
    background_color: '#FFFFFF'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [tables, setTables] = useState<Table[]>([])
  const [loadingTables, setLoadingTables] = useState(false)

  // Load tables when modal opens and type is TABLE
  useEffect(() => {
    if (isOpen && formData.type === 'TABLE') {
      loadTables()
    }
  }, [isOpen, formData.type])

  const loadTables = async () => {
    try {
      setLoadingTables(true)
      // Mock data - replace with actual API call to get tables
      const mockTables: Table[] = [
        { id: '1', table_number: 'A1', location: 'Main Floor' },
        { id: '2', table_number: 'A2', location: 'Main Floor' },
        { id: '3', table_number: 'B1', location: 'Patio' },
        { id: '4', table_number: 'B2', location: 'Patio' },
        { id: '5', table_number: 'VIP1', location: 'VIP Section' }
      ]
      setTables(mockTables)
    } catch (error) {
      console.error('Failed to load tables:', error)
    } finally {
      setLoadingTables(false)
    }
  }

  if (!isOpen) return null

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (formData.type === 'TABLE' && !formData.table_id) {
      newErrors.table_id = 'Please select a table'
    }

    if (formData.type === 'CUSTOM' && !formData.custom_data?.trim()) {
      newErrors.custom_data = 'Custom data is required for custom QR codes'
    }

    if (formData.size && (formData.size < 64 || formData.size > 512)) {
      newErrors.size = 'Size must be between 64 and 512 pixels'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      await onGenerate(formData)
      // Reset form on success
      setFormData({
        type: 'TABLE',
        size: 256,
        color: '#000000',
        background_color: '#FFFFFF'
      })
      setErrors({})
      onClose()
    } catch (error) {
      // Error is handled by the parent component
    }
  }

  const handleInputChange = (field: keyof GenerateQRRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const qrTypes = [
    { value: 'TABLE' as const, label: 'Table QR', icon: Monitor, description: 'QR code for specific table' },
    { value: 'MENU' as const, label: 'Menu QR', icon: Menu, description: 'QR code for menu access' },
    { value: 'CUSTOM' as const, label: 'Custom QR', icon: Settings, description: 'Custom QR with your data' }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <QrCode className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Generate QR Code</h2>
                <p className="text-gray-400 text-sm">Create a new QR code for your restaurant</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
              disabled={loading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* QR Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                QR Code Type *
              </label>
              <div className="space-y-2">
                {qrTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                      formData.type === type.value
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={type.value}
                      checked={formData.type === type.value}
                      onChange={(e) => handleInputChange('type', e.target.value as 'TABLE' | 'MENU' | 'CUSTOM')}
                      className="text-purple-500"
                      disabled={loading}
                    />
                    <type.icon className={`w-5 h-5 ${
                      formData.type === type.value ? 'text-purple-400' : 'text-gray-400'
                    }`} />
                    <div className="flex-1">
                      <div className={`font-medium ${
                        formData.type === type.value ? 'text-white' : 'text-gray-300'
                      }`}>
                        {type.label}
                      </div>
                      <div className="text-xs text-gray-400">{type.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Table Selection - only show for TABLE type */}
            {formData.type === 'TABLE' && (
              <div>
                <label htmlFor="table_id" className="block text-sm font-medium text-gray-300 mb-2">
                  Select Table *
                </label>
                {loadingTables ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                    <span className="ml-2 text-gray-400 text-sm">Loading tables...</span>
                  </div>
                ) : (
                  <select
                    id="table_id"
                    value={formData.table_id || ''}
                    onChange={(e) => handleInputChange('table_id', e.target.value)}
                    className={`w-full px-3 py-2 bg-gray-700/50 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 ${
                      errors.table_id ? 'border-red-500' : 'border-gray-600'
                    }`}
                    disabled={loading}
                  >
                    <option value="">Select a table...</option>
                    {tables.map((table) => (
                      <option key={table.id} value={table.id}>
                        Table {table.table_number} - {table.location}
                      </option>
                    ))}
                  </select>
                )}
                {errors.table_id && (
                  <p className="text-red-400 text-xs mt-1">{errors.table_id}</p>
                )}
              </div>
            )}

            {/* Custom Data - only show for CUSTOM type */}
            {formData.type === 'CUSTOM' && (
              <div>
                <label htmlFor="custom_data" className="block text-sm font-medium text-gray-300 mb-2">
                  Custom Data *
                </label>
                <textarea
                  id="custom_data"
                  value={formData.custom_data || ''}
                  onChange={(e) => handleInputChange('custom_data', e.target.value)}
                  placeholder="Enter your custom QR code data (URL, text, etc.)"
                  rows={3}
                  className={`w-full px-3 py-2 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-none ${
                    errors.custom_data ? 'border-red-500' : 'border-gray-600'
                  }`}
                  disabled={loading}
                />
                {errors.custom_data && (
                  <p className="text-red-400 text-xs mt-1">{errors.custom_data}</p>
                )}
              </div>
            )}

            {/* Advanced Options */}
            <div className="space-y-4 pt-4 border-t border-gray-700/50">
              <h3 className="text-sm font-medium text-gray-300">Advanced Options</h3>
              
              {/* Size */}
              <div>
                <label htmlFor="size" className="block text-sm font-medium text-gray-300 mb-2">
                  Size (pixels)
                </label>
                <input
                  type="number"
                  id="size"
                  value={formData.size || 256}
                  onChange={(e) => handleInputChange('size', parseInt(e.target.value))}
                  min="64"
                  max="512"
                  className={`w-full px-3 py-2 bg-gray-700/50 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 ${
                    errors.size ? 'border-red-500' : 'border-gray-600'
                  }`}
                  disabled={loading}
                />
                {errors.size && (
                  <p className="text-red-400 text-xs mt-1">{errors.size}</p>
                )}
              </div>

              {/* Colors */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="color" className="block text-sm font-medium text-gray-300 mb-2">
                    Foreground Color
                  </label>
                  <input
                    type="color"
                    id="color"
                    value={formData.color || '#000000'}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    className="w-full h-10 bg-gray-700/50 border border-gray-600 rounded-lg cursor-pointer"
                    disabled={loading}
                  />
                </div>
                
                <div>
                  <label htmlFor="background_color" className="block text-sm font-medium text-gray-300 mb-2">
                    Background Color
                  </label>
                  <input
                    type="color"
                    id="background_color"
                    value={formData.background_color || '#FFFFFF'}
                    onChange={(e) => handleInputChange('background_color', e.target.value)}
                    className="w-full h-10 bg-gray-700/50 border border-gray-600 rounded-lg cursor-pointer"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Logo URL */}
              <div>
                <label htmlFor="logo_url" className="block text-sm font-medium text-gray-300 mb-2">
                  Logo URL (optional)
                </label>
                <input
                  type="url"
                  id="logo_url"
                  value={formData.logo_url || ''}
                  onChange={(e) => handleInputChange('logo_url', e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                  disabled={loading}
                />
                <p className="text-gray-500 text-xs mt-1">
                  Add your restaurant logo to the center of the QR code
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 hover:text-white transition-all duration-200"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <QrCode className="w-4 h-4" />
                    <span>Generate QR</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}