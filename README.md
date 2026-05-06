# Newspaper Project

- `backend` — Strapi v4 (CMS API), по умолчанию использует SQLite.
- `frontend` — Next.js + Refine (админка/клиент), работает с API Strapi.

## Требования

- Node.js `18.x` или `20.x` (для `backend` указано `>=18 <=20`).
- Yarn `1.x` (в проекте зафиксирован `yarn@1.22.x`).

Проверка версий:

```bash
node -v
yarn -v
```

## 1) Установка зависимостей

Из корня проекта:

```bash
cd backend
yarn install

cd ../frontend
yarn install
```

## 2) Настройка переменных окружения

### Backend (`backend/.env`)

Создайте `backend/.env` на основе `backend/.env.example`:

```bash
cp backend/.env.example backend/.env
```

На Windows PowerShell:

```powershell
Copy-Item "backend/.env.example" "backend/.env"
```

Минимально нужны:

- `HOST=0.0.0.0`
- `PORT=1337`
- `APP_KEYS`
- `API_TOKEN_SALT`
- `ADMIN_JWT_SECRET`
- `TRANSFER_TOKEN_SALT`
- `JWT_SECRET`

### Frontend (`frontend/.env`)

В проекте уже есть `frontend/.env` с примерами переменных:

- `NEXT_PUBLIC_API_URL=http://localhost:1337`
- `NEXT_PUBLIC_TOKEN_KEY=strapi-jwt-token`
- `NEXT_PUBLIC_STRAPI_TOKEN=<ваш API token из Strapi>`

Если токен в `frontend/.env` старый или скомпрометирован, создайте новый в Strapi:
`Settings -> API Tokens`.

## 3) Запуск backend (Strapi)

```bash
cd backend
yarn develop
```

После запуска:

- API: `http://localhost:1337`
- Админка Strapi: `http://localhost:1337/admin`

При первом запуске создайте администратора в веб-интерфейсе.

## 4) Запуск frontend (Next.js)

В новом терминале:

```bash
cd frontend
yarn dev
```

По умолчанию фронтенд доступен на:

- `http://localhost:3000`

## Порядок запуска

1. Сначала `backend` (`yarn develop`), дождаться старта Strapi.
2. Затем `frontend` (`yarn dev`).

## Частые проблемы

- Порт `1337` или `3000` занят  
  Освободите порт или смените его в `.env`/конфиге.

- Ошибки из-за версии Node.js  
  Используйте Node.js 18 или 20.

- Frontend не получает данные  
  Проверьте `NEXT_PUBLIC_API_URL` и валидность `NEXT_PUBLIC_STRAPI_TOKEN`.

- В git появились тысячи файлов из `.next`  
  Это артефакты сборки. Для очистки удалите папку `frontend/.next`.

## Полезные команды

Backend:

```bash
cd backend
yarn develop   # dev-режим
yarn build     # сборка админки Strapi
yarn start     # запуск production-сборки
```

Frontend:

```bash
cd frontend
yarn dev       # dev-режим
yarn build     # production-сборка
yarn start     # запуск production-сборки
yarn lint      # линтер
```
