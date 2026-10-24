# CodeNebula (it-studio.loc)

Лендинг и кабинет IT-студии CodeNebula на **Laravel 12 + Inertia + React + TypeScript**.

## Стек

- Laravel 12, Breeze (auth kit)
- Inertia 2 + React 18 + TypeScript
- Tailwind CSS 3 + Vite 6
- SoftDeletes на `User` и `Lead`

## Быстрый старт

```bash
composer install --ignore-platform-reqs
cp .env.example .env   # если ещё нет
php artisan key:generate
npm install
npm install-scripts approve esbuild   # при блокировке install-scripts
npm run build
php artisan migrate
```

Локальный Apache-конфиг: `deploy/it-studio.conf`.

```bash
sudo cp deploy/it-studio.conf /etc/httpd/conf/conf.d/it-studio.conf
sudo apachectl -t && sudo systemctl reload httpd
```

Dev: `composer dev` или `npm run dev` + `php artisan serve`.

## Маршруты

| URI | Назначение |
|-----|------------|
| `/` | Лендинг (`Pages/Home`) |
| `POST /leads` | Заявка |
| `/login`, `/register`, … | Breeze auth |
| `/dashboard` | Кабинет (auth) |
| `/profile` | Профиль (auth) |

## UI

- `resources/js/Pages/Home.tsx` — лендинг
- `resources/js/Layouts/MarketingLayout.tsx` — header + минимальный footer
- `resources/js/Components/Home/AboutSection.tsx` — sticky-галерея (4 кадра по скроллу)

## Тесты

```bash
php vendor/bin/phpunit
npm run build
```
