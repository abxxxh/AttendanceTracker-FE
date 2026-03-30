import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TimesheetService } from '../timesheet';

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

  constructor(
    private fb: FormBuilder,
    private timesheetService: TimesheetService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loggedInUserId = Number(localStorage.getItem('UserId')) || 0;
    this.loggedInRole = (localStorage.getItem('Role') || '').toLowerCase();

    console.log('Logged In UserId:', this.loggedInUserId);
    console.log('Logged In Role:', this.loggedInRole);

    this.timesheetForm = this.fb.group({
      userId: ['', Validators.required],
      date: ['', Validators.required],
      status: ['', Validators.required],
      course: ['', Validators.required],
      recordedBy: ['', Validators.required],
    });

    this.applyRoleRules();
  }

  applyRoleRules(): void {
    if (this.loggedInRole === 'student') {
      this.timesheetForm.patchValue({
        userId: this.loggedInUserId,
        recordedBy: this.loggedInUserId,
      });

      this.timesheetForm.get('userId')?.disable();
      this.timesheetForm.get('recordedBy')?.disable();
    }

    if (this.loggedInRole === 'staff') {
      this.timesheetForm.patchValue({
        recordedBy: this.loggedInUserId,
      });

      this.timesheetForm.get('recordedBy')?.disable();
    }
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.timesheetForm.invalid) {
      this.timesheetForm.markAllAsTouched();
      return;
    }

    const payload = this.timesheetForm.getRawValue();

    if (this.loggedInRole === 'student') {
      payload.userId = this.loggedInUserId;
      payload.recordedBy = this.loggedInUserId;
    }

    if (this.loggedInRole === 'staff') {
      payload.recordedBy = this.loggedInUserId;
    }

    this.isSubmitting = true;

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
}