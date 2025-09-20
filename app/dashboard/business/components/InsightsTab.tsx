// app/dashboard/business/components/InsightsTab.tsx

"use client"

import { Card } from "@/components/ui/card"
import { MapPin, Star, TrendingUp, Award, CheckCircle, AlertTriangle } from "lucide-react"
import type { CompetitorData } from "./types"

interface InsightsTabProps {
  competitorData: CompetitorData[]
}

export default function InsightsTab({ competitorData }: InsightsTabProps) {
  return (
    <div className="space-y-6">
      {/* Market Analysis */}
      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
        <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-red-400" />
          Local Market Analysis
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <h4 className="text-blue-400 font-medium mb-2">Your Position</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-white font-semibold">Rating: 4.7⭐</div>
                <div className="text-gray-400">Above average</div>
              </div>
              <div>
                <div className="text-white font-semibold">Avg Price: $42</div>
                <div className="text-gray-400">Competitive</div>
              </div>
              <div>
                <div className="text-white font-semibold">Market Share: 18%</div>
                <div className="text-gray-400">Leading</div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-3">Nearby Competitors</h4>
            <div className="space-y-2">
              {competitorData.map((competitor, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                  <div>
                    <div className="text-white font-medium">{competitor.name}</div>
                    <div className="text-gray-400 text-sm">{competitor.distance}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white">{competitor.rating}⭐</div>
                    <div className="text-gray-400 text-sm">${competitor.avgPrice} avg</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Customer Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-purple-400" />
            Customer Feedback Insights
          </h3>
          <div className="space-y-4">
            <div className="p-3 bg-green-500/10 border-l-4 border-green-500 rounded">
              <div className="text-green-400 font-medium">Most Praised</div>
              <div className="text-white text-sm mt-1">"Excellent service and atmosphere"</div>
            </div>
            <div className="p-3 bg-yellow-500/10 border-l-4 border-yellow-500 rounded">
              <div className="text-yellow-400 font-medium">Room for Improvement</div>
              <div className="text-white text-sm mt-1">"Wait times during peak hours"</div>
            </div>
            <div className="p-3 bg-blue-500/10 border-l-4 border-blue-500 rounded">
              <div className="text-blue-400 font-medium">Popular Items</div>
              <div className="text-white text-sm mt-1">"Pizza and salmon consistently mentioned"</div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            Growth Opportunities
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <div className="text-purple-400 font-medium text-sm">Delivery Expansion</div>
              <div className="text-gray-300 text-sm">Potential 25% revenue increase</div>
            </div>
            <div className="p-3 bg-green-500/10 rounded-lg">
              <div className="text-green-400 font-medium text-sm">Weekend Brunch</div>
              <div className="text-gray-300 text-sm">High demand in local area</div>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <div className="text-blue-400 font-medium text-sm">Private Events</div>
              <div className="text-gray-300 text-sm">Underutilized revenue stream</div>
            </div>
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <div className="text-yellow-400 font-medium text-sm">Loyalty Program</div>
              <div className="text-gray-300 text-sm">Boost customer retention</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Business Intelligence Summary */}
      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
        <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
          <Award className="h-5 w-5 text-yellow-400" />
          AI-Powered Business Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-green-400 font-medium mb-3">Strengths</h4>
            <ul className="space-y-2">
              <li className="text-gray-300 text-sm flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                Consistent high ratings (4.7/5) above market average
              </li>
              <li className="text-gray-300 text-sm flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                Strong revenue growth (+12.5%) exceeding targets
              </li>
              <li className="text-gray-300 text-sm flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                Excellent customer retention rate (68.3%)
              </li>
              <li className="text-gray-300 text-sm flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                Optimal operational efficiency metrics
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-yellow-400 font-medium mb-3">Recommendations</h4>
            <ul className="space-y-2">
              <li className="text-gray-300 text-sm flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                Consider expanding delivery radius by 2 miles
              </li>
              <li className="text-gray-300 text-sm flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                Implement loyalty program to boost retention further
              </li>
              <li className="text-gray-300 text-sm flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                Optimize staffing during 7-8 PM peak hours
              </li>
              <li className="text-gray-300 text-sm flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                Promote underperforming menu categories
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}