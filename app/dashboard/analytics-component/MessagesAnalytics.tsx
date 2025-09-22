import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { MessageSquare, Users, Clock, TrendingUp, Search, Filter } from 'lucide-react';
import { useMessagesAnalytics } from '@/hooks/use-analytics';

// Fixed interfaces to match your database schema
interface Message {
  id: string;
  business_id: string;
  session_id: string;
  role: string;
  content: string;
  sender_type: 'customer' | 'ai_assistant' | 'staff';
  created_at: string;
  chat_context?: string;
}

interface MessagesSummary {
  total_messages: number;
  total_sessions: number;
  average_messages_per_session: number;
  sender_distribution?: Record<string, number>;
}

interface MessagesData {
  summary: MessagesSummary;
  messages: Message[];
  daily_breakdown?: Record<string, any>;
  session_stats?: Record<string, any>;
}

interface ChartDataPoint {
  date: string;
  messages: number;
  sessions: number;
  customer: number;
  ai: number;
  staff: number;
}

interface SenderDataPoint {
  name: string;
  value: number;
  color: string;
}

interface SessionStat {
  sessionId: string;
  messageCount: number;
  firstMessage: string;
  lastMessage: string;
  customerMessages: number;
  aiMessages: number;
  staffMessages: number;
}

interface MessagesAnalyticsProps {
  timeRange: string;
}

export default function MessagesAnalytics({ timeRange }: MessagesAnalyticsProps) {
  const [sessionFilter, setSessionFilter] = useState<string>('');
  const [senderFilter, setSenderFilter] = useState<string>('');
  
  const { 
    messagesData, 
    loading, 
    error, 
    refetch 
  } = useMessagesAnalytics(timeRange, sessionFilter);

  const senderTypes = [
    { value: '', label: 'All Senders' },
    { value: 'customer', label: 'Customer' },
    { value: 'ai_assistant', label: 'AI Assistant' },
    { value: 'staff', label: 'Staff' }
  ];

  // Helper function to safely get created_at date
  const getMessageDate = (message: Message): string => {
    if (!message.created_at) return '';
    try {
      return message.created_at.split('T')[0];
    } catch (error) {
      console.warn('Invalid date format:', message.created_at);
      return '';
    }
  };

  // Helper function to normalize sender type
  const normalizeSenderType = (senderType: string): 'customer' | 'ai' | 'staff' => {
    switch (senderType) {
      case 'customer':
        return 'customer';
      case 'ai_assistant':
      case 'ai':
        return 'ai';
      case 'staff':
        return 'staff';
      default:
        return 'customer';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400">Error loading messages analytics: {error}</p>
        <button 
          onClick={refetch}
          className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const summary: MessagesSummary = messagesData?.summary || {
    total_messages: 0,
    total_sessions: 0,
    average_messages_per_session: 0
  };

  const messages: Message[] = messagesData?.messages || [];

  // Filter messages based on sender type
  const filteredMessages = messages.filter((message: Message) => 
    senderFilter === '' || message.sender_type === senderFilter
  );

  // Generate chart data for message trends
  const chartData: ChartDataPoint[] = [];
  const days = timeRange === '1d' ? 1 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayMessages = messages.filter((message: Message) => {
      const messageDate = getMessageDate(message);
      return messageDate === dateStr;
    });
    
    const uniqueSessions = new Set(dayMessages.map((m: Message) => m.session_id)).size;
    
    chartData.push({
      date: dateStr,
      messages: dayMessages.length,
      sessions: uniqueSessions,
      customer: dayMessages.filter((m: Message) => normalizeSenderType(m.sender_type) === 'customer').length,
      ai: dayMessages.filter((m: Message) => normalizeSenderType(m.sender_type) === 'ai').length,
      staff: dayMessages.filter((m: Message) => normalizeSenderType(m.sender_type) === 'staff').length
    });
  }

  // Sender distribution
  const senderCounts = messages.reduce((acc: Record<string, number>, message: Message) => {
    const normalizedSender = normalizeSenderType(message.sender_type);
    acc[normalizedSender] = (acc[normalizedSender] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const senderData: SenderDataPoint[] = [
    { name: 'Customer', value: senderCounts.customer || 0, color: '#3B82F6' },
    { name: 'AI Assistant', value: senderCounts.ai || 0, color: '#8B5CF6' },
    { name: 'Staff', value: senderCounts.staff || 0, color: '#10B981' }
  ];

  // Session analysis
  const sessionStats = messages.reduce((acc: Record<string, SessionStat>, message: Message) => {
    if (!message.session_id || !message.created_at) return acc;

    if (!acc[message.session_id]) {
      acc[message.session_id] = {
        sessionId: message.session_id,
        messageCount: 0,
        firstMessage: message.created_at,
        lastMessage: message.created_at,
        customerMessages: 0,
        aiMessages: 0,
        staffMessages: 0
      };
    }
    
    acc[message.session_id].messageCount++;
    
    // Type-safe increment based on sender type
    const normalizedSender = normalizeSenderType(message.sender_type);
    if (normalizedSender === 'customer') {
      acc[message.session_id].customerMessages++;
    } else if (normalizedSender === 'ai') {
      acc[message.session_id].aiMessages++;
    } else if (normalizedSender === 'staff') {
      acc[message.session_id].staffMessages++;
    }
    
    if (new Date(message.created_at) < new Date(acc[message.session_id].firstMessage)) {
      acc[message.session_id].firstMessage = message.created_at;
    }
    if (new Date(message.created_at) > new Date(acc[message.session_id].lastMessage)) {
      acc[message.session_id].lastMessage = message.created_at;
    }
    
    return acc;
  }, {} as Record<string, SessionStat>);

  const sessionList: SessionStat[] = Object.values(sessionStats).sort((a: SessionStat, b: SessionStat) => 
    new Date(b.lastMessage).getTime() - new Date(a.lastMessage).getTime()
  );

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
              <p className="text-2xl font-bold text-white">{summary.average_messages_per_session?.toFixed(1) || '0.0'}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-400" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Raw Messages</p>
              <p className="text-2xl font-bold text-white">{messages.length}</p>
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

      {/* Raw Messages Table for Debugging */}
      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Messages (Debug)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-400 font-medium py-3">Session ID</th>
                <th className="text-left text-gray-400 font-medium py-3">Role</th>
                <th className="text-left text-gray-400 font-medium py-3">Sender Type</th>
                <th className="text-left text-gray-400 font-medium py-3">Content</th>
                <th className="text-left text-gray-400 font-medium py-3">Created At</th>
              </tr>
            </thead>
            <tbody>
              {messages.slice(0, 10).map((message: Message) => (
                <tr key={message.id} className="border-b border-gray-700/30 hover:bg-gray-700/20">
                  <td className="py-3 text-white font-mono text-xs">{message.session_id?.slice(0, 12) || 'N/A'}...</td>
                  <td className="py-3 text-blue-400">{message.role || 'N/A'}</td>
                  <td className="py-3 text-purple-400">{message.sender_type || 'N/A'}</td>
                  <td className="py-3 text-gray-300 max-w-xs truncate">{message.content?.slice(0, 50) || 'N/A'}...</td>
                  <td className="py-3 text-gray-400">
                    {message.created_at ? new Date(message.created_at).toLocaleString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {messages.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No messages found
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}