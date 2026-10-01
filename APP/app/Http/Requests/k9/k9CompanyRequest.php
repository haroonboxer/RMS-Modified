<?php

namespace App\Http\Requests\k9;

use Illuminate\Foundation\Http\FormRequest;

class k9CompanyRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company_pa' => ['required', 'string', 'max:255'],
            'company_dr' => ['required', 'string', 'max:255'],
            'company_en' => ['required', 'string', 'max:255'],
        ];
    }
}
