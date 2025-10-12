// app/dashboard/components/MenuComponent.tsx

"use client"

import { useState } from 'react'
import { Edit, Trash2, Plus, Loader2, Search, Copy, Settings, X, ArrowLeft, Upload, Download, BarChart3, Filter } from 'lucide-react'
import MenuForms from './MenuForms'
import MenuImportExportComponent from './MenuImportExportComponent'
import MenuAnalyticsComponent from './MenuAnalyticsComponent'
import MenuSearchComponent from './MenuSearchComponent'
import { useTheme } from '@/hooks/useTheme'
import { useMenu } from '@/hooks/use-menu'
import { configureAPI } from '@/lib/api-config'
import type { MenuItem } from '@/src/api/generated/models/MenuItem'
import type { MenuCategory } from '@/src/api/generated/models/MenuCategory'
import type { ExpandedViewType } from '../components/types'

interface MenuComponentProps {
  menuItems: MenuItem[]
  categories: MenuCategory[]
  onRefresh: () => void
}

export default function MenuComponent({ menuItems, categories, onRefresh }: MenuComponentProps) {
  const { theme, isLoaded: themeLoaded, isDark } = useTheme()
  const [expandedView, setExpandedView] = useState<ExpandedViewType | 'edit-menu-item' | 'edit-category' | 'import-export' | 'analytics' | 'advanced-search' | null>(null)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'items' | 'categories'>('items')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItemForModifiers, setSelectedItemForModifiers] = useState<MenuItem | null>(null)
  
  const businessId = typeof window !== "undefined" ? localStorage.getItem("businessId") || "" : ""
  
  const { deleteItem, deleteCategory, duplicateItem, modifiers, assignModifierToItem, removeModifierFromItem } = useMenu(businessId)

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
      configureAPI()
      await deleteItem(itemId, true)
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
      configureAPI()
      await deleteCategory(categoryId)
      onRefresh()
    } catch (error) {
      console.error('Failed to delete category:', error)
      alert('Failed to delete category. Please try again.')
    } finally {
      setIsDeleting(null)
    }
  }

  const handleDuplicateMenuItem = async (item: MenuItem) => {
    try {
      configureAPI()
      await duplicateItem(item.id)
      onRefresh()
    } catch (error) {
      console.error('Failed to duplicate menu item:', error)
      alert('Failed to duplicate menu item. Please try again.')
    }
  }

  const handleCloseEdit = () => {
    setExpandedView(null)
    setEditingItem(null)
    setEditingCategory(null)
  }

  const handleToggleAvailability = async (itemId: string, currentAvailability: boolean) => {
    try {
      configureAPI()
      const { updateItem } = useMenu('')
      await updateItem(itemId, {
        is_available: !currentAvailability
      })
      onRefresh()
    } catch (error) {
      console.error('Failed to toggle availability:', error)
      alert('Failed to update availability. Please try again.')
    }
  }

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

  const handleManageModifiers = (item: MenuItem) => {
    setSelectedItemForModifiers(item)
    setExpandedView('manage-item-modifiers')
  }

  const handleAssignModifier = async (modifierId: string) => {
    if (!selectedItemForModifiers) return
    
    try {
      await assignModifierToItem(selectedItemForModifiers.id, modifierId, 0)
      onRefresh()
      alert('Modifier assigned successfully!')
    } catch (error: any) {
      console.error('Failed to assign modifier:', error)
      alert(error.message || 'Failed to assign modifier. Please try again.')
    }
  }

  const handleRemoveModifier = async (modifierId: string) => {
    if (!selectedItemForModifiers) return
    
    try {
      await removeModifierFromItem(selectedItemForModifiers.id, modifierId)
      onRefresh()
      alert('Modifier removed successfully!')
    } catch (error: any) {
      console.error('Failed to remove modifier:', error)
      alert(error.message || 'Failed to remove modifier. Please try again.')
    }
  }

  const handleCloseModifierManagement = () => {
    setExpandedView(null)
    setSelectedItemForModifiers(null)
  }

  if (!themeLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'
  
  // All 3 buttons: white if dark, dark if light
  const topButtonBg = isDark 
    ? 'bg-white text-gray-900 hover:bg-gray-100 border-gray-300' 
    : 'bg-gray-900 text-white hover:bg-gray-800 border-gray-700'

  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (expandedView) {
    if (expandedView === 'import-export') {
      return <MenuImportExportComponent onBack={handleCloseEdit} />
    }
    
    if (expandedView === 'analytics') {
      return <MenuAnalyticsComponent onBack={handleCloseEdit} />
    }
    
    if (expandedView === 'manage-item-modifiers') {
      return (
        <div className="p-6 space-y-6">
          <div className={`${cardBg} p-8 border shadow-lg transition-colors duration-300`} style={{ borderRadius: "1.5rem" }}>
            <div className="flex items-center gap-4">
              <button
                onClick={handleCloseModifierManagement}
                className={`${textSecondary} ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-200'} p-2 rounded-xl transition-all duration-200 hover:scale-110`}
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className={`text-4xl font-bold ${textPrimary} mb-2 transition-colors duration-300`}>
                  Manage Modifiers for "{selectedItemForModifiers?.name}"
                </h1>
                <p className={`${textSecondary} transition-colors duration-300`}>
                  Assign or remove modifiers for this menu item
                </p>
              </div>
            </div>
          </div>

          <div className={`${cardBg} p-6 border shadow-lg transition-colors duration-300`} style={{ borderRadius: "1.5rem" }}>
            <div className="space-y-4">
              <div>
                <h4 className={`text-lg font-semibold ${textPrimary} mb-3`}>Available Modifiers</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {modifiers.map((modifier: any) => (
                    <div
                      key={modifier.id}
                      className={`${innerCardBg} p-4 border rounded-lg flex items-center justify-between`}
                    >
                      <div>
                        <h5 className={`${textPrimary} font-medium`}>{modifier.name}</h5>
                        <p className={`${textSecondary} text-sm`}>
                          {modifier.required ? 'Required' : 'Optional'} • {modifier.type}
                        </p>
                        <p className={`${textSecondary} text-xs`}>
                          {modifier.options?.length || 0} options
                        </p>
                      </div>
                      <button
                        onClick={() => handleAssignModifier(modifier.id)}
                        className={`${isDark ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-300`}
                      >
                        <Plus className="h-4 w-4 inline mr-1" />
                        Assign
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className={`text-lg font-semibold ${textPrimary} mb-3`}>Assigned Modifiers</h4>
                <div className={`${innerCardBg} p-4 border rounded-lg`}>
                  <p className={`${textSecondary} text-sm`}>
                    Assigned modifiers will appear here once the backend endpoints are implemented.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

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
      <div className={`${cardBg} p-8 border shadow-lg transition-colors duration-300`} style={{ borderRadius: '1.5rem' }}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className={`text-4xl font-bold ${textPrimary} mb-2 transition-colors duration-300`}>Menu Management</h1>
            <p className={`${textSecondary} transition-colors duration-300`}>Manage your restaurant menu items and categories</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setExpandedView('import-export')}
              className={`${topButtonBg} px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:shadow-xl hover:scale-105 transition-all border font-medium`}
            >
              <Upload className="h-4 w-4" />
              Import/Export
            </button>
            <button
              onClick={() => setExpandedView('add-category')}
              className={`${topButtonBg} px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:shadow-xl hover:scale-105 transition-all border font-medium`}
            >
              <Plus className="h-4 w-4" />
              Add Category
            </button>
            <button
              onClick={() => setExpandedView('add-menu-item')}
              className={`${topButtonBg} px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-2xl hover:scale-110 transition-all border font-medium`}
            >
              <Plus className="h-4 w-4" />
              Add Menu Item
            </button>
          </div>
        </div>
        <div className="mt-6">
          <div className="relative">
            <input
              type="text"
              placeholder={`Search ${activeTab === 'items' ? 'menu items' : 'categories'}...`}
              value={searchTerm}
              onChange={e => setSearchTerm(e.currentTarget.value)}
              onKeyDown={e => e.key === 'Enter' && setSearchTerm(e.currentTarget.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-300
                ${isDark ? 'bg-[#222] text-white border-[#444] focus:border-purple-500 focus:ring-purple-500/50' : 'bg-gray-100 text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500/50'}
              `}
            />
            <Search className={`absolute left-3 top-3.5 h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
        </div>
      </div>

      <div className={`${cardBg} p-2 border shadow-lg flex gap-2 transition-colors duration-300 w-fit`} style={{ borderRadius: '1.5rem' }}>
        <button
          onClick={() => setActiveTab('items')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
            activeTab === 'items'
              ? isDark ? 'bg-white text-gray-900 border-gray-300 shadow-md' : 'bg-gray-900 text-white border-gray-700 shadow-md'
              : isDark ? 'bg-[#1f1f1f] text-gray-400 border-[#2a2a2a]' : 'bg-white text-gray-600 border-gray-200'
          } hover:shadow-md`}
        >
          Menu Items ({menuItems.length})
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
            activeTab === 'categories'
              ? isDark ? 'bg-white text-gray-900 border-gray-300 shadow-md' : 'bg-gray-900 text-white border-gray-700 shadow-md'
              : isDark ? 'bg-[#1f1f1f] text-gray-400 border-[#2a2a2a]' : 'bg-white text-gray-600 border-gray-200'
          } hover:shadow-md`}
        >
          Categories ({categories.length})
        </button>
      </div>

      {activeTab === 'items' ? (
        <div className={`${cardBg} p-6 border shadow-lg transition-colors duration-300`} style={{ borderRadius: '1.5rem' }}>
          <h2 className={`text-xl font-bold ${textPrimary} mb-6 transition-colors duration-300`}>All Menu Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMenuItems.map((item, index) => {
              const category = categories.find(cat => cat.id === item.category_id)
              return (
                <div
                  key={item.id}
                  className={`${innerCardBg} p-5 border hover:shadow-xl cursor-pointer transition-all duration-300`}
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
                  <div className={`w-full h-36 mb-4 ${isDark ? 'bg-gray-800' : 'bg-gray-200'} rounded-xl overflow-hidden transition-colors duration-300`}>
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none' }}
                      />
                    )}
                  </div>

                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className={`${textPrimary} font-semibold text-base mb-1 transition-colors duration-300`}>{item.name}</h4>
                      <p className={`${isDark ? 'text-green-400' : 'text-green-600'} font-bold text-xl`}>
                        ${(parseFloat(String(item.price)) || 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => handleEditMenuItem(item)} 
                        className={`${textSecondary} ${isDark ? 'hover:text-white' : 'hover:text-gray-900'} p-1 transition-colors duration-300`} 
                        title="Edit Menu Item"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleManageModifiers(item)} 
                        className={`${textSecondary} hover:text-purple-400 p-1 transition-colors duration-300`} 
                        title="Manage Modifiers"
                      >
                        <Settings className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteMenuItem(item.id)} 
                        disabled={isDeleting === item.id} 
                        className={`${textSecondary} hover:text-red-400 p-1 transition-colors duration-300 disabled:opacity-50`} 
                        title="Delete Menu Item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicateMenuItem(item)}
                        className={`${textSecondary} hover:text-blue-400 p-1 transition-colors duration-300`}
                        title="Duplicate Menu Item"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {item.description && (
                    <p className={`${textSecondary} text-sm mb-3 transition-colors duration-300`}>{item.description}</p>
                  )}

                  <div className={`mt-3 pt-3 border-t ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'} transition-colors duration-300`}>
                    <span className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'} transition-colors duration-300`}>
                      {category?.name || 'Uncategorized'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className={`${cardBg} p-6 border shadow-lg transition-colors duration-300`} style={{ borderRadius: '1.5rem' }}>
          <h2 className={`text-xl font-bold ${textPrimary} mb-6 transition-colors duration-300`}>All Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCategories.map((category, index) => (
              <div 
                key={category.id} 
                className={`${innerCardBg} p-5 border hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02]`}
                style={{ 
                  borderRadius: index % 3 === 0 ? '1.5rem' : index % 3 === 1 ? '2rem' : '1rem'
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className={`${textPrimary} font-semibold text-base transition-colors duration-300`}>{category.name}</h4>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className={`${textSecondary} ${isDark ? 'hover:text-white' : 'hover:text-gray-900'} p-1 transition-colors duration-300`}
                      title="Edit Category"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      disabled={isDeleting === category.id}
                      className={`${textSecondary} hover:text-red-400 p-1 transition-colors duration-300 disabled:opacity-50`}
                      title="Delete Category"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {category.description && (
                  <p className={`${textSecondary} text-sm mb-3 transition-colors duration-300`}>{category.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium ${category.is_active ? 'text-green-500' : 'text-red-500'}`}>
                    {category.is_active ? 'Active' : 'Inactive'}
                  </span>
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