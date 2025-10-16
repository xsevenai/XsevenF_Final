# Adding New API Endpoints Guide

This guide shows you how to add new endpoints to your FastAPI backend and generate the corresponding TypeScript client without modifying existing code.

## 🚀 Quick Start

### 1. Add New Endpoints to FastAPI Backend

Create a new router file in your FastAPI backend:

```python
# backend/routers/customer_management.py
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from uuid import UUID
from datetime import datetime

from ..models.customer import Customer, CustomerCreate, CustomerUpdate
from ..services.database import get_database_service

router = APIRouter(prefix="/api/v1/customer", tags=["Customer Management"])

@router.get("/customers", response_model=List[Customer])
async def list_customers(
    business_id: UUID,
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """List all customers for a business"""
    try:
        db = get_database_service()
        # Your implementation here
        return []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/customers", response_model=Customer)
async def create_customer(customer_data: CustomerCreate):
    """Create a new customer"""
    try:
        db = get_database_service()
        # Your implementation here
        return customer_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/customers/{customer_id}", response_model=Customer)
async def get_customer(customer_id: UUID):
    """Get customer by ID"""
    try:
        db = get_database_service()
        # Your implementation here
        return {}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/customers/{customer_id}", response_model=Customer)
async def update_customer(customer_id: UUID, customer_data: CustomerUpdate):
    """Update customer"""
    try:
        db = get_database_service()
        # Your implementation here
        return customer_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/customers/{customer_id}")
async def delete_customer(customer_id: UUID):
    """Delete customer"""
    try:
        db = get_database_service()
        # Your implementation here
        return {"message": "Customer deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### 2. Register the Router

Add the new router to your main FastAPI app:

```python
# backend/main.py
from fastapi import FastAPI
from routers import customer_management  # Add this import

app = FastAPI(title="Your API", version="1.0.0")

# Existing routers
app.include_router(existing_router)

# Add new router
app.include_router(customer_management.router)  # Add this line
```

### 3. Regenerate OpenAPI Client

Run the regeneration script:

```bash
# Make sure your FastAPI server is running
uvicorn main:app --host 127.0.0.1 --port 8060 --reload

# In another terminal, regenerate the client
npm run regenerate-openapi
# or
bash scripts/regenerate-openapi.sh
```

### 4. Create Frontend Hook

Create a new hook using the generated service:

```typescript
// hooks/use-customer-management.ts
import { useState, useEffect } from 'react'
import { CustomerManagementService } from '@/src/api/generated/services/CustomerManagementService'
import { Customer, CustomerCreate, CustomerUpdate } from '@/src/api/generated'
import { configureAPI } from '@/lib/api-config'

