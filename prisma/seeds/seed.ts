import { PrismaClient } from '@prisma/client';
import { Logger } from '@nestjs/common';
import { roles } from './roles.seed';
import { permissions } from './permissions.seed';

const prisma = new PrismaClient();

async function main() {
  Logger.log('Seeding started', 'Seeder');

  const [storedRoles, storedPermission] = await Promise.all([
    prisma.role.findMany(),
    prisma.permission.findMany(),
  ]);

  //Check if roles already exist, if not create them
  for await (const role of Object.values(roles)) {
    const existingRole = storedRoles.find((r) => r.name === role);

    if (!existingRole) {
      const newRole = await prisma.role.create({
        data: { name: role },
      });
      storedRoles.push(newRole);
      Logger.log(`Role ${newRole.name} created`, 'Seeder');
    }
  }

  //Check if permissions already exist, if not create them, and assign them to the roles
  for await (const permission of Object.values(permissions)) {
    const existingPermission = storedPermission.find(
      (p) => p.name === permission.name,
    );

    if (!existingPermission) {
      const newPermission = await prisma.permission.create({
        data: {
          name: permission.name,
          codename: permission.codename,
        },
      });
      storedPermission.push(newPermission);

      await prisma.rolPermission.createMany({
        data: permission.roles.map((role) => ({
          roleId: storedRoles.find((r) => r.name === role).id,
          permissionId: newPermission.id,
        })),
      });
      Logger.log(`Permission ${newPermission.name} created`, 'Seeder');
    }
  }

  Logger.log('Seeding Finished', 'Seeder');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
