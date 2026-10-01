<?php

namespace App\Http\Controllers\GpsCompany;

use App\Http\Controllers\Controller;
use App\Http\Resources\GpsCompanyResource\GpsCompanyLicenseResource;
use App\Models\Auth\Attachments;
use App\Models\GpsCompany\GpsCompanyLicense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Morilog\Jalali\Jalalian;

class LicenseController extends Controller
{
    protected $user;
    const DEFAULT_SORT_FIELD = 'gps_company_licenses.id';
    const DEFAULT_SORT_ORDER = 'asc';
    const PER_PAGE = 10;

    // public function __construct()
    // {
    //     $this->middleware('permission:workshop-license-list')->only('index');
    //     $this->middleware('permission:workshop-license-create')->only('store');
    //     $this->middleware('permission:workshop-license-view')->only('view');
    //     $this->middleware('permission:workshop-license-edit')->only('update');
    //     $this->middleware(function ($request, $next) {
    //         $this->user = Auth::guard('web')->user();
    //         return $next($request);
    //     });
    // }

    protected array $sortFields = [
        'gps_company_licenses.id',
        'gps_company_licenses.issue_date',
        'gps_company_licenses.validity_date',
        'gps_company_licenses.fee',
    ];

    public function index(Request $request)
    {
        $sortFieldInput = $request->input('sort_field', self::DEFAULT_SORT_FIELD);
        $sortField = in_array($sortFieldInput, $this->sortFields) ? $sortFieldInput : self::DEFAULT_SORT_FIELD;
        $sortOrder = $request->input('sort_order', self::DEFAULT_SORT_ORDER);
        $companyId = $request->has('company_id') ? decode_id($request->company_id) : null;

        // $query = GpsCompanyLicense::join('users', 'users.id', 'gps_company_licenses.created_by')
        //     ->join('gps_companies', 'gps_companies.id', 'gps_company_licenses.company_id')
        //     ->join('departments', 'departments.id', 'gps_company_licenses.created_department')
        //     ->join('provinces', 'provinces.id', 'gps_company_licenses.created_location')
        //     ->leftjoin('gps_company_agencies', 'gps_company_agencies.id', 'gps_company_licenses.activity_type')
        //     // ->join('provinces as main_province', 'main_province.id', 'gps_company_agencies.main_province')
        //     ->select(
        //         'gps_company_licenses.*',
        //         'users.name as ownerName',
        //         'gps_company_agencies.name_dr as gpsCompanyAgencyName',
        //         'gps_company_agencies.agency_manager',
        //         'gps_company_agencies.main_province as main_province_name',
        //         // 'main_province.name_dr as mainProvinceName',
        //     )
        $query = GpsCompanyLicense::join(
            'users',
            'users.id',
            '=',
            'gps_company_licenses.created_by'
        )
            ->join(
                'departments',
                'departments.id',
                '=',
                'gps_company_licenses.created_department'
            )
            ->leftJoin(
                'gps_company_agencies',
                'gps_company_agencies.id',
                '=',
                'gps_company_licenses.agency_id'
            )
            ->leftJoin(
                'provinces',
                'provinces.id',
                '=',
                'gps_company_agencies.main_province'
            )
            ->leftJoin(
                'districts',
                'districts.id',
                '=',
                'gps_company_agencies.main_district'
            )
            ->select(
                'gps_company_licenses.*',
                'gps_company_agencies.agency_manager as gpsCompanyAgencyName',
                'gps_company_agencies.main_village',
                'provinces.name_dr as mainProvinceName',
                'districts.district_dr as mainDistrictName',
                'users.name as ownerName',
            )
            ->orderBy($sortField, $sortOrder)
            ->when($companyId, function ($query) use ($companyId) {
                return $query->where('gps_company_licenses.company_id', $companyId);
            })
            ->when($request->filled('license_type'), function ($query) use ($request) {
                return $query->where('gps_company_licenses.license_type', $request->license_type);
            })
            ->when($request->filled('slip_no'), function ($query) use ($request) {
                return $query->where('gps_company_licenses.fee', 'LIKE', '%' . trim($request->slip_no) . '%');
            });

        $perPage = $request->input('per_page') ?? self::PER_PAGE;
        $records = $query->paginate((int) $perPage);

        return $records;
    }

