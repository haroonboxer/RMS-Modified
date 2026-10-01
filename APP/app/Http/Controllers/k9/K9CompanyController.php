<?php

namespace App\Http\Controllers\k9;

use App\Http\Controllers\Controller;
use App\Http\Requests\k9\k9CompanyRequest;
use App\Models\k9\K9Company;
use Illuminate\Http\Request;
use App\Http\Resources\k9\K9CompanyResource;
use App\Models\Auth\Attachments;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class K9CompanyController extends Controller
{
    protected $user;

    public function __construct()
    {
        $this->middleware('permission:k9-company-list')->only('index');
        $this->middleware('permission:k9-company-create')->only('store');
        $this->middleware('permission:k9-company-view')->only('view');
        $this->middleware('permission:k9-company-edit')->only('update');
        $this->middleware(function ($request, $next) {
            $this->user = Auth::guard('web')->user();
            return $next($request);
        });
    }

    protected array $sortFields = [
        'k9_companies.id',
        'k9_companies.company_dr',
        'k9_companies.company_pa',
        'k9_companies.company_en',
        'k9_companies.tin',
        'k9_companies.created_at',
    ];

    protected function index(Request $request)
    {
        $sortFieldInput = $request->input('sort_field', self::DEFAULT_SORT_FIELD);
        $sortField = in_array($sortFieldInput, $this->sortFields) ? $sortFieldInput : self::DEFAULT_SORT_FIELD;
        $sortOrder = $request->input('sort_order', self::DEFAULT_SORT_ORDER);
        $query = K9Company::join('users', 'users.id', 'k9_companies.created_by')
            ->select(
                'k9_companies.id',
                'k9_companies.company_pa',
                'k9_companies.company_dr',
                'k9_companies.company_en',
                'k9_companies.address',
                'k9_companies.icon',
                'k9_companies.reason_dismissed',
                'k9_companies.created_at',
                'k9_companies.tin',
                'users.name as ownerName',
            )
            ->orderBy($sortField, $sortOrder)
            ->when($request->status == 'rejected', function ($query) {
                return $query->whereHas('K9License', function ($query) {
                    $query->where('status', 4);
                })->distinct('k9_companies.id');
            })
            ->when($request->company_dr != '', function ($query) use ($request) {
                return $query->where('k9_companies.company_dr', 'LIKE', '%' . trim($request->company_dr) . '%');
            })
            ->when($request->company_en != '', function ($query) use ($request) {
                return $query->where('k9_companies.company_en', 'LIKE', '%' . trim($request->company_en) . '%');
            });

        $perPage = $request->input('per_page') ?? self::PER_PAGE;
        $records = $query->paginate((int) $perPage);

        return K9CompanyResource::collection($records);
    }

    protected function store(k9CompanyRequest $request)
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

            $company = new K9Company();
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
                        $path = $request->file('attachments')[$i]->store('k9/attachments/' . date('Y') . '/' . date('m'), 'public');
                        $attRecord = new Attachments();
                        $attRecord->parent_id = $parent_id;
                        $attRecord->file_name = $request->file('attachments')[$i]->getClientOriginalName();
                        $attRecord->file_size = $request->file('attachments')[$i]->getSize();
                        $attRecord->form_code = 'frm-k9-company';
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

        $record = K9Company::join('users', 'users.id', '=', 'k9_companies.created_by')
            ->join('provinces', 'provinces.id', '=', 'k9_companies.created_location')
            ->join('departments', 'departments.id', '=', 'k9_companies.created_department')
            ->select(
                'k9_companies.id',
                'k9_companies.company_pa',
                'k9_companies.company_dr',
                'k9_companies.company_en',
                'k9_companies.icon',
                'k9_companies.tin',
                'k9_companies.address',
                'k9_companies.status',
                'k9_companies.reason_dismissed',
                'k9_companies.created_at',
                'users.name as createdBy',
                'provinces.name_dr as createdLocation',
                'departments.name_da as createdDepartment'
            )
            ->find($id);

        if (!$record) {
            return response()->json(['message' => 'Record not found.'], 404);
        }

        $record->attachments = Attachments::where('parent_id', $id)
            ->where('form_code', 'frm-W1')
            ->get(['id', 'file_name', 'file_size', 'path_name']);

        return response()->json([
            'record' => $record
        ], 200);
    }

    protected function update(k9CompanyRequest $request)
    {
        DB::beginTransaction();
        try {
            $company = K9Company::findOrFail($request->id);

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
            $company->updated_by = userid();
            $company->save();
            $parent_id = $company->id;

            if ($request->hasFile('attachments')) {
                $countAtt = count($request->file('attachments'));
                for ($i = 0; $i < $countAtt; $i++) {
                    if ($request->file('attachments')[$i]->isValid()) {
                        $path = $request->file('attachments')[$i]->store('k9/attachments/' . date('Y') . '/' . date('m'), 'public');
                        $attRecord = new Attachments();
                        $attRecord->parent_id = $parent_id;
                        $attRecord->file_name = $request->file('attachments')[$i]->getClientOriginalName();
                        $attRecord->file_size = $request->file('attachments')[$i]->getSize();
                        $attRecord->form_code = 'frm-k9-company';
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
}
