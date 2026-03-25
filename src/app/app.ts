import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from './features/login/login/login';
import { Dashboard } from './features/dashboard/dashboard/dashboard';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Login,Dashboard],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('AttendanceTracker-FE');
}
