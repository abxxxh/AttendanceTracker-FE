import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UserService } from '../user';
import { Auth } from '../../../core/services/auth/auth';
import { PermissionModel } from '../../../core/models/permission';
import { User } from '../../../models/user.model';

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
    private cdr: ChangeDetectorRef
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

    const filtered = this.userDetailss().filter((u) =>
      u.userName?.toLowerCase().includes(search)
    );

    this.filteredUsers.set(filtered);
    this.cdr.detectChanges();
  }

  loadAllUsersData(): void {
    this.user.getAllUsers().subscribe({
      next: (d) => {
        console.log(d, 'From User List get all');
        this.userDetailss.set(d.result);
        this.filteredUsers.set(d.result);
      },
      error: (e) => {
        console.log(e, 'From User List get all error found');
      },
    });
  }
}