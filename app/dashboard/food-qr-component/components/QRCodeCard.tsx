// components/QRCodeCard.tsx
import React, { useState } from 'react'
import { Download, Eye, QrCode, Calendar, BarChart3, Monitor, Menu, Settings, Edit, Trash2, AlertTriangle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import type { QRCode } from '@/lib/food-qr'

interface QRCodeCardProps {
  qrCode: QRCode
  onDownload: (qrCode: QRCode) => void
  onView: (qrCode: QRCode) => void
  onEdit?: (qrCode: QRCode) => void
  onDelete?: (qrCode: QRCode) => void
}

export default function QRCodeCard({ qrCode, onDownload, onView, onEdit, onDelete }: QRCodeCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

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
      className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6 hover:border-purple-500/30 transition-all duration-300 cursor-pointer group relative"
      onClick={() => onView(qrCode)}
    >
      {/* Delete Confirmation Overlay */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
          <div className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border border-red-500/50 rounded-lg p-4 max-w-xs mx-4">
            <div className="flex items-center space-x-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h3 className="text-white font-semibold">Delete QR Code</h3>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Are you sure you want to delete this QR code? This action cannot be undone.
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDeleteCancel}
                className="flex-1 px-3 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 hover:text-white transition-all duration-200 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-r ${getTypeColor()}`}>
            <TypeIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">{getTypeName()}</h3>
            <div className="flex items-center space-x-2">
              <span className="text-xs px-2 py-1 rounded-full font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {qrCode.type}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {onEdit && (
            <button
              onClick={handleEdit}
              className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition-all duration-200"
              title="Edit QR Code"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleDownload}
            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
            title="Download QR Code"
          >
            <Download className="w-4 h-4" />
          </button>
          {onDelete && (
            <button
              onClick={handleDeleteClick}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200"
              title="Delete QR Code"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* QR Code Preview */}
      <div className="mb-4 bg-white p-3 rounded-lg flex items-center justify-center">
        <img 
          src={`data:image/png;base64,${qrCode.image_base64}`}
          alt={`QR Code for ${getTypeName()}`}
          className="w-20 h-20 object-contain"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>Created</span>
          </div>
          <span className="text-gray-300">{formatDate(qrCode.created_at)}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gray-400">
            <QrCode className="w-4 h-4" />
            <span>Size</span>
          </div>
          <span className="text-gray-300">{qrCode.size}px</span>
        </div>

        {qrCode.scan_count !== undefined && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-400">
              <BarChart3 className="w-4 h-4" />
              <span>Scans</span>
            </div>
            <span className="text-gray-300">{qrCode.scan_count}</span>
          </div>
        )}

        {qrCode.last_scanned_at && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-400">
              <Eye className="w-4 h-4" />
              <span>Last Scan</span>
            </div>
            <span className="text-gray-300">{formatDate(qrCode.last_scanned_at)}</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700/50">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Business ID</span>
          <span className="text-xs text-gray-400 font-mono truncate max-w-32">
            {qrCode.business_id}
          </span>
        </div>
      </div>
    </Card>
  )
}