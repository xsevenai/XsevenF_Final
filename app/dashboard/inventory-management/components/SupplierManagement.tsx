// app/dashboard/inventory-management/components/SupplierManagement.tsx

"use client"

import React, { useState } from 'react'
import { ArrowLeft, Plus, Edit, Trash2, Users, Phone, Mail, Globe, Loader2, Search } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import type { Supplier, SupplierCreate, SupplierUpdate } from '@/src/api/generated'

interface SupplierManagementProps {
  suppliers: Supplier[]
  loading: boolean
  error: string | null
  onRefresh: () => void
  onCreateSupplier: (data: SupplierCreate) => Promise<Supplier>
  onUpdateSupplier: (id: string, data: SupplierUpdate) => Promise<Supplier>
  onDeleteSupplier: (id: string) => Promise<void>
  onBack: () => void
}

export default function SupplierManagement({
  suppliers,
  loading,
  error,
  onRefresh,
  onCreateSupplier,
  onUpdateSupplier,
  onDeleteSupplier,
  onBack
}: SupplierManagementProps) {
  const { isDark } = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedView, setExpandedView] = useState<'create-supplier' | 'edit-supplier' | null>(null)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Theme-aware styles
  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const inputBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'

  // Filter suppliers based on search term
  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleBack = () => {
    setExpandedView(null)
  }

  const handleCreateSupplier = async (supplierData: SupplierCreate) => {
    try {
      setIsSubmitting(true)
      const result = await onCreateSupplier(supplierData)
      setExpandedView(null)
      onRefresh()
      return result
    } catch (error) {
      console.error('Failed to create supplier:', error)
      alert('Failed to create supplier')
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setExpandedView('edit-supplier')
  }

  // Handle expanded view rendering (like PurchaseOrderManagement does)
  if (expandedView === 'create-supplier') {
    return (
      <SupplierForm
        onSubmit={handleCreateSupplier}
        onCancel={handleBack}
        loading={isSubmitting}
      />
    )
  }

  if (expandedView === 'edit-supplier' && editingSupplier) {
    return (
      <SupplierUpdateForm
        supplier={editingSupplier}
        onSubmit={async (updateData) => {
          const result = await onUpdateSupplier(editingSupplier.id, updateData)
          setExpandedView(null)
          onRefresh()
          return result
        }}
        onCancel={handleBack}
        loading={isSubmitting}
      />
    )
  }

  const handleUpdateSupplier = async (formData: FormData) => {
    if (!editingSupplier) return
    
    try {
      setIsSubmitting(true)
      const updateData: SupplierUpdate = {
        name: formData.get('name') as string,
        contact_name: formData.get('contact_name') as string || null,
        email: formData.get('email') as string || null,
        phone: formData.get('phone') as string || null,
        address: formData.get('address') as string || null,
        website: formData.get('website') as string || null,
        payment_terms: formData.get('payment_terms') as string || null,
        notes: formData.get('notes') as string || null,
        is_active: formData.get('is_active') === 'on'
      }
      
      await onUpdateSupplier(editingSupplier.id, updateData)
      setEditingSupplier(null)
    } catch (error) {
      console.error('Failed to update supplier:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteSupplier = async (supplierId: string) => {
    if (!confirm('Are you sure you want to delete this supplier?')) return
    
    try {
      await onDeleteSupplier(supplierId)
    } catch (error) {
      console.error('Failed to delete supplier:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`flex items-center gap-3 ${textSecondary}`}>
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading suppliers...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className={`${textSecondary} mb-4`}>Error: {error}</div>
        <button
          onClick={onRefresh}
          className={`px-6 py-3 ${isDark ? 'bg-white hover:bg-gray-100 text-gray-900' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'} rounded-xl font-medium transition-all duration-300`}
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`${cardBg} p-8 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className={`${textSecondary} ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-200'} p-2 rounded-xl transition-all duration-200 hover:scale-110`}
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>Supplier Management</h1>
            <p className={`${textSecondary}`}>Manage your supplier relationships and contacts</p>
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className={`${cardBg} p-6 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${textSecondary}`} />
              <input
                type="text"
                placeholder="Search suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 ${inputBg} ${textPrimary} rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
              />
            </div>
          </div>
          <button
            onClick={() => setExpandedView('create-supplier')}
            className={`${isDark ? 'bg-white hover:bg-gray-100 text-gray-900' : 'bg-gray-900 hover:bg-gray-800 text-white'} px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all duration-300`}
          >
            <Plus className="h-4 w-4" />
            Add Supplier
          </button>
        </div>
      </div>

      {/* Suppliers Table */}
      <div className={`${cardBg} border transition-colors duration-300 overflow-hidden`} style={{ borderTopLeftRadius: "1.5rem", borderTopRightRadius: "1.5rem" }}>
        {/* Fixed Table Header */}
        <div className={`${isDark ? "bg-[#171717]" : "bg-white"} sticky top-0 z-10`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`${isDark ? "border-b border-[#2a2a2a]" : "border-b border-gray-200"}`}>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                  Supplier Name
                </th>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                  Contact Person
                </th>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                  Email
                </th>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                  Phone
                </th>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                  Website
                </th>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                  Payment Terms
                </th>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                  Status
                </th>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                  Actions
                </th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
        
      {/* Scrollable Table Body */}
      <div 
        className={`overflow-x-auto max-h-[600px] overflow-y-auto ${isDark ? "bg-[#171717]" : "bg-white"} ${isDark ? "dark-scrollbar" : "light-scrollbar"}`}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: isDark ? '#2a2a2a #171717' : '#d1d5db #f9fafb'
        }}
      >
        <table className="w-full">
            <tbody>
              {filteredSuppliers.map((supplier) => (
                <tr 
                  key={supplier.id}
                  className={`${isDark ? "border-b border-[#2a2a2a] hover:bg-[#1f1f1f]" : "border-b border-gray-200 hover:bg-gray-50"} transition-colors duration-200`}
                >
                  {/* Supplier Name */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-full flex items-center justify-center`}>
                        <Users className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <div className={`${textPrimary} font-semibold text-sm`}>{supplier.name}</div>
                        <div className={`${textSecondary} text-xs`}>
                          {supplier.address ? supplier.address.substring(0, 30) + '...' : 'No address'}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Contact Person */}
                  <td className="py-4 px-6">
                    <div className={`${textPrimary} text-sm`}>
                      {supplier.contact_name || 'N/A'}
                    </div>
                  </td>
                  
                  {/* Email */}
                  <td className="py-4 px-6">
                    <div className={`${textSecondary} text-sm`}>
                      {supplier.email || 'N/A'}
                    </div>
                  </td>
                  
                  {/* Phone */}
                  <td className="py-4 px-6">
                    <div className={`${textSecondary} text-sm`}>
                      {supplier.phone || 'N/A'}
                    </div>
                  </td>
                  
                  {/* Website */}
                  <td className="py-4 px-6">
                    <div className={`${textSecondary} text-sm`}>
                      {supplier.website ? (
                        <a 
                          href={supplier.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-400"
                        >
                          {supplier.website}
                        </a>
                      ) : 'N/A'}
                    </div>
                  </td>
                  
                  {/* Payment Terms */}
                  <td className="py-4 px-6">
                    <div className={`${textSecondary} text-sm`}>
                      {supplier.payment_terms || 'N/A'}
                    </div>
                  </td>
                  
                  {/* Status */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${supplier.is_active ? "bg-green-500" : "bg-gray-400"}`}></div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          supplier.is_active 
                            ? isDark ? "bg-green-900 text-green-300" : "bg-green-100 text-green-800"
                            : isDark ? "bg-gray-900 text-gray-300" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {supplier.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </td>
                  
                  {/* Actions */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditSupplier(supplier)}
                        className={`${textSecondary} hover:text-blue-400 p-1 transition-colors duration-300`}
                        title="Edit Supplier"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {filteredSuppliers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>No suppliers found</h3>
            <p className={`${textSecondary} mb-4`}>
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first supplier'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setExpandedView('create-supplier')}
                className={`${isDark ? 'bg-white hover:bg-gray-100 text-gray-900' : 'bg-gray-900 hover:bg-gray-800 text-white'} px-6 py-3 rounded-lg font-medium transition-all duration-300`}
              >
                Add Supplier
              </button>
            )}
          </div>
        )}
      </div>



    </div>
  )
}

// Supplier Form Component
interface SupplierFormProps {
  onSubmit: (supplierData: SupplierCreate) => Promise<Supplier>
  onCancel: () => void
  loading: boolean
}

function SupplierForm({ onSubmit, onCancel, loading }: SupplierFormProps) {
  const [formData, setFormData] = useState<SupplierCreate>({
    name: '',
    contact_name: null,
    email: null,
    phone: null,
    address: null,
    website: null,
    payment_terms: null,
    notes: null,
    is_active: true,
    business_id: typeof window !== "undefined" ? localStorage.getItem("businessId") || "" : ""
  })
  const { isDark } = useTheme()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name) {
      alert('Please enter a supplier name')
      return
    }
    
    if (!formData.business_id) {
      alert('Business ID is required')
      return
    }
    
    await onSubmit(formData)
  }

  const cardBg = isDark ? "bg-[#171717] border-[#2a2a2a]" : "bg-white border-gray-200"
  const textPrimary = isDark ? "text-white" : "text-gray-900"
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600"
  const inputBg = isDark ? "bg-[#2a2a2a] border-[#3a3a3a]" : "bg-gray-50 border-gray-300"
  const buttonHoverBg = isDark ? "hover:bg-[#2a2a2a]" : "hover:bg-gray-100"

  return (
    <div className={`flex-1 min-h-screen overflow-y-auto transition-colors duration-300 ${isDark ? "bg-[#111]" : "bg-gray-50"}`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className={`${cardBg} p-8 border shadow-lg transition-colors duration-300`} style={{ borderRadius: "1.5rem" }}>
          <div className="flex items-center gap-4">
            <button
              onClick={onCancel}
              className={`${textSecondary} ${buttonHoverBg} p-2 rounded-xl transition-all duration-200 hover:scale-110`}
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className={`text-4xl font-bold ${textPrimary} mb-2 transition-colors duration-300`}>
                Create Supplier
              </h1>
              <p className={`${textSecondary} transition-colors duration-300`}>
                Add a new supplier to your inventory management system
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className={`${cardBg} p-6 border shadow-lg transition-colors duration-300`} style={{ borderRadius: "1.5rem" }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                  Supplier Name *
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                  Contact Person
                </label>
                <input
                  type="text"
                  value={formData.contact_name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact_name: e.target.value || null }))}
                  className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value || null }))}
                  className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value || null }))}
                  className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value || null }))}
                  className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                  Payment Terms
                </label>
                <input
                  type="text"
                  value={formData.payment_terms || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, payment_terms: e.target.value || null }))}
                  className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                  placeholder="e.g., Net 30, COD"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                Address
              </label>
              <textarea
                value={formData.address || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value || null }))}
                className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                rows={3}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                Notes
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value || null }))}
                className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                className={`px-6 py-2 ${isDark ? 'bg-[#1f1f1f] text-gray-400 border-[#2a2a2a] hover:bg-[#2a2a2a]' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'} border rounded-lg font-medium transition-all duration-200`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 ${isDark ? 'bg-white hover:bg-gray-100 text-gray-900' : 'bg-gray-900 hover:bg-gray-800 text-white'} rounded-lg font-medium transition-all duration-200 disabled:opacity-50 flex items-center gap-2`}
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? 'Creating...' : 'Create Supplier'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Supplier Update Form Component
interface SupplierUpdateFormProps {
  supplier: Supplier
  onSubmit: (updateData: SupplierUpdate) => Promise<Supplier>
  onCancel: () => void
  loading: boolean
}

function SupplierUpdateForm({ supplier, onSubmit, onCancel, loading }: SupplierUpdateFormProps) {
  const [formData, setFormData] = useState<SupplierUpdate>({
    name: supplier.name,
    contact_name: supplier.contact_name,
    email: supplier.email,
    phone: supplier.phone,
    address: supplier.address,
    website: supplier.website,
    payment_terms: supplier.payment_terms,
    notes: supplier.notes,
    is_active: supplier.is_active
  })
  const { isDark } = useTheme()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const cardBg = isDark ? "bg-[#171717] border-[#2a2a2a]" : "bg-white border-gray-200"
  const textPrimary = isDark ? "text-white" : "text-gray-900"
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600"
  const inputBg = isDark ? "bg-[#2a2a2a] border-[#3a3a3a]" : "bg-gray-50 border-gray-300"

  return (
    <div className={`flex-1 min-h-screen overflow-y-auto transition-colors duration-300 ${isDark ? "bg-[#111]" : "bg-gray-50"}`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className={`${cardBg} p-8 border shadow-lg transition-colors duration-300`} style={{ borderRadius: "1.5rem" }}>
          <div className="flex items-center gap-4">
            <button
              onClick={onCancel}
              className={`${textSecondary} hover:bg-[#2a2a2a] p-2 rounded-xl transition-all duration-200 hover:scale-110`}
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className={`text-4xl font-bold ${textPrimary} mb-2 transition-colors duration-300`}>
                Edit Supplier
              </h1>
              <p className={`${textSecondary} transition-colors duration-300`}>
                Update supplier information
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className={`${cardBg} p-6 border shadow-lg transition-colors duration-300`} style={{ borderRadius: "1.5rem" }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                  Supplier Name *
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                  Contact Person
                </label>
                <input
                  type="text"
                  value={formData.contact_name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact_name: e.target.value || null }))}
                  className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value || null }))}
                  className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value || null }))}
                  className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value || null }))}
                  className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                  Payment Terms
                </label>
                <input
                  type="text"
                  value={formData.payment_terms || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, payment_terms: e.target.value || null }))}
                  className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                  placeholder="e.g., Net 30, COD"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                Address
              </label>
              <textarea
                value={formData.address || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value || null }))}
                className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                rows={3}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${textPrimary}`}>
                Notes
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value || null }))}
                className={`w-full px-3 py-2 ${inputBg} ${textPrimary} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_active || false}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label className={`${textPrimary} font-medium`}>
                Active Supplier
              </label>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                className={`px-6 py-2 ${isDark ? 'bg-[#1f1f1f] text-gray-400 border-[#2a2a2a] hover:bg-[#2a2a2a]' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'} border rounded-lg font-medium transition-all duration-200`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 ${isDark ? 'bg-white hover:bg-gray-100 text-gray-900' : 'bg-gray-900 hover:bg-gray-800 text-white'} rounded-lg font-medium transition-all duration-200 disabled:opacity-50 flex items-center gap-2`}
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? 'Updating...' : 'Update Supplier'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
