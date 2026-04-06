import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Role } from '../role';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './role-form.html',
  styleUrl: './role-form.css',
})
export class RoleForm implements OnInit {

  roleForm!: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  // ✅ Only 3 roles allowed
  roleOptions: string[] = [
    'Admin',
    'Staff',
    'Student'
  ];

  constructor(
    private fb: FormBuilder,
    private roleService: Role,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.roleForm = this.fb.group({
      roleName: ['', Validators.required],
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

    // ✅ using addRole()
    this.roleService.addRole(this.roleForm.value).subscribe({

      next: (response) => {

        console.log('Role added successfully', response);

        this.successMessage = 'Role added successfully!';
        this.isSubmitting = false;

        this.roleForm.reset();

        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1000);

      },

      error: (error) => {

        console.error('Error adding role', error);

        this.errorMessage = 'Failed to add role.';
        this.isSubmitting = false;

      }

    });

  }

  get roleName() {
    return this.roleForm.get('roleName');
  }

  get description() {
    return this.roleForm.get('description');
  }

}