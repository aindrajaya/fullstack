import { prisma } from "../src/index";

async function main() {
  console.log("🌱 Mulai seeding...");

  // upsert = update jika ada, create jika belum ada
  // Dengan begini, seed bisa dijalankan berkali-kali tanpa error duplikasi
  await prisma.user.upsert({
    where:  { email: "admin@example.com" },
    update: {},
    create: { email: "admin@example.com", name: "Admin", role: "admin" },
  });

  await prisma.user.upsert({
    where:  { email: "budi@example.com" },
    update: {},
    create: { email: "budi@example.com", name: "Budi Santoso", role: "user" },
  });

  await prisma.user.upsert({
    where:  { email: "sari@example.com" },
    update: {},
    create: { email: "sari@example.com", name: "Sari Dewi", role: "user" },
  });

  const products = [
    { name: "Laptop Dell", description: "Laptop gaming 15 inch", price: 15000000, tax: 0.10, stock: 10 },
    { name: "Mouse Logitech", description: "Mouse wireless", price: 350000, tax: 0.10, stock: 50 },
    { name: "Keyboard Mechanical", description: "RGB Mechanical Keyboard", price: 1200000, tax: 0.10, stock: 30 },
    { name: "Monitor 4K", description: "Monitor 27 inch 4K", price: 3500000, tax: 0.10, stock: 15 },
    { name: "Webcam HD", description: "Webcam 1080p", price: 500000, tax: 0.10, stock: 25 },
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

  console.log("✅ Seeding selesai!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed gagal:", e);
    await prisma.$disconnect();
    process.exit(1);
  });