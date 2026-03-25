import { Permission } from './../../../core/models/permission';
import { Component } from '@angular/core';
import { PermissionModel } from '../../../core/models/permission';
import {UserService } from '../../user/user';
import { Auth } from '../../../core/services/auth/auth';
import { UserDetails } from '../../../models/user-details.model';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
permissions!: PermissionModel;
userDetails?:UserDetails[];
constructor(private user:UserService,private auth:Auth) {
  
  
}


ngOnInit(): void {
  this.permissions = this.auth.getPermission();
console.log(this.permissions);
this.loadAllUsersData();
}


loadAllUsersData(){
     this.user.getAllUsers().subscribe({
      next:(d)=>{
        console.log(d)
        //  this.userDetails=
      },
      error:(e)=>{
        console.log(e);
        
      }
     })
}
     













}
