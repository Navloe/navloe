import bcrypt from 'bcrypt';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

async function main() {
  const adminNavloe = await prisma.users.upsert({
    where: { email: 'admin@navloe.com' },
    update: {},
    create: {
      name: 'Admin Navloe',
      email: 'admin@navloe.com',
      password: await bcrypt.hash('navloe1!1oelvan', 10),
      phoneNumber: '082341795451',
      role: 'admin',
      emailVerified: true,
    },
  })
  console.log({ adminNavloe })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
