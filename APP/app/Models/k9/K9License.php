<?php

namespace App\Models\k9;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class K9License extends Model
{
    use HasFactory, LogsActivity;
    public $timestamps = true;

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly([
                'license_type',
                'issue_date',
                'validity_date',
                'fee',
                'hanging_date',
                'bank_account_number',
                'status',
                'created_by',
                'updated_by',
                'created_department',
                'created_location',
            ])->logOnlyDirty(true)->useLogName('k9Licenses');
    }

    protected $fillable = [
        'license_type',
        'issue_date',
        'validity_date',
        'fee',
        'hanging_date',
        'bank_account_number',
        'status',
    ];
}
