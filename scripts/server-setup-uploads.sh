#!/bin/bash
# Настройка каталога загрузок для Long Stay на своём сервере.
# Запуск на сервере: bash server-setup-uploads.sh [/путь/к/приложению]
# Пример: bash server-setup-uploads.sh /var/www/long-stay

set -e
APP_ROOT="${1:-/var/www/long-stay}"
UPLOADS_DIR="${APP_ROOT}/uploads"

echo "=== Long Stay: настройка загрузок ==="
echo "Каталог приложения: $APP_ROOT"
echo "Каталог загрузок:   $UPLOADS_DIR"
echo ""

# Создаём каталог приложения и uploads
mkdir -p "$UPLOADS_DIR"
chown -R www-data:www-data "$UPLOADS_DIR" 2>/dev/null || true
chmod 755 "$UPLOADS_DIR"

# Если приложение крутится от другого пользователя (node, ubuntu) — укажите его:
# chown -R node:node "$UPLOADS_DIR"
# Или оставьте 755 и владельца root, тогда процесс Node должен иметь доступ (если запущен от root).

echo "Каталог создан: $UPLOADS_DIR"
echo ""
echo "Добавьте в .env приложения (в каталоге $APP_ROOT):"
echo "---"
echo "UPLOAD_DIR=$UPLOADS_DIR"
echo "UPLOAD_PUBLIC_BASE=/uploads"
echo "---"
echo ""
echo "Настройте nginx: location /uploads/ -> alias $UPLOADS_DIR/;"
echo "После изменений перезапустите приложение и nginx (systemctl reload nginx)."
