// lib/auth.ts
interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  email: string;
  role: string;
  business_id: string;
  expires_in: number;
}

class AuthService {
  private static API_URL = process.env.BACKEND_API_URL || 'http://localhost:8000';

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${this.API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    return response.json();
  }

  static setAuthData(data: AuthResponse): void {
    localStorage.setItem('accessToken', data.access_token);
    localStorage.setItem('user_id', data.user_id);
    localStorage.setItem('user_email', data.email);
    localStorage.setItem('business_id', data.business_id);
    localStorage.setItem('user_role', data.role);
    
    const expiresAt = new Date().getTime() + (data.expires_in * 1000);
    localStorage.setItem('token_expires_at', expiresAt.toString());
  }

  static clearAuthData(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    localStorage.removeItem('business_id');
    localStorage.removeItem('user_role');
    localStorage.removeItem('token_expires_at');
  }

  static getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  static isAuthenticated(): boolean {
    const token = this.getToken();
    const expiresAt = localStorage.getItem('token_expires_at');
    
    if (!token || !expiresAt) return false;
    
    return new Date().getTime() < parseInt(expiresAt);
  }
}

export default AuthService;