export const CITIES = ['tbilisi', 'batumi', 'dubai'] as const;
export type City = (typeof CITIES)[number];

export const EXCURSIONS_LINKS: Record<City, string> = {
  tbilisi: 'https://tripster.tpk.lu/Sb8zaBUd',
  batumi: 'https://tripster.tpk.lu/Y4Rk4BEr',
  dubai: 'https://tripster.tpk.lu/AY8SvwZf',
};

export interface UsefulCard {
  titleRu: string;
  titleEn: string;
  excerptRu: string;
  excerptEn: string;
  url: string;
  /** Обложка: путь из public, например /images/useful/tbilisi1.jpg */
  imageUrl?: string;
}

export const USEFUL_CARDS: Record<City, UsefulCard[]> = {
  tbilisi: [
    {
      titleRu: 'Экскурсии из\u00A0Тбилиси',
      titleEn: 'Tours from Tbilisi',
      excerptRu: 'Лучшие экскурсии из\u00A0Тбилиси: прогулки по\u00A0Старому городу, поездки в\u00A0Казбеги, Кахетию, Мцхету, Боржоми и\u00A0другие красивые места Грузии.',
      excerptEn: 'Best tours from Tbilisi: Old Town walks, trips to Kazbegi, Kakheti, Mtskheta, Borjomi and other beautiful places in Georgia.',
      url: 'https://tripster.tpk.lu/DBlmwYYY',
      imageUrl: '/images/useful/tbilisi1.jpg',
    },
    {
      titleRu: 'Аренда авто в\u00A0Тбилиси',
      titleEn: 'Car rental in Tbilisi',
      excerptRu: 'Ищете аренду авто в\u00A0Тбилиси? Здесь сотни вариантов: от бюджетных автомобилей для города до внедорожников для поездок в\u00A0горы.',
      excerptEn: 'Looking for car rental in Tbilisi? Hundreds of options: from budget city cars to SUVs for mountain trips.',
      url: 'https://localrent.tpk.lu/SLLrsPXC',
      imageUrl: '/images/useful/card2.jpg',
    },
    {
      titleRu: 'Отели в\u00A0Тбилиси\nи\u00A0по\u00A0всей Грузии',
      titleEn: 'Hotels in Tbilisi and across Georgia',
      excerptRu: 'Ищете лучшие отели в\u00A0Тбилиси и\u00A0Грузии? На\u00A0Tripadvisor удобно сравнивать варианты размещения, читать реальные отзывы туристов и\u00A0находить выгодные предложения.',
      excerptEn: 'Looking for the best hotels in Tbilisi and Georgia? Compare options, read reviews and find great deals on Tripadvisor.',
      url: 'https://tripadvisor.tpk.lu/39z3gb5f',
      imageUrl: '/images/useful/card3.jpg',
    },
    {
      titleRu: 'Универсальная SIM-карта для путешествий',
      titleEn: 'Universal travel SIM card',
      excerptRu: 'Drimsim работает в\u00A0229 странах, подключается сразу после прилёта и\u00A0помогает пользоваться мобильным интернетом, звонками и\u00A0сообщениями по\u00A0выгодным тарифам.',
      excerptEn: 'Drimsim works in 229 countries, connects right after arrival and offers mobile internet, calls and messaging at good rates.',
      url: 'https://drimsim.tpk.lu/EC0H8v8r',
      imageUrl: '/images/useful/card4.jpg',
    },
    {
      titleRu: 'Проверенные хостелы в\u00A0Тбилиси',
      titleEn: 'Verified hostels in Tbilisi',
      excerptRu: 'Найдите лучшее бюджетное жильё в\u00A0центре города и\u00A0других популярных районах, сравните цены, читайте отзывы путешественников и\u00A0выбирайте подходящий вариант для\u00A0поездки.',
      excerptEn: 'Find the best budget accommodation in the city center and popular areas, compare prices and read traveler reviews.',
      url: 'https://hostelworld.tpk.lu/nsd0O8CU',
      imageUrl: '/images/useful/card5.jpg',
    },
    {
      titleRu: 'Аудиогиды и\u00A0билеты в\u00A0музеи Тбилиси',
      titleEn: 'Audioguides and museum tickets in Tbilisi',
      excerptRu: 'Находите аудиоэкскурсии, билеты и\u00A0интересные маршруты для\u00A0самостоятельных путешествий.',
      excerptEn: 'Find audio tours, tickets and interesting routes for independent travel.',
      url: 'https://wegotrip.tpk.lu/Q6lb73m9',
      imageUrl: '/images/useful/card6.jpg',
    },
  ],
  batumi: [
    {
      titleRu: 'Экскурсии из\u00A0Батуми',
      titleEn: 'Tours from Batumi',
      excerptRu: 'Лучшие экскурсии из\u00A0Батуми: прогулки по\u00A0городу, поездки в\u00A0горную Аджарию, национальные парки, водопады и\u00A0другие красивые места Грузии.',
      excerptEn: 'Best tours from Batumi: city walks, trips to mountainous Adjara, national parks, waterfalls and other beautiful places in Georgia.',
      url: 'https://tripster.tpk.lu/8kXShQyF',
      imageUrl: '/images/useful/batumi1.jpg',
    },
    {
      titleRu: 'Аренда авто в\u00A0Батуми',
      titleEn: 'Car rental in Batumi',
      excerptRu: 'Ищете аренду авто в\u00A0Батуми? Здесь сотни вариантов: от компактных машин для города до внедорожников для поездок по\u00A0Аджарии и\u00A0горам.',
      excerptEn: 'Looking for car rental in Batumi? Hundreds of options: from compact city cars to SUVs for Adjara and the mountains.',
      url: 'https://localrent.tpk.lu/I8yqBkPV',
      imageUrl: '/images/useful/card2.jpg',
    },
    {
      titleRu: 'Отели в\u00A0Батуми\nи\u00A0по\u00A0всей Грузии',
      titleEn: 'Hotels in Batumi and across Georgia',
      excerptRu: 'Ищете лучшие отели в\u00A0Батуми и\u00A0Грузии? На\u00A0Tripadvisor удобно сравнивать варианты размещения, читать реальные отзывы туристов и\u00A0находить выгодные предложения.',
      excerptEn: 'Looking for the best hotels in Batumi and Georgia? Compare options, read reviews and find great deals on Tripadvisor.',
      url: 'https://tripadvisor.tpk.lu/3I7Fr8H1',
      imageUrl: '/images/useful/card3.jpg',
    },
    {
      titleRu: 'Универсальная SIM-карта для путешествий',
      titleEn: 'Universal travel SIM card',
      excerptRu: 'Drimsim работает в\u00A0229 странах, подключается сразу после прилёта и\u00A0помогает пользоваться мобильным интернетом, звонками и\u00A0сообщениями по\u00A0выгодным тарифам.',
      excerptEn: 'Drimsim works in 229 countries, connects right after arrival and offers mobile internet, calls and messaging at good rates.',
      url: 'https://drimsim.tpk.lu/EC0H8v8r',
      imageUrl: '/images/useful/card4.jpg',
    },
    {
      titleRu: 'Проверенные хостелы в\u00A0Батуми',
      titleEn: 'Verified hostels in Batumi',
      excerptRu: 'Найдите лучшее бюджетное жильё в\u00A0центре Батуми и\u00A0других популярных районах, сравните цены, читайте отзывы путешественников и\u00A0выбирайте подходящий вариант для\u00A0поездки.',
      excerptEn: 'Find the best budget accommodation in central Batumi and popular areas, compare prices and read traveler reviews.',
      url: 'https://hostelworld.tpk.lu/nsd0O8CU',
      imageUrl: '/images/useful/card5.jpg',
    },
    {
      titleRu: 'Аудиогиды и\u00A0билеты в\u00A0музеи Батуми',
      titleEn: 'Audioguides and museum tickets in Batumi',
      excerptRu: 'Находите аудиоэкскурсии, билеты и\u00A0интересные маршруты для\u00A0самостоятельных путешествий по\u00A0Батуми и\u00A0окрестностям.',
      excerptEn: 'Find audio tours, tickets and interesting routes for independent travel in Batumi and the region.',
      url: 'https://wegotrip.tpk.lu/SKYwZh7K',
      imageUrl: '/images/useful/card6.jpg',
    },
  ],
  dubai: [
    {
      titleRu: 'Экскурсии в\u00A0Дубае',
      titleEn: 'Tours in Dubai',
      excerptRu: 'Лучшие экскурсии в\u00A0Дубае: прогулки по\u00A0городу, поездки в\u00A0пустыню, круизы, сафари, посещение смотровых площадок и\u00A0билеты на достопримечательности.',
      excerptEn: 'Best tours in Dubai: city walks, desert trips, cruises, safari, viewpoints and attraction tickets.',
      url: 'https://tripster.tpk.lu/AY8SvwZf',
      imageUrl: '/images/useful/Dubai1.jpg',
    },
    {
      titleRu: 'Аренда авто в\u00A0Дубае',
      titleEn: 'Car rental in Dubai',
      excerptRu: 'Ищете аренду авто в\u00A0Дубае? Здесь сотни вариантов: от бюджетных автомобилей для города до премиальных моделей и\u00A0внедорожников для комфортных поездок по\u00A0ОАЭ.',
      excerptEn: 'Looking for car rental in Dubai? Hundreds of options: from budget city cars to premium and SUVs for comfortable trips across the UAE.',
      url: 'https://localrent.tpk.lu/PVYRPOAP',
      imageUrl: '/images/useful/Dubai2.jpg',
    },
    {
      titleRu: 'Отели в\u00A0Дубае\nи\u00A0по\u00A0всему ОАЭ',
      titleEn: 'Hotels in Dubai and across the UAE',
      excerptRu: 'Ищете лучшие отели в\u00A0Дубае и\u00A0ОАЭ? На\u00A0Tripadvisor удобно сравнивать варианты размещения, читать реальные отзывы туристов и\u00A0находить выгодные предложения.',
      excerptEn: 'Looking for the best hotels in Dubai and the UAE? Compare options, read reviews and find great deals on Tripadvisor.',
      url: 'https://tripadvisor.tpk.lu/gTTP9IJL',
      imageUrl: '/images/useful/Dubai3.jpg',
    },
    {
      titleRu: 'Универсальная SIM-карта для путешествий',
      titleEn: 'Universal travel SIM card',
      excerptRu: 'Drimsim работает в\u00A0229 странах, подключается сразу после прилёта и\u00A0помогает пользоваться мобильным интернетом, звонками и\u00A0сообщениями по\u00A0выгодным тарифам.',
      excerptEn: 'Drimsim works in 229 countries, connects right after arrival and offers mobile internet, calls and messaging at good rates.',
      url: 'https://drimsim.tpk.lu/EC0H8v8r',
      imageUrl: '/images/useful/Dubai4.jpg',
    },
    {
      titleRu: 'Проверенные хостелы в\u00A0Дубае',
      titleEn: 'Verified hostels in Dubai',
      excerptRu: 'Найдите лучшее бюджетное жильё в\u00A0Дубае и\u00A0популярных районах города, сравните цены, читайте отзывы путешественников и\u00A0выбирайте подходящий вариант для\u00A0поездки.',
      excerptEn: 'Find the best budget accommodation in Dubai and popular areas, compare prices and read traveler reviews.',
      url: 'https://hostelworld.tpk.lu/nsd0O8CU',
      imageUrl: '/images/useful/Dubai5.jpg',
    },
    {
      titleRu: 'Аудиогиды и\u00A0билеты в\u00A0музеи Дубая',
      titleEn: 'Audioguides and museum tickets in Dubai',
      excerptRu: 'Находите аудиоэкскурсии, билеты и\u00A0интересные маршруты для\u00A0самостоятельных путешествий по\u00A0Дубаю и\u00A0другим эмиратам.',
      excerptEn: 'Find audio tours, tickets and interesting routes for independent travel in Dubai and other emirates.',
      url: 'https://wegotrip.tpk.lu/Q6lb73m9',
      imageUrl: '/images/useful/card6.jpg',
    },
  ],
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
