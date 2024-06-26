import { PrismaClient } from '@prisma/client';
import { Logger } from '@nestjs/common';
import { roles } from './roles.seed';
import { permissions } from './permissions.seed';
import { countriesSeed } from './country.seed';
import { departmentSeed } from './deparment.seed';
import { municipalitySeed } from './municipality.seed';
import {
  technicalSkillSeed,
  categoryTechnicalSkillSeed,
} from './technical-skill.seed';
import { recognitionTypeSeed } from './recognition-type.seed';
import { participationTypeSeed } from './participation-type.seed';
import { typeSocialNetworkSeed } from './type-social-network.seed';
import { typeTestSeed } from './type-test.seed';
import { languageSeed } from './language.seed';

import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  Logger.log('Seeding started', 'Seeder');

  const [
    storedRoles,
    storedPermission,
    storedCountries,
    storedDepartments,
    storedMunicipality,
    storedCategoriesTechnicalSkills,
    storedTechnicalSkills,
    storedRecognitionTypes,
    storedParticipationTypes,
    storedTypeSocialNetworks,
    storedTypeTests,
    storedLanguages,
  ] = await Promise.all([
    prisma.role.findMany(),
    prisma.permission.findMany(),
    prisma.country.findMany(),
    prisma.department.findMany(),
    prisma.municipality.findMany(),
    prisma.categoryTechnicalSkill.findMany(),
    prisma.technicalSkill.findMany(),
    prisma.recognitionType.findMany(),
    prisma.participacionType.findMany(),
    prisma.typeSocialNetwork.findMany(),
    prisma.testType.findMany(),
    prisma.language.findMany(),
  ]);

  for await (const language of languageSeed) {
    const existingLanguage = storedLanguages.find(
      (l) => l.language === language.language,
    );

    if (!existingLanguage) {
      const newLanguage = await prisma.language.create({
        data: {
          language: language.language,
        },
      });

      storedLanguages.push(newLanguage);
      Logger.log(`Language ${newLanguage.language} created`, 'Seeder');
    }
  }

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

  for await (const typeSocialNetwork of typeSocialNetworkSeed) {
    const existingTypeSocialNetwork = storedTypeSocialNetworks.find(
      (m) => m.name === typeSocialNetwork.name,
    );

    if (existingTypeSocialNetwork) {
      continue;
    }

    const newTypeSocialNetwork = await prisma.typeSocialNetwork.create({
      data: {
        name: typeSocialNetwork.name,
      },
    });

    storedTypeSocialNetworks.push(newTypeSocialNetwork);
    Logger.log(
      `Type Social Network ${newTypeSocialNetwork.name} created`,
      'Seeder',
    );
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
          description: permission.description,
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

    if (existingPermission) {
      await prisma.permission.update({
        where: {
          id: existingPermission?.id,
        },
        data: {
          name: permission.name,
          codename: permission.codename,
          description: permission.description,
        },
      });

      for await (const role of permission.roles) {
        await prisma.rolPermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: storedRoles.find((r) => r.name === role).id,
              permissionId: existingPermission.id,
            },
          },
          create: {
            roleId: storedRoles.find((r) => r.name === role).id,
            permissionId: existingPermission.id,
          },
          update: {},
        });
      }

      Logger.log(`Permission ${existingPermission.name} updated`, 'Seeder');
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

  for await (const department of departmentSeed) {
    const existingDepartment = storedDepartments.find(
      (d) => d.name === department.nam,
    );

    if (!existingDepartment) {
      const newDepartment = await prisma.department.create({
        data: {
          name: department.nam,
          codename: department.codigo.toString(),
        },
      });

      storedDepartments.push(newDepartment);
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

  for await (const category of categoryTechnicalSkillSeed) {
    const existingCategory = storedCategoriesTechnicalSkills.find(
      (c) => c.name === category.name,
    );

    if (!existingCategory) {
      const newCategory = await prisma.categoryTechnicalSkill.create({
        data: {
          name: category.name,
        },
      });

      storedCategoriesTechnicalSkills.push(newCategory);
      Logger.log(`Category ${newCategory.name} created`, 'Seeder');
    }
  }

  for await (const typeTest of typeTestSeed) {
    const existingTypeTest = storedTypeTests.find(
      (m) => m.name === typeTest.name,
    );

    if (existingTypeTest) {
      continue;
    }

    const newTypeTest = await prisma.testType.create({
      data: {
        name: typeTest.name,
      },
    });

    storedTypeTests.push(newTypeTest);
    Logger.log(`Type Test ${newTypeTest.name} created`, 'Seeder');
  }

  for await (const technicalSkill of technicalSkillSeed) {
    const existingTechnicalSkill = storedTechnicalSkills.find(
      (t) => t.name === technicalSkill.name,
    );

    if (!existingTechnicalSkill) {
      const newTechnicalSkill = await prisma.technicalSkill.create({
        data: {
          name: technicalSkill.name,
          categoryTechnicalSkill: {
            connect: {
              id: storedCategoriesTechnicalSkills.find(
                (c) => c.name === technicalSkill.category,
              ).id,
            },
          },
        },
      });

      storedTechnicalSkills.push(newTechnicalSkill);
      Logger.log(`Technical Skill ${newTechnicalSkill.name} created`, 'Seeder');
    }
  }

  for await (const typeRecognition of recognitionTypeSeed) {
    const existingTypeRecognition = storedRecognitionTypes.find(
      (m) => m.name === typeRecognition.name,
    );

    if (existingTypeRecognition) {
      continue;
    }

    const newTypeRecognition = await prisma.recognitionType.create({
      data: {
        name: typeRecognition.name,
      },
    });

    storedRecognitionTypes.push(newTypeRecognition);
    Logger.log(`Type Recognition ${newTypeRecognition.name} created`, 'Seeder');
  }

  for await (const participationType of participationTypeSeed) {
    const existingParticipationType = storedParticipationTypes.find(
      (m) => m.name === participationType.name,
    );

    if (existingParticipationType) {
      continue;
    }

    const newParticipationType = await prisma.participacionType.create({
      data: {
        name: participationType.name,
      },
    });

    storedParticipationTypes.push(newParticipationType);
    Logger.log(
      `Participation Type ${newParticipationType.name} created`,
      'Seeder',
    );
  }

  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    Logger.log('Seeding Finished', 'Seeder');
    return;
  }

  const existAdmin = await prisma.user.findFirst({
    where: { email: 'admin@gmail.com' },
  });

  if (existAdmin) {
    Logger.log('User admin already exist', 'Seeder');
    Logger.log('Seeding Finished', 'Seeder');
    return;
  }

  await prisma.$transaction(async (tPrisma) => {
    const person = await tPrisma.person.create({
      data: {
        firstName: 'Admin',
        lastName: 'Admin',
        birthday: new Date(),
        gender: 'F',
        user: {
          create: {
            email: 'admin@gmail.com',
            password: bcrypt.hashSync('admin', 10),
          },
        },
      },
      include: {
        user: true,
      },
    });

    await tPrisma.userRole.create({
      data: {
        role: {
          connect: {
            name: roles.ADMIN,
          },
        },
        user: {
          connect: {
            id: person.user.id,
          },
        },
      },
    });

    Logger.log('User admin created', 'Seeder');
  });

  Logger.log('Seeding Finished', 'Seeder');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
