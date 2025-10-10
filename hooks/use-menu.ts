// hooks/use-menu.ts

import { useState, useEffect } from 'react'
import { MenuManagementService } from '@/src/api/generated/services/MenuManagementService'
import { MenuItem } from '@/src/api/generated/models/MenuItem'
import { MenuCategory } from '@/src/api/generated/models/MenuCategory'
import { MenuItemCreate } from '@/src/api/generated/models/MenuItemCreate'
import { MenuItemUpdate } from '@/src/api/generated/models/MenuItemUpdate'
import { MenuCategoryCreate } from '@/src/api/generated/models/MenuCategoryCreate' // Add this import
import { MenuCategoryUpdate } from '@/src/api/generated/models/MenuCategoryUpdate' // Add this import
import { ItemModifier } from '@/src/api/generated/models/ItemModifier'
import { ItemModifierCreate } from '@/src/api/generated/models/ItemModifierCreate'
import { ItemModifierUpdate } from '@/src/api/generated/models/ItemModifierUpdate'
import { MenuImport } from '@/src/api/generated/models/MenuImport'
import { BulkMenuItemUpdate } from '@/src/api/generated/models/BulkMenuItemUpdate'
import { MenuItemSearch } from '@/src/api/generated/models/MenuItemSearch'
import { configureAPI } from '@/lib/api-config'

interface MenuItemFilters {
  categoryId?: string
  isAvailable?: boolean
  search?: string
}

