// Test the corrected URL structure
// Run this in your browser console

const businessId = localStorage.getItem('businessId')
const token = localStorage.getItem('accessToken')
const baseUrl = 'http://127.0.0.1:8060'

console.log('Testing corrected orders analytics URLs...')
console.log('Business ID:', businessId)

const testCorrectedUrls = async () => {
  const endpoints = [
    `/api/v1/orders/overview/${businessId}`,
    `/api/v1/orders/trend/${businessId}`,
    `/api/v1/orders/by-hour/${businessId}`,
    `/api/v1/orders/status-distribution/${businessId}`,
    `/api/v1/orders/types/${businessId}`,
    `/api/v1/orders/top-items/${businessId}`,
    `/api/v1/orders/dashboard/${businessId}`
  ]

  for (const endpoint of endpoints) {
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
}

testCorrectedUrls()
