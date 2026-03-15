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

```bash
ssh root@ВАШ_IP
cd /var/www/long-stay   # или ваш APP_ROOT
git pull origin main
npm ci                   # установить зависимости (или npm install)
npm run build            # prisma generate + next build
pm2 restart long-stay    # или как у вас называется процесс
```

После этого сайт будет работать с новым кодом. Статьи и загрузки в `uploads/` при `git pull` не теряются, если вы не удаляете эти каталоги и они не в .gitignore с удалением.

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
