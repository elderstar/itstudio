export type IntentId =
    | 'has_problem'
    | 'want_improve'
    | 'need_dev'
    | 'need_estimate'
    | 'just_chat';

export type WizardStep = 1 | 2 | 3 | 4;

export const INTENTS: {
    id: IntentId;
    title: string;
    hint: string;
}[] = [
    {
        id: 'has_problem',
        title: 'Есть конкретная проблема',
        hint: 'Уже понятно, что мешает',
    },
    {
        id: 'want_improve',
        title: 'Хочу понять, что улучшить',
        hint: 'Нужен взгляд со стороны',
    },
    {
        id: 'need_dev',
        title: 'Есть задача на разработку',
        hint: 'Сайт, продукт, нужны сроки, объём, люди',
    },
    {
        id: 'need_estimate',
        title: 'Нужна оценка / команда',
        hint: 'Сроки, объём, люди',
    },
    {
        id: 'just_chat',
        title: 'Пока просто познакомиться',
        hint: 'Без срочной задачи',
    },
];

export const BRANCH: Record<
    IntentId,
    {
        step2Label: string;
        step3Label: string;
        step2Prompt: string;
        step3Prompt: string;
        step2Chips: string[];
        step3Chips: string[];
        step3SkipLabel: string;
    }
> = {
    has_problem: {
        step2Label: 'Проблема',
        step3Label: 'Контекст',
        step2Prompt: 'Что сейчас мешает сильнее всего?',
        step3Prompt: 'В каком контексте это происходит? (по желанию)',
        step2Chips: [
            'Мало заявок',
            'Сайт медленный / неудобный',
            'Хаос в процессах',
            'Баги и технический долг',
            'Нужен MVP',
            'Другое',
        ],
        step3Chips: [
            'Интернет-магазин',
            'Сервис / SaaS',
            'Локальный бизнес',
            'Стартап / идея',
            'Внутренний продукт',
        ],
        step3SkipLabel: 'Пока без деталей о деле',
    },
    want_improve: {
        step2Label: 'Дело',
        step3Label: 'Точка роста',
        step2Prompt: 'Чем занимаетесь?',
        step3Prompt: 'Где искать точку роста?',
        step2Chips: [
            'Интернет-магазин',
            'Сервис / SaaS',
            'Локальный бизнес',
            'Стартап / идея',
            'Внутренний продукт',
            'Пока только идея',
        ],
        step3Chips: [
            'Продажи и заявки',
            'Скорость и стабильность',
            'UX и удобство',
            'Автоматизация',
            'Пока не уверен',
        ],
        step3SkipLabel: 'Достаточно, к контактам',
    },
    need_dev: {
        step2Label: 'Задача',
        step3Label: 'Ориентиры',
        step2Prompt: 'Что нужно разработать?',
        step3Prompt: 'Сроки, объём, материалы?',
        step2Chips: [
            'Сайт с нуля',
            'Доработка текущего сайта',
            'Веб-приложение / сервис',
            'Мобильное приложение',
            'Игра / Unreal',
            'Интеграции и автоматизация',
            'Команда на проект',
        ],
        step3Chips: [
            'Срочно (до месяца)',
            '1–3 месяца',
            'Без жёстких сроков',
            'Есть ТЗ / референсы',
            'Нужна команда под ключ',
            'Пока без материалов',
        ],
        step3SkipLabel: 'Пока без ориентиров',
    },
    need_estimate: {
        step2Label: 'Задача',
        step3Label: 'Ориентир',
        step2Prompt: 'Что нужно оценить?',
        step3Prompt: 'Есть ориентиры по сроку или формату?',
        step2Chips: [
            'Сайт с нуля',
            'Доработка текущего',
            'Приложение',
            'Интеграции',
            'Команда на срок',
        ],
        step3Chips: [
            'Срочно (до месяца)',
            '1–3 месяца',
            'Без жёстких сроков',
            'Есть ТЗ / референсы',
            'Пока без материалов',
        ],
        step3SkipLabel: 'Пока без ориентиров',
    },
    just_chat: {
        step2Label: 'О вас',
        step3Label: 'Интерес',
        step2Prompt: 'Кто вы в этой истории?',
        step3Prompt: 'Что интересно узнать? (по желанию)',
        step2Chips: [
            'Основатель',
            'Маркетинг',
            'IT / продукт',
            'Партнёр / агентство',
            'Другое',
        ],
        step3Chips: [
            'Кейсы и подход',
            'Возможности сотрудничества',
            'Просто познакомиться',
        ],
        step3SkipLabel: 'Сразу к контактам',
    },
};

export function timelineLabels(intent: IntentId | null): [string, string, string, string] {
    if (!intent) {
        return ['Намерение', 'Детали', 'Уточнение', 'Контакт'];
    }

    const branch = BRANCH[intent];

    return ['Намерение', branch.step2Label, branch.step3Label, 'Контакт'];
}

export function composeLeadMessage(input: {
    intent: IntentId;
    step2_chips: string[];
    step2_note: string;
    step3_chips: string[];
    step3_note: string;
    skipped_step3: boolean;
}): string {
    const intent_title = INTENTS.find((i) => i.id === input.intent)?.title ?? input.intent;
    const lines = [`Намерение: ${intent_title}`];

    if (input.step2_chips.length) {
        lines.push(`Шаг 2 (чипы): ${input.step2_chips.join(', ')}`);
    }
    if (input.step2_note.trim()) {
        lines.push(`Шаг 2 (своими словами): ${input.step2_note.trim()}`);
    }
    if (input.skipped_step3) {
        lines.push('Шаг 3: пропущен');
    } else {
        if (input.step3_chips.length) {
            lines.push(`Шаг 3 (чипы): ${input.step3_chips.join(', ')}`);
        }
        if (input.step3_note.trim()) {
            lines.push(`Шаг 3 (своими словами): ${input.step3_note.trim()}`);
        }
    }

    return lines.join('\n');
}
