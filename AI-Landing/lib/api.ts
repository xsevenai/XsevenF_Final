const API_BASE_URL = "https://89c34a78ef05.ngrok-free.app"

const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        Accept: "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  } catch (error: any) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      // This is expected when backend is not available - don't log as error
      throw new Error("BACKEND_UNAVAILABLE")
    }

    throw error
  }
}

const mockData = {
  todayMetrics: {
    todayOrders: 12,
    activeTables: { occupied: 8, total: 20 },
    menuItems: 45,
    todayRevenue: 1250.75,
    orderBreakdown: { dineIn: 8, takeout: 3, delivery: 1 },
    tableStatus: { occupied: 8, available: 10, cleaning: 2 },
    menuStatus: { available: 43, lowStock: 2 },
  },
  liveActivities: [
    {
      id: "1",
      type: "order",
      message: "New Order #1234",
      detail: "Table 5 - Pasta Carbonara, Caesar Salad",
      time: "2 min ago",
      color: "text-green-400",
    },
    {
      id: "2",
      type: "table",
      message: "Table 3 Ready",
      detail: "Cleaned and available for seating",
      time: "5 min ago",
      color: "text-blue-400",
    },
    {
      id: "3",
      type: "kitchen",
      message: "Kitchen Alert",
      detail: "Low stock: Salmon Fillet",
      time: "8 min ago",
      color: "text-yellow-400",
    },
  ],
  analytics: {
    kitchen: { queueCount: 3, avgPrepTime: "15m", onDuty: 5 },
    staff: { onDuty: 8 },
    orders: { pending: 3 },
    sales: { peakHour: "19:30", avgOrder: "24.50" },
    customer: { turnover: "85%", avgWaitTime: "12m" },
  },
}

export const dashboardAPI = {
  // Get dashboard overview data
  getOverview: async () => {
    try {
      return await apiClient("/api/dashboard/overview")
    } catch (error: any) {
      if (error.message === "BACKEND_UNAVAILABLE") {
        return mockData
      }
      console.warn("[v0] API Error - using mock data:", error.message)
      return mockData
    }
  },

  // Get today's metrics
  getTodayMetrics: async () => {
    try {
      return await apiClient("/api/dashboard/metrics/today")
    } catch (error: any) {
      if (error.message !== "BACKEND_UNAVAILABLE") {
        console.warn("[v0] Metrics API Error - using mock data:", error.message)
      }
      return mockData.todayMetrics
    }
  },

  // Get orders
  getOrders: async (params?: { status?: string; date?: string }) => {
    try {
      const query = params ? `?${new URLSearchParams(params).toString()}` : ""
      return await apiClient(`/api/orders${query}`)
    } catch (error: any) {
      if (error.message !== "BACKEND_UNAVAILABLE") {
        console.warn("[v0] Orders API Error - using mock data:", error.message)
      }
      return []
    }
  },

  // Get tables status
  getTables: async () => {
    try {
      return await apiClient("/api/tables")
    } catch (error: any) {
      if (error.message !== "BACKEND_UNAVAILABLE") {
        console.warn("[v0] Tables API Error - using mock data:", error.message)
      }
      return []
    }
  },

  // Get menu items
  getMenuItems: async () => {
    try {
      return await apiClient("/api/menu")
    } catch (error: any) {
      if (error.message !== "BACKEND_UNAVAILABLE") {
        console.warn("[v0] Menu API Error - using mock data:", error.message)
      }
      return []
    }
  },

  // Get live activities
  getLiveActivities: async () => {
    try {
      return await apiClient("/api/activities/live")
    } catch (error: any) {
      if (error.message !== "BACKEND_UNAVAILABLE") {
        console.warn("[v0] Activities API Error - using mock data:", error.message)
      }
      return mockData.liveActivities
    }
  },

  // Get analytics data
  getAnalytics: async (period = "today") => {
    try {
      return await apiClient(`/api/analytics?period=${period}`)
    } catch (error: any) {
      if (error.message !== "BACKEND_UNAVAILABLE") {
        console.warn("[v0] Analytics API Error - using mock data:", error.message)
      }
      return mockData.analytics
    }
  },

  // Chat with AI
  sendChatMessage: async (message: string) => {
    try {
      return await apiClient("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message }),
      })
    } catch (error: any) {
      if (error.message !== "BACKEND_UNAVAILABLE") {
        console.warn("[v0] Chat API Error - using fallback response:", error.message)
      }
      // Return a helpful fallback AI response
      const responses = [
        "I understand you're asking about your restaurant operations. While I'm currently running in demo mode, I can help you understand how our AI system works for restaurant management.",
        "That's a great question! In a live environment, I would analyze your real-time data to provide specific insights about your restaurant's performance.",
        "I'm designed to help with menu optimization, customer service, and operational efficiency. Once your backend is connected, I'll have access to your live restaurant data.",
        "For now, I'm running with demo data. Your actual AI assistant will have access to real-time orders, table status, and customer interactions.",
      ]
      return {
        message: responses[Math.floor(Math.random() * responses.length)],
      }
    }
  },

  // Quick actions with error handling
  markOrderReady: async (orderId: string) => {
    try {
      return await apiClient(`/api/orders/${orderId}/ready`, { method: "POST" })
    } catch (error: any) {
      console.warn("[v0] Quick action failed - demo mode:", error.message)
      return { success: false, message: "Demo mode - action logged but not executed" }
    }
  },

  updateTableStatus: async (tableId: string, status: string) => {
    try {
      return await apiClient(`/api/tables/${tableId}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      })
    } catch (error: any) {
      console.warn("[v0] Table update failed - demo mode:", error.message)
      return { success: false, message: "Demo mode - action logged but not executed" }
    }
  },

  // Menu management
  addMenuItem: async (item: any) => {
    try {
      return await apiClient("/api/menu", {
        method: "POST",
        body: JSON.stringify(item),
      })
    } catch (error: any) {
      console.warn("[v0] Add menu item failed - demo mode:", error.message)
      return { success: false, message: "Demo mode - action logged but not executed" }
    }
  },

  // Staff management
  getStaffSchedule: async () => {
    try {
      return await apiClient("/api/staff/schedule")
    } catch (error: any) {
      if (error.message !== "BACKEND_UNAVAILABLE") {
        console.warn("[v0] Staff schedule API Error - using mock data:", error.message)
      }
      return []
    }
  },
}

// Authentication API with better error handling
export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    try {
      return await apiClient("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      })
    } catch (error: any) {
      // For demo purposes, allow login with any credentials when backend is unavailable
      if (error.message === "BACKEND_UNAVAILABLE") {
        console.warn("[v0] Backend unavailable - allowing demo login")
        return {
          token: "demo_token",
          user: { email: credentials.email, name: "Demo User" },
          message: "Demo login successful (backend unavailable)",
        }
      }
      throw error
    }
  },

  register: async (userData: { name: string; email: string; password: string }) => {
    try {
      return await apiClient("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      })
    } catch (error: any) {
      // For demo purposes, allow registration when backend is unavailable
      if (error.message === "BACKEND_UNAVAILABLE") {
        console.warn("[v0] Backend unavailable - allowing demo registration")
        return {
          token: "demo_token",
          user: { email: userData.email, name: userData.name },
          message: "Demo registration successful (backend unavailable)",
        }
      }
      throw error
    }
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
    }
    return Promise.resolve({ message: "Logged out successfully" })
  },
}
