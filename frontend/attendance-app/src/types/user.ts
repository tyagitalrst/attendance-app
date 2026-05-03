export type Role = "EMPLOYEE" | "ADMIN";

export interface User {
  id: number;
  email: string;
  name: string;
  phoneNumber?: string | null;
  position?: string | null;
  photoUrl?: string | null;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRequest {
  phoneNumber?: string;
  password?: string;
  photoUrl?: string;
}
