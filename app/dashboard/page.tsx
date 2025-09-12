"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import {
  Home,
  MessageSquare,
  MenuIcon,
  Clock,
  Plus,
  Users,
  QrCode,
  Upload,
  UserPlus,
  Settings,
  LogOut,
  AlertTriangle,
  CheckCircle,
  Star,
  ArrowLeft,
  Activity,
  TrendingUp,
  ChefHat,
  BarChart3,
} from "lucide-react"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  available: boolean
}

interface Table {
  id: string
  number: number
  seats: number
  status: "available" | "occupied" | "cleaning" | "reserved"
  location: string
}

interface ChatMessage {
  id: string
  type: "user" | "ai"
  message: string
  timestamp: Date
}

interface WorkingHours {
  day: string
  isOpen: boolean
  openTime: string
  closeTime: string
}

export default function Dashboard() {
  console.log("[v0] Dashboard component rendering")

  const [activeSection, setActiveSection] = useState("dashboard")

  const [expandedView, setExpandedView] = useState<string | null>(null)
  const [specificChatId, setSpecificChatId] = useState<string | null>(null)
  const [showAddCategory, setShowAddCategory] = useState<boolean>(false)
  const [showUploadPDF, setShowUploadPDF] = useState<boolean>(false)
  const [showGenerateQR, setShowGenerateQR] = useState<boolean>(false)
  const [showImportCustomers, setShowImportCustomers] = useState<boolean>(false)
  const [showStaffSchedule, setShowStaffSchedule] = useState<boolean>(false)

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "ai",
      message:
        "Hello! I'm your AI assistant for DEYBYNAVEEN. I can help you with menu optimization, business analytics, customer service guidance, and operational improvements. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [chatInput, setChatInput] = useState<string>("")

  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: "1",
      name: "Margherita Pizza",
      description: "Fresh tomatoes, mozzarella, basil",
      category: "Pizza",
      price: 12.99,
      available: true,
    },
    {
      id: "2",
      name: "Caesar Salad",
      description: "Romaine lettuce, parmesan, croutons",
      category: "Salads",
      price: 8.99,
      available: true,
    },
    {
      id: "3",
      name: "Grilled Salmon",
      description: "Atlantic salmon with herbs",
      category: "Main Course",
      price: 18.99,
      available: false,
    },
  ])
  const [showAddMenuItem, setShowAddMenuItem] = useState<boolean>(false)
  const [editingMenuItem, setEditingMenuItem] = useState<string | null>(null)
  const [newMenuItem, setNewMenuItem] = useState({
    name: "",
    description: "",
    category: "",
    price: 0,
  })

  const [tables, setTables] = useState<Table[]>([
    { id: "1", number: 1, seats: 4, status: "available", location: "Main Floor" },
    { id: "2", number: 2, seats: 2, status: "occupied", location: "Window Side" },
    { id: "3", number: 3, seats: 6, status: "cleaning", location: "Private Area" },
    { id: "4", number: 4, seats: 4, status: "reserved", location: "Main Floor" },
    { id: "5", number: 5, seats: 8, status: "available", location: "Private Area" },
  ])
  const [showAddTable, setShowAddTable] = useState<boolean>(false)
  const [newTable, setNewTable] = useState({
    number: 0,
    seats: 4,
    location: "",
  })

  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([
    { day: "Monday", isOpen: true, openTime: "09:00", closeTime: "22:00" },
    { day: "Tuesday", isOpen: true, openTime: "09:00", closeTime: "22:00" },
    { day: "Wednesday", isOpen: true, openTime: "09:00", closeTime: "22:00" },
    { day: "Thursday", isOpen: true, openTime: "09:00", closeTime: "22:00" },
    { day: "Friday", isOpen: true, openTime: "09:00", closeTime: "23:00" },
    { day: "Saturday", isOpen: true, openTime: "10:00", closeTime: "23:00" },
    { day: "Sunday", isOpen: true, openTime: "10:00", closeTime: "21:00" },
  ])

  const [activityFeed] = useState([
    {
      id: 1,
      type: "table",
      message: "Table 5 Cleaned",
      time: "10 min ago",
      icon: CheckCircle,
      color: "text-green-400",
    },
    {
      id: 2,
      type: "kitchen",
      message: "Kitchen Alert",
      subtext: "Item running low: Salmon Fillet",
      time: "15 min ago",
      icon: AlertTriangle,
      color: "text-red-400",
    },
    { id: 3, type: "feedback", message: "Customer Feedback", time: "25 min ago", icon: Star, color: "text-purple-400" },
  ])

  const [liveChats] = useState([
    {
      id: "1",
      customer: "John Doe",
      lastMessage: "Hi, I need help with my order.",
      time: "2 min ago",
      status: "online",
    },
    {
      id: "2",
      customer: "Jane Smith",
      lastMessage: "What are your specials today?",
      time: "5 min ago",
      status: "offline",
    },
  ])

  const handleSendMessage = () => {
    if (!chatInput.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      message: chatInput,
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setChatInput("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        message: `I understand you're asking about "${chatInput}". Based on your restaurant data, I can help you optimize operations, analyze customer patterns, and improve service efficiency. Would you like specific recommendations for your business?`,
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  const handleAddMenuItem = () => {
    if (!newMenuItem.name || !newMenuItem.category || newMenuItem.price <= 0) return

    const menuItem: MenuItem = {
      id: Date.now().toString(),
      ...newMenuItem,
      available: true,
    }

    setMenuItems((prev) => [...prev, menuItem])
    setNewMenuItem({ name: "", description: "", category: "", price: 0 })
    setShowAddMenuItem(false)
  }

  const handleDeleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleToggleAvailability = (id: string) => {
    setMenuItems((prev) => prev.map((item) => (item.id === id ? { ...item, available: !item.available } : item)))
  }

  const handleAddTable = () => {
    if (!newTable.number || !newTable.location) return

    const table: Table = {
      id: Date.now().toString(),
      ...newTable,
      status: "available",
    }

    setTables((prev) => [...prev, table])
    setNewTable({ number: 0, seats: 4, location: "" })
    setShowAddTable(false)
  }

  const handleTableStatusChange = (id: string, status: Table["status"]) => {
    setTables((prev) => prev.map((table) => (table.id === id ? { ...table, status } : table)))
  }

  const handleHoursChange = (day: string, field: keyof WorkingHours, value: string | boolean) => {
    setWorkingHours((prev) => prev.map((hours) => (hours.day === day ? { ...hours, [field]: value } : hours)))
  }

  const handleSignOut = () => {
    window.location.href = "/"
  }

  const getTableStatusCounts = () => {
    const occupied = tables.filter((t) => t.status === "occupied").length
    const available = tables.filter((t) => t.status === "available").length
    const cleaning = tables.filter((t) => t.status === "cleaning").length
    return { occupied, available, cleaning }
  }

  const tableStats = getTableStatusCounts()

  const toggleMenuItemAvailability = (id: string) => {
    setMenuItems((prev) => prev.map((item) => (item.id === id ? { ...item, available: !item.available } : item)))
  }

  const updateTableStatus = (id: string, status: string) => {
    setTables((prev) =>
      prev.map((table) => (table.id === id ? { ...table, status: status as Table["status"] } : table)),
    )
  }

  const toggleDayStatus = (day: string) => {
    setWorkingHours((prev) => prev.map((d) => (d.day === day ? { ...d, isOpen: !d.isOpen } : d)))
  }

  const updateWorkingHours = (day: string, field: keyof WorkingHours, value: string) => {
    setWorkingHours((prev) => prev.map((d) => (d.day === day ? { ...d, [field]: value } : d)))
  }

  console.log("[v0] Active section:", activeSection)
  console.log("[v0] Expanded view:", expandedView)

  return (
    <div className="h-screen bg-gradient-to-br from-[#1a1b2e] via-[#16213e] to-[#1a1b2e] text-white flex overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-64 m-4 bg-gradient-to-b from-[#16213e] to-[#0f172a] rounded-2xl border border-gray-700/50 backdrop-blur-sm shadow-2xl flex flex-col transition-all duration-300 hover:shadow-purple-500/10">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-700/50 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#B76E79] rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg transform transition-transform duration-200 hover:scale-105">
              <span className="text-black font-bold text-lg">X</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-white truncate bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                DEYBYNAVEEN
              </h1>
              <p className="text-sm text-gray-400 truncate">Enterprise Dashboard</p>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600/50 scrollbar-track-transparent hover:scrollbar-thumb-gray-500/70 transition-colors">
          <div className="p-4 space-y-6">
            {/* Main Navigation */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
                MAIN NAVIGATION
              </h3>
              <nav className="space-y-1">
                {[
                  { id: "dashboard", label: "Dashboard", icon: Home },
                  { id: "ai-chat", label: "AI Chat", icon: MessageSquare },
                  { id: "menu", label: "Menu", icon: MenuIcon },
                  { id: "tables", label: "Tables", icon: Users },
                  { id: "working-hours", label: "Working Hours", icon: Clock },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-300 transform hover:scale-[1.02] ${
                      activeSection === item.id
                        ? "bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] text-white shadow-lg shadow-purple-500/25"
                        : "text-gray-300 hover:bg-gray-700/30 hover:text-white hover:shadow-md"
                    }`}
                  >
                    <item.icon
                      className={`h-5 w-5 flex-shrink-0 transition-all duration-300 ${activeSection === item.id ? "text-white" : "group-hover:text-purple-400"}`}
                    />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">QUICK ACTIONS</h3>
              <nav className="space-y-1">
                {[
                  { label: "Add New Menu Item", icon: Plus, action: () => setExpandedView("add-menu-item") },
                  { label: "Add New Category", icon: Plus, action: () => setExpandedView("add-category") },
                  { label: "Upload Menu PDF", icon: Upload, action: () => setShowUploadPDF(true) },
                  { label: "Generate QR Codes", icon: QrCode, action: () => setExpandedView("generate-qr") },
                  { label: "Import Customer Data", icon: UserPlus, action: () => setExpandedView("import-data") },
                  { label: "Create Staff Schedule", icon: Clock, action: () => setExpandedView("staff-schedule") },
                ].map((item, index) => (
                  <button
                    key={index}
                    onClick={item.action}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-300 text-gray-300 hover:bg-gray-700/30 hover:text-white group transform hover:scale-[1.02] hover:shadow-md"
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0 group-hover:text-[#7c3aed] transition-all duration-300 group-hover:scale-110" />
                    <span className="text-sm font-medium truncate">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Data Management */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
                DATA MANAGEMENT
              </h3>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveSection("menu")}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-300 text-gray-300 hover:bg-gray-700/30 hover:text-white group transform hover:scale-[1.02] hover:shadow-md hover:shadow-red-500/20"
                >
                  <Settings className="h-4 w-4 flex-shrink-0 group-hover:text-[#7c3aed] transition-all duration-300 group-hover:rotate-90" />
                  <span className="text-sm font-medium">Menu Management</span>
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Sign Out Button */}
        <div className="p-4 border-t border-gray-700/50 flex-shrink-0">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center space-x-3 px-3 py-2.5 text-gray-300 hover:bg-red-600/20 hover:text-red-400 rounded-lg text-left transition-all duration-300 group transform hover:scale-[1.02] hover:shadow-md hover:shadow-red-500/20"
          >
            <LogOut className="h-5 w-5 flex-shrink-0 group-hover:text-red-400 transition-all duration-300 group-hover:translate-x-1" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Central Panel */}
      <div className="flex-1 m-4 ml-0 bg-gradient-to-b from-[#16213e] to-[#0f172a] rounded-2xl border border-gray-700/50 backdrop-blur-sm shadow-2xl flex flex-col transition-all duration-300 hover:shadow-purple-500/10">
        <div className="bg-gradient-to-r from-[#16213e] to-[#1a1b2e] border-b border-gray-700/50 px-6 py-4 shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {expandedView === "live-orders"
                  ? "Live Orders Management"
                  : expandedView === "live-reservations"
                    ? "Live Reservations Management"
                    : expandedView === "live-chat"
                      ? "Live Chat Support"
                      : expandedView === "live-feed"
                        ? "Live Activity Feed"
                        : expandedView === "add-menu-item"
                          ? "Add New Menu Item"
                          : expandedView === "add-category"
                            ? "Add New Category"
                            : expandedView === "generate-qr"
                              ? "Generate QR Codes"
                              : expandedView === "import-data"
                                ? "Import Customer Data"
                                : expandedView === "staff-schedule"
                                  ? "Create Staff Schedule"
                                  : "Overview"}
              </h1>
              <p className="text-gray-400 text-sm">
                {expandedView ? "Detailed view and management" : "Welcome back! Here's your business overview"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {expandedView && (
                <button
                  onClick={() => setExpandedView(null)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-gray-300 hover:text-white transition-all duration-200"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Overview
                </button>
              )}
              <div className="flex items-center gap-2 text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                <span className="text-sm font-medium">Live</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600/50 scrollbar-track-transparent hover:scrollbar-thumb-gray-500/70 transition-colors">
          {console.log("[v0] Rendering central panel content for:", activeSection)}

          {activeSection === "dashboard" && !expandedView && (
            <div className="p-6 space-y-6">
              {console.log("[v0] Rendering dashboard overview")}

              {/* Greeting Section */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  Good Evening, DEYBYNAVEEN
                </h2>
                <p className="text-gray-400">Here's your live business overview for today</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                  <span className="text-green-400 text-sm font-medium">Live Updates</span>
                </div>
              </div>

              {/* Key Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-4">
                  <h3 className="text-blue-400 font-semibold mb-2">Total Revenue</h3>
                  <div className="text-2xl font-bold text-white">$0.00</div>
                </Card>
                <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-4">
                  <h3 className="text-green-400 font-semibold mb-2">New Customers</h3>
                  <div className="text-2xl font-bold text-white">0</div>
                </Card>
                <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-4">
                  <h3 className="text-yellow-400 font-semibold mb-2">Avg Order Value</h3>
                  <div className="text-2xl font-bold text-white">$0.00</div>
                </Card>
                <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-4">
                  <h3 className="text-purple-400 font-semibold mb-2">Customer Satisfaction</h3>
                  <div className="text-2xl font-bold text-white">0%</div>
                </Card>
              </div>

              {/* Live Activity Feed */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Live Activity Feed</h2>
                  <button
                    onClick={() => setExpandedView("live-feed")}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {activityFeed.map((activity) => (
                    <Card
                      key={activity.id}
                      className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-4 hover:border-purple-500/30 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <activity.icon className={`h-5 w-5 ${activity.color}`} />
                          <div>
                            <h4 className="text-white font-medium">{activity.message}</h4>
                            {activity.subtext && <p className="text-gray-400 text-sm">{activity.subtext}</p>}
                          </div>
                        </div>
                        <span className="text-gray-500 text-xs">{activity.time}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Table Status Overview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Table Status Overview</h2>
                  <button
                    onClick={() => setActiveSection("tables")}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Manage Tables
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-4">
                    <h3 className="text-green-400 font-semibold mb-2">Available Tables</h3>
                    <div className="text-2xl font-bold text-white">{tableStats.available}</div>
                  </Card>
                  <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-4">
                    <h3 className="text-red-400 font-semibold mb-2">Occupied Tables</h3>
                    <div className="text-2xl font-bold text-white">{tableStats.occupied}</div>
                  </Card>
                  <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-4">
                    <h3 className="text-yellow-400 font-semibold mb-2">Cleaning Tables</h3>
                    <div className="text-2xl font-bold text-white">{tableStats.cleaning}</div>
                  </Card>
                </div>
              </div>

              {/* Live Orders & Reservations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">Live Orders</h2>
                    <button
                      onClick={() => setExpandedView("live-orders")}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      View All
                    </button>
                  </div>
                  <div className="text-center py-6">
                    <div className="text-gray-400 text-sm">No active orders</div>
                  </div>
                </Card>
                <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">Live Reservations</h2>
                    <button
                      onClick={() => setExpandedView("live-reservations")}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      View All
                    </button>
                  </div>
                  <div className="text-center py-6">
                    <div className="text-gray-400 text-sm">No upcoming reservations</div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeSection === "ai-chat" && !expandedView && (
            <div className="p-6 space-y-6">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  AI Chat Support
                </h2>
                <p className="text-gray-400">Manage customer conversations and AI responses</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {liveChats.map((chat) => (
                  <Card
                    key={chat.id}
                    className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6 hover:border-purple-500/30 transition-all duration-300 cursor-pointer"
                    onClick={() => setExpandedView(`chat-${chat.id}`)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">{chat.customer.charAt(0)}</span>
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{chat.customer}</h3>
                          <p className="text-gray-400 text-sm">{chat.lastMessage}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`w-2 h-2 rounded-full ${chat.status === "online" ? "bg-green-500" : "bg-gray-500"}`}
                        ></div>
                        <span className="text-gray-500 text-xs">{chat.time}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeSection === "menu" && !expandedView && (
            <div className="p-6 space-y-6">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  Menu Management
                </h2>
                <p className="text-gray-400">Manage your restaurant menu items and categories</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item) => (
                  <Card
                    key={item.id}
                    className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6 hover:border-purple-500/30 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold">{item.name}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${item.available ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                      >
                        {item.available ? "Available" : "Unavailable"}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{item.category}</p>
                    <p className="text-white font-bold">${item.price}</p>
                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                        Edit
                      </button>
                      <button
                        onClick={() => toggleMenuItemAvailability(item.id)}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                      >
                        Toggle
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeSection === "tables" && !expandedView && (
            <div className="p-6 space-y-6">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  Table Management
                </h2>
                <p className="text-gray-400">Monitor and manage restaurant table status</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {tables.map((table) => (
                  <Card
                    key={table.id}
                    className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6 hover:border-purple-500/30 transition-all duration-300"
                  >
                    <div className="text-center">
                      <h3 className="text-white font-semibold mb-2">Table {table.number}</h3>
                      <div
                        className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                          table.status === "available"
                            ? "bg-green-500/20 text-green-400"
                            : table.status === "occupied"
                              ? "bg-red-500/20 text-red-400"
                              : table.status === "cleaning"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        <Users className="h-8 w-8" />
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{table.seats} seats</p>
                      <p className="text-gray-400 text-sm mb-4">{table.location}</p>
                      <select
                        value={table.status}
                        onChange={(e) => updateTableStatus(table.id, e.target.value)}
                        className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg text-sm"
                      >
                        <option value="available">Available</option>
                        <option value="occupied">Occupied</option>
                        <option value="cleaning">Cleaning</option>
                        <option value="reserved">Reserved</option>
                      </select>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeSection === "working-hours" && !expandedView && (
            <div className="p-6 space-y-6">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  Working Hours
                </h2>
                <p className="text-gray-400">Manage restaurant operating hours and schedules</p>
              </div>

              <div className="space-y-4">
                {workingHours.map((day) => (
                  <Card key={day.day} className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <h3 className="text-white font-semibold w-24">{day.day}</h3>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={day.isOpen}
                            onChange={() => toggleDayStatus(day.day)}
                            className="rounded"
                          />
                          <span className="text-gray-400">Open</span>
                        </label>
                      </div>
                      {day.isOpen && (
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">Open:</span>
                            <input
                              type="time"
                              value={day.openTime}
                              onChange={(e) => updateWorkingHours(day.day, "openTime", e.target.value)}
                              className="bg-gray-700 text-white px-3 py-2 rounded-lg text-sm"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">Close:</span>
                            <input
                              type="time"
                              value={day.closeTime}
                              onChange={(e) => updateWorkingHours(day.day, "closeTime", e.target.value)}
                              className="bg-gray-700 text-white px-3 py-2 rounded-lg text-sm"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {expandedView === "add-menu-item" && (
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <button
                  onClick={() => setExpandedView(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
                <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  Add New Menu Item
                </h2>
              </div>

              <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-medium mb-2">Item Name</label>
                      <input
                        type="text"
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                        placeholder="Enter item name"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">Price</label>
                      <input
                        type="number"
                        step="0.01"
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Category</label>
                    <select className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none">
                      <option>Appetizers</option>
                      <option>Main Course</option>
                      <option>Desserts</option>
                      <option>Beverages</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Description</label>
                    <textarea
                      rows={4}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                      placeholder="Enter item description"
                    ></textarea>
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                    >
                      Add Menu Item
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedView(null)}
                      className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Card>
            </div>
          )}

          {expandedView === "add-category" && (
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <button
                  onClick={() => setExpandedView(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
                <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  Add New Category
                </h2>
              </div>

              <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
                <form className="space-y-6">
                  <div>
                    <label className="block text-white font-medium mb-2">Category Name</label>
                    <input
                      type="text"
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                      placeholder="Enter category name"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Description</label>
                    <textarea
                      rows={3}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                      placeholder="Enter category description"
                    ></textarea>
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                    >
                      Add Category
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedView(null)}
                      className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Card>
            </div>
          )}

          {expandedView === "generate-qr" && (
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <button
                  onClick={() => setExpandedView(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
                <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  Generate QR Codes
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
                  <h3 className="text-white font-semibold mb-4">Menu QR Code</h3>
                  <div className="bg-white p-4 rounded-lg mb-4">
                    <div className="w-32 h-32 bg-gray-200 mx-auto flex items-center justify-center">
                      <QrCode className="h-16 w-16 text-gray-600" />
                    </div>
                  </div>
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Download Menu QR
                  </button>
                </Card>

                <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
                  <h3 className="text-white font-semibold mb-4">Table QR Codes</h3>
                  <div className="space-y-3">
                    {tables.slice(0, 3).map((table) => (
                      <div key={table.id} className="flex items-center justify-between bg-gray-700/30 p-3 rounded-lg">
                        <span className="text-white">Table {table.number}</span>
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors">
                          Generate
                        </button>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {expandedView === "import-data" && (
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <button
                  onClick={() => setExpandedView(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
                <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  Import Customer Data
                </h2>
              </div>

              <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-white font-medium mb-2">Upload CSV File</label>
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400 mb-2">Drag and drop your CSV file here, or click to browse</p>
                      <input type="file" accept=".csv" className="hidden" />
                      <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                        Choose File
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
                      Import Data
                    </button>
                    <button
                      onClick={() => setExpandedView(null)}
                      className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {expandedView === "staff-schedule" && (
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <button
                  onClick={() => setExpandedView(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
                <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  Create Staff Schedule
                </h2>
              </div>

              <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-medium mb-2">Staff Member</label>
                      <select className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none">
                        <option>John Doe</option>
                        <option>Jane Smith</option>
                        <option>Mike Johnson</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">Position</label>
                      <select className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none">
                        <option>Server</option>
                        <option>Chef</option>
                        <option>Manager</option>
                        <option>Host</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-white font-medium mb-2">Date</label>
                      <input
                        type="date"
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">Start Time</label>
                      <input
                        type="time"
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">End Time</label>
                      <input
                        type="time"
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                    >
                      Create Schedule
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedView(null)}
                      className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Analytics & Outputs */}
      <div className="w-80 m-4 ml-0 bg-gradient-to-b from-[#16213e] to-[#0f172a] rounded-2xl border border-gray-700/50 backdrop-blur-sm shadow-2xl flex flex-col transition-all duration-300 hover:shadow-purple-500/10">
        {console.log("[v0] Rendering right analytics panel")}

        {/* Header */}
        <div className="bg-gradient-to-r from-[#16213e] to-[#1a1b2e] border-b border-gray-700/50 px-6 py-4 shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Analytics & Outputs</h2>
              <p className="text-gray-400 text-sm">Real-time insights and reports</p>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
              <span className="text-sm font-medium">Live</span>
            </div>
          </div>
        </div>

        {/* Analytics Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600/50 scrollbar-track-transparent hover:scrollbar-thumb-gray-500/70 transition-colors p-6 space-y-6">
          {/* Real-Time Performance */}
          <div className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] rounded-xl border border-gray-700/50 p-4">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-orange-400" />
              Real-Time Performance
            </h3>

            {/* Kitchen Dashboard */}
            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg p-4 mb-4 border border-orange-500/20">
              <div className="flex items-center gap-2 mb-3">
                <ChefHat className="h-4 w-4 text-orange-400" />
                <span className="text-orange-400 font-medium text-sm">Kitchen Dashboard</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">0</div>
                  <div className="text-xs text-gray-400">Orders in Queue</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">12m</div>
                  <div className="text-xs text-gray-400">Avg Prep Time</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">5</div>
                  <div className="text-xs text-gray-400">Staff On Duty</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sales Overview */}
          <div className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] rounded-xl border border-gray-700/50 p-4">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              Sales Overview
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Today's Revenue</span>
                <span className="text-2xl font-bold text-white">$0.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Peak Hour</span>
                <span className="text-white font-medium">0:00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Avg Order</span>
                <span className="text-white font-medium">$0.00</span>
              </div>
            </div>
          </div>

          {/* Customer Flow */}
          <div className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] rounded-xl border border-gray-700/50 p-4">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-400" />
              Customer Flow
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Table Turnover</span>
                <span className="text-2xl font-bold text-white">0%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Avg Wait Time</span>
                <span className="text-white font-medium">8m</span>
              </div>
            </div>
          </div>

          {/* Menu Performance */}
          <div className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] rounded-xl border border-gray-700/50 p-4">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <MenuIcon className="h-5 w-5 text-purple-400" />
              Menu Performance
            </h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-400 mb-1">Best Sellers</div>
                <div className="text-white font-medium">No data yet</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Low Performers</div>
                <div className="text-white font-medium">No data yet</div>
              </div>
            </div>
          </div>

          {/* Visual Analytics */}
          <div className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] rounded-xl border border-gray-700/50 p-4">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-cyan-400" />
              Visual Analytics
            </h3>
            <div className="text-center py-8">
              <div className="text-gray-400 text-sm">Charts and graphs will appear here</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
