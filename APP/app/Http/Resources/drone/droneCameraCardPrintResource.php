<?php

namespace App\Http\Resources\drone;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class droneCameraCardPrintResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id ?? null,
            'license_type' => $this->resource->license_type ?? null,
            'issue_date' => $this->resource->issue_date ?? null,
            'validity_date' => $this->resource->validity_date ?? null,
            'fee' => $this->resource->fee ?? null,

            'company_name_dr' => $this->resource->company_name_dr ?? null,
            'boss_name_dr' => $this->resource->boss_name_dr ?? null,
            'assistant_name_dr' => $this->resource->assistant_name_dr ?? null,

            'name_dr' => $this->resource->name_dr ?? null,

            'status' => $this->resource->status ?? null,
            'company_id' => $this->resource->company_id ?? null,
            'created_by' => $this->resource->created_by ?? null,

            'ownerName' => $this->resource->ownerName ?? null,
        ];
    }
}
