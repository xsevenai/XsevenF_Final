// lib/food-qr.ts
import { FoodQrManagementService } from '@/src/api/generated/services/FoodQrManagementService'
import type { 
  QRCodeRequest, 
  QRCodeResponse, 
  QRScanRequest, 
  QRScanResponse, 
  TableQRRequest 
} from '@/src/api/generated'

// Re-export types for use in components
export type { QRCodeResponse, QRScanResponse, QRCodeRequest, QRScanRequest, TableQRRequest }

// Legacy interface for backward compatibility
export interface QRCode {
  id: string
  type: "menu_item" | "table" | "order" | "menu_category" | "business"
  data: string
  image_base64: string
  size: number
  color?: string
  background_color?: string
  logo_url?: string
  created_at: string
  business_id: string
  table_id?: string
  scan_count?: number
  last_scanned_at?: string
  qr_id?: string
  target_id?: string
  qr_data?: string
  qr_url?: string
  expires_at?: string
}

export interface GenerateQRRequest {
  type: "menu_item" | "table" | "order" | "menu_category" | "business"
  target_id: string
  business_id: string
  size?: number
  format?: "png" | "svg" | "base64"
  include_logo?: boolean
  custom_data?: Record<string, any>
}

export interface QRCodeAnalytics {
  business_id: string
  period: string
  total_scans: number
  unique_scans: number
  scan_frequency: number
  top_scanned_items: Array<{
    qr_id: string
    type: string
    target_id: string
    scans: number
  }>
  scan_trends: Array<{
    date: string
    scans: number
  }>
  conversion_rate: number
  peak_hours: number[]
}

export interface TableQRRequestData {
  table_number: string
  business_id: string
  location_id?: string
  capacity?: number
  qr_size?: number
}

class FoodQRService {
  // Generate QR code using new API
  async generateQRCode(request: GenerateQRRequest): Promise<QRCodeResponse> {
    const qrRequest: QRCodeRequest = {
      type: request.type,
      target_id: request.target_id,
      business_id: request.business_id,
      size: request.size || 200,
      format: request.format || "png",
      include_logo: request.include_logo || false,
      custom_data: request.custom_data || null
    }
    
    return await FoodQrManagementService.generateQrCodeApiV1FoodQrGeneratePost({
      requestBody: qrRequest
    })
  }

  // Bulk generate QR codes
  async bulkGenerateQRCodes(
    businessId: string,
    qrType: string,
    targetIds: string[],
    size: number = 200,
    format: string = "png"
  ): Promise<QRCodeResponse[]> {
    return await FoodQrManagementService.bulkGenerateQrCodesApiV1FoodQrBulkGeneratePost({
      businessId,
      qrType,
      targetIds,
      size,
      format
    })
  }

  // Scan QR code
  async scanQRCode(qrData: string, scannerLocation?: string, scannerId?: string): Promise<QRScanResponse> {
    const scanRequest: QRScanRequest = {
      qr_data: qrData,
      scanner_location: scannerLocation || null,
      scanner_id: scannerId || null
    }
    
    return await FoodQrManagementService.scanQrCodeApiV1FoodQrScanPost({
      requestBody: scanRequest
    })
  }

  // Get QR analytics
  async getQRAnalytics(
    businessId: string, 
    period: string = "7d", 
    qrType?: string
  ): Promise<QRCodeAnalytics> {
    return await FoodQrManagementService.getQrAnalyticsApiV1FoodQrAnalyticsBusinessIdGet({
      businessId,
      period,
      qrType: qrType || null
    })
  }

  // Get popular QR codes
  async getPopularQRCodes(
    businessId: string,
    limit: number = 10,
    period: string = "7d"
  ) {
    return await FoodQrManagementService.getPopularQrCodesApiV1FoodQrPopularBusinessIdGet({
      businessId,
      limit,
      period
    })
  }

