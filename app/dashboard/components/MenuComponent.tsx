// app/dashboard/components/MenuComponent.tsx

"use client"

import { useState } from 'react'
import { Edit, Trash2, Plus, Loader2 } from 'lucide-react'
import MenuForms from './MenuForms'
import { menuAPI, MenuItem, MenuCategory } from '@/lib/menu-api'
import { useTheme } from '@/hooks/useTheme'
import type { ExpandedViewType } from './types'

interface MenuComponentProps {
  menuItems: MenuItem[]
  categories: MenuCategory[]
  onRefresh: () => void
}

export default function MenuComponent({ menuItems, categories, onRefresh }: MenuComponentProps) {
  const { theme, isLoaded: themeLoaded, isDark } = useTheme()
  const [expandedView, setExpandedView] = useState<ExpandedViewType | 'edit-menu-item' | 'edit-category' | null>(null)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleEditMenuItem = (item: MenuItem) => {
    setEditingItem(item)
    setExpandedView('edit-menu-item')
  }

  const handleEditCategory = (category: MenuCategory) => {
    setEditingCategory(category)
    setExpandedView('edit-category')
  }

  const handleDeleteMenuItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return
    
    setIsDeleting(itemId)
    try {
      await menuAPI.deleteMenuItem(itemId)
      onRefresh()
    } catch (error) {
      console.error('Failed to delete menu item:', error)
      alert('Failed to delete menu item. Please try again.')
    } finally {
      setIsDeleting(null)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? This will also delete all items in this category.')) return
    
    setIsDeleting(categoryId)
    try {
      await menuAPI.deleteCategory(categoryId)
      onRefresh()
    } catch (error) {
      console.error('Failed to delete category:', error)
      alert('Failed to delete category. Please try again.')
    } finally {
      setIsDeleting(null)
    }
  }

  const handleCloseEdit = () => {
    setExpandedView(null)
    setEditingItem(null)
    setEditingCategory(null)
  }

  const handleToggleAvailability = async (itemId: string, currentAvailability: boolean) => {
    try {
      await menuAPI.updateItemAvailability(itemId, { is_available: !currentAvailability })
      onRefresh()
    } catch (error) {
      console.error('Failed to toggle availability:', error)
      alert('Failed to update availability. Please try again.')
    }
  }

  // Handle form submissions
  const handleMenuItemCreated = () => {
    onRefresh()
    handleCloseEdit()
  }

  const handleCategoryCreated = () => {
    onRefresh()
    handleCloseEdit()
  }

  const handleMenuItemUpdated = () => {
    onRefresh()
    handleCloseEdit()
  }

  const handleCategoryUpdated = () => {
    onRefresh()
    handleCloseEdit()
  }

  // Show loading while theme is being loaded
  if (!themeLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  // Theme-aware colors
  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'
  const hoverBg = isDark ? 'hover:bg-[#252525]' : 'hover:bg-gray-100'

  // If we have an expanded view, show the appropriate form
  if (expandedView) {
    return (
      <MenuForms
        formType={expandedView as 'menu-item' | 'category' | 'edit-menu-item' | 'edit-category'}
        onBack={handleCloseEdit}
        onMenuItemCreated={handleMenuItemCreated}
        onCategoryCreated={handleCategoryCreated}
        onMenuItemUpdated={handleMenuItemUpdated}
        onCategoryUpdated={handleCategoryUpdated}
        editItem={editingItem || undefined}
        editCategory={editingCategory || undefined}
      />
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header Card */}
      <div className={`${cardBg} rounded-xl p-6 border shadow-lg`}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className={`text-3xl font-semibold ${textPrimary} mb-2`}>Menu Management</h1>
            <p className={`${textSecondary} text-sm`}>Manage your restaurant menu items and categories</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setExpandedView('add-category')}
              className={`${isDark ? 'bg-[#2a2a2a] hover:bg-[#333333] border-[#404040]' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'} ${textPrimary} px-4 py-2 rounded-lg flex items-center gap-2 transition-colors border`}
            >
              <Plus className="h-4 w-4" />
              Add Category
            </button>
            <button
              onClick={() => setExpandedView('add-menu-item')}
              className={`${isDark ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-all`}
            >
              <Plus className="h-4 w-4" />
              Add Menu Item
            </button>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className={`${cardBg} rounded-xl p-6 border shadow-lg`}>
        <h3 className={`text-xl font-semibold ${textPrimary} mb-4`}>Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div key={category.id} className={`${innerCardBg} rounded-lg p-4 ${hoverBg} transition-colors border`}>
              <div className="flex justify-between items-start mb-2">
                <h4 className={`${textPrimary} font-medium`}>{category.name}</h4>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className={`${textSecondary} ${isDark ? 'hover:text-white' : 'hover:text-gray-900'} p-1 transition-colors`}
                    title="Edit Category"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    disabled={isDeleting === category.id}
                    className={`${textSecondary} hover:text-red-400 p-1 transition-colors disabled:opacity-50`}
                    title="Delete Category"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {category.description && (
                <p className={`${textSecondary} text-sm mb-2`}>{category.description}</p>
              )}
              <div className={`mt-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {menuItems.filter(item => item.category_id === category.id).length} items
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Menu Items Section */}
      <div className={`${cardBg} rounded-xl p-6 border shadow-lg`}>
        <h3 className={`text-xl font-semibold ${textPrimary} mb-4`}>Menu Items</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item) => {
            const category = categories.find(cat => cat.id === item.category_id)
            return (
              <div key={item.id} className={`${innerCardBg} rounded-lg p-4 ${hoverBg} transition-colors border`}>
                {item.image_url && (
                  <div className="mb-3">
                    <img 
                      src={item.image_url} 
                      alt={item.name}
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className={`${textPrimary} font-medium`}>{item.name}</h4>
                    <p className="text-green-400 font-semibold text-lg">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditMenuItem(item)}
                      className={`${textSecondary} ${isDark ? 'hover:text-white' : 'hover:text-gray-900'} p-1 transition-colors`}
                      title="Edit Menu Item"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMenuItem(item.id)}
                      disabled={isDeleting === item.id}
                      className={`${textSecondary} hover:text-red-400 p-1 transition-colors disabled:opacity-50`}
                      title="Delete Menu Item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {item.description && (
                  <p className={`${textSecondary} text-sm mb-3`}>{item.description}</p>
                )}
                
                <div className={`flex justify-between items-center text-sm pt-3 border-t ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'}`}>
                  <span className={`${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{category?.name || 'Uncategorized'}</span>
                  <button
                    onClick={() => handleToggleAvailability(item.id, item.is_available)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      item.is_available
                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30'
                        : 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
                    }`}
                  >
                    {item.is_available ? 'Available' : 'Unavailable'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}