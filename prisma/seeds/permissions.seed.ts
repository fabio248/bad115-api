import { roles } from './roles.seed';

export const permissions = {
  CREATE_USER: {
    name: 'Create user',
    codename: 'create:user',
    description: 'Permiso para crear un usuario',
    roles: [roles.ADMIN, roles.USER, roles.CANDIDATE, roles.RECRUITER],
  },
  UPDATE_USER: {
    name: 'Update user',
    codename: 'update:user',
    description: 'Permiso para actualizar un usuario',
    roles: [roles.ADMIN, roles.USER, roles.CANDIDATE, roles.RECRUITER],
  },
  DELETE_USER: {
    name: 'Delete user',
    codename: 'delete:user',
    description: 'Permiso para eliminar un usuario',
    roles: [roles.ADMIN, roles.USER, roles.CANDIDATE, roles.RECRUITER],
  },
  READ_USER: {
    name: 'Read user',
    codename: 'read:user',
    description: 'Permiso para leer la información de un usuario',
    roles: [roles.ADMIN, roles.USER, roles.CANDIDATE, roles.RECRUITER],
  },
  MANAGE_USER: {
    name: 'Manage user',
    codename: 'manage:user',
    description: 'Permiso para gestionar usuarios',
    roles: [roles.ADMIN],
  },
  CREATE_ROLE: {
    name: 'Create role',
    codename: 'create:role',
    description: 'Permiso para crear roles',
    roles: [roles.ADMIN],
  },
  UPDATE_ROLE: {
    name: 'Update role',
    codename: 'update:role',
    description: 'Permiso para actualizar roles',
    roles: [roles.ADMIN],
  },
  DELETE_ROLE: {
    name: 'Delete role',
    codename: 'delete:role',
    description: 'Permiso para eliminar roles',
    roles: [roles.ADMIN],
  },
  READ_ROLE: {
    name: 'Read role',
    codename: 'read:role',
    description: 'Permiso para leer roles',
    roles: [roles.ADMIN],
  },
  MANAGE_ROLE: {
    name: 'Manage role',
    codename: 'manage:role',
    description: 'Permiso para gestionar roles',
    roles: [roles.ADMIN],
  },
  CREATE_PERMISSION: {
    name: 'Create permission',
    codename: 'create:permission',
    description: 'Permiso para crear permisos',
    roles: [roles.ADMIN],
  },
  UPDATE_PERMISSION: {
    name: 'Update permission',
    codename: 'update:permission',
    description: 'Permiso para actualizar permisos',
    roles: [roles.ADMIN],
  },
  DELETE_PERMISSION: {
    name: 'Delete permission',
    codename: 'delete:permission',
    description: 'Permiso para eliminar permisos',
    roles: [roles.ADMIN],
  },
  READ_PERMISSION: {
    name: 'Read permission',
    codename: 'read:permission',
    description: 'Permiso para leer permisos',
    roles: [roles.ADMIN],
  },
  MANAGE_PERMISSION: {
    name: 'Manage permission',
    codename: 'manage:permission',
    description: 'Permiso para gestionar permisos',
    roles: [roles.ADMIN],
  },
  CREATE_PERSON: {
    name: 'Create person',
    codename: 'create:person',
    description: 'Permiso para crear personas',
    roles: [roles.ADMIN, roles.USER],
  },
  UPDATE_PERSON: {
    name: 'Update person',
    codename: 'update:person',
    description: 'Permiso para actualizar personas',
    roles: [roles.ADMIN, roles.USER],
  },
  DELETE_PERSON: {
    name: 'Delete person',
    codename: 'delete:person',
    description: 'Permiso para eliminar personas',
    roles: [roles.ADMIN, roles.USER],
  },
  READ_PERSON: {
    name: 'Read person',
    codename: 'read:person',
    description: 'Permiso para leer personas',
    roles: [roles.ADMIN, roles.USER],
  },
  MANAGE_PERSON: {
    name: 'Manage person',
    codename: 'manage:person',
    description: 'Permiso para gestionar personas',
    roles: [roles.ADMIN],
  },
  CREATE_CANDIDATE: {
    name: 'Create candidate',
    codename: 'create:candidate',
    description: 'Permiso para crear candidatos',
    roles: [roles.ADMIN, roles.USER, roles.CANDIDATE],
  },
  UPDATE_CANDIDATE: {
    name: 'Update candidate',
    codename: 'update:candidate',
    description: 'Permiso para actualizar candidatos',
    roles: [roles.ADMIN, roles.USER, roles.CANDIDATE],
  },
  DELETE_CANDIDATE: {
    name: 'Delete candidate',
    codename: 'delete:candidate',
    description: 'Permiso para eliminar candidatos',
    roles: [roles.ADMIN, roles.USER, roles.CANDIDATE],
  },
  READ_CANDIDATE: {
    name: 'Read candidate',
    codename: 'read:candidate',
    description: 'Permiso para leer candidatos',
    roles: [roles.ADMIN, roles.USER, roles.CANDIDATE],
  },
  MANAGE_CANDIDATE: {
    name: 'Manage candidate',
    codename: 'manage:candidate',
    description: 'Permiso para gestionar candidatos',
    roles: [roles.ADMIN],
  },
  READ_CATALOG: {
    name: 'Read catalog',
    codename: 'read:catalog',
    description: 'Permiso para leer catálogos',
    roles: [roles.ADMIN, roles.USER, roles.CANDIDATE, roles.RECRUITER],
  },
  MANAGE_CATALOG: {
    name: 'Manage catalog',
    codename: 'manage:catalog',
    description: 'Permiso para gestionar catálogos',
    roles: [roles.ADMIN],
  },
  CREATE_CATALOG: {
    name: 'Create catalog',
    codename: 'create:catalog',
    description: 'Permiso para crear catálogos',
    roles: [roles.ADMIN],
  },
  UPDATE_CATALOG: {
    name: 'Update catalog',
    codename: 'update:catalog',
    description: 'Permiso para actualizar catálogos',
    roles: [roles.ADMIN],
  },
  DELETE_CATALOG: {
    name: 'Delete catalog',
    codename: 'delete:catalog',
    description: 'Permiso para eliminar catálogos',
    roles: [roles.ADMIN],
  },
  MANAGE_COMPANY: {
    name: 'Manage company',
    codename: 'manage:company',
    description: 'Permiso para gestionar empresas',
    roles: [roles.ADMIN],
  },
  READ_COMPANY: {
    name: 'Read company',
    codename: 'read:company',
    description: 'Permiso para leer empresas',
    roles: [roles.ADMIN, roles.COMPANY],
  },
  CREATE_COMPANY: {
    name: 'Create company',
    codename: 'create:company',
    description: 'Permiso para crear empresas',
    roles: [roles.ADMIN],
  },
  UPDATE_COMPANY: {
    name: 'Update company',
    codename: 'update:company',
    description: 'Permiso para actualizar empresas',
    roles: [roles.ADMIN, roles.COMPANY],
  },
  DELETE_COMPANY: {
    name: 'Delete company',
    codename: 'delete:company',
    description: 'Permiso para eliminar empresas',
    roles: [roles.ADMIN, roles.COMPANY],
  },
  CREATE_JOB: {
    name: 'Create job',
    codename: 'create:job',
    description: 'Permiso para oferta de empleos',
    roles: [roles.ADMIN, roles.COMPANY, roles.RECRUITER],
  },
  UPDATE_JOB: {
    name: 'Update job',
    codename: 'update:job',
    description: 'Permiso para actualizar oferta de empleos',
    roles: [roles.ADMIN, roles.COMPANY, roles.RECRUITER],
  },
  DELETE_JOB: {
    name: 'Delete job',
    codename: 'delete:job',
    description: 'Permiso para eliminar oferta de empleos',
    roles: [roles.ADMIN, roles.COMPANY, roles.RECRUITER],
  },
  READ_JOB: {
    name: 'Read job',
    codename: 'read:job',
    description: 'Permiso para leer oferta de empleos',
    roles: [roles.ADMIN, roles.COMPANY, roles.RECRUITER, roles.CANDIDATE],
  },
  MANAGE_JOB: {
    name: 'Manage job',
    codename: 'manage:job',
    description: 'Permiso para gestionar oferta de empleos',
    roles: [roles.ADMIN],
  },
  CREATE_APPLICATION: {
    name: 'Create application',
    codename: 'create:application',
    description: 'Permiso para aplicar a ofertas de empleo',
    roles: [roles.ADMIN, roles.CANDIDATE],
  },
  UPDATE_APPLICATION: {
    name: 'Update application',
    codename: 'update:application',
    description: 'Permiso para actualizar aplicaciones',
    roles: [roles.ADMIN, roles.CANDIDATE, roles.RECRUITER],
  },
  DELETE_APPLICATION: {
    name: 'Delete application',
    codename: 'delete:application',
    description: 'Permiso para eliminar aplicaciones',
    roles: [roles.ADMIN, roles.CANDIDATE, roles.RECRUITER],
  },
  READ_APPLICATION: {
    name: 'Read application',
    codename: 'read:application',
    description: 'Permiso para leer aplicaciones',
    roles: [roles.ADMIN, roles.CANDIDATE, roles.RECRUITER],
  },
  MANAGE_APPLICATION: {
    name: 'Manage application',
    codename: 'manage:application',
    description: 'Permiso para gestionar aplicaciones',
    roles: [roles.ADMIN],
  },
};
