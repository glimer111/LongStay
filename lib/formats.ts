import type { City } from './constants';

export interface Format {
  id: string;
  nameRu: string;
  nameEn: string;
  price: string;
  contentRu: string;
  contentEn: string;
}

export const FORMATS: Format[] = [
  {
    id: '1',
    nameRu: 'Пост в Telegram',
    nameEn: 'Post in Telegram',
    price: '80 GEL',
    contentRu: 'Это отдельный рекламный пост о вашем бизнесе или мероприятии в нашем Телеграм.\n\nПлан работы в этом формате:\n1. Вы оплачиваете рекламную интеграцию и мы бронируем для вас время и дату размещения.\n2. Вы высылаете нам рекламный пост и фото/видео, которые нужно прикрепить к посту.\n3. Мы корректируем пост в нашем TOV, если это требуется, согласовываем с вами и публикуем в назначенное время.\n\nДополнительные возможности: закреп поста в шапке профиля — 50 GEL/сутки.\nУсловия: пост висит в канале без перекрытия другими постами, минимум, 1 час.\nСрок выполнения: по наличию свободных рекламных слотов. От 1 до 3 дней.',
    contentEn: 'A separate advertising post about your business or event in our Telegram.\n\nWork plan:\n1. You pay for the advertising integration and we book the time and date for you.\n2. You send us the advertising post and photos/videos to attach.\n3. We edit the post in our style if needed, coordinate with you and publish at the scheduled time.\n\nAdditional options: pin post in profile header — 50 GEL/day.\nTerms: post stays in channel without overlap, minimum 1 hour.\nDelivery: 1-3 days.',
  },
  {
    id: '2',
    nameRu: 'Размещение мероприятия в афише',
    nameEn: 'Event listing in the events guide',
    price: '55 GEL',
    contentRu: 'Афиша мероприятий публикуется раз в неделю, в четверг и охватывает мероприятия с пятницы по воскресенье включительно.\n\nПлан работы в этом формате:\n1. Вы оплачиваете рекламную интеграцию, и мы бронируем для вас слот на размещение в афише.\n2. Вы высылаете нам информацию о мероприятии: что, где, когда, сколько стоит и где можно купить билеты (если вход платный) + фото, которым можно иллюстрировать мероприятие.\n3. Мы оформляем карточку мероприятия в нашем шаблоне и согласовываем с вами. Публикуем во второй половине дня в четверг.\n\nДополнительные уточнения: если у вас несколько мероприятий на разные даты, то каждая дата оплачивается отдельно.',
    contentEn: 'Events guide is published once a week on Thursday, covering Friday to Sunday.\n\nWork plan:\n1. You pay for the integration, we book your slot.\n2. You send event info: what, where, when, price, tickets + photo.\n3. We create the event card, coordinate with you, publish Thursday afternoon.\n\nNote: multiple dates are paid separately.',
  },
  {
    id: '3',
    nameRu: 'Размещение в открывающем посте в ТГ',
    nameEn: 'Placement in opening post in Telegram',
    price: '20 GEL',
    contentRu: 'Размещение происходит в день проведения мероприятия. В первом, утреннем посте в Телеграм.\n\nПлан работы в этом формате:\n1. Вы оплачиваете рекламную интеграцию, и мы бронируем для вас время и дату размещения.\n2. Вы высылаете нам информацию о мероприятии: название мероприятия, место проведения, стоимость билетов, время начала, ссылку на покупку билетов или более подробный анонс в ваших соцсетях/на сайте.\n3. Мы публикуем эту информацию в посте в день проведения мероприятия.',
    contentEn: 'Placement on the day of the event. In the first, morning post in Telegram.\n\nWork plan:\n1. You pay, we book time and date.\n2. You send event info: name, venue, ticket price, start time, ticket link.\n3. We publish in the post on the event day.',
  },
  {
    id: '4',
    nameRu: 'Репост вашего готового поста/рилс в сторис',
    nameEn: 'Repost of your post/reels in stories',
    price: '85 GEL',
    contentRu: 'Формат подходит для быстрого увеличения охватов, привлечения новой аудитории и анонса мероприятий, акций и новостей вашего бизнеса.\n\nПлан работы в этом формате:\n1. Вы оплачиваете рекламную интеграцию, и мы бронируем для вас время и дату размещения.\n2. Вы высылаете нам ссылку на пост, который нужно репостнуть.\n3. Мы оформляем превью репоста и высылаем его вам на согласование. После этого публикуем в назначенную дату.\n\nУточнение: в сутки может быть до 5 размещений в таком формате.\nДополнительные возможности: индивидуальное рекламное размещение в сторис на сутки + 100 GEL.\nСрок выполнения: по наличию свободных рекламных слотов. От 1 до 3 дней.',
    contentEn: 'Suitable for quick reach increase, new audience, events and promotions.\n\nWork plan:\n1. You pay, we book.\n2. You send link to post to repost.\n3. We create preview, coordinate, publish.\n\nUp to 5 placements per day. Individual 24h placement + 100 GEL.\nDelivery: 1-3 days.',
  },
  {
    id: '5',
    nameRu: 'Включение вашего бизнеса в тематическую подборку',
    nameEn: 'Inclusion in thematic selection',
    price: '220 GEL',
    contentRu: 'Формат подходит для отелей, ресторанов, кафе, коворкингов, спортзалов и т.д. Для повышения узнаваемости и упоминания бизнеса.\n\nПлан работы в этом формате:\n1. Вы оплачиваете рекламную интеграцию, и мы бронируем для вас время и дату размещения.\n2. Мы согласовываем с вами тему подборки, которая подойдет для вашей ниши.\n3. Вы высылаете нам основную информацию о своем бизнесе + фото для карточки в подборке.\n4. Мы собираем и оформляем подборку. Согласовываем с вами финальный вид. Публикуем в назначенную дату.\n\nСрок выполнения: ≈ 5 рабочих дней.',
    contentEn: 'Suitable for hotels, restaurants, cafes, coworkings, gyms. For brand awareness.\n\nWork plan:\n1. You pay, we book.\n2. We agree on selection theme.\n3. You send business info + photos.\n4. We create selection, coordinate, publish.\n\nDelivery: ≈ 5 business days.',
  },
  {
    id: '6',
    nameRu: 'Серия рекламных сторис',
    nameEn: 'Series of advertising stories',
    price: '220 GEL',
    contentRu: 'Это 3-4 рекламных сторис, которые публикуются в формате сторителлинга в один день, друг за другом.\n\nПлан работы в этом формате:\n1. Вы оплачиваете рекламную интеграцию, мы бронируем дату и время размещения.\n2. Вы присылаете текст с основными тезисами + фото/видео для создания сторис.\n3. Мы готовим текстовый сценарий сторис и согласовываем его с вами.\n4. Оформляем сторис и отправляем вам на финальное согласование.\n5. Публикуем в назначенную дату.\n\nДополнительно: добавить сторис в серию — 1 шт. — 60 GEL.\nСрок выполнения: ≈ 3 рабочих дня после получения и согласования всей информации.',
    contentEn: '3-4 advertising stories published as storytelling in one day.\n\nWork plan:\n1. You pay, we book.\n2. You send key points + photos/videos.\n3. We create script, coordinate.\n4. We design stories, final approval.\n5. We publish.\n\nAdditional story: +60 GEL. Delivery: ≈ 3 business days.',
  },
  {
    id: '7',
    nameRu: 'Пост в Instagram в карточках',
    nameEn: 'Instagram post in carousel',
    price: '320 GEL',
    contentRu: 'Это пост в Инстаграм в формате карусели.\n\nПлан работы в этом формате:\n1. Вы оплачиваете рекламную интеграцию, мы бронируем дату и время размещения.\n2. Вы присылаете текст с тезисами + фото/видео для карточек. Важно: на фото и видео не должно быть текста.\n3. Мы готовим текст для карточек и согласовываем его с вами.\n4. Оформляем карточки и отправляем вам на финальное согласование.\n5. Публикуем в назначенную дату.\n\nСрок выполнения: ≈ 3 рабочих дня после получения и согласования всей информации. За срочность (день в день или на следующий день) + 100 GEL.',
    contentEn: 'Instagram post in carousel format.\n\nWork plan:\n1. You pay, we book.\n2. You send key points + photos/videos (no text on media).\n3. We create card text, coordinate.\n4. We design cards, final approval.\n5. We publish.\n\nDelivery: ≈ 3 business days. Rush + 100 GEL.',
  },
  {
    id: '8',
    nameRu: 'Reels в Instagram',
    nameEn: 'Reels in Instagram',
    price: '430 GEL',
    contentRu: 'Reels создается из ваших материалов.\n\nПлан работы в этом формате:\n1. Вы оплачиваете рекламную интеграцию, мы бронируем дату и время размещения.\n2. Вы присылаете тезисы о проекте для рекламы.\n3. Мы пишем сценарий рилс, прописываем нужные кадры и согласовываем. Важно: после согласования текста мы не сможем его изменить.\n4. Вы высылаете нужные кадры. Мы монтируем и озвучиваем. Высылаем вам на согласование.\n5. Публикуем в назначенную дату.\n\nДополнительно: съемка нашим рилс-мейкером +170 GEL.\nСрок выполнения: ≈ 5 рабочих дней после получения и согласования всей информации. За срочность + 200 GEL.',
    contentEn: 'Reels created from your materials.\n\nWork plan:\n1. You pay, we book.\n2. You send project key points.\n3. We write script, agree on shots. No changes after approval.\n4. You send footage. We edit and voice. Send for approval.\n5. We publish.\n\nAdditional: our reels-maker filming +170 GEL. Delivery: ≈ 5 days. Rush + 200 GEL.',
  },
  {
    id: '9',
    nameRu: 'Reels в формате «100 лари»',
    nameEn: 'Reels format «100 lari»',
    price: '300 GEL + 100 GEL депозит в заведении',
    contentRu: 'Формат доступен только ресторанам, кафе и барам. В этом формате наша редакция показывает, что можно купить на двоих в заведении на 100 GEL.\n\nПлан работы в этом формате:\n1. Вы оплачиваете рекламную интеграцию, мы бронируем для вас дату и время размещения. Согласовываем время съемки в заведении.\n2. Вы присылаете нам основные тезисы о заведении, которые вы хотите, чтобы мы подчеркнули в промо.\n3. Мы снимаем reels в заведении, делаем монтаж и озвучку. Важно: в этом формате мы не согласовываем финальный вариант с заказчиком. Делаем все в своем стиле, со своими впечатлениями.\n4. Публикуем пост в назначенную дату.\n\nДополнительные возможности: посмотреть готовый reels перед публикацией и внести правки — 300 GEL.\nСрок выполнения: ≈ 5 рабочих дней после съемки.',
    contentEn: 'Available for restaurants, cafes, bars only. We show what you can get for two for 100 GEL.\n\nWork plan:\n1. You pay, we book. Agree on filming time.\n2. You send key points about venue.\n3. We film reels on location, edit and voice. No final approval — our style.\n4. We publish.\n\nAdditional: preview and edits — 300 GEL. Delivery: ≈ 5 days after filming.',
  },
  {
    id: '10',
    nameRu: 'Reels в Instagram со съемкой нашим рилс-мейкером',
    nameEn: 'Reels in Instagram with our reels-maker filming',
    price: '600 GEL',
    contentRu: 'План работы в этом формате:\n1. Вы оплачиваете рекламную интеграцию, мы бронируем для вас дату и время размещения. Согласовываем время съемки в заведении.\n2. Вы присылаете нам основные тезисы о заведении, которые вы хотите, чтобы мы подчеркнули в промо.\n3. Мы снимаем reels в заведении, пишем рекламный сценарий и высылаем вам на согласование. Важно: после согласования сценария мы уже не сможем его изменить.\n4. Монтируем reels и высылаем вам на согласование.\n\nДополнительные возможности: получить весь отснятый материал + 100 GEL.\nСрок выполнения: ≈ 5 рабочих дней после съемки.',
    contentEn: 'Work plan:\n1. You pay, we book. Agree on filming time.\n2. You send key points about venue.\n3. We film reels, write script, send for approval. No changes after script approval.\n4. We edit, send for approval.\n\nAdditional: all raw footage + 100 GEL. Delivery: ≈ 5 days after filming.',
  },
  {
    id: '11',
    nameRu: 'Пакет: пост в карточках + серия сторис',
    nameEn: 'Package: carousel post + story series',
    price: '550 GEL',
    contentRu: 'План работы в этом формате:\n1. Вы оплачиваете рекламную интеграцию, мы бронируем для вас дату и время размещения.\n2. Вы присылаете нам основные тезисы, которые вы хотите, чтобы мы подчеркнули в промо + фото/видео, которые мы можем использовать для создания поста в карточках/серии сторис. Важно: фото и видео должны быть без текста.\n3. Мы пишем текст для карточек и серии сторис, высылаем вам на согласование.\n4. Делаем дизайн карточек и серии сторис, высылаем вам на согласование.\n5. Публикуем в назначенную дату.\n\nСрок выполнения: ≈ 5 рабочих дней после получения и согласования всей информации.',
    contentEn: 'Work plan:\n1. You pay, we book.\n2. You send key points + photos/videos (no text).\n3. We write text for cards and stories, coordinate.\n4. We design cards and stories, coordinate.\n5. We publish.\n\nDelivery: ≈ 5 business days.',
  },
  {
    id: '12',
    nameRu: 'Спецпредложение: пост в карточках + серия сторис + пост в ТГ',
    nameEn: 'Special: carousel post + story series + Telegram post',
    price: '590 GEL',
    contentRu: 'План работы в этом формате:\n1. Вы оплачиваете рекламную интеграцию, мы бронируем для вас дату и время размещения.\n2. Вы присылаете нам основные тезисы, которые вы хотите, чтобы мы подчеркнули в промо + фото/видео, которые мы можем использовать для создания поста в карточках/серии сторис и поста в ТГ. Важно: фото и видео должны быть без текста.\n3. Мы пишем текст для карточек, серии сторис и оформляем пост в Telegram, высылаем вам на согласование.\n4. Делаем дизайн карточек и серии сторис, высылаем вам на согласование.\n5. Публикуем в назначенную дату.\n\nСрок выполнения: ≈ 5 рабочих дней после получения и согласования всей информации.',
    contentEn: 'Work plan:\n1. You pay, we book.\n2. You send key points + photos/videos (no text).\n3. We create text for cards, stories and TG post, coordinate.\n4. We design cards and stories, coordinate.\n5. We publish.\n\nDelivery: ≈ 5 business days.',
  },
  {
    id: '13',
    nameRu: 'Дополнительные возможности',
    nameEn: 'Additional options',
    price: '',
    contentRu: 'Закреп рилс/поста в профиле.\nУточнение: важно, чтобы у вас было уже опубликованное промо в нашем аккаунте в формате reels или поста в карточках.\n\n300 GEL — закреп на неделю.\n500 GEL — закреп на месяц.\n\nИндивидуальное размещение для вашей ниши. Реклама только вашего бизнеса в определенной нише.\nСтоимость уточняйте в директ @AnyaKompanits в Telegram.',
    contentEn: 'Pin reels/post in profile.\nNote: you must have published promo in our account (reels or carousel).\n\n300 GEL — pin for a week.\n500 GEL — pin for a month.\n\nIndividual placement for your niche. Advertising only your business.\nPricing: contact @AnyaKompanits in Telegram.',
  },
];

