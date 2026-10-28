# Кабинет — UX next steps

## Purpose

Полировка личного кабинета после MVP (`docs/ORDERS_CABINET.md`). Продуктовая рамка для **клиента**: платформа = единая команда, которая берёт на себя трудности. Клиент **не** смотрит скиллы, резюме и профили исполнителей.

## Product rules (client)

- Нет публичных карточек кодеров со skills / experience / resume в UI клиента.
- В чате заказа участник = роль в команде проекта (категория ответственности), не «маркетплейс фрилансеров».
- Достаточно: **имя/ник** + **категория** (Бекенд / Фронтенд / Дизайн / PM / …).
- По клику на участника (аватар/имя) — tooltip или компактная карточка: имя сверху, субтекст с категорией. Без ссылки на полный профиль.

## Checklist

### Navigation & roles — `cabinet-nav`

- [ ] Меню по роли: клиенту не показывать «Анкета кодера» (или только до подачи / в статусе pending).
- [ ] Кодеру — лента + заказы; клиенту — заказы + уведомления.
- [ ] Админу в шапке ЛК — ссылка «Админка» → `/admin`.
- [ ] Visual: выровнять `CabinetLayout` под бренд (coral/cyan, DESIGN.md), уйти от голого Breeze slate.

Точка входа в коде: `resources/js/Layouts/CabinetLayout.tsx`  
TODO id: `cabinet-nav`

### Chat participant category — `cabinet-chat-participant`

- [ ] Модель: у участника заказа хранить **категорию ответственности** в проекте (не путать с Spatie role и не с `order_participants.role` client/coder — нужен отдельный атрибут, напр. `specialty` / `responsibility_label`, или справочник).
- [ ] Admin (Filament): при add participant / approve join — задать категорию (Бекенд, Фронтенд, Дизайн, …).
- [ ] API чата: в payload user/participant отдавать `name` + `specialty_label` (+ avatar), **не** skills/resume.
- [ ] UI: клик по аватару/имени → tooltip или мини-карточка (имя + субтекст категории).
- [ ] Клиенту нигде не вести на профиль кодера.

Точка входа: `resources/js/Pages/Cabinet/Orders/Chat.tsx`  
TODO id: `cabinet-chat-participant`

### Empty states & onboarding — `cabinet-empty`

- [ ] Пустые заказы / лента / чат / уведомления: короткий текст + следующий шаг.
- [ ] Клиент без заказов: «Мы свяжемся / заказ появится после обработки заявки» → #contact или статус.

Точки: `Orders/Index.tsx`, `Feed/Index.tsx`, `Notifications/Index.tsx`, `Orders/Chat.tsx`  
TODO id: `cabinet-empty`

### Notifications UX — `cabinet-notifications`

- [ ] Mark as read / mark all; клик ведёт в заказ/чат/этап.
- [ ] Группировка или понятные заголовки на русском.

Точка: `resources/js/Pages/Cabinet/Notifications/Index.tsx`  
TODO id: `cabinet-notifications`

### Chat realtime resilience — `cabinet-chat-realtime`

- [ ] Индикатор, если Echo/Reverb недоступен.
- [ ] Fallback: reload / soft polling сообщений.

Точка: `resources/js/Pages/Cabinet/Orders/Chat.tsx`  
TODO id: `cabinet-chat-realtime`

### Stages clarity — `cabinet-stages`

- [ ] Для клиента — блок «текущий шаг / что согласовать» рядом с React Flow.
- [ ] Единые русские статусы.

Точка: `resources/js/Pages/Cabinet/Orders/Stages.tsx`  
TODO id: `cabinet-stages`

### Lead → client path — `cabinet-lead-handoff`

- [ ] После Filament «Создать заказ» — понятный вход клиента (invite / письмо / уже существующий user).
- [ ] Не полагаться только на seed-аккаунты.

Точка: Filament `LeadResource` + mail/notification  
TODO id: `cabinet-lead-handoff`

## Out of scope for client UI

- Просмотр skills / experience_level / resume кодеров.
- Рейтинги исполнителей, сравнение профилей, «выбрать кодера из каталога».

(Модерация анкет и теги остаются во **Filament** и во внутреннем профиле кодера — не в клиентском ЛК.)

## Related

- Architecture / MVP: `docs/ORDERS_CABINET.md`
- Brand: `DESIGN.md`, `PRODUCT.md`
