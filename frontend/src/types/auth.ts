// Mirrors backend/src/types/auth.ts

// Body for POST /api/auth/login
export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  name: string | null;
  email: string;
  roles: string[];
  permissions: string[];
}

export interface LoginResponse {
  message: string;
  user: AuthUser;
  accessToken: string;
}