const GEL_TO_AED = 2.2;

/** Dubai: только эти форматы, в этом порядке (1, 4, 5, 6, 7, 8, 10, 11, 12, 13), цены в USD */
const DUBAI_FORMAT_IDS = ['1', '4', '5', '6', '7', '8', '10', '11', '12', '13'] as const;

/** Batumi: только эти форматы, в этом порядке (4, 5, 6, 7, 8, 11, 13) */
const BATUMI_FORMAT_IDS = ['4', '5', '6', '7', '8', '11', '13'] as const;

const BATUMI_OVERRIDES: Partial<Record<string, { price: string; contentRu: string; contentEn: string }>> = {
  '4': {
    price: '30 GEL',
    contentRu: 'Формат подходит для быстрого увеличения охватов, привлечения новой аудитории и анонса мероприятий, акций и новостей вашего бизнеса.\n\nПлан работы в этом формате:\n1. Вы оплачиваете рекламную интеграцию, и мы бронируем для вас время и дату размещения.\n2. Вы высылаете нам ссылку на пост, который нужно репостнуть.\n3. Мы оформляем превью репоста и высылаем его вам на согласование. После этого публикуем в назначенную дату.\n\nУточнение: в сутки может быть до 5 размещений в таком формате.\nДополнительные возможности: индивидуальное рекламное размещение в сторис на сутки + 20 GEL.\nСрок выполнения: по наличию свободных рекламных слотов. От 1 до 3 дней.',
    contentEn: 'Suitable for quick reach increase, new audience, events and promotions.\n\nWork plan:\n1. You pay, we book.\n2. You send link to post to repost.\n3. We create preview, coordinate, publish.\n\nUp to 5 placements per day. Individual 24h placement + 20 GEL.\nDelivery: subject to availability. 1-3 days.',
  },
  '5': {
    price: '100 GEL',
    contentRu: 'Формат подходит для отелей, ресторанов, кафе, коворкингов, спортзалов и т.д. Для повышения узнаваемости и упоминания бизнеса.\n\nПлан работы в этом формате:\n1. Вы оплачиваете рекламную интеграцию, и мы бронируем для вас время и дату размещения.\n2. Мы согласовываем с вами тему подборки, которая подойдет для вашей ниши.\n3. Вы высылаете нам основную информацию о своем бизнесе + фото для карточки в подборке.\n4. Мы собираем и оформляем подборку. Согласовываем с вами финальный вид. Публикуем в назначенную дату.\n\nСрок выполнения: ≈ 5 рабочих дней после получения и согласования всей информации.',
    contentEn: 'Suitable for hotels, restaurants, cafes, coworkings, gyms. For brand awareness.\n\nWork plan:\n1. You pay, we book.\n2. We agree on selection theme.\n3. You send business info + photos.\n4. We create selection, coordinate, publish.\n\nDelivery: ≈ 5 business days after receiving and agreeing on all information.',
  },
  '6': {
    price: '80 GEL',
    contentRu: 'Это 3-4 рекламных сторис, которые публикуются в формате сторителлинга в один день, друг за другом.\n\nПлан работы в этом формате:\n1. Вы оплачиваете рекламную интеграцию, мы бронируем дату и время размещения.\n2. Вы присылаете текст с основными тезисами + фото/видео для создания сторис.\n3. Мы готовим текстовый сценарий сторис и согласовываем его с вами.\n4. Оформляем сторис и отправляем вам на финальное согласование.\n5. Публикуем в назначенную дату.\n\nДополнительно: добавить сторис в серию — 1 шт. — 20 GEL.\nСрок выполнения: ≈ 3 рабочих дня после получения и согласования всей информации.',
    contentEn: '3-4 advertising stories published as storytelling in one day.\n\nWork plan:\n1. You pay, we book.\n2. You send key points + photos/videos.\n3. We create script, coordinate.\n4. We design stories, final approval.\n5. We publish.\n\nAdditional story: +20 GEL. Delivery: ≈ 3 business days after receiving and agreeing on all information.',
  },
  '7': {
    price: '120 GEL',
    contentRu: 'Это пост в Инстаграм в формате карусели.\n\nПлан работы в этом формате:\n1. Вы оплачиваете рекламную интеграцию, мы бронируем дату и время размещения.\n2. Вы присылаете нам текст с основными тезисами о проекте, которые вы хотели бы, чтобы мы упомянули в рекламе, а также фото и/или видео для создания карточек. Важно: на фото и видео не должно быть текста.\n3. Мы готовим текст для карточек и согласовываем его с вами.\n4. Оформляем карточки и отправляем вам на финальное согласование.\n5. Публикуем в назначенную дату.\n\nСрок выполнения: 3 рабочих дня после получения и согласования всей информации. За срочность (день в день или на следующий день) + 100 GEL.',
    contentEn: 'Instagram post in carousel format.\n\nWork plan:\n1. You pay, we book.\n2. You send key points + photos/videos (no text on media).\n3. We create card text, coordinate.\n4. We design cards, final approval.\n5. We publish.\n\nDelivery: 3 business days. Rush + 100 GEL.',
  },
  '8': {
    price: '190 GEL',
    contentRu: 'В этом формате reels создается из ваших материалов.\n\nПлан работы в этом формате:\n1. Вы оплачиваете рекламную интеграцию, мы бронируем дату и время размещения.\n2. Вы присылаете нам текст с основными тезисами о проекте, которые вы хотели бы, чтобы мы упомянули в рекламе.\n3. Мы пишем сценарий рилс, где прописываем, какие кадры нам нужны, и согласовываем это с вами. Важно: после согласования текста мы уже не сможем его изменить.\n4. Вы высылаете нам нужные кадры. Мы монтируем и озвучиваем ролик. Высылаем вам на согласование.\n5. Публикуем пост в назначенную дату.\n\nСрок выполнения: 5 рабочих дней после получения и согласования всей информации. За срочность (день в день или на следующий день) + 200 GEL.',
    contentEn: 'Reels created from your materials.\n\nWork plan:\n1. You pay, we book.\n2. You send project key points.\n3. We write script, agree on shots. No changes after approval.\n4. You send footage. We edit and voice. Send for approval.\n5. We publish.\n\nDelivery: 5 business days. Rush + 200 GEL.',
  },
  '11': {
    price: '180 GEL',
    contentRu: 'План работы в этом формате:\n1. Вы оплачиваете рекламную интеграцию, мы бронируем для вас дату и время размещения.\n2. Вы присылаете нам основные тезисы, которые вы хотите, чтобы мы подчеркнули в промо + фото/видео, которые мы можем использовать для создания поста в карточках/серии сторис. Важно: фото и видео должны быть без текста.\n3. Мы пишем текст для карточек и серии сторис, высылаем вам на согласование.\n4. Делаем дизайн карточек и серии сторис, высылаем вам на согласование.\n5. Публикуем в назначенную дату.\n\nСрок выполнения: ≈ 5 рабочих дней после получения и согласования всей информации.',
    contentEn: 'Work plan:\n1. You pay, we book.\n2. You send key points + photos/videos (no text).\n3. We write text for cards and stories, coordinate.\n4. We design cards and stories, coordinate.\n5. We publish.\n\nDelivery: ≈ 5 business days after receiving and agreeing on all information.',
  },
  '13': {
    price: '',
    contentRu: 'Закреп рилс/поста в профиле.\nУточнение: важно, чтобы у вас было уже опубликованное промо в нашем аккаунте в формате reels или поста в карточках.\n\n80 GEL — закреп на неделю.\n200 GEL — закреп на месяц.\n\nИндивидуальное размещение для вашей ниши. Реклама только вашего бизнеса в определенной нише.\nСтоимость уточняйте в директ @AnyaKompanits в Telegram.',
    contentEn: 'Pin reels/post in profile.\nNote: you must have published promo in our account (reels or carousel).\n\n80 GEL — pin for a week.\n200 GEL — pin for a month.\n\nIndividual placement for your niche. Advertising only your business.\nPricing: contact @AnyaKompanits in Telegram.',
  },
};

