<?php

namespace App\Http\Controllers\DroneCamera;

use App\Http\Controllers\Controller;
use App\Http\Resources\drone\droneCameraCardPrintResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\View;
use Milon\Barcode\DNS2D;

class PersonnelDroneCameraCardsApproveController extends Controller
{

    public $user;
    public array $sortFields = [
        'drone_camera_licenses.license_type',
        'drone_camera_licenses.issued_date',
        'drone_camera_licenses.created_at',
    ];


    public function index(Request $request)
    {
        $sortFieldInput = $request->input('sort_field', self::DEFAULT_SORT_FIELD);
        $sortField = in_array($sortFieldInput, $this->sortFields) ? $sortFieldInput : self::DEFAULT_SORT_FIELD;
        $sortOrder = $request->input('sort_order', self::DEFAULT_SORT_ORDER);

        $query = DB::table('drone_camera_licenses')
            ->leftJoin('personnel_drone_cameras', 'personnel_drone_cameras.id', '=', 'drone_camera_licenses.personnel_id')
            ->leftJoin('users', 'drone_camera_licenses.created_by', '=', 'users.id')
            ->select(
                'drone_camera_licenses.*',
                DB::raw("CONCAT(personnel_drone_cameras.name_dr,' ',personnel_drone_cameras.last_name_dr) as name_dr"),
                'users.name as ownerName'
            )
            ->whereIn('drone_camera_licenses.status', [1, 2, 3])
            ->where('drone_camera_licenses.printed', 0)

            // Core business rule: only personnel licenses
            ->whereNotNull('drone_camera_licenses.personnel_id')
            ->whereNull('drone_camera_licenses.company_id')

            ->when($request->input('license_type'), function ($query) use ($request) {
                $query->where('drone_camera_licenses.license_type', $request->input('license_type'));
            })
            ->orderBy($sortField, $sortOrder);

        $perPage = $request->input('per_page') ?? self::PER_PAGE;

        $records = $query->paginate((int) $perPage);

        return droneCameraCardPrintResource::collection($records);
    }

    public function generateIDCard($id)
    {
        $data = DB::table('drone_camera_licenses')
            ->leftJoin('personnel_drone_cameras', 'drone_camera_licenses.personnel_id', '=', 'personnel_drone_cameras.id')
            ->leftJoin('users', 'drone_camera_licenses.created_by', '=', 'users.id')
            ->select(
                'drone_camera_licenses.*',
                'personnel_drone_cameras.name_dr',
                'personnel_drone_cameras.last_name_dr',
                'personnel_drone_cameras.name_en',
                'personnel_drone_cameras.last_name_en',
                'personnel_drone_cameras.photo',
                'users.name as ownerName'
            )
            ->where('drone_camera_licenses.id', $id)
            ->first();

        if (!$data) {
            return response()->json(['error' => 'Record not found'], 404);
        }

        // Full name handling (important for consistency in QR + UI)
        $fullNameDr = trim(($data->name_dr ?? '') . ' ' . ($data->last_name_dr ?? ''));
        $fullNameEn = trim(($data->name_en ?? '') . ' ' . ($data->last_name_en ?? ''));

        // Serial number fallback
        $serialNumber = $data->sn ?? 'سریال نمبر موجود نمیباشد';

        // QR content (personalized instead of company)
        $qrContent = $fullNameDr . "\n" . $data->drone_model . "\n" . $serialNumber;

        $barcodeGenerator = new DNS2D();
        $barcodeGenerator->setStorPath(storage_path('framework/barcodes'));

        $encodedContent = mb_convert_encoding($qrContent, 'UTF-8', 'auto');
        $barcode = $barcodeGenerator->getBarcodePNG($encodedContent, 'QRCODE');
        $barcodeDataUri = 'data:image/png;base64,' . $barcode;

        // Use a NEW blade (don’t mix with company template)
        $html = View::make('dronePersonalLicense', compact(
            'data',
            'barcodeDataUri',
            'serialNumber',
            'fullNameDr',
            'fullNameEn'
        ))->render();

        return response()->json([
            'html' => $html,
        ]);
    }
}
