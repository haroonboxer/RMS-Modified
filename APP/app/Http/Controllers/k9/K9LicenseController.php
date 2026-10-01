<?php

namespace App\Http\Controllers\k9;

use App\Http\Controllers\Controller;
use App\Http\Resources\k9\k9LicenseResource;
use App\Models\Auth\Attachments;
use App\Models\k9\K9License;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Morilog\Jalali\Jalalian;

class K9LicenseController extends Controller
{
    protected $user;

    protected array $sortFields = [
        'k9_licenses.id',
        'k9_licenses.issue_date',
        'k9_licenses.validity_date',
        'k9_licenses.fee',
    ];

    public function index(Request $request)
    {
        $sortFieldInput = $request->input('sort_field', self::DEFAULT_SORT_FIELD);
        $sortField = in_array($sortFieldInput, $this->sortFields) ? $sortFieldInput : self::DEFAULT_SORT_FIELD;
        $sortOrder = $request->input('sort_order', self::DEFAULT_SORT_ORDER);
        $companyId = $request->has('company_id') ? decode_id($request->company_id) : null;

        $query = K9License::leftJoin('users', 'users.id', 'k9_licenses.created_by')
            ->leftJoin('drone_camera_companies', 'drone_camera_companies.id', 'k9_licenses.company_id')
            ->leftJoin('departments', 'departments.id', 'k9_licenses.created_department')
            ->leftJoin('provinces', 'provinces.id', 'k9_licenses.created_location')
            ->select(
                'k9_licenses.*',
                'users.name as ownerName',
            )
            ->orderBy($sortField, $sortOrder)
            ->when($companyId, function ($query) use ($companyId) {
                return $query->where('k9_licenses.company_id', $companyId);
            })
            ->when($request->filled('license_type'), function ($query) use ($request) {
                return $query->where('k9_licenses.license_type', $request->license_type);
            })
            ->when($request->filled('slip_no'), function ($query) use ($request) {
                return $query->where('k9_licenses.slip_no', 'LIKE', '%' . trim($request->slip_no) . '%');
            });

        $perPage = $request->input('per_page') ?? self::PER_PAGE;
        $records = $query->paginate((int) $perPage);

        return k9LicenseResource::collection($records);
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
            'license_type' => 'required',
            'issue_date' => 'required',
            'validity_date' => 'required',
            'hanging_date' => 'required',
            'fee' => 'required',
            'bank_account_number' => 'required',
        ]);

        $record = new K9License();
        $record->license_type = $validated['license_type'];
        $record->issue_date = $validated['issue_date'];
        $record->validity_date = $validated['validity_date'];
        $record->fee = $validated['fee'];
        $record->hanging_date = $validated['hanging_date'];
        $record->bank_account_number = $validated['bank_account_number'];
        $record->company_id = (int) $company_id;
        $record->created_by = userid();
        $record->created_department = departmentId();
        $record->created_location = locationId();
        $record->save();

        $parent_id = $record->id;

        $currentYear = Jalalian::now()->getYear();
        $serialNumber = 'KRCAL-' . $currentYear . '-' . str_pad($parent_id, 6, '0', STR_PAD_LEFT);

        $record->sn = $serialNumber;
        $record->save();

        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $attachment) {
                if ($attachment->isValid()) {
                    $path = $attachment->store('k9License/attachments/' . date('Y') . '/' . date('m'), 'public');

                    $attRecord = new Attachments();
                    $attRecord->parent_id = $parent_id;
                    $attRecord->file_name = $attachment->getClientOriginalName();
                    $attRecord->file_size = $attachment->getSize();
                    $attRecord->form_code = 'frm-k9-license';
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
        $license = K9License::join('users', 'users.id', '=', 'k9_licenses.created_by')
            ->join('provinces', 'provinces.id', '=', 'k9_licenses.created_location')
            ->join('departments', 'departments.id', '=', 'k9_licenses.created_department')
            ->select(
                'k9_licenses.id',
                'k9_licenses.license_type',
                'k9_licenses.issue_date',
                'k9_licenses.validity_date',
                'k9_licenses.fee',
                'k9_licenses.hanging_date',
                'k9_licenses.bank_account_number',
                'k9_licenses.status',
                'k9_licenses.created_at',
                'users.name as ownerName',
                'provinces.name_dr as createdLocation',
                'departments.name_da as createdDepartment',
            )
            ->where('k9_licenses.id', $id)
            ->firstOrFail();

        return new K9LicenseResource($license);
    }

    protected function update(Request $request, $id)
    {

        DB::beginTransaction();
        try {
            $id = (int) $id;
            $license = K9License::findOrFail($id);

            $license->update([
                'license_type' => $request->license_type,
                'issue_date' => $request->issue_date,
                'validity_date' => $request->validity_date,
                'fee' => $request->fee,
                'hanging_date' => $request->hanging_date,
                'bank_account_number' => $request->bank_account_number,
                'company_id' => $request->company_id ? (int) decode_id($request->company_id) : null,
            ]);

            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    if ($file->isValid()) {
                        $path = $file->store(
                            'k9License/attachments/' . date('Y') . '/' . date('m'),
                            'public'
                        );

                        $attRecord = new Attachments;
                        $attRecord->parent_id = $id;
                        $attRecord->file_name = $file->getClientOriginalName();
                        $attRecord->file_size = $file->getSize();
                        $attRecord->form_code = 'frm-k9-license';
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
            'id' => 'required|numeric|exists:k9_licenses,id',
            'status' => 'required',
        ]);

        $license = K9License::find($request->input('id'));
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
}
