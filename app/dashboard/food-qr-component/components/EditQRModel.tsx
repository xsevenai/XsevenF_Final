// components/EditQRModal.tsx
import React, { useState, useEffect } from 'react'
import { X, QrCode, Loader2, Save } from 'lucide-react'
import { Card } from '@/components/ui/card'
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

  if (!isOpen || !qrCode) return null

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <QrCode className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Edit QR Code</h2>
                <p className="text-gray-400 text-sm">Update settings for {getTypeName()}</p>
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

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Current QR Code</label>
            <div className="bg-white p-4 rounded-lg flex items-center justify-center">
              <img 
                src={`data:image/png;base64,${qrCode.image_base64}`}
                alt={`QR Code for ${getTypeName()}`}
                className="w-32 h-32 object-contain"
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="size" className="block text-sm font-medium text-gray-300 mb-2">
                Size (pixels)
              </label>
              <input
                type="number"
                id="size"
                value={formData.size}
                onChange={(e) => handleInputChange('size', parseInt(e.target.value))}
                min="64"
                max="512"
                className={`w-full px-3 py-2 bg-gray-700/50 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                  errors.size ? 'border-red-500' : 'border-gray-600'
                }`}
                disabled={loading}
              />
              {errors.size && (
                <p className="text-red-400 text-xs mt-1">{errors.size}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-300 mb-2">
                  Foreground Color
                </label>
                <input
                  type="color"
                  id="color"
                  value={formData.color}
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
                  value={formData.background_color}
                  onChange={(e) => handleInputChange('background_color', e.target.value)}
                  className="w-full h-10 bg-gray-700/50 border border-gray-600 rounded-lg cursor-pointer"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="logo_url" className="block text-sm font-medium text-gray-300 mb-2">
                Logo URL (optional)
              </label>
              <input
                type="url"
                id="logo_url"
                value={formData.logo_url}
                onChange={(e) => handleInputChange('logo_url', e.target.value)}
                placeholder="https://example.com/logo.png"
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                disabled={loading}
              />
              <p className="text-gray-500 text-xs mt-1">
                Add your restaurant logo to the center of the QR code
              </p>
            </div>

            <div>
              <label htmlFor="template_id" className="block text-sm font-medium text-gray-300 mb-2">
                Template ID (optional)
              </label>
              <input
                type="text"
                id="template_id"
                value={formData.template_id}
                onChange={(e) => handleInputChange('template_id', e.target.value)}
                placeholder="food_standard"
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                disabled={loading}
              />
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <p className="text-blue-400 text-sm">
                <strong>Note:</strong> Updating this QR code will generate a new version with your changes. 
                The QR data and functionality will remain the same.
              </p>
            </div>

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
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
      </Card>
    </div>
  )
}