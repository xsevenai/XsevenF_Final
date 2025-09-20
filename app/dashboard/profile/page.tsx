// app/dashboard/components/Profile.tsx

"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import {
  User,
  Building,
  Settings,
  Camera,
  MapPin,
  Phone,
  Mail,
  Lock,
  Bell,
  CreditCard,
  Shield,
  Upload,
  Edit,
  Save,
  X,
  Check,
  AlertCircle,
} from "lucide-react"
import type { ProfileData } from "../components/types"

export default function Profile() {
  const [activeTab, setActiveTab] = useState<"personal" | "restaurant" | "settings">("personal")
  const [isEditing, setIsEditing] = useState(false)
  const [showSaveIndicator, setShowSaveIndicator] = useState(false)

  const [profileData, setProfileData] = useState<ProfileData>({
    personal: {
      firstName: "DEYBY",
      lastName: "NAVEEN",
      email: "owner@deybynaveen.com",
      phone: "+1 (555) 123-4567",
      profilePhoto: "",
      emergencyContact: "Emergency Contact Name",
      emergencyPhone: "+1 (555) 987-6543",
    },
    restaurant: {
      name: "DEYBYNAVEEN",
      description: "Premium dining experience with authentic flavors and exceptional service",
      address: "123 Restaurant Street",
      city: "Downtown",
      state: "CA",
      zipCode: "90210",
      phone: "+1 (555) 123-4567",
      email: "info@deybynaveen.com",
      logo: "",
      website: "www.deybynaveen.com",
      licenseNumber: "RES-2024-001234",
    },
    settings: {
      emailNotifications: true,
      smsNotifications: false,
      orderAlerts: true,
      reviewAlerts: true,
      twoFactorEnabled: false,
      theme: "dark",
    },
  })

  const handleSave = () => {
    setShowSaveIndicator(true)
    setIsEditing(false)
    setTimeout(() => setShowSaveIndicator(false), 2000)
  }

  const handleInputChange = (section: keyof ProfileData, field: string, value: string | boolean) => {
    setProfileData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const tabs = [
    { id: "personal" as const, label: "Personal Information", icon: User },
    { id: "restaurant" as const, label: "Restaurant Information", icon: Building },
    { id: "settings" as const, label: "Settings & Security", icon: Settings },
  ]

  const renderPersonalTab = () => (
    <div className="space-y-6">
      {/* Profile Photo Section */}
      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Camera className="h-5 w-5 text-blue-400" />
          Profile Photo
        </h3>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#B76E79] rounded-full flex items-center justify-center">
            {profileData.personal.profilePhoto ? (
              <img src={profileData.personal.profilePhoto} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-black font-bold text-2xl">
                {profileData.personal.firstName.charAt(0)}{profileData.personal.lastName.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Photo
            </button>
            <p className="text-gray-400 text-sm mt-2">JPG or PNG. Max size 2MB.</p>
          </div>
        </div>
      </Card>

      {/* Basic Information */}
      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
        <h3 className="text-white font-semibold mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 font-medium mb-2">First Name</label>
            <input
              type="text"
              value={profileData.personal.firstName}
              onChange={(e) => handleInputChange("personal", "firstName", e.target.value)}
              disabled={!isEditing}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none disabled:opacity-60"
            />
          </div>
          <div>
            <label className="block text-gray-300 font-medium mb-2">Last Name</label>
            <input
              type="text"
              value={profileData.personal.lastName}
              onChange={(e) => handleInputChange("personal", "lastName", e.target.value)}
              disabled={!isEditing}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none disabled:opacity-60"
            />
          </div>
          <div>
            <label className="block text-gray-300 font-medium mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={profileData.personal.email}
                onChange={(e) => handleInputChange("personal", "email", e.target.value)}
                disabled={!isEditing}
                className="w-full bg-gray-700 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none disabled:opacity-60"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-300 font-medium mb-2">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                value={profileData.personal.phone}
                onChange={(e) => handleInputChange("personal", "phone", e.target.value)}
                disabled={!isEditing}
                className="w-full bg-gray-700 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none disabled:opacity-60"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Emergency Contact */}
      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-400" />
          Emergency Contact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 font-medium mb-2">Contact Name</label>
            <input
              type="text"
              value={profileData.personal.emergencyContact}
              onChange={(e) => handleInputChange("personal", "emergencyContact", e.target.value)}
              disabled={!isEditing}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none disabled:opacity-60"
            />
          </div>
          <div>
            <label className="block text-gray-300 font-medium mb-2">Contact Phone</label>
            <input
              type="tel"
              value={profileData.personal.emergencyPhone}
              onChange={(e) => handleInputChange("personal", "emergencyPhone", e.target.value)}
              disabled={!isEditing}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none disabled:opacity-60"
            />
          </div>
        </div>
      </Card>
    </div>
  )

  const renderRestaurantTab = () => (
    <div className="space-y-6">
      {/* Restaurant Logo */}
      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Building className="h-5 w-5 text-green-400" />
          Restaurant Logo
        </h3>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center">
            {profileData.restaurant.logo ? (
              <img src={profileData.restaurant.logo} alt="Logo" className="w-full h-full rounded-lg object-cover" />
            ) : (
              <Building className="h-12 w-12 text-gray-400" />
            )}
          </div>
          <div>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Logo
            </button>
            <p className="text-gray-400 text-sm mt-2">PNG preferred. Square format recommended.</p>
          </div>
        </div>
      </Card>

      {/* Basic Information */}
      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
        <h3 className="text-white font-semibold mb-4">Restaurant Details</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-gray-300 font-medium mb-2">Restaurant Name</label>
            <input
              type="text"
              value={profileData.restaurant.name}
              onChange={(e) => handleInputChange("restaurant", "name", e.target.value)}
              disabled={!isEditing}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none disabled:opacity-60"
            />
          </div>
          <div>
            <label className="block text-gray-300 font-medium mb-2">Description</label>
            <textarea
              rows={3}
              value={profileData.restaurant.description}
              onChange={(e) => handleInputChange("restaurant", "description", e.target.value)}
              disabled={!isEditing}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none disabled:opacity-60"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 font-medium mb-2">Website</label>
              <input
                type="url"
                value={profileData.restaurant.website}
                onChange={(e) => handleInputChange("restaurant", "website", e.target.value)}
                disabled={!isEditing}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none disabled:opacity-60"
              />
            </div>
            <div>
              <label className="block text-gray-300 font-medium mb-2">License Number</label>
              <input
                type="text"
                value={profileData.restaurant.licenseNumber}
                onChange={(e) => handleInputChange("restaurant", "licenseNumber", e.target.value)}
                disabled={!isEditing}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none disabled:opacity-60"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Address Information */}
      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-400" />
          Address Information
        </h3>
        <div className="space-y-6">
          <div>
            <label className="block text-gray-300 font-medium mb-2">Street Address</label>
            <input
              type="text"
              value={profileData.restaurant.address}
              onChange={(e) => handleInputChange("restaurant", "address", e.target.value)}
              disabled={!isEditing}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none disabled:opacity-60"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-300 font-medium mb-2">City</label>
              <input
                type="text"
                value={profileData.restaurant.city}
                onChange={(e) => handleInputChange("restaurant", "city", e.target.value)}
                disabled={!isEditing}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none disabled:opacity-60"
              />
            </div>
            <div>
              <label className="block text-gray-300 font-medium mb-2">State</label>
              <input
                type="text"
                value={profileData.restaurant.state}
                onChange={(e) => handleInputChange("restaurant", "state", e.target.value)}
                disabled={!isEditing}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none disabled:opacity-60"
              />
            </div>
            <div>
              <label className="block text-gray-300 font-medium mb-2">ZIP Code</label>
              <input
                type="text"
                value={profileData.restaurant.zipCode}
                onChange={(e) => handleInputChange("restaurant", "zipCode", e.target.value)}
                disabled={!isEditing}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none disabled:opacity-60"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Contact Information */}
      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
        <h3 className="text-white font-semibold mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 font-medium mb-2">Restaurant Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                value={profileData.restaurant.phone}
                onChange={(e) => handleInputChange("restaurant", "phone", e.target.value)}
                disabled={!isEditing}
                className="w-full bg-gray-700 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none disabled:opacity-60"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-300 font-medium mb-2">Restaurant Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={profileData.restaurant.email}
                onChange={(e) => handleInputChange("restaurant", "email", e.target.value)}
                disabled={!isEditing}
                className="w-full bg-gray-700 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none disabled:opacity-60"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )

  const renderSettingsTab = () => (
    <div className="space-y-6">
      {/* Notification Settings */}
      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-yellow-400" />
          Notification Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Email Notifications</h4>
              <p className="text-gray-400 text-sm">Receive updates via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={profileData.settings.emailNotifications}
                onChange={(e) => handleInputChange("settings", "emailNotifications", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">SMS Notifications</h4>
              <p className="text-gray-400 text-sm">Receive updates via text message</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={profileData.settings.smsNotifications}
                onChange={(e) => handleInputChange("settings", "smsNotifications", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Order Alerts</h4>
              <p className="text-gray-400 text-sm">Get notified of new orders</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={profileData.settings.orderAlerts}
                onChange={(e) => handleInputChange("settings", "orderAlerts", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Review Alerts</h4>
              <p className="text-gray-400 text-sm">Get notified of new customer reviews</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={profileData.settings.reviewAlerts}
                onChange={(e) => handleInputChange("settings", "reviewAlerts", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-400" />
          Security Settings
        </h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Two-Factor Authentication</h4>
              <p className="text-gray-400 text-sm">Add extra security to your account</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={profileData.settings.twoFactorEnabled}
                onChange={(e) => handleInputChange("settings", "twoFactorEnabled", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
          <div>
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Change Password
            </button>
          </div>
        </div>
      </Card>

      {/* Theme Settings */}
      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
        <h3 className="text-white font-semibold mb-4">Theme Settings</h3>
        <div>
          <label className="block text-gray-300 font-medium mb-2">Color Theme</label>
          <select
            value={profileData.settings.theme}
            onChange={(e) => handleInputChange("settings", "theme", e.target.value)}
            className="w-full md:w-64 bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
          >
            <option value="dark">Dark Theme</option>
            <option value="light">Light Theme</option>
            <option value="auto">Auto (System)</option>
          </select>
        </div>
      </Card>

      {/* Account Management */}
      <Card className="bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] border-gray-700/50 p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-blue-400" />
          Account Management
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-white font-medium mb-2">Subscription Status</h4>
            <div className="flex items-center gap-2">
              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                Pro Plan - Active
              </span>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              Manage Subscription
            </button>
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
              View Billing
            </button>
          </div>
        </div>
      </Card>
    </div>
  )

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Header */}
      <div className="flex-1 flex flex-col">
        <div className="bg-gradient-to-r from-[#16213e] to-[#1a1b2e] border-b border-gray-700/50 px-6 py-4 shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Profile Settings
              </h1>
              <p className="text-gray-400">Manage your personal and restaurant information</p>
            </div>
            <div className="flex items-center gap-4">
              {showSaveIndicator && (
                <div className="flex items-center gap-2 text-green-400 bg-green-500/20 px-3 py-1.5 rounded-lg">
                  <Check className="h-4 w-4" />
                  <span className="text-sm font-medium">Saved</span>
                </div>
              )}
              {isEditing ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Navigation Tabs */}
          <div className="w-80 bg-gradient-to-b from-[#16213e] to-[#0f172a] border-r border-gray-700/50 p-6">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] text-white shadow-lg shadow-purple-500/25"
                      : "text-gray-300 hover:bg-gray-700/30 hover:text-white"
                  }`}
                >
                  <tab.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>

            {/* Profile Summary */}
            <div className="mt-8 p-4 bg-gradient-to-br from-[#1a1b2e] to-[#0f172a] rounded-xl border border-gray-700/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#B76E79] rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-lg">
                    {profileData.personal.firstName.charAt(0)}{profileData.personal.lastName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">
                    {profileData.personal.firstName} {profileData.personal.lastName}
                  </h3>
                  <p className="text-gray-400 text-sm">{profileData.restaurant.name}</p>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                <p className="flex items-center gap-2 mb-1">
                  <Mail className="h-3 w-3" />
                  {profileData.personal.email}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  {profileData.personal.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <div className="p-6">
              {activeTab === "personal" && renderPersonalTab()}
              {activeTab === "restaurant" && renderRestaurantTab()}
              {activeTab === "settings" && renderSettingsTab()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}