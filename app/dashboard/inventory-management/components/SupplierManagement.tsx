// app/dashboard/inventory-management/components/SupplierManagement.tsx

"use client"

import React, { useState } from 'react'
import { ArrowLeft, Plus, Edit, Trash2, Users, Phone, Mail, Globe, Loader2, Search } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import type { Supplier, SupplierCreate, SupplierUpdate } from '@/src/api/generated/models'

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
  const [showCreateForm, setShowCreateForm] = useState(false)
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

  const handleCreateSupplier = async (formData: FormData) => {
    try {
      setIsSubmitting(true)
      const supplierData: SupplierCreate = {
        name: formData.get('name') as string,
        contact_name: formData.get('contact_name') as string || null,
        email: formData.get('email') as string || null,
        phone: formData.get('phone') as string || null,
        address: formData.get('address') as string || null,
        website: formData.get('website') as string || null,
        payment_terms: formData.get('payment_terms') as string || null,
        notes: formData.get('notes') as string || null,
        is_active: true,
        business_id: typeof window !== "undefined" ? localStorage.getItem("businessId") || "" : ""
      }
      
      await onCreateSupplier(supplierData)
      setShowCreateForm(false)
    } catch (error) {
      console.error('Failed to create supplier:', error)
    } finally {
      setIsSubmitting(false)
    }
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
          className={`px-6 py-3 ${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535]' : 'bg-gray-100 hover:bg-gray-200'} ${textPrimary} rounded-xl font-medium transition-all duration-300`}
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
            onClick={() => setShowCreateForm(true)}
            className={`${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535]' : 'bg-gray-100 hover:bg-gray-200'} ${textPrimary} px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all duration-300`}
          >
            <Plus className="h-4 w-4" />
            Add Supplier
          </button>
        </div>
      </div>

      {/* Suppliers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => (
          <div
            key={supplier.id}
            className={`${cardBg} p-6 border shadow-lg hover:shadow-xl transition-all duration-300`}
            style={{ borderRadius: '1.5rem' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} rounded-lg`}>
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className={`${textPrimary} font-semibold text-lg`}>{supplier.name}</h3>
                  <p className={`${textSecondary} text-sm`}>
                    {supplier.is_active ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setEditingSupplier(supplier)}
                  className={`${textSecondary} hover:text-blue-400 p-1 transition-colors duration-300`}
                  title="Edit Supplier"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteSupplier(supplier.id)}
                  className={`${textSecondary} hover:text-red-400 p-1 transition-colors duration-300`}
                  title="Delete Supplier"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {supplier.contact_name && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className={`${textSecondary} text-sm`}>{supplier.contact_name}</span>
                </div>
              )}
              {supplier.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className={`${textSecondary} text-sm`}>{supplier.email}</span>
                </div>
              )}
              {supplier.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className={`${textSecondary} text-sm`}>{supplier.phone}</span>
                </div>
              )}
              {supplier.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <span className={`${textSecondary} text-sm`}>{supplier.website}</span>
                </div>
              )}
            </div>

            {supplier.payment_terms && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className={`${textSecondary} text-sm`}>
                  <strong>Payment Terms:</strong> {supplier.payment_terms}
                </p>
              </div>
            )}

            {supplier.notes && (
              <div className="mt-2">
                <p className={`${textSecondary} text-sm`}>{supplier.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>No suppliers found</h3>
          <p className={`${textSecondary} mb-4`}>
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first supplier'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowCreateForm(true)}
              className={`${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535]' : 'bg-gray-100 hover:bg-gray-200'} ${textPrimary} px-6 py-3 rounded-lg font-medium transition-all duration-300`}
            >
              Add Supplier
            </button>
          )}
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {(showCreateForm || editingSupplier) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${cardBg} p-6 rounded-xl border shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-xl font-bold ${textPrimary}`}>
                {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
              </h3>
              <button
                onClick={() => {
                  setShowCreateForm(false)
                  setEditingSupplier(null)
                }}
                className={`${textSecondary} hover:text-red-400 p-1 transition-colors duration-300`}
              >
                ×
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                if (editingSupplier) {
                  handleUpdateSupplier(formData)
                } else {
                  handleCreateSupplier(formData)
                }
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block ${textPrimary} font-medium mb-2`}>
                    Supplier Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingSupplier?.name || ''}
                    required
                    className={`w-full ${inputBg} ${textPrimary} px-3 py-2 rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                  />
                </div>
                <div>
                  <label className={`block ${textPrimary} font-medium mb-2`}>
                    Contact Name
                  </label>
                  <input
                    type="text"
                    name="contact_name"
                    defaultValue={editingSupplier?.contact_name || ''}
                    className={`w-full ${inputBg} ${textPrimary} px-3 py-2 rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                  />
                </div>
                <div>
                  <label className={`block ${textPrimary} font-medium mb-2`}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={editingSupplier?.email || ''}
                    className={`w-full ${inputBg} ${textPrimary} px-3 py-2 rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                  />
                </div>
                <div>
                  <label className={`block ${textPrimary} font-medium mb-2`}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={editingSupplier?.phone || ''}
                    className={`w-full ${inputBg} ${textPrimary} px-3 py-2 rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                  />
                </div>
                <div>
                  <label className={`block ${textPrimary} font-medium mb-2`}>
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    defaultValue={editingSupplier?.website || ''}
                    className={`w-full ${inputBg} ${textPrimary} px-3 py-2 rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                  />
                </div>
                <div>
                  <label className={`block ${textPrimary} font-medium mb-2`}>
                    Payment Terms
                  </label>
                  <input
                    type="text"
                    name="payment_terms"
                    defaultValue={editingSupplier?.payment_terms || ''}
                    placeholder="e.g., Net 30, COD"
                    className={`w-full ${inputBg} ${textPrimary} px-3 py-2 rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                  />
                </div>
              </div>
              
              <div>
                <label className={`block ${textPrimary} font-medium mb-2`}>
                  Address
                </label>
                <textarea
                  name="address"
                  defaultValue={editingSupplier?.address || ''}
                  rows={3}
                  className={`w-full ${inputBg} ${textPrimary} px-3 py-2 rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                />
              </div>
              
              <div>
                <label className={`block ${textPrimary} font-medium mb-2`}>
                  Notes
                </label>
                <textarea
                  name="notes"
                  defaultValue={editingSupplier?.notes || ''}
                  rows={3}
                  className={`w-full ${inputBg} ${textPrimary} px-3 py-2 rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                />
              </div>

              {editingSupplier && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_active"
                    defaultChecked={editingSupplier.is_active}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label className={`${textPrimary} font-medium`}>
                    Active Supplier
                  </label>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false)
                    setEditingSupplier(null)
                  }}
                  className={`${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535]' : 'bg-gray-200 hover:bg-gray-300'} ${textPrimary} px-4 py-2 rounded-lg font-medium transition-all duration-300`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50`}
                >
                  {isSubmitting ? 'Saving...' : (editingSupplier ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
