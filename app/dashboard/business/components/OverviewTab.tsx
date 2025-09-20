// app/dashboard/business/components/OverviewTab.tsx

"use client"

import { Card } from "@/components/ui/card"
import {
  DollarSign,
  Users,
  Clock,
  Star,
  ArrowUpRight,
  CheckCircle,
  Activity,
  Target,
  TrendingUp,
  AlertTriangle,
  Phone,
  Mail,
  MapPin,
} from "lucide-react"
import type { BusinessMetrics } from "./types"

interface OverviewTabProps {
  businessMetrics: BusinessMetrics
}

export default function OverviewTab({ businessMetrics }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm font-medium">Monthly Revenue</p>
              <p className="text-3xl font-bold text-white">${businessMetrics.revenue.monthly.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-400" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ArrowUpRight className="h-4 w-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">+{businessMetrics.revenue.growth}%</span>
            <span className="text-gray-400 text-sm">vs last month</span>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Customers</p>
              <p className="text-3xl font-bold text-white">{businessMetrics.customers.total.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ArrowUpRight className="h-4 w-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">+{businessMetrics.customers.newThisMonth}</span>
            <span className="text-gray-400 text-sm">new this month</span>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm font-medium">Avg Wait Time</p>
              <p className="text-3xl font-bold text-white">{businessMetrics.operations.averageWaitTime}m</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">Optimal</span>
            <span className="text-gray-400 text-sm">under 10m target</span>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm font-medium">Customer Rating</p>
              <p className="text-3xl font-bold text-white">{businessMetrics.satisfaction.overallRating}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Star className="h-6 w-6 text-purple-400" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-white text-sm font-medium">{businessMetrics.satisfaction.totalReviews} reviews</span>
          </div>
        </Card>
      </div>

      {/* Business Health Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-400" />
            Operational Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Table Utilization</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: `${businessMetrics.operations.tableUtilization}%`}}></div>
                </div>
                <span className="text-white font-medium">{businessMetrics.operations.tableUtilization}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Staff Efficiency</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: `${businessMetrics.operations.staffEfficiency}%`}}></div>
                </div>
                <span className="text-white font-medium">{businessMetrics.operations.staffEfficiency}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Customer Return Rate</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{width: `${businessMetrics.customers.returningRate}%`}}></div>
                </div>
                <span className="text-white font-medium">{businessMetrics.customers.returningRate}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Review Response Rate</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-700 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{width: `${businessMetrics.satisfaction.responseRate}%`}}></div>
                </div>
                <span className="text-white font-medium">{businessMetrics.satisfaction.responseRate}%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-400" />
            Performance Goals
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-400 font-medium">Monthly Revenue Target</span>
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className="text-white text-sm">
                ${businessMetrics.revenue.monthly.toLocaleString()} / $65,000 (103%)
              </div>
            </div>
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-yellow-400 font-medium">Customer Satisfaction</span>
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="text-white text-sm">
                {businessMetrics.satisfaction.overallRating} / 5.0 stars (94%)
              </div>
            </div>
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-400 font-medium">New Customer Acquisition</span>
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
              <div className="text-white text-sm">
                {businessMetrics.customers.newThisMonth} / 100 customers (89%)
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Business Info */}
      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
        <h3 className="text-white font-semibold mb-6">Business Information Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-gray-300 font-medium mb-2">Contact Details</h4>
            <div className="space-y-2">
              <p className="text-gray-400 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +1 (555) 123-4567
              </p>
              <p className="text-gray-400 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                info@deybynaveen.com
              </p>
              <p className="text-gray-400 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                123 Restaurant Street, Downtown, CA
              </p>
            </div>
          </div>
          <div>
            <h4 className="text-gray-300 font-medium mb-2">Operating Hours</h4>
            <div className="space-y-1">
              <p className="text-gray-400">Mon-Thu: 9:00 AM - 10:00 PM</p>
              <p className="text-gray-400">Fri-Sat: 9:00 AM - 11:00 PM</p>
              <p className="text-gray-400">Sunday: 10:00 AM - 9:00 PM</p>
            </div>
          </div>
          <div>
            <h4 className="text-gray-300 font-medium mb-2">Business Status</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-400 text-sm">Currently Open</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-blue-400 text-sm">Accepting Orders</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-purple-400 text-sm">5 Tables Available</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}