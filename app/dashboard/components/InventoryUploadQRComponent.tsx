// app/dashboard/components/InventoryUploadQRComponent.tsx

"use client"

import { useState, useCallback } from 'react'
import { Upload, Package, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

export default function InventoryUploadQRComponent() {
  const { isDark } = useTheme()
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('image/')) {
        setUploadedFile(file)
        setUploadStatus('idle')
      }
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type.startsWith('image/')) {
        setUploadedFile(file)
        setUploadStatus('idle')
      }
    }
  }

  const handleUpload = async () => {
    if (!uploadedFile) return

    setIsUploading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2200))
      setUploadStatus('success')
    } catch (error) {
      setUploadStatus('error')
    } finally {
      setIsUploading(false)
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    setUploadStatus('idle')
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className={`${cardBg} p-8 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>Inventory Upload via QR</h1>
        <p className={`${textSecondary}`}>Upload inventory document pictures to automatically extract inventory items</p>
      </div>

      {/* Upload Area */}
      <div className={`${cardBg} p-6 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            dragActive 
              ? isDark ? 'border-green-400 bg-green-400/10' : 'border-green-500 bg-green-50'
              : isDark ? 'border-[#2a2a2a] bg-[#1f1f1f]' : 'border-gray-300 bg-gray-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          {!uploadedFile ? (
            <>
              <Package className={`mx-auto h-12 w-12 ${dragActive ? 'text-green-500' : textSecondary} mb-4`} />
              <h3 className={`text-lg font-semibold ${textPrimary} mb-2`}>
                Drop inventory image here or click to browse
              </h3>
              <p className={`${textSecondary} text-sm`}>
                Supports: JPG, PNG, JPEG up to 10MB
              </p>
            </>
          ) : (
            <div className="space-y-4">
              <Package className={`mx-auto h-12 w-12 ${textPrimary}`} />
              <div>
                <h3 className={`text-lg font-semibold ${textPrimary}`}>{uploadedFile.name}</h3>
                <p className={`${textSecondary} text-sm`}>
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={removeFile}
                className={`${isDark ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-600'} p-1`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Upload Button */}
        {uploadedFile && uploadStatus === 'idle' && (
          <div className="mt-6 text-center">
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className={`${isDark ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto`}
            >
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {isUploading ? 'Processing...' : 'Extract Inventory Items'}
            </button>
          </div>
        )}

        {/* Status Messages */}
        {uploadStatus === 'success' && (
          <div className="mt-6 p-4 bg-green-100 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <h4 className="font-semibold text-green-800">Upload Successful!</h4>
              <p className="text-green-700 text-sm">Inventory items have been extracted and added to your system.</p>
            </div>
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="mt-6 p-4 bg-red-100 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <div>
              <h4 className="font-semibold text-red-800">Upload Failed</h4>
              <p className="text-red-700 text-sm">Please try again or contact support if the issue persists.</p>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className={`${cardBg} p-6 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <h2 className={`text-xl font-bold ${textPrimary} mb-4`}>How it works</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className={`w-6 h-6 rounded-full ${isDark ? 'bg-green-600' : 'bg-green-500'} text-white text-xs flex items-center justify-center font-bold`}>1</div>
            <p className={`${textSecondary} text-sm`}>Upload a clear image of your inventory list or stock document</p>
          </div>
          <div className="flex items-start gap-3">
            <div className={`w-6 h-6 rounded-full ${isDark ? 'bg-green-600' : 'bg-green-500'} text-white text-xs flex items-center justify-center font-bold`}>2</div>
            <p className={`${textSecondary} text-sm`}>Our AI will extract item names, quantities, and prices</p>
          </div>
          <div className="flex items-start gap-3">
            <div className={`w-6 h-6 rounded-full ${isDark ? 'bg-green-600' : 'bg-green-500'} text-white text-xs flex items-center justify-center font-bold`}>3</div>
            <p className={`${textSecondary} text-sm`}>Review and manage the extracted inventory items in your system</p>
          </div>
        </div>
      </div>

      {/* Supported Document Types */}
      <div className={`${cardBg} p-6 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <h2 className={`text-xl font-bold ${textPrimary} mb-4`}>Supported Document Types</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`${isDark ? 'bg-green-600' : 'bg-green-500'} w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2`}>
              <Package className="h-6 w-6 text-white" />
            </div>
            <p className={`${textPrimary} font-medium text-sm`}>Inventory Lists</p>
          </div>
          <div className="text-center">
            <div className={`${isDark ? 'bg-green-600' : 'bg-green-500'} w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2`}>
              <Package className="h-6 w-6 text-white" />
            </div>
            <p className={`${textPrimary} font-medium text-sm`}>Stock Sheets</p>
          </div>
          <div className="text-center">
            <div className={`${isDark ? 'bg-green-600' : 'bg-green-500'} w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2`}>
              <Package className="h-6 w-6 text-white" />
            </div>
            <p className={`${textPrimary} font-medium text-sm`}>Supply Lists</p>
          </div>
          <div className="text-center">
            <div className={`${isDark ? 'bg-green-600' : 'bg-green-500'} w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2`}>
              <Package className="h-6 w-6 text-white" />
            </div>
            <p className={`${textPrimary} font-medium text-sm`}>Price Catalogs</p>
          </div>
        </div>
      </div>
    </div>
  )
}