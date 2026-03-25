import { UserDetails } from "./user-details.model";

export interface User {
   id: number;
  userName: string;
  email: string;
  roleName: string;
  userDetails: UserDetails;
}
export interface UserResponse{
  message:string;
  result:User[];
}