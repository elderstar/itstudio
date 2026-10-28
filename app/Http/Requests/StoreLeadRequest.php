<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLeadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'email' => ['nullable', 'email', 'max:255', 'required_without:phone'],
            'phone' => ['nullable', 'string', 'max:40', 'required_without:email'],
            'message' => ['required', 'string', 'max:5000'],
            'company' => ['nullable', 'max:0'],
            'intent' => [
                'required',
                'string',
                Rule::in(['has_problem', 'want_improve', 'need_dev', 'need_estimate', 'just_chat']),
            ],
            'step2_chips' => ['nullable', 'array'],
            'step2_chips.*' => ['string', 'max:80'],
            'step2_note' => ['nullable', 'string', 'max:2000'],
            'step3_chips' => ['nullable', 'array'],
            'step3_chips.*' => ['string', 'max:80'],
            'step3_note' => ['nullable', 'string', 'max:2000'],
            'skipped_step3' => ['sometimes', 'boolean'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator): void {
            $chips = $this->input('step2_chips', []);
            $note = trim((string) $this->input('step2_note', ''));

            if ((! is_array($chips) || count($chips) === 0) && $note === '') {
                $validator->errors()->add(
                    'step2_chips',
                    'Выберите вариант или напишите пару фраз.',
                );
            }
        });
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Укажите имя.',
            'email.required_without' => 'Укажите email или телефон.',
            'email.email' => 'Проверьте формат email.',
            'phone.required_without' => 'Укажите email или телефон.',
            'message.required' => 'Не удалось собрать описание заявки.',
            'intent.required' => 'Выберите, с чем вы пришли.',
            'company.max' => 'Заявка отклонена.',
        ];
    }
}
