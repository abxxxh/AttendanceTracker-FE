import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Auth } from '../../../core/services/auth/auth';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  currentRole: string | null = null;

  constructor(private auth: Auth) {}

  ngOnInit(): void {
    this.currentRole = this.auth.getRole();
  }

  isAdmin(): boolean {
    return this.currentRole?.toLowerCase() === 'admin';
  }

  isStaff(): boolean {
    return this.currentRole?.toLowerCase() === 'staff';
  }

  isStudent(): boolean {
    return this.currentRole?.toLowerCase() === 'student';
  }
}