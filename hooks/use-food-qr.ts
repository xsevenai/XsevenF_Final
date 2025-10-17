// hooks/use-food-qr.ts
import { useState, useEffect, useCallback } from 'react'
import { foodQRService } from '@/lib/food-qr'
import type { 
  QRCode, 
  GenerateQRRequest, 
  QRCodeResponse, 
  QRCodeAnalytics,
  TableQRRequestData,
  QRScanResponse
} from '@/lib/food-qr'

export const useFoodQR = () => {
  const [qrCodes, setQRCodes] = useState<QRCodeResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [analytics, setAnalytics] = useState<QRCodeAnalytics | null>(null)

  // Fetch QR codes for a business
  const fetchQRCodes = useCallback(async (businessId: string, qrType?: string, limit: number = 50, offset: number = 0) => {
    try {
      setLoading(true)
      setError(null)
      console.log('🔍 Fetching QR codes with params:', { businessId, qrType, limit, offset })
      
      const data = await foodQRService.listQRCodes(businessId, qrType, limit, offset)
      console.log('📊 QR codes response:', data)
      console.log('📊 QR codes response type:', typeof data)
      console.log('📊 QR codes response keys:', Object.keys(data))
      console.log('📊 QR codes array:', data.qr_codes)
      console.log('📊 QR codes array length:', data.qr_codes?.length)
      
      if (data.qr_codes) {
        data.qr_codes.forEach((qr, index) => {
          console.log(`📊 QR code ${index}:`, qr)
          console.log(`📊 QR code ${index} keys:`, Object.keys(qr))
        })
      }
      
      // Filter out any empty or invalid QR code objects
      const validQRCodes = (data.qr_codes || []).filter(qr => {
        const isValid = qr && typeof qr === 'object' && Object.keys(qr).length > 0
        if (!isValid) {
          console.warn('⚠️ Filtering out invalid QR code:', qr)
        }
        return isValid
      })
      
      console.log('📊 Valid QR codes count:', validQRCodes.length)
      setQRCodes(validQRCodes)
    } catch (err) {
      console.error('❌ Error fetching QR codes:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch QR codes')
    } finally {
      setLoading(false)
    }
  }, [])

  // Generate new QR code
  const generateQRCode = useCallback(async (request: GenerateQRRequest) => {
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
  }, [])

  // Bulk generate QR codes
  const bulkGenerateQRCodes = async (
    businessId: string,
    qrType: string,
    targetIds: string[],
    size: number = 200,
    format: string = "png"
  ) => {
    try {
      setLoading(true)
      setError(null)
      const newQRCodes = await foodQRService.bulkGenerateQRCodes(businessId, qrType, targetIds, size, format)
      setQRCodes(prev => [...newQRCodes, ...prev])
      setSuccess(`${newQRCodes.length} QR codes generated successfully!`)
      return newQRCodes
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to bulk generate QR codes')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Scan QR code
  const scanQRCode = async (qrData: string, scannerLocation?: string, scannerId?: string) => {
    try {
      setLoading(true)
      setError(null)
      const scanResult = await foodQRService.scanQRCode(qrData, scannerLocation, scannerId)
      return scanResult
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to scan QR code')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Get QR analytics
  const getQRAnalytics = async (businessId: string, period: string = "7d", qrType?: string) => {
    try {
      setLoading(true)
      setError(null)
      const analyticsData = await foodQRService.getQRAnalytics(businessId, period, qrType)
      setAnalytics(analyticsData)
      return analyticsData
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch QR analytics')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Get popular QR codes
  const getPopularQRCodes = async (businessId: string, limit: number = 10, period: string = "7d") => {
    try {
      setLoading(true)
      setError(null)
      const popularData = await foodQRService.getPopularQRCodes(businessId, limit, period)
      return popularData
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch popular QR codes')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Create food item with QR
  const createFoodItemWithQR = async (itemData: any, generateQr: boolean = true) => {
    try {
      setLoading(true)
      setError(null)
      const result = await foodQRService.createFoodItemWithQR(itemData, generateQr)
      setSuccess('Food item created with QR code successfully!')
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create food item with QR')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Get item QR code
  const getItemQRCode = async (itemId: string) => {
    try {
      setLoading(true)
      setError(null)
      const qrCode = await foodQRService.getItemQRCode(itemId)
      return qrCode
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get item QR code')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Create table QR code
  const createTableQRCode = async (tableData: TableQRRequestData) => {
    try {
      setLoading(true)
      setError(null)
      const qrCode = await foodQRService.createTableQRCode(tableData)
      setQRCodes(prev => [qrCode, ...prev])
      setSuccess('Table QR code created successfully!')
      return qrCode
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create table QR code')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // List table QR codes
  const listTableQRCodes = async (businessId: string) => {
    try {
      setLoading(true)
      setError(null)
      const tableQRCodes = await foodQRService.listTableQRCodes(businessId)
      return tableQRCodes
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to list table QR codes')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Delete QR code
  const deleteQRCode = useCallback(async (qrId: string) => {
    try {
      setLoading(true)
      setError(null)
      await foodQRService.deleteQRCode(qrId)
      setQRCodes(prev => prev.filter(qr => qr.qr_id !== qrId))
      setSuccess('QR code deleted successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete QR code')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Regenerate QR code
  const regenerateQRCode = async (qrId: string) => {
    try {
      setLoading(true)
      setError(null)
      const result = await foodQRService.regenerateQRCode(qrId)
      setSuccess('QR code regenerated successfully!')
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to regenerate QR code')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Get QR image
  const getQRImage = async (qrId: string) => {
    try {
      setLoading(true)
      setError(null)
      const imageData = await foodQRService.getQRImage(qrId)
      return imageData
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get QR image')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Integrate with POS
  const integrateWithPOS = async (
    businessId: string,
    posSystem: string,
    posConfig: Record<string, any>
  ) => {
    try {
      setLoading(true)
      setError(null)
      const result = await foodQRService.integrateWithPOS(businessId, posSystem, posConfig)
      setSuccess('POS integration configured successfully!')
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to integrate with POS')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Export QR codes
  const exportQRCodes = async (
    businessId: string,
    format: string = "pdf",
    qrType?: string
  ) => {
    try {
      setLoading(true)
      setError(null)
      const result = await foodQRService.exportQRCodes(businessId, format, qrType)
      setSuccess('QR codes exported successfully!')
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export QR codes')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Download QR code
  const downloadQRCode = async (qrCode: QRCodeResponse | QRCode, filename?: string) => {
    try {
      setLoading(true)
      setError(null)
      await foodQRService.downloadQRCode(qrCode, filename)
      setSuccess('QR code downloaded successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download QR code')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Clear messages
  const clearMessages = useCallback(() => {
    setError(null)
    setSuccess(null)
  }, [])

  // Refresh QR codes
  const refreshQRCodes = useCallback((businessId: string, qrType?: string) => {
    return fetchQRCodes(businessId, qrType)
  }, [fetchQRCodes])

  return {
    qrCodes,
    loading,
    error,
    success,
    analytics,
    generateQRCode,
    bulkGenerateQRCodes,
    scanQRCode,
    getQRAnalytics,
    getPopularQRCodes,
    createFoodItemWithQR,
    getItemQRCode,
    createTableQRCode,
    listTableQRCodes,
    deleteQRCode,
    regenerateQRCode,
    getQRImage,
    integrateWithPOS,
    exportQRCodes,
    downloadQRCode,
    fetchQRCodes,
    refreshQRCodes,
    clearMessages
  }
}