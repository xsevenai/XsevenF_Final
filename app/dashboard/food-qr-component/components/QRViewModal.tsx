// components/QRViewModal.tsx

import React from 'react'
import { X, Download, QrCode, Calendar, BarChart3, Eye, Link, Monitor, Menu, Settings } from 'lucide-react'
import { Card } from '@/components/ui/card'
import type { QRCode } from '@/lib/food-qr'

interface QRViewModalProps {
  isOpen: boolean
  onClose: () => void
  qrCode: QRCode | null
  onDownload: (qrCode: QRCode) => void
}

export default function QRViewModal({ isOpen, onClose, qrCode, onDownload }: QRViewModalProps) {
  if (!isOpen || !qrCode) return null

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
      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-r ${getTypeColor()}`}>
                <TypeIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{getTypeName()}</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-xs px-2 py-1 rounded-full font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {qrCode.type}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* QR Code Display */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">QR Code Preview</h3>
              <div className="bg-white p-6 rounded-lg flex items-center justify-center">
                <img 
                  src={`data:image/png;base64,${qrCode.image_base64}`}
                  alt={`QR Code for ${getTypeName()}`}
                  className="w-64 h-64 object-contain"
                />
              </div>
              <button
                onClick={handleDownload}
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download QR Code</span>
              </button>
            </div>

            {/* QR Code Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Details</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Created</span>
                    </div>
                    <span className="text-gray-300 text-sm">{formatDate(qrCode.created_at)}</span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <QrCode className="w-4 h-4" />
                      <span className="text-sm">Size</span>
                    </div>
                    <span className="text-gray-300 text-sm">{qrCode.size} x {qrCode.size} pixels</span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <div className="w-4 h-4 rounded border border-gray-400" style={{ backgroundColor: qrCode.color }}></div>
                      <span className="text-sm">Foreground</span>
                    </div>
                    <span className="text-gray-300 text-sm font-mono">{qrCode.color}</span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <div className="w-4 h-4 rounded border border-gray-400" style={{ backgroundColor: qrCode.background_color }}></div>
                      <span className="text-sm">Background</span>
                    </div>
                    <span className="text-gray-300 text-sm font-mono">{qrCode.background_color}</span>
                  </div>

                  {qrCode.scan_count !== undefined && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
                      <div className="flex items-center space-x-2 text-gray-400">
                        <BarChart3 className="w-4 h-4" />
                        <span className="text-sm">Total Scans</span>
                      </div>
                      <span className="text-gray-300 text-sm">{qrCode.scan_count}</span>
                    </div>
                  )}

                  {qrCode.last_scanned_at && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">Last Scan</span>
                      </div>
                      <span className="text-gray-300 text-sm">{formatDate(qrCode.last_scanned_at)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Parsed QR Data */}
              <div>
                <label className="text-sm text-gray-400 block mb-2">QR Code Content</label>
                <div className="bg-gray-700/50 p-4 rounded-lg space-y-2">
                  {qrData.url && (
                    <div className="flex items-start space-x-2">
                      <Link className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs text-gray-400">URL:</div>
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
                      <span className="text-gray-400">Business:</span>
                      <span className="text-gray-300 ml-2">{qrData.business_name}</span>
                    </div>
                  )}
                  
                  {qrData.table_number && (
                    <div className="text-sm">
                      <span className="text-gray-400">Table:</span>
                      <span className="text-gray-300 ml-2">{qrData.table_number}</span>
                    </div>
                  )}
                  
                  {qrData.timestamp && (
                    <div className="text-sm">
                      <span className="text-gray-400">Generated:</span>
                      <span className="text-gray-300 ml-2">{formatDate(qrData.timestamp)}</span>
                    </div>
                  )}

                  {qrData.raw_data && (
                    <div className="mt-3">
                      <div className="text-xs text-gray-400 mb-1">Raw Data:</div>
                      <code className="text-xs text-gray-300 break-all block font-mono bg-gray-800/50 p-2 rounded">
                        {qrData.raw_data}
                      </code>
                    </div>
                  )}
                </div>
              </div>

              {/* Business ID */}
              <div>
                <label className="text-sm text-gray-400 block mb-2">Business ID</label>
                <div className="bg-gray-700/50 p-3 rounded-lg">
                  <code className="text-sm text-gray-300 font-mono">
                    {qrCode.business_id}
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-700/50">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 hover:text-white transition-all duration-200"
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 flex items-center space-x-2"
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