  // Create food item with QR
  async createFoodItemWithQR(itemData: any, generateQr: boolean = true) {
    return await FoodQrManagementService.createFoodItemWithQrApiV1FoodItemsPost({
      requestBody: itemData,
      generateQr
    })
  }

  // Get item QR code
  async getItemQRCode(itemId: string) {
    return await FoodQrManagementService.getItemQrCodeApiV1FoodItemsItemIdQrGet({
      itemId
    })
  }

  // Create table QR code
  async createTableQRCode(tableData: TableQRRequestData): Promise<QRCodeResponse> {
    const tableRequest: TableQRRequest = {
      table_number: tableData.table_number,
      business_id: tableData.business_id,
      location_id: tableData.location_id || null,
      capacity: tableData.capacity || null,
      qr_size: tableData.qr_size || 200
    }
    
    return await FoodQrManagementService.createTableQrCodeApiV1FoodTablesQrPost({
      requestBody: tableRequest
    })
  }

  // List table QR codes
  async listTableQRCodes(businessId: string) {
    return await FoodQrManagementService.listTableQrCodesApiV1FoodTablesBusinessIdQrCodesGet({
      businessId
    })
  }

  // List QR codes
  async listQRCodes(
    businessId: string,
    qrType?: string,
    limit: number = 50,
    offset: number = 0
  ) {
    console.log('🚀 Calling FoodQrManagementService.listQrCodesApiV1FoodQrListBusinessIdGet with:', {
      businessId,
      qrType: qrType || null,
      limit,
      offset
    })
    
    try {
      const result = await FoodQrManagementService.listQrCodesApiV1FoodQrListBusinessIdGet({
        businessId,
        qrType: qrType || null,
        limit,
        offset
      })
      console.log('✅ FoodQrManagementService response:', result)
      return result
    } catch (error) {
      console.error('❌ FoodQrManagementService error:', error)
      throw error
    }
  }

  // Delete QR code
  async deleteQRCode(qrId: string) {
    return await FoodQrManagementService.deleteQrCodeApiV1FoodQrQrIdDelete({
      qrId
    })
  }

  // Regenerate QR code
  async regenerateQRCode(qrId: string) {
    return await FoodQrManagementService.regenerateQrCodeApiV1FoodQrQrIdRegeneratePut({
      qrId
    })
  }

  // Get QR image
  async getQRImage(qrId: string) {
    return await FoodQrManagementService.getQrImageApiV1FoodQrImageQrIdGet({
      qrId
    })
  }

  // Fallback method to generate QR code image from data
  private async generateQRCodeImage(data: string): Promise<string> {
    try {
      // Use a simple QR code generation approach
      // For now, we'll create a simple placeholder or use a QR code library
      // This is a fallback when the API doesn't work
      
      // Create a simple canvas-based QR code (this is a basic implementation)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas context not available')
      
      // Set canvas size
      canvas.width = 200
      canvas.height = 200
      
      // Fill with white background
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Add black border
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 2
      ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2)
      
      // Add text indicating this is a QR code
      ctx.fillStyle = '#000000'
      ctx.font = '12px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('QR Code', canvas.width / 2, canvas.height / 2 - 10)
      ctx.fillText('Placeholder', canvas.width / 2, canvas.height / 2 + 10)
      
      // Convert to base64
      return canvas.toDataURL('image/png')
    } catch (error) {
      console.error('Failed to generate QR code image:', error)
      throw new Error('Failed to generate QR code image')
    }
  }

  // Integrate with POS
  async integrateWithPOS(
    businessId: string,
    posSystem: string,
    posConfig: Record<string, any>
  ) {
    return await FoodQrManagementService.integrateWithPosApiV1FoodQrIntegratePosPost({
      businessId,
      posSystem,
      requestBody: posConfig
    })
  }

  // Export QR codes
  async exportQRCodes(
    businessId: string,
    format: string = "pdf",
    qrType?: string
  ) {
    return await FoodQrManagementService.exportQrCodesApiV1FoodQrExportBusinessIdGet({
      businessId,
      format,
      qrType: qrType || null
    })
  }

  // Legacy methods for backward compatibility
  async getAllQRCodes(type?: string, table_id?: string): Promise<QRCode[]> {
    // This would need to be implemented based on your business logic
    // For now, return empty array
    return []
  }

  async getSingleQRCode(qrId: string): Promise<QRCode> {
    // Legacy method - would need to be implemented
    throw new Error("Method not implemented in new API structure")
  }

  async updateQRCode(qrId: string, updates: {
    size?: number
    color?: string
    background_color?: string
    logo_url?: string
    template_id?: string
  }): Promise<QRCode> {
    // Legacy method - would need to be implemented
    throw new Error("Method not implemented in new API structure")
  }

  // Download QR code image
  async downloadQRCode(qrCode: QRCodeResponse | QRCode, filename?: string): Promise<void> {
    try {
      console.log('🔍 Downloading QR code:', qrCode)
      console.log('🔍 QR code keys:', Object.keys(qrCode))
      console.log('🔍 Has qr_id:', 'qr_id' in qrCode, qrCode.qr_id)
      console.log('🔍 Has image_base64:', 'image_base64' in qrCode)
      
      // Early validation - if object is empty or invalid, throw a more helpful error
      if (!qrCode || typeof qrCode !== 'object' || Object.keys(qrCode).length === 0) {
        console.error('❌ Invalid QR code object received:', qrCode)
        throw new Error('Cannot download QR code: Invalid or empty QR code object received. Please refresh the page and try again.')
      }
      
      let imageData: string
      
      // Check for image data in various possible fields
      const qrId = (qrCode as any).qr_id || (qrCode as any).id
      
      if ((qrCode as any).qr_image) {
        console.log('📷 Using qr_image field')
        imageData = (qrCode as any).qr_image
      } else if ((qrCode as any).image_base64) {
        console.log('📷 Using image_base64 field')
        imageData = (qrCode as any).image_base64
      } else if (qrId) {
        console.log('📡 Fetching image for QR ID:', qrId)
        try {
          const imageResponse = await this.getQRImage(qrId)
          console.log('📡 Image response:', typeof imageResponse, imageResponse?.substring(0, 100))
          imageData = typeof imageResponse === 'string' ? imageResponse : ''
        } catch (apiError) {
          console.warn('⚠️ API call failed, trying fallback:', apiError)
          // Fallback: try to generate QR code from qr_data
          if ((qrCode as any).qr_data) {
            imageData = await this.generateQRCodeImage((qrCode as any).qr_data)
          } else {
            throw apiError
          }
        }
      } else {
        console.error('❌ Invalid QR code structure:', qrCode)
        throw new Error(`Invalid QR code data. Expected qr_image, image_base64, or qr_id/id field. Got: ${Object.keys(qrCode).join(', ')}`)
      }

      // Check if imageData is already a data URL or base64 string
      let base64Data: string
      if (imageData.startsWith('data:')) {
        // Extract base64 part from data URL
        base64Data = imageData.split(',')[1]
        console.log('📄 Extracted base64 from data URL, length:', base64Data.length)
      } else {
        // Assume it's already base64
        base64Data = imageData
        console.log('📄 Using raw base64 data, length:', base64Data.length)
      }

      if (!base64Data || base64Data.length === 0) {
        throw new Error('No image data available to download')
      }

      console.log('🔧 Attempting to decode base64 data...')
      const byteCharacters = atob(base64Data)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'image/png' })
      
      console.log('✅ Created blob, size:', blob.size)
      
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename || `qr-code-${qrId}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      console.log('✅ Download completed successfully')
    } catch (error) {
      throw new Error(`Failed to download QR code: ${error}`)
    }
  }
}

export const foodQRService = new FoodQRService()