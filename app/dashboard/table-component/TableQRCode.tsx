// app/dashboard/table-components/TableQRCode.tsx

"use client"

import { useState, useEffect } from "react"
import { QrCode, Download, Loader2, X, Palette, Move, AlertCircle, CheckCircle, Copy } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useTheme } from "@/hooks/useTheme"
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
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
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

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isOpen || !themeLoaded || !mounted) return null

  // Theme variables matching MainPanel
  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const textTertiary = isDark ? 'text-gray-500' : 'text-gray-500'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'
  const inputBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-white border-gray-300'
  const hoverBg = isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-100'
  const borderColor = isDark ? 'border-gray-700/50' : 'border-gray-200'
  const infoCardBg = isDark ? 'bg-[#1a1a1a]' : 'bg-gray-100'
  const urlDisplayBg = isDark ? 'bg-[#0f0f0f]' : 'bg-gray-200'

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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className={`${cardBg} border shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto transition-colors duration-300`}
        style={{ borderRadius: '1.5rem' }}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${borderColor}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <QrCode className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${textPrimary}`}>Table {tableNumber} QR Code</h2>
              <p className={`${textSecondary} text-sm`}>Generate and customize QR code for this table</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 ${hoverBg} transition-colors`}
            style={{ borderRadius: '0.5rem' }}
          >
            <X className={`h-5 w-5 ${textSecondary}`} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customization Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Size */}
            <div>
              <label className={`block text-sm font-medium ${textPrimary} mb-2`}>
                <Move className="h-4 w-4 inline mr-2" />
                Size (px)
              </label>
              <input
                type="number"
                min="64"
                max="2048"
                value={options.size}
                onChange={(e) => updateOption('size', parseInt(e.target.value) || 256)}
                className={`w-full px-3 py-2 ${inputBg} border ${textPrimary} focus:ring-2 focus:ring-purple-500/50`}
                style={{ borderRadius: '0.5rem' }}
              />
            </div>

            {/* Color */}
            <div>
              <label className={`block text-sm font-medium ${textPrimary} mb-2`}>
                <Palette className="h-4 w-4 inline mr-2" />
                QR Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={options.color}
                  onChange={(e) => updateOption('color', e.target.value)}
                  className={`w-12 h-10 border ${inputBg}`}
                  style={{ borderRadius: '0.25rem' }}
                />
                <input
                  type="text"
                  value={options.color}
                  onChange={(e) => updateOption('color', e.target.value)}
                  className={`flex-1 px-3 py-2 ${inputBg} border ${textPrimary} focus:ring-2 focus:ring-purple-500/50`}
                  style={{ borderRadius: '0.5rem' }}
                  placeholder="#000000"
                />
              </div>
            </div>

            {/* Background Color */}
            <div>
              <label className={`block text-sm font-medium ${textPrimary} mb-2`}>
                <Palette className="h-4 w-4 inline mr-2" />
                Background
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={options.background_color}
                  onChange={(e) => updateOption('background_color', e.target.value)}
                  className={`w-12 h-10 border ${inputBg}`}
                  style={{ borderRadius: '0.25rem' }}
                />
                <input
                  type="text"
                  value={options.background_color}
                  onChange={(e) => updateOption('background_color', e.target.value)}
                  className={`flex-1 px-3 py-2 ${inputBg} border ${textPrimary} focus:ring-2 focus:ring-purple-500/50`}
                  style={{ borderRadius: '0.5rem' }}
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
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:opacity-50 text-white transition-colors"
              style={{ borderRadius: '0.5rem' }}
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
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20"
              style={{ borderRadius: '0.5rem' }}>
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* QR Code Display */}
          {qrData && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="inline-block p-4 bg-white shadow-lg"
                  style={{ borderRadius: '0.75rem' }}>
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
              <div className={`${infoCardBg} p-4 space-y-3`}
                style={{ borderRadius: '0.5rem' }}>
                <div className="flex items-center justify-between">
                  <span className={`${textSecondary} text-sm`}>Table URL:</span>
                  <button
                    onClick={copyTableURL}
                    className={`flex items-center gap-2 px-3 py-1 ${innerCardBg} ${hoverBg} ${textPrimary} text-sm transition-colors`}
                    style={{ borderRadius: '0.25rem' }}
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
                
                <div className={`${textPrimary} text-sm break-all ${urlDisplayBg} p-3`}
                  style={{ borderRadius: '0.25rem' }}>
                  {qrData.qr_code.url}
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className={`${textSecondary}`}>Size:</span>
                    <div className={`${textPrimary}`}>{qrData.qr_code.size}px</div>
                  </div>
                  <div>
                    <span className={`${textSecondary}`}>Color:</span>
                    <div className="flex items-center gap-2">
                      <div 
                        className={`w-4 h-4 border ${isDark ? 'border-gray-600' : 'border-gray-300'}`}
                        style={{ 
                          backgroundColor: qrData.qr_code.color,
                          borderRadius: '0.125rem'
                        }}
                      />
                      <span className={`${textPrimary}`}>{qrData.qr_code.color}</span>
                    </div>
                  </div>
                  <div>
                    <span className={`${textSecondary}`}>Background:</span>
                    <div className="flex items-center gap-2">
                      <div 
                        className={`w-4 h-4 border ${isDark ? 'border-gray-600' : 'border-gray-300'}`}
                        style={{ 
                          backgroundColor: qrData.qr_code.background_color,
                          borderRadius: '0.125rem'
                        }}
                      />
                      <span className={`${textPrimary}`}>{qrData.qr_code.background_color}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <div className="flex justify-center">
                <button
                  onClick={downloadQRCode}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white transition-colors"
                  style={{ borderRadius: '0.5rem' }}
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