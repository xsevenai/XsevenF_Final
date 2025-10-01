import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image: string
      googleId?: string
      businessId?: string
      role?: string
      accessToken?: string
    }
  }

  interface User {
    id: string
    email: string
    name: string
    image: string
    googleId?: string
    businessId?: string
    role?: string
  }

  interface JWT {
    googleId?: string
    businessId?: string
    role?: string
    accessToken?: string
  }
}