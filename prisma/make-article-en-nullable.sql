-- Запустите этот SQL один раз в консоли вашей продовой БД (Neon, Vercel Postgres и т.д.),
-- если при сохранении статьи без английской части появляется:
-- "Null constraint violation on the fields: ('titleEn')" или "('contentEn')".

ALTER TABLE "Article" ALTER COLUMN "titleEn" DROP NOT NULL;
ALTER TABLE "Article" ALTER COLUMN "contentEn" DROP NOT NULL;
