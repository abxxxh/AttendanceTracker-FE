import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest, LoginResponse } from '../../../models/login.model';
import { Observable } from 'rxjs';
import { PermissionModel } from '../../models/permission';
import { adminPermission, staffPermission, studentPermission } from '../../config/role-permissions';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl="https://localhost:44362/api/User";
  constructor(private http:HttpClient){

  }

loginDetail(loginReq:LoginRequest):Observable<LoginResponse>{

  return this.http.post<LoginResponse>(`${this.apiUrl}/login`,loginReq)
}

storeData(response:LoginResponse):void{

localStorage.setItem('Token',response.result.token)
localStorage.setItem('Email',response.result.email)
localStorage.setItem('Role',response.result.roleName)
localStorage.setItem('UserName',response.result.userName)


}


getToken():string|null{
  return localStorage.getItem('Token');
}
getRole():string|null{
  return localStorage.getItem('Role')
}
getUserName():string|null{
  return localStorage.getItem('UserName')
}
getEmail():string|null{
  return localStorage.getItem('Email')
}

logOut():void{
localStorage.removeItem('Token')
localStorage.removeItem('Email')
localStorage.removeItem('Role')
localStorage.removeItem('UserName')
}

getPermission():PermissionModel{

const role=this.getRole();

if (role==='Admin'){
  return adminPermission;
}
if (role==='Staff'){
  return staffPermission;
}
return studentPermission;


}


}
