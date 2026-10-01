<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Armored Vehicle Workshop License</title>
    <link rel="preload" as="image" href="{{ asset('idc-print/k9Company.jpeg') }}">

    <style>
        @font-face {
            font-family: 'Bahij Titr';
            src: url('/fonts/BahijTitr-Bold.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
        }

        @page {
            margin: 0;
            size: A4 landscape;
            /* Or A4 portrait depending on your background */
        }

        @media print {

            body,
            html {
                margin: 0;
                padding: 0;
                width: 100%;
                height: 100%;
            }

            .card {
                width: 100vw;
                height: 100vh;
                background-size: 100% 100%;
            }
        }

        body {
            margin: 0;
            padding: 0;
        }

        .card {
            width: 100vw;
            height: 100vh;
            background-image: url("{{ asset('idc-print/k9Company.jpeg') }}");
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-position: center;
            position: relative;
            color: #000;
            overflow: hidden;
        }

        .row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
        }

        .column {
            flex: 1;
            padding: 10px;
        }

        .barcode {
            position: absolute;
            bottom: 65px;
            right: 62px;
            border-radius: 4px;
        }

        .logo {
            position: absolute;
            bottom: 62px;
            left: 62px;
        }

        .boss_photo {
            position: absolute;
            right: 65px;
            top: 35.1%;
            border-radius: 2px;
            height: 136px;
            width: 130px;
        }

        .assistant_photo {
            position: absolute;
            top: 35.1%;
            left: 67px;
            border-radius: 2px;
            height: 136px;
            width: 130px;
        }

        .boss_name_dr {
            position: absolute;
            right: 55px;
            top: 56.5%;
        }

        .boss_name_en {
            position: absolute;
            right: 50px;
            top: 60%;
        }

        .assistant_name_dr {
            position: absolute;
            left: 55px;
            top: 56.5%;
        }

        .assistant_name_en {
            position: absolute;
            left: 50px;
            top: 59.8%;
        }

        .company_name_dr {
            font-family: 'Bahij Titr';
            position: absolute;
            right: 60px;
            top: 66%;
            width: 41%;
            direction: rtl;
            text-align: justify;
            font-weight: bold;
            color: #063970;
        }

        .company_name_en {
            position: absolute;
            left: 60px;
            top: 65.8%;
            width: 41%;
            direction: ltr;
            text-align: justify;
            font-weight: bold;
            color: #063970;
        }

        .serial {
            position: absolute;
            right: 60px;
            top: 24%;
        }

        /* .start_date {
            position: absolute;
            left: 48%;
            top: 37.1%;
        }

        .end_date {
            position: absolute;
            left: 48%;
            top: 40.9%;
        } */


        .start_date {
            position: absolute;
            left: 48%;
            top: 39%;
        }

        .end_date {
            position: absolute;
            left: 48%;
            top: 42.8%;
        }

        .text_dr,
        .text_en {
            color: #063970;
            font-weight: bold;
        }

        .company_name_dr,
        .company_name_en {
            color: #000;
            /* Make paragraph text black again */
            font-weight: bold;
        }
    </style>
</head>

<body>
    <div class="card">
        <img src="{{ asset('idc-print/k9Company.jpeg') }}" style="display:none;" alt="preload">
        {{-- Company Logo --}}
        @if ($data->company_icon)
            <div class="logo">
                <img src="{{ asset($data->company_icon) }}" alt="Company Icon" height="84px"
                    style="border-radius: 5px;" width="84px" style="margin-top: 20px;" />
            </div>
        @endif

        {{-- License Type Indicator --}}
        @if ($data->license_type == 'new')
            <div
                style="background-color: #000; position: absolute; left: 56.6%; top: 33.8%; border-radius: 10px; width: 10px; height: 10px; padding: 4px;">
            </div>
        @elseif ($data->license_type == 'extend')
            <div
                style="background-color: #000; position: absolute; left: 46.3%; top: 33.7%; border-radius: 10px; width: 14px; height: 14px; padding: 3px;">
            </div>
        @else
            <div
                style="background-color: #000; position: absolute; left: 36.7%; top: 33.8%; border-radius: 10px; width: 10px; height: 10px; padding: 4px;">
            </div>
        @endif

        {{-- Dates --}}
        <div class="start_date">{{ $data->issue_date }}</div>
        <div class="end_date">{{ $data->validity_date }}</div>

        {{-- Boss Info --}}
        <div class="row">
            <div class="boss_name_dr">
                {{ '        ' . $data->boss_name_dr . ' ' . $data->boss_last_name_dr . '     ' }}
                <span class="text_dr">:رئیس</span>
            </div>

            <div class="boss_name_en">
                <span class="text_en">President:</span>
                {{ '        ' . $data->boss_name_en . ' ' . $data->boss_last_name_en . '     ' }}
            </div>
            @if ($data->boss_photo)
                <div class="column">
                    <img src="{{ asset($data->boss_photo) }}" class="boss_photo" alt="Boss Photo">
                </div>
            @endif
        </div>

        {{-- Assistant Info --}}
        <div class="row">
            <div class="assistant_name_dr">
                {{ '        ' . $data->assistant_name_dr . ' ' . $data->assistant_last_name_dr . '     ' }}
                <span class="text_dr">:معاون</span>
            </div>

            <div class="assistant_name_en">
                <span class="text_en">Vice President:</span>
                {{ '        ' . $data->assistant_name_en . ' ' . $data->assistant_last_name_en . '     ' }}
            </div>
            @if ($data->assistant_photo)
                <div class="column">
                    <img src="{{ asset($data->assistant_photo) }}" class="assistant_photo" alt="Assistant Photo">
                </div>
            @endif
        </div>

        {{-- Serial Number --}}
        <div class="serial">{{ $serialNumber }} :سریال نمبر</div>

        {{-- QR Code --}}
        <img src="{{ $barcodeDataUri }}" alt="QR Code" class="barcode" height="84px" width="84px">


        {{-- License Text --}}
        <div class="company_name_dr">
            دغه جواز د تعلیمي سپیو (K9) د کرایې ورکولو شرکت یا مؤسسې
            (<span class="text_dr">{{ $data->company_name_pa }}</span>) ته د فعالیت لپاره ورکړل شوی دی،
            تر څو خپل خدمات د افغانستان اسلامي امارت د نافذه قوانینو مطابق د (یو کال) لپاره وړاندې کړي.
        </div>

        <div class="company_name_en">
            This license is issued to the K9 (trained dogs) service company/institution
            (<span class="text_en">{{ $data->company_name_en }}</span>)
            to operate and provide its services in accordance with the applicable laws of the Islamic Emirate of
            Afghanistan
            for a period of one year.
        </div>

    </div>
</body>

</html>
