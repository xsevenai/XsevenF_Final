import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      googleId?: string
      accessToken?: string
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    googleId?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    googleId?: string
    accessToken?: string
  }
}