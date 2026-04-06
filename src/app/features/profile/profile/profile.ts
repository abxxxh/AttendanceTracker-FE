import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../user/user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {

  userId = 0;
  userData: any = null;
  errorMessage = '';

  constructor(private userService: UserService,private cdr:ChangeDetectorRef) {}

  ngOnInit(): void {

    this.userId = Number(localStorage.getItem('UserId'));

    if (this.userId) {
      this.loadUserDetails();
    }

  }

  loadUserDetails(): void {

    this.userService.getUserById(this.userId).subscribe({
      next: (res: any) => {

        this.userData = res.result || res;

        console.log('User Profile:', this.userData);
        this.cdr.detectChanges();

      },
      error: (err) => {

        console.error('Error loading profile', err);
        this.errorMessage = 'Failed to load profile details';

      }
    });

  }

}