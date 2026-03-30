import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface RoleRequest {
  roleName: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class Role {
  private apiUrl = 'https://localhost:44362/api/Role';

  constructor(private http: HttpClient) {}

  addRole(role: RoleRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, role);
  }

  getAllRoles(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}