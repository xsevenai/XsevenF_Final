// app/dashboard/components/MenuForms.tsx

"use client"

import { ArrowLeft, Loader2, CheckSquare, Square } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { useMenu } from "@/hooks/use-menu"
import { useTheme } from "@/hooks/useTheme"
import type { MenuItem } from "@/src/api/generated/models/MenuItem"
import type { MenuCategory } from "@/src/api/generated/models/MenuCategory"
import type { BulkMenuItemUpdate } from "@/src/api/generated/models/BulkMenuItemUpdate"

interface MenuFormsProps {
  formType: 'menu-item' | 'category' | 'edit-menu-item' | 'edit-category' | 'add-menu-item' | 'add-category' | 'bulk-update'
  onBack: () => void
  onMenuItemCreated?: () => void
  onCategoryCreated?: () => void
  onMenuItemUpdated?: () => void
  onCategoryUpdated?: () => void
  onBulkUpdate?: () => void
  editItem?: MenuItem
  editCategory?: MenuCategory
  selectedItems?: MenuItem[]
}

export default function MenuForms({ 
  formType, 
  onBack, 
  onMenuItemCreated,
  onCategoryCreated,
  onMenuItemUpdated,
  onCategoryUpdated,
  onBulkUpdate,
  editItem,
  editCategory,
  selectedItems = []
}: MenuFormsProps) {
  const [businessId, setBusinessId] = useState<string>("")
  const { categories, categoriesLoading, createItem, updateItem, createCategory, updateCategory, bulkUpdateItems } = useMenu(businessId)
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()
  
  // Normalize form type for consistent handling
  const normalizedFormType = formType === 'add-menu-item' ? 'menu-item' : 
                            formType === 'add-category' ? 'category' : 
                            formType === 'bulk-update' ? 'bulk-update' :
                            formType
  
  // Form states - FIXED: Use proper types and handle undefined values
  const [menuItemForm, setMenuItemForm] = useState({
    name: '',
    description: '',
    price: 0,
    category_id: '',
    image_url: '',
    is_available: true,
    // Remove sort_order if it doesn't exist in the API model
  })
  
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  })

  const [bulkUpdateForm, setBulkUpdateForm] = useState({
    price: undefined as number | undefined,
    cost: undefined as number | undefined,
    category_id: '',
    is_available: undefined as boolean | undefined,
    image_url: '',
    description: ''
  })

  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    // Get business ID from localStorage
    const storedBusinessId = localStorage.getItem('businessId')
    if (storedBusinessId) {
      setBusinessId(storedBusinessId)
    }
  }, [])

  // Initialize form with edit data - FIXED: Handle undefined values properly
  useEffect(() => {
    if ((normalizedFormType === 'edit-menu-item') && editItem) {
      setMenuItemForm({
        name: editItem.name || '',
        description: editItem.description || '',
price: typeof editItem.price === 'string' ? parseFloat(editItem.price) : (editItem.price || 0),        category_id: editItem.category_id || '',
        image_url: editItem.image_url || '',
        is_available: editItem.is_available !== undefined ? editItem.is_available : true,
        // Remove sort_order if it doesn't exist in the model
      })
    }
  }, [normalizedFormType, editItem])

  useEffect(() => {
    if ((normalizedFormType === 'edit-category') && editCategory) {
      setCategoryForm({
        name: editCategory.name || '',
        description: editCategory.description || ''
      })
    }
  }, [normalizedFormType, editCategory])
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

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

  const handleMenuItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      // Validate required fields
      if (!menuItemForm.name.trim()) {
        throw new Error('Item name is required')
      }
      if (!menuItemForm.category_id) {
        throw new Error('Please select a category')
      }
      if (menuItemForm.price <= 0) {
        throw new Error('Price must be greater than 0')
      }

      if (normalizedFormType === 'edit-menu-item' && editItem) {
        // Update existing menu item - FIXED: Use proper update data structure
        const updateData = {
          name: menuItemForm.name,
          description: menuItemForm.description || undefined,
          price: menuItemForm.price,
          category_id: menuItemForm.category_id,
          image_url: menuItemForm.image_url || undefined,
          is_available: menuItemForm.is_available,
          // Remove sort_order if it doesn't exist in the model
        }
        
        await updateItem(editItem.id, updateData)
        setSubmitSuccess(true)
        
        if (onMenuItemUpdated) {
          onMenuItemUpdated()
        }
      } else {
        // Create new menu item - FIXED: Use proper create data structure
        const createData = {
          name: menuItemForm.name,
          description: menuItemForm.description || undefined,
          price: menuItemForm.price,
          category_id: menuItemForm.category_id,
          image_url: menuItemForm.image_url || undefined,
          is_available: menuItemForm.is_available,
          business_id: businessId,
          // Remove sort_order if it doesn't exist in the model
        }
        
        await createItem(createData)
        setSubmitSuccess(true)
        setMenuItemForm({
          name: '',
          description: '',
          price: 0,
          category_id: '',
          image_url: '',
          is_available: true,
        })
        
        if (onMenuItemCreated) {
          onMenuItemCreated()
        }
      }
      
      setTimeout(() => {
        onBack()
      }, 1500)
      
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : `Failed to ${normalizedFormType === 'edit-menu-item' ? 'update' : 'create'} menu item`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      if (!categoryForm.name.trim()) {
        throw new Error('Category name is required')
      }

      if (normalizedFormType === 'edit-category' && editCategory) {
        // Update existing category
        const updateData = {
          name: categoryForm.name,
          description: categoryForm.description || undefined
        }
        
        await updateCategory(editCategory.id, updateData)
        setSubmitSuccess(true)
        
        if (onCategoryUpdated) {
          onCategoryUpdated()
        }
      } else {
        // Create new category - FIXED: Use proper create data structure
        const createData = {
          name: categoryForm.name,
          description: categoryForm.description || undefined,
          business_id: businessId,
          is_active: true,
          display_order: 0
        }
        
        await createCategory(createData)
        setSubmitSuccess(true)
        setCategoryForm({
          name: '',
          description: ''
        })
        
        if (onCategoryCreated) {
          onCategoryCreated()
        }
      }
      
      setTimeout(() => {
        onBack()
      }, 1500)
      
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : `Failed to ${normalizedFormType === 'edit-category' ? 'update' : 'create'} category`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBulkUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      if (selectedItems.length === 0) {
        throw new Error('No items selected for bulk update')
      }

      // Prepare bulk update data
      const updateData: any = {}
      
      if (bulkUpdateForm.price !== undefined) {
        updateData.price = bulkUpdateForm.price
      }
      if (bulkUpdateForm.cost !== undefined) {
        updateData.cost = bulkUpdateForm.cost
      }
      if (bulkUpdateForm.category_id) {
        updateData.category_id = bulkUpdateForm.category_id
      }
      if (bulkUpdateForm.is_available !== undefined) {
        updateData.is_available = bulkUpdateForm.is_available
      }
      if (bulkUpdateForm.image_url) {
        updateData.image_url = bulkUpdateForm.image_url
      }
      if (bulkUpdateForm.description) {
        updateData.description = bulkUpdateForm.description
      }

      if (Object.keys(updateData).length === 0) {
        throw new Error('Please specify at least one field to update')
      }

      const bulkUpdate: BulkMenuItemUpdate = {
        item_ids: selectedItems.map(item => item.id),
        updates: updateData
      }

      await bulkUpdateItems(bulkUpdate)
      setSubmitSuccess(true)
      
      if (onBulkUpdate) {
        onBulkUpdate()
      }
      
      setTimeout(() => {
        onBack()
      }, 1500)
      
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to bulk update menu items')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderMenuItemForm = () => (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className={`${cardBg} p-8 border shadow-lg relative overflow-hidden`}
        style={{ borderRadius: '1.5rem' }}>
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className={`${textSecondary} ${buttonHoverBg} p-2 rounded-xl transition-all duration-200 hover:scale-110`}
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>
              {normalizedFormType === 'edit-menu-item' ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h1>
            <p className={`${textSecondary}`}>
              {normalizedFormType === 'edit-menu-item' ? 'Update menu item details' : 'Create a new menu item for your restaurant'}
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <div className="p-8">
          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <p className="text-green-500 font-medium">
                Menu item {normalizedFormType === 'edit-menu-item' ? 'updated' : 'created'} successfully!
              </p>
            </div>
          )}
          
          {submitError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-500 font-medium">{submitError}</p>
            </div>
          )}

          <form onSubmit={handleMenuItemSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block ${textPrimary} font-medium mb-3`}>
                  Item Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={menuItemForm.name}
                  onChange={(e) => setMenuItemForm(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                  placeholder="Enter item name"
                  required
                />
              </div>
              <div>
                <label className={`block ${textPrimary} font-medium mb-3`}>
                  Price ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={menuItemForm.price || ''}
                  onChange={(e) => setMenuItemForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className={`block ${textPrimary} font-medium mb-3`}>
                Category <span className="text-red-500">*</span>
              </label>
              {categoriesLoading ? (
                <div className={`flex items-center gap-2 ${textSecondary}`}>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading categories...</span>
                </div>
              ) : (
                <select 
                  value={menuItemForm.category_id}
                  onChange={(e) => setMenuItemForm(prev => ({ ...prev, category_id: e.target.value }))}
                  className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            
            <div>
              <label className={`block ${textPrimary} font-medium mb-3`}>Description</label>
              <textarea
                rows={4}
                value={menuItemForm.description}
                onChange={(e) => setMenuItemForm(prev => ({ ...prev, description: e.target.value }))}
                className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200 resize-none`}
                placeholder="Enter item description"
              />
            </div>
            
            <div>
              <label className={`block ${textPrimary} font-medium mb-3`}>Image URL</label>
              <input
                type="url"
                value={menuItemForm.image_url}
                onChange={(e) => setMenuItemForm(prev => ({ ...prev, image_url: e.target.value }))}
                className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_available"
                checked={menuItemForm.is_available}
                onChange={(e) => setMenuItemForm(prev => ({ ...prev, is_available: e.target.checked }))}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="is_available" className={`${textPrimary} font-medium`}>
                Available for orders
              </label>
            </div>
            
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting || categoriesLoading}
                className={`${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535] border-[#3a3a3a]' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'} ${textPrimary} px-8 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border shadow-lg hover:shadow-xl hover:scale-105`}
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmitting ? (normalizedFormType === 'edit-menu-item' ? 'Updating...' : 'Adding...') : (normalizedFormType === 'edit-menu-item' ? 'Update Menu Item' : 'Add Menu Item')}
              </button>
              <button
                type="button"
                onClick={onBack}
                disabled={isSubmitting}
                className={`${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535]' : 'bg-gray-200 hover:bg-gray-300'} ${textPrimary} px-8 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl hover:scale-105`}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )

  const renderCategoryForm = () => (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className={`${cardBg} p-8 border shadow-lg relative overflow-hidden`}
        style={{ borderRadius: '1.5rem' }}>
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className={`${textSecondary} ${buttonHoverBg} p-2 rounded-xl transition-all duration-200 hover:scale-110`}
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>
              {normalizedFormType === 'edit-category' ? 'Edit Category' : 'Add New Category'}
            </h1>
            <p className={`${textSecondary}`}>
              {normalizedFormType === 'edit-category' ? 'Update category details' : 'Create a new category for organizing menu items'}
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <div className="p-8">
          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <p className="text-green-500 font-medium">
                Category {normalizedFormType === 'edit-category' ? 'updated' : 'created'} successfully!
              </p>
            </div>
          )}
          
          {submitError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-500 font-medium">{submitError}</p>
            </div>
          )}

          <form onSubmit={handleCategorySubmit} className="space-y-6">
            <div>
              <label className={`block ${textPrimary} font-medium mb-3`}>
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                placeholder="Enter category name"
                required
              />
            </div>
            <div>
              <label className={`block ${textPrimary} font-medium mb-3`}>Description</label>
              <textarea
                rows={3}
                value={categoryForm.description}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200 resize-none`}
                placeholder="Enter category description"
              />
            </div>
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535] border-[#3a3a3a]' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'} ${textPrimary} px-8 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border shadow-lg hover:shadow-xl hover:scale-105`}
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmitting ? (normalizedFormType === 'edit-category' ? 'Updating...' : 'Adding...') : (normalizedFormType === 'edit-category' ? 'Update Category' : 'Add Category')}
              </button>
              <button
                type="button"
                onClick={onBack}
                disabled={isSubmitting}
                className={`${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535]' : 'bg-gray-200 hover:bg-gray-300'} ${textPrimary} px-8 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl hover:scale-105`}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )

  const renderBulkUpdateForm = () => (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className={`${cardBg} p-8 border shadow-lg relative overflow-hidden`}
        style={{ borderRadius: '1.5rem' }}>
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className={`${textSecondary} ${buttonHoverBg} p-2 rounded-xl transition-all duration-200 hover:scale-110`}
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>
              Bulk Update Menu Items
            </h1>
            <p className={`${textSecondary}`}>
              Update multiple menu items at once ({selectedItems.length} items selected)
            </p>
          </div>
        </div>
      </div>

      {/* Selected Items Preview */}
      <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <div className="p-6">
          <h3 className={`${textPrimary} font-semibold text-lg mb-4`}>Selected Items</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {selectedItems.map((item) => (
              <div key={item.id} className={`${innerCardBg} p-3 border rounded-lg`}>
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-green-500" />
                  <span className={`${textPrimary} font-medium text-sm`}>{item.name}</span>
                </div>
                <p className={`${textSecondary} text-xs`}>
                  ${(parseFloat(String(item.price)) || 0).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <div className="p-8">
          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <p className="text-green-500 font-medium">
                {selectedItems.length} items updated successfully!
              </p>
            </div>
          )}
          
          {submitError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-500 font-medium">{submitError}</p>
            </div>
          )}

          <form onSubmit={handleBulkUpdateSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block ${textPrimary} font-medium mb-3`}>
                  New Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={bulkUpdateForm.price || ''}
                  onChange={(e) => setBulkUpdateForm(prev => ({ 
                    ...prev, 
                    price: e.target.value ? parseFloat(e.target.value) : undefined 
                  }))}
                  className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                  placeholder="Leave empty to keep current"
                />
              </div>
              <div>
                <label className={`block ${textPrimary} font-medium mb-3`}>
                  New Cost ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={bulkUpdateForm.cost || ''}
                  onChange={(e) => setBulkUpdateForm(prev => ({ 
                    ...prev, 
                    cost: e.target.value ? parseFloat(e.target.value) : undefined 
                  }))}
                  className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                  placeholder="Leave empty to keep current"
                />
              </div>
            </div>
            
            <div>
              <label className={`block ${textPrimary} font-medium mb-3`}>
                New Category
              </label>
              {categoriesLoading ? (
                <div className={`flex items-center gap-2 ${textSecondary}`}>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading categories...</span>
                </div>
              ) : (
                <select 
                  value={bulkUpdateForm.category_id}
                  onChange={(e) => setBulkUpdateForm(prev => ({ ...prev, category_id: e.target.value }))}
                  className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                >
                  <option value="">Keep current category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            
            <div>
              <label className={`block ${textPrimary} font-medium mb-3`}>New Description</label>
              <textarea
                rows={3}
                value={bulkUpdateForm.description}
                onChange={(e) => setBulkUpdateForm(prev => ({ ...prev, description: e.target.value }))}
                className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200 resize-none`}
                placeholder="Leave empty to keep current description"
              />
            </div>
            
            <div>
              <label className={`block ${textPrimary} font-medium mb-3`}>New Image URL</label>
              <input
                type="url"
                value={bulkUpdateForm.image_url}
                onChange={(e) => setBulkUpdateForm(prev => ({ ...prev, image_url: e.target.value }))}
                className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                placeholder="Leave empty to keep current image"
              />
            </div>
            
            <div>
              <label className={`block ${textPrimary} font-medium mb-3`}>Availability</label>
              <select
                value={bulkUpdateForm.is_available === undefined ? '' : bulkUpdateForm.is_available.toString()}
                onChange={(e) => setBulkUpdateForm(prev => ({ 
                  ...prev, 
                  is_available: e.target.value === '' ? undefined : e.target.value === 'true'
                }))}
                className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200`}
              >
                <option value="">Keep current availability</option>
                <option value="true">Make Available</option>
                <option value="false">Make Unavailable</option>
              </select>
            </div>
            
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting || categoriesLoading}
                className={`${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535] border-[#3a3a3a]' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'} ${textPrimary} px-8 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border shadow-lg hover:shadow-xl hover:scale-105`}
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Updating...' : `Update ${selectedItems.length} Items`}
              </button>
              <button
                type="button"
                onClick={onBack}
                disabled={isSubmitting}
                className={`${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535]' : 'bg-gray-200 hover:bg-gray-300'} ${textPrimary} px-8 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl hover:scale-105`}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )

  return (
    <div className={`flex-1 ${mainPanelBg} h-screen overflow-y-auto transition-colors duration-300`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {normalizedFormType === 'bulk-update' ? renderBulkUpdateForm() :
       (normalizedFormType === 'menu-item' || normalizedFormType === 'edit-menu-item') ? renderMenuItemForm() : renderCategoryForm()}
    </div>
  )
}