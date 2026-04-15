import { prisma } from "../src/index";

async function main() {
  console.log("Starting database seed...");

  // Upsert updates existing rows and creates missing ones,
  // so the seed can be run repeatedly without duplicate errors.
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: { email: "admin@example.com", name: "Admin", role: "ADMIN" },
  });

  await prisma.user.upsert({
    where: { email: "albert@example.com" },
    update: {},
    create: { email: "albert@example.com", name: "Albert Conseca", role: "USER" },
  });

  await prisma.user.upsert({
    where: { email: "john@example.com" },
    update: {},
    create: { email: "john@example.com", name: "John Watch", role: "USER" },
  });

  const products = [
    {
      name: "Espresso Blend 250g",
      description: "Medium-dark house blend for espresso with chocolate and caramel notes",
      price: 95000,
      tax: 0.1,
      stock: 80,
    },
    {
      name: "Single Origin Gayo 200g",
      description: "Light-medium roast Gayo arabica with citrus, floral, and clean finish notes",
      price: 110000,
      tax: 0.1,
      stock: 60,
    },
    {
      name: "Cold Brew Bottle 1L",
      description: "Ready-to-drink cold brew with a light body and chocolate finish",
      price: 48000,
      tax: 0.1,
      stock: 40,
    },
    {
      name: "Cafe Latte 16 oz",
      description: "Creamy milk-based espresso drink for the everyday coffee bar menu",
      price: 38000,
      tax: 0.1,
      stock: 75,
    },
    {
      name: "Manual Brew Starter Kit",
      description: "V60 dripper set with paper filters, server, and scoop for manual brewing",
      price: 325000,
      tax: 0.1,
      stock: 18,
    },
  ];

  for (const product of products) {
    const existingProduct = await prisma.product.findFirst({
      where: { name: product.name },
      select: { id: true },
    });

    if (existingProduct) {
      await prisma.product.update({
        where: { id: existingProduct.id },
        data: product,
      });
      continue;
    }

    await prisma.product.create({
      data: product,
    });
  }

  console.log("Database seed completed.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seed failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });