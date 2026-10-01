<?php

namespace App\Http\Controllers\GpsCompany;

use App\Http\Controllers\Controller;
use App\Http\Resources\GpsCompanyResource\GpsCompanyAgencyResource;
use App\Models\Auth\Attachments;
use App\Models\GpsCompany\GpsCompany;
use App\Models\GpsCompany\GpsCompanyAgency;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GpsCompanyAgencyController extends Controller
{
    // public function __construct()
    // {
    //     $this->middleware('permission:workshop-assistant-list')->only('index');
    //     $this->middleware('permission:workshop-assistant-create')->only('store');
    //     $this->middleware('permission:workshop-assistant-view')->only('view');
    //     $this->middleware('permission:workshop-assistant-edit')->only('update');
    //     $this->middleware(function ($request, $next) {
    //         $this->user = Auth::guard('web')->user();
    //         return $next($request);
    //     });
    // }

    protected array $sortFields = ['gps_company_agencies.id', 'gps_company_agencies.name_dr', 'gps_company_agencies.email', 'gps_company_agencies.status', 'gps_company_agencies.created_at'];

    protected function index(Request $request)
    {
        $sortFieldInput = $request->input('sort_field', self::DEFAULT_SORT_FIELD);
        $sortField = in_array($sortFieldInput, $this->sortFields) ? $sortFieldInput : self::DEFAULT_SORT_FIELD;
        $sortOrder = $request->input('sort_order', self::DEFAULT_SORT_ORDER);
        $companyId = $request->filled('company_id') ? decode_id($request->input('company_id')) : null;

        $query = GpsCompanyAgency::join('users', 'users.id', '=', 'gps_company_agencies.created_by')
            ->leftJoin('gps_companies', "gps_companies.id", 'gps_company_agencies.company_id')
            ->leftJoin('provinces as main_province', "main_province.id", 'gps_company_agencies.main_province')
            ->leftJoin('districts as main_district', "main_district.id", 'gps_company_agencies.main_district')
            ->select(
                'gps_company_agencies.id',
                'gps_company_agencies.name_dr',
                'gps_company_agencies.name_pa',
                'gps_company_agencies.name_en',
                'gps_company_agencies.photo',
                'gps_company_agencies.agency_manager',
                'gps_company_agencies.phone',
                'gps_company_agencies.main_province',
                'gps_company_agencies.main_district',
                'gps_company_agencies.main_village',
                'gps_company_agencies.current_province',
                'gps_company_agencies.current_district',
                'gps_company_agencies.current_village',
                'gps_company_agencies.status',
                'gps_company_agencies.created_at',
                'users.name as ownerName',
                'gps_companies.company_dr as gpsCompanyName',
                'main_province.name_dr as mainProvinceName',
                'main_district.district_dr as mainDistrictName',
            )
            ->orderBy($sortField, $sortOrder)
            ->when($companyId, function ($query) use ($companyId) {
                return $query->where('gps_company_agencies.company_id', $companyId);
            })
            ->when($request->filled('name_dr'), function ($query) use ($request) {
                return $query->where('gps_company_agencies.name_dr', 'LIKE', '%' . trim($request->input('name_dr')) . '%');
            })
            ->when($request->filled('agencyNameEn'), function ($query) use ($request) {
                return $query->where('gps_company_agencies.name_en', 'LIKE', '%' . trim($request->input('agencyNameEn')) . '%');
            });
        $perPage = (int) $request->input('per_page', self::PER_PAGE);
        $records = $query->paginate($perPage);
        return response()->json([
            'data' => $records->items(),
            'meta' => [
                'total' => $records->total(),
                'per_page' => $records->perPage(),
                'current_page' => $records->currentPage(),
                'last_page' => $records->lastPage(),
                'from' => $records->firstItem(),
                'to' => $records->lastItem(),
            ]
        ]);
    }

    protected function allGpsCompanyAgency($id)
    {
        $id = $id ? (int) decode_id($id) : null;
        $data = GpsCompanyAgency::where('company_id', $id)
            ->leftJoin('provinces as main_province', "main_province.id", 'gps_company_agencies.main_province')
            ->select('gps_company_agencies.id', 'agency_manager', 'main_province.name_dr as mainProvinceName',)->get();

        return response()->json(['status' => true, 'data' => $data]);
    }

    protected function store(Request $request)
    {
        $company_id = $request->company_id ? (int) decode_id($request->company_id) : null;
        DB::beginTransaction();
        try {
            $photoPath = null;
            if ($request->hasFile('photo') && $request->file('photo')->isValid()) {
                $photoPath = $request->file('photo')->store('GpsCompanyAgencys/photos/' . date('Y') . '/' . date('m'), 'public');
            }
            $record = GpsCompanyAgency::create([
                'name_dr' => $request->name_dr,
                'name_pa' => $request->name_pa,
                'name_en' => $request->name_en,
                'main_province' => $request->main_province,
                'main_district' => $request->main_district,
                'main_village' => $request->main_village,
                'current_province' => $request->current_province,
                'current_district' => $request->current_district,
                'current_village' => $request->current_village,
                'agency_manager' => $request->agency_manager,
                'phone' => $request->phone,
                'photo' => $photoPath ? asset('storage/' . $photoPath) : null,
                'company_id' => $company_id,
                'created_by' => userid(),
                'created_department' => departmentId(),
                'created_location' => locationId(),
            ]);

            $parent_id = $record->id;
            if ($request->hasFile('attachments')) {
                $countAtt = count($request->file('attachments'));
                for ($i = 0; $i < $countAtt; $i++) {
                    if ($request->file('attachments')[$i]->isValid()) {
                        $path = $request->file('attachments')[$i]->store('GpsCompanyAgencys/attachments/' . date('Y') . '/' . date('m'), 'public');
                        $attRecord = new Attachments;
                        $attRecord->parent_id = $parent_id;
                        $attRecord->file_name = $request->file('attachments')[$i]->getClientOriginalName();
                        $attRecord->file_size = $request->file('attachments')[$i]->getSize();
                        $attRecord->form_code = 'frm-gps-company-agency';
                        $attRecord->path_name = $path;
                        $attRecord->created_by = userid();
                        $attRecord->save();
                    }
                }
            }
            DB::commit();
            return response([
                'message' => 'Record successfully saved!',
                'id' => encode_id($record->id),
            ], 200);
        } catch (\Throwable $e) {
            DB::rollBack();
            dd($e);
            return response(['message' => $e], 500);
        }
    }

    protected function view($id)
    {
        $data = GpsCompanyAgency::join('users', 'users.id', '=', 'gps_company_agencies.created_by')
            ->join('provinces', 'provinces.id', '=', 'gps_company_agencies.created_location')
            ->join('departments', 'departments.id', '=', 'gps_company_agencies.created_department')
            ->leftJoin('provinces as main_province', "main_province.id", 'gps_company_agencies.main_province')
            ->leftJoin('districts as main_district', "main_district.id", 'gps_company_agencies.main_district')
            ->leftJoin('provinces as current_province', "current_province.id",  'gps_company_agencies.current_province')
            ->leftJoin('districts as current_district', "current_district.id", 'gps_company_agencies.current_district')
            ->select(
                'gps_company_agencies.*',
                'users.name as ownerName',
                'provinces.name_dr as createdLocation',
                'departments.name_da as createdDepartment',
                'main_province.name_dr as mainProvince',
                'main_district.district_dr as mainDistrict',
                'current_province.name_dr as currentProvince',
                'current_district.district_dr as currentDistrict'
            )
            ->where('gps_company_agencies.id', $id)
            ->first();
        // return response()->json(['status' => true, 'data' => $data]);
        return new GpsCompanyAgencyResource($data);
    }

    protected function update(Request $request, $id)
    {
        $company_id = $request->company_id ? (int) decode_id($request->company_id) : null;

        DB::beginTransaction();
        try {

            $photoPath = null;
            if ($request->hasFile('photo') && $request->file('photo')->isValid()) {
                $photoPath = $request->file('photo')->store('GpsCompanyAgencys/photos/' . date('Y') . '/' . date('m'), 'public');
            }

            $id = (int) $id;
            $assistant = GpsCompanyAgency::findOrFail($id);

            $assistant->update([
                'name_dr' => $request->name_dr,
                'name_pa' => $request->name_pa,
                'name_en' => $request->name_en,
                'main_province' => $request->main_province,
                'main_district' => $request->main_district,
                'main_village' => $request->main_village,
                'current_province' => $request->current_province,
                'current_district' => $request->current_district,
                'current_village' => $request->current_village,
                'agency_manager' => $request->agency_manager,
                'phone' => $request->phone,
                'photo' => $photoPath ? asset('storage/' . $photoPath) : null,
                // 'company_id' => $company_id,
                'updated_by' => userid(),
                'updated_department' => departmentId(),
                'updated_location' => locationId(),
            ]);

            if ($request->hasFile('photo') && $request->file('photo')->isValid()) {
                $photoPath = $request->file('photo')->store('GpsCompanyAgencys/photos/' . date('Y') . '/' . date('m'), 'public');
                $assistant->photo = asset('storage/' . $photoPath);
                $assistant->save();
            }

            if ($request->hasFile('attachments')) {
                Attachments::where('parent_id', $id)
                    ->where('form_code', 'frm-gps-company-agency')
                    ->delete(); // Delete existing attachments for this record
                $countAtt = count($request->file('attachments'));
                for ($i = 0; $i < $countAtt; $i++) {
                    if ($request->file('attachments')[$i]->isValid()) {
                        $path = $request->file('attachments')[$i]->store('GpsCompanyAgencys/attachments/' . date('Y') . '/' . date('m'), 'public');
                        $attRecord = new Attachments;
                        $attRecord->parent_id = $id;
                        $attRecord->file_name = $request->file('attachments')[$i]->getClientOriginalName();
                        $attRecord->file_size = $request->file('attachments')[$i]->getSize();
                        $attRecord->form_code = 'frm-gps-company-agency';
                        $attRecord->path_name = $path;
                        $attRecord->created_by = userid();
                        $attRecord->save();
                    }
                }
            }

            DB::commit();
            return response([
                'message' => 'Record successfully updated!',
                'id' => encode_id($assistant->id),
            ], 200);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response(['message' => $e], 500);
        }
    }

    protected function changeStatus(Request $request)
    {
        $request->validate([
            'id' => 'required|numeric|exists:assistants,id',
            'status' => 'required|boolean',
            'reason_dismissed' => 'required|string'
        ]);

        $assistant = GpsCompanyAgency::find($request->input('id'));
        if (!$assistant) {
            return response()->json([
                'message' => 'Assistant not found.',
            ], 404);
        }
        $parent_id = $assistant->id;
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                if ($file->isValid()) {
                    $path = $file->store('GpsCompanyAgencys/attachments/' . date('Y') . '/' . date('m'), 'public');

                    $attRecord = new Attachments();
                    $attRecord->parent_id = $parent_id;
                    $attRecord->file_name = $file->getClientOriginalName();
                    $attRecord->file_size = $file->getSize();
                    $attRecord->form_code = 'frm-gps-company-agency';
                    $attRecord->path_name = $path;
                    $attRecord->created_by = userid();
                    $attRecord->save();
                }
            }
        }

        $assistant->status = (int) $request->input('status');
        $assistant->reason_dismissed = $request->input('reason_dismissed');
        $assistant->save();
        return response()->json([
            'message' => 'Status updated successfully.',
        ], 200);
    }

    protected function createButton(Request $request)
    {
        $companyId = $request->has('id') ? decode_id($request->id) : null;
        $query = GpsCompanyAgency::select('gps_company_agencies.status')
            ->when($companyId, function ($query) use ($companyId) {
                return $query->where('gps_company_agencies.company_id', $companyId)
                    ->where('gps_company_agencies.status', 1);
            });
        $records = $query->get();
        return GpsCompanyAgencyResource::collection($records);
    }
}
