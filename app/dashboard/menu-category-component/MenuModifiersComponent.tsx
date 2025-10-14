// app/dashboard/components/menu/MenuModifiersComponent.tsx

"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Loader2, ToggleLeft, ToggleRight, ArrowLeft, Settings, X, ChevronDown, Users, Video, Mic, Wifi, Phone } from "lucide-react"
import { useTheme } from "@/hooks/useTheme"
import { useMenuModifiers, useMenu } from "@/hooks/use-menu"
import MenuModifierForm from "./MenuModifierForm"

export default function MenuModifiersComponent() {
  const { theme, isLoaded: themeLoaded, isDark } = useTheme()
  const businessId = typeof window !== "undefined" ? localStorage.getItem("businessId") || "" : ""
  const {
    modifiers,
    loading,
    error,
    fetchModifiers,
    createModifier,
    updateModifier,
    deleteModifier,
  } = useMenuModifiers(businessId)

  const [activeTab, setActiveTab] = useState<"all" | "required" | "optional">("all")
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [selectedModifierForItems, setSelectedModifierForItems] = useState<any>(null)
  const [showMenuItemModal, setShowMenuItemModal] = useState(false)

  // Get menu items for assignment management
  const { items: menuItems, assignModifierToItem, removeModifierFromItem } = useMenu(businessId)

  useEffect(() => {
    if (businessId) fetchModifiers()
  }, [businessId])

  const filteredModifiers = modifiers
    ? modifiers.filter((modifier) => {
        if (activeTab === "required") return modifier.required
        if (activeTab === "optional") return !modifier.required
        return true
      })
    : []

  // Handler for toggling modifier active status
  const handleToggleActive = async (modifier: any) => {
    try {
      await updateModifier(modifier.id, { active: !modifier.active })
      fetchModifiers()
    } catch (err) {
      alert("Failed to update modifier status.")
    }
  }

  // Handler for deleting modifier
  const handleDeleteModifier = async (modifierId: string) => {
    if (!confirm("Are you sure you want to delete this modifier?")) return
    setIsDeleting(modifierId)
    try {
      await deleteModifier(modifierId)
      fetchModifiers()
    } catch (err) {
      alert("Failed to delete modifier.")
    } finally {
      setIsDeleting(null)
    }
  }

  // Handler for creating modifier
  const handleCreateModifier = async (modifierData: any) => {
    setFormLoading(true)
    try {
      await createModifier(modifierData)
      setIsCreating(false)
      fetchModifiers()
    } catch (err) {
      alert("Failed to create modifier.")
    } finally {
      setFormLoading(false)
    }
  }

  // Handler for updating modifier
  const handleUpdateModifier = async (modifierId: string, modifierData: any) => {
    setFormLoading(true)
    try {
      await updateModifier(modifierId, modifierData)
      setIsEditing(null)
      fetchModifiers()
    } catch (err) {
      alert("Failed to update modifier.")
    } finally {
      setFormLoading(false)
    }
  }

  const handleCloseForm = () => {
    setIsCreating(false)
    setIsEditing(null)
    setShowMenuItemModal(false)
    setSelectedModifierForItems(null)
  }

  // Menu item assignment functions
  const handleManageMenuItems = (modifier: any) => {
    setSelectedModifierForItems(modifier)
    setShowMenuItemModal(true)
  }

  const handleAssignToMenuItem = async (itemId: string) => {
    if (!selectedModifierForItems) return
    
    try {
      await assignModifierToItem(itemId, selectedModifierForItems.id, 0)
      alert('Modifier assigned to menu item successfully!')
    } catch (error: any) {
      console.error('Failed to assign modifier to menu item:', error)
      alert(error.message || 'Failed to assign modifier. Please try again.')
    }
  }

  const handleRemoveFromMenuItem = async (itemId: string) => {
    if (!selectedModifierForItems) return
    
    try {
      await removeModifierFromItem(itemId, selectedModifierForItems.id)
      alert('Modifier removed from menu item successfully!')
    } catch (error: any) {
      console.error('Failed to remove modifier from menu item:', error)
      alert(error.message || 'Failed to remove modifier. Please try again.')
    }
  }


  if (!themeLoaded || loading) {
    return (
      <div className={`flex-1 flex items-center justify-center min-h-screen ${isDark ? "bg-[#111]" : "bg-gray-50"}`}>
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  const cardBg = isDark ? "bg-[#171717] border-[#2a2a2a]" : "bg-white border-gray-200"
  const textPrimary = isDark ? "text-white" : "text-gray-900"
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600"
  const innerCardBg = isDark ? "bg-[#1f1f1f] border-[#2a2a2a]" : "bg-gray-50 border-gray-200"

  // Add Modifier button: white if dark, dark if light
  const addModifierButtonBg = isDark
    ? "bg-white text-gray-900 hover:bg-gray-100 border-gray-300"
    : "bg-gray-900 text-white hover:bg-gray-800 border-gray-700"

  const secondaryButtonBg = isDark
    ? "bg-gradient-to-r from-[#1a1a1a] via-[#222222] to-[#2a2a2a] hover:from-[#222222] hover:via-[#2a2a2a] hover:to-[#333333] text-gray-300 border-[#333333]"
    : "bg-gradient-to-r from-gray-100 via-gray-150 to-gray-200 hover:from-gray-150 hover:via-gray-200 hover:to-gray-250 text-gray-700 border-gray-400"

  // If we have a form open, show the form with back button
  if (isCreating || isEditing || showMenuItemModal) {
    return (
      <div className="p-6 space-y-6">
        {/* Header with Back Button */}
        <div className={`${cardBg} p-8 border shadow-lg transition-colors duration-300`} style={{ borderRadius: "1.5rem" }}>
          <div className="flex items-center gap-4">
            <button
              onClick={handleCloseForm}
              className={`${textSecondary} ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-200'} p-2 rounded-xl transition-all duration-200 hover:scale-110`}
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className={`text-4xl font-bold ${textPrimary} mb-2 transition-colors duration-300`}>
                {showMenuItemModal 
                  ? `Manage Menu Items for "${selectedModifierForItems?.name}"`
                  : isCreating 
                    ? "Add New Modifier" 
                    : "Edit Modifier"
                }
              </h1>
              <p className={`${textSecondary} transition-colors duration-300`}>
                {showMenuItemModal 
                  ? "Assign or remove this modifier from menu items"
                  : isCreating 
                    ? "Create a new menu modifier" 
                    : "Update modifier details"
                }
              </p>
            </div>
          </div>
        </div>

        {/* Content based on view type */}
        {showMenuItemModal ? (
          /* Menu Item Management Content */
          <div className={`${cardBg} p-6 border shadow-lg transition-colors duration-300`} style={{ borderRadius: "1.5rem" }}>
            <div className="space-y-4">
              {/* Modifier Info */}
              <div className={`${innerCardBg} p-4 border rounded-lg`}>
                <h4 className={`${textPrimary} font-semibold mb-2`}>Modifier Details</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className={`${textSecondary}`}>Type:</span>
                    <span className={`${textPrimary} ml-2`}>{selectedModifierForItems?.type}</span>
                  </div>
                  <div>
                    <span className={`${textSecondary}`}>Required:</span>
                    <span className={`${textPrimary} ml-2`}>{selectedModifierForItems?.required ? 'Yes' : 'No'}</span>
                  </div>
                  <div>
                    <span className={`${textSecondary}`}>Options:</span>
                    <span className={`${textPrimary} ml-2`}>{selectedModifierForItems?.options?.length || 0}</span>
                  </div>
                  <div>
                    <span className={`${textSecondary}`}>Status:</span>
                    <span className={`${textPrimary} ml-2`}>{selectedModifierForItems?.active ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
              </div>

              {/* Available Menu Items */}
              <div>
                <h4 className={`text-lg font-semibold ${textPrimary} mb-3`}>Available Menu Items</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {menuItems.map((item: any) => (
                    <div
                      key={item.id}
                      className={`${innerCardBg} p-4 border rounded-lg flex items-center justify-between`}
                    >
                      <div className="flex-1">
                        <h5 className={`${textPrimary} font-medium`}>{item.name}</h5>
                        <p className={`${textSecondary} text-sm`}>
                          ${(parseFloat(String(item.price)) || 0).toFixed(2)}
                        </p>
                        <p className={`${textSecondary} text-xs`}>
                          {item.is_available ? 'Available' : 'Unavailable'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleAssignToMenuItem(item.id)}
                        className={`${isDark ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-300`}
                      >
                        <Plus className="h-4 w-4 inline mr-1" />
                        Assign
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assigned Menu Items (placeholder) */}
              <div>
                <h4 className={`text-lg font-semibold ${textPrimary} mb-3`}>Assigned Menu Items</h4>
                <div className={`${innerCardBg} p-4 border rounded-lg`}>
                  <p className={`${textSecondary} text-sm`}>
                    Assigned menu items will appear here once the backend endpoints are fully implemented.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Modifier Form */
          <MenuModifierForm
            onSave={isCreating ? handleCreateModifier : (data) => isEditing && handleUpdateModifier(isEditing, data)}
            onCancel={handleCloseForm}
            loading={formLoading}
            modifierId={isEditing}
            modifierData={isEditing ? modifiers.find((m: any) => m.id === isEditing) : null}
          />
        )}
      </div>
    )
  }

  // Main modifiers list view
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className={`${cardBg} p-8 border shadow-lg transition-colors duration-300`} style={{ borderRadius: "1.5rem" }}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className={`text-4xl font-bold ${textPrimary} mb-2 transition-colors duration-300`}>Menu Modifiers</h1>
            <p className={`${textSecondary} transition-colors duration-300`}>Manage customization options for menu items</p>
          </div>
          <button
            className={`${addModifierButtonBg} px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-2xl hover:scale-110 transition-all border font-medium`}
            onClick={() => setIsCreating(true)}
          >
            <Plus className="h-4 w-4" />
            Add Modifier
          </button>
        </div>
      </div>

      {/* Modifier Tabs */}
      <div className={`${cardBg} p-2 border shadow-lg flex gap-2 transition-colors duration-300 w-fit`} style={{ borderRadius: "1.5rem" }}>
        {[
          { id: "all", label: "All Modifiers" },
          { id: "required", label: "Required" },
          { id: "optional", label: "Optional" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
              activeTab === tab.id
                ? isDark 
                  ? 'bg-white text-gray-900 border-gray-300 shadow-md'
                  : 'bg-gray-900 text-white border-gray-700 shadow-md'
                : isDark ? 'bg-[#1f1f1f] text-gray-400 border-[#2a2a2a]' : 'bg-white text-gray-600 border-gray-200'
            } hover:shadow-md`}
          >
            {tab.label} (
              {tab.id === "all"
                ? modifiers.length
                : tab.id === "required"
                ? modifiers.filter((m: any) => m.required).length
                : modifiers.filter((m: any) => !m.required).length}
            )
          </button>
        ))}
      </div>

      {/* Modifiers Table */}
      <div className={`${cardBg} border transition-colors duration-300 overflow-hidden`} style={{ borderTopLeftRadius: "1.5rem", borderTopRightRadius: "1.5rem" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Table Header */}
            <thead>
              <tr className={`${isDark ? "border-b border-[#2a2a2a]" : "border-b border-gray-200"}`}>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                  Modifier ID
                </th>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                  Modifier Name
                </th>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                  <div className="flex items-center gap-1">
                    Type
                    <ChevronDown className="h-3 w-3" />
                  </div>
                </th>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                  <div className="flex items-center gap-1">
                    Required
                    <ChevronDown className="h-3 w-3" />
                  </div>
                </th>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                  Options
                </th>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                  Applied Items
                </th>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                  <div className="flex items-center gap-1">
                    Status
                    <ChevronDown className="h-3 w-3" />
                  </div>
                </th>
                <th className={`text-left py-4 px-6 ${textSecondary} font-semibold text-sm`}>
                  Actions
                </th>
              </tr>
            </thead>
            
            {/* Table Body */}
            <tbody>
              {filteredModifiers.map((modifier: any, index: number) => (
                <tr 
                  key={modifier.id}
                  className={`${isDark ? "border-b border-[#2a2a2a] hover:bg-[#1f1f1f]" : "border-b border-gray-200 hover:bg-gray-50"} transition-colors duration-200`}
                >
                  {/* Modifier ID */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {modifier.type === "single" ? (
                        <Video className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Mic className="h-4 w-4 text-green-500" />
                      )}
                      <span className={`${textPrimary} font-medium text-sm`}>
                        {modifier.id || `mod_${String(index + 1).padStart(3, '0')}`}
                      </span>
                    </div>
                  </td>
                  
                  {/* Modifier Name */}
                  <td className="py-4 px-6">
                    <div>
                      <div className={`${textPrimary} font-semibold text-sm`}>{modifier.name || "Unnamed Modifier"}</div>
                      <div className={`${textSecondary} text-xs mt-1`}>{modifier.description || "No description"}</div>
                    </div>
                  </td>
                  
                  {/* Type */}
                  <td className="py-4 px-6">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        modifier.type === "single" 
                          ? isDark ? "bg-green-900 text-green-300" : "bg-green-100 text-green-800"
                          : isDark ? "bg-purple-900 text-purple-300" : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {modifier.type === "single" ? "Single Choice" : modifier.type === "multiple" ? "Multiple Choice" : "Unknown"}
                    </span>
                  </td>
                  
                  {/* Required */}
                  <td className="py-4 px-6">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        modifier.required 
                          ? isDark ? "bg-red-900 text-red-300" : "bg-red-100 text-red-800"
                          : isDark ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {modifier.required ? "Required" : "Optional"}
                    </span>
                  </td>
                  
                  {/* Options */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className={`${textPrimary} text-sm font-medium`}>
                        {modifier.options?.length || 0}
                      </span>
                      <div className="flex gap-1">
                        <Video className="h-3 w-3 text-gray-400" />
                        <Mic className="h-3 w-3 text-gray-400" />
                      </div>
                    </div>
                  </td>
                  
                  {/* Applied Items */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className={`${textPrimary} text-sm`}>
                        {modifier.appliedToItems || modifier.menuItems?.length || 0}
                      </span>
                    </div>
                  </td>
                  
                  {/* Status */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${modifier.active !== false ? "bg-green-500" : "bg-gray-400"}`}></div>
                      <span className={`${textPrimary} text-sm`}>
                        {modifier.active !== false ? "Active" : "Inactive"}
                      </span>
                      <ChevronDown className="h-3 w-3 text-gray-400" />
                    </div>
                  </td>
                  
                  {/* Actions */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        className={`${textSecondary} hover:text-purple-400 p-1 transition-colors duration-300`}
                        title="Manage Menu Items"
                        onClick={() => handleManageMenuItems(modifier)}
                      >
                        <Settings className="h-4 w-4" />
                      </button>
                      <button
                        className={`${textSecondary} ${isDark ? "hover:text-white" : "hover:text-gray-900"} p-1 transition-colors duration-300`}
                        title="Edit Modifier"
                        onClick={() => setIsEditing(modifier.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className={`${textSecondary} hover:text-red-400 p-1 transition-colors duration-300`}
                        title="Delete Modifier"
                        disabled={isDeleting === modifier.id}
                        onClick={() => handleDeleteModifier(modifier.id)}
                      >
                        {isDeleting === modifier.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {filteredModifiers.length === 0 && (
          <div className="text-center py-12">
            <div className={`${textSecondary} text-lg mb-2`}>No modifiers found</div>
            <div className={`${textSecondary} text-sm`}>
              {activeTab === "all" 
                ? "Create your first modifier to get started"
                : `No ${activeTab} modifiers available`
              }
            </div>
          </div>
        )}
      </div>


    </div>
  )
}