    protected function store(Request $request)
    {
        $company_id = $request->company_id ? decode_id($request->company_id) : null;

        if (!$company_id) {
            return response([
                'message' => 'Invalid company ID.',
            ], 422);
        }

        $validated = $request->validate([
            'license_type' => 'required|in:new,extend,renew',
            'issue_date' => 'required',
            'validity_date' => 'required',
            'activity_type' => 'required',
            'hanging_date' => 'required',
            'fee' => 'required|numeric',
            'bank_account_number' => 'required|numeric',
        ]);

        $record = new GpsCompanyLicense();
        $record->license_type = $validated['license_type'];
        $record->issue_date = $validated['issue_date'];
        $record->validity_date = $validated['validity_date'];
        if ($validated['activity_type'] !== 'central_license') {
            $record->activity_type = $validated['activity_type'];
            $record->agency_id = $validated['activity_type'];
        }
        $record->fee = $validated['fee'];
        $record->hanging_date = $validated['hanging_date'];
        $record->bank_account_number = $validated['bank_account_number'];
        $record->company_id = (int) $company_id;
        $record->created_by = userid();
        $record->created_department = departmentId();
        $record->created_location = locationId();
        $record->save();

        $parent_id = $record->id;

        // Generate serial number like AVWL-2025-000001
        $currentYear = Jalalian::now()->getYear();
        $serialNumber = 'AVWL-' . $currentYear . '-' . str_pad($parent_id, 6, '0', STR_PAD_LEFT);

        // Update the record with generated serial number
        $record->sn = $serialNumber;
        $record->save();

        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $attachment) {
                if ($attachment->isValid()) {
                    $path = $attachment->store('GpsCompanyLicense/attachments/' . date('Y') . '/' . date('m'), 'public');

                    $attRecord = new Attachments;
                    $attRecord->parent_id = $parent_id;
                    $attRecord->file_name = $attachment->getClientOriginalName();
                    $attRecord->file_size = $attachment->getSize();
                    $attRecord->form_code = 'frm-gps-company-license';
                    $attRecord->path_name = $path;
                    $attRecord->created_by = userid();
                    $attRecord->save();
                }
            }
        }

        return response([
            'message' => 'License successfully saved!',
            'id' => encode_id($parent_id),
        ], 200);
    }


    protected function view($id)
    {
        $license = GpsCompanyLicense::join('users', 'users.id', '=', 'gps_company_licenses.created_by')
            ->join('provinces', 'provinces.id', '=', 'gps_company_licenses.created_location')
            ->join('departments', 'departments.id', '=', 'gps_company_licenses.created_department')
            ->leftjoin('gps_company_agencies', 'gps_company_agencies.id', 'gps_company_licenses.activity_type')
            ->select(
                'gps_company_licenses.id',
                'gps_company_licenses.license_type',
                'gps_company_licenses.issue_date',
                'gps_company_licenses.validity_date',
                'gps_company_licenses.activity_type',
                'gps_company_licenses.fee',
                'gps_company_licenses.hanging_date',
                'gps_company_licenses.bank_account_number',
                'gps_company_licenses.status',
                'gps_company_licenses.created_at',
                'users.name as ownerName',
                'provinces.name_dr as createdLocation',
                'departments.name_da as createdDepartment',
                'gps_company_agencies.name_dr as gpsCompanyAgencyName',
            )
            ->where('gps_company_licenses.id', $id)
            ->firstOrFail();

        return new GpsCompanyLicenseResource($license);
    }

    protected function update(Request $request, $id)
    {

        $validated = $request->validate([
            'license_type' => 'required|in:new,extend,renew',
            'issue_date' => 'required',
            'validity_date' => 'required',
            'activity_type' => 'required',
            'hanging_date' => 'required',
            'fee' => 'required|numeric',
            'bank_account_number' => 'required|numeric',
        ]);

        DB::beginTransaction();
        try {
            $id = (int) $id;
            $license = GpsCompanyLicense::findOrFail($id);

            $license->license_type = $validated['license_type'];
            $license->issue_date = $validated['issue_date'];
            $license->validity_date = $validated['validity_date'];
            // $license->activity_type =
            //     empty($validated['activity_type']) || $validated['activity_type'] === 'central_license'
            //     ? null
            //     : $validated['activity_type'];
            // $license->agency_id = $validated['activity_type'];
            if ($validated['activity_type'] !== 'central_license') {
                $license->activity_type = $validated['activity_type'];
                $license->agency_id = $validated['activity_type'];
            }
            $license->fee = $validated['fee'];
            $license->hanging_date = $validated['hanging_date'];
            $license->bank_account_number = $validated['bank_account_number'];
            $license->company_id = $request->company_id ? (int) decode_id($request->company_id) : null;
            $license->created_by = userid();
            $license->created_department = departmentId();
            $license->created_location = locationId();
            $license->update();

            // $license->update([
            //     'license_type' => $request->license_type,
            //     'issue_date' => $request->issue_date,
            //     'validity_date' => $request->validity_date,
            //     'activity_type' => $request->activity_type === 'central_license' ? null : $request->activity_type,
            //     'fee' => $request->fee,
            //     'hanging_date' => $request->hanging_date,
            //     'bank_account_number' => $request->bank_account_number,
            //     'company_id' => $request->company_id ? (int) decode_id($request->company_id) : null,
            // ]);

            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    if ($file->isValid()) {
                        $path = $file->store(
                            'GpsCompanyLicense/attachments/' . date('Y') . '/' . date('m'),
                            'public'
                        );
                        $attRecord = new Attachments;
                        $attRecord->parent_id = $id;
                        $attRecord->file_name = $file->getClientOriginalName();
                        $attRecord->file_size = $file->getSize();
                        $attRecord->form_code = 'frm-gps-company-license';
                        $attRecord->path_name = $path;
                        $attRecord->created_by = userid();
                        $attRecord->save();
                    }
                }
            }
            DB::commit();
            return response([
                'message' => 'Record successfully updated!',
                'id' => encode_id($license->id),
            ], 200);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response([
                'message' => 'An error occurred while updating the record.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    protected function changeStatus(Request $request)
    {
        $request->validate([
            'id' => 'required|numeric|exists:gps_company_licenses,id',
            'status' => 'required',
        ]);

        $license = GpsCompanyLicense::find($request->input('id'));
        if (!$license) {
            return response()->json([
                'message' => 'License not found.',
            ], 404);
        }
        $license->status = (int) $request->input('status');
        $license->save();
        return response()->json([
            'message' => 'Status updated successfully.',
            'id' => encode_id($license->id),
        ], 200);
    }


    protected function changeStatusOfPrint(Request $request)
    {
        $request->validate([
            'id' => 'required|numeric|exists:gps_company_licenses,id',
            'printed' => 'required',
        ]);

        $license = GpsCompanyLicense::find($request->input('id'));
        if (!$license) {
            return response()->json([
                'message' => 'License not found.',
            ], 404);
        }
        $license->printed = (int) $request->input('printed');
        $license->save();
        return response()->json([
            'message' => 'printed status updated successfully.',
            'id' => encode_id($license->id),
        ], 200);
    }
}
