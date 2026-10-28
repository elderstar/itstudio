# Кабинет заказов, чат и роли

## Purpose

Личный кабинет CodeNebula: заказы с изоляцией участников, realtime-чат (Reverb), приватные файлы, модерация кодеров и заявок, лента, прогресс этапов (React Flow).

## Roles

| Role | Access |
|------|--------|
| `client` | Только свои заказы (как владелец / участник) |
| `coder` | После approve анкеты: лента, join-requests, чаты где принят |
| `admin` | Filament `/admin`: лиды, заказы, анкеты, join-requests, теги, этапы, kick/add |

Публичный register создаёт только `client`. Кодеры подают анкету в `/cabinet/coder-application`.

## Data flow

1. Lead → admin «Создать заказ» → `Order` + client user + participant
2. Coder application → admin approve → role `coder` + feed
3. Feed → join request → admin approve → `order_participants`
4. Participants → private chat channel `orders.{id}` + Media Library files (disk `local`)
5. Admin задаёт `order_stages` / edges; client согласовывает; все видят React Flow

## Access rules

- `OrderPolicy`: заказ / чат / файлы только при активном участии (или client-владелец / admin)
- После `left_at` доступ закрыт
- Media download только через `/media/{media}` с проверкой прав
- Бюджет может скрываться от кодеров (`hide_budget_from_coders`)

## Realtime

- Laravel Reverb + Echo (`BROADCAST_CONNECTION=reverb`)
- Event: `MessageSent` on private channel `orders.{orderId}`
- Run: `php artisan reverb:start`

## Key routes

- Inertia cabinet: `/cabinet/orders`, `/cabinet/feed`, `/cabinet/coder-application`, `/cabinet/notifications`
- Filament: `/admin`
- Seeded admin: `admin@codenebula.local` / `password`

## Extension points

- Notifications: `NewOrderMessage`, `CoderApplicationReviewed`, `JoinRequestReviewed`, `StageStatusChanged`
- Audit: Spatie Activity Log on orders / applications / join requests
- Close recruiting: Filament action on Order

## Next (UX)

Полировка кабинета, роли в меню, чат-участники как категории команды (без скиллов для клиента): **`docs/CABINET_UX.md`**.
