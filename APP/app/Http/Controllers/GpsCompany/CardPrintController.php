<?php

namespace App\Http\Controllers\GpsCompany;

use App\Http\Controllers\Controller;
use App\Http\Resources\GpsCompanyResource\GpsCompanyCardPrintResource;
use App\Models\GpsCompany\GpsCompanyLicense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\View;
use Milon\Barcode\DNS2D;

class CardPrintController extends Controller
{
    public $user;

    // public function __construct()
    // {
    //     $this->middleware('permission:workshop-print-list')->only('index');
    //     $this->middleware('permission:workshop-print-accept')->only('changeStatusOfLicense');
    //     $this->middleware('permission:workshop-print-card')->only('generateIDCard');
    //     $this->middleware('permission:workshop-print-card-view')->only('view');
    //     $this->middleware(function ($request, $next) {
    //         $this->user = Auth::guard('web')->user();
    //         return $next($request);
    //     });
    // }

    public array $sortFields = [
        'gps_companies.company_dr',
        'gps_company_licenses.license_type',
        'gps_company_licenses.issued_date',
        'gps_company_licenses.created_at',
    ];

    public function index(Request $request)
    {
        $sortFieldInput = $request->input('sort_field', self::DEFAULT_SORT_FIELD);
        $sortField = in_array($sortFieldInput, $this->sortFields) ? $sortFieldInput : self::DEFAULT_SORT_FIELD;
        $sortOrder = $request->input('sort_order', self::DEFAULT_SORT_ORDER);
        $companyId = $request->has('company_id') ? decode_id($request->company_id) : null;

        $query = DB::table('gps_company_licenses')
            ->leftJoin('gps_companies', 'gps_company_licenses.company_id', '=', 'gps_companies.id')
            ->leftJoin('gps_company_bosses', 'gps_company_bosses.company_id', '=', 'gps_companies.id')
            ->leftJoin('gps_company_assistants', 'gps_company_assistants.company_id', '=', 'gps_companies.id')
            ->leftJoin('users', 'gps_company_licenses.created_by', '=', 'users.id')
            // 👇 NEW JOINS for agency and province
            ->leftJoin('gps_company_agencies', 'gps_company_licenses.agency_id', '=', 'gps_company_agencies.id')
            ->leftJoin('provinces', 'provinces.id', '=', 'gps_company_agencies.main_province')
            ->select(
                'gps_company_licenses.*',
                'gps_companies.company_dr as company_name_dr',
                'gps_company_bosses.name_dr as boss_name_dr',
                'gps_company_assistants.name_dr as assistant_name_dr',
                'users.name as ownerName',
                // 👇 NEW selected field
                'provinces.name_dr as mainProvinceName'
            )
            ->whereIn('gps_company_licenses.status', [1, 2, 3])
            ->whereIn('gps_company_licenses.printed', [0])
            ->orderBy($sortField, $sortOrder)
            ->when($companyId, function ($query) use ($companyId) {
                return $query->where('gps_company_licenses.company_id', $companyId);
            })
            ->when($request->input('license_type'), function ($query) use ($request) {
                return $query->where('gps_company_licenses.license_type', $request->input('license_type'));
            });

        $perPage = $request->input('per_page') ?? self::PER_PAGE;
        $records = $query->paginate((int) $perPage);
        return GpsCompanyCardPrintResource::collection($records);
    }

