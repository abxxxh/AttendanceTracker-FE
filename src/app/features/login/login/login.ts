import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../../core/services/auth/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {

  LoginForm!: FormGroup;

  constructor(private fb: FormBuilder, private auth: Auth) {}

  ngOnInit(): void {
    this.LoginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.LoginForm.valid) {
      this.auth.loginDetail(this.LoginForm.value).subscribe({
        next: (a) => {
          console.log('Login Success', a);
          this.auth.storeData(a);
        },
        error: (e) => {
          console.log("Login Failed", e);
        }
      });
    } else {
      this.LoginForm.markAllAsTouched();
    }
  }
}