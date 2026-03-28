import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../core/services/auth/auth';
import { PermissionModel } from '../../../core/models/permission';
import { UserList } from '../../user/user-list/user-list';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,UserList,Sidebar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  permissions!: PermissionModel;
  name!: string | null;

  constructor(private auth: Auth) {}

  ngOnInit(): void {
    this.permissions = this.auth.getPermission();
    this.name = this.auth.getUserName();
  }
}