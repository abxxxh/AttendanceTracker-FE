import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UserService } from '../user';
import { Auth } from '../../../core/services/auth/auth';
import { PermissionModel } from '../../../core/models/permission';
import { User } from '../../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList implements OnInit {
  permissions!: PermissionModel;
  userDetailss = signal<User[]>([]);
  filteredUsers = signal<User[]>([]);
  searchvalue = signal('');

  constructor(
    private user: UserService,
    private auth: Auth,
    private cdr: ChangeDetectorRef, private router: Router
  ) {}

  ngOnInit(): void {
    this.permissions = this.auth.getPermission();
    this.loadAllUsersData();
  }

  filterdata(): void {
    const search = this.searchvalue().trim().toLowerCase();

    if (!search) {
      this.filteredUsers.set(this.userDetailss());
      return;
    }

    const filtered = this.userDetailss().filter(
      (u) =>
        u.userName?.toLowerCase().includes(search) ||
        u.email?.toLowerCase().includes(search) ||
        u.roleName?.toLowerCase().includes(search) ||
        u.userDetails?.fullName?.toLowerCase().includes(search)
    );

    this.filteredUsers.set(filtered);
    this.cdr.detectChanges();
  }
editUser(id: number): void {
    this.router.navigate(['/user-edit', id]);
  }
  loadAllUsersData(): void {
    this.user.getAllUsers().subscribe({
      next: (d) => {
        console.log(d, 'From User List get all');

        const role = this.auth.getRole();
        const loginUserId = this.auth.getUserId();

        let users: User[] = d.result;

        if (role === 'Admin') {
          users = d.result;
        } else if (role === 'Student') {
          users = d.result.filter((u: User) => u.id === loginUserId);
        } else if (role === 'Staff') {
          // Temporary staff filter
          // This shows only students in the same department as logged-in staff
          // Change this logic later if you get staffId / mentorId from backend

          const loggedInStaff = d.result.find((u: User) => u.id === loginUserId);

          users = d.result.filter(
            (u: User) =>
              u.roleName === 'Student' &&
              u.userDetails?.department === loggedInStaff?.userDetails?.department
          );
        } else {
          users = [];
        }

        this.userDetailss.set(users);
        this.filteredUsers.set(users);
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.log(e, 'From User List get all error found');
      },
    });
  }
}