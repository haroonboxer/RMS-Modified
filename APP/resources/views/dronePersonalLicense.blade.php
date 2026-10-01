<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Armored Vehicle Workshop License</title>
    <link rel="preload" as="image" href="{{ asset('idc-print/personalDrone.jpeg') }}">

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
            background-image: url("{{ asset('idc-print/personalDrone.jpeg') }}");
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
            top: 65.8%;
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
        <img src="{{ asset('idc-print/personalDrone.jpeg') }}" style="display:none;" alt="preload">

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

        {{-- Personal Info --}}
        <div class="row">
            <div class="boss_name_dr">
                {{ '   ' . $fullNameDr . '   ' }}
                <span class="text_dr">:نام</span>
            </div>

            <div class="boss_name_en">
                <span class="text_en">Name:</span>
                {{ '   ' . $fullNameEn . '   ' }}
            </div>

            @if ($data->photo)
                <div class="column">
                    <img src="{{ asset($data->photo) }}" class="boss_photo" alt="Photo">
                </div>
            @endif
        </div>

        {{-- Serial Number --}}
        <div class="serial">{{ $serialNumber }} :سریال نمبر</div>

        {{-- QR Code --}}
        <img src="{{ $barcodeDataUri }}" alt="QR Code" class="barcode" height="84px" width="84px">

        {{-- License Text --}}
        <div class="company_name_dr">
            دغه جواز د پروازي (ډرون) کامرو څخه د ګټې اخیستنې لپاره
            (<span class="text_dr">{{ $fullNameDr }}</span>) ته توزیع شوی دی،
            تر څو خپل خدمات د افغانستان اسلامي امارت د نافذه قوانینو مطابق په خپله اړونده ساحه کې د (یو کال) لپاره
            وړاندې کړي.
        </div>

        <div class="company_name_en">
            This license is issued to (<span class="text_en">{{ $fullNameEn }}</span>)
            for the use of drone cameras in order to provide services in their respective field
            in accordance with the applicable laws of the Islamic Emirate of Afghanistan
            for a period of one year.
        </div>
    </div>
</body>

</html>
