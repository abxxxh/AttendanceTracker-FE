export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginResult {
  id: number;
  token: string;
  email: string;
  userName: string;
  roleName: string;
}
export interface LoginResponse {
  message: string;
  result: LoginResult;
}