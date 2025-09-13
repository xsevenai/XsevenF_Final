export interface Profile {
  id: string
  user_id: string
  email: string
  full_name: string | null
  role: string | null
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  profile?: Profile
}