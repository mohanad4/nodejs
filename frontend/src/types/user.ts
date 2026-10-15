// Mirrors the Prisma User model in backend/prisma/schema.prisma: the API never returns passwords
export interface User {
  id: number;
  email: string;
  name: string | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}

// Body for POST /api/users/save-user: with an id it updates that user, without one it creates a user
export interface SaveUserInput {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  // Required when creating; when updating, leave it out to keep the current password
  password?: string;
}
