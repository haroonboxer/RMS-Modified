<?php

namespace App\Http\Resources\k9;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class k9LicenseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return parent::toArray($request);
        return [
            'id' => $this->id,
            'license_type' => $this->license_type,
            'issue_date' => $this->issue_date,
            'validity_date' => $this->validity_date,
            'fee' => $this->fee,
            'bank_account_number' => $this->bank_account_number,
            'hanging_date' => $this->hanging_date,
            'status' => $this->status,
            'company_id' => $this->company_id,
            'created_by' => $this->created_by,
            'createdDepartment' => $this->createdDepartment,
            'createdLocation' => $this->createdLocation,
            'attachments' => $this->attachment ? asset($this->attachment) : null,
            'ownerName' => $this->when(isset($this->ownerName), $this->ownerName),
            'created_at' => dateCheck($this->created_at, true),
        ];
    }
}
