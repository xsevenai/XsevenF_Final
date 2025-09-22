// app/dashboard/analytics-component/CustomerAnalytics.tsx

"use client"

import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Users, UserPlus, Repeat, Star } from "lucide-react"

interface CustomerAnalyticsProps {
  timeRange: string
}

export default function CustomerAnalytics({ timeRange }: CustomerAnalyticsProps) {
  // Mock data - replace with real API call
  const customerData = {
    totalCustomers: 1247,
    newCustomers: 89,
    returningCustomers: 156,
    satisfactionScore: 4.7
  }

  const behaviorData = [
    { name: 'New', value: 35, color: '#3B82F6' },
    { name: 'Returning', value: 45, color: '#10B981' },
    { name: 'Frequent', value: 20, color: '#8B5CF6' }
  ]

  const engagementData = [
    { day: 'Mon', sessions: 45, messages: 120 },
    { day: 'Tue', sessions: 52, messages: 135 },
    { day: 'Wed', sessions: 38, messages: 98 },
    { day: 'Thu', sessions: 61, messages: 156 },
    { day: 'Fri', sessions: 73, messages: 189 },
    { day: 'Sat', sessions: 85, messages: 210 },
    { day: 'Sun', sessions: 67, messages: 167 }
  ]

  return (
    <div className="space-y-6">
      {/* Customer Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Customers</p>
              <p className="text-2xl font-bold text-white">{customerData.totalCustomers}</p>
            </div>
            <Users className="h-8 w-8 text-blue-400" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">New Customers</p>
              <p className="text-2xl font-bold text-white">{customerData.newCustomers}</p>
            </div>
            <UserPlus className="h-8 w-8 text-green-400" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Returning</p>
              <p className="text-2xl font-bold text-white">{customerData.returningCustomers}</p>
            </div>
            <Repeat className="h-8 w-8 text-purple-400" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Satisfaction</p>
              <p className="text-2xl font-bold text-white">{customerData.satisfactionScore}/5</p>
            </div>
            <Star className="h-8 w-8 text-yellow-400" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Customer Behavior</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={behaviorData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {behaviorData.map((entry, index) => (
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
            {behaviorData.map((entry, index) => (
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

        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Weekly Engagement</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Bar dataKey="sessions" fill="#3B82F6" name="Sessions" />
                <Bar dataKey="messages" fill="#8B5CF6" name="Messages" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Customer Insights */}
      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Customer Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">8.2</p>
            <p className="text-gray-400 text-sm">Avg Orders per Customer</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">$245</p>
            <p className="text-gray-400 text-sm">Customer Lifetime Value</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">73%</p>
            <p className="text-gray-400 text-sm">Return Rate</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">4.2 days</p>
            <p className="text-gray-400 text-sm">Avg Time Between Orders</p>
          </div>
        </div>
      </Card>
    </div>
  )
}