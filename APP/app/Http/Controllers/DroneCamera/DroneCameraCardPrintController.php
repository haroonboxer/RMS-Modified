<?php

namespace App\Http\Controllers\DroneCamera;

use App\Http\Controllers\Controller;
use App\Http\Resources\drone\droneCameraCardPrintResource;
use App\Models\DroneCamera\DroneCameraLicense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\View;
use Milon\Barcode\DNS2D;

class DroneCameraCardPrintController extends Controller
{
    public $user;
    public array $sortFields = [
        'drone_camera_companies.company_dr',
        'drone_camera_licenses.license_type',
        'drone_camera_licenses.issued_date',
        'drone_camera_licenses.created_at',
    ];

    public function index(Request $request)
    {
        $sortFieldInput = $request->input('sort_field', self::DEFAULT_SORT_FIELD);
        $sortField = in_array($sortFieldInput, $this->sortFields) ? $sortFieldInput : self::DEFAULT_SORT_FIELD;
        $sortOrder = $request->input('sort_order', self::DEFAULT_SORT_ORDER);
        $companyId = $request->has('company_id') ? decode_id($request->company_id) : null;

        $query = DB::table('drone_camera_licenses')
            ->leftJoin('drone_camera_companies', 'drone_camera_licenses.company_id', '=', 'drone_camera_companies.id')
            ->leftJoin('drone_camera_bosses', 'drone_camera_bosses.company_id', '=', 'drone_camera_companies.id')
            ->leftJoin('drone_camera_assistants', 'drone_camera_assistants.company_id', '=', 'drone_camera_companies.id')
            ->leftJoin('users', 'drone_camera_licenses.created_by', '=', 'users.id')
            ->select(
                'drone_camera_licenses.*',
                'drone_camera_companies.company_dr as company_name_dr',
                'drone_camera_bosses.name_dr as boss_name_dr',
                'drone_camera_assistants.name_dr as assistant_name_dr',
                'users.name as ownerName'
            )
            ->whereIn('drone_camera_licenses.status', [1, 2, 3])
            ->whereIn('drone_camera_licenses.printed', [0])

            // Core business rule: only personnel licenses
            ->whereNotNull('drone_camera_licenses.company_id')
            ->whereNull('drone_camera_licenses.personnel_id')

            ->orderBy($sortField, $sortOrder)
            ->when($companyId, function ($query) use ($companyId) {
                return $query->where('drone_camera_licenses.company_id', $companyId);
            })
            ->when($request->input('license_type'), function ($query) use ($request) {
                return $query->where('drone_camera_licenses.license_type', $request->input('license_type'));
            });

        $perPage = $request->input('per_page') ?? self::PER_PAGE;
        $records = $query->paginate((int) $perPage);

        return droneCameraCardPrintResource::collection($records);
    }

    public function changeStatusOfLicense(Request $request)
    {
        $request->validate([
            'id' => 'required|numeric|exists:drone_camera_licenses,id',
            'status' => 'required',
            'reason' => [
                'required_if:status,4',
                'string',
                'max:255',
            ],
        ]);


        $printedLicense = DroneCameraLicense::find($request->input('id'));

        if (!$printedLicense) {
            return response()->json([
                'message' => 'License not found.',
            ], 404);
        }

        $printedLicense->status = (int)$request->input('status');
        $printedLicense->reject_reason = $request->input('reason');
        $printedLicense->save();

        return response()->json([
            'message' => 'Printed card status updated successfully.',
        ], 200);
    }


