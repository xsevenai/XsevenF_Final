"use client"

import { useState, useEffect } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { 
  MessageSquare, 
  Users, 
  Clock, 
  Activity,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Phone
} from 'lucide-react'
import MetricCard from './components/MetricCard'
import ChartContainer from './components/ChartContainer'
import SectionHeader from './components/SectionHeader'
import ModernBarChart from './components/ModernBarChart'
import ModernLineChart from './components/ModernLineChart'
import ModernPieChart from './components/ModernPieChart'

interface MessagesAnalyticsProps {
  timeRange: string
}

export default function MessagesAnalytics({ timeRange }: MessagesAnalyticsProps) {
  const { isDark } = useTheme()
  const [loading, setLoading] = useState(true)

  // Mock data for demonstration
  const mockData = {
    totalMessages: 3456,
    activeSessions: 892,
    avgResponseTime: '2.3 min',
    messagesPerSession: 3.9,
    satisfactionRate: 87.5,
    messagesGrowth: -2.1,
    sessionsGrowth: 15.2,
    responseTimeGrowth: -12.5,
    satisfactionGrowth: 5.8,
    messagesByDay: [
      { day: 'Mon', messages: 234, sessions: 45 },
      { day: 'Tue', messages: 312, sessions: 52 },
      { day: 'Wed', messages: 456, sessions: 78 },
      { day: 'Thu', messages: 389, sessions: 65 },
      { day: 'Fri', messages: 523, sessions: 89 },
      { day: 'Sat', messages: 678, sessions: 95 },
      { day: 'Sun', messages: 789, sessions: 112 }
    ],
    messagesByHour: [
      { hour: '6AM-9AM', messages: 12 },
      { hour: '9AM-12PM', messages: 45 },
      { hour: '12PM-3PM', messages: 89 },
      { hour: '3PM-6PM', messages: 67 },
      { hour: '6PM-9PM', messages: 123 },
      { hour: '9PM-12AM', messages: 78 }
    ],
    messageTypes: [
      { type: 'Customer Support', count: 1456, percentage: 42.1 },
      { type: 'Order Inquiries', count: 1234, percentage: 35.7 },
      { type: 'General Questions', count: 456, percentage: 13.2 },
      { type: 'Complaints', count: 310, percentage: 9.0 }
    ],
    responseTimeData: [
      { hour: '6AM-9AM', avgTime: 5.2 },
      { hour: '9AM-12PM', avgTime: 3.1 },
      { hour: '12PM-3PM', avgTime: 2.8 },
      { hour: '3PM-6PM', avgTime: 3.5 },
      { hour: '6PM-9PM', avgTime: 2.1 },
      { hour: '9PM-12AM', avgTime: 2.9 }
    ],
    recentActivity: [
      { type: 'New Message', description: 'Customer inquiry about delivery time', timestamp: '2 min ago' },
      { type: 'Response Sent', description: 'Replied to order status question', timestamp: '5 min ago' },
      { type: 'Issue Resolved', description: 'Resolved payment problem', timestamp: '8 min ago' },
      { type: 'New Message', description: 'Question about menu items', timestamp: '12 min ago' },
      { type: 'Response Sent', description: 'Provided menu recommendations', timestamp: '15 min ago' }
    ],
    satisfactionBreakdown: [
      { rating: 'Excellent', count: 234, percentage: 45.2 },
      { rating: 'Good', count: 189, percentage: 36.5 },
      { rating: 'Average', count: 67, percentage: 12.9 },
      { rating: 'Poor', count: 28, percentage: 5.4 }
    ]
  }

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 100)
    return () => clearTimeout(timer)
  }, [timeRange])

  const formatNumber = (num: number) => num.toLocaleString()

  return (
    <div className="space-y-6">
      {/* Message Activity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Messages"
          value={formatNumber(mockData.totalMessages)}
          icon={<MessageSquare className="h-6 w-6 text-blue-500" />}
          trend={{ value: mockData.messagesGrowth, isPositive: mockData.messagesGrowth > 0 }}
          isLoading={loading}
          isDark={isDark}
        />
        
        <MetricCard
          title="Active Sessions"
          value={formatNumber(mockData.activeSessions)}
          icon={<Users className="h-6 w-6 text-green-500" />}
          trend={{ value: mockData.sessionsGrowth, isPositive: mockData.sessionsGrowth > 0 }}
          isLoading={loading}
          isDark={isDark}
        />
        
        <MetricCard
          title="Avg Response Time"
          value={mockData.avgResponseTime}
          icon={<Clock className="h-6 w-6 text-yellow-500" />}
          trend={{ value: mockData.responseTimeGrowth, isPositive: mockData.responseTimeGrowth < 0 }}
          isLoading={loading}
          isDark={isDark}
        />
        
        <MetricCard
          title="Satisfaction Rate"
          value={`${mockData.satisfactionRate}%`}
          icon={<CheckCircle className="h-6 w-6 text-purple-500" />}
          trend={{ value: mockData.satisfactionGrowth, isPositive: mockData.satisfactionGrowth > 0 }}
          isLoading={loading}
          isDark={isDark}
        />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Messages per Session"
          value={mockData.messagesPerSession.toString()}
          icon={<Activity className="h-6 w-6 text-orange-500" />}
          subtitle="Average engagement"
          isLoading={loading}
          isDark={isDark}
        />
        
        <MetricCard
          title="Peak Activity"
          value="6PM-9PM"
          icon={<TrendingUp className="h-6 w-6 text-red-500" />}
          subtitle="Most active hour"
          isLoading={loading}
          isDark={isDark}
        />
        
        <MetricCard
          title="Resolution Rate"
          value="94.2%"
          icon={<CheckCircle className="h-6 w-6 text-green-500" />}
          subtitle="Issues resolved"
          isLoading={loading}
          isDark={isDark}
            />
          </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Messages Trend */}
        <ChartContainer
          title="Messages Trend"
          subtitle="Daily message volume and active sessions"
          isDark={isDark}
        >
          <ModernLineChart
            data={mockData.messagesByDay}
            dataKey="messages"
            nameKey="day"
            isDark={isDark}
            color="#3b82f6"
            type="area"
          />
        </ChartContainer>

        {/* Message Types */}
        <ChartContainer
          title="Message Types"
          subtitle="Distribution of message categories"
          isDark={isDark}
        >
          <ModernPieChart
            data={mockData.messageTypes}
            dataKey="count"
            nameKey="type"
            isDark={isDark}
            colors={['#3b82f6', '#8b5cf6', '#06b6d4', '#ef4444']}
          />
        </ChartContainer>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Messages by Hour */}
        <ChartContainer
          title="Messages by Hour"
          subtitle="Peak messaging hours throughout the day"
          isDark={isDark}
        >
          <ModernBarChart
            data={mockData.messagesByHour}
                  dataKey="messages" 
            nameKey="hour"
            isDark={isDark}
            colors={['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#3b82f6']}
          />
        </ChartContainer>

        {/* Response Time Trend */}
        <ChartContainer
          title="Response Time Trend"
          subtitle="Average response time by hour"
          isDark={isDark}
        >
          <ModernLineChart
            data={mockData.responseTimeData}
            dataKey="avgTime"
            nameKey="hour"
            isDark={isDark}
            color="#10b981"
            type="line"
          />
        </ChartContainer>
      </div>

      {/* Customer Satisfaction */}
      <ChartContainer
        title="Customer Satisfaction Breakdown"
        subtitle="Distribution of customer satisfaction ratings"
        isDark={isDark}
      >
        <ModernBarChart
          data={mockData.satisfactionBreakdown}
          dataKey="count"
          nameKey="rating"
          isDark={isDark}
          colors={['#10b981', '#3b82f6', '#f59e0b', '#ef4444']}
        />
      </ChartContainer>

      {/* Recent Activity */}
      <ChartContainer
        title="Recent Activity"
        subtitle="Latest message interactions and responses"
        isDark={isDark}
      >
        <div className="space-y-3">
          {mockData.recentActivity.map((activity, index) => (
            <div key={index} className={`${isDark ? 'bg-[#1f1f1f]' : 'bg-gray-50'} p-4 rounded-lg border ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'New Message' ? 'bg-blue-500' :
                    activity.type === 'Response Sent' ? 'bg-green-500' :
                    activity.type === 'Issue Resolved' ? 'bg-purple-500' : 'bg-gray-500'
                  }`} />
                  <div>
                    <h5 className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium`}>
                      {activity.type}
                    </h5>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                      {activity.description}
                    </p>
                  </div>
                </div>
                <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                  {activity.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ChartContainer>
    </div>
  )
}