/** Dubai: цены в USD ($), только 10 форматов */
const DUBAI_OVERRIDES: Partial<Record<string, { price: string; contentRu: string; contentEn: string }>> = {
  '1': {
    price: '$20',
    contentRu: 'Это отдельный рекламный пост о вашем бизнесе или мероприятии в нашем Телеграм.\n\nПлан работы в этом формате:\n1. Вы оплачиваете рекламную интеграцию и мы бронируем для вас время и дату размещения.\n2. Вы высылаете нам рекламный пост и фото/видео, которые нужно прикрепить к посту.\n3. Мы корректируем пост в нашем TOV, если это требуется, согласовываем с вами и публикуем в назначенное время.\n\nДополнительные возможности: закреп поста в шапке профиля — $10/сутки.\nУсловия: пост висит в канале без перекрытия другими постами, минимум, 1 час.\nСрок выполнения: по наличию свободных рекламных слотов. От 1 до 3 дней.',
    contentEn: 'A separate advertising post about your business or event in our Telegram.\n\nWork plan:\n1. You pay for the advertising integration and we book the time and date for you.\n2. You send us the advertising post and photos/videos to attach.\n3. We edit the post in our style if needed, coordinate with you and publish at the scheduled time.\n\nAdditional options: pin post in profile header — $10/day.\nTerms: post stays in channel without overlap, minimum 1 hour.\nDelivery: 1-3 days.',
  },
  '4': {
    price: '$50',
    contentRu: 'Формат подходит для быстрого увеличения охватов, привлечения новой аудитории и анонса мероприятий, акций и новостей вашего бизнеса.\n\nПлан работы в этом формате:\n1. Вы оплачиваете рекламную интеграцию, и мы бронируем для вас время и дату размещения.\n2. Вы высылаете нам ссылку на пост, который нужно репостнуть.\n3. Мы оформляем превью репоста и высылаем его вам на согласование. После этого публикуем в назначенную дату.\n\nУточнение: в сутки может быть до 5 размещений в таком формате.\nДополнительные возможности: индивидуальное рекламное размещение в сторис на сутки + $20.\nСрок выполнения: по наличию свободных рекламных слотов. От 1 до 3 дней.',
    contentEn: 'Suitable for quick reach increase, new audience, events and promotions.\n\nWork plan:\n1. You pay, we book.\n2. You send link to post to repost.\n3. We create preview, coordinate, publish.\n\nUp to 5 placements per day. Individual 24h placement + $20.\nDelivery: 1-3 days.',
  },
  '5': {
    price: '$80',
    contentRu: 'Формат подходит для отелей, ресторанов, кафе, коворкингов, спортзалов и т.д. Для повышения узнаваемости и упоминания бизнеса.\n\nПлан работы в этом формате:\n1. Вы оплачиваете рекламную интеграцию, и мы бронируем для вас время и дату размещения.\n2. Мы согласовываем с вами тему подборки, которая подойдет для вашей ниши.\n3. Вы высылаете нам основную информацию о своем бизнесе + фото для карточки в подборке.\n4. Мы собираем и оформляем подборку. Согласовываем с вами финальный вид. Публикуем в назначенную дату.\n\nСрок выполнения: ≈ 5 рабочих дней после получения и согласования всей информации.',
    contentEn: 'Suitable for hotels, restaurants, cafes, coworkings, gyms. For brand awareness.\n\nWork plan:\n1. You pay, we book.\n2. We agree on selection theme.\n3. You send business info + photos.\n4. We create selection, coordinate, publish.\n\nDelivery: ≈ 5 business days after receiving and agreeing on all information.',
  },
  '6': {
    price: '$90',
    contentRu: 'Это 3-4 рекламных сторис, которые публикуются в формате сторителлинга в один день, друг за другом.\n\nПлан работы в этом формате:\n1. Вы оплачиваете рекламную интеграцию, мы бронируем дату и время размещения.\n2. Вы присылаете текст с основными тезисами + фото/видео для создания сторис.\n3. Мы готовим текстовый сценарий сторис и согласовываем его с вами.\n4. Оформляем сторис и отправляем вам на финальное согласование.\n5. Публикуем в назначенную дату.\n\nДополнительно: добавить сторис в серию — 1 шт. — $20.\nСрок выполнения: ≈ 3 рабочих дня после получения и согласования всей информации.',
    contentEn: '3-4 advertising stories published as storytelling in one day.\n\nWork plan:\n1. You pay, we book.\n2. You send key points + photos/videos.\n3. We create script, coordinate.\n4. We design stories, final approval.\n5. We publish.\n\nAdditional story: +$20. Delivery: ≈ 3 business days after receiving and agreeing on all information.',
  },
  '7': {
    price: '$120',
    contentRu: 'Это пост в Инстаграм в формате карусели.\n\nПлан работы в этом формате:\n1. Вы оплачиваете рекламную интеграцию, мы бронируем дату и время размещения.\n2. Вы присылаете текст с тезисами + фото/видео для карточек. Важно: на фото и видео не должно быть текста.\n3. Мы готовим текст для карточек и согласовываем его с вами.\n4. Оформляем карточки и отправляем вам на финальное согласование.\n5. Публикуем в назначенную дату.\n\nСрок выполнения: ≈ 3 рабочих дня после получения и согласования всей информации. За срочность (день в день или на следующий день) + $50.',
    contentEn: 'Instagram post in carousel format.\n\nWork plan:\n1. You pay, we book.\n2. You send key points + photos/videos (no text on media).\n3. We create card text, coordinate.\n4. We design cards, final approval.\n5. We publish.\n\nDelivery: ≈ 3 business days. Rush + $50.',
  },
  '8': {
    price: '$190',
    contentRu: 'Reels создается из ваших материалов.\n\nПлан работы в этом формате:\n1. Вы оплачиваете рекламную интеграцию, мы бронируем дату и время размещения.\n2. Вы присылаете тезисы о проекте для рекламы.\n3. Мы пишем сценарий рилс, прописываем нужные кадры и согласовываем. Важно: после согласования текста мы не сможем его изменить.\n4. Вы высылаете нужные кадры. Мы монтируем и озвучиваем. Высылаем вам на согласование.\n5. Публикуем в назначенную дату.\n\nДополнительно: съемка нашим рилс-мейкером +$80.\nСрок выполнения: ≈ 5 рабочих дней после получения и согласования всей информации. За срочность + $100.',
    contentEn: 'Reels created from your materials.\n\nWork plan:\n1. You pay, we book.\n2. You send project key points.\n3. We write script, agree on shots. No changes after approval.\n4. You send footage. We edit and voice. Send for approval.\n5. We publish.\n\nAdditional: our reels-maker filming +$80. Delivery: ≈ 5 days. Rush + $100.',
  },
  '10': {
    price: '$300',
    contentRu: 'План работы в этом формате:\n1. Вы оплачиваете рекламную интеграцию, мы бронируем для вас дату и время размещения. Согласовываем время съемки в заведении.\n2. Вы присылаете нам основные тезисы о заведении, которые вы хотите, чтобы мы подчеркнули в промо.\n3. Мы снимаем reels в заведении, пишем рекламный сценарий и высылаем вам на согласование. Важно: после согласования сценария мы уже не сможем его изменить.\n4. Монтируем reels и высылаем вам на согласование.\n\nДополнительные возможности: получить весь отснятый материал + $50.\nСрок выполнения: ≈ 5 рабочих дней после съемки.',
    contentEn: 'Work plan:\n1. You pay, we book. Agree on filming time.\n2. You send key points about venue.\n3. We film reels, write script, send for approval. No changes after script approval.\n4. We edit, send for approval.\n\nAdditional: all raw footage + $50. Delivery: ≈ 5 days after filming.',
  },
  '11': {
    price: '$200',
    contentRu: 'План работы в этом формате:\n1. Вы оплачиваете рекламную интеграцию, мы бронируем для вас дату и время размещения.\n2. Вы присылаете нам основные тезисы, которые вы хотите, чтобы мы подчеркнули в промо + фото/видео, которые мы можем использовать для создания поста в карточках/серии сторис. Важно: фото и видео должны быть без текста.\n3. Мы пишем текст для карточек и серии сторис, высылаем вам на согласование.\n4. Делаем дизайн карточек и серии сторис, высылаем вам на согласование.\n5. Публикуем в назначенную дату.\n\nСрок выполнения: ≈ 5 рабочих дней после получения и согласования всей информации.',
    contentEn: 'Work plan:\n1. You pay, we book.\n2. You send key points + photos/videos (no text).\n3. We write text for cards and stories, coordinate.\n4. We design cards and stories, coordinate.\n5. We publish.\n\nDelivery: ≈ 5 business days after receiving and agreeing on all information.',
  },
  '12': {
    price: '$220',
    contentRu: 'План работы в этом формате:\n1. Вы оплачиваете рекламную интеграцию, мы бронируем для вас дату и время размещения.\n2. Вы присылаете нам основные тезисы, которые вы хотите, чтобы мы подчеркнули в промо + фото/видео, которые мы можем использовать для создания поста в карточках/серии сторис и поста в ТГ. Важно: фото и видео должны быть без текста.\n3. Мы пишем текст для карточек, серии сторис и оформляем пост в Telegram, высылаем вам на согласование.\n4. Делаем дизайн карточек и серии сторис, высылаем вам на согласование.\n5. Публикуем в назначенную дату.\n\nСрок выполнения: ≈ 5 рабочих дней после получения и согласования всей информации.',
    contentEn: 'Work plan:\n1. You pay, we book.\n2. You send key points + photos/videos (no text).\n3. We create text for cards, stories and TG post, coordinate.\n4. We design cards and stories, coordinate.\n5. We publish.\n\nDelivery: ≈ 5 business days after receiving and agreeing on all information.',
  },
  '13': {
    price: '',
    contentRu: 'Закреп рилс/поста в профиле.\nУточнение: важно, чтобы у вас было уже опубликованное промо в нашем аккаунте в формате reels или поста в карточках.\n\n$100 — закреп на неделю.\n$250 — закреп на месяц.\n\nИндивидуальное размещение для вашей ниши. Реклама только вашего бизнеса в определенной нише.\nСтоимость уточняйте в директ @AnyaKompanits в Telegram.',
    contentEn: 'Pin reels/post in profile.\nNote: you must have published promo in our account (reels or carousel).\n\n$100 — pin for a week.\n$250 — pin for a month.\n\nIndividual placement for your niche. Advertising only your business.\nPricing: contact @AnyaKompanits in Telegram.',
  },
};

