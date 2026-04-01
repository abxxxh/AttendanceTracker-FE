import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { TimesheetService } from '../timesheet';
import { Auth } from '../../../core/services/auth/auth';

@Component({
  selector: 'app-timesheet-list',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './timesheet-list.html',
  styleUrl: './timesheet-list.css',
})
export class TimesheetList implements OnInit {
  timesheets = signal<any[]>([]);
  errorMessage = '';
  currentRole: string | null = null;
  currentUserId: number | null = null;
  currentUserName: string | null = null;

  constructor(
    private timesheetService: TimesheetService,
    private router: Router,
    private auth: Auth
  ) {}

  ngOnInit(): void {
    this.currentRole = this.auth.getRole();
    this.currentUserId = this.auth.getUserId?.() ?? null;
    this.currentUserName = this.auth.getUserName?.() ?? null;

    this.loadTimesheets();
  }

  loadTimesheets(): void {
    this.timesheetService.getAllTimesheets().subscribe({
      next: (response) => {
        const allData = response.result || response;
        const role = this.currentRole?.toLowerCase();

        if (role === 'admin') {
          this.timesheets.set(allData);
        } 
        else if (role === 'student') {
          const studentData = allData.filter((item: any) =>
            item.userId === this.currentUserId ||
            item.userName?.toLowerCase() === this.currentUserName?.toLowerCase()
          );
          this.timesheets.set(studentData);
        } 
        else if (role === 'staff' || role === 'teacher' || role === 'faculty') {
          const teacherData = allData.filter((item: any) =>
            item.recordedBy === this.currentUserId ||
            item.recordedByName?.toLowerCase() === this.currentUserName?.toLowerCase()
          );
          this.timesheets.set(teacherData);
        } 
        else {
          this.timesheets.set([]);
          this.errorMessage = 'Unauthorized role.';
        }
      },
      error: (error) => {
        console.error('Error loading timesheets', error);
        this.errorMessage = 'Failed to load timesheet records.';
      },
    });
  }

  addTimesheet(): void {
    this.router.navigate(['/timesheet/add']);
  }

  viewTimesheet(id: number): void {
    this.router.navigate(['/timesheet/view', id]);
  }

  editTimesheet(id: number): void {
    this.router.navigate(['/timesheet/edit', id]);
  }

  deleteTimesheet(id: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this record?');
    if (!confirmDelete) return;

    this.timesheetService.deleteTimesheet(id).subscribe({
      next: () => {
        this.loadTimesheets();
      },
      error: (error) => {
        console.error('Error deleting timesheet', error);
        this.errorMessage = 'Failed to delete timesheet record.';
      },
    });
  }

  isAdmin(): boolean {
    return this.currentRole?.toLowerCase() === 'admin';
  }

  isTeacher(): boolean {
    const role = this.currentRole?.toLowerCase();
    return role === 'staff' || role === 'teacher' || role === 'faculty';
  }

  isStudent(): boolean {
    return this.currentRole?.toLowerCase() === 'student';
  }
}