import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest, LoginResponse } from '../../../models/login.model';
import { Observable } from 'rxjs';
import { PermissionModel } from '../../models/permission';
import {
  adminPermission,
  staffPermission,
  studentPermission,
} from '../../config/role-permissions';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'https://localhost:44362/api/User';

  constructor(private http: HttpClient) {}

  loginDetail(loginReq: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginReq);
  }

  storeData(response: LoginResponse): void {
    localStorage.setItem('Token', response.result.token);
    localStorage.setItem('Email', response.result.email);
    localStorage.setItem('Role', response.result.roleName);
    localStorage.setItem('UserName', response.result.userName);
    localStorage.setItem('UserId', response.result.id.toString());

    console.log('Stored Role:', response.result.roleName);
  }

  getUserId(): number {
    return Number(localStorage.getItem('UserId'));
  }

  getToken(): string | null {
    return localStorage.getItem('Token');
  }

  getRole(): string | null {
    return localStorage.getItem('Role');
  }

  getUserName(): string | null {
    return localStorage.getItem('UserName');
  }

  getEmail(): string | null {
    return localStorage.getItem('Email');
  }

  logOut(): void {
    localStorage.removeItem('Token');
    localStorage.removeItem('Email');
    localStorage.removeItem('Role');
    localStorage.removeItem('UserName');
    localStorage.removeItem('UserId');
  }

  getPermission(): PermissionModel {
    const role = this.getRole()?.trim().toLowerCase();

    if (role === 'admin') {
      return adminPermission;
    }

    if (role === 'staff' || role === 'faculty') {
      return staffPermission;
    }

    if (role === 'student' || role === 'Student') {
      return studentPermission;
    }

    return {
      canAddRole: false,
      canAddUser: false,
      canEdit: false,
      canDelete: false,
      canView: false,
      canAddTimeSheet: false,
      canEditTimeSheet: false,
    };
  }
}