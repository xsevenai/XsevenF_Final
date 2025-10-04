// components/QRViewModal.tsx
import React, { useState, useEffect } from 'react'
import { X, Download, QrCode, Calendar, BarChart3, Eye, Link, Monitor, Menu, Settings } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useTheme } from '@/hooks/useTheme'
import type { QRCode } from '@/lib/food-qr'

interface QRViewModalProps {
  isOpen: boolean
  onClose: () => void
  qrCode: QRCode | null
  onDownload: (qrCode: QRCode) => void
}

export default function QRViewModal({ isOpen, onClose, qrCode, onDownload }: QRViewModalProps) {
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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
      case 'TABLE': return Monitor
      case 'MENU': return Menu
      case 'CUSTOM': return Settings
      default: return QrCode
    }
  }

  const getTypeColor = () => {
    switch (qrCode.type) {
      case 'TABLE': return 'from-blue-500 to-blue-600'
      case 'MENU': return 'from-green-500 to-green-600'
      case 'CUSTOM': return 'from-purple-500 to-purple-600'
      default: return 'from-gray-500 to-gray-600'
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

  const parseQRData = () => {
    try {
      return JSON.parse(qrCode.data)
    } catch {
      return { raw_data: qrCode.data }
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
                <img 
                  src={`data:image/png;base64,${qrCode.image_base64}`}
                  alt={`QR Code for ${getTypeName()}`}
                  className="w-64 h-64 object-contain"
                />
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
                      <span className="text-sm">Size</span>
                    </div>
                    <span className={`${textPrimary} text-sm`}>{qrCode.size} x {qrCode.size} pixels</span>
                  </div>

                  <div className={`flex items-center justify-between py-2 border-b ${borderColor}`}>
                    <div className={`flex items-center space-x-2 ${textSecondary}`}>
                      <div className={`w-4 h-4 rounded border ${isDark ? 'border-gray-400' : 'border-gray-300'}`} style={{ backgroundColor: qrCode.color }}></div>
                      <span className="text-sm">Foreground</span>
                    </div>
                    <span className={`${textPrimary} text-sm font-mono`}>{qrCode.color}</span>
                  </div>

                  <div className={`flex items-center justify-between py-2 border-b ${borderColor}`}>
                    <div className={`flex items-center space-x-2 ${textSecondary}`}>
                      <div className={`w-4 h-4 rounded border ${isDark ? 'border-gray-400' : 'border-gray-300'}`} style={{ backgroundColor: qrCode.background_color }}></div>
                      <span className="text-sm">Background</span>
                    </div>
                    <span className={`${textPrimary} text-sm font-mono`}>{qrCode.background_color}</span>
                  </div>

                  {qrCode.scan_count !== undefined && (
                    <div className={`flex items-center justify-between py-2 border-b ${borderColor}`}>
                      <div className={`flex items-center space-x-2 ${textSecondary}`}>
                        <BarChart3 className="w-4 h-4" />
                        <span className="text-sm">Total Scans</span>
                      </div>
                      <span className={`${textPrimary} text-sm`}>{qrCode.scan_count}</span>
                    </div>
                  )}

                  {qrCode.last_scanned_at && (
                    <div className={`flex items-center justify-between py-2 border-b ${borderColor}`}>
                      <div className={`flex items-center space-x-2 ${textSecondary}`}>
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">Last Scan</span>
                      </div>
                      <span className={`${textPrimary} text-sm`}>{formatDate(qrCode.last_scanned_at)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className={`text-sm ${textSecondary} block mb-2`}>QR Code Content</label>
                <div className={`${innerCardBg} p-4 space-y-2`}
                  style={{ borderRadius: '0.75rem' }}>
                  {qrData.url && (
                    <div className="flex items-start space-x-2">
                      <Link className={`w-4 h-4 ${textSecondary} mt-0.5 flex-shrink-0`} />
                      <div>
                        <div className={`text-xs ${textSecondary}`}>URL:</div>
                        <a 
                          href={qrData.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-400 hover:text-blue-300 break-all underline"
                        >
                          {qrData.url}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {qrData.business_name && (
                    <div className="text-sm">
                      <span className={`${textSecondary}`}>Business:</span>
                      <span className={`${textPrimary} ml-2`}>{qrData.business_name}</span>
                    </div>
                  )}
                  
                  {qrData.table_number && (
                    <div className="text-sm">
                      <span className={`${textSecondary}`}>Table:</span>
                      <span className={`${textPrimary} ml-2`}>{qrData.table_number}</span>
                    </div>
                  )}
                  
                  {qrData.timestamp && (
                    <div className="text-sm">
                      <span className={`${textSecondary}`}>Generated:</span>
                      <span className={`${textPrimary} ml-2`}>{formatDate(qrData.timestamp)}</span>
                    </div>
                  )}

                  {qrData.raw_data && (
                    <div className="mt-3">
                      <div className={`text-xs ${textSecondary} mb-1`}>Raw Data:</div>
                      <code className={`text-xs ${textPrimary} break-all block font-mono ${codeBlockBg} p-2`}
                        style={{ borderRadius: '0.375rem' }}>
                        {qrData.raw_data}
                      </code>
                    </div>
                  )}
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