// app/dashboard/components/ExpandedViews.tsx

"use client"

import { ArrowLeft, Upload, QrCode } from "lucide-react"
import { Card } from "@/components/ui/card"
import MenuForms from "../menu-category-component/MenuForms"
import type { Table, ExpandedViewType, MenuItem, MenuCategory } from "./types"

interface ExpandedViewsProps {
  expandedView: ExpandedViewType | 'edit-menu-item' | 'edit-category'
  setExpandedView: (view: ExpandedViewType | null) => void
  tables: Table[]
  onMenuItemCreated?: () => void
  onCategoryCreated?: () => void
  onMenuItemUpdated?: () => void
  onCategoryUpdated?: () => void
  editItem?: MenuItem  // For editing existing menu item
  editCategory?: MenuCategory  // For editing existing category
}

export default function ExpandedViews({ 
  expandedView, 
  setExpandedView, 
  tables,
  onMenuItemCreated,
  onCategoryCreated,
  onMenuItemUpdated,
  onCategoryUpdated,
  editItem,
  editCategory
}: ExpandedViewsProps) {
  if (!expandedView) return null

  const handleBack = () => setExpandedView(null)

  // Handle menu-related forms with the new MenuForms component
  if (expandedView === "add-menu-item" || expandedView === "add-category" || expandedView === "edit-menu-item" || expandedView === "edit-category") {
    let formType: 'menu-item' | 'category' | 'edit-menu-item' | 'edit-category'
    
    if (expandedView === "add-menu-item") formType = "menu-item"
    else if (expandedView === "add-category") formType = "category" 
    else if (expandedView === "edit-menu-item") formType = "edit-menu-item"
    else formType = "edit-category"

    return (
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600/50 scrollbar-track-transparent hover:scrollbar-thumb-gray-500/70 transition-colors">
        <MenuForms 
          formType={formType}
          onBack={handleBack}
          onMenuItemCreated={onMenuItemCreated}
          onCategoryCreated={onCategoryCreated}
          onMenuItemUpdated={onMenuItemUpdated}
          onCategoryUpdated={onCategoryUpdated}
          editItem={editItem}
          editCategory={editCategory}
        />
      </div>
    )
  }

  const renderGenerateQR = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={handleBack}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          Generate QR Codes
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <h3 className="text-white font-semibold mb-4">Menu QR Code</h3>
          <div className="bg-white p-4 rounded-lg mb-4">
            <div className="w-32 h-32 bg-gray-200 mx-auto flex items-center justify-center">
              <QrCode className="h-16 w-16 text-gray-600" />
            </div>
          </div>
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
            Download Menu QR
          </button>
        </Card>

        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <h3 className="text-white font-semibold mb-4">Table QR Codes</h3>
          <div className="space-y-3">
            {tables.slice(0, 3).map((table) => (
              <div key={table.id} className="flex items-center justify-between bg-gray-700/30 p-3 rounded-lg">
                <span className="text-white">Table {table.number}</span>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors">
                  Generate
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )

  const renderImportData = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={handleBack}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          Import Customer Data
        </h2>
      </div>

      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-2">Upload CSV File</label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">Drag and drop your CSV file here, or click to browse</p>
              <input type="file" accept=".csv" className="hidden" />
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                Choose File
              </button>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
              Import Data
            </button>
            <button
              onClick={handleBack}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Card>
    </div>
  )

  const renderStaffSchedule = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={handleBack}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          Create Staff Schedule
        </h2>
      </div>

      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white font-medium mb-2">Staff Member</label>
              <select className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none">
                <option>John Doe</option>
                <option>Jane Smith</option>
                <option>Mike Johnson</option>
              </select>
            </div>
            <div>
              <label className="block text-white font-medium mb-2">Position</label>
              <select className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none">
                <option>Server</option>
                <option>Chef</option>
                <option>Manager</option>
                <option>Host</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-white font-medium mb-2">Date</label>
              <input
                type="date"
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-2">Start Time</label>
              <input
                type="time"
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-2">End Time</label>
              <input
                type="time"
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            >
              Create Schedule
            </button>
            <button
              type="button"
              onClick={handleBack}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </Card>
    </div>
  )

  const renderContent = () => {
    switch (expandedView) {
      case "generate-qr":
        return renderGenerateQR()
      case "import-data":
        return renderImportData()
      case "staff-schedule":
        return renderStaffSchedule()
      default:
        return null
    }
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600/50 scrollbar-track-transparent hover:scrollbar-thumb-gray-500/70 transition-colors">
      {renderContent()}
    </div>
  )
}