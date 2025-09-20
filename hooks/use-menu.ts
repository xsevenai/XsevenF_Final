// hooks/use-menu.ts
import { useState, useEffect } from 'react'
import { 
  menuAPI, 
  MenuItem, 
  MenuCategory, 
  CreateMenuItemData, 
  CreateCategoryData,
  UpdateMenuItemData,
  UpdateCategoryData 
} from '@/lib/menu-api'

export function useMenuItems(filters?: {
  category_id?: string
  is_available?: boolean
  search?: string
}) {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await menuAPI.getMenuItems(filters)
      setItems(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch menu items')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [filters?.category_id, filters?.is_available, filters?.search])

  const refresh = () => {
    fetchItems()
  }

  const createItem = async (data: CreateMenuItemData) => {
    try {
      setError(null)
      const newItem = await menuAPI.createMenuItem(data)
      setItems(prev => [newItem, ...prev])
      return newItem
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create menu item'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const updateItemAvailability = async (id: string, isAvailable: boolean) => {
    try {
      setError(null)
      // Optimistic update
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, is_available: isAvailable } : item
      ))
      
      await menuAPI.updateItemAvailability(id, { is_available: isAvailable })
      
    } catch (err) {
      // Revert optimistic update on error
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, is_available: !isAvailable } : item
      ))
      setError(err instanceof Error ? err.message : 'Failed to update availability')
    }
  }

  const updateItem = async (id: string, data: UpdateMenuItemData) => {
    try {
      setError(null)
      const updatedItem = await menuAPI.updateMenuItem(id, data)
      setItems(prev => prev.map(item => 
        item.id === id ? updatedItem : item
      ))
      return updatedItem
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update menu item'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const deleteItem = async (id: string) => {
    try {
      setError(null)
      await menuAPI.deleteMenuItem(id)
      setItems(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete menu item'
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
    updateItemAvailability,
    deleteItem
  }
}

export function useMenuCategories() {
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await menuAPI.getCategories()
      setCategories(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const refresh = () => {
    fetchCategories()
  }

  const createCategory = async (data: CreateCategoryData) => {
    try {
      setError(null)
      const newCategory = await menuAPI.createCategory(data)
      setCategories(prev => [newCategory, ...prev])
      return newCategory
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create category'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const updateCategory = async (id: string, data: UpdateCategoryData) => {
    try {
      setError(null)
      const updatedCategory = await menuAPI.updateCategory(id, data)
      setCategories(prev => prev.map(category => 
        category.id === id ? updatedCategory : category
      ))
      return updatedCategory
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update category'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      setError(null)
      await menuAPI.deleteCategory(id)
      setCategories(prev => prev.filter(category => category.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete category'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  return { 
    categories, 
    loading, 
    error, 
    refresh,
    createCategory,
    updateCategory,
    deleteCategory
  }
}

// Unified hook for managing both menu items and categories
export function useMenu() {
  const menuItems = useMenuItems()
  const categories = useMenuCategories()

  return {
    items: menuItems,
    categories: categories,
    loading: menuItems.loading || categories.loading,
    error: menuItems.error || categories.error,
    refresh: () => {
      menuItems.refresh()
      categories.refresh()
    }
  }
}