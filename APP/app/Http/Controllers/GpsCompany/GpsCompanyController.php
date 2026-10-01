<?php

namespace App\Http\Controllers\GpsCompany;

use App\Http\Controllers\Controller;
use App\Http\Resources\GpsCompanyResource\GpsCompanyResource;
use App\Models\Auth\Attachments;
use App\Models\GpsCompany\GpsCompany;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class GpsCompanyController extends Controller
{
    protected $user;
    // public function __construct()
    // {
    //     $this->middleware('permission:workshop-company-list')->only('index');
    //     $this->middleware('permission:workshop-company-create')->only('store');
    //     $this->middleware('permission:workshop-company-view')->only('view');
    //     $this->middleware('permission:workshop-company-edit')->only('update');
    //     $this->middleware('permission:workshop-company-status')->only('changeStatus');
    //     $this->middleware(function ($request, $next) {
    //         $this->user = Auth::guard('web')->user();
    //         return $next($request);
    //     });
    // }

    protected array $sortFields = [
        'gps_companies.id',
        'gps_companies.company_dr',
        'gps_companies.company_pa',
        'gps_companies.company_en',
        'gps_companies.tin',
        'gps_companies.created_at',
    ];

    protected function index(Request $request)
    {

        $sortFieldInput = $request->input('sort_field', self::DEFAULT_SORT_FIELD);
        $sortField = in_array($sortFieldInput, $this->sortFields) ? $sortFieldInput : self::DEFAULT_SORT_FIELD;
        $sortOrder = $request->input('sort_order', self::DEFAULT_SORT_ORDER);
        $query = GpsCompany::join('users', 'users.id', 'gps_companies.created_by')
            ->select(
                'gps_companies.id',
                'gps_companies.company_pa',
                'gps_companies.company_dr',
                'gps_companies.company_en',
                'gps_companies.address',
                'gps_companies.icon',
                'gps_companies.reason_dismissed',
                'gps_companies.created_by',
                'gps_companies.created_at',
                'gps_companies.tin',
                'users.name as ownerName',
            )
            ->orderBy($sortField, $sortOrder)
            ->when($request->status == 'rejected', function ($query) {
                return $query->whereHas('workshopLicenses', function ($query) {
                    $query->where('status', 4);
                })->distinct('gps_companies.id'); // Ensure unique results within this condition
            })

            ->when($request->company_dr != '', function ($query) use ($request) {
                return $query->where('gps_companies.company_dr', 'LIKE', '%' . trim($request->company_dr) . '%');
            })
            ->when($request->company_en != '', function ($query) use ($request) {
                return $query->where('gps_companies.company_en', 'LIKE', '%' . trim($request->company_en) . '%');
            });

        $perPage = $request->input('per_page') ?? self::PER_PAGE;
        $records = $query->paginate((int) $perPage);

        return GpsCompanyResource::collection($records);
    }

    protected function store(Request $request)
    {

        DB::beginTransaction();
        try {
            $iconPath = '';
            if ($request->hasFile('icon') && $request->file('icon')->isValid()) {
                $iconPath = Storage::disk('attachments')->put(
                    'user/' . date('Y') . '/' . date('m'),
                    $request->file('icon')
                );
                $iconPath = asset('storage/' . $iconPath);
            }


            $company = new GpsCompany();
            $company->company_pa = $request->company_pa;
            $company->company_dr = $request->company_dr;
            $company->company_en = $request->company_en;
            $company->address = $request->address;
            $company->tin = $request->tin;
            $company->icon = $iconPath;
            $company->created_by = userid();
            $company->created_department = departmentId();
            $company->created_location = locationId();
            $company->created_at = now();
            $company->save();
            $parent_id = $company->id;

            if ($request->hasFile('attachments')) {
                $countAtt = count($request->file('attachments'));
                for ($i = 0; $i < $countAtt; $i++) {
                    if ($request->file('attachments')[$i]->isValid()) {
                        $path = $request->file('attachments')[$i]->store('gpsCompanies/attachments/' . date('Y') . '/' . date('m'), 'public');
                        $attRecord = new Attachments();
                        $attRecord->parent_id = $parent_id;
                        $attRecord->file_name = $request->file('attachments')[$i]->getClientOriginalName();
                        $attRecord->file_size = $request->file('attachments')[$i]->getSize();
                        $attRecord->form_code = 'frm-gps-company';
                        $attRecord->path_name = $path;
                        $attRecord->created_by = userid();
                        $attRecord->save();
                    }
                }
            }
            DB::commit();
            return response()->json([
                'message' => 'Company created successfully.',
                'id' => $company->id
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response([
                'message' => 'Record not updated please check!',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    protected function view($id = 0, Request $request)
    {
        if (!is_numeric($id)) {
            $id = decode_id($id);
        }

        $record = GpsCompany::join('users', 'users.id', '=', 'gps_companies.created_by')
            ->join('provinces', 'provinces.id', '=', 'gps_companies.created_location')
            ->join('departments', 'departments.id', '=', 'gps_companies.created_department')
            ->select(
                'gps_companies.id',
                'gps_companies.company_pa',
                'gps_companies.company_dr',
                'gps_companies.company_en',
                'gps_companies.icon',
                'gps_companies.tin',
                'gps_companies.address',
                'gps_companies.status',
                'gps_companies.reason_dismissed',
                'gps_companies.created_at',
                'users.name as createdBy',
                'provinces.name_dr as createdLocation',
                'departments.name_da as createdDepartment'
            )
            ->find($id);

        if (!$record) {
            return response()->json(['message' => 'Record not found.'], 404);
        }

        $record->attachments = Attachments::where('parent_id', $id)
            ->where('form_code', 'frm-gps-company')
            ->get(['id', 'file_name', 'file_size', 'path_name']);

        return response()->json([
            'record' => $record
        ], 200);
    }

    protected function update(Request $request)
    {
        DB::beginTransaction();
        try {
            $company = GpsCompany::findOrFail($request->id);

            if ($request->hasFile('icon')) {
                $iconPath = Storage::disk('attachments')->put('user/' . date('Y') . '/' . date('m'), $request->file('icon'));
                $iconPath = asset('storage/' . $iconPath);
            } else {
                $iconPath = $company->icon;
            }
            $company->company_pa = $request->company_pa;
            $company->company_dr = $request->company_dr;
            $company->company_en = $request->company_en;
            $company->address = $request->address;
            $company->tin = $request->tin;
            $company->icon = $iconPath;
            $company->created_by = userid();
            $company->save();
            $parent_id = $company->id;

            if ($request->hasFile('attachments')) {
                $countAtt = count($request->file('attachments'));
                for ($i = 0; $i < $countAtt; $i++) {
                    if ($request->file('attachments')[$i]->isValid()) {
                        $path = $request->file('attachments')[$i]->store('gpsCompanies/attachments/' . date('Y') . '/' . date('m'), 'public');
                        $attRecord = new Attachments();
                        $attRecord->parent_id = $parent_id;
                        $attRecord->file_name = $request->file('attachments')[$i]->getClientOriginalName();
                        $attRecord->file_size = $request->file('attachments')[$i]->getSize();
                        $attRecord->form_code = 'frm-gps-company';
                        $attRecord->path_name = $path;
                        $attRecord->created_by = userid();
                        $attRecord->save();
                    }
                }
            }

            DB::commit();
            return response()->json([
                'message' => 'Company updated successfully.',
                'id' => $company->id
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Record not updated. Please check!',
            ], 500);
        }
    }

    protected function changeStatus(Request $request)
    {
        $request->validate([
            'id' => 'required|numeric|exists:workshop_companies,id',
            'status' => 'required|boolean',
            'reason_dismissed' => 'required|string',
        ]);
        $company = GpsCompany::find($request->input('id'));
        if (!$company) {
            return response()->json([
                'message' => 'Company not found.',
            ], 404);
        }
        $parent_id = $company->id;

        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                if ($file->isValid()) {
                    $path = $file->store('gpsCompanies/attachments/' . date('Y') . '/' . date('m'), 'public');

                    $attRecord = new Attachments();
                    $attRecord->parent_id = $parent_id;
                    $attRecord->file_name = $file->getClientOriginalName();
                    $attRecord->file_size = $file->getSize();
                    $attRecord->form_code = 'frm-gps-company';
                    $attRecord->path_name = $path;
                    $attRecord->created_by = userid();
                    $attRecord->save();
                }
            }
        }

        $company->status = (int) $request->input('status');
        $company->reason_dismissed = $request->input('reason_dismissed');
        $company->save();

        return response()->json([
            'message' => 'Status updated successfully.',
        ], 200);
    }
}