    public function changeStatusOfLicense(Request $request)
    {
        $request->validate([
            'id' => 'required|numeric|exists:gps_company_licenses,id',
            'status' => 'required',
            'reason' => [
                'required_if:status,4',
                'string',
                'max:255',
            ],
        ]);


        $printedLicense = GpsCompanyLicense::find($request->input('id'));

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
        $data = DB::table('gps_company_licenses')
            ->join('gps_companies', 'gps_company_licenses.company_id', '=', 'gps_companies.id')
            ->join('gps_company_bosses', 'gps_company_bosses.company_id', '=', 'gps_companies.id')
            ->join('gps_company_assistants', 'gps_company_assistants.company_id', '=', 'gps_companies.id')
            ->join('provinces', 'provinces.id', '=', 'gps_company_licenses.created_location')
            ->join('departments', 'departments.id', '=', 'gps_company_licenses.created_department')
            ->leftJoin('users', 'gps_company_licenses.created_by', '=', 'users.id')
            ->select(
                'gps_company_licenses.*',
                'gps_company_licenses.license_type',
                'gps_companies.company_dr as company_name_dr',
                'gps_companies.company_en as company_name_en',
                'gps_companies.icon as company_icon',
                'gps_company_bosses.name_dr as boss_name_dr',
                'gps_company_bosses.name_en as boss_name_en',
                'gps_company_bosses.photo as boss_photo',
                'gps_company_assistants.name_dr as assistant_name_dr',
                'gps_company_assistants.name_en as assistant_name_en',
                'gps_company_assistants.photo as assistant_photo',
                'provinces.name_dr as createdLocation',
                'departments.name_da as createdDepartment',
                'users.name as ownerName'
            )
            ->where('gps_company_licenses.id', $id)
            ->first();

        if (!$data) {
            return response()->json(['error' => 'Record not found'], 404);
        }
        return response()->json($data);
    }

    public function generateIDCard($id)
    {
        $data = DB::table('gps_company_licenses')
            ->leftJoin('gps_companies', 'gps_company_licenses.company_id', '=', 'gps_companies.id')
            ->leftJoin('gps_company_bosses', 'gps_company_bosses.company_id', '=', 'gps_companies.id')
            ->leftJoin('gps_company_assistants', 'gps_company_assistants.company_id', '=', 'gps_companies.id')
            ->leftJoin('users', 'gps_company_licenses.created_by', '=', 'users.id')

            ->select(
                'gps_company_licenses.*',
                'gps_companies.company_dr as company_name_dr',
                'gps_companies.company_pa as company_name_pa',
                'gps_companies.company_en as company_name_en',
                'gps_companies.icon as company_icon',

                'gps_company_bosses.name_dr as boss_name_dr',
                'gps_company_bosses.last_name_dr as boss_last_name_dr',
                'gps_company_bosses.last_name_en as boss_last_name_en',
                'gps_company_bosses.name_en as boss_name_en',
                'gps_company_bosses.photo as boss_photo',

                'gps_company_assistants.name_dr as assistant_name_dr',
                'gps_company_assistants.last_name_dr as assistant_last_name_dr',
                'gps_company_assistants.last_name_en as assistant_last_name_en',
                'gps_company_assistants.name_en as assistant_name_en',
                'gps_company_assistants.photo as assistant_photo',

                'users.name as ownerName'
            )
            ->where('gps_company_licenses.id', $id)
            ->first();
        if (!$data) {
            return response()->json(['error' => 'Record not found'], 404);
        }

        $agencies = DB::table('gps_company_agencies')
            ->leftJoin('provinces as main_province', 'main_province.id', '=', 'gps_company_agencies.main_province')
            ->leftJoin('districts as main_district', 'main_district.id', '=', 'gps_company_agencies.main_district')

            ->where('company_id', $data->company_id)
            ->select(
                'gps_company_agencies.*',
                'main_province.name_dr as mainProvince',
                'main_district.district_dr as mainDistrict',
            )
            ->get();

        // Use the actual serial number from the database
        $serialNumber = $data->sn ?? 'سریال نمبر موجود نمیباشد';

        $qrContent = $data->company_name_dr . "\n" . $data->boss_name_dr . "\n" . $serialNumber;

        $barcodeGenerator = new DNS2D();
        $barcodeGenerator->setStorPath(storage_path('framework/barcodes'));

        $encodedContent = mb_convert_encoding($qrContent, 'UTF-8', 'auto');
        $barcode = $barcodeGenerator->getBarcodePNG($encodedContent, 'QRCODE');
        $barcodeDataUri = 'data:image/png;base64,' . $barcode;

        $html = View::make('gpsCompanyLicense', compact(
            'data',
            'barcodeDataUri',
            'serialNumber',
            'agencies' 
        ))->render();

        return response()->json([
            'html' => $html,
        ]);
    }
}
