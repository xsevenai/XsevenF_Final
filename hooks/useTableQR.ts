// hooks/useTableQR.ts

"use client"

import { useState, useCallback } from 'react'
import { tablesApi } from '@/lib/tables-api'

export interface QRCodeOptions {
  size?: number
  color?: string
  background_color?: string
}

export interface QRCodeData {
  table_id: string  // Changed from number to string for UUID
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

export interface UseTableQRReturn {
  qrData: QRCodeData | null
  loading: boolean
  error: string | null
  generateQRCode: (tableId: string, options?: QRCodeOptions) => Promise<void>
  downloadQRCode: (filename?: string) => void
  copyTableURL: () => Promise<boolean>
  clearQRData: () => void
}

export function useTableQR(): UseTableQRReturn {
  const [qrData, setQrData] = useState<QRCodeData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Generate QR Code
  const generateQRCode = useCallback(async (tableId: string, options?: QRCodeOptions) => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await tablesApi.getTableQRCode(tableId, options)
      setQrData(data)
    } catch (err) {
      console.error('Error generating QR code:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate QR code')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Download QR Code as PNG
  const downloadQRCode = useCallback((filename?: string) => {
    if (!qrData) {
      console.warn('No QR data available for download')
      return
    }

    try {
      const link = document.createElement('a')
      link.href = `data:image/png;base64,${qrData.qr_code.image_base64}`
      link.download = filename || `table-${qrData.table_number}-qr-code.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error('Error downloading QR code:', err)
      setError('Failed to download QR code')
    }
  }, [qrData])

  // Copy table URL to clipboard
  const copyTableURL = useCallback(async (): Promise<boolean> => {
    if (!qrData) {
      console.warn('No QR data available for copying URL')
      return false
    }

    try {
      await navigator.clipboard.writeText(qrData.qr_code.url)
      return true
    } catch (err) {
      console.error('Failed to copy URL:', err)
      setError('Failed to copy URL to clipboard')
      return false
    }
  }, [qrData])

  // Clear QR data
  const clearQRData = useCallback(() => {
    setQrData(null)
    setError(null)
  }, [])

  return {
    qrData,
    loading,
    error,
    generateQRCode,
    downloadQRCode,
    copyTableURL,
    clearQRData,
  }
}