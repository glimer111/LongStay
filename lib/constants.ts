export const CITIES = ['tbilisi', 'batumi', 'dubai'] as const;
export type City = (typeof CITIES)[number];

export const EXCURSIONS_LINKS: Record<City, string> = {
  tbilisi: 'https://tripster.tpk.lu/Sb8zaBUd',
  batumi: 'https://tripster.tpk.lu/Y4Rk4BEr',
  dubai: 'https://tripster.tpk.lu/AY8SvwZf',
};

export const SOCIAL_LINKS: Record<City, { instagram?: string; telegram?: string; tiktok?: string }> = {
  tbilisi: {
    instagram: 'https://www.instagram.com/tbilisi_long_stay',
    telegram: 'https://t.me/tbilisi_long_stay',
    tiktok: 'https://www.tiktok.com/@tbilisi.long.stay',
  },
  batumi: {
    instagram: 'https://www.instagram.com/batumi_long_stay',
  },
  dubai: {
    instagram: 'https://www.instagram.com/dubai_long_stay/',
    telegram: 'https://t.me/dubai_ls/',
    tiktok: 'https://www.tiktok.com/@dubai_long_stay',
  },
};

export const TELEGRAM_CONTACT = 'https://t.me/AnyaKompanits';
