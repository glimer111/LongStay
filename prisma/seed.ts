import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { EXCURSIONS_LINKS } from '../lib/constants';

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@longstay.com' },
    update: {},
    create: {
      email: 'admin@longstay.com',
      password: hash,
      name: 'Admin',
      role: 'admin',
    },
  });

  const cities = ['tbilisi', 'batumi', 'dubai'] as const;
  const defaultCategories = [
    { slug: 'interesting', nameRu: 'Это интересно', nameEn: 'Interesting' },
    { slug: 'useful', nameRu: 'Полезное', nameEn: 'Useful' },
    { slug: 'places', nameRu: 'Места', nameEn: 'Places' },
    { slug: 'all', nameRu: 'Все материалы', nameEn: 'All materials' },
    { slug: 'food', nameRu: 'Еда', nameEn: 'Food' },
    { slug: 'shopping', nameRu: 'Шопинг', nameEn: 'Shopping' },
    { slug: 'events', nameRu: 'Мероприятия', nameEn: 'Events' },
    { slug: 'excursions', nameRu: 'Экскурсии', nameEn: 'Excursions' },
  ];

  for (const city of cities) {
    for (const cat of defaultCategories) {
      const externalUrl = cat.slug === 'excursions' ? EXCURSIONS_LINKS[city] : null;
      await prisma.category.upsert({
        where: { slug_city: { slug: cat.slug, city } },
        update: { externalUrl },
        create: {
          slug: cat.slug,
          nameRu: cat.nameRu,
          nameEn: cat.nameEn,
          city,
          externalUrl,
        },
      });
    }
  }

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
