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
  const [activeTab, setActiveTab] = useState<'items' | 'categories'>('items')

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
      <div className={`${cardBg} p-8 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>Menu Management</h1>
            <p className={`${textSecondary}`}>Manage your restaurant menu items and categories</p>
          </div>
          <div className="flex gap-3">
{/* Add Category Button */}
{/* Add Category */}
<button
  onClick={() => setExpandedView('add-category')}
  className={`bg-gradient-to-r from-[#1a1a1a] via-[#222222] to-[#2a2a2a]
    hover:from-[#222222] hover:via-[#2a2a2a] hover:to-[#333333]
    text-white px-4 py-2 rounded-lg flex items-center gap-2
    shadow-md hover:shadow-xl hover:scale-105 transition-all border border-[#333333]`}
>
  <Plus className="h-4 w-4" />
  Add Category
</button>

{/* Add Menu Item */}
<button
  onClick={() => setExpandedView('add-menu-item')}
  className={`bg-gradient-to-r from-[#0f0f0f] via-[#1a1a1a] to-[#2a2a2a]
    hover:from-[#1a1a1a] hover:via-[#222222] hover:to-[#333333]
    text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2
    shadow-lg hover:shadow-2xl hover:scale-110 transition-all border border-[#444444]`}
>
  <Plus className="h-4 w-4" />
  Add Menu Item
</button>



          </div>
        </div>
      </div>

{/* Tabs Navigation */}
<div className={`${cardBg} p-3 border shadow-lg flex gap-2`} style={{ borderRadius: '1.5rem' }}>
  {/* Menu Items Tab */}
  <button
    onClick={() => setActiveTab('items')}
    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all border
      ${activeTab === 'items'
        ? 'bg-gradient-to-r from-[#0f0f0f] via-[#1a1a1a] to-[#2a2a2a] text-white shadow-md border-[#444444]'
        : 'bg-gradient-to-r from-[#1a1a1a] via-[#1f1f1f] to-[#2a2a2a] text-gray-300 border-[#333333]'
      }
      hover:from-[#1a1a1a] hover:via-[#222222] hover:to-[#333333] hover:shadow-md
    `}
  >
    Menu Items ({menuItems.length})
  </button>

  {/* Categories Tab */}
  <button
    onClick={() => setActiveTab('categories')}
    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all border
      ${activeTab === 'categories'
        ? 'bg-gradient-to-r from-[#0f0f0f] via-[#1a1a1a] to-[#2a2a2a] text-white shadow-md border-[#444444]'
        : 'bg-gradient-to-r from-[#1a1a1a] via-[#1f1f1f] to-[#2a2a2a] text-gray-300 border-[#333333]'
      }
      hover:from-[#1a1a1a] hover:via-[#222222] hover:to-[#333333] hover:shadow-md
    `}
  >
    Categories ({categories.length})
  </button>
</div>



      {/* Content Based on Active Tab */}
      {/* Menu items */}
      {activeTab === 'items' ? (
<div className={`${cardBg} p-6 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
  <h2 className={`text-xl font-bold ${textPrimary} mb-6`}>All Menu Items</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {menuItems.map((item, index) => {
      const category = categories.find(cat => cat.id === item.category_id)
      return (
<div
  key={item.id}
  className={`${innerCardBg} p-5 border hover:shadow-xl cursor-pointer`}
  style={{
    borderRadius:
      index % 4 === 0
        ? '2rem'
        : index % 4 === 1
        ? '1rem'
        : index % 4 === 2
        ? '1.5rem'
        : '2.5rem',
  }}
>
  {/* Image placeholder like Categories */}
  <div className="w-full h-36 mb-4 bg-gray-800 rounded-xl overflow-hidden">
    {item.image_url && (
      <img
        src={item.image_url}
        alt={item.name}
        className="w-full h-full object-cover"
        onError={(e) => { e.currentTarget.style.display = 'none' }}
      />
    )}
  </div>

  {/* Name + price */}
  <div className="flex justify-between items-start mb-3">
    <div className="flex-1">
      <h4 className={`${textPrimary} font-semibold text-base mb-1`}>{item.name}</h4>
      <p className="text-green-400 font-bold text-xl">${item.price.toFixed(2)}</p>
    </div>
    <div className="flex gap-1">
      <button onClick={() => handleEditMenuItem(item)} className={`${textSecondary} p-1`} title="Edit Menu Item">
        <Edit className="h-4 w-4" />
      </button>
      <button onClick={() => handleDeleteMenuItem(item.id)} disabled={isDeleting === item.id} className={`${textSecondary} p-1`} title="Delete Menu Item">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  </div>

  {/* Description */}
  {item.description && (
    <p className={`${textSecondary} text-sm mb-3`}>{item.description}</p>
  )}

  {/* Footer like Categories */}
  <div className={`mt-3 pt-3 border-t ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'}`}>
    <span className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
      {categories.find(cat => cat.id === item.category_id)?.name || 'Uncategorized'}
    </span>
  </div>
</div>

      )
    })}
  </div>
</div>

      ) : (
        /* Categories Section */
        <div className={`${cardBg} p-6 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
          <h2 className={`text-xl font-bold ${textPrimary} mb-6`}>All Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <div 
                key={category.id} 
                className={`${innerCardBg} p-5 border hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02]`}
                style={{ 
                  borderRadius: index % 3 === 0 ? '1.5rem' : index % 3 === 1 ? '2rem' : '1rem'
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className={`${textPrimary} font-semibold text-base`}>{category.name}</h4>
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
                  <p className={`${textSecondary} text-sm mb-3`}>{category.description}</p>
                )}
                <div className={`mt-3 pt-3 border-t ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'}`}>
                  <span className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {menuItems.filter(item => item.category_id === category.id).length} items
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}