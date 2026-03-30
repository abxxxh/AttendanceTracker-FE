import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Role } from '../role';
// import { RoleService } from '../role';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './role-form.html',
  styleUrl: './role-form.css',
})
export class RoleForm {
  roleForm: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private roleService: Role,
    private router: Router
  ) {
    this.roleForm = this.fb.group({
      roleName: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.roleService.addRole(this.roleForm.value).subscribe({
      next: (response) => {
        console.log('Role added successfully', response);
        this.successMessage = 'Role added successfully!';
        this.roleForm.reset();

        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1000);
      },
      error: (error) => {
        console.error('Error adding role', error);
        this.errorMessage = 'Failed to add role.';
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }

  get roleName() {
    return this.roleForm.get('roleName');
  }

  get description() {
    return this.roleForm.get('description');
  }
}