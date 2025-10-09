// app/dashboard/components/menu/MenuModifierForm.tsx

"use client"

import React, { useState, useEffect } from "react"
import { useTheme } from "@/hooks/useTheme"
import { Plus } from "lucide-react"

interface ModifierOption {
  name: string
  price: number
  isDefault: boolean
}

interface MenuModifierFormProps {
  onSave: (data: any) => void
  onCancel: () => void
  loading: boolean
  modifierId?: string | null
  modifierData?: any
}

export default function MenuModifierForm({ onSave, onCancel, loading, modifierId, modifierData }: MenuModifierFormProps) {
  const { theme, isLoaded: themeLoaded, isDark } = useTheme()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [required, setRequired] = useState(false)
  const [type, setType] = useState<"single" | "multiple">("single")
  const [minSelections, setMinSelections] = useState(1)
  const [maxSelections, setMaxSelections] = useState(1)
  const [options, setOptions] = useState<ModifierOption[]>([{ name: "", price: 0, isDefault: false }])

  // Theme-aware styles
  const cardBg = isDark ? "bg-[#171717] border-[#2a2a2a]" : "bg-white border-gray-200"
  const textPrimary = isDark ? "text-white" : "text-gray-900"
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600"
  const inputBg = isDark ? "bg-[#1f1f1f] border-[#2a2a2a]" : "bg-gray-50 border-gray-200"
  const buttonHoverBg = isDark ? "hover:bg-[#2a2a2a]" : "hover:bg-gray-100"

  // Load modifier data if editing
  useEffect(() => {
    if (modifierId && modifierData) {
      // Populate form with existing modifier data
      setName(modifierData.name || "")
      setDescription(modifierData.description || "")
      setRequired(modifierData.required || false)
      setType(modifierData.type || "single")
      setMinSelections(modifierData.minSelections || 1)
      setMaxSelections(modifierData.maxSelections || 1)
      setOptions(modifierData.options && modifierData.options.length > 0 
        ? modifierData.options.map((opt: any) => ({
            name: opt.name || "",
            price: Number(opt.price) || 0,
            isDefault: opt.isDefault || false
          }))
        : [{ name: "", price: 0, isDefault: false }]
      )
    } else if (!modifierId) {
      // Reset form for new modifier
      setName("")
      setDescription("")
      setRequired(false)
      setType("single")
      setMinSelections(1)
      setMaxSelections(1)
      setOptions([{ name: "", price: 0, isDefault: false }])
    }
  }, [modifierId, modifierData])

  const handleOptionChange = (idx: number, field: keyof ModifierOption, value: any) => {
    setOptions(options =>
      options.map((opt, i) => i === idx ? { ...opt, [field]: value } : opt)
    )
  }

  const addOption = () => setOptions([...options, { name: "", price: 0, isDefault: false }])
  const removeOption = (idx: number) => setOptions(options => options.filter((_, i) => i !== idx))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!name.trim()) {
      alert("Modifier name is required")
      return
    }
    
    if (options.some(opt => !opt.name.trim())) {
      alert("All options must have a name")
      return
    }
    
    if (minSelections > maxSelections) {
      alert("Minimum selections cannot be greater than maximum selections")
      return
    }

    const modifierData = {
      business_id: typeof window !== "undefined" ? localStorage.getItem("businessId") || "" : "",
      name,
      description,
      required,
      type,
      minSelections,
      maxSelections,
      options: options.filter(opt => opt.name.trim() !== ""),
      active: true
    }
    
    onSave(modifierData)
  }

  return (
    <div className={`${cardBg} p-8 border shadow-lg transition-colors duration-300`} style={{ borderRadius: "1.5rem" }}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block ${textPrimary} font-medium mb-3`}>
              Modifier Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200`}
              placeholder="Enter modifier name"
            />
          </div>
          
          <div>
            <label className={`block ${textPrimary} font-medium mb-3`}>Description</label>
            <input
              value={description}
              onChange={e => setDescription(e.target.value)}
              className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200`}
              placeholder="Enter description"
            />
          </div>
        </div>

        {/* Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="required"
              checked={required}
              onChange={e => setRequired(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="required" className={`${textPrimary} font-medium`}>
              Required
            </label>
          </div>
          
          <div>
            <label className={`block ${textPrimary} font-medium mb-3`}>Selection Type</label>
            <select 
              value={type} 
              onChange={e => setType(e.target.value as "single" | "multiple")} 
              className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none transition-all duration-200`}
            >
              <option value="single">Single Choice</option>
              <option value="multiple">Multiple Choice</option>
            </select>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div>
                <label className={`block ${textPrimary} font-medium mb-2 text-sm`}>Min Selections</label>
                <input 
                  type="number" 
                  min="0" 
                  max={maxSelections}
                  value={minSelections} 
                  onChange={e => setMinSelections(Number(e.target.value))} 
                  className={`w-20 ${inputBg} ${textPrimary} px-3 py-2 rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                />
              </div>
              <div>
                <label className={`block ${textPrimary} font-medium mb-2 text-sm`}>Max Selections</label>
                <input 
                  type="number" 
                  min={minSelections}
                  value={maxSelections} 
                  onChange={e => setMaxSelections(Number(e.target.value))} 
                  className={`w-20 ${inputBg} ${textPrimary} px-3 py-2 rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Options Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className={`block ${textPrimary} font-medium`}>
              Options <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={addOption}
              className={`${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535]' : 'bg-gray-200 hover:bg-gray-300'} ${textPrimary} px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2`}
            >
              <Plus className="h-4 w-4" />
              Add Option
            </button>
          </div>
          
          <div className="space-y-3">
            {options.map((opt, idx) => (
              <div key={idx} className="flex gap-3 items-start p-4 rounded-xl border" style={{ backgroundColor: isDark ? '#1f1f1f' : '#f9fafb' }}>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className={`block ${textSecondary} text-sm mb-2`}>Option Name</label>
                    <input
                      placeholder="Option name"
                      value={opt.name}
                      onChange={e => handleOptionChange(idx, "name", e.target.value)}
                      required
                      className={`w-full ${inputBg} ${textPrimary} px-3 py-2 rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                    />
                  </div>
                  <div>
                    <label className={`block ${textSecondary} text-sm mb-2`}>Price</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={opt.price}
                      onChange={e => handleOptionChange(idx, "price", Number(e.target.value))}
                      className={`w-full ${inputBg} ${textPrimary} px-3 py-2 rounded-lg border focus:border-blue-500 focus:outline-none transition-all duration-200`}
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <input
                      type="checkbox"
                      id={`default-${idx}`}
                      checked={opt.isDefault}
                      onChange={e => handleOptionChange(idx, "isDefault", e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={`default-${idx}`} className={`${textSecondary} text-sm`}>
                      Default Option
                    </label>
                  </div>
                </div>
                {options.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeOption(idx)} 
                    className="text-red-500 hover:text-red-700 px-3 py-2 rounded-lg transition-colors duration-200 mt-6"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className={`${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535] border-[#3a3a3a]' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'} ${textPrimary} px-8 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border shadow-lg hover:shadow-xl hover:scale-105`}
          >
            {loading ? "Saving..." : (modifierId ? "Update Modifier" : "Create Modifier")}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className={`${isDark ? 'bg-[#2a2a2a] hover:bg-[#353535]' : 'bg-gray-200 hover:bg-gray-300'} ${textPrimary} px-8 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl hover:scale-105`}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}