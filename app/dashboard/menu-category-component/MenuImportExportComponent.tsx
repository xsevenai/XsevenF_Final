// app/dashboard/menu-category-component/MenuImportExportComponent.tsx

"use client"

import { useState, useRef, useEffect } from 'react'
import { Upload, Download, FileText, AlertCircle, CheckCircle, Loader2, ArrowLeft, FileSpreadsheet, FileImage, X } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { useMenuImportExport } from '@/hooks/use-menu'
import type { MenuImport } from '@/src/api/generated/models/MenuImport'

interface ImportExportProps {
  onBack: () => void
}

export default function MenuImportExportComponent({ onBack }: ImportExportProps) {
  const { isLoaded: themeLoaded, isDark } = useTheme()
  const businessId = typeof window !== "undefined" ? localStorage.getItem("businessId") || "" : ""
  const { importMenu, exportMenu, loading, error } = useMenuImportExport(businessId)
  
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import')
  const [importData, setImportData] = useState<MenuImport | null>(null)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importResults, setImportResults] = useState<any>(null)
  const [exportFormat, setExportFormat] = useState<'json' | 'csv' | 'pdf'>('json')
  const [includeInactive, setIncludeInactive] = useState(false)
  const [exportResults, setExportResults] = useState<any>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Simulate loading state like modifiers component
  const [localLoading, setLocalLoading] = useState(true)

  useEffect(() => {
    if (themeLoaded) {
      setLocalLoading(false)
    }
  }, [themeLoaded])

  if (localLoading || loading) {
    return (
      <div className={`flex-1 flex items-center justify-center min-h-screen ${isDark ? "bg-[#111]" : "bg-gray-50"}`}>
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'

  // Button styles matching MenuModifiersComponent
  const primaryButtonBg = isDark
    ? 'bg-white text-gray-900 hover:bg-gray-100 border-gray-300'
    : 'bg-gray-900 text-white hover:bg-gray-800 border-gray-700'

  const secondaryButtonBg = isDark
    ? 'bg-[#1f1f1f] text-gray-400 border-[#2a2a2a] hover:bg-[#2a2a2a]'
    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImportFile(file)
    
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        let parsedData: any[] = []
        
        if (file.type === 'application/json' || file.name.endsWith('.json')) {
          parsedData = JSON.parse(content)
        } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
          const lines = content.split('\n')
          const headers = lines[0].split(',')
          parsedData = lines.slice(1).map(line => {
            const values = line.split(',')
            const obj: any = {}
            headers.forEach((header, index) => {
              obj[header.trim()] = values[index]?.trim() || ''
            })
            return obj
          }).filter(obj => Object.keys(obj).length > 0)
        }
        
        setImportData({
          business_id: businessId,
          source_type: file.type === 'application/json' || file.name.endsWith('.json') ? 'json' : 'csv',
          data: parsedData,
          conflict_handling: 'skip'
        })
      } catch (error) {
        console.error('Error parsing file:', error)
        alert('Error parsing file. Please check the format.')
      }
    }
    
    if (file.type === 'application/json' || file.name.endsWith('.json')) {
      reader.readAsText(file)
    } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      reader.readAsText(file)
    } else {
      alert('Please select a JSON or CSV file.')
    }
  }

  const handleImport = async () => {
    if (!importData) return
    
    try {
      const result = await importMenu(importData)
      setImportResults(result)
    } catch (error) {
      console.error('Import failed:', error)
    }
  }

  const handleExport = async () => {
    try {
      const result = await exportMenu(exportFormat, includeInactive)
      setExportResults(result)
      
      if (exportFormat === 'json') {
        const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `menu-export-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
      } else if (exportFormat === 'csv') {
        const blob = new Blob([result.data], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `menu-export-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with Back Button — matches MenuModifiersComponent */}
      <div className={`${cardBg} p-8 border shadow-lg transition-colors duration-300`} style={{ borderRadius: '1.5rem' }}>
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className={`${textSecondary} ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-200'} p-2 rounded-xl transition-all duration-200 hover:scale-110`}
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className={`text-4xl font-bold ${textPrimary} mb-2 transition-colors duration-300`}>
              Menu Import & Export
            </h1>
            <p className={`${textSecondary} transition-colors duration-300`}>
              Import menu items from external sources or export your current menu
            </p>
          </div>
        </div>
      </div>

      {/* Tabs — styled like MenuModifiersComponent */}
      <div className={`${cardBg} p-2 border shadow-lg flex gap-2 transition-colors duration-300 w-fit`} style={{ borderRadius: '1.5rem' }}>
        <button
          onClick={() => setActiveTab('import')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border hover:shadow-md ${
            activeTab === 'import'
              ? isDark 
                ? 'bg-white text-gray-900 border-gray-300 shadow-md'
                : 'bg-gray-900 text-white border-gray-700 shadow-md'
              : isDark ? 'bg-[#1f1f1f] text-gray-400 border-[#2a2a2a]' : 'bg-white text-gray-600 border-gray-200'
          }`}
        >
          <Upload className="h-4 w-4 inline mr-1" />
          Import Menu
        </button>
        <button
          onClick={() => setActiveTab('export')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border hover:shadow-md ${
            activeTab === 'export'
              ? isDark 
                ? 'bg-white text-gray-900 border-gray-300 shadow-md'
                : 'bg-gray-900 text-white border-gray-700 shadow-md'
              : isDark ? 'bg-[#1f1f1f] text-gray-400 border-[#2a2a2a]' : 'bg-white text-gray-600 border-gray-200'
          }`}
        >
          <Download className="h-4 w-4 inline mr-1" />
          Export Menu
        </button>
      </div>

      {/* Import Tab */}
      {activeTab === 'import' && (
        <div className={`${cardBg} p-6 border shadow-lg transition-colors duration-300`} style={{ borderRadius: '1.5rem' }}>
          <h2 className={`text-xl font-bold ${textPrimary} mb-6`}>Import Menu Items</h2>
          
          <div className="space-y-4">
            <div>
              <label className={`block ${textPrimary} font-medium mb-3`}>Select File</label>
              <div className="flex items-center gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`${primaryButtonBg} px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-2xl hover:scale-110 transition-all border font-medium`}
                >
                  <Upload className="h-4 w-4" />
                  Choose File
                </button>
                {importFile && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-500" />
                    <span className={`${textPrimary} text-sm`}>{importFile.name}</span>
                  </div>
                )}
              </div>
            </div>

            {importData && (
              <div className={`${innerCardBg} p-4 border rounded-lg`}>
                <h4 className={`${textPrimary} font-medium mb-3`}>Import Options</h4>
                <div className="space-y-3">
                  <div>
                    <label className={`block ${textPrimary} text-sm font-medium mb-2`}>Conflict Handling</label>
                    <select
                      value={importData.conflict_handling}
                      onChange={(e) => setImportData(prev => prev ? { ...prev, conflict_handling: e.target.value as 'skip' | 'overwrite' } : null)}
                      className={`w-full ${innerCardBg} ${textPrimary} px-3 py-2 rounded-lg border focus:border-blue-500 focus:outline-none`}
                    >
                      <option value="skip">Skip existing items</option>
                      <option value="overwrite">Overwrite existing items</option>
                    </select>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>• Items to import: {importData.data.length}</p>
                    <p>• Source type: {importData.source_type.toUpperCase()}</p>
                  </div>
                </div>
              </div>
            )}

            {importData && (
              <button
                onClick={handleImport}
                disabled={loading}
                className={`${primaryButtonBg} px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-2xl hover:scale-110 transition-all border font-medium disabled:opacity-50`}
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? 'Importing...' : 'Import Menu Items'}
              </button>
            )}

            {importResults && (
              <div className={`${innerCardBg} p-4 border rounded-lg`}>
                <h4 className={`${textPrimary} font-medium mb-3 flex items-center gap-2`}>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Import Results
                </h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className={`${textSecondary}`}>Imported:</span>
                    <span className={`${textPrimary} ml-2 font-bold text-green-500`}>{importResults.imported_count}</span>
                  </div>
                  <div>
                    <span className={`${textSecondary}`}>Skipped:</span>
                    <span className={`${textPrimary} ml-2 font-bold text-yellow-500`}>{importResults.skipped_count}</span>
                  </div>
                  <div>
                    <span className={`${textSecondary}`}>Errors:</span>
                    <span className={`${textPrimary} ml-2 font-bold text-red-500`}>{importResults.error_count}</span>
                  </div>
                </div>
                {importResults.errors && importResults.errors.length > 0 && (
                  <div className="mt-3">
                    <h5 className={`${textPrimary} font-medium mb-2`}>Errors:</h5>
                    <ul className="text-sm text-red-500 space-y-1">
                      {importResults.errors.slice(0, 5).map((error: string, index: number) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Export Tab */}
      {activeTab === 'export' && (
        <div className={`${cardBg} p-6 border shadow-lg transition-colors duration-300`} style={{ borderRadius: '1.5rem' }}>
          <h2 className={`text-xl font-bold ${textPrimary} mb-6`}>Export Menu Items</h2>
          
          <div className="space-y-4">
            <div className={`${innerCardBg} p-4 border rounded-lg`}>
              <h4 className={`${textPrimary} font-medium mb-3`}>Export Options</h4>
              <div className="space-y-4">
                <div>
                  <label className={`block ${textPrimary} text-sm font-medium mb-2`}>Format</label>
                  <div className="flex gap-3 flex-wrap">
                    {[
                      { value: 'json', label: 'JSON', icon: FileText },
                      { value: 'csv', label: 'CSV', icon: FileSpreadsheet },
                      { value: 'pdf', label: 'PDF', icon: FileImage }
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => setExportFormat(value as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all font-medium ${
                          exportFormat === value
                            ? isDark
                              ? 'bg-white text-gray-900 border-gray-300 shadow-md'
                              : 'bg-gray-900 text-white border-gray-700 shadow-md'
                            : isDark
                              ? 'bg-[#1f1f1f] text-gray-400 border-[#2a2a2a] hover:bg-[#2a2a2a]'
                              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="includeInactive"
                    checked={includeInactive}
                    onChange={(e) => setIncludeInactive(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="includeInactive" className={`${textPrimary} text-sm`}>
                    Include inactive items
                  </label>
                </div>
              </div>
            </div>

            <button
              onClick={handleExport}
              disabled={loading}
              className={`${primaryButtonBg} px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-2xl hover:scale-110 transition-all border font-medium disabled:opacity-50`}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Exporting...' : 'Export Menu Items'}
            </button>

            {exportResults && (
              <div className={`${innerCardBg} p-4 border rounded-lg`}>
                <h4 className={`${textPrimary} font-medium mb-3 flex items-center gap-2`}>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Export Complete
                </h4>
                <div className="text-sm space-y-1">
                  <p><span className={`${textSecondary}`}>Format:</span> <span className={`${textPrimary}`}>{exportResults.format.toUpperCase()}</span></p>
                  <p><span className={`${textSecondary}`}>Items exported:</span> <span className={`${textPrimary}`}>{exportResults.item_count}</span></p>
                  <p><span className={`${textSecondary}`}>Exported at:</span> <span className={`${textPrimary}`}>{new Date(exportResults.exported_at).toLocaleString()}</span></p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className={`${cardBg} p-4 border border-red-500/20 bg-red-500/10 rounded-lg`}>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-red-500 font-medium">Error: {error}</span>
          </div>
        </div>
      )}
    </div>
  )
}