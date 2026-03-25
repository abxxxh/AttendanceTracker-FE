import { PermissionModel } from "../models/permission";

export class RolePermissions {
}

export const adminPermission:PermissionModel={
    canAddRole: true,
  canAddUser: true,
  canEdit: true,
  canDelete: true,
  canView: true,
  canAddTimeSheet: true,
  canEditTimeSheet: true,
};
export const staffPermission:PermissionModel={
    canAddRole: false,
    canAddUser: true,
    canEdit: true,
    canDelete: true,
    canView: true,
    canAddTimeSheet: true,
    canEditTimeSheet: true
}
export const studentPermission:PermissionModel={
    canAddRole: false,
    canAddUser: false,
    canEdit: true,
    canDelete: false,
    canView: true,
    canAddTimeSheet: true,
    canEditTimeSheet: false
}