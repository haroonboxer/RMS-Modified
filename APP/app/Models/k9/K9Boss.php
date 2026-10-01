<?php

namespace App\Models\k9;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class K9Boss extends Model
{
    use HasFactory, LogsActivity;
    public $timestamps = true;

    protected $fillable = [
        'name_dr',
        'name_en',
        'last_name_dr',
        'last_name_en',
        'f_name_da',
        'phone',
        'email',
        'passport_no',
        'country',
        'main_province',
        'main_district',
        'main_village',
        'current_province',
        'current_district',
        'current_village',
        'type_residence_info',
        'company_id'
    ];


    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly([
                'name_dr',
                'name_en',
                'last_name_dr',
                'last_name_en',
                'f_name_da',
                'phone',
                'email',
                'passport_no',
                'country',
                'main_province',
                'main_district',
                'main_village',
                'current_province',
                'current_district',
                'current_village',
                'type_residence_info',
                'company_id',
                'created_by',
                'updated_by',
                'created_department',
                'created_location',
            ])->logOnlyDirty(true)->useLogName('k9Boss');
    }
}
