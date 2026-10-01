<?php

namespace App\Models\GpsCompany;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GpsCompanyLicense extends Model
{
    use HasFactory;
    protected $fillable = [
        'license_type',
        'issue_date',
        'validity_date',
        'fee',
        'hanging_date',
        'bank_account_number',
        'status',
        'agency_id',
    ];
}
