// app/dashboard/components/MenuForms.tsx

"use client"

import { ArrowLeft, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { useMenuCategories } from "@/hooks/use-menu"
import { 
  menuAPI, 
  CreateMenuItemData, 
  CreateCategoryData, 
  UpdateMenuItemData,
  UpdateCategoryData,
  MenuItem,
  MenuCategory 
} from "@/lib/menu-api"

interface MenuFormsProps {
  formType: 'menu-item' | 'category' | 'edit-menu-item' | 'edit-category' | 'add-menu-item' | 'add-category'
  onBack: () => void
  onMenuItemCreated?: () => void
  onCategoryCreated?: () => void
  onMenuItemUpdated?: () => void
  onCategoryUpdated?: () => void
  editItem?: MenuItem  // For editing existing menu item
  editCategory?: MenuCategory  // For editing existing category
}

export default function MenuForms({ 
  formType, 
  onBack, 
  onMenuItemCreated,
  onCategoryCreated,
  onMenuItemUpdated,
  onCategoryUpdated,
  editItem,
  editCategory 
}: MenuFormsProps) {
  const { categories, loading: categoriesLoading } = useMenuCategories()
  
  // Normalize form type for consistent handling
  const normalizedFormType = formType === 'add-menu-item' ? 'menu-item' : 
                            formType === 'add-category' ? 'category' : 
                            formType
  
  // Form states
  const [menuItemForm, setMenuItemForm] = useState<CreateMenuItemData>({
    name: '',
    description: '',
    price: 0,
    category_id: '',
    image_url: '',
    is_available: true,
    sort_order: 0
  })
  
  const [categoryForm, setCategoryForm] = useState<CreateCategoryData>({
    name: '',
    description: ''
  })

  // Initialize form with edit data when component mounts or editItem/editCategory changes
  useEffect(() => {
    if ((normalizedFormType === 'edit-menu-item') && editItem) {
      setMenuItemForm({
        name: editItem.name,
        description: editItem.description || '',
        price: editItem.price,
        category_id: editItem.category_id,
        image_url: editItem.image_url || '',
        is_available: editItem.is_available,
        sort_order: editItem.sort_order
      })
    }
  }, [normalizedFormType, editItem])

  useEffect(() => {
    if ((normalizedFormType === 'edit-category') && editCategory) {
      setCategoryForm({
        name: editCategory.name,
        description: editCategory.description || ''
      })
    }
  }, [normalizedFormType, editCategory])
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

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
        // Update existing menu item
        const updateData: UpdateMenuItemData = {
          name: menuItemForm.name,
          description: menuItemForm.description || undefined,
          price: menuItemForm.price,
          category_id: menuItemForm.category_id,
          image_url: menuItemForm.image_url || undefined,
          is_available: menuItemForm.is_available,
          sort_order: menuItemForm.sort_order
        }
        
        await menuAPI.updateMenuItem(editItem.id, updateData)
        setSubmitSuccess(true)
        
        // Notify parent component to refresh menu items
        if (onMenuItemUpdated) {
          onMenuItemUpdated()
        }
      } else {
        // Create new menu item
        await menuAPI.createMenuItem(menuItemForm)
        setSubmitSuccess(true)
        setMenuItemForm({
          name: '',
          description: '',
          price: 0,
          category_id: '',
          image_url: '',
          is_available: true,
          sort_order: 0
        })
        
        // Notify parent component to refresh menu items
        if (onMenuItemCreated) {
          onMenuItemCreated()
        }
      }
      
      // Auto-close after success
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
        const updateData: UpdateCategoryData = {
          name: categoryForm.name,
          description: categoryForm.description || undefined
        }
        
        await menuAPI.updateCategory(editCategory.id, updateData)
        setSubmitSuccess(true)
        
        // Notify parent component to refresh categories
        if (onCategoryUpdated) {
          onCategoryUpdated()
        }
      } else {
        // Create new category
        await menuAPI.createCategory(categoryForm)
        setSubmitSuccess(true)
        setCategoryForm({
          name: '',
          description: ''
        })
        
        // Notify parent component to refresh categories
        if (onCategoryCreated) {
          onCategoryCreated()
        }
      }
      
      // Auto-close after success
      setTimeout(() => {
        onBack()
      }, 1500)
      
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : `Failed to ${normalizedFormType === 'edit-category' ? 'update' : 'create'} category`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderMenuItemForm = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          {normalizedFormType === 'edit-menu-item' ? 'Edit Menu Item' : 'Add New Menu Item'}
        </h2>
      </div>

      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
        {submitSuccess && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-green-400">
              Menu item {normalizedFormType === 'edit-menu-item' ? 'updated' : 'created'} successfully!
            </p>
          </div>
        )}
        
        {submitError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400">{submitError}</p>
          </div>
        )}

        <form onSubmit={handleMenuItemSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white font-medium mb-2">
                Item Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={menuItemForm.name}
                onChange={(e) => setMenuItemForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                placeholder="Enter item name"
                required
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-2">
                Price ($) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={menuItemForm.price || ''}
                onChange={(e) => setMenuItemForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                placeholder="0.00"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">
              Category <span className="text-red-400">*</span>
            </label>
            {categoriesLoading ? (
              <div className="flex items-center gap-2 text-gray-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading categories...</span>
              </div>
            ) : (
              <select 
                value={menuItemForm.category_id}
                onChange={(e) => setMenuItemForm(prev => ({ ...prev, category_id: e.target.value }))}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
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
            <label className="block text-white font-medium mb-2">Description</label>
            <textarea
              rows={4}
              value={menuItemForm.description}
              onChange={(e) => setMenuItemForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
              placeholder="Enter item description"
            />
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">Image URL</label>
            <input
              type="url"
              value={menuItemForm.image_url}
              onChange={(e) => setMenuItemForm(prev => ({ ...prev, image_url: e.target.value }))}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_available"
              checked={menuItemForm.is_available}
              onChange={(e) => setMenuItemForm(prev => ({ ...prev, is_available: e.target.checked }))}
              className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
            />
            <label htmlFor="is_available" className="text-white font-medium">
              Available for orders
            </label>
          </div>
          
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting || categoriesLoading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? (normalizedFormType === 'edit-menu-item' ? 'Updating...' : 'Adding...') : (normalizedFormType === 'edit-menu-item' ? 'Update Menu Item' : 'Add Menu Item')}
            </button>
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </Card>
    </div>
  )

  const renderCategoryForm = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          {normalizedFormType === 'edit-category' ? 'Edit Category' : 'Add New Category'}
        </h2>
      </div>

      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
        {submitSuccess && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-green-400">
              Category {normalizedFormType === 'edit-category' ? 'updated' : 'created'} successfully!
            </p>
          </div>
        )}
        
        {submitError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400">{submitError}</p>
          </div>
        )}

        <form onSubmit={handleCategorySubmit} className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-2">
              Category Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={categoryForm.name}
              onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
              placeholder="Enter category name"
              required
            />
          </div>
          <div>
            <label className="block text-white font-medium mb-2">Description</label>
            <textarea
              rows={3}
              value={categoryForm.description}
              onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
              placeholder="Enter category description"
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? (normalizedFormType === 'edit-category' ? 'Updating...' : 'Adding...') : (normalizedFormType === 'edit-category' ? 'Update Category' : 'Add Category')}
            </button>
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </Card>
    </div>
  )

  return (normalizedFormType === 'menu-item' || normalizedFormType === 'edit-menu-item') ? renderMenuItemForm() : renderCategoryForm()
}