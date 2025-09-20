// lib/menu-api.ts

export interface MenuItem {
  id: string
  business_id: string
  name: string
  description?: string
  price: number
  category_id: string
  image_url?: string
  is_available: boolean
  preparation_time?: number
  sort_order: number
  created_at?: string
  updated_at?: string
}

export interface MenuCategory {
  id: string
  business_id: string
  name: string
  description?: string
  sort_order: number
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface CreateMenuItemData {
  name: string
  description?: string
  price: number
  category_id: string
  image_url?: string
  is_available: boolean
  preparation_time?: number
  sort_order: number
}

export interface UpdateMenuItemData {
  name?: string
  description?: string
  price?: number
  category_id?: string
  image_url?: string
  is_available?: boolean
  preparation_time?: number
  sort_order?: number
}

export interface CreateCategoryData {
  name: string
  description?: string
}

export interface UpdateCategoryData {
  name?: string
  description?: string
}

export interface MenuItemAvailabilityData {
  is_available: boolean
}

class MenuAPI {
  private async getAuthHeaders() {
    const token = localStorage.getItem('accessToken')  // Changed from 'token' to 'accessToken'
    if (!token) {
      throw new Error('No authentication token found')
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  }

  async getMenuItems(filters?: {
    category_id?: string
    is_available?: boolean
    search?: string
  }): Promise<MenuItem[]> {
    const headers = await this.getAuthHeaders()
    const params = new URLSearchParams()
    
    if (filters?.category_id) params.append('category_id', filters.category_id)
    if (filters?.is_available !== undefined) params.append('is_available', filters.is_available.toString())
    if (filters?.search) params.append('search', filters.search)
    
    const queryString = params.toString() ? `?${params.toString()}` : ''
    
    const response = await fetch(`/api/menu/items${queryString}`, {
      headers,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to fetch menu items: ${error}`)
    }

    return response.json()
  }

  async createMenuItem(data: CreateMenuItemData): Promise<MenuItem> {
    const headers = await this.getAuthHeaders()
    
    const response = await fetch('/api/menu/items', {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to create menu item: ${error}`)
    }

    return response.json()
  }

  async updateMenuItem(itemId: string, data: UpdateMenuItemData): Promise<MenuItem> {
    const headers = await this.getAuthHeaders()
    
    const response = await fetch(`/api/menu/items/${itemId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to update menu item: ${error}`)
    }

    return response.json()
  }

  async deleteMenuItem(itemId: string): Promise<{ status: string; message: string }> {
    const headers = await this.getAuthHeaders()
    
    const response = await fetch(`/api/menu/items/${itemId}`, {
      method: 'DELETE',
      headers,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to delete menu item: ${error}`)
    }

    return response.json()
  }

  async updateItemAvailability(itemId: string, data: MenuItemAvailabilityData): Promise<MenuItem> {
    const headers = await this.getAuthHeaders()
    
    const response = await fetch(`/api/menu/items/${itemId}/availability`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to update item availability: ${error}`)
    }

    return response.json()
  }

  async getCategories(): Promise<MenuCategory[]> {
    const headers = await this.getAuthHeaders()
    
    const response = await fetch('/api/menu/categories', {
      headers,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to fetch categories: ${error}`)
    }

    return response.json()
  }

  async createCategory(data: CreateCategoryData): Promise<MenuCategory> {
    const headers = await this.getAuthHeaders()
    
    const response = await fetch('/api/menu/categories', {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to create category: ${error}`)
    }

    return response.json()
  }

  async updateCategory(categoryId: string, data: UpdateCategoryData): Promise<MenuCategory> {
    const headers = await this.getAuthHeaders()
    
    const response = await fetch(`/api/menu/categories/${categoryId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to update category: ${error}`)
    }

    return response.json()
  }

  async deleteCategory(categoryId: string): Promise<{ status: string; message: string }> {
    const headers = await this.getAuthHeaders()
    
    const response = await fetch(`/api/menu/categories/${categoryId}`, {
      method: 'DELETE',
      headers,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to delete category: ${error}`)
    }

    return response.json()
  }
}

export const menuAPI = new MenuAPI()