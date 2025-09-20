// app/dashboard/table-components/TableQRCode.tsx

"use client"

import { useState } from "react"
import { QrCode, Download, Loader2, X, Palette, Move, AlertCircle, CheckCircle, Copy } from "lucide-react"
import { Card } from "@/components/ui/card"
import { tablesApi } from "@/lib/tables-api"

interface TableQRCodeProps {
  tableId: string
  tableNumber: number
  isOpen: boolean
  onClose: () => void
}

interface QRCodeData {
  table_id: number
  table_number: string
  qr_code: {
    id: string
    image_base64: string
    data: string
    size: number
    color: string
    background_color: string
    url: string
  }
}

export default function TableQRCode({ tableId, tableNumber, isOpen, onClose }: TableQRCodeProps) {
  const [qrData, setQrData] = useState<QRCodeData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  
  // QR Code customization options
  const [options, setOptions] = useState({
    size: 256,
    color: '#000000',
    background_color: '#FFFFFF'
  })

  // Generate QR Code
  const generateQRCode = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await tablesApi.getTableQRCode(tableId, options)
      setQrData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate QR code')
    } finally {
      setLoading(false)
    }
  }

  // Download QR Code
  const downloadQRCode = () => {
    if (!qrData) return

    const link = document.createElement('a')
    link.href = `data:image/png;base64,${qrData.qr_code.image_base64}`
    link.download = `table-${tableNumber}-qr-code.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Copy table URL to clipboard
  const copyTableURL = async () => {
    if (!qrData) return

    try {
      await navigator.clipboard.writeText(qrData.qr_code.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  // Update options and regenerate
  const updateOption = (key: keyof typeof options, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }))
  }

  // Auto-generate QR code when modal opens
  if (isOpen && !qrData && !loading && !error) {
    generateQRCode()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <QrCode className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Table {tableNumber} QR Code</h2>
              <p className="text-gray-400 text-sm">Generate and customize QR code for this table</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customization Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Size */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Move className="h-4 w-4 inline mr-2" />
                Size (px)
              </label>
              <input
                type="number"
                min="64"
                max="2048"
                value={options.size}
                onChange={(e) => updateOption('size', parseInt(e.target.value) || 256)}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Palette className="h-4 w-4 inline mr-2" />
                QR Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={options.color}
                  onChange={(e) => updateOption('color', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-600/50 bg-gray-700/50"
                />
                <input
                  type="text"
                  value={options.color}
                  onChange={(e) => updateOption('color', e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:ring-2 focus:ring-purple-500/50"
                  placeholder="#000000"
                />
              </div>
            </div>

            {/* Background Color */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Palette className="h-4 w-4 inline mr-2" />
                Background
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={options.background_color}
                  onChange={(e) => updateOption('background_color', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-600/50 bg-gray-700/50"
                />
                <input
                  type="text"
                  value={options.background_color}
                  onChange={(e) => updateOption('background_color', e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:ring-2 focus:ring-purple-500/50"
                  placeholder="#FFFFFF"
                />
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex gap-3">
            <button
              onClick={generateQRCode}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <QrCode className="h-4 w-4" />
                  Generate QR Code
                </>
              )}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* QR Code Display */}
          {qrData && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="inline-block p-4 bg-white rounded-xl shadow-lg">
                  <img
                    src={`data:image/png;base64,${qrData.qr_code.image_base64}`}
                    alt={`QR Code for Table ${tableNumber}`}
                    className="block"
                    style={{
                      width: `${Math.min(qrData.qr_code.size, 400)}px`,
                      height: `${Math.min(qrData.qr_code.size, 400)}px`
                    }}
                  />
                </div>
              </div>

              {/* QR Code Info */}
              <div className="bg-gray-700/30 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Table URL:</span>
                  <button
                    onClick={copyTableURL}
                    className="flex items-center gap-2 px-3 py-1 bg-gray-600/50 hover:bg-gray-500/50 text-white rounded text-sm transition-colors"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="h-3 w-3" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copy URL
                      </>
                    )}
                  </button>
                </div>
                
                <div className="text-white text-sm break-all bg-gray-800/50 p-3 rounded">
                  {qrData.qr_code.url}
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Size:</span>
                    <div className="text-white">{qrData.qr_code.size}px</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Color:</span>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded border border-gray-600"
                        style={{ backgroundColor: qrData.qr_code.color }}
                      />
                      <span className="text-white">{qrData.qr_code.color}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400">Background:</span>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded border border-gray-600"
                        style={{ backgroundColor: qrData.qr_code.background_color }}
                      />
                      <span className="text-white">{qrData.qr_code.background_color}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <div className="flex justify-center">
                <button
                  onClick={downloadQRCode}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Download QR Code
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}