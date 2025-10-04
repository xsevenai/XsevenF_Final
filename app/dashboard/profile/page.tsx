// app/dashboard/components/Profile.tsx

"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { useTheme } from "@/hooks/useTheme"
import {
  User,
  Building,
  Settings,
  Camera,
  Phone,
  Mail,
  Edit,
  Save,
  X,
  Check,
  Moon,
  Sun,
} from "lucide-react"

interface ProfileData {
  firstName: string
  lastName: string
  email: string
  phone: string
  restaurantName: string
  restaurantAddress: string
  profilePhoto: string
}

export default function Profile() {
  const { theme, isLoaded: themeLoaded, isDark, currentTheme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showSaveIndicator, setShowSaveIndicator] = useState(false)

  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "DEYBY",
    lastName: "NAVEEN",
    email: "owner@deybynaveen.com",
    phone: "+1 (555) 123-4567",
    restaurantName: "DEYBYNAVEEN",
    restaurantAddress: "123 Restaurant Street, Downtown, CA 90210",
    profilePhoto: "",
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!themeLoaded || !mounted) {
    return null
  }

  // Theme variables matching MainPanel
  const mainPanelBg = isDark ? 'bg-[#111111]' : 'bg-gray-50'
  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const inputBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-white border-gray-300'
  const gradientText = isDark 
    ? 'bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent'
    : 'bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 bg-clip-text text-transparent'
  const buttonPrimary = isDark ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'

  const handleSave = () => {
    setShowSaveIndicator(true)
    setIsEditing(false)
    setTimeout(() => setShowSaveIndicator(false), 2000)
  }

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className={`${mainPanelBg} p-6 space-y-6 transition-colors duration-300`}>
      {/* Header */}
      <div className={`${cardBg} p-8 border shadow-lg relative overflow-hidden`}
        style={{ borderRadius: '1.5rem' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-4xl font-bold mb-2 ${gradientText}`}>Profile Settings</h1>
            <p className={`${textSecondary}`}>Manage your personal and restaurant information</p>
          </div>
          <div className="flex items-center gap-4">
            {showSaveIndicator && (
              <div className="flex items-center gap-2 text-green-400 bg-green-500/20 px-3 py-1.5"
                style={{ borderRadius: '0.5rem' }}>
                <Check className="h-4 w-4" />
                <span className="text-sm font-medium">Saved</span>
              </div>
            )}
            {isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 transition-colors flex items-center gap-2"
                  style={{ borderRadius: '0.5rem' }}
                >
                  <Save className="h-4 w-4" />
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className={`px-4 py-2 ${inputBg} ${textSecondary} transition-colors flex items-center gap-2`}
                  style={{ borderRadius: '0.5rem' }}
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className={`${buttonPrimary} px-4 py-2 transition-colors flex items-center gap-2`}
                style={{ borderRadius: '0.5rem' }}
              >
                <Edit className="h-4 w-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card className={`${cardBg} border shadow-lg p-6 hover:shadow-xl transition-all duration-300`}
          style={{ borderRadius: '1.5rem' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} p-3 rounded-2xl`}>
              <User className={`h-6 w-6 ${textPrimary}`} />
            </div>
            <h2 className={`text-xl font-bold ${textPrimary}`}>Personal Information</h2>
          </div>

          {/* Profile Photo */}
          <div className="flex items-center gap-6 mb-6">
            <div className={`w-20 h-20 ${isDark ? 'bg-purple-600' : 'bg-gray-700'} flex items-center justify-center`}
              style={{ borderRadius: '50%' }}>
              {profileData.profilePhoto ? (
                <img src={profileData.profilePhoto} alt="Profile" className="w-full h-full object-cover"
                  style={{ borderRadius: '50%' }} />
              ) : (
                <span className="text-white font-bold text-xl">
                  {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 transition-colors flex items-center gap-2"
                style={{ borderRadius: '0.5rem' }}>
                <Camera className="h-4 w-4" />
                Upload Photo
              </button>
              <p className={`${textSecondary} text-sm mt-2`}>JPG or PNG. Max 2MB.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block ${textPrimary} font-medium mb-2 text-sm`}>First Name</label>
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  disabled={!isEditing}
                  className={`w-full ${inputBg} ${textPrimary} px-3 py-2 border focus:border-purple-500 focus:outline-none disabled:opacity-60 transition-colors`}
                  style={{ borderRadius: '0.5rem' }}
                />
              </div>
              <div>
                <label className={`block ${textPrimary} font-medium mb-2 text-sm`}>Last Name</label>
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  disabled={!isEditing}
                  className={`w-full ${inputBg} ${textPrimary} px-3 py-2 border focus:border-purple-500 focus:outline-none disabled:opacity-60 transition-colors`}
                  style={{ borderRadius: '0.5rem' }}
                />
              </div>
            </div>

            <div>
              <label className={`block ${textPrimary} font-medium mb-2 text-sm`}>Email</label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${textSecondary}`} />
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={!isEditing}
                  className={`w-full ${inputBg} ${textPrimary} pl-10 pr-3 py-2 border focus:border-purple-500 focus:outline-none disabled:opacity-60 transition-colors`}
                  style={{ borderRadius: '0.5rem' }}
                />
              </div>
            </div>

            <div>
              <label className={`block ${textPrimary} font-medium mb-2 text-sm`}>Phone</label>
              <div className="relative">
                <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${textSecondary}`} />
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  disabled={!isEditing}
                  className={`w-full ${inputBg} ${textPrimary} pl-10 pr-3 py-2 border focus:border-purple-500 focus:outline-none disabled:opacity-60 transition-colors`}
                  style={{ borderRadius: '0.5rem' }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Restaurant Information */}
        <Card className={`${cardBg} border shadow-lg p-6 hover:shadow-xl transition-all duration-300`}
          style={{ borderRadius: '1.5rem' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} p-3 rounded-2xl`}>
              <Building className={`h-6 w-6 ${textPrimary}`} />
            </div>
            <h2 className={`text-xl font-bold ${textPrimary}`}>Restaurant Information</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className={`block ${textPrimary} font-medium mb-2 text-sm`}>Restaurant Name</label>
              <input
                type="text"
                value={profileData.restaurantName}
                onChange={(e) => handleInputChange("restaurantName", e.target.value)}
                disabled={!isEditing}
                className={`w-full ${inputBg} ${textPrimary} px-3 py-2 border focus:border-purple-500 focus:outline-none disabled:opacity-60 transition-colors`}
                style={{ borderRadius: '0.5rem' }}
              />
            </div>

            <div>
              <label className={`block ${textPrimary} font-medium mb-2 text-sm`}>Address</label>
              <textarea
                rows={3}
                value={profileData.restaurantAddress}
                onChange={(e) => handleInputChange("restaurantAddress", e.target.value)}
                disabled={!isEditing}
                className={`w-full ${inputBg} ${textPrimary} px-3 py-2 border focus:border-purple-500 focus:outline-none disabled:opacity-60 transition-colors resize-none`}
                style={{ borderRadius: '0.5rem' }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Settings */}
      <Card className={`${cardBg} border shadow-lg p-6 hover:shadow-xl transition-all duration-300`}
        style={{ borderRadius: '1.5rem' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'} p-3 rounded-2xl`}>
            <Settings className={`h-6 w-6 ${textPrimary}`} />
          </div>
          <h2 className={`text-xl font-bold ${textPrimary}`}>Quick Settings</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className={`${textPrimary} font-medium`}>Email Notifications</h4>
              <p className={`${textSecondary} text-sm`}>Receive updates via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className={`${textPrimary} font-medium`}>Order Alerts</h4>
              <p className={`${textSecondary} text-sm`}>Get notified of new orders</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className={`${textPrimary} font-medium`}>Theme Mode</h4>
              <p className={`${textSecondary} text-sm`}>
                {isDark ? 'Dark mode enabled' : 'Light mode enabled'}
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className={`p-2 ${isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-600/20 text-gray-600'} transition-colors`}
              style={{ borderRadius: '0.5rem' }}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}