    public function view($id)
    {

        $data = DB::table('drone_camera_licenses')
            ->leftJoin('drone_camera_companies', 'drone_camera_licenses.company_id', '=', 'drone_camera_companies.id')
            ->leftJoin('personnel_drone_cameras', 'personnel_drone_cameras.id', '=', 'drone_camera_licenses.personnel_id')
            ->leftJoin('drone_camera_bosses', 'drone_camera_bosses.company_id', '=', 'drone_camera_companies.id')
            ->leftJoin('drone_camera_assistants', 'drone_camera_assistants.company_id', '=', 'drone_camera_companies.id')
            ->leftJoin('provinces as main_province', 'main_province.id', '=', 'personnel_drone_cameras.main_province')
            ->leftJoin('districts as main_district', 'main_district.id', '=', 'personnel_drone_cameras.main_district')
            ->leftJoin('provinces as current_province', 'current_province.id', '=', 'personnel_drone_cameras.current_province')
            ->leftJoin('districts as current_district', 'current_district.id', '=', 'personnel_drone_cameras.current_district')
            ->join('provinces', 'provinces.id', '=', 'drone_camera_licenses.created_location')
            ->join('departments', 'departments.id', '=', 'drone_camera_licenses.created_department')
            ->leftJoin('users', 'drone_camera_licenses.created_by', '=', 'users.id')
            ->select(
                'drone_camera_licenses.*',
                'personnel_drone_cameras.*',
                'drone_camera_licenses.license_type',
                'drone_camera_companies.company_dr as company_name_dr',
                'drone_camera_companies.company_en as company_name_en',
                'drone_camera_companies.icon as company_icon',
                'drone_camera_bosses.name_dr as boss_name_dr',
                'drone_camera_bosses.name_en as boss_name_en',
                'drone_camera_bosses.photo as boss_photo',
                'drone_camera_assistants.name_dr as assistant_name_dr',
                'drone_camera_assistants.name_en as assistant_name_en',
                'drone_camera_assistants.photo as assistant_photo',
                'provinces.name_dr as createdLocation',
                'departments.name_da as createdDepartment',
                'users.name as ownerName',
                'main_province.name_dr as mainProvince',
                'main_district.district_dr as mainDistrict',
                'current_province.name_dr as currentProvince',
                'current_district.district_dr as currentDistrict'
            )
            ->where('drone_camera_licenses.id', $id)
            ->first();

        if (!$data) {
            return response()->json(['error' => 'Record not found'], 404);
        }
        return response()->json($data);
    }

    public function generateIDCard($id)
    {
        $data = DB::table('drone_camera_licenses')
            ->leftJoin('drone_camera_companies', 'drone_camera_licenses.company_id', '=', 'drone_camera_companies.id')
            ->leftJoin('drone_camera_bosses', 'drone_camera_bosses.company_id', '=', 'drone_camera_companies.id')
            ->leftJoin('drone_camera_assistants', 'drone_camera_assistants.company_id', '=', 'drone_camera_companies.id')
            ->leftJoin('users', 'drone_camera_licenses.created_by', '=', 'users.id')
            ->select(
                'drone_camera_licenses.*',
                'drone_camera_companies.company_dr as company_name_dr',
                'drone_camera_companies.company_pa as company_name_pa',
                'drone_camera_companies.company_en as company_name_en',
                'drone_camera_companies.icon as company_icon',
                'drone_camera_bosses.name_dr as boss_name_dr',
                'drone_camera_bosses.last_name_dr as boss_last_name_dr',
                'drone_camera_bosses.last_name_en as boss_last_name_en',
                'drone_camera_bosses.name_en as boss_name_en',
                'drone_camera_bosses.photo as boss_photo',
                'drone_camera_assistants.name_dr as assistant_name_dr',
                'drone_camera_assistants.last_name_dr as assistant_last_name_dr',
                'drone_camera_assistants.last_name_en as assistant_last_name_en',
                'drone_camera_assistants.name_en as assistant_name_en',
                'drone_camera_assistants.photo as assistant_photo',
                'users.name as ownerName'
            )
            ->where('drone_camera_licenses.id', $id)
            ->first();

        if (!$data) {
            return response()->json(['error' => 'Record not found'], 404);
        }

        // Use the actual serial number from the database
        $serialNumber = $data->sn ?? 'سریال نمبر موجود نمیباشد';

        $qrContent = $data->company_name_dr . "\n" . $data->boss_name_dr . "\n" . $serialNumber;

        $barcodeGenerator = new DNS2D();
        $barcodeGenerator->setStorPath(storage_path('framework/barcodes'));

        $encodedContent = mb_convert_encoding($qrContent, 'UTF-8', 'auto');
        $barcode = $barcodeGenerator->getBarcodePNG($encodedContent, 'QRCODE');
        $barcodeDataUri = 'data:image/png;base64,' . $barcode;

        $html = View::make('droneCompanyLicense', compact('data', 'barcodeDataUri', 'serialNumber'))->render();

        return response()->json([
            'html' => $html,
        ]);
    }
}