// Menu Items Hook
export function useMenuItems(businessId: string, filters?: MenuItemFilters) {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = async () => {
    try {
      setLoading(true)
      setError(null)
      
      configureAPI()
      
      const data = await MenuManagementService.listMenuItemsApiV1MenuItemsGet(
        businessId,
        filters?.categoryId || null,
        filters?.isAvailable !== undefined ? filters.isAvailable : null,
        filters?.search || null,
        50, // limit
        0   // offset
      )
      
      setItems(data)
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch menu items'
      setError(errorMessage)
      console.error('Error fetching menu items:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (businessId) {
      fetchItems()
    }
  }, [businessId, filters?.categoryId, filters?.isAvailable, filters?.search])

  const refresh = () => {
    if (businessId) {
      fetchItems()
    }
  }

  const createItem = async (data: MenuItemCreate) => {
    try {
      setError(null)
      configureAPI()
      
      const newItem = await MenuManagementService.createMenuItemApiV1MenuItemsPost(data)
      setItems(prev => [newItem, ...prev])
      return newItem
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create menu item'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

// In your use-menu.ts hook, update the updateItem function:
const updateItem = async (itemId: string, data: MenuItemUpdate) => {
  try {
    setError(null)
    configureAPI()
    
    console.log('🔄 Updating menu item:', { itemId, data })
    
    const updatedItem = await MenuManagementService.updateMenuItemApiV1MenuItemsItemIdPut(
      itemId,
      data
    )
    
    console.log('✅ Menu item updated successfully:', updatedItem)
    
    setItems(prev => prev.map(item => 
      item.id === itemId ? updatedItem : item
    ))
    return updatedItem
  } catch (err: any) {
    console.error('❌ Error updating menu item:', {
      message: err.message,
      status: err.status,
      body: err.body,
      url: err.url
    })
    const errorMessage = err.body?.detail || err.message || 'Failed to update menu item'
    setError(errorMessage)
    throw new Error(errorMessage)
  }
}

  const deleteItem = async (itemId: string, softDelete: boolean = true) => {
    try {
      setError(null)
      configureAPI()
      
      await MenuManagementService.deleteMenuItemApiV1MenuItemsItemIdDelete(itemId, softDelete)
      setItems(prev => prev.filter(item => item.id !== itemId))
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete menu item'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const getItem = async (itemId: string, includeModifiers: boolean = true) => {
    try {
      configureAPI()
      return await MenuManagementService.getMenuItemApiV1MenuItemsItemIdGet(
        itemId,
        includeModifiers
      )
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get menu item'
      throw new Error(errorMessage)
    }
  }

  const duplicateItem = async (itemId: string, newName?: string) => {
    try {
      setError(null)
      configureAPI()
      
      const duplicated = await MenuManagementService.duplicateMenuItemApiV1MenuItemsItemIdDuplicatePost(
        itemId,
        newName || null
      )
      
      setItems(prev => [duplicated, ...prev])
      return duplicated
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to duplicate menu item'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const searchItems = async (searchCriteria: MenuItemSearch) => {
    try {
      setError(null)
      configureAPI()
      
      const results = await MenuManagementService.searchMenuItemsApiV1MenuItemsSearchPost(searchCriteria)
      return results
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to search menu items'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const bulkUpdateItems = async (bulkUpdate: BulkMenuItemUpdate) => {
    try {
      setError(null)
      configureAPI()
      
      const result = await MenuManagementService.bulkUpdateMenuItemsApiV1MenuItemsBulkUpdatePost(bulkUpdate)
      
      // Refresh items to get updated data
      refresh()
      return result
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to bulk update menu items'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  return {
    items,
    loading,
    error,
    refresh,
    createItem,
    updateItem,
    deleteItem,
    getItem,
    duplicateItem,
    searchItems,
    bulkUpdateItems
  }
}

// Menu Categories Hook
export function useMenuCategories(businessId: string) {
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      
      configureAPI()
      
      const data = await MenuManagementService.listMenuCategoriesApiV1MenuCategoriesGet(
        businessId,
        null, // parent_id
        true  // is_active (only active categories)
      )
      
      setCategories(data)
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch categories'
      setError(errorMessage)
      console.error('Error fetching categories:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (businessId) {
      fetchCategories()
    }
  }, [businessId])

  const refresh = () => {
    if (businessId) {
      fetchCategories()
    }
  }

  // ADD THESE MISSING METHODS:
  const createCategory = async (data: MenuCategoryCreate) => {
    try {
      setError(null)
      configureAPI()
      
      const newCategory = await MenuManagementService.createMenuCategoryApiV1MenuCategoriesPost(data)
      setCategories(prev => [newCategory, ...prev])
      return newCategory
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create category'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const updateCategory = async (categoryId: string, data: MenuCategoryUpdate) => {
    try {
      setError(null)
      configureAPI()
      
      const updatedCategory = await MenuManagementService.updateMenuCategoryApiV1MenuCategoriesCategoryIdPut(
        categoryId,
        data
      )
      
      setCategories(prev => prev.map(cat => 
        cat.id === categoryId ? updatedCategory : cat
      ))
      return updatedCategory
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update category'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const deleteCategory = async (categoryId: string) => {
    try {
      setError(null)
      configureAPI()
      
      await MenuManagementService.deleteMenuCategoryApiV1MenuCategoriesCategoryIdDelete(categoryId)
      setCategories(prev => prev.filter(cat => cat.id !== categoryId))
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete category'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const getCategory = async (categoryId: string) => {
    try {
      configureAPI()
      return await MenuManagementService.getMenuCategoryApiV1MenuCategoriesCategoryIdGet(categoryId)
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get category'
      throw new Error(errorMessage)
    }
  }

  return {
    categories,
    loading,
    error,
    refresh,
    createCategory, // Add this
    updateCategory, // Add this
    deleteCategory,
    getCategory
  }
}

// Menu Modifiers Hook
export function useMenuModifiers(businessId: string) {
  const [modifiers, setModifiers] = useState<ItemModifier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchModifiers = async () => {
    try {
      setLoading(true)
      setError(null)
      configureAPI()
      const data = await MenuManagementService.listItemModifiersApiV1MenuModifiersGet(
        businessId,
        null // modifier_type
      )
      setModifiers(data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch modifiers')
      console.error('Error fetching modifiers:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (businessId) fetchModifiers()
  }, [businessId])

  const createModifier = async (data: ItemModifierCreate) => {
    try {
      setError(null)
      configureAPI()
      const newModifier = await MenuManagementService.createItemModifierApiV1MenuModifiersPost(data)
      setModifiers(prev => [newModifier, ...prev])
      return newModifier
    } catch (err: any) {
      setError(err.message || 'Failed to create modifier')
      throw err
    }
  }

  const updateModifier = async (modifierId: string, data: ItemModifierUpdate) => {
    try {
      setError(null)
      configureAPI()
      const updated = await MenuManagementService.updateItemModifierApiV1MenuModifiersModifierIdPut(
        modifierId,
        data
      )
      setModifiers(prev => prev.map(m => m.id === modifierId ? updated : m))
      return updated
    } catch (err: any) {
      setError(err.message || 'Failed to update modifier')
      throw err
    }
  }

  const deleteModifier = async (modifierId: string) => {
    try {
      setError(null)
      configureAPI()
      await MenuManagementService.deleteItemModifierApiV1MenuModifiersModifierIdDelete(modifierId)
      setModifiers(prev => prev.filter(m => m.id !== modifierId))
    } catch (err: any) {
      setError(err.message || 'Failed to delete modifier')
      throw err
    }
  }

  const getModifier = async (modifierId: string) => {
    try {
      configureAPI()
      return await MenuManagementService.getItemModifierApiV1MenuModifiersModifierIdGet(modifierId)
    } catch (err: any) {
      throw err
    }
  }

  // Assign modifier to menu item
  const assignModifierToItem = async (itemId: string, modifierId: string, displayOrder: number = 0) => {
    try {
      setError(null)
      configureAPI()
      
      const result = await MenuManagementService.assignModifierToItemApiV1MenuItemsItemIdModifiersModifierIdPost(
        itemId,
        modifierId,
        displayOrder
      )
      
      // Refresh modifiers to get updated data
      fetchModifiers()
      return result
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to assign modifier to item'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // Remove modifier from menu item
  const removeModifierFromItem = async (itemId: string, modifierId: string) => {
    try {
      setError(null)
      configureAPI()
      
      await MenuManagementService.removeModifierFromItemApiV1MenuItemsItemIdModifiersModifierIdDelete(
        itemId,
        modifierId
      )
      
      // Refresh modifiers to get updated data
      fetchModifiers()
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to remove modifier from item'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  return {
    modifiers,
    loading,
    error,
    fetchModifiers,
    createModifier,
    updateModifier,
    deleteModifier,
    getModifier,
    assignModifierToItem,
    removeModifierFromItem
  }
}

// Combined hook for items, categories, and modifiers
export function useMenu(businessId: string, filters?: MenuItemFilters) {
  const itemsHook = useMenuItems(businessId, filters)
  const categoriesHook = useMenuCategories(businessId)
  const modifiersHook = useMenuModifiers(businessId)

  const refreshAll = () => {
    itemsHook.refresh()
    categoriesHook.refresh()
    modifiersHook.fetchModifiers()
  }

  return {
    // Items
    items: itemsHook.items,
    itemsLoading: itemsHook.loading,
    itemsError: itemsHook.error,
    refreshItems: itemsHook.refresh,
    createItem: itemsHook.createItem,
    updateItem: itemsHook.updateItem,
    deleteItem: itemsHook.deleteItem,
    getItem: itemsHook.getItem,
    duplicateItem: itemsHook.duplicateItem,
    
    // Categories
    categories: categoriesHook.categories,
    categoriesLoading: categoriesHook.loading,
    categoriesError: categoriesHook.error,
    refreshCategories: categoriesHook.refresh,
    createCategory: categoriesHook.createCategory, // Add this
    updateCategory: categoriesHook.updateCategory, // Add this
    deleteCategory: categoriesHook.deleteCategory,
    getCategory: categoriesHook.getCategory,
    
    // Modifiers
    modifiers: modifiersHook.modifiers,
    modifiersLoading: modifiersHook.loading,
    modifiersError: modifiersHook.error,
    refreshModifiers: modifiersHook.fetchModifiers,
    createModifier: modifiersHook.createModifier,
    updateModifier: modifiersHook.updateModifier,
    deleteModifier: modifiersHook.deleteModifier,
    getModifier: modifiersHook.getModifier,
    assignModifierToItem: modifiersHook.assignModifierToItem,
    removeModifierFromItem: modifiersHook.removeModifierFromItem,
    
    // Additional item methods
    searchItems: itemsHook.searchItems,
    bulkUpdateItems: itemsHook.bulkUpdateItems,
    
    // Combined
    refreshAll,
    loading: itemsHook.loading || categoriesHook.loading || modifiersHook.loading,
    error: itemsHook.error || categoriesHook.error || modifiersHook.error
  }
}

// Menu Import/Export Hook
export function useMenuImportExport(businessId: string) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const importMenu = async (menuImport: MenuImport) => {
    try {
      setLoading(true)
      setError(null)
      configureAPI()
      
      const result = await MenuManagementService.importMenuApiV1MenuImportPost(menuImport)
      return result
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to import menu'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const exportMenu = async (format: 'json' | 'csv' | 'pdf' = 'json', includeInactive: boolean = false) => {
    try {
      setLoading(true)
      setError(null)
      configureAPI()
      
      const result = await MenuManagementService.exportMenuApiV1MenuExportBusinessIdGet(
        businessId,
        format,
        includeInactive
      )
      return result
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to export menu'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    importMenu,
    exportMenu
  }
}

// Menu Analytics Hook
export function useMenuAnalytics(businessId: string) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getTopMenuItems = async (period: '1d' | '7d' | '30d' | '90d' = '7d', limit: number = 10) => {
    try {
      setLoading(true)
      setError(null)
      configureAPI()
      
      const result = await MenuManagementService.getTopMenuItemsApiV1MenuAnalyticsBusinessIdTopItemsGet(
        businessId,
        period,
        limit
      )
      return result
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get top menu items'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryPerformance = async (period: '1d' | '7d' | '30d' | '90d' = '7d') => {
    try {
      setLoading(true)
      setError(null)
      configureAPI()
      
      const result = await MenuManagementService.getCategoryPerformanceApiV1MenuAnalyticsBusinessIdCategoryPerformanceGet(
        businessId,
        period
      )
      return result
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get category performance'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const analyzeProfitMargins = async () => {
    try {
      setLoading(true)
      setError(null)
      configureAPI()
      
      const result = await MenuManagementService.analyzeProfitMarginsApiV1MenuAnalyticsBusinessIdProfitMarginsGet(
        businessId
      )
      return result
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to analyze profit margins'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    getTopMenuItems,
    getCategoryPerformance,
    analyzeProfitMargins
  }
}