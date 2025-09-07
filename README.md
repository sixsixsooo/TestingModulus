# LoveConnect

Современное веб-приложение для знакомств, созданное по образу Tinder, с красивой 3D-анимацией, системой чатов и интеграцией платежей ЮMoney.

## 🛠 Технологический стек

### Фронтенд

- **Next.js 15** - React-фреймворк с серверным рендерингом
- **TypeScript** - Типизированный JavaScript
- **Three.js** - 3D-графика и анимации
- **Framer Motion** - Анимации и переходы
- **GSAP** - Продвинутые анимации
- **Material-UI** - UI-компоненты
- **Apollo Client** - GraphQL клиент
- **Tailwind CSS** - Utility-first CSS фреймворк

### Бэкенд

- **NestJS** - Прогрессивный Node.js фреймворк
- **TypeScript** - Типизированный JavaScript
- **GraphQL** - API для эффективной работы с данными
- **TypeORM** - ORM для работы с базой данных
- **PostgreSQL** - Реляционная база данных
- **Socket.io** - WebSocket для чатов в реальном времени
- **ЮMoney API** - Интеграция платежной системы

## 📦 Установка и запуск

### Предварительные требования

- Node.js (версия 18 или выше)
- PostgreSQL
- npm или yarn

### 1. Клонирование репозитория

\`\`\`bash
git clone <repository-url>
cd TestingModulus
\`\`\`

### 2. Настройка бэкенда

\`\`\`bash
cd backend

# Установка зависимостей

npm install

# Создание файла окружения

cp env.example .env
\`\`\`

Настройте переменные окружения в файле `.env`:

\`\`\`env

# Database Configuration

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=tinder_app

# ЮMoney Configuration

YOOMONEY_SHOP_ID=your_shop_id
YOOMONEY_SECRET_KEY=your_secret_key

# JWT Configuration

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# App Configuration

PORT=3001
NODE_ENV=development
\`\`\`

### 3. Настройка базы данных PostgreSQL

Создайте базу данных:
\`\`\`sql
CREATE DATABASE tinder_app;
\`\`\`

### 4. Запуск бэкенда

\`\`\`bash

# Запуск в режиме разработки

npm run start:dev

# Или обычный запуск

npm run start
\`\`\`

Бэкенд будет доступен по адресу: http://localhost:3001
GraphQL Playground: http://localhost:3001/graphql

### 5. Настройка фронтенда

Откройте новый терминал:

\`\`\`bash
cd frontend

# Установка зависимостей

npm install

# Запуск в режиме разработки

npm run dev
\`\`\`

Фронтенд будет доступен по адресу: http://localhost:3000
