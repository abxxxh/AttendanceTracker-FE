import { Routes } from '@angular/router';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { MainLayout } from './layouts/main-layout/main-layout';

import { Login } from './features/login/login/login';
import { Dashboard } from './features/dashboard/dashboard/dashboard';
import { RoleForm } from './features/role/role-form/role-form';
import { UserForm } from './features/user/user-form/user-form';
import { TimesheetList } from './features/timesheet/timesheet-list/timesheet-list';
import { TimesheetForm } from './features/timesheet/timesheetform/timesheetform';
import { Profile } from './features/profile/profile/profile';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayout,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: Login },
    ],
  },
  {
    path: '',
    component: MainLayout,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'roles/add', component: RoleForm },
      { path: 'users/add', component: UserForm },
      { path: 'user-edit/:id', component: UserForm },

      { path: 'timesheet', component: TimesheetList },
      { path: 'timesheet/add', component: TimesheetForm },
      { path: 'timesheet/edit/:id', component: TimesheetForm },
      { path: 'timesheet/view/:id', component: TimesheetForm },
      { path: 'profile', component: Profile },
    ],
  },
];