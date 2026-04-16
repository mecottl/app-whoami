import { prisma } from "./lib/prisma";

async function main() {
  const user = await prisma.user.create({
    data: {
      email: "test@test.com",
      name: "Test",
      password: "123456"
    }
  });

  console.log(user);
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