<?php

namespace App\Http\Resources\drone;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DroneCameraLicenseResource extends JsonResource
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
            'drone_model' => $this->drone_model,
            'drone_sn' => $this->drone_sn,
            'bank_account_number' => $this->bank_account_number,
            'hanging_date' => $this->hanging_date,
            'status' => $this->status,
            'company_id' => $this->company_id,
            'personnel_id' => $this->personnel_id,
            'created_by' => $this->created_by,
            'createdDepartment' => $this->createdDepartment,
            'createdLocation' => $this->createdLocation,
            'attachments' => $this->attachment ? asset($this->attachment) : null,
            'ownerName' => $this->when(isset($this->ownerName), $this->ownerName),
            'created_at' => dateCheck($this->created_at, true),
        ];
    }
}
