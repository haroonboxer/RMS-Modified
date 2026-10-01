<?php

namespace App\Http\Resources\GpsCompanyResource;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GpsCompanyAgencyResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name_pa' => $this->name_pa,
            'name_dr' => $this->name_dr,
            'name_en' => $this->name_en,
            'mainProvince' => $this->mainProvince,
            'mainDistrict' => $this->mainDistrict,
            'main_village' => $this->main_village,
            'currentProvince' => $this->currentProvince,
            'currentDistrict' => $this->currentDistrict,
            'current_village' => $this->current_village,
            'agency_manager' => $this->agency_manager,
            'phone' => $this->phone,
            'attchments' =>  $this->attachment ? asset($this->attachment) : null,
            'photo' =>  $this->photo ? asset($this->photo) : null,
            'ownerName' => $this->when(isset($this->ownerName), $this->ownerName),
            'created_at' => dateCheck($this->created_at, true),
            'createdLocation' => $this->createdLocation,
            'created_at' => $this->created_at ? $this->created_at->format('Y-m-d H:i') : null,
        ];
    }
}
