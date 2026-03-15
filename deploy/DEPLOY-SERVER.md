# Деплой Long Stay на свой сервер (VPS) и настройка загрузок

Пошаговая настройка загрузки изображений на сервере без Vercel Blob.

---

## Выкладка изменений на сервер (обновление через Git)

Когда вы внесли изменения в коде и хотите обновить сайт на сервере:

**1. Локально (на своём компьютере): закоммитить и отправить в репозиторий**

```bash
cd "путь/к/Long Stay"
git add -A
git status   # проверьте список файлов
git commit -m "Описание изменений (например: Instagram embed, тень поста, выравнивание)"
git push origin main
```

(Замените `main` на имя вашей ветки, если используете другую.)

**2. На сервере: подтянуть код и пересобрать**

Сначала узнайте, где на сервере лежит проект и как называется процесс в PM2:

```bash
ssh root@ВАШ_IP

# Узнать каталог приложения (если не помните):
pm2 list
pm2 show <имя_процесса>   # в выводе смотрите cwd (рабочая директория)

# Или поиск по диску:
find /var /home /opt -name "package.json" -path "*long*" 2>/dev/null | head -5
```

Подставьте **реальный путь** к проекту вместо `APP_ROOT` в командах ниже:

```bash
cd APP_ROOT               # например: cd /var/www/longstay
git pull origin main
npm ci                    # или npm install
npm run build             # использует npx prisma generate
pm2 restart <имя_процесса>   # например: pm2 restart longstay
```

**Если на сервере мало RAM и `npm ci` завершается с "Killed":** установка оборвалась, `node_modules` неполный. Добавьте swap и переустановите зависимости:

```bash
# Один раз создать swap (если ещё нет):
sudo fallocate -l 1G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile

cd APP_ROOT
rm -rf node_modules
npm ci
npm run build
pm2 restart <имя_процесса>
```

Если папки проекта на сервере ещё нет — сначала клонируйте репозиторий в нужное место, настройте `.env`, выполните `npm ci`, `npm run build`, затем запустите приложение (например `pm2 start npm --name "long-stay" -- start`).

После этого сайт будет работать с новым кодом. Статьи и загрузки в `uploads/` при `git pull` не теряются, если вы не удаляете эти каталоги.

---

## Проверка: изменения не видны на сайте

Если после `git pull` и `pm2 restart` на сайте ничего не поменялось:

**1. Убедиться, что сборка прошла до конца**

На сервере:
```bash
cd /var/www/longstay
npm run build
```
Должно завершиться без ошибок, в конце — `Generating static pages` и сообщение о создании `.next`. Если была ошибка `prisma: not found` или `Killed` — см. блок выше (swap, `rm -rf node_modules`, `npm ci`).

**2. Проверить, что на сервере последний код**

```bash
cd /var/www/longstay
git log -1 --oneline
grep -l "getInstagramEmbedUrl" lib/embed.ts
```
Если файл найден и в `git log` последний коммит с вашими правками — код подтянут.

**3. Перезапустить приложение после успешного build**

```bash
pm2 restart longstay
pm2 logs longstay --lines 20
```
В логах не должно быть ошибок при старте.

**4. Сбросить кэш браузера**

Откройте сайт в режиме инкогнито или с принудительным обновлением (Ctrl+F5 / Cmd+Shift+R), чтобы не показывалась старая версия из кэша.

---

## Предполагается

- Ubuntu (или аналогичный Linux) с установленными Node.js, nginx, приложение уже развёрнуто (например в `/var/www/long-stay`) и запущено через `npm run start` или pm2.

## 1. Подключитесь по SSH

```bash
ssh root@ВАШ_IP
```

## 2. Узнайте каталог приложения

Если не знаете, где лежит проект:

```bash
# Если приложение запущено через pm2:
pm2 list
pm2 show long-stay   # или имя вашего процесса — в выводе будет cwd

# Или поиск:
find /var /home -name "package.json" -path "*long*" 2>/dev/null
```

Путь к проекту далее обозначим как `APP_ROOT` (например `/var/www/long-stay`).

## 3. Создайте каталог загрузок и права

**Вариант А — скрипт из репозитория**

Скопируйте на сервер файл `scripts/server-setup-uploads.sh` и выполните:

```bash
cd APP_ROOT
bash scripts/server-setup-uploads.sh /var/www/long-stay
```

(Замените `/var/www/long-stay` на ваш `APP_ROOT`.)

**Вариант Б — вручную**

```bash
APP_ROOT="/var/www/long-stay"   # замените на свой путь
mkdir -p "$APP_ROOT/uploads"
chown -R www-data:www-data "$APP_ROOT/uploads"
chmod 755 "$APP_ROOT/uploads"
```

Если приложение запущено от пользователя `node` или `ubuntu`, замените `www-data` на него:

```bash
chown -R node:node "$APP_ROOT/uploads"
```

## 4. Переменные окружения

В каталоге приложения откройте `.env` (или создайте из `.env.example`) и добавьте/проверьте:

```env
UPLOAD_DIR=/var/www/long-stay/uploads
UPLOAD_PUBLIC_BASE=/uploads
```

Путь в `UPLOAD_DIR` должен совпадать с каталогом, созданным в шаге 3. **Не** задавайте `BLOB_READ_WRITE_TOKEN` — тогда приложение будет сохранять файлы на диск.

## 5. Nginx: раздача `/uploads/`

Нужно, чтобы запросы к `https://ваш-домен/uploads/...` отдавали файлы из каталога загрузок, а не проксировались в Next.js.

Пример конфига: `deploy/nginx-long-stay-uploads.example.conf`. Основное:

- Замените `YOUR_DOMAIN` на ваш домен или IP.
- Убедитесь, что путь в `alias` совпадает с `UPLOAD_DIR` (например `/var/www/long-stay/uploads/`).

Установка конфига:

```bash
sudo cp deploy/nginx-long-stay-uploads.example.conf /etc/nginx/sites-available/long-stay
sudo ln -s /etc/nginx/sites-available/long-stay /etc/nginx/sites-enabled/
# Проверка и перезагрузка
sudo nginx -t && sudo systemctl reload nginx
```

Если у вас уже есть конфиг для сайта, просто добавьте в нужный `server` блок:

```nginx
location /uploads/ {
    alias /var/www/long-stay/uploads/;
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

И перезагрузите nginx: `sudo nginx -t && sudo systemctl reload nginx`.

## 6. Перезапуск приложения

Чтобы подхватить новые переменные окружения:

```bash
# Если через pm2:
pm2 restart long-stay

# Если через systemd:
sudo systemctl restart long-stay

# Если вручную — остановите процесс (Ctrl+C) и снова:
cd /var/www/long-stay && npm run start
```

## 7. Проверка

1. Зайдите в админку и создайте/редактируйте статью.
2. Загрузите изображение (обложка или в текст).
3. Убедитесь, что картинка открывается по адресу `https://ваш-домен/uploads/имя-файла.png`.

Если загрузка падает с ошибкой — проверьте права на каталог `UPLOAD_DIR` (процесс Node должен иметь право записи) и логи приложения (`pm2 logs` или `journalctl -u long-stay -f`).
