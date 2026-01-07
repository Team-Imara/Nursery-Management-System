<!DOCTYPE html>
<html>
<head>
    <title>Attendance Report</title>
    <style>
        body { font-family: sans-serif; }
        .header { text-align: center; margin-bottom: 30px; }
        .table { width: 100%; border-collapse: collapse; }
        .table th, .table td { border: 1px solid #ddd; padding: 8px; }
        .table th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Attendance Report</h1>
    </div>

    <table class="table">
        <thead>
            <tr>
                <th>Date</th>
                <th>Student</th>
                <th>Class</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($attendances as $attendance)
                <tr>
                    <td>{{ $attendance->attendance_date->format('Y-m-d') }}</td>
                    <td>{{ $attendance->student->fullname }}</td>
                    <td>{{ $attendance->classe->classname }}</td>
                    <td>{{ ucfirst($attendance->status) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
