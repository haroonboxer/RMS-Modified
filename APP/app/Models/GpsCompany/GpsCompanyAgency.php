<?php

namespace App\Models\GpsCompany;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GpsCompanyAgency extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'name_dr',
        'name_pa',
        'name_en',
        'agency_manager',
        'phone',
        'photo',
        'main_province',
        'main_district',
        'main_village',
        'current_province',
        'current_district',
        'current_village',
        'status',
        'reason_dismissed',
        'created_by',
        'created_department',
        'created_location',
    ];
    public $timestamps = true;
    public function agencies()
    {
        return $this->hasMany(GpsCompanyAgency::class, 'company_id');
    }
}
