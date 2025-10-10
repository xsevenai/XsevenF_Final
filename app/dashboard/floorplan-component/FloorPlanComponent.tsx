// app/dashboard/floorplan-component/FloorPlanComponent.tsx

"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Map, 
  Settings, 
  Loader2,
  Grid3X3,
  Square,
  Circle,
  RotateCcw,
  Save,
  Download,
  Upload
} from "lucide-react"
import { useTheme } from "@/hooks/useTheme"
import { useFloorPlanManagement } from "@/hooks/use-floor-plans"
import type { FloorPlan } from "@/src/api/generated/models/FloorPlan"
import type {  FloorPlanCreate } from "@/src/api/generated/models/FloorPlanCreate"
import type {  FloorPlanUpdate } from "@/src/api/generated/models/FloorPlanUpdate"

interface FloorPlanComponentProps {
  businessId?: string
}

interface TableElement {
  id: string
  type: 'table' | 'bar' | 'counter'
  x: number
  y: number
  width: number
  height: number
  seats?: number
  label?: string
}

export default function FloorPlanComponent({ businessId }: FloorPlanComponentProps) {
  const { theme, isLoaded: themeLoaded, isDark, currentTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<FloorPlan | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [planName, setPlanName] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [layoutElements, setLayoutElements] = useState<TableElement[]>([])
  const [selectedElement, setSelectedElement] = useState<TableElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)

  // Get businessId from localStorage if not provided
  const [currentBusinessId, setCurrentBusinessId] = useState(businessId || '')
  
  useEffect(() => {
    if (!businessId) {
      const storedBusinessId = localStorage.getItem('businessId')
      if (storedBusinessId) {
        setCurrentBusinessId(storedBusinessId)
      }
    }
  }, [businessId])

  const { 
    floorPlans, 
    stats, 
    loading, 
    error, 
    createFloorPlan, 
    updateFloorPlan, 
    getFloorPlan,
    refreshAll 
  } = useFloorPlanManagement(currentBusinessId)

  useEffect(() => {
    setMounted(true)
  }, [])

  // FIX: Ensure floorPlans is always an array
  const safeFloorPlans = Array.isArray(floorPlans) ? floorPlans : []

  const handleCreatePlan = async () => {
    if (!planName.trim()) return

    try {
      const newPlan: FloorPlanCreate = {
        name: planName,
        business_id: currentBusinessId,
        layout: {
          elements: layoutElements,
          canvas: { width: 800, height: 600 }
        },
        is_active: isActive
      }

      await createFloorPlan(newPlan)
      setIsCreating(false)
      setPlanName('')
      setLayoutElements([])
      setIsActive(true)
    } catch (error) {
      console.error('Failed to create floor plan:', error)
    }
  }

  const handleUpdatePlan = async () => {
    if (!selectedPlan || !planName.trim()) return

    try {
      const updateData: FloorPlanUpdate = {
        name: planName,
        layout: {
          elements: layoutElements,
          canvas: { width: 800, height: 600 }
        },
        is_active: isActive
      }

      await updateFloorPlan(selectedPlan.id, updateData)
      setIsEditing(false)
      setSelectedPlan(null)
    } catch (error) {
      console.error('Failed to update floor plan:', error)
    }
  }

  const handleSelectPlan = async (plan: FloorPlan) => {
    try {
      const fullPlan = await getFloorPlan(plan.id)
      setSelectedPlan(fullPlan)
      setPlanName(fullPlan.name)
      setIsActive(fullPlan.is_active || false)
      
      // Parse layout elements
      if (fullPlan.layout && fullPlan.layout.elements) {
        setLayoutElements(fullPlan.layout.elements as TableElement[])
      } else {
        setLayoutElements([])
      }
    } catch (error) {
      console.error('Failed to load floor plan:', error)
    }
  }

  const addTableElement = (type: 'table' | 'bar' | 'counter') => {
    const newElement: TableElement = {
      id: `element-${Date.now()}`,
      type,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      width: type === 'table' ? 80 : type === 'bar' ? 200 : 120,
      height: type === 'table' ? 80 : type === 'bar' ? 40 : 80,
      seats: type === 'table' ? 4 : undefined,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${layoutElements.length + 1}`
    }
    setLayoutElements(prev => [...prev, newElement])
  }

  const removeElement = (elementId: string) => {
    setLayoutElements(prev => prev.filter(el => el.id !== elementId))
    if (selectedElement?.id === elementId) {
      setSelectedElement(null)
    }
  }

  const updateElement = (elementId: string, updates: Partial<TableElement>) => {
    setLayoutElements(prev => prev.map(el => 
      el.id === elementId ? { ...el, ...updates } : el
    ))
    if (selectedElement?.id === elementId) {
      setSelectedElement(prev => prev ? { ...prev, ...updates } : null)
    }
  }

  const handleMouseDown = (element: TableElement, event: React.MouseEvent) => {
    event.preventDefault()
    setSelectedElement(element)
    
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    
    // Calculate offset from element's top-left corner to mouse position
    const offsetX = event.clientX - rect.left - element.x
    const offsetY = event.clientY - rect.top - element.y
    
    setDragOffset({
      x: offsetX,
      y: offsetY
    })
    setIsDragging(true)
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging || !selectedElement || !canvasRef.current) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    
    // Calculate new position relative to canvas
    const newX = event.clientX - rect.left - dragOffset.x
    const newY = event.clientY - rect.top - dragOffset.y
    
    // Constrain within canvas bounds
    const constrainedX = Math.max(0, Math.min(newX, rect.width - selectedElement.width))
    const constrainedY = Math.max(0, Math.min(newY, rect.height - selectedElement.height))

    updateElement(selectedElement.id, { 
      x: constrainedX, 
      y: constrainedY 
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setDragOffset({ x: 0, y: 0 })
  }

  if (!themeLoaded || !mounted) {
    return (
      <div className={`flex-1 ${isDark ? 'bg-[#111111]' : 'bg-gray-50'} flex items-center justify-center transition-all duration-300`}>
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  const mainPanelBg = isDark ? 'bg-[#111111]' : 'bg-gray-50'
  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'

  return (
    <div className={`flex-1 ${mainPanelBg} h-screen overflow-y-auto transition-colors duration-300`}>
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className={`${cardBg} p-8 border shadow-lg relative overflow-hidden`}
          style={{ borderRadius: '1.5rem' }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>Floor Plans</h1>
              <p className={`${textSecondary}`}>Design and manage restaurant floor layouts</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => refreshAll()}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Refresh</span>
              </Button>
              <Dialog open={isCreating} onOpenChange={setIsCreating}>
                <DialogTrigger asChild>
                  <Button className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>New Plan</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Floor Plan</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="plan-name">Plan Name</Label>
                      <Input
                        id="plan-name"
                        value={planName}
                        onChange={(e) => setPlanName(e.target.value)}
                        placeholder="Enter plan name..."
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is-active"
                        checked={isActive}
                        onCheckedChange={setIsActive}
                      />
                      <Label htmlFor="is-active">Active</Label>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsCreating(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreatePlan} disabled={!planName.trim()}>
                        Create Plan
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-4">
          <div className={`${cardBg} p-4 border shadow-lg hover:shadow-xl transition-all duration-300`}
            style={{ borderRadius: '1rem' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textSecondary} text-xs font-medium uppercase tracking-wider`}>Total Plans</p>
                <p className={`${textPrimary} text-2xl font-bold`}>{stats?.stats?.overview?.totalPlans || 0}</p>
              </div>
              <Map className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className={`${cardBg} p-4 border shadow-lg hover:shadow-xl transition-all duration-300`}
            style={{ borderRadius: '1rem' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textSecondary} text-xs font-medium uppercase tracking-wider`}>Active Plans</p>
                <p className={`${textPrimary} text-2xl font-bold`}>{stats?.stats?.overview?.activePlans || 0}</p>
              </div>
              <Grid3X3 className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className={`${cardBg} p-4 border shadow-lg hover:shadow-xl transition-all duration-300`}
            style={{ borderRadius: '1rem' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textSecondary} text-xs font-medium uppercase tracking-wider`}>Inactive Plans</p>
                <p className={`${textPrimary} text-2xl font-bold`}>{stats?.stats?.overview?.inactivePlans || 0}</p>
              </div>
              <Settings className="h-8 w-8 text-gray-500" />
            </div>
          </div>
          <div className={`${cardBg} p-4 border shadow-lg hover:shadow-xl transition-all duration-300`}
            style={{ borderRadius: '1rem' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textSecondary} text-xs font-medium uppercase tracking-wider`}>Locations</p>
                <p className={`${textPrimary} text-2xl font-bold`}>
                  {stats?.stats?.overview?.plansByLocation ? Object.keys(stats.stats.overview.plansByLocation).length : 0}
                </p>
              </div>
              <Square className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Floor Plans List */}
          <div className="lg:col-span-1">
            <div className={`${cardBg} p-6 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
              <h2 className={`text-xl font-bold ${textPrimary} mb-4`}>Floor Plans</h2>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                </div>
              ) : error ? (
                <div className={`${textSecondary} text-center py-8`}>
                  Error loading floor plans
                </div>
              ) : safeFloorPlans.length === 0 ? (
                <div className={`${textSecondary} text-center py-8`}>
                  No floor plans created yet
                </div>
              ) : (
                <div className="space-y-3">
                  {safeFloorPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`${innerCardBg} p-4 border hover:scale-[1.02] transition-all duration-200 cursor-pointer ${
                        selectedPlan?.id === plan.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      style={{ borderRadius: '1rem' }}
                      onClick={() => handleSelectPlan(plan)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className={`${textPrimary} font-semibold`}>{plan.name}</h3>
                          <p className={`${textSecondary} text-sm`}>
                            {plan.location_id || 'Default Location'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={plan.is_active ? 'default' : 'secondary'}>
                            {plan.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              setIsEditing(true)
                              handleSelectPlan(plan)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Floor Plan Designer */}
          <div className="lg:col-span-2">
            <div className={`${cardBg} p-6 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-xl font-bold ${textPrimary}`}>
                  {selectedPlan ? `Design: ${selectedPlan.name}` : 'Floor Plan Designer'}
                </h2>
                {selectedPlan && (
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                )}
              </div>

              {/* Toolbar */}
              <div className="flex items-center space-x-2 mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addTableElement('table')}
                >
                  <Square className="h-4 w-4 mr-2" />
                  Add Table
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addTableElement('bar')}
                >
                  <Square className="h-4 w-4 mr-2" />
                  Add Bar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addTableElement('counter')}
                >
                  <Circle className="h-4 w-4 mr-2" />
                  Add Counter
                </Button>
              </div>

              {/* Canvas */}
              <div
                ref={canvasRef}
                className={`${innerCardBg} border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg relative overflow-hidden`}
                style={{ height: '500px', width: '100%' }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {layoutElements.map((element) => (
                  <div
                    key={element.id}
                    className={`absolute cursor-move border-2 transition-all duration-75 ${
                      selectedElement?.id === element.id 
                        ? 'border-blue-500 bg-blue-100 dark:bg-blue-900 shadow-lg' 
                        : 'border-gray-400 bg-white dark:bg-gray-700 shadow-sm hover:shadow-md'
                    }`}
                    style={{
                      left: `${element.x}px`,
                      top: `${element.y}px`,
                      width: `${element.width}px`,
                      height: `${element.height}px`,
                    }}
                    onMouseDown={(e) => handleMouseDown(element, e)}
                    onClick={() => setSelectedElement(element)}
                  >
                    <div className="flex items-center justify-center h-full text-xs font-medium">
                      {element.label}
                    </div>
                    {selectedElement?.id === element.id && (
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0"
                        onClick={() => removeElement(element.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
                
                {layoutElements.length === 0 && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Map className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className={`${textSecondary}`}>
                        {selectedPlan ? 'No elements in this floor plan' : 'Select a floor plan to design'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Floor Plan</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-plan-name">Plan Name</Label>
                <Input
                  id="edit-plan-name"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  placeholder="Enter plan name..."
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-is-active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <Label htmlFor="edit-is-active">Active</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdatePlan} disabled={!planName.trim()}>
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}