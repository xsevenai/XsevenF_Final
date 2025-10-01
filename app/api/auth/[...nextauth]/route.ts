import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Console log Google user data from sign in
          console.log('Google Sign-in User Data:')
          console.log('Email:', user.email)
          console.log('Name:', user.name)
          console.log('Google ID from user.id:', user.id)
          console.log('Google ID from account.providerAccountId:', account.providerAccountId)
          console.log('Image:', user.image)
          console.log('Full user object:', user)
          console.log('Account:', account)
          console.log('Profile:', profile)
          
          // Always allow sign in, we'll handle user checking in the callback page
          return true
        } catch (error) {
          console.error('Google sign in error:', error)
          return false
        }
      }
      return true
    },
    async redirect({ url, baseUrl }) {
      console.log('NextAuth redirect called with:', { url, baseUrl })
      
      // Handle both relative and absolute URLs safely
      let urlObj
      let callbackUrl = null
      
      try {
        // If URL is relative, make it absolute for parsing
        const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`
        urlObj = new URL(fullUrl)
        callbackUrl = urlObj.searchParams.get('callbackUrl')
        
        console.log('URL parsing successful:', {
          fullUrl,
          pathname: urlObj.pathname,
          searchParams: urlObj.searchParams.toString(),
          callbackUrl
        })
      } catch (error) {
        console.log('URL parsing failed, treating as relative path:', url)
        // Fallback for simple relative paths
        callbackUrl = null
      }
      
      console.log('Callback URL from params:', callbackUrl)
      
      // Check if this is from /auth/login (your actual login page)
      if (callbackUrl === '/auth/login' || callbackUrl?.includes('/auth/login') || url.includes('/auth/login')) {
        console.log('Login callback detected (/auth/login), redirecting to processing page')
        return `${baseUrl}/auth/process-google-login`
      }
      
      // Also handle full URL callbacks to /auth/login
      if (callbackUrl?.endsWith('/auth/login')) {
        console.log('Full URL login callback detected, redirecting to processing page')
        return `${baseUrl}/auth/process-google-login`
      }
      
      // Check if this is going to the processing page
      if (callbackUrl === '/auth/process-google-login' || url.includes('/auth/process-google-login')) {
        console.log('Redirecting to login processing page')
        return `${baseUrl}/auth/process-google-login`
      }
      
      // Check if this is from /auth (signup flow)
      if ((url.includes('/auth') || callbackUrl === '/auth') && !url.includes('login') && !url.includes('process')) {
        console.log('Redirecting to auth signup callback')
        return `${baseUrl}/auth/callback/google`
      }
      
      // If trying to redirect to /login (old path), redirect to correct path
      if (url === '/login' || callbackUrl === '/login') {
        console.log('Redirecting from /login to /auth/login')
        return `${baseUrl}/auth/login`
      }
      
      // Default redirect handling
      if (url.startsWith("/")) {
        console.log('Redirecting to relative URL:', url)
        return `${baseUrl}${url}`
      } else if (url.startsWith("http") && new URL(url).origin === baseUrl) {
        console.log('Redirecting to same origin URL:', url)
        return url
      }
      
      console.log('Redirecting to base URL:', baseUrl)
      return baseUrl
    },
    async jwt({ token, user, account }) {
      if (account?.provider === "google" && user) {
        // Use providerAccountId instead of user.id for Google ID
        token.googleId = account.providerAccountId || user.id
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      if (token.googleId) {
        session.user = {
          ...session.user,
          googleId: token.googleId as string,
          accessToken: token.accessToken as string
        }
      }
      return session
    }
  },
  pages: {
    signIn: '/auth',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt'
  },
  debug: process.env.NODE_ENV === 'development', // Enable debug logs in development
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }