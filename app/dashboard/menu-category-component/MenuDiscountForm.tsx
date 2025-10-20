"use client"

import { useEffect, useState } from 'react'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

export interface DiscountFormData {
  id?: string
  name: string
  description?: string
  type: 'percentage' | 'fixed' | 'bogo'
  value: number
  code: string
  isActive: boolean
  startDate: string
  endDate: string
  usageLimit: number
  minOrderValue: number
  applicableItems: string[]
  conditions?: string
}

interface MenuDiscountFormProps {
  mode: 'create' | 'edit'
  initialData?: DiscountFormData
  onBack: () => void
  onSubmit: (data: DiscountFormData) => void
}

export default function MenuDiscountForm({ mode, initialData, onBack, onSubmit }: MenuDiscountFormProps) {
  const { isLoaded: themeLoaded, isDark } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => setMounted(true), [])

  const [form, setForm] = useState<DiscountFormData>(() => ({
    id: initialData?.id,
    name: initialData?.name || '',
    description: initialData?.description || '',
    type: initialData?.type || 'percentage',
    value: initialData?.value ?? 0,
    code: initialData?.code || '',
    isActive: initialData?.isActive ?? true,
    startDate: initialData?.startDate || new Date().toISOString().slice(0, 10),
    endDate: initialData?.endDate || new Date().toISOString().slice(0, 10),
    usageLimit: initialData?.usageLimit ?? 0,
    minOrderValue: initialData?.minOrderValue ?? 0,
    applicableItems: initialData?.applicableItems || ['all'],
    conditions: initialData?.conditions || ''
  }))

  useEffect(() => {
    if (initialData) {
      setForm(prev => ({ ...prev, ...initialData }))
    }
  }, [initialData])

  if (!themeLoaded || !mounted) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const inputBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'
  const primaryButtonBg = isDark ? 'bg-white text-gray-900 hover:bg-gray-100 border-gray-300' : 'bg-gray-900 text-white hover:bg-gray-800 border-gray-700'
  const secondaryButtonBg = isDark ? 'bg-[#1f1f1f] text-gray-400 border-[#2a2a2a] hover:bg-[#2a2a2a]' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      if (!form.name.trim()) throw new Error('Discount name is required')
      if (!form.code.trim()) throw new Error('Discount code is required')
      if (form.type !== 'bogo' && form.value <= 0) throw new Error('Value must be greater than 0')
      if (!form.startDate || !form.endDate) throw new Error('Start and end dates are required')
      if (new Date(form.endDate) < new Date(form.startDate)) throw new Error('End date must be after start date')

      await new Promise(r => setTimeout(r, 500))
      setSubmitSuccess(true)
      onSubmit(form)
    } catch (err: any) {
      setSubmitError(err?.message || 'Failed to save discount')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`flex-1 min-h-screen overflow-y-auto ${isDark ? 'bg-[#111111]' : 'bg-gray-50'}`}>
      <div className="p-6 space-y-6">
        <div className={`${cardBg} p-8 border shadow-lg transition-colors duration-300`} style={{ borderRadius: '1.5rem' }}>
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className={`${textSecondary} ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-200'} p-2 rounded-xl transition-all duration-200 hover:scale-110`}
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className={`text-4xl font-bold ${textPrimary} mb-2 transition-colors duration-300`}>
                {mode === 'edit' ? 'Edit Discount' : 'Add New Discount'}
              </h1>
              <p className={`${textSecondary} transition-colors duration-300`}>
                {mode === 'edit' ? 'Update discount details' : 'Create a new promotional discount'}
              </p>
            </div>
          </div>
        </div>

        <div className={`${cardBg} border shadow-lg transition-colors duration-300`} style={{ borderRadius: '1.5rem' }}>
          <div className="p-8">
            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <p className="text-green-500 font-medium">
                  Discount {mode === 'edit' ? 'updated' : 'created'} successfully!
                </p>
              </div>
            )}

            {submitError && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-500 font-medium">{submitError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block ${textPrimary} font-medium mb-3`}>Discount Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none`}
                    placeholder="e.g., Weekend Special"
                    required
                  />
                </div>
                <div>
                  <label className={`block ${textPrimary} font-medium mb-3`}>Type <span className="text-red-500">*</span></label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value as any }))}
                    className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none`}
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                    <option value="bogo">Buy One Get One</option>
                  </select>
                </div>
              </div>

              {form.type !== 'bogo' && (
                <div>
                  <label className={`block ${textPrimary} font-medium mb-3`}>{form.type === 'percentage' ? 'Value (%)' : 'Value ($)'} <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.value || ''}
                    onChange={(e) => setForm(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                    className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none`}
                    placeholder={form.type === 'percentage' ? 'e.g., 20' : 'e.g., 5'}
                  />
                </div>
              )}

              <div>
                <label className={`block ${textPrimary} font-medium mb-3`}>Code <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm(prev => ({ ...prev, code: e.target.value.toUpperCase().replace(/\s+/g, '') }))}
                  className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none`}
                  placeholder="e.g., WEEKEND15"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className={`block ${textPrimary} font-medium mb-3`}>Start Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm(prev => ({ ...prev, startDate: e.target.value }))}
                    className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none`}
                  />
                </div>
                <div>
                  <label className={`block ${textPrimary} font-medium mb-3`}>End Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm(prev => ({ ...prev, endDate: e.target.value }))}
                    className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none`}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={form.isActive}
                    onChange={(e) => setForm(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 mt-8"
                  />
                  <label htmlFor="isActive" className={`${textPrimary} font-medium mt-8`}>Active</label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className={`block ${textPrimary} font-medium mb-3`}>Usage Limit</label>
                  <input
                    type="number"
                    min="0"
                    value={form.usageLimit}
                    onChange={(e) => setForm(prev => ({ ...prev, usageLimit: parseInt(e.target.value || '0', 10) }))}
                    className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none`}
                    placeholder="0 for unlimited"
                  />
                </div>
                <div>
                  <label className={`block ${textPrimary} font-medium mb-3`}>Min Order Value ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.minOrderValue}
                    onChange={(e) => setForm(prev => ({ ...prev, minOrderValue: parseFloat(e.target.value || '0') }))}
                    className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none`}
                  />
                </div>
                <div>
                  <label className={`block ${textPrimary} font-medium mb-3`}>Applicable Items</label>
                  <input
                    type="text"
                    value={form.applicableItems.join(', ')}
                    onChange={(e) => setForm(prev => ({ ...prev, applicableItems: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                    className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none`}
                    placeholder="e.g., all or pizzas, burgers"
                  />
                </div>
              </div>

              <div>
                <label className={`block ${textPrimary} font-medium mb-3`}>Description</label>
                <textarea
                  rows={3}
                  value={form.description || ''}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none resize-none`}
                  placeholder="Brief summary shown on cards"
                />
              </div>

              <div>
                <label className={`block ${textPrimary} font-medium mb-3`}>Conditions</label>
                <textarea
                  rows={3}
                  value={form.conditions || ''}
                  onChange={(e) => setForm(prev => ({ ...prev, conditions: e.target.value }))}
                  className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none resize-none`}
                  placeholder="Any terms and conditions"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`${primaryButtonBg} px-8 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border shadow-lg hover:shadow-xl hover:scale-105`}
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isSubmitting ? (mode === 'edit' ? 'Updating...' : 'Adding...') : (mode === 'edit' ? 'Update Discount' : 'Add Discount')}
                </button>
                <button
                  type="button"
                  onClick={onBack}
                  disabled={isSubmitting}
                  className={`${secondaryButtonBg} px-8 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl hover:scale-105`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}


