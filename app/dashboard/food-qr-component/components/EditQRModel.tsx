// components/EditQRModal.tsx
import React, { useState, useEffect } from 'react'
import { X, QrCode, Loader2, Save } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useTheme } from "@/hooks/useTheme"
import type { QRCode } from '@/lib/food-qr'

interface EditQRModalProps {
  isOpen: boolean
  onClose: () => void
  qrCode: QRCode | null
  onUpdate: (qrId: string, updates: {
    size?: number
    color?: string
    background_color?: string
    logo_url?: string
    template_id?: string
  }) => Promise<void>
  loading: boolean
}

export default function EditQRModal({ isOpen, onClose, qrCode, onUpdate, loading }: EditQRModalProps) {
  const [formData, setFormData] = useState({
    size: 256,
    color: '#000000',
    background_color: '#FFFFFF',
    logo_url: '',
    template_id: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [mounted, setMounted] = useState(false)
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (qrCode) {
      setFormData({
        size: qrCode.size || 256,
        color: qrCode.color || '#000000',
        background_color: qrCode.background_color || '#FFFFFF',
        logo_url: qrCode.logo_url || '',
        template_id: ''
      })
    }
  }, [qrCode])

  if (!isOpen || !qrCode || !themeLoaded || !mounted) return null

  // Theme-based styling variables
  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const inputBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'
  const buttonHoverBg = isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-100'
  const overlayBg = isDark ? 'bg-[#0f0f0f]/80' : 'bg-black/50'

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
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
      await onUpdate(qrCode.id, formData)
      setErrors({})
      onClose()
    } catch (error) {
      // Error is handled by the parent component
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const getTypeName = () => {
    switch (qrCode.type) {
      case 'TABLE':
        return qrCode.table_id ? `Table ${qrCode.table_id}` : 'Table QR'
      case 'MENU':
        return 'Menu QR Code'
      case 'CUSTOM':
        return 'Custom QR Code'
      default:
        return 'QR Code'
    }
  }

  return (
    <div className={`fixed inset-0 ${overlayBg} backdrop-blur-sm flex items-center justify-center z-50 p-4`}>
      <div className={`${cardBg} border shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto`}
        style={{ borderRadius: '1.5rem', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-2xl flex items-center justify-center`}>
                <QrCode className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${textPrimary}`}>Edit QR Code</h2>
                <p className={`${textSecondary} text-sm`}>Update settings for {getTypeName()}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-3 ${textSecondary} ${buttonHoverBg} rounded-xl transition-all duration-200 hover:scale-110`}
              disabled={loading}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-6">
            <label className={`block text-sm font-medium ${textPrimary} mb-3`}>Current QR Code</label>
            <div className="bg-white p-4 rounded-xl flex items-center justify-center border">
              <img 
                src={`data:image/png;base64,${qrCode.image_base64}`}
                alt={`QR Code for ${getTypeName()}`}
                className="w-32 h-32 object-contain"
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="size" className={`block text-sm font-medium ${textPrimary} mb-3`}>
                Size (pixels)
              </label>
              <input
                type="number"
                id="size"
                value={formData.size}
                onChange={(e) => handleInputChange('size', parseInt(e.target.value))}
                min="64"
                max="512"
                className={`w-full px-4 py-3 ${inputBg} ${textPrimary} border rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-200 ${
                  errors.size ? 'border-red-500' : ''
                }`}
                disabled={loading}
              />
              {errors.size && (
                <p className="text-red-500 text-xs mt-1">{errors.size}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="color" className={`block text-sm font-medium ${textPrimary} mb-3`}>
                  Foreground Color
                </label>
                <input
                  type="color"
                  id="color"
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  className={`w-full h-12 ${inputBg} border rounded-xl cursor-pointer`}
                  disabled={loading}
                />
              </div>
              
              <div>
                <label htmlFor="background_color" className={`block text-sm font-medium ${textPrimary} mb-3`}>
                  Background Color
                </label>
                <input
                  type="color"
                  id="background_color"
                  value={formData.background_color}
                  onChange={(e) => handleInputChange('background_color', e.target.value)}
                  className={`w-full h-12 ${inputBg} border rounded-xl cursor-pointer`}
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="logo_url" className={`block text-sm font-medium ${textPrimary} mb-3`}>
                Logo URL (optional)
              </label>
              <input
                type="url"
                id="logo_url"
                value={formData.logo_url}
                onChange={(e) => handleInputChange('logo_url', e.target.value)}
                placeholder="https://example.com/logo.png"
                className={`w-full px-4 py-3 ${inputBg} ${textPrimary} border rounded-xl placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all duration-200`}
                disabled={loading}
              />
              <p className={`${textSecondary} text-xs mt-2`}>
                Add your restaurant logo to the center of the QR code
              </p>
            </div>

            <div>
              <label htmlFor="template_id" className={`block text-sm font-medium ${textPrimary} mb-3`}>
                Template ID (optional)
              </label>
              <input
                type="text"
                id="template_id"
                value={formData.template_id}
                onChange={(e) => handleInputChange('template_id', e.target.value)}
                placeholder="food_standard"
                className={`w-full px-4 py-3 ${inputBg} ${textPrimary} border rounded-xl placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all duration-200`}
                disabled={loading}
              />
            </div>

            <div className={`${isDark ? 'bg-blue-900/20 border-blue-500/30' : 'bg-blue-50 border-blue-300'} border rounded-xl p-4`}>
              <p className="text-blue-500 text-sm">
                <strong>Note:</strong> Updating this QR code will generate a new version with your changes. 
                The QR data and functionality will remain the same.
              </p>
            </div>

            <div className="flex items-center space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 px-6 py-3 ${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535] border-[#3a3a3a]' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'} ${textPrimary} rounded-xl font-medium transition-all duration-300 border shadow-lg hover:shadow-xl hover:scale-105`}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 px-6 py-3 ${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535] border-[#3a3a3a]' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'} ${textPrimary} rounded-xl font-medium transition-all duration-300 border shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Update QR</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}