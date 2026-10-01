<?php

namespace App\Models\DroneCamera;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DroneCameraCompany extends Model
{
    use HasFactory;
    public function DroneCameraLicense()
    {
        return $this->hasMany('App\Models\DroneCamera\DroneCameraLicense', 'company_id', 'id');
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
