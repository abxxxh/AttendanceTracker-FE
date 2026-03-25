import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

//import { User } from '../../models/user.model';
import { LoginRequest } from '../../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'https://localhost:44362/api/User';

  constructor(private http: HttpClient) { }

  
  getAllUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  
  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

 
  createUser(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }


  updateUser(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

 
  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  
  // login(data: LoginRequest): Observable<any> {
  //   return this.http.post<any>(
  //     `${this.apiUrl}/login`,
  //     data
  //   );
  // }

}