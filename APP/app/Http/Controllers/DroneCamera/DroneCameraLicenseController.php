<?php

namespace App\Http\Controllers\DroneCamera;

use App\Http\Controllers\Controller;
use App\Http\Resources\drone\DroneCameraLicenseResource;
use App\Models\Auth\Attachments;
use App\Models\DroneCamera\DroneCameraLicense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Morilog\Jalali\Jalalian;

class DroneCameraLicenseController extends Controller
{

    protected $user;
    const DEFAULT_SORT_FIELD = 'drone_camera_licenses.id';
    const DEFAULT_SORT_ORDER = 'asc';
    const PER_PAGE = 10;

    protected array $sortFields = [
        'drone_camera_licenses.id',
        'drone_camera_licenses.issue_date',
        'drone_camera_licenses.validity_date',
        'drone_camera_licenses.fee'
    ];

    public function index(Request $request)
    {
        $sortField = in_array($request->input('sort_field', self::DEFAULT_SORT_FIELD), $this->sortFields)
            ? $request->input('sort_field')
            : self::DEFAULT_SORT_FIELD;

        $sortOrder = $request->input('sort_order', self::DEFAULT_SORT_ORDER);

        $companyId = $request->filled('company_id') ? decode_id($request->company_id) : null;
        $personnelId = $request->filled('personnel_id') ? decode_id($request->personnel_id) : null;

        $query = DroneCameraLicense::query()
            ->join('users', 'users.id', 'drone_camera_licenses.created_by')
            ->join('departments', 'departments.id', 'drone_camera_licenses.created_department')
            ->join('provinces', 'provinces.id', 'drone_camera_licenses.created_location')
            ->select('drone_camera_licenses.*', 'users.name as ownerName')
            ->orderBy($sortField, $sortOrder);

        if ($companyId) {
            $query->leftJoin('drone_camera_companies', 'drone_camera_companies.id', 'drone_camera_licenses.company_id')
                ->where('drone_camera_licenses.company_id', $companyId);
        } elseif ($personnelId) {
            $query->leftJoin('personnel_drone_cameras', 'personnel_drone_cameras.id', 'drone_camera_licenses.personnel_id')
                ->where('drone_camera_licenses.personnel_id', $personnelId);
        } else {
            $query->whereRaw('1=0'); // fail-safe
        }

        if ($request->filled('license_type')) {
            $query->where('drone_camera_licenses.license_type', $request->license_type);
        }

        if ($request->filled('slip_no')) {
            $query->where('drone_camera_licenses.slip_no', 'LIKE', '%' . trim($request->slip_no) . '%');
        }

        $perPage = $request->input('per_page', self::PER_PAGE);
        $records = $query->paginate((int) $perPage);

        return DroneCameraLicenseResource::collection($records);
    }

