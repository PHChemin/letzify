import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = 'Letzify123';

  await prisma.user.upsert({
    where: { email: 'admin@letzify.com' },
    update: {
      roles: [Role.ADMIN, Role.USER],
      isActive: true,
    },
    create: {
      name: 'Admin Letzify',
      email: 'admin@letzify.com',
      passwordHash: await bcrypt.hash(password, 10),
      roles: [Role.ADMIN, Role.USER],
    },
  });

  await prisma.user.upsert({
    where: { email: 'designer@letzify.com' },
    update: { isActive: true },
    create: {
      name: 'Designer Letzify',
      email: 'designer@letzify.com',
      passwordHash: await bcrypt.hash(password, 10),
      roles: [Role.USER],
    },
  });

  console.log('Seed concluído:');
  console.log('  admin@letzify.com / Letzify123 (ADMIN)');
  console.log('  designer@letzify.com / Letzify123 (USER)');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
