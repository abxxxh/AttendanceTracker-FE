import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AttendanceRequestDto {
  userId: number;
  date: string;
  status: string;
  course: string;
  recordedBy: number;
}

@Injectable({
  providedIn: 'root',
})
export class TimesheetService {
  private apiUrl = 'https://localhost:44362/api/Attendance';

  constructor(private http: HttpClient) {}

  getAllTimesheets(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getTimesheetById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createTimesheet(data: AttendanceRequestDto): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateTimesheet(id: number, data: AttendanceRequestDto): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteTimesheet(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}