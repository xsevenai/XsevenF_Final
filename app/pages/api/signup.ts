import { NextApiRequest, NextApiResponse } from 'next'
import { SignupService } from '@/lib/api/signup'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const signupData = req.body

    // Validate required fields
    const requiredFields = [
      'businessName', 'businessDescription', 'ownerName', 
      'email', 'password', 'category', 'planId'
    ]
    
    for (const field of requiredFields) {
      if (!signupData[field]) {
        return res.status(400).json({ 
          error: `${field} is required` 
        })
      }
    }

    // Check if email already exists
    const emailExists = await SignupService.checkEmailExists(signupData.email)
    if (emailExists) {
      return res.status(400).json({ 
        error: 'Email already exists' 
      })
    }

    // Create the account
    const result = await SignupService.createAccount(signupData)

    res.status(201).json(result)

  } catch (error) {
    console.error('Signup API error:', error)
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    })
  }
}
