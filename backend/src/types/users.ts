// Body for POST /api/users/save-user: with an id it updates that user, without one it creates a user
export interface SaveUserRequestBody {
  id?: number;
  email: string;
  name?: string;
  phone?: string;
  // Required when creating; when updating, leave it out to keep the current password
  password?: string;
}
