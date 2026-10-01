<?php

namespace App\Http\Controllers\DroneCamera;

use App\Http\Controllers\Controller;
use App\Http\Requests\drone\PersonnelDroneCameraRequest;
use App\Http\Resources\drone\PersonnelDroneCameraResource;
use Illuminate\Http\Request;
use App\Models\Auth\Attachments;
use App\Models\DroneCamera\PersonnelDroneCamera;
use Illuminate\Support\Facades\DB;

class PersonnelDroneCameraController extends Controller
{
    protected $user;
    // public function __construct()
    // {
    //     $this->middleware('permission:workshop-boss-list')->only('index');
    //     $this->middleware('permission:workshop-boss-create')->only('store');
    //     $this->middleware('permission:workshop-boss-view')->only('view');
    //     $this->middleware('permission:workshop-boss-edit')->only('edit');
    //     $this->middleware(function ($request, $next) {
    //         $this->user = Auth::guard('web')->user();
    //         return $next($request);
    //     });
    // }
    protected array $sortFields = [
        'personnel_drone_cameras.id',
        'personnel_drone_cameras.name_dr',
        'personnel_drone_cameras.last_name_dr',
        'personnel_drone_cameras.status',
        'personnel_drone_cameras.created_at'
    ];

    protected function index(Request $request)
    {
        $sortFieldInput = $request->input('sort_field', self::DEFAULT_SORT_FIELD);
        $sortField = in_array($sortFieldInput, $this->sortFields)
            ? $sortFieldInput
            : self::DEFAULT_SORT_FIELD;

        $sortOrder = $request->input('sort_order', self::DEFAULT_SORT_ORDER);

        $query = PersonnelDroneCamera::query()
            ->leftJoin('users', 'users.id', '=', 'personnel_drone_cameras.created_by')
            ->select(
                'personnel_drone_cameras.*',
                'users.name as ownerName'
            )
            ->when($request->filled('name_dr'), function ($query) use ($request) {
                $query->where(
                    'personnel_drone_cameras.name_dr',
                    'LIKE',
                    '%' . trim($request->name_dr) . '%'
                );
            })
            ->orderBy($sortField, $sortOrder);

        $perPage = (int) $request->input('per_page', self::PER_PAGE);

        $records = $query->paginate($perPage);

        return PersonnelDroneCameraResource::collection($records);
    }

    protected function store(PersonnelDroneCameraRequest $request)
    {
        DB::beginTransaction();

        try {
            $photoPath = null;

            if ($request->hasFile('photo')) {
                $photoPath = $request->file('photo')->store(
                    'personnelDroneCameras/photos/' . date('Y') . '/' . date('m'),
                    'public'
                );
            }

            $record = new PersonnelDroneCamera();

            $record->name_dr = $request->name_dr;
            $record->name_en = $request->name_en;
            $record->last_name_dr = $request->last_name_dr;
            $record->last_name_en = $request->last_name_en;
            $record->f_name_da = $request->f_name_da;
            $record->phone = $request->phone;
            $record->passport_no = $request->passport_no;
            $record->email = $request->email;
            $record->job = $request->job;
            $record->country = $request->country;
            $record->photo = $photoPath ? asset('storage/' . $photoPath) : null;

            $record->main_province = $request->main_province;
            $record->main_district = $request->main_district;
            $record->main_village = $request->main_village;

            $record->current_province = $request->current_province;
            $record->current_district = $request->current_district;
            $record->current_village = $request->current_village;

            $record->type_residence_info = $request->type_residence_info;
            $record->status = $request->status ?? 0;
            $record->reason_dismissed = $request->reason_dismissed;

            $record->created_by = userid();
            $record->created_department = departmentId();
            $record->created_location = locationId();

            $record->save();

            $parent_id = $record->id;

            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    if ($file->isValid()) {
                        $path = $file->store(
                            'personnelDroneCameras/attachments/' . date('Y') . '/' . date('m'),
                            'public'
                        );

                        Attachments::create([
                            'parent_id' => $parent_id,
                            'file_name' => $file->getClientOriginalName(),
                            'file_size' => $file->getSize(),
                            'form_code' => 'frm-PDC',
                            'path_name' => $path,
                            'created_by' => userid(),
                        ]);
                    }
                }
            }

            DB::commit();

            return response([
                'message' => 'Personnel record successfully saved!',
                'id' => encode_id($parent_id),
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response([
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    protected function view($id = 0, Request $request)
    {
        if (!is_numeric($id)) {
            $id = decode_id($id);
        }

        $record = PersonnelDroneCamera::query()
            ->leftJoin('users', 'users.id', '=', 'personnel_drone_cameras.created_by')
            ->leftJoin('provinces', 'provinces.id', '=', 'personnel_drone_cameras.created_location')
            ->leftJoin('departments', 'departments.id', '=', 'personnel_drone_cameras.created_department')

            ->leftJoin('provinces as main_province', 'main_province.id', '=', 'personnel_drone_cameras.main_province')
            ->leftJoin('districts as main_district', 'main_district.id', '=', 'personnel_drone_cameras.main_district')

            ->leftJoin('provinces as current_province', 'current_province.id', '=', 'personnel_drone_cameras.current_province')
            ->leftJoin('districts as current_district', 'current_district.id', '=', 'personnel_drone_cameras.current_district')

            ->select(
                'personnel_drone_cameras.*',
                'users.name as ownerName',
                'provinces.name_dr as createdLocation',
                'departments.name_da as createdDepartment',
                'main_province.name_dr as mainProvince',
                'main_district.district_dr as mainDistrict',
                'current_province.name_dr as currentProvince',
                'current_district.district_dr as currentDistrict'
            )
            ->where('personnel_drone_cameras.id', $id)
            ->firstOrFail();

        if (!$record) {
            return response()->json([
                'message' => 'Record not found'
            ], 404);
        }

        return response()->json($record, 200);
    }


    protected function update(Request $request)
    {
        DB::beginTransaction();

        try {
            $id = $request->id;

            if (!is_numeric($id)) {
                $id = decode_id($id);
            }

            $record = PersonnelDroneCamera::findOrFail($id);

            // Photo update (only if new file uploaded)
            if ($request->hasFile('photo')) {
                $photoPath = $request->file('photo')->store(
                    'personnelDroneCameras/photos/' . date('Y') . '/' . date('m'),
                    'public'
                );

                $record->photo = asset('storage/' . $photoPath);
            }

            $record->name_dr                    =     $request->name_dr;
            $record->name_en                    =     $request->name_en;
            $record->last_name_dr               =     $request->last_name_dr;
            $record->last_name_en               =     $request->last_name_en;
            $record->f_name_da                  =     $request->f_name_da;
            $record->phone                      =     $request->phone;
            $record->passport_no                =     $request->passport_no;
            $record->email                      =     $request->email;
            $record->job                        =     $request->job;
            $record->country                    =     $request->country;
            $record->main_province              =     $request->main_province;
            $record->main_district              =     $request->main_district;
            $record->main_village               =     $request->main_village;
            $record->current_province           =     $request->current_province;
            $record->current_district           =     $request->current_district;
            $record->current_village            =     $request->current_village;
            $record->type_residence_info        =     $request->type_residence_info;

            $record->save();

            DB::commit();

            return response([
                'message' => 'Personnel record updated successfully!',
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response([
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
