// app/dashboard/components/MenuComponent.tsx

"use client"

import { useState } from 'react'
import { Edit, Trash2, Plus } from 'lucide-react'
import { Card } from '@/components/ui/card'
import MenuForms from './MenuForms' // Import MenuForms directly
import { menuAPI, MenuItem, MenuCategory } from '@/lib/menu-api'
import type { ExpandedViewType } from './types'

interface MenuComponentProps {
  menuItems: MenuItem[]
  categories: MenuCategory[]
  onRefresh: () => void
}

export default function MenuComponent({ menuItems, categories, onRefresh }: MenuComponentProps) {
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
      {/* Header with Add Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Menu Management</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setExpandedView('add-category')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </button>
          <button
            onClick={() => setExpandedView('add-menu-item')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            Add Menu Item
          </button>
        </div>
      </div>

      {/* Categories Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Card key={category.id} className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-white font-medium">{category.name}</h4>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="text-gray-400 hover:text-white p-1 transition-colors"
                    title="Edit Category"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    disabled={isDeleting === category.id}
                    className="text-gray-400 hover:text-red-400 p-1 transition-colors disabled:opacity-50"
                    title="Delete Category"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {category.description && (
                <p className="text-gray-400 text-sm">{category.description}</p>
              )}
              <div className="mt-2 text-xs text-gray-500">
                {menuItems.filter(item => item.category_id === category.id).length} items
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Menu Items Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Menu Items</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item) => {
            const category = categories.find(cat => cat.id === item.category_id)
            return (
              <Card key={item.id} className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{item.name}</h4>
                    <p className="text-purple-400 font-semibold">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditMenuItem(item)}
                      className="text-gray-400 hover:text-white p-1 transition-colors"
                      title="Edit Menu Item"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMenuItem(item.id)}
                      disabled={isDeleting === item.id}
                      className="text-gray-400 hover:text-red-400 p-1 transition-colors disabled:opacity-50"
                      title="Delete Menu Item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {item.description && (
                  <p className="text-gray-400 text-sm mb-2">{item.description}</p>
                )}
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">{category?.name || 'Uncategorized'}</span>
                  <button
                    onClick={() => handleToggleAvailability(item.id, item.is_available)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      item.is_available
                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                    }`}
                  >
                    {item.is_available ? 'Available' : 'Unavailable'}
                  </button>
                </div>
                
                {item.image_url && (
                  <div className="mt-3">
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
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}