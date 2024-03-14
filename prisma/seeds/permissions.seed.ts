import { roles } from './roles.seed';

export const permissions = {
  CREATE_USER: {
    name: 'Create user',
    codename: 'create:user',
    roles: [roles.ADMIN, roles.USER, roles.CANDIDATE, roles.RECRUITER],
  },
  UPDATE_USER: {
    name: 'Update user',
    codename: 'update:user',
    roles: [roles.ADMIN, roles.USER, roles.CANDIDATE, roles.RECRUITER],
  },
  DELETE_USER: {
    name: 'Delete user',
    codename: 'delete:user',
    roles: [roles.ADMIN, roles.USER, roles.CANDIDATE, roles.RECRUITER],
  },
  READ_USER: {
    name: 'Read user',
    codename: 'read:user',
    roles: [roles.ADMIN, roles.USER, roles.CANDIDATE, roles.RECRUITER],
  },
  MANAGE_USER: {
    name: 'Manage user',
    codename: 'manage:user',
    roles: [roles.ADMIN],
  },
  CREATE_ROLE: {
    name: 'Create role',
    codename: 'create:role',
    roles: [roles.ADMIN],
  },
  UPDATE_ROLE: {
    name: 'Update role',
    codename: 'update:role',
    roles: [roles.ADMIN],
  },
  DELETE_ROLE: {
    name: 'Delete role',
    codename: 'delete:role',
    roles: [roles.ADMIN],
  },
  READ_ROLE: {
    name: 'Read role',
    codename: 'read:role',
    roles: [roles.ADMIN],
  },
  MANAGE_ROLE: {
    name: 'Manage role',
    codename: 'manage:role',
    roles: [roles.ADMIN],
  },
  CREATE_PERMISSION: {
    name: 'Create permission',
    codename: 'create:permission',
    roles: [roles.ADMIN],
  },
  UPDATE_PERMISSION: {
    name: 'Update permission',
    codename: 'update:permission',
    roles: [roles.ADMIN],
  },
  DELETE_PERMISSION: {
    name: 'Delete permission',
    codename: 'delete:permission',
    roles: [roles.ADMIN],
  },
  READ_PERMISSION: {
    name: 'Read permission',
    codename: 'read:permission',
    roles: [roles.ADMIN],
  },
  MANAGE_PERMISSION: {
    name: 'Manage permission',
    codename: 'manage:permission',
    roles: [roles.ADMIN],
  },
};
