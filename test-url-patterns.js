// Test different URL patterns to find the correct endpoint
// Run this in your browser console

const businessId = localStorage.getItem('businessId')
const token = localStorage.getItem('accessToken')
const baseUrl = 'http://127.0.0.1:8060'

const testUrls = [
  // Current URLs (what we're using)
  `/api/v1/analytics/orders/overview/${businessId}`,
  
  // Alternative patterns based on your backend code
  `/api/v1/orders/overview/${businessId}`,
  `/orders/overview/${businessId}`,
  `/api/analytics/orders/overview/${businessId}`,
  `/analytics/orders/overview/${businessId}`,
  
  // Check if analytics router is mounted differently
  `/api/v1/analytics/orders/overview/${businessId}`,
  `/api/v1/analytics/orders/overview/${businessId}`,
]

console.log('Testing different URL patterns for orders analytics...')
console.log('Business ID:', businessId)

const testUrl = async (url) => {
  try {
    const response = await fetch(baseUrl + url + '?period=7d', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    console.log(`${url}: ${response.status} ${response.statusText}`)
    
    if (response.ok) {
      const data = await response.json()
      console.log(`✅ ${url} - SUCCESS:`, data)
      return true
    } else {
      const errorText = await response.text()
      console.log(`❌ ${url} - ERROR:`, errorText)
    }
  } catch (err) {
    console.log(`💥 ${url} - EXCEPTION:`, err.message)
  }
  return false
}

// Test all URL patterns
testUrls.forEach(testUrl)


