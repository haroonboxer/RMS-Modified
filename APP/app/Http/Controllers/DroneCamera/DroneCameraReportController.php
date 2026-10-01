<?php

namespace App\Http\Controllers\DroneCamera;

use App\Http\Controllers\Controller;
use App\Models\DroneCamera\DroneCameraCompany;
use App\Models\DroneCamera\DroneCameraLicense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Morilog\Jalali\Jalalian;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;


class DroneCameraReportController extends Controller
{



    protected function listCompany(Request $request)
    {
        $companies = DroneCameraCompany::select('id', 'company_dr')
            ->orderBy('company_dr')
            ->get();

        return response()->json($companies);
    }


    protected function index(Request $request)
    {
        $startDate = null;
        $endDate = null;
        $companyId = $request->input('company_id');

        $startRaw = trim($request->input('start_date'));
        $endRaw = trim($request->input('end_date'));

        try {
            if (!empty($startRaw)) {
                $startDate = Jalalian::fromFormat('Y/m/d', $startRaw)->toCarbon()->startOfDay();
            }

            if (!empty($endRaw)) {
                $endDate = Jalalian::fromFormat('Y/m/d', $endRaw)->toCarbon()->endOfDay();
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid date format. Please use YYYY/MM/DD format.'], 422);
        }


        // $applyFilters = function ($query, $type) use ($companyId, $startDate, $endDate) {
        //     if ($companyId && $type == 'company') {
        //         $query->where('id', $companyId);
        //     } else if ($companyId && $type != 'company') {
        //         $query->where('company_id', $companyId);
        //     }

        //     if ($startDate && $endDate) {
        //         $query->whereBetween('created_at', [$startDate, $endDate]);
        //     } elseif ($startDate) {
        //         $query->where('created_at', '>=', $startDate);
        //     } elseif ($endDate) {
        //         $query->where('created_at', '<=', $endDate);
        //     }
        // };

        $applyFilters = function ($query, $type) use ($companyId, $startDate, $endDate) {
            if ($companyId) {
                if ($type === 'company') {
                    $query->where('id', $companyId);
                } elseif (in_array($type, ['license'])) {
                    $query->where('company_id', $companyId);
                }
                // personnel has no company relation → skip
            }

            if ($startDate && $endDate) {
                $query->whereBetween('created_at', [$startDate, $endDate]);
            } elseif ($startDate) {
                $query->where('created_at', '>=', $startDate);
            } elseif ($endDate) {
                $query->where('created_at', '<=', $endDate);
            }
        };

        // Fetching companies
        $companyQuery = DroneCameraCompany::query();
        $applyFilters($companyQuery, 'company');

        // Fetching licenses
        $licenseQuery = DroneCameraLicense::query();
        $applyFilters($licenseQuery, 'license');

        $personnelQuery = DB::table('personnel_drone_cameras');
        $applyFilters($personnelQuery, 'personnel');


        // Counting companies
        $totalCompanies = $companyQuery->count();


        // Counting licenses
        $activeLicense = (clone $licenseQuery)->where('status', 1)->count();
        $cancleLicense = (clone $licenseQuery)->where('status', 4)->count();

        $totalPersonnel = $personnelQuery->count();

        $activePersonnel = (clone $personnelQuery)->where('status', 1)->count();
        $dismissedPersonnel = (clone $personnelQuery)->where('status', 2)->count(); // adjust based on your enum
        $pendingPersonnel = (clone $personnelQuery)->where('status', 0)->count();

        $newLicense = (clone $licenseQuery)->where('license_type', 'new')->where('status', 2)->count();
        $extendLicense = (clone $licenseQuery)->where('license_type', 'extend')->where('status', 2)->count();
        $renewLicense = (clone $licenseQuery)->where('license_type', 'renew')->where('status', 2)->count();
        $printedCard = (clone $licenseQuery)->where('printed', '1')->where('status', 2)->count();
        $totalLicense = $licenseQuery->where('status', 2)->count();

        return response()->json([
            'data' => [
                'total_companies' => $totalCompanies,
                'total_license' => $totalLicense,
                'active_license' => $activeLicense,
                'cancle_license' => $cancleLicense,
                'new_license' => $newLicense,
                'extend_license' => $extendLicense,
                'renew_license' => $renewLicense,
                'printedCard' => $printedCard,
                'total_personnel' => $totalPersonnel,
                'active_personnel' => $activePersonnel,
                'dismissed_personnel' => $dismissedPersonnel,
                'pending_personnel' => $pendingPersonnel,
            ],
        ]);
    }

    // protected function gen_excel_report(Request $request)
    // {
    //     $sortFieldInput = $request->input('sort_field', 'id');
    //     $sortFields = ['id', 'created_at', 'company_id'];
    //     $sortField = in_array($sortFieldInput, $sortFields) ? $sortFieldInput : 'id';
    //     $sortOrder = $request->input('sort_order', 'desc');
    //     $companyId = $request->input('company_id');

    //     $startDate = null;
    //     $endDate = null;
    //     $startRaw = trim($request->input('start_date'));
    //     $endRaw = trim($request->input('end_date'));

    //     try {
    //         if (!empty($startRaw)) {
    //             $startDate = Jalalian::fromFormat('Y/m/d', $startRaw)->toCarbon()->startOfDay();
    //         }

    //         if (!empty($endRaw)) {
    //             $endDate = Jalalian::fromFormat('Y/m/d', $endRaw)->toCarbon()->endOfDay();
    //         }
    //     } catch (\Exception $e) {
    //         return response()->json(['error' => 'Invalid date format. Please use YYYY/MM/DD format.'], 422);
    //     }

    //     $query = DB::table('drone_camera_licenses')
    //         ->leftJoin('drone_camera_companies', 'drone_camera_licenses.company_id', '=', 'drone_camera_companies.id')
    //         ->leftJoin('drone_camera_bosses', 'drone_camera_bosses.company_id', '=', 'drone_camera_companies.id')
    //         ->leftJoin('drone_camera_assistants', 'drone_camera_assistants.company_id', '=', 'drone_camera_companies.id')
    //         ->leftJoin('users', 'drone_camera_licenses.created_by', '=', 'users.id')
    //         ->select(
    //             'drone_camera_licenses.*',
    //             'drone_camera_licenses.license_type',
    //             'drone_camera_companies.company_dr as company_name_dr',
    //             'drone_camera_bosses.name_dr as boss_name_dr',
    //             'drone_camera_assistants.name_dr as assistant_name_dr',
    //             'users.name as ownerName',
    //             'drone_camera_licenses.created_at'
    //         )
    //         ->where('drone_camera_licenses.status', 2)
    //         ->orderBy($sortField, $sortOrder)
    //         ->when($companyId, fn($q) => $q->where('drone_camera_licenses.company_id', $companyId))
    //         ->when($request->input('license_type'), fn($q) => $q->where('drone_camera_licenses.license_type', $request->input('license_type')))
    //         ->when($startDate && $endDate, function ($q) use ($startDate, $endDate) {
    //             $q->whereBetween('drone_camera_licenses.created_at', [$startDate, $endDate]);
    //         })
    //         ->when($startDate && !$endDate, function ($q) use ($startDate) {
    //             $q->where('drone_camera_licenses.created_at', '>=', $startDate);
    //         })
    //         ->when($endDate && !$startDate, function ($q) use ($endDate) {
    //             $q->where('drone_camera_licenses.created_at', '<=', $endDate);
    //         });

    //     $records = $query->get();
    //     $spreadsheet = IOFactory::load(public_path('excel/templates/list_of_printed_cards.xlsx'));
    //     $worksheet = $spreadsheet->getActiveSheet();

    //     $dateRangeText = 'راپور از تاریخ: ';
    //     if ($startDate && $endDate) {
    //         $startJalali = Jalalian::fromCarbon($startDate)->format('Y/m/d');
    //         $endJalali = Jalalian::fromCarbon($endDate)->format('Y/m/d');
    //         $dateRangeText .= $startJalali . ' تا ' . $endJalali;
    //     } elseif ($startDate) {
    //         $startJalali = Jalalian::fromCarbon($startDate)->format('Y/m/d');
    //         $dateRangeText .= 'از ' . $startJalali;
    //     } elseif ($endDate) {
    //         $endJalali = Jalalian::fromCarbon($endDate)->format('Y/m/d');
    //         $dateRangeText .= 'تا ' . $endJalali;
    //     } else {
    //         $dateRangeText .= 'تمام تاریخ ها';
    //     }

    //     $worksheet->mergeCells('A2:H2');
    //     $worksheet->setCellValue('A2', $dateRangeText);
    //     $worksheet->getStyle('A2')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

    //     $startRow = 4;
    //     $firstFeeRow = $startRow;
    //     $borderStyle = [
    //         'borders' => [
    //             'allBorders' => [
    //                 'borderStyle' => Border::BORDER_THIN,
    //                 'color' => ['argb' => 'FF000000'],
    //             ],
    //         ],
    //     ];

    //     foreach ($records as $record) {
    //         $worksheet->setCellValue('A' . $startRow, $record->id);
    //         $worksheet->setCellValue('B' . $startRow, $record->company_name_dr);
    //         $worksheet->setCellValue('C' . $startRow, $record->boss_name_dr);
    //         $worksheet->setCellValue('D' . $startRow, $record->assistant_name_dr);

    //         $licenseTypeLabel = match ($record->license_type) {
    //             'new' => 'جدید',
    //             'renew' => 'مثنی',
    //             'extend' => 'تمدید',
    //             default => 'نامشخص',
    //         };

    //         $worksheet->setCellValue('E' . $startRow, $licenseTypeLabel);
    //         $worksheet->setCellValue('F' . $startRow, $record->fee);
    //         $worksheet->setCellValue('G' . $startRow, $record->issue_date);
    //         $worksheet->setCellValue('H' . $startRow, $record->validity_date);

    //         foreach (range('A', 'H') as $col) {
    //             $worksheet->getStyle($col . $startRow)->applyFromArray($borderStyle);
    //         }

    //         $startRow++;
    //     }

    //     $lastFeeRow = $startRow - 1;
    //     $sumRow = $startRow;

    //     // Merge and write "مقدار عواید حاصل شده" in A to E
    //     $worksheet->mergeCells("A$sumRow:E$sumRow");
    //     $worksheet->setCellValue("A$sumRow", 'مقدار عواید حاصل شده');

    //     // Merge and write SUM in F to H
    //     $worksheet->mergeCells("F$sumRow:H$sumRow");
    //     $worksheet->setCellValue("F$sumRow", "=SUM(F$firstFeeRow:F$lastFeeRow)");

    //     // Style for yellow background and border
    //     $sumRowStyle = [
    //         'fill' => [
    //             'fillType' => Fill::FILL_SOLID,
    //             'startColor' => ['rgb' => 'FFFF00'],
    //         ],
    //         'borders' => [
    //             'allBorders' => [
    //                 'borderStyle' => Border::BORDER_THIN,
    //                 'color' => ['rgb' => '000000'],
    //             ],
    //         ],
    //     ];

    //     // Apply style to merged A–E
    //     foreach (range('A', 'E') as $col) {
    //         $worksheet->getStyle($col . $sumRow)->applyFromArray($sumRowStyle);
    //         $worksheet->getStyle("A$sumRow:H$sumRow")->getFont()->setBold(true)->setSize(16);
    //     }

    //     // Apply style to merged F–H
    //     foreach (range('F', 'H') as $col) {
    //         $worksheet->getStyle($col . $sumRow)->applyFromArray($sumRowStyle);
    //         $worksheet->getStyle("A$sumRow:H$sumRow")->getFont()->setBold(true)->setSize(16);
    //     }

    //     $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
    //     ob_start();
    //     $writer->save('php://output');
    //     $excelOutput = ob_get_clean();

    //     return response($excelOutput, 200)
    //         ->header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    //         ->header('Content-Disposition', 'attachment; filename="list_of_cards_sent_for_printing.xlsx"')
    //         ->header('Cache-Control', 'max-age=0');
    // }

    // protected function gen_excel_report(Request $request)
    // {
    //     $companyId  = $request->input('company_id');
    //     $startDate  = null;
    //     $endDate    = null;
    //     $startRaw   = trim($request->input('start_date', ''));
    //     $endRaw     = trim($request->input('end_date', ''));

    //     try {
    //         if (!empty($startRaw)) {
    //             $startDate = Jalalian::fromFormat('Y/m/d', $startRaw)->toCarbon()->startOfDay();
    //         }
    //         if (!empty($endRaw)) {
    //             $endDate = Jalalian::fromFormat('Y/m/d', $endRaw)->toCarbon()->endOfDay();
    //         }
    //     } catch (\Exception $e) {
    //         return response()->json(['error' => 'Invalid date format. Please use YYYY/MM/DD format.'], 422);
    //     }

    //     // ── Shared filter closure (mirrors your index() logic) ──────────────────
    //     $applyFilters = function ($query, string $type) use ($companyId, $startDate, $endDate) {
    //         if ($companyId) {
    //             if ($type === 'company') {
    //                 $query->where('id', $companyId);
    //             } elseif ($type === 'license') {
    //                 $query->where('company_id', $companyId);
    //             }
    //             // personnel has no company FK → skip
    //         }
    //         if ($startDate && $endDate) {
    //             $query->whereBetween('created_at', [$startDate, $endDate]);
    //         } elseif ($startDate) {
    //             $query->where('created_at', '>=', $startDate);
    //         } elseif ($endDate) {
    //             $query->where('created_at', '<=', $endDate);
    //         }
    //     };

    //     // ── Summary numbers (same as index()) ───────────────────────────────────
    //     $companyQuery    = DroneCameraCompany::query();
    //     $applyFilters($companyQuery, 'company');

    //     $licenseQuery    = DroneCameraLicense::query();
    //     $applyFilters($licenseQuery, 'license');

    //     $personnelQuery  = DB::table('personnel_drone_cameras');
    //     $applyFilters($personnelQuery, 'personnel');

    //     $summary = [
    //         'total_companies'   => $companyQuery->count(),
    //         'total_license'     => (clone $licenseQuery)->where('status', 2)->count(),
    //         'active_license'    => (clone $licenseQuery)->where('status', 1)->count(),
    //         'cancle_license'    => (clone $licenseQuery)->where('status', 4)->count(),
    //         'new_license'       => (clone $licenseQuery)->where('license_type', 'new')->where('status', 2)->count(),
    //         'extend_license'    => (clone $licenseQuery)->where('license_type', 'extend')->where('status', 2)->count(),
    //         'renew_license'     => (clone $licenseQuery)->where('license_type', 'renew')->where('status', 2)->count(),
    //         'printedCard'       => (clone $licenseQuery)->where('printed', '1')->where('status', 2)->count(),
    //         'total_personnel'   => $personnelQuery->count(),
    //         'active_personnel'  => (clone $personnelQuery)->where('status', 1)->count(),
    //         'pending_personnel' => (clone $personnelQuery)->where('status', 0)->count(),
    //         'dismissed_personnel' => (clone $personnelQuery)->where('status', 2)->count(),
    //     ];

    //     // ── License detail rows ──────────────────────────────────────────────────
    //     $licenseRows = DB::table('drone_camera_licenses as l')
    //         ->leftJoin('drone_camera_companies as c',  'l.company_id',  '=', 'c.id')
    //         ->leftJoin('drone_camera_bosses as b',     'b.company_id',  '=', 'c.id')
    //         ->leftJoin('drone_camera_assistants as a', 'a.company_id',  '=', 'c.id')
    //         ->leftJoin('users as u',                   'l.created_by',  '=', 'u.id')
    //         ->select(
    //             'l.id',
    //             'c.company_dr as company_name',
    //             'b.name_dr as boss_name',
    //             'a.name_dr as assistant_name',
    //             'l.license_type',
    //             'l.fee',
    //             'l.issue_date',
    //             'l.validity_date',
    //             'l.drone_model',
    //             'l.drone_sn',
    //             'l.status',
    //             'l.printed',
    //             'l.created_at'
    //         )
    //         ->when($companyId, fn($q) => $q->where('l.company_id', $companyId))
    //         ->when($startDate && $endDate,  fn($q) => $q->whereBetween('l.created_at', [$startDate, $endDate]))
    //         ->when($startDate && !$endDate, fn($q) => $q->where('l.created_at', '>=', $startDate))
    //         ->when($endDate && !$startDate, fn($q) => $q->where('l.created_at', '<=', $endDate))
    //         ->orderBy('l.id', 'desc')
    //         ->get();

    //     // ── Personnel detail rows ────────────────────────────────────────────────
    //     $personnelRows = DB::table('personnel_drone_cameras')
    //         ->select(
    //             'id',
    //             'name_dr',
    //             'last_name_dr',
    //             'f_name_da',
    //             'phone',
    //             'email',
    //             'job',
    //             'passport_no',
    //             'country',
    //             'status',
    //             'created_at'
    //         )
    //         ->when($startDate && $endDate,  fn($q) => $q->whereBetween('created_at', [$startDate, $endDate]))
    //         ->when($startDate && !$endDate, fn($q) => $q->where('created_at', '>=', $startDate))
    //         ->when($endDate && !$startDate, fn($q) => $q->where('created_at', '<=', $endDate))
    //         ->orderBy('id', 'desc')
    //         ->get();

    //     // ── Build date-range label ───────────────────────────────────────────────
    //     if ($startDate && $endDate) {
    //         $dateLabel = Jalalian::fromCarbon($startDate)->format('Y/m/d')
    //             . ' تا '
    //             . Jalalian::fromCarbon($endDate)->format('Y/m/d');
    //     } elseif ($startDate) {
    //         $dateLabel = 'از ' . Jalalian::fromCarbon($startDate)->format('Y/m/d');
    //     } elseif ($endDate) {
    //         $dateLabel = 'تا ' . Jalalian::fromCarbon($endDate)->format('Y/m/d');
    //     } else {
    //         $dateLabel = 'تمام تاریخ ها';
    //     }

    //     // ── Spreadsheet ──────────────────────────────────────────────────────────
    //     $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
    //     $spreadsheet->getProperties()
    //         ->setTitle('Drone Camera Report')
    //         ->setCreator('System');

    //     $headerStyle = [
    //         'font'      => ['bold' => true, 'size' => 12, 'color' => ['rgb' => 'FFFFFF']],
    //         'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '1F4E79']],
    //         'alignment' => [
    //             'horizontal' => Alignment::HORIZONTAL_CENTER,
    //             'vertical'   => Alignment::VERTICAL_CENTER
    //         ],
    //         'borders'   => ['allBorders' => [
    //             'borderStyle' => Border::BORDER_THIN,
    //             'color'       => ['argb' => 'FF000000']
    //         ]],
    //     ];

    //     $cellStyle = [
    //         'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
    //         'borders'   => ['allBorders' => [
    //             'borderStyle' => Border::BORDER_THIN,
    //             'color'       => ['argb' => 'FF000000']
    //         ]],
    //     ];

    //     // ════════════════════════════════════════════════════════════════════
    //     // Sheet 1 – Summary
    //     // ════════════════════════════════════════════════════════════════════
    //     $ws1 = $spreadsheet->getActiveSheet();
    //     $ws1->setTitle('خلاصه گزارش');
    //     $ws1->setRightToLeft(true);

    //     // Title
    //     $ws1->mergeCells('A1:C1');
    //     $ws1->setCellValue('A1', 'راپور خلاصه سیستم ثبت کمره دستی');
    //     $ws1->getStyle('A1')->applyFromArray([
    //         'font'      => ['bold' => true, 'size' => 16],
    //         'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
    //         'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'D9E1F2']],
    //     ]);

    //     // Date range
    //     $ws1->mergeCells('A2:C2');
    //     $ws1->setCellValue('A2', 'راپور از تاریخ: ' . $dateLabel);
    //     $ws1->getStyle('A2')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

    //     // Column headers
    //     $ws1->setCellValue('A3', 'ردیف');
    //     $ws1->setCellValue('B3', 'عنوان');
    //     $ws1->setCellValue('C3', 'تعداد');
    //     $ws1->getStyle('A3:C3')->applyFromArray($headerStyle);
    //     $ws1->getColumnDimension('A')->setWidth(8);
    //     $ws1->getColumnDimension('B')->setWidth(40);
    //     $ws1->getColumnDimension('C')->setWidth(15);

    //     $summaryLabels = [
    //         'total_companies'    => 'تعداد شرکت ها',
    //         'total_license'      => 'تعداد جواز ها',
    //         'active_license'     => 'جواز های فعال',
    //         'cancle_license'     => 'جواز های رد شده',
    //         'new_license'        => 'جواز های جدید',
    //         'extend_license'     => 'جواز های تمدید',
    //         'renew_license'      => 'جواز های مثنی',
    //         'printedCard'        => 'کارت های چاپ شده',
    //         'total_personnel'    => 'تعداد جواز شخصی',
    //         'active_personnel'   => 'تعداد جواز شخصی فعال',
    //         'pending_personnel'  => 'تعداد جواز شخصی در انتظار',
    //         'dismissed_personnel' => 'تعداد جواز شخصی منقضی شده',
    //     ];

    //     // Hide company row when filtering by company (matches frontend logic)
    //     if ($companyId) {
    //         unset($summaryLabels['total_companies']);
    //     }

    //     $row = 4;
    //     $i   = 1;
    //     foreach ($summaryLabels as $key => $label) {
    //         $ws1->setCellValue('A' . $row, $i++);
    //         $ws1->setCellValue('B' . $row, $label);
    //         $ws1->setCellValue('C' . $row, $summary[$key]);
    //         $ws1->getStyle("A{$row}:C{$row}")->applyFromArray($cellStyle);

    //         // Zebra striping
    //         if ($row % 2 === 0) {
    //             $ws1->getStyle("A{$row}:C{$row}")->getFill()
    //                 ->setFillType(Fill::FILL_SOLID)
    //                 ->getStartColor()->setRGB('EBF3FB');
    //         }
    //         $row++;
    //     }

    //     // ════════════════════════════════════════════════════════════════════
    //     // Sheet 2 – License Detail
    //     // ════════════════════════════════════════════════════════════════════
    //     $ws2 = $spreadsheet->createSheet();
    //     $ws2->setTitle('تفصیل جواز ها');
    //     $ws2->setRightToLeft(true);

    //     $ws2->mergeCells('A1:I1');
    //     $ws2->setCellValue('A1', 'تفصیل جواز ها – ' . $dateLabel);
    //     $ws2->getStyle('A1')->applyFromArray([
    //         'font'      => ['bold' => true, 'size' => 14],
    //         'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
    //         'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'D9E1F2']],
    //     ]);

    //     $licHeaders = [
    //         'A' => ['label' => 'ردیف',         'width' => 8],
    //         'B' => ['label' => 'نام شرکت',     'width' => 30],
    //         'C' => ['label' => 'مدیر',         'width' => 22],
    //         'D' => ['label' => 'معاون',        'width' => 22],
    //         'E' => ['label' => 'نوع جواز',     'width' => 14],
    //         'F' => ['label' => 'فیس',          'width' => 14],
    //         'G' => ['label' => 'تاریخ صدور',   'width' => 16],
    //         'H' => ['label' => 'تاریخ انقضا',  'width' => 16],
    //         'I' => ['label' => 'موضع درج',     'width' => 16],
    //     ];

    //     foreach ($licHeaders as $col => $info) {
    //         $ws2->setCellValue($col . '2', $info['label']);
    //         $ws2->getColumnDimension($col)->setWidth($info['width']);
    //     }
    //     $ws2->getStyle('A2:I2')->applyFromArray($headerStyle);

    //     $licTypeMap = ['new' => 'جدید', 'renew' => 'مثنی', 'extend' => 'تمدید'];
    //     $row = 3;
    //     $i   = 1;
    //     $totalFee = 0;

    //     foreach ($licenseRows as $rec) {
    //         $ws2->setCellValue('A' . $row, $i++);
    //         $ws2->setCellValue('B' . $row, $rec->company_name);
    //         $ws2->setCellValue('C' . $row, $rec->boss_name);
    //         $ws2->setCellValue('D' . $row, $rec->assistant_name);
    //         $ws2->setCellValue('E' . $row, $licTypeMap[$rec->license_type] ?? $rec->license_type);
    //         $ws2->setCellValue('F' . $row, $rec->fee);
    //         $ws2->setCellValue('G' . $row, $rec->issue_date);
    //         $ws2->setCellValue('H' . $row, $rec->validity_date);

    //         // Convert created_at to Jalali for display
    //         try {
    //             $createdJalali = Jalalian::fromCarbon(
    //                 \Carbon\Carbon::parse($rec->created_at)
    //             )->format('Y/m/d');
    //         } catch (\Exception $e) {
    //             $createdJalali = $rec->created_at;
    //         }
    //         $ws2->setCellValue('I' . $row, $createdJalali);

    //         $ws2->getStyle("A{$row}:I{$row}")->applyFromArray($cellStyle);

    //         if ($row % 2 === 0) {
    //             $ws2->getStyle("A{$row}:I{$row}")->getFill()
    //                 ->setFillType(Fill::FILL_SOLID)
    //                 ->getStartColor()->setRGB('EBF3FB');
    //         }

    //         $totalFee += (float) $rec->fee;
    //         $row++;
    //     }

    //     // Fee total row
    //     $ws2->mergeCells("A{$row}:E{$row}");
    //     $ws2->setCellValue("A{$row}", 'مجموع عواید حاصل شده');
    //     $ws2->mergeCells("F{$row}:I{$row}");
    //     $ws2->setCellValue("F{$row}", $totalFee);
    //     $totalStyle = [
    //         'font'      => ['bold' => true, 'size' => 13],
    //         'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'FFFF00']],
    //         'borders'   => ['allBorders' => [
    //             'borderStyle' => Border::BORDER_THIN,
    //             'color'       => ['argb' => 'FF000000']
    //         ]],
    //         'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
    //     ];
    //     $ws2->getStyle("A{$row}:I{$row}")->applyFromArray($totalStyle);

    //     // ════════════════════════════════════════════════════════════════════
    //     // Sheet 3 – Personnel Detail
    //     // ════════════════════════════════════════════════════════════════════
    //     $ws3 = $spreadsheet->createSheet();
    //     $ws3->setTitle('تفصیل پرسونل');
    //     $ws3->setRightToLeft(true);

    //     $ws3->mergeCells('A1:H1');
    //     $ws3->setCellValue('A1', 'تفصیل پرسونل – ' . $dateLabel);
    //     $ws3->getStyle('A1')->applyFromArray([
    //         'font'      => ['bold' => true, 'size' => 14],
    //         'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
    //         'fill'      => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'D9E1F2']],
    //     ]);

    //     $perHeaders = [
    //         'A' => ['label' => 'ردیف',         'width' => 8],
    //         'B' => ['label' => 'نام',           'width' => 20],
    //         'C' => ['label' => 'تخلص',         'width' => 20],
    //         'D' => ['label' => 'اسم پدر',      'width' => 20],
    //         'E' => ['label' => 'شماره تماس',   'width' => 16],
    //         'F' => ['label' => 'وظیفه',        'width' => 18],
    //         'G' => ['label' => 'شماره پاسپورت', 'width' => 20],
    //         'H' => ['label' => 'وضعیت',        'width' => 14],
    //     ];

    //     foreach ($perHeaders as $col => $info) {
    //         $ws3->setCellValue($col . '2', $info['label']);
    //         $ws3->getColumnDimension($col)->setWidth($info['width']);
    //     }
    //     $ws3->getStyle('A2:H2')->applyFromArray($headerStyle);

    //     $statusMap = [0 => 'در انتظار', 1 => 'فعال', 2 => 'منقضی'];
    //     $row = 3;
    //     $i   = 1;

    //     foreach ($personnelRows as $rec) {
    //         $ws3->setCellValue('A' . $row, $i++);
    //         $ws3->setCellValue('B' . $row, $rec->name_dr);
    //         $ws3->setCellValue('C' . $row, $rec->last_name_dr);
    //         $ws3->setCellValue('D' . $row, $rec->f_name_da);
    //         $ws3->setCellValue('E' . $row, $rec->phone);
    //         $ws3->setCellValue('F' . $row, $rec->job);
    //         $ws3->setCellValue('G' . $row, $rec->passport_no);
    //         $ws3->setCellValue('H' . $row, $statusMap[$rec->status] ?? $rec->status);

    //         $ws3->getStyle("A{$row}:H{$row}")->applyFromArray($cellStyle);

    //         if ($row % 2 === 0) {
    //             $ws3->getStyle("A{$row}:H{$row}")->getFill()
    //                 ->setFillType(Fill::FILL_SOLID)
    //                 ->getStartColor()->setRGB('EBF3FB');
    //         }
    //         $row++;
    //     }

    //     // ── Set active sheet to summary before download ───────────────────────────
    //     $spreadsheet->setActiveSheetIndex(0);

    //     // ── Stream response ───────────────────────────────────────────────────────
    //     $writer = \PhpOffice\PhpSpreadsheet\IOFactory::createWriter($spreadsheet, 'Xlsx');

    //     ob_start();
    //     $writer->save('php://output');
    //     $excelOutput = ob_get_clean();

    //     $fileName = 'drone_camera_report';
    //     if ($companyId) {
    //         $company = DroneCameraCompany::find($companyId);
    //         if ($company) $fileName = $company->company_dr . '_' . $fileName;
    //     }
    //     if ($startRaw || $endRaw) {
    //         $fileName .= '_' . str_replace('/', '-', $dateLabel);
    //     }

    //     return response($excelOutput, 200)
    //         ->header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    //         ->header('Content-Disposition', 'attachment; filename="' . $fileName . '.xlsx"')
    //         ->header('Cache-Control', 'max-age=0');
    // }

    protected function gen_excel_report(Request $request)
    {
        $companyId = $request->input('company_id');
        $startDate = null;
        $endDate   = null;
        $startRaw  = trim($request->input('start_date', ''));
        $endRaw    = trim($request->input('end_date', ''));

        try {
            if (!empty($startRaw)) {
                $startDate = Jalalian::fromFormat('Y/m/d', $startRaw)->toCarbon()->startOfDay();
            }
            if (!empty($endRaw)) {
                $endDate = Jalalian::fromFormat('Y/m/d', $endRaw)->toCarbon()->endOfDay();
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid date format. Please use YYYY/MM/DD format.'], 422);
        }

        // Date label
        if ($startDate && $endDate) {
            $dateLabel = Jalalian::fromCarbon($startDate)->format('Y/m/d') . ' تا ' . Jalalian::fromCarbon($endDate)->format('Y/m/d');
        } elseif ($startDate) {
            $dateLabel = 'از ' . Jalalian::fromCarbon($startDate)->format('Y/m/d');
        } elseif ($endDate) {
            $dateLabel = 'تا ' . Jalalian::fromCarbon($endDate)->format('Y/m/d');
        } else {
            $dateLabel = 'تمام تاریخ ها';
        }

        // ── Fetch licenses (Sheet 1)
        $licenseRows = DroneCameraLicense::query()
            ->with(['company'])
            ->where('status', 2)
            ->whereNotNull('company_id')
            ->when($companyId, fn($q) => $q->where('company_id', $companyId))
            ->when($startDate && $endDate, fn($q) => $q->whereBetween('created_at', [$startDate, $endDate]))
            ->when($startDate && !$endDate, fn($q) => $q->where('created_at', '>=', $startDate))
            ->when($endDate && !$startDate, fn($q) => $q->where('created_at', '<=', $endDate))
            ->orderBy('company_id')
            ->orderByRaw("FIELD(license_type, 'new', 'extend', 'renew')")
            ->orderBy('id', 'desc')
            ->get();

        // Prefetch company IDs
        $companyIds = $licenseRows->pluck('company_id')->unique()->filter()->values()->toArray();

        // Boss map
        $bossMap = DB::table('drone_camera_bosses')
            ->whereIn('company_id', $companyIds)
            ->whereNull('deleted_at')
            ->orderBy('id')
            ->get()
            ->groupBy('company_id')
            ->map(fn($rows) => $rows->first()->name_dr ?? null);

        // Assistant map
        $assistantMap = DB::table('drone_camera_assistants')
            ->whereIn('company_id', $companyIds)
            ->whereNull('deleted_at')
            ->orderBy('id')
            ->get()
            ->groupBy('company_id')
            ->map(fn($rows) => $rows->first()->name_dr ?? null);

        // ── Sheet 2 data
        $personnelRows = DroneCameraLicense::query()
            ->join('personnel_drone_cameras as p', 'drone_camera_licenses.personnel_id', '=', 'p.id')
            ->select(
                'drone_camera_licenses.id',
                DB::raw("CONCAT(p.name_dr, ' ', p.last_name_dr) as full_name"),
                'drone_camera_licenses.license_type',
                'drone_camera_licenses.fee',
                'drone_camera_licenses.issue_date',
                'drone_camera_licenses.validity_date'
            )
            ->where('drone_camera_licenses.status', 2)
            ->whereNotNull('drone_camera_licenses.personnel_id')
            ->when($startDate && $endDate, fn($q) => $q->whereBetween('drone_camera_licenses.created_at', [$startDate, $endDate]))
            ->when($startDate && !$endDate, fn($q) => $q->where('drone_camera_licenses.created_at', '>=', $startDate))
            ->when($endDate && !$startDate, fn($q) => $q->where('drone_camera_licenses.created_at', '<=', $endDate))
            ->orderBy('drone_camera_licenses.id', 'desc')
            ->get();

        // ── Load template
        $spreadsheet = IOFactory::load(public_path('excel/templates/list_of_drones.xlsx'));

        $licTypeMap    = ['new' => 'جدید', 'renew' => 'مثنی', 'extend' => 'تمدید'];
        $notRegistered = 'در سیستم ثبت نشده است';

        $styleNoFill = [
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_NONE,
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                ],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical'   => Alignment::VERTICAL_CENTER,
            ],
        ];

        $styleTotalLabel = array_merge($styleNoFill, [
            'font' => ['bold' => true, 'name' => 'Calibri', 'size' => 14],
        ]);

        // Helper: write value with red fallback
        $writeCell = function ($ws, $cell, $value, $fallback) {
            $isEmpty = empty($value);

            $ws->setCellValue($cell, $isEmpty ? $fallback : $value);

            $ws->getCell($cell)->getStyle()->getFont()->applyFromArray([
                'name'  => 'Calibri',
                'size'  => 11,
                'color' => ['rgb' => $isEmpty ? 'FF0000' : '000000'],
            ]);
        };

        // ═══════════════════════════════════════
        // Sheet 1 – Companies
        // ═══════════════════════════════════════
        $ws1 = $spreadsheet->getSheet(0);
        $ws1->setCellValue('A2', 'لیست راپور – ' . $dateLabel);

        $row = 4;
        $i   = 1;

        foreach ($licenseRows as $license) {
            $ws1->getStyle("A{$row}:H{$row}")->applyFromArray($styleNoFill);
            $ws1->getRowDimension($row)->setRowHeight(28);

            $company = $license->company;

            $ws1->setCellValue('A' . $row, $i++);
            $ws1->setCellValue('E' . $row, $licTypeMap[$license->license_type] ?? $license->license_type);
            $ws1->setCellValue('F' . $row, $license->fee);
            $ws1->setCellValue('G' . $row, $license->issue_date);
            $ws1->setCellValue('H' . $row, $license->validity_date);

            // Company name
            $ws1->setCellValue('B' . $row, $company->company_dr ?? '');

            // Boss
            $writeCell(
                $ws1,
                'C' . $row,
                $bossMap->get($license->company_id),
                $notRegistered
            );

            // Assistant
            $writeCell(
                $ws1,
                'D' . $row,
                $assistantMap->get($license->company_id),
                $notRegistered
            );

            $row++;
        }

        // Total row Sheet 1
        $totalRow1 = $row;
        $lastData1 = $row - 1;

        $ws1->getStyle("A{$totalRow1}:H{$totalRow1}")->applyFromArray($styleTotalLabel);
        $ws1->getRowDimension($totalRow1)->setRowHeight(32);
        $ws1->mergeCells("A{$totalRow1}:E{$totalRow1}");
        $ws1->setCellValue("A{$totalRow1}", 'مقدار عواید حاصل شده');
        $ws1->mergeCells("F{$totalRow1}:H{$totalRow1}");
        $ws1->setCellValue("F{$totalRow1}", "=SUM(F4:F{$lastData1})");

        // ═══════════════════════════════════════
        // Sheet 2 – Personnel
        // ═══════════════════════════════════════
        $ws2 = $spreadsheet->getSheet(1);
        $ws2->setCellValue('A2', 'لیست راپور – ' . $dateLabel);

        $row = 4;
        $i   = 1;

        foreach ($personnelRows as $rec) {
            $ws2->getStyle("A{$row}:F{$row}")->applyFromArray($styleNoFill);
            $ws2->getRowDimension($row)->setRowHeight(28);

            $ws2->setCellValue('A' . $row, $i++);
            $ws2->setCellValue('B' . $row, $rec->full_name ?? '');
            $ws2->setCellValue('C' . $row, $licTypeMap[$rec->license_type] ?? $rec->license_type);
            $ws2->setCellValue('D' . $row, $rec->fee);
            $ws2->setCellValue('E' . $row, $rec->issue_date);
            $ws2->setCellValue('F' . $row, $rec->validity_date);

            $row++;
        }

        // Total row Sheet 2
        $totalRow2 = $row;
        $lastData2 = $row - 1;

        $ws2->getStyle("A{$totalRow2}:F{$totalRow2}")->applyFromArray($styleTotalLabel);
        $ws2->getRowDimension($totalRow2)->setRowHeight(32);
        $ws2->mergeCells("A{$totalRow2}:C{$totalRow2}");
        $ws2->setCellValue("A{$totalRow2}", 'مجموع مقدار پول');
        $ws2->mergeCells("D{$totalRow2}:F{$totalRow2}");
        $ws2->setCellValue("D{$totalRow2}", "=SUM(D4:D{$lastData2})");

        // ── Output
        $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');

        ob_start();
        $writer->save('php://output');
        $excelOutput = ob_get_clean();

        $fileName = 'drone_camera_report';

        if ($companyId) {
            $company = DroneCameraCompany::find($companyId);
            if ($company) {
                $fileName = $company->company_dr . '_' . $fileName;
            }
        }

        if ($startRaw || $endRaw) {
            $fileName .= '_' . str_replace('/', '-', $dateLabel);
        }

        return response($excelOutput, 200)
            ->header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            ->header('Content-Disposition', 'attachment; filename="' . $fileName . '.xlsx"')
            ->header('Cache-Control', 'max-age=0');
    }
}
