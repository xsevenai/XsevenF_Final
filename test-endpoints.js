// Test script to check which orders analytics endpoints are available
// Run this in your browser console

const businessId = localStorage.getItem('businessId')
const baseUrl = 'http://127.0.0.1:8060'
const token = localStorage.getItem('accessToken')

const endpoints = [
  '/api/v1/analytics/orders/overview/' + businessId,
  '/api/v1/analytics/orders/trend/' + businessId,
  '/api/v1/analytics/orders/by-hour/' + businessId,
  '/api/v1/analytics/orders/status-distribution/' + businessId,
  '/api/v1/analytics/orders/types/' + businessId,
  '/api/v1/analytics/orders/top-items/' + businessId,
  '/api/v1/analytics/orders/dashboard/' + businessId
]

console.log('Testing Orders Analytics Endpoints...')
console.log('Business ID:', businessId)
console.log('Base URL:', baseUrl)

const testEndpoint = async (endpoint) => {
  try {
    const response = await fetch(baseUrl + endpoint + '?period=7d', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    console.log(`${endpoint}: ${response.status} ${response.statusText}`)
    
    if (response.ok) {
      const data = await response.json()
      console.log(`✅ ${endpoint} - SUCCESS:`, data)
    } else {
      const errorText = await response.text()
      console.log(`❌ ${endpoint} - ERROR:`, errorText)
    }
  } catch (err) {
    console.log(`💥 ${endpoint} - EXCEPTION:`, err.message)
  }
}

// Test all endpoints
endpoints.forEach(testEndpoint)
