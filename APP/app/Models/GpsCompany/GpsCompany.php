<?php

namespace App\Models\GpsCompany;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GpsCompany extends Model
{
    use HasFactory;
    public function workshopLicenses()
    {
        return $this->hasMany('App\Models\GpsCompany\GpsCompanyLicense', 'company_id', 'id');
    }
    protected $fillable = [
        'company_dr',
        'company_pa',
        'company_en',
        'icon',
        'status',
        'address',
        '',
        '',
    ];
    public $timestamps = true;
}
