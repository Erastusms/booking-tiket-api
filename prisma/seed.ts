import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Seed Station
  await prisma.station.createMany({
    data: [
      { name: 'Gambir', code: 'GMR', location: 'Jakarta' },
      { name: 'Pasar Senen', code: 'PSE', location: 'Jakarta' },
      { name: 'Bandung', code: 'BD', location: 'Bandung' },
      { name: 'Yogyakarta', code: 'YK', location: 'Yogyakarta' },
      { name: 'Solo Balapan', code: 'SLO', location: 'Surakarta' },
      { name: 'Surabaya Gubeng', code: 'SGU', location: 'Surabaya' },
      { name: 'Malang', code: 'ML', location: 'Malang' },
      { name: 'Semarang Tawang', code: 'SMT', location: 'Semarang' },
      { name: 'Cirebon', code: 'CN', location: 'Cirebon' },
      { name: 'Purwokerto', code: 'PWT', location: 'Purwokerto' },
    ],
  });

  // Seed Train
  await prisma.train.createMany({
    data: [
      { name: 'Argo Bromo Anggrek', code: 'ABA', capacity: 400 },
      { name: 'Taksaka', code: 'TSK', capacity: 350 },
      { name: 'Lodaya', code: 'LDY', capacity: 300 },
      { name: 'Gajayana', code: 'GJY', capacity: 320 },
      { name: 'Matarmaja', code: 'MTJ', capacity: 500 },
      { name: 'Argo Parahyangan', code: 'APY', capacity: 280 },
      { name: 'Bima', code: 'BIM', capacity: 370 },
      { name: 'Turangga', code: 'TRG', capacity: 340 },
      { name: 'Senja Utama', code: 'SJU', capacity: 310 },
      { name: 'Jayabaya', code: 'JBY', capacity: 360 },
    ],
  });

  console.log('✅ Seeding selesai!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
