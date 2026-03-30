import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../../core/services/auth/auth';
// import { Auth } from '../../core/services/auth/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  title = 'Attendance Tracker';
  userName = '';

  constructor(
    private router: Router,
    private auth: Auth
  ) {}

  ngOnInit(): void {
    this.userName = this.auth.getUserName() || this.auth.getEmail() || 'User';
  }

  logout(): void {
    this.auth.logOut();
    this.router.navigate(['/login']);
  }
}