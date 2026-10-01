<?php

namespace App\Models\DroneCamera;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DroneCameraLicense extends Model
{
    use HasFactory;
    protected $fillable = [
        'license_type',
        'issue_date',
        'validity_date',
        'fee',
        'drone_model',
        'drone_sn',
        'hanging_date',
        'bank_account_number',
        'status',
    ];
    public function company()
    {
        return $this->belongsTo(DroneCameraCompany::class, 'company_id');
    }
}
