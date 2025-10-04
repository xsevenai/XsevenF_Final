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
import EditQRModal from './components/EditQRModel'
import type { QRCode, GenerateQRRequest } from '@/lib/food-qr'

export default function FoodQRComponent() {
  const [mounted, setMounted] = useState(false)
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()
  const {
    qrCodes,
    loading,
    error,
    success,
    generateQRCode,
    updateQRCode,
    deleteQRCode,
    refreshQRCodes,
    clearMessages
  } = useFoodQR()

  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedQRCode, setSelectedQRCode] = useState<QRCode | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'TABLE' | 'MENU' | 'CUSTOM'>('all')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!themeLoaded || !mounted) {
    return (
      <div className="flex-1 bg-gray-100 dark:bg-gray-900 flex items-center justify-center transition-all duration-300">
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
    const matchesSearch = searchTerm === '' || 
      (qrCode.type === 'TABLE' && qrCode.table_id?.toString().includes(searchTerm)) ||
      (qrCode.type === 'MENU' && 'menu'.includes(searchTerm.toLowerCase())) ||
      (qrCode.type === 'CUSTOM' && qrCode.data.toLowerCase().includes(searchTerm.toLowerCase()))
    
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

  const handleUpdate = async (qrId: string, updates: {
    size?: number
    color?: string
    background_color?: string
    logo_url?: string
    template_id?: string
  }) => {
    try {
      await updateQRCode(qrId, updates)
      setShowEditModal(false)
    } catch (error) {
      console.error('Failed to update QR code:', error)
    }
  }

  const handleDelete = async (qrCode: QRCode) => {
    try {
      await deleteQRCode(qrCode.id)
    } catch (error) {
      console.error('Failed to delete QR code:', error)
    }
  }

  const handleDownload = async (qrCode: QRCode) => {
    try {
      await foodQRService.downloadQRCode(qrCode, `${qrCode.type.toLowerCase()}-${qrCode.id}.png`)
    } catch (error) {
      console.error('Failed to download QR code:', error)
    }
  }

  const handleView = (qrCode: QRCode) => {
    setSelectedQRCode(qrCode)
    setShowViewModal(true)
  }

  const handleEdit = (qrCode: QRCode) => {
    setSelectedQRCode(qrCode)
    setShowEditModal(true)
  }

  const getTypeCounts = () => {
    const table = qrCodes.filter(qr => qr.type === 'TABLE').length
    const menu = qrCodes.filter(qr => qr.type === 'MENU').length
    const custom = qrCodes.filter(qr => qr.type === 'CUSTOM').length
    return { table, menu, custom, total: qrCodes.length }
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
                  <h3 className="text-green-500 font-semibold mb-2">Table QR Codes</h3>
                  <div className={`text-2xl font-bold ${textPrimary}`}>{typeCounts.table}</div>
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
                  <h3 className="text-yellow-500 font-semibold mb-2">Menu QR Codes</h3>
                  <div className={`text-2xl font-bold ${textPrimary}`}>{typeCounts.menu}</div>
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
                  <h3 className="text-purple-500 font-semibold mb-2">Custom QR Codes</h3>
                  <div className={`text-2xl font-bold ${textPrimary}`}>{typeCounts.custom}</div>
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
                    onChange={(e) => setTypeFilter(e.target.value as 'all' | 'TABLE' | 'MENU' | 'CUSTOM')}
                    className={`px-4 py-3 ${inputBg} ${textPrimary} border rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-200`}
                  >
                    <option value="all">All Types</option>
                    <option value="TABLE">Table QR</option>
                    <option value="MENU">Menu QR</option>
                    <option value="CUSTOM">Custom QR</option>
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
            {filteredQRCodes.map((qrCode) => (
              <QRCodeCard
                key={qrCode.id}
                qrCode={qrCode}
                onDownload={handleDownload}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Modals */}
        <GenerateQRModal
          isOpen={showGenerateModal}
          onClose={() => setShowGenerateModal(false)}
          onGenerate={handleGenerate}
          loading={loading}
        />

        <QRViewModal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          qrCode={selectedQRCode}
          onDownload={handleDownload}
        />

        <EditQRModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          qrCode={selectedQRCode}
          onUpdate={handleUpdate}
          loading={loading}
        />
      </div>
    </div>
  )
}