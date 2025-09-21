// app/dashboard/food-qr-component/FoodQRComponent.tsx

"use client"

import React, { useState } from 'react'
import { QrCode, Plus, Search, Filter, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useFoodQR } from '@/hooks/use-food-qr'
import { foodQRService } from '@/lib/food-qr'
import QRCodeCard from './components/QRCodeCard'
import GenerateQRModal from './components/GenerateQRModal'
import QRViewModal from './components/QRViewModal'
import EditQRModal from './components/EditQRModel'
import type { QRCode, GenerateQRRequest } from '@/lib/food-qr'

export default function FoodQRComponent() {
  // Hook with proper error handling
  const {
    qrCodes,
    loading,
    error,
    success,
    generateQRCode,
    updateQRCode,
    refreshQRCodes,
    clearMessages
  } = useFoodQR()

  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedQRCode, setSelectedQRCode] = useState<QRCode | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'TABLE' | 'MENU' | 'CUSTOM'>('all')

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
    } catch (error) {
      console.error('Failed to update QR code:', error)
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          QR Code Management
        </h2>
        <p className="text-gray-400">Generate and manage QR codes for your restaurant menu and tables</p>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
          <span className="text-green-400 text-sm font-medium">Live Updates</span>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-2xl mb-6 flex items-center justify-between">
          <p className="text-sm font-medium">{success}</p>
          <button
            onClick={clearMessages}
            className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-2xl mb-6 flex items-center justify-between">
          <p className="text-sm font-medium">{error}</p>
          <button
            onClick={clearMessages}
            className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-4">
          <h3 className="text-blue-400 font-semibold mb-2">Total QR Codes</h3>
          <div className="text-2xl font-bold text-white">{typeCounts.total}</div>
        </Card>
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-4">
          <h3 className="text-green-400 font-semibold mb-2">Table QR Codes</h3>
          <div className="text-2xl font-bold text-white">{typeCounts.table}</div>
        </Card>
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-4">
          <h3 className="text-yellow-400 font-semibold mb-2">Menu QR Codes</h3>
          <div className="text-2xl font-bold text-white">{typeCounts.menu}</div>
        </Card>
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-4">
          <h3 className="text-purple-400 font-semibold mb-2">Custom QR Codes</h3>
          <div className="text-2xl font-bold text-white">{typeCounts.custom}</div>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search QR codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-full sm:w-64"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as 'all' | 'TABLE' | 'MENU' | 'CUSTOM')}
              className="px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">All Types</option>
              <option value="TABLE">Table QR</option>
              <option value="MENU">Menu QR</option>
              <option value="CUSTOM">Custom QR</option>
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={() => setShowGenerateModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Generate QR Code</span>
        </button>
      </div>

      {/* QR Codes List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-base">Loading QR codes...</p>
        </div>
      ) : filteredQRCodes.length === 0 ? (
        <div className="text-center py-16 px-6">
          <div className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border border-gray-700/50 rounded-3xl shadow-sm p-16 max-w-md mx-auto">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              {searchTerm || typeFilter !== 'all' ? 'No QR codes found' : 'No QR codes yet'}
            </h3>
            <p className="text-gray-400 mb-8 text-base">
              {searchTerm || typeFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Generate your first QR code to get started with digital menu access.'}
            </p>
            {(!searchTerm && typeFilter === 'all') && (
              <button
                onClick={() => setShowGenerateModal(true)}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 text-base"
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
  )
}