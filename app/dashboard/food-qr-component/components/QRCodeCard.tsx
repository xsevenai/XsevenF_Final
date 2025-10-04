// components/QRCodeCard.tsx
import React, { useState, useEffect } from 'react'
import { Download, Eye, QrCode, Calendar, BarChart3, Monitor, Menu, Settings, Edit, Trash2, AlertTriangle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useTheme } from '@/hooks/useTheme'
import type { QRCode } from '@/lib/food-qr'

interface QRCodeCardProps {
  qrCode: QRCode
  onDownload: (qrCode: QRCode) => void
  onView: (qrCode: QRCode) => void
  onEdit?: (qrCode: QRCode) => void
  onDelete?: (qrCode: QRCode) => void
}

export default function QRCodeCard({ qrCode, onDownload, onView, onEdit, onDelete }: QRCodeCardProps) {
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!themeLoaded || !mounted) {
    return null
  }

  // Theme variables matching MainPanel
  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const textTertiary = isDark ? 'text-gray-500' : 'text-gray-500'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'
  const hoverBorder = isDark ? 'hover:border-purple-500/30' : 'hover:border-purple-400/50'
  const iconBg = isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'
  const overlayBg = isDark ? 'bg-black/80' : 'bg-black/50'

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDownload(qrCode)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit?.(qrCode)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.(qrCode)
    setShowDeleteConfirm(false)
  }

  const handleDeleteCancel = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDeleteConfirm(false)
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
      case 'TABLE': return qrCode.table_id ? `Table ${qrCode.table_id}` : 'Table QR'
      case 'MENU': return 'Menu QR'
      case 'CUSTOM': return 'Custom QR'
      default: return 'QR Code'
    }
  }

  const TypeIcon = getTypeIcon()

  return (
    <Card 
      className={`${cardBg} border shadow-lg p-6 ${hoverBorder} hover:shadow-xl transition-all duration-300 cursor-pointer group relative`}
      style={{ borderRadius: '1.5rem' }}
      onClick={() => onView(qrCode)}
    >
      {/* Delete Confirmation Overlay */}
      {showDeleteConfirm && (
        <div className={`absolute inset-0 ${overlayBg} backdrop-blur-sm flex items-center justify-center z-10`}
          style={{ borderRadius: '1.5rem' }}>
          <div className={`${cardBg} border border-red-500/50 p-4 max-w-xs mx-4`}
            style={{ borderRadius: '1rem' }}>
            <div className="flex items-center space-x-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h3 className={`${textPrimary} font-semibold`}>Delete QR Code</h3>
            </div>
            <p className={`${textSecondary} text-sm mb-4`}>
              Are you sure you want to delete this QR code? This action cannot be undone.
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDeleteCancel}
                className={`flex-1 px-3 py-2 ${innerCardBg} ${textSecondary} hover:bg-opacity-70 transition-all duration-200 text-sm`}
                style={{ borderRadius: '0.5rem' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 text-sm"
                style={{ borderRadius: '0.5rem' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 flex items-center justify-center bg-gradient-to-r ${getTypeColor()} group-hover:scale-110 transition-transform`}
            style={{ borderRadius: '0.75rem' }}>
            <TypeIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className={`${textPrimary} font-semibold text-lg`}>{getTypeName()}</h3>
            <div className="flex items-center space-x-2">
              <span className="text-xs px-2 py-1 font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30"
                style={{ borderRadius: '9999px' }}>
                {qrCode.type}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {onEdit && (
            <button
              onClick={handleEdit}
              className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 transition-all duration-200"
              style={{ borderRadius: '0.5rem' }}
              title="Edit QR Code"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleDownload}
            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all duration-200"
            style={{ borderRadius: '0.5rem' }}
            title="Download QR Code"
          >
            <Download className="w-4 h-4" />
          </button>
          {onDelete && (
            <button
              onClick={handleDeleteClick}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
              style={{ borderRadius: '0.5rem' }}
              title="Delete QR Code"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* QR Code Preview */}
      <div className="mb-4 bg-white p-3 flex items-center justify-center"
        style={{ borderRadius: '0.75rem' }}>
        <img 
          src={`data:image/png;base64,${qrCode.image_base64}`}
          alt={`QR Code for ${getTypeName()}`}
          className="w-20 h-20 object-contain"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className={`flex items-center space-x-2 ${textSecondary}`}>
            <Calendar className="w-4 h-4" />
            <span>Created</span>
          </div>
          <span className={`${textPrimary}`}>{formatDate(qrCode.created_at)}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className={`flex items-center space-x-2 ${textSecondary}`}>
            <QrCode className="w-4 h-4" />
            <span>Size</span>
          </div>
          <span className={`${textPrimary}`}>{qrCode.size}px</span>
        </div>

        {qrCode.scan_count !== undefined && (
          <div className="flex items-center justify-between text-sm">
            <div className={`flex items-center space-x-2 ${textSecondary}`}>
              <BarChart3 className="w-4 h-4" />
              <span>Scans</span>
            </div>
            <span className={`${textPrimary}`}>{qrCode.scan_count}</span>
          </div>
        )}

        {qrCode.last_scanned_at && (
          <div className="flex items-center justify-between text-sm">
            <div className={`flex items-center space-x-2 ${textSecondary}`}>
              <Eye className="w-4 h-4" />
              <span>Last Scan</span>
            </div>
            <span className={`${textPrimary}`}>{formatDate(qrCode.last_scanned_at)}</span>
          </div>
        )}
      </div>

      <div className={`mt-4 pt-4 border-t ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <span className={`text-xs ${textTertiary}`}>Business ID</span>
          <span className={`text-xs ${textSecondary} font-mono truncate max-w-32`}>
            {qrCode.business_id}
          </span>
        </div>
      </div>
    </Card>
  )
}