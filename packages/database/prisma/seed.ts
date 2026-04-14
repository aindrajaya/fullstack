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