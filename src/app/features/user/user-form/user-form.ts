import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
})
export class UserForm implements OnInit {
  userForm!: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  userIdForEdit: number = 0;
  isEditMode = false;

  roles = [
    { roleId: 4, roleName: 'Intern' },
    { roleId: 2, roleName: 'Student' },
    { roleId: 5, roleName: 'Staff' }
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      roleId: ['', Validators.required],
      userDetails: this.fb.group({
        fullName: ['', Validators.required],
        dob: ['', Validators.required],
        gender: ['', Validators.required],
        phoneNumber: [
          '',
          [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
        ],
        address: ['', Validators.required],
        department: [''],
        year: [0],
      }),
    });

    this.onRoleChange();

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.userIdForEdit = id;
      this.isEditMode = true;
      this.loadUserById(id);
    }
  }

  loadUserById(id: number): void {
    this.userService.getUserById(id).subscribe({
      next: (response) => {
        const user = response.result;

        this.userForm.patchValue({
          userName: user.userName,
          email: user.email,
          password: '', // usually don't patch old password
          roleId: user.roleId,
          userDetails: {
            fullName: user.userDetails?.fullName || '',
            dob: user.userDetails?.dob || '',
            gender: user.userDetails?.gender || '',
            phoneNumber: user.userDetails?.phoneNumber || '',
            address: user.userDetails?.address || '',
            department: user.userDetails?.department || '',
            year: user.userDetails?.year || 0,
          },
        });

        // password optional in edit mode
        this.userForm.get('password')?.clearValidators();
        this.userForm.get('password')?.updateValueAndValidity();
      },
      error: (error) => {
        console.log('Error loading user by id', error);
        this.errorMessage = 'Failed to load user details.';
      },
    });
  }

  onRoleChange(): void {
    this.userForm.get('roleId')?.valueChanges.subscribe((selectedRoleId) => {
      const departmentControl = this.userForm.get('userDetails.department');
      const yearControl = this.userForm.get('userDetails.year');

      departmentControl?.clearValidators();
      yearControl?.clearValidators();

      if (+selectedRoleId === 2) {
        departmentControl?.setValidators([Validators.required]);
        yearControl?.setValidators([Validators.required, Validators.min(1)]);
      } else if (+selectedRoleId === 5) {
        departmentControl?.setValidators([Validators.required]);
        yearControl?.setValue(0);
      } else {
        departmentControl?.setValue('');
        yearControl?.setValue(0);
      }

      departmentControl?.updateValueAndValidity();
      yearControl?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const formValue = this.userForm.value;

    const payload: any = {
      userName: formValue.userName,
      email: formValue.email,
      roleId: +formValue.roleId,
      userdetailsnavigation: formValue.userDetails
    };

    if (!this.isEditMode) {
      payload.password = formValue.password;
    } else if (formValue.password) {
      payload.password = formValue.password;
    }

    if (this.isEditMode) {
      this.userService.updateUser(this.userIdForEdit, payload).subscribe({
        next: (response) => {
          console.log('User updated successfully', response);
          this.successMessage = 'User updated successfully!';
          this.isSubmitting = false;

          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1000);
        },
        error: (error) => {
          console.log('Full backend error:', error);
          console.log('Backend validation errors:', error.error);
          this.errorMessage = 'Failed to update user.';
          this.isSubmitting = false;
        },
      });
    } else {
      payload.password = formValue.password;

      this.userService.createUser(payload).subscribe({
        next: (response) => {
          console.log('User added successfully', response);
          this.successMessage = 'User added successfully!';
          this.isSubmitting = false;

          this.userForm.reset();
          this.userForm.patchValue({
            roleId: '',
            userDetails: {
              department: '',
              year: 0,
            },
          });

          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1000);
        },
        error: (error) => {
          console.log('Full backend error:', error);
          console.log('Backend validation errors:', error.error);
          this.errorMessage = 'Failed to add user.';
          this.isSubmitting = false;
        },
      });
    }
  }

  get userName() {
    return this.userForm.get('userName');
  }

  get email() {
    return this.userForm.get('email');
  }

  get password() {
    return this.userForm.get('password');
  }

  get roleId() {
    return this.userForm.get('roleId');
  }

  get fullName() {
    return this.userForm.get('userDetails.fullName');
  }

  get dob() {
    return this.userForm.get('userDetails.dob');
  }

  get gender() {
    return this.userForm.get('userDetails.gender');
  }

  get phoneNumber() {
    return this.userForm.get('userDetails.phoneNumber');
  }

  get address() {
    return this.userForm.get('userDetails.address');
  }

  get department() {
    return this.userForm.get('userDetails.department');
  }

  get year() {
    return this.userForm.get('userDetails.year');
  }

  get selectedRoleName(): string {
    const selectedRole = this.roles.find((r) => r.roleId == this.roleId?.value);
    return selectedRole?.roleName?.toLowerCase() || '';
  }
}