import { Routes } from '@angular/router';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { MainLayout } from './layouts/main-layout/main-layout';

import { Login } from './features/login/login/login';
import { Dashboard } from './features/dashboard/dashboard/dashboard';
import { RoleForm } from './features/role/role-form/role-form';
import { UserForm } from './features/user/user-form/user-form';
import { TimesheetList } from './features/timesheet/timesheet-list/timesheet-list';
import { TimesheetForm } from './features/timesheet/timesheetform/timesheetform';
// import { TimesheetForm } from './features/timesheet/timesheet-form/timesheet-form';

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
      { path: 'timesheet', component: TimesheetList },
      { path: 'user-edit/:id', component: UserForm },
      { path: 'timesheet/add', component: TimesheetForm },
    ],
  },
];