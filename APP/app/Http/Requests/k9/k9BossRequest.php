<?php

namespace App\Http\Requests\k9;

use Illuminate\Foundation\Http\FormRequest;

class k9BossRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name_dr' => ['required', 'string', 'max:255'],
            'name_en' => ['required', 'string', 'max:255'],
            'last_name_dr' => ['required', 'string', 'max:255'],
            'last_name_en' => ['required', 'string', 'max:255'],
            'f_name_da' => ['required', 'string', 'max:255'],
            'phone' => 'required|string|max:10',
            'photo' => ['nullable', 'file', 'mimes:jpeg,png,jpg'],
            'passport_no' => ['required', 'string', 'max:255'],
            'country' => ['required', 'string', 'max:255'],
            'main_province' => ['nullable', 'string', 'max:255'],
            'main_district' => ['nullable', 'string', 'max:255'],
            'main_village' => ['nullable', 'string', 'max:255'],
            'current_province' => ['nullable', 'string', 'max:255'],
            'current_district' => ['nullable', 'string', 'max:255'],
            'current_village' => ['nullable', 'string', 'max:255'],
        ];
    }
    public function messages(): array
    {
        return [
            'name_dr.required' => 'The name in Dari is required.',
            'name_en.required' => 'The name in English is required.',
            'last_name_dr.required' => 'The last name in Dari is required.',
            'last_name_en.required' => 'The last name in English is required.',
            'f_name_da.required' => 'The father’s name is required.',
            'phone.required' => 'The phone number is required.',
            'photo.required' => 'The photo filed is required.',
            'passport_no.required' => 'The passport number is required.',
            'country.required' => 'The country field is required.',
        ];
    }

    /**
     * Customize the attributes for validation messages.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name_dr' => 'Name in Dari',
            'name_en' => 'Name in English',
            'last_name_dr' => 'Last Name in Dari',
            'last_name_en' => 'Last Name in English',
            'f_name_da' => 'Father’s Name',
            'phone' => 'Phone Number',
            'photo' => 'Photo',
            'passport_no' => 'Passport Number',
            'country' => 'Country',
            'main_province' => 'Main Province',
        ];
    }
}
