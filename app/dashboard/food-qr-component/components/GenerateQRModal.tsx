// components/GenerateQRModal.tsx
import React, { useState, useEffect } from 'react'
import { X, QrCode, Loader2, Plus, Monitor, Menu, Settings, Package, Building } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useTheme } from '@/hooks/useTheme'
import { useTables } from '@/hooks/use-operations'
import { useMenuItems, useMenuCategories } from '@/hooks/use-menu'
import type { GenerateQRRequest } from '@/lib/food-qr'

interface GenerateQRModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (request: GenerateQRRequest) => Promise<void>
  loading: boolean
  businessId: string
}

export default function GenerateQRModal({ isOpen, onClose, onGenerate, loading, businessId }: GenerateQRModalProps) {
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // Use existing hooks for data fetching
  const { tables, loading: tablesLoading } = useTables(businessId)
  const { items: menuItems, loading: menuItemsLoading } = useMenuItems(businessId)
  const { categories: menuCategories, loading: categoriesLoading } = useMenuCategories(businessId)
  
  const [formData, setFormData] = useState<GenerateQRRequest>({
    type: 'table',
    target_id: '',
    business_id: businessId,
    size: 256,
    format: 'png',
    include_logo: false,
    custom_data: {}
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setMounted(true)
  }, [])

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        type: 'table',
        target_id: '',
        business_id: businessId,
        size: 256,
        format: 'png',
        include_logo: false,
        custom_data: {}
      })
      setErrors({})
    }
  }, [isOpen, businessId])

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
    
    if (!formData.target_id) {
      newErrors.target_id = 'Please select a target'
    }
    
    if (formData.size && (formData.size < 100 || formData.size > 1000)) {
      newErrors.size = 'Size must be between 100 and 1000 pixels'
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
      case 'table': return Monitor
      case 'menu_item': return Menu
      case 'menu_category': return Package
      case 'order': return Settings
      case 'business': return Building
      default: return QrCode
    }
  }

  const getTypeOptions = () => {
    const options = [
      { value: 'table', label: 'Table', description: 'QR code for table ordering' },
      { value: 'menu_item', label: 'Menu Item', description: 'QR code for specific menu item' },
      { value: 'menu_category', label: 'Menu Category', description: 'QR code for menu category' },
      { value: 'order', label: 'Order', description: 'QR code for order tracking' },
      { value: 'business', label: 'Business', description: 'QR code for business info' }
    ]
    return options
  }

  const getTargetOptions = () => {
    switch (formData.type) {
      case 'table':
        return tables.map(table => ({
          value: table.id,
          label: `Table ${table.table_number} (${table.capacity} seats)`
        }))
      case 'menu_item':
        return menuItems.map(item => ({
          value: item.id,
          label: `${item.name} - $${item.price}`
        }))
      case 'menu_category':
        return menuCategories.map(category => ({
          value: category.id,
          label: category.name
        }))
      case 'order':
        return [{ value: 'new', label: 'New Order' }]
      case 'business':
        return [{ value: businessId, label: 'Business Profile' }]
      default:
        return []
    }
  }

  const isLoadingData = () => {
    switch (formData.type) {
      case 'table': return tablesLoading
      case 'menu_item': return menuItemsLoading
      case 'menu_category': return categoriesLoading
      default: return false
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
              <div className="grid grid-cols-2 gap-3">
                {getTypeOptions().map((option) => {
                  const Icon = getTypeIcon(option.value)
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        handleInputChange('type', option.value)
                        handleInputChange('target_id', '') // Reset target when type changes
                      }}
                      className={`p-4 border transition-all duration-200 ${
                        formData.type === option.value
                          ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                          : `${innerCardBg} ${textSecondary} hover:border-purple-400`
                      }`}
                      style={{ borderRadius: '1rem' }}
                    >
                      <Icon className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm font-medium">{option.label}</div>
                      <div className="text-xs opacity-75">{option.description}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Target Selection */}
            <div>
              <label htmlFor="target_id" className={`block text-sm font-medium ${textPrimary} mb-2`}>
                Select Target
              </label>
              {isLoadingData() ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                  <span className={`ml-2 ${textSecondary}`}>Loading targets...</span>
                </div>
              ) : (
                <select
                  id="target_id"
                  value={formData.target_id}
                  onChange={(e) => handleInputChange('target_id', e.target.value)}
                  className={`w-full px-3 py-2 ${inputBg} border ${textPrimary} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 ${
                    errors.target_id ? 'border-red-500' : ''
                  }`}
                  style={{ borderRadius: '0.5rem' }}
                  disabled={loading}
                >
                  <option value="">Select a target</option>
                  {getTargetOptions().map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
              {errors.target_id && (
                <p className="text-red-400 text-xs mt-1">{errors.target_id}</p>
              )}
            </div>

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
                  min="100"
                  max="1000"
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

              {/* Format */}
              <div>
                <label htmlFor="format" className={`block text-sm font-medium ${textPrimary} mb-2`}>
                  Format
                </label>
                <select
                  id="format"
                  value={formData.format}
                  onChange={(e) => handleInputChange('format', e.target.value)}
                  className={`w-full px-3 py-2 ${inputBg} border ${textPrimary} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200`}
                  style={{ borderRadius: '0.5rem' }}
                  disabled={loading}
                >
                  <option value="png">PNG</option>
                  <option value="svg">SVG</option>
                  <option value="base64">Base64</option>
                </select>
              </div>

              {/* Include Logo */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="include_logo"
                  checked={formData.include_logo}
                  onChange={(e) => handleInputChange('include_logo', e.target.checked)}
                  className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                  disabled={loading}
                />
                <label htmlFor="include_logo" className={`text-sm font-medium ${textPrimary}`}>
                  Include restaurant logo
                </label>
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