import React from "react"
import { Eye, EyeOff } from "lucide-react"

interface SignupFormProps {
  email: string
  password: string
  showPassword: boolean
  errors: { email: string; password: string }
  loading: boolean
  isLoaded: boolean
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onShowPasswordToggle: () => void
  onSubmit: () => void
  onGoogleSignup: () => void
}

export function SignupForm({
  email,
  password,
  showPassword,
  errors,
  loading,
  isLoaded,
  onEmailChange,
  onPasswordChange,
  onShowPasswordToggle,
  onSubmit,
  onGoogleSignup
}: SignupFormProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
      <div className="absolute top-6 left-6 flex items-center gap-3">
        <div className="w-10 h-10">
          <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="mask0" style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
              <rect width="100" height="100" fill="#D9D9D9"/>
            </mask>
            <g mask="url(#mask0)">
              <path d="M199.939 7.77539C199.979 8.80162 200 9.83244 200 10.8672C200 60.0925 155.228 99.998 99.9998 99.998C76.1256 99.998 54.2058 92.54 37.0116 80.0967L56.3123 65.6543C68.6382 73.4766 83.7162 78.0771 99.9998 78.0771C141.645 78.0771 175.406 47.9874 175.407 10.8691H199.939V7.77539ZM24.6014 11.8418C24.7614 21.8758 27.389 31.3777 31.9666 39.8877L12.6707 54.3232C4.60097 41.4676 0.000196561 26.6472 -0.000152588 10.8691V0H24.5936V10.8691L24.6014 11.8418Z" fill="#E3D7D7"/>
              <path d="M99.9998 0.00012207V25.1818L-0.000183105 100L-15.6848 83.3468L66.6639 21.7394H-0.000183105V21.7384H32.1727C31.4657 18.2104 31.0975 14.5775 31.0975 10.8683V0.00012207H99.9998Z" fill="#C1FD3A"/>
            </g>
          </svg>
        </div>
        <span className="text-gray-900 dark:text-white text-2xl font-semibold">XsevenAI</span>
      </div>

      <div className="min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Create your account
          </h1>

          <button
            type="button"
            onClick={onGoogleSignup}
            disabled={loading}
            className="w-full py-3 px-4 mb-4 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 bg-white dark:bg-[#0a0a0a] text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.9895 10.1871C19.9895 9.36767 19.9214 8.76973 19.7742 8.14966H10.1992V11.848H15.8195C15.7062 12.7671 15.0943 14.1512 13.7346 15.0813L13.7155 15.2051L16.7429 17.4969L16.9527 17.5174C18.8789 15.7789 19.9895 13.221 19.9895 10.1871Z" fill="#4285F4"/>
              <path d="M10.1993 19.9313C12.9527 19.9313 15.2643 19.0454 16.9527 17.5174L13.7346 15.0813C12.8734 15.6682 11.7176 16.0779 10.1993 16.0779C7.50243 16.0779 5.21352 14.3395 4.39759 11.9366L4.27799 11.9465L1.13003 14.3273L1.08887 14.4391C2.76588 17.6945 6.21061 19.9313 10.1993 19.9313Z" fill="#34A853"/>
              <path d="M4.39748 11.9366C4.18219 11.3166 4.05759 10.6521 4.05759 9.96565C4.05759 9.27909 4.18219 8.61473 4.38615 7.99466L4.38045 7.8626L1.19304 5.44366L1.08875 5.49214C0.397576 6.84305 0.000976562 8.36008 0.000976562 9.96565C0.000976562 11.5712 0.397576 13.0882 1.08875 14.4391L4.39748 11.9366Z" fill="#FBBC05"/>
              <path d="M10.1993 3.85336C12.1142 3.85336 13.406 4.66168 14.1425 5.33717L17.0207 2.59107C15.253 0.985496 12.9527 0 10.1993 0C6.2106 0 2.76588 2.23672 1.08887 5.49214L4.38626 7.99466C5.21352 5.59183 7.50242 3.85336 10.1993 3.85336Z" fill="#EB4335"/>
            </svg>
            Sign up with Google
          </button>

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={onEmailChange}
                placeholder=""
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.email 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-700 focus:ring-yellow-500'
                } bg-white dark:bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:border-transparent transition-all duration-200 outline-none`}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <a href="/forgot-password" className="text-sm text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300">
                  Forgot your password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={onPasswordChange}
                  placeholder=""
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onSubmit()
                    }
                  }}
                  className={`w-full px-4 py-3 pr-12 rounded-lg border ${
                    errors.password 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-700 focus:ring-yellow-500'
                  } bg-white dark:bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:border-transparent transition-all duration-200 outline-none`}
                />
                <button
                  type="button"
                  onClick={onShowPasswordToggle}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <button
              type="button"
              onClick={onSubmit}
              disabled={loading}
              className="w-full py-3 px-4 bg-gray-400 hover:bg-gray-500 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              Sign up
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <a href="/login" className="font-semibold text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 transition-colors">
              Sign in
            </a>
          </p>

          <div className="flex justify-center gap-2 mt-8">
            <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
            <div className="w-2 h-2 rounded-full bg-gray-900 dark:bg-white"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
    </div>
  )
}