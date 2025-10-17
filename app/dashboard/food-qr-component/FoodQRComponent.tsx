// app/dashboard/food-qr-component/FoodQRComponent.tsx
"use client"

import React, { useState, useEffect } from 'react'
import { QrCode, Plus, Search, Filter, X, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useTheme } from "@/hooks/useTheme"
import { useFoodQR } from '@/hooks/use-food-qr'
import { foodQRService } from '@/lib/food-qr'
import QRCodeCard from './components/QRCodeCard'
import GenerateQRModal from './components/GenerateQRModal'
import QRViewModal from './components/QRViewModal'
import type { QRCode, GenerateQRRequest } from '@/lib/food-qr'
import type { QRCodeResponse } from '@/src/api/generated/models/QRCodeResponse'

export default function FoodQRComponent() {
  const [mounted, setMounted] = useState(false)
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()
  
  // Get business ID from localStorage (following the same pattern as other components)
  const businessId = typeof window !== "undefined" ? localStorage.getItem("businessId") || "" : ""
  
  const {
    qrCodes,
    loading,
    error,
    success,
    generateQRCode,
    bulkGenerateQRCodes,
    deleteQRCode,
    fetchQRCodes,
    clearMessages
  } = useFoodQR()

  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedQRCode, setSelectedQRCode] = useState<QRCodeResponse | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'menu_item' | 'table' | 'order' | 'menu_category' | 'business'>('all')

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch QR codes when component mounts and businessId is available
  useEffect(() => {
    if (businessId && mounted) {
      console.log('Fetching QR codes for business:', businessId)
      fetchQRCodes(businessId)
    }
  }, [businessId, mounted, fetchQRCodes])

  // Debug QR codes when they change
  useEffect(() => {
    console.log('📊 QR codes updated:', qrCodes)
    console.log('📊 QR codes length:', qrCodes.length)
    qrCodes.forEach((qr, index) => {
      console.log(`📊 QR code ${index}:`, qr)
    })
  }, [qrCodes])

  if (!themeLoaded || !mounted) {
    return (
      <div className={`flex-1 ${isDark ? 'bg-[#111111]' : 'bg-gray-50'} flex items-center justify-center transition-all duration-300`}>
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  // Theme-based styling variables
  const mainPanelBg = isDark ? 'bg-[#111111]' : 'bg-gray-50'
  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const inputBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'
  const buttonHoverBg = isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-100'

  // Filter QR codes based on search and type
  const filteredQRCodes = qrCodes.filter(qrCode => {
    console.log('🔍 Filtering QR code:', qrCode)
    console.log('🔍 QR code keys:', Object.keys(qrCode))
    
    // Check if qrCode has required properties
    if (!qrCode || typeof qrCode !== 'object' || Object.keys(qrCode).length === 0) {
      console.warn('⚠️ Skipping invalid QR code:', qrCode)
      return false
    }
    
    const matchesSearch = searchTerm === '' || 
      (qrCode.type && qrCode.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (qrCode.target_id && qrCode.target_id.includes(searchTerm)) ||
      (qrCode.qr_id && qrCode.qr_id.includes(searchTerm))
    
    const matchesType = typeFilter === 'all' || qrCode.type === typeFilter
    
    return matchesSearch && matchesType
  })

  const handleGenerate = async (request: GenerateQRRequest) => {
    try {
      await generateQRCode(request)
      setShowGenerateModal(false)
    } catch (error) {
      console.error('Failed to generate QR code:', error)
    }
  }

  const handleDelete = async (qrCode: QRCodeResponse) => {
    try {
      await deleteQRCode(qrCode.qr_id)
    } catch (error) {
      console.error('Failed to delete QR code:', error)
    }
  }

  const handleDownload = async (qrCode: QRCodeResponse) => {
    try {
      console.log('🔍 FoodQRComponent handleDownload called with:', qrCode)
      
      // Validate QR code object before proceeding
      if (!qrCode || typeof qrCode !== 'object' || Object.keys(qrCode).length === 0) {
        console.error('❌ FoodQRComponent: Invalid QR code object:', qrCode)
        alert('Cannot download QR code: Invalid QR code data. Please refresh the page and try again.')
        return
      }
      
      // Check for required fields - handle both qr_id and id fields
      const qrId = (qrCode as any).qr_id || (qrCode as any).id
      if (!qrId || !qrCode.type) {
        console.error('❌ FoodQRComponent: Missing required fields:', { qr_id: (qrCode as any).qr_id, id: (qrCode as any).id, type: qrCode.type })
        alert('Cannot download QR code: Missing required QR code information.')
        return
      }
      
      await foodQRService.downloadQRCode(qrCode, `${qrCode.type.toLowerCase()}-${qrId}.png`)
    } catch (error) {
      console.error('Failed to download QR code:', error)
      alert(`Failed to download QR code: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleView = (qrCode: QRCodeResponse) => {
    setSelectedQRCode(qrCode)
    setShowViewModal(true)
  }

  const getTypeCounts = () => {
    const menu_item = qrCodes.filter(qr => qr.type === 'menu_item').length
    const table = qrCodes.filter(qr => qr.type === 'table').length
    const order = qrCodes.filter(qr => qr.type === 'order').length
    const menu_category = qrCodes.filter(qr => qr.type === 'menu_category').length
    const business = qrCodes.filter(qr => qr.type === 'business').length
    return { menu_item, table, order, menu_category, business, total: qrCodes.length }
  }

  const typeCounts = getTypeCounts()

  return (
    <div className={`flex-1 ${mainPanelBg} h-screen overflow-y-auto transition-colors duration-300`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className={`${cardBg} p-8 border shadow-lg relative overflow-hidden`} style={{ borderRadius: '1.5rem' }}>
          <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>QR Code Management</h1>
          <p className={`${textSecondary} mb-4`}>Generate and manage QR codes for your restaurant menu and tables</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
            <span className="text-green-500 text-sm font-medium">Live Updates</span>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className={`${isDark ? 'bg-green-900/20 border-green-500/30 text-green-400' : 'bg-green-50 border-green-200 text-green-800'} border px-4 py-3 rounded-xl flex items-center justify-between`}>
            <p className="text-sm font-medium">{success}</p>
            <button
              onClick={clearMessages}
              className={`${isDark ? 'text-green-400 hover:text-green-300 hover:bg-green-500/10' : 'text-green-600 hover:text-green-800 hover:bg-green-100'} p-1 rounded-full transition-colors`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className={`${isDark ? 'bg-red-900/20 border-red-500/30 text-red-400' : 'bg-red-50 border-red-200 text-red-800'} border px-4 py-3 rounded-xl flex items-center justify-between`}>
            <p className="text-sm font-medium">{error}</p>
            <button
              onClick={clearMessages}
              className={`${isDark ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10' : 'text-red-600 hover:text-red-800 hover:bg-red-100'} p-1 rounded-full transition-colors`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className={`${cardBg} border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`} style={{ borderRadius: '2.5rem' }}>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-blue-500 font-semibold mb-2">Total QR Codes</h3>
                  <div className={`text-2xl font-bold ${textPrimary}`}>{typeCounts.total}</div>
                </div>
                <div className={`p-3 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-2xl`}>
                  <QrCode className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </div>
          </div>

          <div className={`${cardBg} border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`} style={{ borderRadius: '1.5rem' }}>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-green-500 font-semibold mb-2">Menu Items</h3>
                  <div className={`text-2xl font-bold ${textPrimary}`}>{typeCounts.menu_item}</div>
                </div>
                <div className={`p-3 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-2xl`}>
                  <QrCode className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </div>
          </div>

          <div className={`${cardBg} border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`} style={{ borderRadius: '1rem' }}>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-yellow-500 font-semibold mb-2">Tables</h3>
                  <div className={`text-2xl font-bold ${textPrimary}`}>{typeCounts.table}</div>
                </div>
                <div className={`p-3 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-2xl`}>
                  <QrCode className="h-6 w-6 text-yellow-500" />
                </div>
              </div>
            </div>
          </div>

          <div className={`${cardBg} border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`} style={{ borderRadius: '2rem' }}>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-purple-500 font-semibold mb-2">Orders</h3>
                  <div className={`text-2xl font-bold ${textPrimary}`}>{typeCounts.order}</div>
                </div>
                <div className={`p-3 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-2xl`}>
                  <QrCode className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${textSecondary} w-4 h-4`} />
                  <input
                    type="text"
                    placeholder="Search QR codes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-10 pr-4 py-3 ${inputBg} ${textPrimary} border rounded-xl placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all duration-200 w-full sm:w-64`}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Filter className={`w-4 h-4 ${textSecondary}`} />
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as 'all' | 'menu_item' | 'table' | 'order' | 'menu_category' | 'business')}
                    className={`px-4 py-3 ${inputBg} ${textPrimary} border rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-200`}
                  >
                    <option value="all">All Types</option>
                    <option value="menu_item">Menu Items</option>
                    <option value="table">Tables</option>
                    <option value="order">Orders</option>
                    <option value="menu_category">Categories</option>
                    <option value="business">Business</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => setShowGenerateModal(true)}
                className={`px-6 py-3 ${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535] border-[#3a3a3a]' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'} ${textPrimary} rounded-xl font-medium transition-all duration-300 border shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2`}
              >
                <Plus className="w-4 h-4" />
                <span>Generate QR Code</span>
              </button>
            </div>
          </div>
        </div>

        {/* QR Codes List */}
        {loading ? (
          <div className="text-center py-12">
            <div className={`flex items-center gap-3 justify-center ${textSecondary}`}>
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading QR codes...</span>
            </div>
          </div>
        ) : filteredQRCodes.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className={`${cardBg} border shadow-lg p-16 max-w-md mx-auto`} style={{ borderRadius: '1.5rem' }}>
              <div className={`w-16 h-16 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <QrCode className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className={`text-xl font-semibold ${textPrimary} mb-3`}>
                {searchTerm || typeFilter !== 'all' ? 'No QR codes found' : 'No QR codes yet'}
              </h3>
              <p className={`${textSecondary} mb-8 text-base`}>
                {searchTerm || typeFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Generate your first QR code to get started with digital menu access.'}
              </p>
              {(!searchTerm && typeFilter === 'all') && (
                <button
                  onClick={() => setShowGenerateModal(true)}
                  className={`px-8 py-4 ${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535] border-[#3a3a3a]' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'} ${textPrimary} rounded-xl font-semibold transition-all duration-300 border shadow-lg hover:shadow-xl hover:scale-105`}
                >
                  Generate First QR Code
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQRCodes.map((qrCode, index) => {
              // Skip rendering if QR code is invalid
              if (!qrCode || Object.keys(qrCode).length === 0) {
                console.warn(`⚠️ Skipping invalid QR code at index ${index}:`, qrCode)
                return null
              }
              
              return (
                <QRCodeCard
                  key={qrCode.qr_id || `qr-${index}`}
                  qrCode={qrCode}
                  onDownload={handleDownload}
                  onView={handleView}
                  onDelete={handleDelete}
                />
              )
            })}
          </div>
        )}

        {/* Modals */}
        <GenerateQRModal
          isOpen={showGenerateModal}
          onClose={() => setShowGenerateModal(false)}
          onGenerate={handleGenerate}
          loading={loading}
          businessId={businessId}
        />

        <QRViewModal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          qrCode={selectedQRCode}
          onDownload={handleDownload}
        />
      </div>
    </div>
  )
}