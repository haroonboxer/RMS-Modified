<?php

namespace Database\Seeders\auth_sys;

use App\Models\Auth\System;
use Illuminate\Database\Seeder;

class SystemSeeder extends Seeder
{
    public function run(): void
    {
        $systems = [
            [
                'name_da' => 'مدیریت کمپنی های امنیتی (مشوره دهی)',
                'name_pa' => 'د خطر مدیریت',
                'icon' => 'enterprise.png',
                'route' => '/company/list',
            ],
            [
                'name_da' => 'سیستم مدیریت جواز فعالیت ورکشاپ وسایط زرهی',
                'name_pa' => 'د وسایطو ورکشاپ جواز مدیریت',
                'icon' => 'enterprise.png',
                'route' => '/workshop/list',
            ],
            [
                'name_da' => 'سیستم مدیریت جواز فعالیت شرکت های نصب آله ردیاب (GPS) ',
                'name_pa' => 'د تعقیب او جی پی اس  وسیلو نصبولو سیسټم',
                'icon' => 'enterprise.png',
                'route' => '/gps-companies/list',
            ],

            [
                'name_da' => 'جواز فعالیت موسسات کرایه دهنده سګهای تعلیمی K9',
                'name_pa' => ' د K9 د روزنیزو سپو  د جواز فعالیت ورکولو موسساتو د  ',
                'icon' => 'enterprise.png',
                'route' => '/k9/list',
            ],
            [
                'name_da' => 'سیستم مدیریت جواز فعالیت  استفاده از کمره های پروازی  (Drone Cameras)',
                'name_pa' => 'سیستم مدیریت جواز فعالیت  استفاده از کمره های پروازی  (Drone Cameras)',
                'icon' => 'enterprise.png',
                'route' => '/drone-camera/list',
            ],
            [
                'name_da' => 'مدیریت کاربران',
                'name_pa' => 'د کاروونکی مدیریت',
                'icon' => 'group.png',
                'route' => '/authentication/users',
            ],
        ];
        foreach ($systems as $system)
            System::create($system);
    }
}
