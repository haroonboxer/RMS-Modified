<?php

namespace App\Http\Controllers\k9;

use App\Http\Controllers\Controller;
use App\Http\Requests\k9\k9AssistantRequest;
use App\Http\Resources\k9\k9AssistantResource;
use App\Models\Auth\Attachments;
use App\Models\k9\K9Assistant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class K9AssistantController extends Controller
{
    protected $user;


    public function __construct()
    {
        $this->middleware('permission:k9-assistant-list')->only('index');
        $this->middleware('permission:k9-assistant-create')->only('store');
        $this->middleware('permission:k9-assistant-view')->only('view');
        $this->middleware('permission:k9-assistant-edit')->only('update');
        $this->middleware(function ($request, $next) {
            $this->user = Auth::guard('web')->user();
            return $next($request);
        });
    }

    protected array $sortFields = ['k9_assistants.id', 'k9_assistants.name_dr', 'k9_assistants.email', 'k9_assistants.status', 'k9_assistants.created_at'];

    protected function index(Request $request)
    {
        $sortFieldInput = $request->input('sort_field', self::DEFAULT_SORT_FIELD);
        $sortField = in_array($sortFieldInput, $this->sortFields) ? $sortFieldInput : self::DEFAULT_SORT_FIELD;
        $sortOrder = $request->input('sort_order', self::DEFAULT_SORT_ORDER);
        $companyId = $request->filled('company_id') ? decode_id($request->input('company_id')) : null;

        $query = K9Assistant::join('users', 'users.id', '=', 'k9_assistants.created_by')
            ->select(
                'k9_assistants.id',
                'k9_assistants.name_dr',
                'k9_assistants.name_en',
                'k9_assistants.last_name_dr',
                'k9_assistants.last_name_en',
                'k9_assistants.f_name_da',
                'k9_assistants.email',
                'k9_assistants.phone',
                'k9_assistants.passport_no',
                'k9_assistants.country',
                'k9_assistants.type_residence_info',
                'k9_assistants.photo',
                'k9_assistants.main_province',
                'k9_assistants.main_district',
                'k9_assistants.main_village',
                'k9_assistants.current_province',
                'k9_assistants.current_district',
                'k9_assistants.current_village',
                'k9_assistants.status',
                'k9_assistants.created_at',
                'users.name as ownerName',
            )
            ->orderBy($sortField, $sortOrder)
            ->when($companyId, function ($query) use ($companyId) {
                return $query->where('k9_assistants.company_id', $companyId);
            })
            ->when($request->filled('name_dr'), function ($query) use ($request) {
                return $query->where('k9_assistants.name_dr', 'LIKE', '%' . trim($request->input('name_dr')) . '%');
            })
            ->when($request->filled('email'), function ($query) use ($request) {
                return $query->where('k9_assistants.email', 'LIKE', '%' . trim($request->input('email')) . '%');
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

    protected function store(k9AssistantRequest $request)
    {

        DB::beginTransaction();
        try {
            $company_id = $request->company_id ? (int) decode_id($request->company_id) : null;

            $photoPath = null;
            if ($request->hasFile('photo') && $request->file('photo')->isValid()) {
                $photoPath = $request->file('photo')->store('K9Assistant/photos/' . date('Y') . '/' . date('m'), 'public');
            }
            $record = K9Assistant::create([
                'name_dr' => $request->name_dr,
                'name_en' => $request->name_en,
                'last_name_dr' => $request->last_name_dr,
                'last_name_en' => $request->last_name_en,
                'f_name_da' => $request->f_name_da,
                'email' => $request->email,
                'phone' => $request->phone,
                'passport_no' => $request->passport_no,
                'country' => $request->country,
                'type_residence_info' => $request->type_residence_info,
                'photo' => $photoPath ? asset('storage/' . $photoPath) : null,
                'main_province' => $request->main_province,
                'main_district' => $request->main_district,
                'main_village' => $request->main_village,
                'current_province' => $request->current_province,
                'current_district' => $request->current_district,
                'current_village' => $request->current_village,
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
                        $path = $request->file('attachments')[$i]->store('assistants/attachments/' . date('Y') . '/' . date('m'), 'public');
                        $attRecord = new Attachments;
                        $attRecord->parent_id = $parent_id;
                        $attRecord->file_name = $request->file('attachments')[$i]->getClientOriginalName();
                        $attRecord->file_size = $request->file('attachments')[$i]->getSize();
                        $attRecord->form_code = 'frm-k9-assistant';
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

        $assistant = K9Assistant::join('users', 'users.id', '=', 'k9_assistants.created_by')
            ->join('provinces', 'provinces.id', '=', 'k9_assistants.created_location')
            ->join('departments', 'departments.id', '=', 'k9_assistants.created_department')
            ->leftJoin('provinces as main_province', 'main_province.id', '=', 'k9_assistants.main_province')
            ->leftJoin('districts as main_district', 'main_district.id', '=', 'k9_assistants.main_district')
            ->leftJoin('provinces as current_province', 'current_province.id', '=', 'k9_assistants.current_province')
            ->leftJoin('districts as current_district', 'current_district.id', '=', 'k9_assistants.current_district')
            ->select(
                'k9_assistants.*',
                'users.name as ownerName',
                'provinces.name_dr as createdLocation',
                'departments.name_da as createdDepartment',
                'main_province.name_dr as mainProvince',
                'main_district.district_dr as mainDistrict',
                'current_province.name_dr as currentProvince',
                'current_district.district_dr as currentDistrict'
            )
            ->where('k9_assistants.id', $id)
            ->firstOrFail();
        return new k9AssistantResource($assistant);
    }

    protected function update(K9AssistantRequest $request, $id)
    {

        DB::beginTransaction();
        try {
            $id = (int) $id;
            $assistant = K9Assistant::findOrFail($id);

            $assistant->update([
                'name_dr' => $request->name_dr,
                'name_en' => $request->name_en,
                'last_name_dr' => $request->last_name_dr,
                'last_name_en' => $request->last_name_en,
                'f_name_da' => $request->f_name_da,
                'email' => $request->email,
                'phone' => $request->phone,
                'passport_no' => $request->passport_no,
                'country' => $request->country,
                'type_residence_info' => $request->type_residence_info,
                'main_province' => $request->main_province,
                'main_district' => $request->main_district,
                'main_village' => $request->main_village,
                'current_province' => $request->current_province,
                'current_district' => $request->current_district,
                'current_village' => $request->current_village,
                'company_id' => $request->company_id ? (int) decode_id($request->company_id) : null,
                'updated_by' => userid(),
            ]);

            if ($request->hasFile('photo') && $request->file('photo')->isValid()) {
                $photoPath = $request->file('photo')->store('K9Assistant/photos/' . date('Y') . '/' . date('m'), 'public');
                $assistant->photo = asset('storage/' . $photoPath);
                $assistant->save();
            }

            if ($request->hasFile('attachments')) {
                Attachments::where('parent_id', $id)
                    ->where('form_code', 'frm-k9-assistant')
                    ->delete();
                $countAtt = count($request->file('attachments'));
                for ($i = 0; $i < $countAtt; $i++) {
                    if ($request->file('attachments')[$i]->isValid()) {
                        $path = $request->file('attachments')[$i]->store('assistants/attachments/' . date('Y') . '/' . date('m'), 'public');
                        $attRecord = new Attachments;
                        $attRecord->parent_id = $id;
                        $attRecord->file_name = $request->file('attachments')[$i]->getClientOriginalName();
                        $attRecord->file_size = $request->file('attachments')[$i]->getSize();
                        $attRecord->form_code = 'frm-k9-assistant';
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
}
