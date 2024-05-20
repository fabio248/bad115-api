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
  CREATE_PERSON: {
    name: 'Create person',
    codename: 'create:person',
    roles: [roles.ADMIN, roles.USER],
  },
  UPDATE_PERSON: {
    name: 'Update person',
    codename: 'update:person',
    roles: [roles.ADMIN, roles.USER],
  },
  DELETE_PERSON: {
    name: 'Delete person',
    codename: 'delete:person',
    roles: [roles.ADMIN, roles.USER],
  },
  READ_PERSON: {
    name: 'Read person',
    codename: 'read:person',
    roles: [roles.ADMIN, roles.USER],
  },
  MANAGE_PERSON: {
    name: 'Manage person',
    codename: 'manage:person',
    roles: [roles.ADMIN],
  },
  CREATE_CANDIDATE: {
    name: 'Create candidate',
    codename: 'create:candidate',
    roles: [roles.ADMIN, roles.USER, roles.CANDIDATE],
  },
  UPDATE_CANDIDATE: {
    name: 'Update candidate',
    codename: 'update:candidate',
    roles: [roles.ADMIN, roles.USER, roles.CANDIDATE],
  },
  DELETE_CANDIDATE: {
    name: 'Delete candidate',
    codename: 'delete:candidate',
    roles: [roles.ADMIN, roles.USER, roles.CANDIDATE],
  },
  READ_CANDIDATE: {
    name: 'Read candidate',
    codename: 'read:candidate',
    roles: [roles.ADMIN, roles.USER, roles.CANDIDATE],
  },
  MANAGE_CANDIDATE: {
    name: 'Manage candidate',
    codename: 'manage:candidate',
    roles: [roles.ADMIN],
  },
  READ_CATALOG: {
    name: 'Read catalog',
    codename: 'read:catalog',
    roles: [roles.ADMIN, roles.USER, roles.CANDIDATE, roles.RECRUITER],
  },
  MANAGE_CATALOG: {
    name: 'Manage catalog',
    codename: 'manage:catalog',
    roles: [roles.ADMIN],
  },
  CREATE_CATALOG: {
    name: 'Create catalog',
    codename: 'create:catalog',
    roles: [roles.ADMIN],
  },
  UPDATE_CATALOG: {
    name: 'Update catalog',
    codename: 'update:catalog',
    roles: [roles.ADMIN],
  },
};
