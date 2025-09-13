interface JWTPayload {
  business_id: string
  user_id: string
  email: string
  exp: number
}

class FastAPIClient {
  private baseURL: string
  private ws: WebSocket | null = null

  constructor() {
    // Use localStorage fallback or default to localhost
    this.baseURL = localStorage.getItem("x7_api_base_url") || "http://localhost:8000/api/v1"
  }

  private getAuthToken(): string | null {
    return localStorage.getItem("x7_auth")
  }

  private getBusinessId(): string | null {
    const token = this.getAuthToken()
    if (!token) {
      console.log("[v0] No auth token found in localStorage")
      return null
    }

    try {
      const parts = token.split(".")
      if (parts.length !== 3) {
        console.log("[v0] Invalid JWT token format")
        return null
      }

      const payload = JSON.parse(atob(parts[1])) as JWTPayload
      console.log("[v0] JWT payload:", payload)

      if (!payload.business_id) {
        console.log("[v0] No business_id found in JWT payload")
        return null
      }

      return payload.business_id
    } catch (error) {
      console.log("[v0] JWT parsing error:", error)
      return null
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const token = this.getAuthToken()
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    return response.json()
  }

  // Dashboard API methods
  async getDashboardOverview() {
    return this.request("/dashboard/overview")
  }

  async getBusinessDashboard() {
    const businessId = this.getBusinessId()
    if (!businessId) throw new Error("No business ID found")
    return this.request(`/dashboard/${businessId}/dashboard`)
  }

  async sendChatMessage(message: string) {
    return this.request("/chat/dashboard", {
      method: "POST",
      body: JSON.stringify({ message }),
    })
  }

  async clearChat() {
    const businessId = this.getBusinessId()
    if (!businessId) throw new Error("No business ID found")

    // For now, we'll use a default session_id - you can modify this based on your needs
    const sessionId = "default"
    return this.request(`/chat/dashboard/${businessId}/${sessionId}`, {
      method: "DELETE",
    })
  }

  // WebSocket connection for real-time updates
  connectWebSocket(onMessage: (data: any) => void, onError?: (error: Event) => void) {
    const businessId = this.getBusinessId()
    if (!businessId) {
      console.log("[v0] Cannot connect WebSocket: No business ID found")
      return
    }

    const wsURL = this.baseURL.replace("http", "ws").replace("https", "wss")
    console.log("[v0] Connecting WebSocket to:", `${wsURL}/dashboard/ws/${businessId}`)

    this.ws = new WebSocket(`${wsURL}/dashboard/ws/${businessId}`)

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        onMessage(data)
      } catch (error) {
        console.error("WebSocket message parse error:", error)
      }
    }

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error)
      onError?.(error)
    }

    this.ws.onclose = () => {
      console.log("WebSocket connection closed")
      // Auto-reconnect after 5 seconds
      setTimeout(() => this.connectWebSocket(onMessage, onError), 5000)
    }
  }

  disconnectWebSocket() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}

export const fastAPIClient = new FastAPIClient()
