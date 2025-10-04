// components/GenerateQRModal.tsx
import React, { useState, useEffect } from 'react'
import { X, QrCode, Loader2, Plus, Monitor, Menu, Settings } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useTheme } from '@/hooks/useTheme'
import type { GenerateQRRequest } from '@/lib/food-qr'

interface GenerateQRModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (request: GenerateQRRequest) => Promise<void>
  loading: boolean
}

interface Table {
  id: string
  table_number: string
  seats: number
}

export default function GenerateQRModal({ isOpen, onClose, onGenerate, loading }: GenerateQRModalProps) {
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  const [formData, setFormData] = useState<GenerateQRRequest>({
    type: 'TABLE',
    size: 256,
    color: '#000000',
    background_color: '#FFFFFF',
    logo_url: '',
    custom_data: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [tables, setTables] = useState<Table[]>([])
  const [loadingTables, setLoadingTables] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        type: 'TABLE',
        size: 256,
        color: '#000000',
        background_color: '#FFFFFF',
        logo_url: '',
        custom_data: ''
      })
      setErrors({})
      fetchTables()
    }
  }, [isOpen])

  const fetchTables = async () => {
    try {
      setLoadingTables(true)
      const token = localStorage.getItem('accessToken')
      const response = await fetch('/api/tables', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setTables(data)
      }
    } catch (error) {
      console.error('Failed to fetch tables:', error)
    } finally {
      setLoadingTables(false)
    }
  }

  if (!isOpen || !themeLoaded || !mounted) return null

  // Theme variables matching MainPanel
  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'
  const inputBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-white border-gray-300'
  const hoverBg = isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-100'
  const iconBg = isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (formData.type === 'TABLE' && !formData.table_id) {
      newErrors.table_id = 'Please select a table'
    }
    
    if (formData.type === 'CUSTOM' && !formData.custom_data) {
      newErrors.custom_data = 'Custom data is required'
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
      setErrors({})
      onClose()
    } catch (error) {
      // Error is handled by the parent component
    }
  }

  const handleInputChange = (field: keyof GenerateQRRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'TABLE': return Monitor
      case 'MENU': return Menu
      case 'CUSTOM': return Settings
      default: return QrCode
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className={`${cardBg} border shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto transition-colors duration-300`}
        style={{ borderRadius: '1.5rem' }}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${iconBg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Plus className={`w-5 h-5 ${textPrimary}`} />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${textPrimary}`}>Generate QR Code</h2>
                <p className={`${textSecondary} text-sm`}>Create a new QR code for your restaurant</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 ${textSecondary} ${hoverBg} ${textPrimary} rounded-lg transition-all duration-200`}
              disabled={loading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* QR Code Type */}
            <div>
              <label className={`block text-sm font-medium ${textPrimary} mb-3`}>QR Code Type</label>
              <div className="grid grid-cols-3 gap-3">
                {(['TABLE', 'MENU', 'CUSTOM'] as const).map((type) => {
                  const Icon = getTypeIcon(type)
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleInputChange('type', type)}
                      className={`p-4 border transition-all duration-200 ${
                        formData.type === type
                          ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                          : `${innerCardBg} ${textSecondary} hover:border-purple-400`
                      }`}
                      style={{ borderRadius: '1rem' }}
                    >
                      <Icon className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm font-medium">{type}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Table Selection for TABLE type */}
            {formData.type === 'TABLE' && (
              <div>
                <label htmlFor="table_id" className={`block text-sm font-medium ${textPrimary} mb-2`}>
                  Select Table
                </label>
                {loadingTables ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                    <span className={`ml-2 ${textSecondary}`}>Loading tables...</span>
                  </div>
                ) : (
                  <select
                    id="table_id"
                    value={formData.table_id || ''}
                    onChange={(e) => handleInputChange('table_id', e.target.value)}
                    className={`w-full px-3 py-2 ${inputBg} border ${textPrimary} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 ${
                      errors.table_id ? 'border-red-500' : ''
                    }`}
                    style={{ borderRadius: '0.5rem' }}
                    disabled={loading}
                  >
                    <option value="">Select a table</option>
                    {tables.map((table) => (
                      <option key={table.id} value={table.id}>
                        Table {table.table_number} ({table.seats} seats)
                      </option>
                    ))}
                  </select>
                )}
                {errors.table_id && (
                  <p className="text-red-400 text-xs mt-1">{errors.table_id}</p>
                )}
              </div>
            )}

            {/* Custom Data for CUSTOM type */}
            {formData.type === 'CUSTOM' && (
              <div>
                <label htmlFor="custom_data" className={`block text-sm font-medium ${textPrimary} mb-2`}>
                  Custom Data
                </label>
                <textarea
                  id="custom_data"
                  value={formData.custom_data || ''}
                  onChange={(e) => handleInputChange('custom_data', e.target.value)}
                  placeholder="Enter URL or custom text for QR code"
                  rows={3}
                  className={`w-full px-3 py-2 ${inputBg} border ${textPrimary} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-none ${
                    errors.custom_data ? 'border-red-500' : ''
                  }`}
                  style={{ borderRadius: '0.5rem' }}
                  disabled={loading}
                />
                {errors.custom_data && (
                  <p className="text-red-400 text-xs mt-1">{errors.custom_data}</p>
                )}
              </div>
            )}

            {/* Customization Options */}
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold ${textPrimary}`}>Customization</h3>
              
              {/* Size */}
              <div>
                <label htmlFor="size" className={`block text-sm font-medium ${textPrimary} mb-2`}>
                  Size (pixels)
                </label>
                <input
                  type="number"
                  id="size"
                  value={formData.size}
                  onChange={(e) => handleInputChange('size', parseInt(e.target.value))}
                  min="64"
                  max="512"
                  className={`w-full px-3 py-2 ${inputBg} border ${textPrimary} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 ${
                    errors.size ? 'border-red-500' : ''
                  }`}
                  style={{ borderRadius: '0.5rem' }}
                  disabled={loading}
                />
                {errors.size && (
                  <p className="text-red-400 text-xs mt-1">{errors.size}</p>
                )}
              </div>

              {/* Colors */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="color" className={`block text-sm font-medium ${textPrimary} mb-2`}>
                    Foreground Color
                  </label>
                  <input
                    type="color"
                    id="color"
                    value={formData.color}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    className={`w-full h-10 ${inputBg} border cursor-pointer`}
                    style={{ borderRadius: '0.5rem' }}
                    disabled={loading}
                  />
                </div>
                
                <div>
                  <label htmlFor="background_color" className={`block text-sm font-medium ${textPrimary} mb-2`}>
                    Background Color
                  </label>
                  <input
                    type="color"
                    id="background_color"
                    value={formData.background_color}
                    onChange={(e) => handleInputChange('background_color', e.target.value)}
                    className={`w-full h-10 ${inputBg} border cursor-pointer`}
                    style={{ borderRadius: '0.5rem' }}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Logo URL */}
              <div>
                <label htmlFor="logo_url" className={`block text-sm font-medium ${textPrimary} mb-2`}>
                  Logo URL (optional)
                </label>
                <input
                  type="url"
                  id="logo_url"
                  value={formData.logo_url || ''}
                  onChange={(e) => handleInputChange('logo_url', e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className={`w-full px-3 py-2 ${inputBg} border ${textPrimary} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200`}
                  style={{ borderRadius: '0.5rem' }}
                  disabled={loading}
                />
                <p className={`${textSecondary} text-xs mt-1`}>
                  Add your restaurant logo to the center of the QR code
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 px-4 py-2 ${innerCardBg} ${textSecondary} ${hoverBg} ${textPrimary} transition-all duration-200`}
                style={{ borderRadius: '0.75rem' }}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 px-4 py-2 ${isDark ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'} transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
                style={{ borderRadius: '0.75rem' }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <QrCode className="w-4 h-4" />
                    <span>Generate QR Code</span>
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