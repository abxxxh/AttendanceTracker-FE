export interface Permission {
}
export interface PermissionModel {
  canAddRole: boolean;
  canAddUser: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canView: boolean;
  canAddTimeSheet: boolean;
  canEditTimeSheet: boolean;
}
export type RoleType = 'Admin' | 'Staff' | 'Student';

export interface TokenPayloadModel {
  email: string;
  userName: string;
  role: RoleType;
}
export interface UserAccessModel {
  role: 'Admin' | 'Staff' | 'Student';
  permissions: PermissionModel;
}