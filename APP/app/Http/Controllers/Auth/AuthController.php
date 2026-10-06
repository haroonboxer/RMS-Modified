<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Auth;
use Illuminate\Http\Request;
use App\Models\User;
use Exception;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Support\Facades\Cache;

class AuthController extends Controller
{


    public function ssoLogin(Request $request)
    {

        $token = $request->input('token');

        if (!$token) {
            return response()->json([
                "message" => "Token missing."
            ], 401);
        }

        try {

            /*
             |--------------------------------------------------------------------------
             | Validate SSO Token
             |--------------------------------------------------------------------------
             */
            $parts = explode('.', $token);

            $header = json_decode(
                base64_decode(strtr($parts[0], '-_', '+/')),
                true
            );

            logger()->info('JWT HEADER', [
                'header' => $header
            ]);
            $decoded = JWT::decode(
                $token,
                new Key(
                    'Laravel-React-Project-Secrute-Key-2027',
                    'HS256'
                )
            );

            /*
             |--------------------------------------------------------------------------
             | Generate Laravel JWT
             |--------------------------------------------------------------------------
             */

            $laravelToken = $this->generateLaravelToken($decoded);

            /*
             |--------------------------------------------------------------------------
             | Store Laravel JWT temporarily
             |--------------------------------------------------------------------------
             */
            $userId = $decoded->{'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'} ?? null;

            session([
                'sso_token' => $laravelToken
            ]);




            if (!$userId) {
                dd('User ID not found');
            }

            Cache::put(
                'sso_token_' . $userId,
                $token,
                now()->addMinutes(10)
            );



            $redirectToReact = env('redirectoToReact');
            // dd($redirectToReact);
            return redirect($redirectToReact . "/auth/callback");
        } catch (Exception $ex) {

            dd([
                "message" => $ex->getMessage(),
                "line" => $ex->getLine(),
                "file" => $ex->getFile()
            ]);
        }
    }
    /**
     * Generate Laravel JWT
     */
    private function generateLaravelToken($decoded)
    {
        // Roles
        $roles = $decoded->Role ?? [];

        if (is_string($roles)) {
            $roles = json_decode($roles, true);
        }

        if (!is_array($roles)) {
            $roles = [];
        }

        // Claims
        $claims = $decoded->role_claims ?? [];

        if (is_string($claims)) {
            $claims = json_decode($claims, true);
        }

        if (!is_array($claims)) {
            $claims = [];
        }

        // Permissions
        $permissions = [];

        foreach ($claims as $claim) {
            if (
                isset($claim['ClaimType'], $claim['ClaimValue']) &&
                filter_var($claim['ClaimValue'], FILTER_VALIDATE_BOOLEAN)
            ) {
                $permissions[] = $claim['ClaimType'];
            }
        }

        // Projects
        $projects = $decoded->Projects ?? [];

        if (is_string($projects)) {
            $projects = json_decode($projects, true);
        }

        if (!is_array($projects)) {
            $projects = [];
        }

        // UserInfo
        $UserInfo = $decoded->UserInfo ?? $decoded->user_info ?? null;

        if (is_string($UserInfo)) {
            $userinfo = json_decode($UserInfo, true);
        } else {
            $userinfo = $UserInfo;
        }

        if (!is_array($userinfo)) {
            $userinfo = [];
        }

        $payload = [

            // User
            "id" => $userinfo['Id'] ?? "",

            "name" => $userinfo['Name'] ?? "",

            "LName" => $userinfo['UserNameInLocalLang'] ?? "",

            "username" => $userinfo['UserName'] ?? "",

            "email" => $userinfo['email'] ?? "",

            "image" => $userinfo['image'] ?? "",

            "signature" => $userinfo['signature'] ?? "",

            "departmentId" => $userinfo['DepartmentId'] ?? "",

            "departmentName" => $userinfo['DepartmentName'] ?? "",

            "provinceId" => $userinfo['ProvinceId'] ?? "",

            "provinceName" => $userinfo['provinceName'] ?? "",

            // Roles & permissions
            "role" => $roles,

            "permissions" => $permissions,

            // Projects
            "projects" => $projects,

            // JWT
            "iat" => time(),

            "exp" => time() + 3600,
        ];

        return JWT::encode(
            $payload,
            "Laravel-React-Project-Secrute-Key-2027",
            "HS256"
        );
    }
    public function getReactToken(Request $request)
    {

        // return "hello world";
        $token = session('sso_token');

        if (!$token) {

            return response()->json([
                "message" => "Token not found.ddd"
            ], 401);
        }

        /*
         * Optional:
         * Remove token after first use.
         */

        //session()->forget('react_token');

        return response()->json([
            "token" => $token
        ]);
    }
    // protected function login(LoginRequest $request)
    // {

    //     if (Auth::attempt($request->only('email', 'password')) && auth::user()->status == "active") {
    //         $user = Auth::user();
    //         $token = $user->createToken("API TOKEN")->plainTextToken;
    //         $user->roles()->pluck('name')[0];
    //         return response([
    //             'status' => true,
    //             'message' => 'User Logged In Successfully',
    //             'api_token' => $token,
    //             'expires_at' => now()->addMinutes(60),
    //         ], 201);
    //     }
    //     return response()->json([
    //         'status' => false,
    //         'message' => 'Email & Password does not match with our record.',
    //     ], 401);
    // }
    // protected function verify_user(Request $request)
    // {
    //     // $user = $request->user();
    //     $user = User::join('departments', 'departments.id', 'users.department_id')
    //         ->join('provinces', 'provinces.id', 'users.location_id')
    //         ->select(
    //             'users.id',
    //             'users.name',
    //             'users.username',
    //             'users.email',
    //             'users.image',
    //             'users.signature',
    //             'departments.name_da as departmentName',
    //             'provinces.name_dr as provinceName',
    //         )
    //         ->where('users.id', userid())
    //         ->first();
    //     // $user->roles()->pluck('name')[0];
    //     return response([
    //         'id' => $user->id,
    //         'name' => $user->name,
    //         'email' => $user->email,
    //         'username' => $user->username,
    //         'image' => $user->image,
    //         'signature' => $user->signature,
    //         'departmentName' => $user->departmentName,
    //         'provinceName' => $user->provinceName,
    //         'permissions' => $user->getAllPermissions()->pluck('name'),
    //         'role' => $user->roles()->pluck('name'),
    //         'systems' => user_system(),
    //     ], 201);
    // }
}