function formatPriceForCity(priceStr: string, city: City): string {
  if (!priceStr.trim()) return priceStr;
  if (city === 'tbilisi') return priceStr;
  if (city === 'batumi') return priceStr; // Batumi uses overrides
  if (city === 'dubai') {
    return priceStr
      .replace(/(\d+)\s*GEL/g, (_, n) => `${Math.round(Number(n) * GEL_TO_AED)} AED`)
      .replace(/GEL/g, 'AED');
  }
  return priceStr;
}

function formatContentForCity(text: string, city: City): string {
  if (city === 'dubai') {
    return text
      .replace(/(\d+)\s*GEL/g, (_, n) => `${Math.round(Number(n) * GEL_TO_AED)} AED`)
      .replace(/GEL/g, 'AED');
  }
  return text;
}

export function getFormatsForCity(city: City): Format[] {
  if (city === 'batumi') {
    const byId = new Map(FORMATS.map((f) => [f.id, f]));
    return BATUMI_FORMAT_IDS.map((id) => {
      const base = byId.get(id);
      if (!base) return null;
      const over = BATUMI_OVERRIDES[id];
      if (!over) return { ...base };
      return {
        ...base,
        price: over.price,
        contentRu: over.contentRu,
        contentEn: over.contentEn,
      };
    }).filter((f): f is Format => f !== null);
  }

  if (city === 'dubai') {
    const byId = new Map(FORMATS.map((f) => [f.id, f]));
    return DUBAI_FORMAT_IDS.map((id) => {
      const base = byId.get(id);
      if (!base) return null;
      const over = DUBAI_OVERRIDES[id];
      if (!over) return { ...base };
      return {
        ...base,
        price: over.price,
        contentRu: over.contentRu,
        contentEn: over.contentEn,
      };
    }).filter((f): f is Format => f !== null);
  }

  return FORMATS.map((f) => ({
    ...f,
    price: formatPriceForCity(f.price, city),
    contentRu: formatContentForCity(f.contentRu, city),
    contentEn: formatContentForCity(f.contentEn, city),
  }));
}