    protected function store(Request $request)
    {
        $company_id = $request->company_id ? decode_id($request->company_id) : null;
        $personnel_id = $request->personnel_id ? decode_id($request->personnel_id) : null;

        if (!$company_id && !$personnel_id) {
            return response([
                'message' => 'Invalid company or personnel ID.',
            ], 422);
        }

        $validated = $request->validate([
            'license_type' => 'required',
            'issue_date' => 'required',
            'drone_model' => 'required',
            'drone_sn' => 'required',
            'validity_date' => 'required',
            'hanging_date' => 'required',
            'fee' => 'required',
            'bank_account_number' => 'required',
        ]);

        $record = new DroneCameraLicense();
        $record->license_type = $validated['license_type'];
        $record->issue_date = $validated['issue_date'];
        $record->validity_date = $validated['validity_date'];
        $record->fee = $validated['fee'];
        $record->drone_model = $validated['drone_model'];
        $record->drone_sn = $validated['drone_sn'];
        $record->hanging_date = $validated['hanging_date'];
        $record->bank_account_number = $validated['bank_account_number'];
        $record->company_id = $company_id;
        $record->personnel_id = $personnel_id;
        $record->created_by = userid();
        $record->created_department = departmentId();
        $record->created_location = locationId();
        $record->save();

        $parent_id = $record->id;

        // Generate serial number like AVWL-2026-000001
        $currentYear = Jalalian::now()->getYear();
        $serialNumber = 'DCCAL-' . $currentYear . '-' . str_pad($parent_id, 6, '0', STR_PAD_LEFT);

        // Update the record with generated serial number
        $record->sn = $serialNumber;
        $record->save();

        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $attachment) {
                if ($attachment->isValid()) {
                    $path = $attachment->store('droneLicense/attachments/' . date('Y') . '/' . date('m'), 'public');

                    $attRecord = new Attachments();
                    $attRecord->parent_id = $parent_id;
                    $attRecord->file_name = $attachment->getClientOriginalName();
                    $attRecord->file_size = $attachment->getSize();
                    $attRecord->form_code = 'frm-DC-License';
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
        $license = DroneCameraLicense::join('users', 'users.id', '=', 'drone_camera_licenses.created_by')
            ->join('provinces', 'provinces.id', '=', 'drone_camera_licenses.created_location')
            ->join('departments', 'departments.id', '=', 'drone_camera_licenses.created_department')
            ->select(
                'drone_camera_licenses.id',
                'drone_camera_licenses.license_type',
                'drone_camera_licenses.issue_date',
                'drone_camera_licenses.validity_date',
                'drone_camera_licenses.fee',
                'drone_camera_licenses.drone_model',
                'drone_camera_licenses.drone_sn',
                'drone_camera_licenses.hanging_date',
                'drone_camera_licenses.bank_account_number',
                'drone_camera_licenses.status',
                'drone_camera_licenses.created_at',
                'users.name as ownerName',
                'provinces.name_dr as createdLocation',
                'departments.name_da as createdDepartment',
            )
            ->where('drone_camera_licenses.id', $id)
            ->firstOrFail();

        return new DroneCameraLicenseResource($license);
    }

    protected function update(Request $request, $id)
    {
        // dd($request->all());
        DB::beginTransaction();
        try {
            $id = (int) $id;
            $license = DroneCameraLicense::findOrFail($id);

            $license->update([
                'license_type' => $request->license_type,
                'issue_date' => $request->issue_date,
                'validity_date' => $request->validity_date,
                'fee' => $request->fee,
                'drone_model' => $request->drone_model,
                'drone_sn' => $request->drone_sn,
                'hanging_date' => $request->hanging_date,
                'bank_account_number' => $request->bank_account_number,
                'company_id' => $request->company_id ? (int) decode_id($request->company_id) : null,
            ]);

            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    if ($file->isValid()) {
                        $path = $file->store(
                            'droneLicense/attachments/' . date('Y') . '/' . date('m'),
                            'public'
                        );

                        $attRecord = new Attachments;
                        $attRecord->parent_id = $id;
                        $attRecord->file_name = $file->getClientOriginalName();
                        $attRecord->file_size = $file->getSize();
                        $attRecord->form_code = 'frm-DC-License';
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
            'id' => 'required|numeric|exists:drone_camera_licenses,id',
            'status' => 'required',
        ]);

        $license = DroneCameraLicense::find($request->input('id'));
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


    // protected function changeStatusOfPrint(Request $request)
    // {
    //     $request->validate([
    //         'id' => 'required|numeric|exists:drone_camera_licenses,id',
    //         'printed' => 'required',
    //     ]);

    //     $license = WorkshopLicense::find($request->input('id'));
    //     if (!$license) {
    //         return response()->json([
    //             'message' => 'License not found.',
    //         ], 404);
    //     }
    //     $license->printed = (int) $request->input('printed');
    //     $license->save();
    //     return response()->json([
    //         'message' => 'printed status updated successfully.',
    //         'id' => encode_id($license->id),
    //     ], 200);
    // }
}
