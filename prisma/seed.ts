import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const shippingCosts = [
  { day: 'monday', cost: 2.5 },
  { day: 'tuesday', cost: 2.5 },
  { day: 'wednesday', cost: 3.0 },
  { day: 'thursday', cost: 3.0 },
  { day: 'friday', cost: 3.5 },
  { day: 'saturday', cost: 4.0 },
  { day: 'sunday', cost: 1.5 },
];

async function main() {
  console.log('Seeding shipping costs...');

  for (const shippingCost of shippingCosts) {
    await prisma.shippingCost.upsert({
      where: { day: shippingCost.day },
      update: { cost: shippingCost.cost },
      create: shippingCost,
    });
  }

  console.log('Shipping costs seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
