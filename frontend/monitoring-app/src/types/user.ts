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

export interface FilterUser {
  role?: string;
  searchKeyword?: string;
}

export interface AdminCreateUserRequest {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
  position?: string;
  role?: Role;
}

export interface AdminUpdateUserRequest {
  email?: string;
  name?: string;
  phoneNumber?: string;
  position?: string;
  photoUrl?: string;
  password?: string;
  role?: Role;
}
