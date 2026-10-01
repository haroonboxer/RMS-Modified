<?php

namespace App\Http\Controllers\k9;

use App\Http\Controllers\Controller;
use App\Http\Resources\k9\k9CardPrintResource;
use App\Models\k9\K9License;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\View;
use Milon\Barcode\DNS2D;

class K9CardPrintController extends Controller
{
    public $user;
    public array $sortFields = [
        'k9_companies.company_dr',
        'k9_licenses.license_type',
        'k9_licenses.issued_date',
        'k9_licenses.created_at',
    ];

    protected function index(Request $request)
    {
        $sortFieldInput = $request->input('sort_field', self::DEFAULT_SORT_FIELD);
        $sortField = in_array($sortFieldInput, $this->sortFields)
            ? $sortFieldInput
            : self::DEFAULT_SORT_FIELD;

        $sortOrder = $request->input('sort_order', self::DEFAULT_SORT_ORDER);
        $companyId = $request->has('company_id')
            ? decode_id($request->company_id)
            : null;

        $query = DB::table('k9_licenses')
            ->leftJoin('k9_companies', 'k9_licenses.company_id', '=', 'k9_companies.id')
            ->leftJoin('k9_bosses', 'k9_bosses.company_id', '=', 'k9_companies.id')
            ->leftJoin('k9_assistants', 'k9_assistants.company_id', '=', 'k9_companies.id')
            ->leftJoin('users', 'k9_licenses.created_by', '=', 'users.id')
            ->select(
                'k9_licenses.*',
                'k9_companies.company_dr as company_name_dr',
                'k9_bosses.name_dr as boss_name_dr',
                'k9_assistants.name_dr as assistant_name_dr',
                'users.name as ownerName'
            )
            ->whereIn('k9_licenses.status', [1, 2, 3])
            ->where('k9_licenses.printed', 0)

            ->orderBy($sortField, $sortOrder)

            // Company Filter
            ->when($companyId, function ($query) use ($companyId) {
                return $query->where('k9_licenses.company_id', $companyId);
            })

            // License Type Filter
            ->when($request->license_type != '', function ($query) use ($request) {
                return $query->where(
                    'k9_licenses.license_type',
                    'LIKE',
                    '%' . trim($request->license_type) . '%'
                );
            })

            // Company Name Search
            ->when($request->company_name_dr != '', function ($query) use ($request) {
                return $query->where(
                    'k9_companies.company_dr',
                    'LIKE',
                    '%' . trim($request->company_name_dr) . '%'
                );
            })

            // Boss Name Search
            ->when($request->boss_name_dr != '', function ($query) use ($request) {
                return $query->where(
                    'k9_bosses.name_dr',
                    'LIKE',
                    '%' . trim($request->boss_name_dr) . '%'
                );
            })

            // Assistant Name Search
            ->when($request->assistant_name_dr != '', function ($query) use ($request) {
                return $query->where(
                    'k9_assistants.name_dr',
                    'LIKE',
                    '%' . trim($request->assistant_name_dr) . '%'
                );
            })

            // Serial Number Search
            ->when($request->serial_number != '', function ($query) use ($request) {
                return $query->where(
                    'k9_licenses.serial_number',
                    'LIKE',
                    '%' . trim($request->serial_number) . '%'
                );
            });

        $perPage = $request->input('per_page') ?? self::PER_PAGE;
        $records = $query->paginate((int) $perPage);

        return k9CardPrintResource::collection($records);
    }



