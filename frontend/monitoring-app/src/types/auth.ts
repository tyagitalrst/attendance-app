import type { User } from "./user";

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}
