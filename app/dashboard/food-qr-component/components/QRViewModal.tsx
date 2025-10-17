// components/QRViewModal.tsx
import React, { useState, useEffect } from 'react'
import { X, Download, QrCode, Calendar, BarChart3, Eye, Link, Monitor, Menu, Settings, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useTheme } from '@/hooks/useTheme'
import { foodQRService } from '@/lib/food-qr'
import type { QRCodeResponse } from '@/src/api/generated/models/QRCodeResponse'

interface QRViewModalProps {
  isOpen: boolean
  onClose: () => void
  qrCode: QRCodeResponse | null
  onDownload: (qrCode: QRCodeResponse) => void
}

export default function QRViewModal({ isOpen, onClose, qrCode, onDownload }: QRViewModalProps) {
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [imageData, setImageData] = useState<string | null>(null)
  const [imageLoading, setImageLoading] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch image data when modal opens
  useEffect(() => {
    if (isOpen && qrCode) {
      fetchImageData()
    }
  }, [isOpen, qrCode])

  const fetchImageData = async () => {
    if (!qrCode) return
    
    try {
      setImageLoading(true)
      setImageError(null)
      
      // Check if image is already available in the QR code object
      if ((qrCode as any).qr_image) {
        console.log('📷 Using existing qr_image from QR code object')
        setImageData((qrCode as any).qr_image)
        return
      }
      
      // Otherwise, fetch from API using either qr_id or id
      const qrId = (qrCode as any).qr_id || (qrCode as any).id
      if (!qrId) {
        throw new Error('No QR ID available')
      }
      
      const imageResponse = await foodQRService.getQRImage(qrId)
      setImageData(imageResponse)
    } catch (error) {
      console.error('Failed to fetch QR image:', error)
      setImageError('Failed to load QR code image')
    } finally {
      setImageLoading(false)
    }
  }

  if (!isOpen || !qrCode || !themeLoaded || !mounted) return null

  // Theme variables matching MainPanel
  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const textTertiary = isDark ? 'text-gray-500' : 'text-gray-500'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'
  const hoverBg = isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-100'
  const iconBg = isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'
  const borderColor = isDark ? 'border-gray-700/50' : 'border-gray-200'
  const codeBlockBg = isDark ? 'bg-[#0f0f0f]' : 'bg-gray-100'

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleDownload = () => {
    onDownload(qrCode)
  }

  const getTypeIcon = () => {
    switch (qrCode.type) {
      case 'table': return Monitor
      case 'menu_item': return Menu
      case 'menu_category': return Menu
      case 'order': return Settings
      case 'business': return Monitor
      default: return QrCode
    }
  }

  const getTypeColor = () => {
    switch (qrCode.type) {
      case 'table': return 'from-blue-500 to-blue-600'
      case 'menu_item': return 'from-green-500 to-green-600'
      case 'menu_category': return 'from-yellow-500 to-yellow-600'
      case 'order': return 'from-purple-500 to-purple-600'
      case 'business': return 'from-indigo-500 to-indigo-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getTypeName = () => {
    switch (qrCode.type) {
      case 'table':
        return `Table ${qrCode.target_id}`
      case 'menu_item':
        return 'Menu Item QR'
      case 'menu_category':
        return 'Menu Category QR'
      case 'order':
        return 'Order QR'
      case 'business':
        return 'Business QR'
      default:
        return 'QR Code'
    }
  }

  const parseQRData = () => {
    try {
      return JSON.parse(qrCode.qr_data)
    } catch {
      return { raw_data: qrCode.qr_data }
    }
  }

  const qrData = parseQRData()
  const TypeIcon = getTypeIcon()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className={`${cardBg} border shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto transition-colors duration-300`}
        style={{ borderRadius: '1.5rem' }}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 flex items-center justify-center bg-gradient-to-r ${getTypeColor()} group-hover:scale-110 transition-transform`}
                style={{ borderRadius: '0.75rem' }}>
                <TypeIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${textPrimary}`}>{getTypeName()}</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-xs px-2 py-1 font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    style={{ borderRadius: '9999px' }}>
                    {qrCode.type}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 ${textSecondary} ${hoverBg} ${textPrimary} transition-all duration-200`}
              style={{ borderRadius: '0.5rem' }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold ${textPrimary}`}>QR Code Preview</h3>
              <div className="bg-white p-6 flex items-center justify-center"
                style={{ borderRadius: '1rem' }}>
                {imageLoading ? (
                  <div className="flex flex-col items-center space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
                    <span className="text-sm text-gray-500">Loading QR code...</span>
                  </div>
                ) : imageError ? (
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 text-sm">{imageError}</span>
                    </div>
                    <button
                      onClick={fetchImageData}
                      className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                ) : imageData ? (
                  <img 
                    src={imageData.startsWith('data:') ? imageData : `data:image/png;base64,${imageData}`}
                    alt={`QR Code for ${getTypeName()}`}
                    className="w-64 h-64 object-contain"
                  />
                ) : (
                  <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-sm">No image available</span>
                  </div>
                )}
              </div>
              <button
                onClick={handleDownload}
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 flex items-center justify-center space-x-2"
                style={{ borderRadius: '0.75rem' }}
              >
                <Download className="w-4 h-4" />
                <span>Download QR Code</span>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className={`text-lg font-semibold ${textPrimary} mb-4`}>Details</h3>
                
                <div className="space-y-3">
                  <div className={`flex items-center justify-between py-2 border-b ${borderColor}`}>
                    <div className={`flex items-center space-x-2 ${textSecondary}`}>
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Created</span>
                    </div>
                    <span className={`${textPrimary} text-sm`}>{formatDate(qrCode.created_at)}</span>
                  </div>

                  <div className={`flex items-center justify-between py-2 border-b ${borderColor}`}>
                    <div className={`flex items-center space-x-2 ${textSecondary}`}>
                      <QrCode className="w-4 h-4" />
                      <span className="text-sm">QR ID</span>
                    </div>
                    <span className={`${textPrimary} text-sm font-mono`}>{(qrCode as any).qr_id || (qrCode as any).id}</span>
                  </div>

                  <div className={`flex items-center justify-between py-2 border-b ${borderColor}`}>
                    <div className={`flex items-center space-x-2 ${textSecondary}`}>
                      <Settings className="w-4 h-4" />
                      <span className="text-sm">Target ID</span>
                    </div>
                    <span className={`${textPrimary} text-sm font-mono`}>{qrCode.target_id}</span>
                  </div>

                  {qrCode.expires_at && (
                    <div className={`flex items-center justify-between py-2 border-b ${borderColor}`}>
                      <div className={`flex items-center space-x-2 ${textSecondary}`}>
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Expires</span>
                      </div>
                      <span className={`${textPrimary} text-sm`}>{formatDate(qrCode.expires_at)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className={`text-sm ${textSecondary} block mb-2`}>QR Code Content</label>
                <div className={`${innerCardBg} p-4 space-y-2`}
                  style={{ borderRadius: '0.75rem' }}>
                  {qrCode.qr_url && (
                    <div className="flex items-start space-x-2">
                      <Link className={`w-4 h-4 ${textSecondary} mt-0.5 flex-shrink-0`} />
                      <div>
                        <div className={`text-xs ${textSecondary}`}>URL:</div>
                        <a 
                          href={qrCode.qr_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-400 hover:text-blue-300 break-all underline"
                        >
                          {qrCode.qr_url}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-3">
                    <div className={`text-xs ${textSecondary} mb-1`}>QR Data:</div>
                    <code className={`text-xs ${textPrimary} break-all block font-mono ${codeBlockBg} p-2`}
                      style={{ borderRadius: '0.375rem' }}>
                      {qrCode.qr_data}
                    </code>
                  </div>
                </div>
              </div>

              <div>
                <label className={`text-sm ${textSecondary} block mb-2`}>Business ID</label>
                <div className={`${innerCardBg} p-3`}
                  style={{ borderRadius: '0.75rem' }}>
                  <code className={`text-sm ${textPrimary} font-mono`}>
                    {qrCode.business_id}
                  </code>
                </div>
              </div>
            </div>
          </div>

          <div className={`flex items-center justify-end space-x-3 mt-6 pt-6 border-t ${borderColor}`}>
            <button
              onClick={onClose}
              className={`px-4 py-2 ${innerCardBg} ${textSecondary} ${hoverBg} ${textPrimary} transition-all duration-200`}
              style={{ borderRadius: '0.75rem' }}
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 flex items-center space-x-2"
              style={{ borderRadius: '0.75rem' }}
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}