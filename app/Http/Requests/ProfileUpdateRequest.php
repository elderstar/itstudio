<?php

namespace App\Http\Requests;

use App\Models\User;
use App\Support\CoderProfile;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
        ];

        if ($this->user()?->hasRole('coder') || $this->user()?->coderApplication) {
            $rules = array_merge($rules, [
                'bio' => ['required', 'string', 'max:2000'],
                'skills' => ['required', 'array', 'min:1'],
                'skills.*' => ['string', Rule::in(CoderProfile::skillOptions())],
                'experience_level' => ['required', 'integer', 'min:0', 'max:100'],
                'resume_url' => ['nullable', 'url', 'max:500'],
                'resume' => CoderProfile::resumeRules(),
                'clear_resume_file' => ['sometimes', 'boolean'],
            ]);
        }

        return $rules;
    }
}
