// components/QRCodeCard.tsx

import React from 'react'
import { Download, Eye, QrCode, Calendar, BarChart3, Monitor, Menu, Settings, Edit } from 'lucide-react'
import { Card } from '@/components/ui/card'
import type { QRCode } from '@/lib/food-qr'

interface QRCodeCardProps {
  qrCode: QRCode
  onDownload: (qrCode: QRCode) => void
  onView: (qrCode: QRCode) => void
  onEdit?: (qrCode: QRCode) => void
}

export default function QRCodeCard({ qrCode, onDownload, onView, onEdit }: QRCodeCardProps) {
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

  const getTypeIcon = () => {
    switch (qrCode.type) {
      case 'TABLE':
        return Monitor
      case 'MENU':
        return Menu
      case 'CUSTOM':
        return Settings
      default:
        return QrCode
    }
  }

  const getTypeColor = () => {
    switch (qrCode.type) {
      case 'TABLE':
        return 'from-blue-500 to-blue-600'
      case 'MENU':
        return 'from-green-500 to-green-600'
      case 'CUSTOM':
        return 'from-purple-500 to-purple-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const getTypeName = () => {
    switch (qrCode.type) {
      case 'TABLE':
        return qrCode.table_id ? `Table ${qrCode.table_id}` : 'Table QR'
      case 'MENU':
        return 'Menu QR'
      case 'CUSTOM':
        return 'Custom QR'
      default:
        return 'QR Code'
    }
  }

  const TypeIcon = getTypeIcon()

  return (
    <Card 
      className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6 hover:border-purple-500/30 transition-all duration-300 cursor-pointer group"
      onClick={() => onView(qrCode)}
    >
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