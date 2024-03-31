import { PrismaClient } from '@prisma/client';
import { Logger } from '@nestjs/common';
import { roles } from './roles.seed';
import { permissions } from './permissions.seed';
import { countriesSeed } from './country.seed';
import { departmentSeed } from './deparment.seed';
import { municipalitySeed } from './municipality.seed';

const prisma = new PrismaClient();

async function main() {
  Logger.log('Seeding started', 'Seeder');

  const [
    storedRoles,
    storedPermission,
    storedCountries,
    storedDeparments,
    storedMunicipality,
  ] = await Promise.all([
    prisma.role.findMany(),
    prisma.permission.findMany(),
    prisma.country.findMany(),
    prisma.department.findMany(),
    prisma.municipality.findMany(),
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

  for await (const country of countriesSeed) {
    const existingCountry = storedCountries.find(
      (c) => c.name === country.nombre,
    );

    if (!existingCountry) {
      const newCountry = await prisma.country.create({
        data: {
          name: country.nombre,
          areaCode: country.codigo_area,
        },
      });

      storedCountries.push(newCountry);
      Logger.log(`Country ${newCountry.name} created`, 'Seeder');
    }
  }

  for await (const deparment of departmentSeed) {
    const existingDepartment = storedDeparments.find(
      (d) => d.name === deparment.nam,
    );

    if (!existingDepartment) {
      const newDepartment = await prisma.department.create({
        data: {
          name: deparment.nam,
          codename: deparment.codigo.toString(),
        },
      });

      storedDeparments.push(newDepartment);
      Logger.log(`Department ${newDepartment.name} created`, 'Seeder');
    }
  }

  for await (const municipality of municipalitySeed) {
    const existingMunicipality = storedMunicipality.find(
      (m) => m.name === municipality.nam,
    );

    if (!existingMunicipality) {
      const newMunicipality = await prisma.municipality.create({
        data: {
          name: municipality.nam,
          codename: municipality.codigo.toString(),
          department: {
            connect: {
              name: departmentSeed.find(
                (d) =>
                  d.codigo === municipality.codigo.toString().substring(0, 2),
              ).nam,
            },
          },
        },
      });

      storedMunicipality.push(newMunicipality);
      Logger.log(`Municipality ${newMunicipality.name} created`, 'Seeder');
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
