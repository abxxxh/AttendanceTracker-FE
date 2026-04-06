import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TimesheetService } from '../timesheet';
import { UserService } from '../../user/user';

@Component({
  selector: 'app-timesheet-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './timesheetform.html',
  styleUrl: './timesheetform.css',
})
export class TimesheetForm implements OnInit {
  timesheetForm!: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  loggedInUserId = 0;
  loggedInRole = '';

  users: any[] = [];
  courses: string[] = ['C#', 'Angular', 'SQL'];

  timesheetId: number | null = null;
  isEditMode = false;
  isViewMode = false;

  constructor(
    private fb: FormBuilder,
    private timesheetService: TimesheetService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loggedInUserId = Number(localStorage.getItem('UserId')) || 0;
    this.loggedInRole = (localStorage.getItem('Role') || '').toLowerCase();

    this.timesheetForm = this.fb.group({
      userId: ['', Validators.required],
      date: ['', Validators.required],
      status: ['', Validators.required],
      course: ['', Validators.required],
      recordedBy: ['', Validators.required],
    });

    this.applyRoleRules();

    if (this.loggedInRole === 'admin' || this.loggedInRole === 'staff') {
      this.loadUsers();
    }

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (id) {
        this.timesheetId = Number(id);

        if (this.router.url.includes('/timesheet/edit/')) {
          this.isEditMode = true;
        }

        if (this.router.url.includes('/timesheet/view/')) {
          this.isViewMode = true;
        }

        this.loadTimesheetById(this.timesheetId);
      }
    });
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (res: any) => {
        const allUsers = res.result || res || [];

        if (this.loggedInRole === 'staff') {
          this.users = allUsers.filter(
            (user: any) => user.roleName?.toLowerCase() === 'student'
          );
        } else {
          this.users = allUsers;
        }
      },
      error: (err) => {
        console.error('Failed to load users', err);
      },
    });
  }

  loadTimesheetById(id: number): void {
    this.timesheetService.getTimesheetById(id).subscribe({
      next: (res: any) => {
        const data = res.result || res;
          console.log('Timesheet data:', data);
        console.log('Course from API:', data.course);
let selectedCourse = data.course;

      if (selectedCourse?.toLowerCase() === 'c#' || selectedCourse?.toLowerCase() === 'csharp') {
        selectedCourse = 'C#';
      } else if (selectedCourse?.toLowerCase() === 'angular') {
        selectedCourse = 'Angular';
      } else if (selectedCourse?.toLowerCase() === 'sql') {
        selectedCourse = 'SQL';
      }

        this.timesheetForm.patchValue({
          userId: data.userId,
          date: data.date,
          status: data.status,
          course: data.course,
          recordedBy: data.recordedBy,
        });

        if (this.isViewMode) {
          this.timesheetForm.disable();
        } else {
          this.timesheetForm.get('recordedBy')?.disable();

          if (this.loggedInRole === 'student') {
            this.timesheetForm.get('userId')?.disable();
          }
        }
      },
      error: (err) => {
        console.error('Failed to load timesheet', err);
        this.errorMessage = 'Failed to load timesheet details.';
      },
    });
  }

  applyRoleRules(): void {
    this.timesheetForm.patchValue({
      recordedBy: this.loggedInUserId,
    });

    this.timesheetForm.get('recordedBy')?.disable();

    if (this.loggedInRole === 'student') {
      this.timesheetForm.patchValue({
        userId: this.loggedInUserId,
      });
      this.timesheetForm.get('userId')?.disable();
    } else {
      this.timesheetForm.get('userId')?.enable();
    }
  }

  onSubmit(): void {
    if (this.isViewMode) return;

    this.successMessage = '';
    this.errorMessage = '';

    if (this.timesheetForm.invalid) {
      this.timesheetForm.markAllAsTouched();
      return;
    }

    const payload = this.timesheetForm.getRawValue();

    payload.recordedBy = this.loggedInUserId;

    if (this.loggedInRole === 'student') {
      payload.userId = this.loggedInUserId;
    }

    this.isSubmitting = true;

    if (this.isEditMode && this.timesheetId) {
      this.timesheetService.updateTimesheet(this.timesheetId, payload).subscribe({
        next: (response) => {
          console.log('Timesheet updated successfully', response);
          this.successMessage = 'Timesheet updated successfully!';
          this.isSubmitting = false;

          setTimeout(() => {
            this.router.navigate(['/timesheet']);
          }, 1000);
        },
        error: (error) => {
          console.error('Error updating timesheet', error);
          this.errorMessage = 'Failed to update timesheet.';
          this.isSubmitting = false;
        },
      });
    } else {
      this.timesheetService.createTimesheet(payload).subscribe({
        next: (response) => {
          console.log('Timesheet added successfully', response);
          this.successMessage = 'Timesheet added successfully!';
          this.isSubmitting = false;

          this.timesheetForm.reset();
          this.applyRoleRules();

          setTimeout(() => {
            this.router.navigate(['/timesheet']);
          }, 1000);
        },
        error: (error) => {
          console.error('Error adding timesheet', error);
          this.errorMessage = 'Failed to add timesheet.';
          this.isSubmitting = false;
        },
      });
    }
  }

  get pageTitle(): string {
    if (this.isViewMode) return 'View Timesheet';
    if (this.isEditMode) return 'Edit Timesheet';
    return 'Add Timesheet';
  }

  get submitButtonText(): string {
    if (this.isEditMode) return 'Update';
    return 'Save';
  }

  get userId() {
    return this.timesheetForm.get('userId');
  }

  get date() {
    return this.timesheetForm.get('date');
  }

  get status() {
    return this.timesheetForm.get('status');
  }

  get course() {
    return this.timesheetForm.get('course');
  }

  get recordedBy() {
    return this.timesheetForm.get('recordedBy');
  }

  get isStudent(): boolean {
    return this.loggedInRole === 'student';
  }

  get isStaff(): boolean {
    return this.loggedInRole === 'staff';
  }

  get isAdmin(): boolean {
    return this.loggedInRole === 'admin';
  }

  get showUserDropdown(): boolean {
    return this.isAdmin || this.isStaff;
  }
}