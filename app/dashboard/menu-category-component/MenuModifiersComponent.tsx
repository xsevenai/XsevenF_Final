// app/dashboard/components/menu/MenuModifiersComponent.tsx

"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Loader2, ToggleLeft, ToggleRight, ArrowLeft, Settings, X } from "lucide-react"
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

  const primaryButtonBg = isDark
    ? "bg-gradient-to-r from-[#0f0f0f] via-[#1a1a1a] to-[#2a2a2a] hover:from-[#1a1a1a] hover:via-[#222222] hover:to-[#333333] text-white border-[#444444]"
    : "bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200 hover:from-gray-100 hover:via-gray-200 hover:to-gray-300 text-gray-900 border-gray-300"

  const activeTabBg = isDark
    ? "bg-gradient-to-r from-[#0f0f0f] via-[#1a1a1a] to-[#2a2a2a] text-white border-[#444444]"
    : "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white border-blue-600"

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
            className={`${primaryButtonBg} px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-2xl hover:scale-110 transition-all border font-medium`}
            onClick={() => setIsCreating(true)}
          >
            <Plus className="h-4 w-4" />
            Add Modifier
          </button>
        </div>
      </div>

      {/* Modifier Tabs */}
      <div className={`${cardBg} p-3 border shadow-lg flex gap-2 transition-colors duration-300`} style={{ borderRadius: "1.5rem" }}>
        {[
          { id: "all", label: "All Modifiers" },
          { id: "required", label: "Required" },
          { id: "optional", label: "Optional" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all border
              ${activeTab === tab.id ? `${activeTabBg} shadow-md` : `${secondaryButtonBg}`}
              hover:shadow-md
            `}
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

      {/* Modifiers List */}
      <div className="space-y-4">
        {filteredModifiers.map((modifier: any, index: number) => (
          <div
            key={modifier.id}
            className={`${cardBg} p-6 border shadow-lg hover:shadow-xl transition-all duration-300`}
            style={{
              borderRadius: index % 3 === 0 ? "1.5rem" : index % 3 === 1 ? "2rem" : "1rem",
            }}
          >
            {/* Modifier Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className={`${textPrimary} font-semibold text-lg`}>{modifier.name}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      modifier.required ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {modifier.required ? "Required" : "Optional"}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      modifier.type === "single" ? "bg-green-100 text-green-800" : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {modifier.type === "single" ? "Single Choice" : "Multiple Choice"}
                  </span>
                </div>
                <p className={`${textSecondary} text-sm mb-2`}>{modifier.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className={`${textSecondary}`}>Applied to {modifier.appliedToItems || 0} items</span>
                  <span className={`${textSecondary}`}>
                    {modifier.minSelections}-{modifier.maxSelections} selections
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Active Toggle */}
                <button
                  className={`${modifier.active ? "text-green-500" : "text-gray-400"}`}
                  onClick={() => handleToggleActive(modifier)}
                  title={modifier.active ? "Deactivate" : "Activate"}
                >
                  {modifier.active ? <ToggleRight className="h-6 w-6" /> : <ToggleLeft className="h-6 w-6" />}
                </button>

                {/* Action Buttons */}
                <button
                  className={`${textSecondary} hover:text-purple-400 p-2 transition-colors duration-300`}
                  title="Manage Menu Items"
                  onClick={() => handleManageMenuItems(modifier)}
                >
                  <Settings className="h-4 w-4" />
                </button>
                <button
                  className={`${textSecondary} ${isDark ? "hover:text-white" : "hover:text-gray-900"} p-2 transition-colors duration-300`}
                  title="Edit Modifier"
                  onClick={() => setIsEditing(modifier.id)}
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  className={`${textSecondary} hover:text-red-400 p-2 transition-colors duration-300`}
                  title="Delete Modifier"
                  disabled={isDeleting === modifier.id}
                  onClick={() => handleDeleteModifier(modifier.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Modifier Options */}
            <div className={`${innerCardBg} p-4 border rounded-xl`}>
              <h4 className={`${textPrimary} font-medium text-sm mb-3`}>Options ({modifier.options?.length || 0})</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {modifier.options?.map((option: any, idx: number) => (
                  <div
                    key={option.id ?? `${option.name}-${idx}`}
                    className={`flex items-center justify-between p-3 ${isDark ? "bg-[#2a2a2a]" : "bg-white"} rounded-lg border`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`${textPrimary} text-sm font-medium`}>{option.name}</span>
                      {option.isDefault && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Default</span>
                      )}
                    </div>
                    <span className={`${isDark ? "text-green-400" : "text-green-600"} text-sm font-bold`}>
                      {Number(option.price) > 0 ? `+${Number(option.price).toFixed(2)}` : "Free"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modifier Stats Overview */}
      <div className={`${cardBg} p-6 border shadow-lg transition-colors duration-300`} style={{ borderRadius: "1.5rem" }}>
        <h2 className={`text-xl font-bold ${textPrimary} mb-4`}>Modifier Overview</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`${textPrimary} text-2xl font-bold`}>{modifiers.length}</div>
            <div className={`${textSecondary} text-sm`}>Total Modifiers</div>
          </div>
          <div className="text-center">
            <div className={`${textPrimary} text-2xl font-bold`}>{modifiers.filter((m: any) => m.active).length}</div>
            <div className={`${textSecondary} text-sm`}>Active</div>
          </div>
          <div className="text-center">
            <div className={`${textPrimary} text-2xl font-bold`}>{modifiers.filter((m: any) => m.required).length}</div>
            <div className={`${textSecondary} text-sm`}>Required</div>
          </div>
          <div className="text-center">
            <div className={`${textPrimary} text-2xl font-bold`}>
              {modifiers.reduce((sum: number, m: any) => sum + (m.options?.length || 0), 0)}
            </div>
            <div className={`${textSecondary} text-sm`}>Total Options</div>
          </div>
        </div>
      </div>

    </div>
  )
}