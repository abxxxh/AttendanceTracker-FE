import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { TimesheetService } from '../timesheet';

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

  constructor(
    private timesheetService: TimesheetService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTimesheets();
  }

  loadTimesheets(): void {
    this.timesheetService.getAllTimesheets().subscribe({
      next: (response) => {
        this.timesheets.set(response.result || response);
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
}