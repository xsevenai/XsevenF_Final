// Debug helper for OrdersAnalytics
// Add this to your browser console to check the businessId

console.log('=== OrdersAnalytics Debug Info ===')
console.log('Business ID from localStorage:', localStorage.getItem('businessId'))
console.log('Access Token from localStorage:', localStorage.getItem('accessToken') ? 'Found' : 'Not found')

// Test API endpoint
const testAPI = async () => {
  const businessId = localStorage.getItem('businessId')
  if (!businessId) {
    console.error('No businessId found in localStorage')
    return
  }
  
  try {
    const response = await fetch(`http://127.0.0.1:8060/api/v1/analytics/orders/overview/${businessId}?period=7d`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    })
    
    console.log('API Response Status:', response.status)
    if (response.ok) {
      const data = await response.json()
      console.log('API Response Data:', data)
    } else {
      const errorText = await response.text()
      console.error('API Error:', errorText)
    }
  } catch (err) {
    console.error('API Call Failed:', err)
  }
}

// Run the test
testAPI()
