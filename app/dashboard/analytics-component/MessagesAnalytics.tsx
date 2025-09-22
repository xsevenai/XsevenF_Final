// app/dashboard/analytics-component/MessagesAnalytics.tsx

"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts"
import { MessageSquare, Users, Clock, Bot, User, TrendingUp, Search, Filter } from "lucide-react"
import { useMessagesAnalytics } from "@/hooks/use-analytics"

// Define interfaces for type safety
interface Message {
  id: string
  businessId: number
  sessionId: string
  content: string
  sender: 'customer' | 'ai' | 'staff'
  timestamp: string
  metadata?: Record<string, any>
}

interface MessagesSummary {
  total_messages: number
  total_sessions: number
  average_messages_per_session: number
  sender_distribution?: Record<string, number>
}

interface MessagesData {
  summary: MessagesSummary
  messages: Message[]
  daily_breakdown?: Record<string, any>
  session_stats?: Record<string, any>
}

interface ChartDataPoint {
  date: string
  messages: number
  sessions: number
  customer: number
  ai: number
  staff: number
}

interface SenderDataPoint {
  name: string
  value: number
  color: string
}

interface SessionStat {
  sessionId: string
  messageCount: number
  firstMessage: string
  lastMessage: string
  customerMessages: number
  aiMessages: number
  staffMessages: number
}

interface MessagesAnalyticsProps {
  timeRange: string
}

