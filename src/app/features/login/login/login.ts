import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../../core/services/auth/auth';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  LoginForm!: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.LoginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.LoginForm.valid) {
      this.auth.loginDetail(this.LoginForm.value).subscribe({
        next: (a) => {
          console.log('Login Success', a);
          this.auth.storeData(a);
          this.router.navigate(['/dashboard']);
        },
        error: (e) => {
          console.log('Login Failed', e);
          this.errorMessage = 'Invalid email or password';
        },
      });
    } else {
      this.LoginForm.markAllAsTouched();
    }
  }
}