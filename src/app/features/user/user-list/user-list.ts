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
  searchvalue = '';

  selectedUser: User | null = null;
  showViewPopup = false;

  constructor(
    private user: UserService,
    private auth: Auth,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.permissions = this.auth.getPermission();
    this.loadAllUsersData();
  }

  filterdata(): void {
    const search = this.searchvalue.trim().toLowerCase();

    if (!search) {
      this.filteredUsers.set(this.userDetailss());
      return;
    }

    const filtered = this.userDetailss().filter(
      (u) =>
        u.userName?.toLowerCase().includes(search) ||
        u.email?.toLowerCase().includes(search) ||
        u.roleName?.toLowerCase().includes(search) ||
        u.userDetails?.fullName?.toLowerCase().includes(search) ||
        u.userDetails?.department?.toLowerCase().includes(search)
    );

    this.filteredUsers.set(filtered);
    this.cdr.detectChanges();
  }

  viewUser(user: User): void {
    this.selectedUser = user;
    this.showViewPopup = true;
  }

  closePopup(): void {
    this.selectedUser = null;
    this.showViewPopup = false;
  }

  editUser(id: number): void {
    this.router.navigate(['/user-edit', id]);
  }

  deleteUser(id: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;

    this.user.deleteUser(id).subscribe({
      next: () => {
        const updatedUsers = this.userDetailss().filter((u) => u.id !== id);
        this.userDetailss.set(updatedUsers);
        this.filterdata();
        this.cdr.detectChanges();
        alert('User deleted successfully');
      },
      error: (e) => {
        console.log(e, 'Delete user error');
        alert('Failed to delete user');
      },
    });
  }

  loadAllUsersData(): void {
    this.user.getAllUsers().subscribe({
      next: (d) => {
        console.log(d, 'From User List get all');

        const role = this.auth.getRole()?.trim().toLowerCase();
        const loginUserId = this.auth.getUserId();

        let users: User[] = d.result || [];

        if (role === 'admin') {
          users = d.result;
        } else if (role === 'student') {
          users = d.result.filter((u: User) => u.id === loginUserId);
        } else if (role === 'staff' || role === 'faculty') {
          const loggedInStaff = d.result.find((u: User) => u.id === loginUserId);

          const staffDepartment =
            loggedInStaff?.userDetails?.department?.trim().toLowerCase() || '';

          users = d.result.filter((u: User) => {
            const userRole = u.roleName?.trim().toLowerCase();
            const userDepartment =
              u.userDetails?.department?.trim().toLowerCase() || '';

            return (
              u.id === loginUserId ||
              (userRole === 'student' && userDepartment === staffDepartment)
            );
          });
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