# Настройка переменных окружения

Создайте файл `.env` в папке backend со следующим содержимым:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=tinder_app

# ЮMoney Configuration
YOOMONEY_SHOP_ID=test_shop_id
YOOMONEY_SECRET_KEY=test_secret_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_here_very_long_and_secure
JWT_EXPIRES_IN=7d

# App Configuration
PORT=3001
NODE_ENV=development
```

## Настройка PostgreSQL

1. Установите PostgreSQL на вашу систему
2. Создайте базу данных:
   ```sql
   CREATE DATABASE tinder_app;
   ```
3. Обновите настройки подключения в файле `.env`

## Настройка ЮMoney

1. Зарегистрируйтесь в ЮMoney для разработчиков
2. Получите Shop ID и Secret Key
3. Обновите соответствующие поля в `.env`