    public function changeStatusOfLicense(Request $request)
    {
        $request->validate([
            'id' => 'required|numeric|exists:k9_licenses,id',
            'status' => 'required',
            'reason' => [
                'required_if:status,4',
                'string',
                'max:255',
            ],
        ]);

        $printedLicense = K9License::find($request->input('id'));

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
        $data = DB::table('k9_licenses')
            ->join('k9_companies', 'k9_licenses.company_id', '=', 'k9_companies.id')
            ->join('k9_bosses', 'k9_bosses.company_id', '=', 'k9_companies.id')
            ->join('k9_assistants', 'k9_assistants.company_id', '=', 'k9_companies.id')
            ->join('provinces', 'provinces.id', '=', 'k9_licenses.created_location')
            ->join('departments', 'departments.id', '=', 'k9_licenses.created_department')
            ->leftJoin('users', 'k9_licenses.created_by', '=', 'users.id')
            ->select(
                'k9_licenses.*',
                'k9_licenses.license_type',
                'k9_companies.company_dr as company_name_dr',
                'k9_companies.company_en as company_name_en',
                'k9_companies.icon as company_icon',
                'k9_bosses.name_dr as boss_name_dr',
                'k9_bosses.name_en as boss_name_en',
                'k9_bosses.photo as boss_photo',
                'k9_assistants.name_dr as assistant_name_dr',
                'k9_assistants.name_en as assistant_name_en',
                'k9_assistants.photo as assistant_photo',
                'provinces.name_dr as createdLocation',
                'departments.name_da as createdDepartment',
                'users.name as ownerName'
            )
            ->where('k9_licenses.id', $id)
            ->first();

        if (!$data) {
            return response()->json(['error' => 'Record not found'], 404);
        }
        return response()->json($data);
    }


    public function generateIDCard($id)
    {
        $data = DB::table('k9_licenses')
            ->leftJoin('k9_companies', 'k9_licenses.company_id', '=', 'k9_companies.id')
            ->leftJoin('k9_bosses', 'k9_bosses.company_id', '=', 'k9_companies.id')
            ->leftJoin('k9_assistants', 'k9_assistants.company_id', '=', 'k9_companies.id')
            ->leftJoin('users', 'k9_licenses.created_by', '=', 'users.id')
            ->select(
                'k9_licenses.*',
                'k9_companies.company_dr as company_name_dr',
                'k9_companies.company_pa as company_name_pa',
                'k9_companies.company_en as company_name_en',
                'k9_companies.icon as company_icon',

                'k9_bosses.name_dr as boss_name_dr',
                'k9_bosses.last_name_dr as boss_last_name_dr',
                'k9_bosses.name_en as boss_name_en',
                'k9_bosses.last_name_en as boss_last_name_en',
                'k9_bosses.photo as boss_photo',

                'k9_assistants.name_dr as assistant_name_dr',
                'k9_assistants.last_name_dr as assistant_last_name_dr',
                'k9_assistants.name_en as assistant_name_en',
                'k9_assistants.last_name_en as assistant_last_name_en',
                'k9_assistants.photo as assistant_photo',

                'users.name as ownerName'
            )
            ->where('k9_licenses.id', $id)
            ->first();

        if (!$data) {
            return response()->json(['error' => 'Record not found'], 404);
        }

        // Serial number
        $serialNumber = $data->sn ?? 'سریال نمبر موجود نمیباشد';

        // Full names (important for consistency)
        $bossFullNameDr = trim(($data->boss_name_dr ?? '') . ' ' . ($data->boss_last_name_dr ?? ''));
        $assistantFullNameDr = trim(($data->assistant_name_dr ?? '') . ' ' . ($data->assistant_last_name_dr ?? ''));

        // QR Content (company-based license)
        $qrContent = $data->company_name_dr . "\n" . $bossFullNameDr . "\n" . $serialNumber;

        $barcodeGenerator = new DNS2D();
        $barcodeGenerator->setStorPath(storage_path('framework/barcodes'));

        $encodedContent = mb_convert_encoding($qrContent, 'UTF-8', 'auto');
        $barcode = $barcodeGenerator->getBarcodePNG($encodedContent, 'QRCODE');
        $barcodeDataUri = 'data:image/png;base64,' . $barcode;

        $html = View::make('k9CompanyLicense', compact(
            'data',
            'barcodeDataUri',
            'serialNumber',
            'bossFullNameDr',
            'assistantFullNameDr'
        ))->render();

        return response()->json([
            'html' => $html,
        ]);
    }
}
