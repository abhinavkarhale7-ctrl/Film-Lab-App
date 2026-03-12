import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@eternusfilmlab.com' },
    update: {},
    create: {
      email: 'admin@eternusfilmlab.com',
      passwordHash: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  // Create demo customer
  const customerPassword = await bcrypt.hash('customer123', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      passwordHash: customerPassword,
      name: 'Demo Customer',
      role: 'CUSTOMER',
    },
  });

  // Create sample services
  const services = [
    {
      name: 'Standard Scanning',
      description: '2000x3000 pixels - Perfect for social media and viewing',
      basePrice: 15,
      category: 'Scanning',
      active: true,
    },
    {
      name: 'High-Resolution Scanning',
      description: '3000x4500 pixels - Great for prints up to 8x10',
      basePrice: 25,
      category: 'Scanning',
      active: true,
    },
    {
      name: 'Professional Scanning',
      description: '4000x6000 pixels - Maximum quality for large prints',
      basePrice: 40,
      category: 'Scanning',
      active: true,
    },
    {
      name: 'Push/Pull Processing',
      description: 'Custom development adjustment',
      basePrice: 5,
      category: 'Processing',
      active: true,
    },
    {
      name: 'Rush Service',
      description: '24-hour turnaround',
      basePrice: 20,
      category: 'Service',
      active: true,
    },
  ];

  // Delete existing services to avoid duplicates
  await prisma.service.deleteMany({});

  // Create services
  for (const service of services) {
    await prisma.service.create({
      data: service,
    });
  }

  console.log('Database seeded successfully!');
  console.log('Admin credentials: admin@eternusfilmlab.com / admin123');
  console.log('Customer credentials: customer@example.com / customer123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
