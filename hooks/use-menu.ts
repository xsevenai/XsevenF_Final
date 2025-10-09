// hooks/use-menu.ts

import { useState, useEffect } from 'react'
import { MenuManagementService } from '@/src/api/generated/services/MenuManagementService'
import { MenuItem } from '@/src/api/generated/models/MenuItem'
import { MenuCategory } from '@/src/api/generated/models/MenuCategory'
import { MenuItemCreate } from '@/src/api/generated/models/MenuItemCreate'
import { MenuItemUpdate } from '@/src/api/generated/models/MenuItemUpdate'
import { MenuCategoryCreate } from '@/src/api/generated/models/MenuCategoryCreate' // Add this import
import { MenuCategoryUpdate } from '@/src/api/generated/models/MenuCategoryUpdate' // Add this import
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

  const updateItem = async (itemId: string, data: MenuItemUpdate) => {
    try {
      setError(null)
      configureAPI()
      
      const updatedItem = await MenuManagementService.updateMenuItemApiV1MenuItemsItemIdPut(
        itemId,
        data
      )
      
      setItems(prev => prev.map(item => 
        item.id === itemId ? updatedItem : item
      ))
      return updatedItem
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update menu item'
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

  return {
    items,
    loading,
    error,
    refresh,
    createItem,
    updateItem,
    deleteItem,
    getItem,
    duplicateItem
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

// Combined hook for both items and categories
export function useMenu(businessId: string, filters?: MenuItemFilters) {
  const itemsHook = useMenuItems(businessId, filters)
  const categoriesHook = useMenuCategories(businessId)

  const refreshAll = () => {
    itemsHook.refresh()
    categoriesHook.refresh()
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
    
    // Combined
    refreshAll,
    loading: itemsHook.loading || categoriesHook.loading,
    error: itemsHook.error || categoriesHook.error
  }
}