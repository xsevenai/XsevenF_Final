// app/dashboard/components/MenuServicesComponent.tsx

"use client"

import { useState, useMemo } from 'react'
import { Plus, Edit, Trash2, Clock, Users, DollarSign, ArrowLeft, Loader2, Search } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

type PricingModel = 'per_person' | 'flat_rate'

interface ServiceItem {
  id: string
  name: string
  description: string
  price: number
  pricing_model: PricingModel
  duration_minutes: number
  capacity: number
  image_url?: string
  location?: string
  deposit_amount?: number
  cancellation_policy?: string
  lead_time_days?: number
  is_active: boolean
  bookings: number
}

export default function MenuServicesComponent() {
  const { isDark } = useTheme()

  const [services, setServices] = useState<ServiceItem[]>([
    { id: '1', name: 'Private Dining', description: 'Exclusive dining experience', price: 150, pricing_model: 'per_person', duration_minutes: 180, capacity: 12, bookings: 24, is_active: true, location: 'On-site' },
    { id: '2', name: 'Wedding Catering', description: 'Full-service wedding catering', price: 5000, pricing_model: 'flat_rate', duration_minutes: 480, capacity: 200, bookings: 8, is_active: true, location: 'Off-site' },
    { id: '3', name: 'Corporate Events', description: 'Business meeting catering', price: 35, pricing_model: 'per_person', duration_minutes: 240, capacity: 50, bookings: 15, is_active: true, location: 'On-site' }
  ])

  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const [formData, setFormData] = useState<Omit<ServiceItem, 'id' | 'bookings'>>({
    name: '',
    description: '',
    price: 0,
    pricing_model: 'per_person',
    duration_minutes: 60,
    capacity: 10,
    image_url: '',
    location: '',
    deposit_amount: 0,
    cancellation_policy: '',
    lead_time_days: 0,
    is_active: true,
  })

  const filteredServices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return services
    return services.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      (s.location || '').toLowerCase().includes(q)
    )
  }, [searchQuery, services])

  const cardBg = isDark ? 'bg-[#171717] border-[#2a2a2a]' : 'bg-white border-gray-200'
  const textPrimary = isDark ? 'text-white' : 'text-gray-900'
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600'
  const innerCardBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'
  const inputBg = isDark ? 'bg-[#1f1f1f] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'

  const primaryButtonBg = isDark
    ? 'bg-white text-gray-900 hover:bg-gray-100 border-gray-300'
    : 'bg-gray-900 text-white hover:bg-gray-800 border-gray-700'

  const secondaryButtonBg = isDark
    ? 'bg-[#1f1f1f] text-gray-400 border-[#2a2a2a] hover:bg-[#2a2a2a]'
    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      if (!formData.name.trim()) throw new Error('Service name is required')
      if (formData.price < 0) throw new Error('Price must be 0 or greater')
      if (formData.duration_minutes <= 0) throw new Error('Duration must be greater than 0')
      if (formData.capacity <= 0) throw new Error('Capacity must be greater than 0')

      const newService: ServiceItem = {
        id: Math.random().toString(36).slice(2),
        bookings: 0,
        ...formData,
      }

      setServices(prev => [newService, ...prev])
      setSubmitSuccess(true)

      setTimeout(() => {
        setShowForm(false)
        setSubmitSuccess(false)
        setFormData({
          name: '',
          description: '',
          price: 0,
          pricing_model: 'per_person',
          duration_minutes: 60,
          capacity: 10,
          image_url: '',
          location: '',
          deposit_amount: 0,
          cancellation_policy: '',
          lead_time_days: 0,
          is_active: true,
        })
      }, 1000)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to add service')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showForm) {
    return (
      <div className="p-6 space-y-6">
        <div className={`${cardBg} p-8 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowForm(false)}
              className={`${textSecondary} ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-200'} p-2 rounded-xl transition-all duration-200 hover:scale-110`}
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>Add New Service</h1>
              <p className={`${textSecondary}`}>Create a new service offering for your business</p>
            </div>
          </div>
        </div>

        <div className={`${cardBg} border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
          <div className="p-8">
            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <p className="text-green-500 font-medium">Service created successfully!</p>
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
                  <label className={`block ${textPrimary} font-medium mb-3`}>Service Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none`}
                    placeholder="Enter service name"
                    required
                  />
                </div>
                <div>
                  <label className={`block ${textPrimary} font-medium mb-3`}>Pricing Model</label>
                  <select
                    value={formData.pricing_model}
                    onChange={(e) => setFormData(prev => ({ ...prev, pricing_model: e.target.value as PricingModel }))}
                    className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none`}
                  >
                    <option value="per_person">Per Person</option>
                    <option value="flat_rate">Flat Rate</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className={`block ${textPrimary} font-medium mb-3`}>Price ($) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none`}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className={`block ${textPrimary} font-medium mb-3`}>Duration (minutes) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    min="1"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: parseInt(e.target.value || '0', 10) }))}
                    className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none`}
                    placeholder="60"
                    required
                  />
                </div>
                <div>
                  <label className={`block ${textPrimary} font-medium mb-3`}>Capacity <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value || '0', 10) }))}
                    className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none`}
                    placeholder="10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className={`block ${textPrimary} font-medium mb-3`}>Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none resize-none`}
                  placeholder="Describe the service"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block ${textPrimary} font-medium mb-3`}>Location</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none`}
                    placeholder="On-site, Off-site, etc."
                  />
                </div>
                <div>
                  <label className={`block ${textPrimary} font-medium mb-3`}>Image URL</label>
                  <input
                    type="url"
                    value={formData.image_url || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none`}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className={`block ${textPrimary} font-medium mb-3`}>Deposit Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.deposit_amount || 0}
                    onChange={(e) => setFormData(prev => ({ ...prev, deposit_amount: parseFloat(e.target.value) || 0 }))}
                    className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none`}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className={`block ${textPrimary} font-medium mb-3`}>Lead Time (days)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.lead_time_days || 0}
                    onChange={(e) => setFormData(prev => ({ ...prev, lead_time_days: parseInt(e.target.value || '0', 10) }))}
                    className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none`}
                    placeholder="0"
                  />
                </div>
                <div className="flex items-center gap-3 pt-7">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="is_active" className={`${textPrimary} font-medium`}>Active</label>
                </div>
              </div>

              <div>
                <label className={`block ${textPrimary} font-medium mb-3`}>Cancellation Policy</label>
                <textarea
                  rows={3}
                  value={formData.cancellation_policy || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, cancellation_policy: e.target.value }))}
                  className={`w-full ${inputBg} ${textPrimary} px-4 py-3 rounded-xl border focus:border-blue-500 focus:outline-none resize-none`}
                  placeholder="Enter cancellation terms"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`${primaryButtonBg} px-8 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border shadow-lg hover:shadow-xl hover:scale-105`}
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isSubmitting ? 'Adding...' : 'Add Service'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
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
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className={`${cardBg} p-8 border shadow-lg`} style={{ borderRadius: '1.5rem' }}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>Service Library</h1>
            <p className={`${textSecondary}`}>Manage additional services and offerings</p>
          </div>
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <div className={`flex items-center gap-2 ${inputBg} ${textPrimary} px-4 py-2 rounded-xl border w-full md:w-80`}>
              <Search className="h-4 w-4 opacity-70" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services by name, description, location"
                className={`bg-transparent outline-none flex-1 ${textPrimary}`}
              />
            </div>
            <button onClick={() => setShowForm(true)} className={`${isDark ? 'bg-[#2a2a2a] hover:bg-[#333]' : 'bg-gray-900 hover:bg-gray-800'} text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all`}>
              <Plus className="h-4 w-4" />
              Add Service
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service, index) => (
          <div key={service.id} className={`${innerCardBg} p-6 border hover:shadow-xl transition-all`} style={{ borderRadius: index % 2 === 0 ? '1.5rem' : '1rem' }}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className={`${textPrimary} font-semibold text-lg mb-1`}>{service.name}</h3>
                <p className={`${textSecondary} text-sm mb-3`}>{service.description}</p>
              </div>
              <div className="flex gap-1">
                <button className={`${textSecondary} hover:text-blue-400 p-1`}><Edit className="h-4 w-4" /></button>
                <button className={`${textSecondary} hover:text-red-400 p-1`}><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center">
                <DollarSign className={`h-4 w-4 mx-auto mb-1 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                <div className={`${isDark ? 'text-green-400' : 'text-green-600'} font-bold text-sm`}>${service.price}</div>
                <div className={`${textSecondary} text-xs`}>{service.pricing_model === 'per_person' ? 'per person' : 'flat rate'}</div>
              </div>
              <div className="text-center">
                <Clock className={`h-4 w-4 mx-auto mb-1 ${textSecondary}`} />
                <div className={`${textPrimary} font-bold text-sm`}>{Math.floor(service.duration_minutes / 60)}h {service.duration_minutes % 60}m</div>
                <div className={`${textSecondary} text-xs`}>duration</div>
              </div>
              <div className="text-center">
                <Users className={`h-4 w-4 mx-auto mb-1 ${textSecondary}`} />
                <div className={`${textPrimary} font-bold text-sm`}>{service.capacity}</div>
                <div className={`${textSecondary} text-xs`}>max guests</div>
              </div>
            </div>

            <div className={`pt-3 border-t ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'} text-center`}>
              <span className={`text-xs ${textSecondary}`}>{service.bookings} bookings</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}