export default function MessagesAnalytics({ timeRange }: MessagesAnalyticsProps) {
  const [sessionFilter, setSessionFilter] = useState<string>("")
  const [senderFilter, setSenderFilter] = useState<string>("")
  
  const { 
    messagesData, 
    loading, 
    error, 
    refetch 
  } = useMessagesAnalytics(timeRange, sessionFilter)

  const senderTypes = [
    { value: "", label: "All Senders" },
    { value: "customer", label: "Customer" },
    { value: "ai", label: "AI Assistant" },
    { value: "staff", label: "Staff" }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400">Error loading messages analytics</p>
        <button 
          onClick={refetch}
          className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Retry
        </button>
      </div>
    )
  }

  const summary: MessagesSummary = messagesData?.summary || {
    total_messages: 0,
    total_sessions: 0,
    average_messages_per_session: 0
  }

  const messages: Message[] = messagesData?.messages || []

  // Filter messages based on sender type
  const filteredMessages = messages.filter((message: Message) => 
    senderFilter === "" || message.sender === senderFilter
  )

  // Generate chart data for message trends
  const chartData: ChartDataPoint[] = []
  const days = timeRange === "1d" ? 1 : timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    const dayMessages = messages.filter((message: Message) => 
      message.timestamp.split('T')[0] === dateStr
    )
    
    const uniqueSessions = new Set(dayMessages.map((m: Message) => m.sessionId)).size
    
    chartData.push({
      date: dateStr,
      messages: dayMessages.length,
      sessions: uniqueSessions,
      customer: dayMessages.filter((m: Message) => m.sender === 'customer').length,
      ai: dayMessages.filter((m: Message) => m.sender === 'ai').length,
      staff: dayMessages.filter((m: Message) => m.sender === 'staff').length
    })
  }

  // Sender distribution
  const senderCounts = messages.reduce((acc: Record<string, number>, message: Message) => {
    acc[message.sender] = (acc[message.sender] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const senderData: SenderDataPoint[] = [
    { name: 'Customer', value: senderCounts.customer || 0, color: '#3B82F6' },
    { name: 'AI Assistant', value: senderCounts.ai || 0, color: '#8B5CF6' },
    { name: 'Staff', value: senderCounts.staff || 0, color: '#10B981' }
  ]

  // Session analysis
  const sessionStats = messages.reduce((acc: Record<string, SessionStat>, message: Message) => {
    if (!acc[message.sessionId]) {
      acc[message.sessionId] = {
        sessionId: message.sessionId,
        messageCount: 0,
        firstMessage: message.timestamp,
        lastMessage: message.timestamp,
        customerMessages: 0,
        aiMessages: 0,
        staffMessages: 0
      }
    }
    
    acc[message.sessionId].messageCount++
    
    // Type-safe increment based on sender type
    if (message.sender === 'customer') {
      acc[message.sessionId].customerMessages++
    } else if (message.sender === 'ai') {
      acc[message.sessionId].aiMessages++
    } else if (message.sender === 'staff') {
      acc[message.sessionId].staffMessages++
    }
    
    if (new Date(message.timestamp) < new Date(acc[message.sessionId].firstMessage)) {
      acc[message.sessionId].firstMessage = message.timestamp
    }
    if (new Date(message.timestamp) > new Date(acc[message.sessionId].lastMessage)) {
      acc[message.sessionId].lastMessage = message.timestamp
    }
    
    return acc
  }, {} as Record<string, SessionStat>)

  const sessionList: SessionStat[] = Object.values(sessionStats).sort((a: SessionStat, b: SessionStat) => 
    new Date(b.lastMessage).getTime() - new Date(a.lastMessage).getTime()
  )

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Messages</p>
              <p className="text-2xl font-bold text-white">{summary.total_messages}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-blue-400" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Sessions</p>
              <p className="text-2xl font-bold text-white">{summary.total_sessions}</p>
            </div>
            <Users className="h-8 w-8 text-green-400" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg Messages/Session</p>
              <p className="text-2xl font-bold text-white">{summary.average_messages_per_session.toFixed(1)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-400" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg Response Time</p>
              <p className="text-2xl font-bold text-white">2.3s</p>
            </div>
            <Clock className="h-8 w-8 text-orange-400" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={senderFilter}
              onChange={(e) => setSenderFilter(e.target.value)}
              className="bg-gray-700/50 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {senderTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 flex-1">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Filter by session ID..."
              value={sessionFilter}
              onChange={(e) => setSessionFilter(e.target.value)}
              className="flex-1 bg-gray-700/50 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages Trend */}
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Messages Activity</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(value: string) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="messages" 
                  stroke="#8B5CF6" 
                  fill="#8B5CF6"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Sender Distribution */}
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Message Distribution by Sender</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={senderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {senderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            {senderData.map((entry, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-sm text-gray-400">{entry.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Messages by Sender Type */}
      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Daily Messages by Sender Type</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={(value: string) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Bar dataKey="customer" fill="#3B82F6" name="Customer" />
              <Bar dataKey="ai" fill="#8B5CF6" name="AI Assistant" />
              <Bar dataKey="staff" fill="#10B981" name="Staff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent Sessions */}
      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Sessions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-400 font-medium py-3">Session ID</th>
                <th className="text-left text-gray-400 font-medium py-3">Messages</th>
                <th className="text-left text-gray-400 font-medium py-3">Customer</th>
                <th className="text-left text-gray-400 font-medium py-3">AI</th>
                <th className="text-left text-gray-400 font-medium py-3">Staff</th>
                <th className="text-left text-gray-400 font-medium py-3">Last Activity</th>
              </tr>
            </thead>
            <tbody>
              {sessionList.slice(0, 10).map((session: SessionStat) => (
                <tr key={session.sessionId} className="border-b border-gray-700/30 hover:bg-gray-700/20">
                  <td className="py-3 text-white font-mono text-xs">{session.sessionId.slice(0, 8)}...</td>
                  <td className="py-3 text-white">{session.messageCount}</td>
                  <td className="py-3 text-blue-400">{session.customerMessages}</td>
                  <td className="py-3 text-purple-400">{session.aiMessages}</td>
                  <td className="py-3 text-green-400">{session.staffMessages}</td>
                  <td className="py-3 text-gray-400">
                    {new Date(session.lastMessage).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sessionList.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No sessions found
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}