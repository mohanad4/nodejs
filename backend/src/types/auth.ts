// Request bodies

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface RegisterRequestBody {
  name: string;
  username: string;
  password: string;
}

// Response bodies

// The user as sent to the client: never include the password
export interface PublicUser {
  id: number;
  name: string | null;
  email: string;
}

// What is signed into the JWT: keep it minimal, anyone holding the token can read it
export interface TokenPayload {
  id: number;
  email: string;
}

// The logged-in user returned by /auth/login: public fields plus role and permission names
export interface AuthUser extends PublicUser {
  roles: string[];
  permissions: string[];
}

export interface AuthSuccessResponse {
  message: string;
  user: AuthUser;
  accessToken: string;
}

export interface ErrorResponse {
  message: string;
}

export type AuthResponse = AuthSuccessResponse | ErrorResponse;
