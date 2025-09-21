// hooks/use-food-qr.ts

import { useState, useEffect } from 'react'
import { foodQRService } from '@/lib/food-qr'
import type { QRCode, GenerateQRRequest } from '@/lib/food-qr'

export const useFoodQR = () => {
  const [qrCodes, setQRCodes] = useState<QRCode[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Fetch all QR codes
  const fetchQRCodes = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await foodQRService.getAllQRCodes()
      setQRCodes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch QR codes')
    } finally {
      setLoading(false)
    }
  }

  // Generate new QR code
  const generateQRCode = async (request: GenerateQRRequest) => {
    try {
      setLoading(true)
      setError(null)
      const newQRCode = await foodQRService.generateQRCode(request)
      setQRCodes(prev => [newQRCode, ...prev])
      setSuccess('QR code generated successfully!')
      return newQRCode
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate QR code')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Delete QR code
  const deleteQRCode = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await foodQRService.deleteQRCode(id)
      setQRCodes(prev => prev.filter(qr => qr.id !== id))
      setSuccess('QR code deleted successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete QR code')
    } finally {
      setLoading(false)
    }
  }

  // Update QR code
  const updateQRCode = async (qrId: string, updates: {
    size?: number
    color?: string
    background_color?: string
    logo_url?: string
    template_id?: string
  }) => {
    try {
      setLoading(true)
      setError(null)
      const updatedQRCode = await foodQRService.updateQRCode(qrId, updates)
      
      // Update the QR code in the list
      setQRCodes(prev => prev.map(qr => 
        qr.id === qrId ? updatedQRCode : qr
      ))
      
      setSuccess('QR code updated successfully!')
      return updatedQRCode
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update QR code')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Clear messages
  const clearMessages = () => {
    setError(null)
    setSuccess(null)
  }

  // Refresh QR codes (alias for fetchQRCodes for component compatibility)
  const refreshQRCodes = fetchQRCodes

  // Load QR codes on mount
  useEffect(() => {
    fetchQRCodes()
  }, [])

  // Return all the state and functions
  return {
    qrCodes,
    loading,
    error,
    success,
    generateQRCode,
    updateQRCode,
    deleteQRCode,
    refreshQRCodes,
    clearMessages
  }
}