export function useCustomerManagement(businessId: string) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCustomers = async (status?: string, search?: string) => {
    try {
      setLoading(true)
      setError(null)
      configureAPI()
      
      const data = await CustomerManagementService.listCustomersApiV1CustomerCustomersGet(
        businessId,
        status || null,
        search || null,
        50, // limit
        0   // offset
      )
      
      setCustomers(data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch customers')
      console.error('Error fetching customers:', err)
    } finally {
      setLoading(false)
    }
  }

  const createCustomer = async (customerData: CustomerCreate) => {
    try {
      setError(null)
      configureAPI()
      
      const newCustomer = await CustomerManagementService.createCustomerApiV1CustomerCustomersPost(customerData)
      setCustomers(prev => [newCustomer, ...prev])
      return newCustomer
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create customer'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const updateCustomer = async (customerId: string, customerData: CustomerUpdate) => {
    try {
      setError(null)
      configureAPI()
      
      const updatedCustomer = await CustomerManagementService.updateCustomerApiV1CustomerCustomersCustomerIdPut(
        customerId,
        customerData
      )
      
      setCustomers(prev => prev.map(customer => 
        customer.id === customerId ? updatedCustomer : customer
      ))
      return updatedCustomer
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update customer'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const deleteCustomer = async (customerId: string) => {
    try {
      setError(null)
      configureAPI()
      
      await CustomerManagementService.deleteCustomerApiV1CustomerCustomersCustomerIdDelete(customerId)
      setCustomers(prev => prev.filter(customer => customer.id !== customerId))
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete customer'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const getCustomer = async (customerId: string) => {
    try {
      configureAPI()
      return await CustomerManagementService.getCustomerApiV1CustomerCustomersCustomerIdGet(customerId)
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get customer'
      throw new Error(errorMessage)
    }
  }

  useEffect(() => {
    if (businessId) {
      fetchCustomers()
    }
  }, [businessId])

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomer
  }
}
```

### 5. Create Frontend Component

Create a component using the hook:

```typescript
// app/dashboard/customer-component/CustomerManagement.tsx
"use client"

import { useState } from 'react'
import { useCustomerManagement } from '@/hooks/use-customer-management'
import { useTheme } from '@/hooks/useTheme'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'

export default function CustomerManagement() {
  const { isDark } = useTheme()
  const businessId = typeof window !== "undefined" ? localStorage.getItem("businessId") || "" : ""
  const { 
    customers, 
    loading, 
    error, 
    fetchCustomers, 
    createCustomer, 
    updateCustomer, 
    deleteCustomer 
  } = useCustomerManagement(businessId)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)

  const handleSearch = () => {
    fetchCustomers(undefined, searchTerm)
  }

  const handleCreateCustomer = async (customerData: any) => {
    try {
      await createCustomer(customerData)
      setShowCreateForm(false)
    } catch (error) {
      console.error('Failed to create customer:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Customer Management
        </h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2 inline" />
          Add Customer
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`flex-1 px-4 py-2 rounded-lg border ${
            isDark 
              ? 'bg-gray-800 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>

      {/* Customer List */}
      {loading ? (
        <div className="text-center py-8">Loading customers...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">{error}</div>
      ) : (
        <div className="grid gap-4">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className={`p-4 rounded-lg border ${
                isDark 
                  ? 'bg-gray-800 border-gray-600' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {customer.name}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {customer.email}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {/* Edit logic */}}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteCustomer(customer.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

## 📋 Common Service Categories

Here are some common service categories you might want to add:

### 1. Customer Management (`/api/v1/customer`)
- Customer profiles, loyalty programs, order history
- Endpoints: customers, loyalty, analytics

### 2. Marketing (`/api/v1/marketing`)
- Campaigns, promotions, email marketing
- Endpoints: campaigns, promotions, templates

### 3. Financial (`/api/v1/financial`)
- Accounting, tax reports, financial analytics
- Endpoints: reports, transactions, taxes

### 4. Communication (`/api/v1/communication`)
- SMS, email, notifications, chat
- Endpoints: messages, templates, notifications

### 5. Reporting (`/api/v1/reports`)
- Custom reports, data exports, business intelligence
- Endpoints: reports, exports, dashboards

## 🔧 Regeneration Process

### Automatic Regeneration
```bash
# Install the script dependencies
npm install -g openapi-typescript-codegen

# Run the regeneration script
npm run regenerate-openapi
```

### Manual Regeneration
```bash
# Make sure FastAPI server is running
uvicorn main:app --host 127.0.0.1 --port 8060 --reload

# Generate client
npx openapi-typescript-codegen \
  -i http://127.0.0.1:8060/openapi.json \
  -o src/api/generated \
  --client axios \
  --useOptions \
  --useUnionTypes
```

## ✅ Benefits

1. **Zero Breaking Changes** - Existing code remains untouched
2. **Automatic Type Safety** - New endpoints get full TypeScript support
3. **Consistent Patterns** - New services follow the same structure
4. **Easy Maintenance** - Clear separation of concerns
5. **Scalable** - Add unlimited new service categories

## 🚨 Important Notes

- Always start your FastAPI server before regenerating
- The generated services will be in `src/api/generated/services/`
- Update your hooks to use the new generated services
- Test new endpoints thoroughly before deploying
- Keep your API documentation up to date

## 📁 File Structure

```
src/api/generated/
├── services/
│   ├── MenuAnalyticsService.ts      # New menu analytics
│   ├── CustomerManagementService.ts # New customer service
│   └── ... (other services)
├── models/
│   ├── Customer.ts
│   ├── CustomerCreate.ts
│   └── ... (other models)
└── core/
    ├── OpenAPI.ts
    └── ... (core files)
```
