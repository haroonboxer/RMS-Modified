<?php

namespace App\Models\k9;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class K9Company extends Model
{
    use HasFactory, LogsActivity;
    public $timestamps = true;


    public function K9License()
    {
        return $this->hasMany('App\Models\k9\K9License', 'company_id', 'id');
    }

    protected $fillable = [
        'company_dr',
        'company_pa',
        'company_en',
        'icon',
        'status',
        'address',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly([
                'company_dr',
                'company_pa',
                'company_en',
                'icon',
                'address',
                'tin',
                'status',
                'reason_dismissed',
                'created_by',
                'updated_by',
                'created_department',
                'created_location',
            ])->logOnlyDirty(true)->useLogName('k9Companies');
    }
}
