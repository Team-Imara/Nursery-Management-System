<!DOCTYPE html>
<html>
<head>
    <title>Teacher Attendance & Leave Report</title>
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
        <h1>Teacher Attendance & Leave Report</h1>
    </div>

    <h3>Attendances</h3>
    <table class="table">
        <thead>
            <tr>
                <th>Date</th>
                <th>Teacher</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($attendances as $attendance)
                <tr>
                    <td>{{ $attendance->date->format('Y-m-d') }}</td>
                    <td>{{ $attendance->teacher->fullname }}</td>
                    <td>{{ ucfirst($attendance->status) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <h3>Leave Requests</h3>
    <table class="table">
        <thead>
            <tr>
                <th>Teacher</th>
                <th>From</th>
                <th>To</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($leaves as $leave)
                <tr>
                    <td>{{ $leave->teacher->fullname }}</td>
                    <td>{{ $leave->from_date->format('Y-m-d') }}</td>
                    <td>{{ $leave->to_date->format('Y-m-d') }}</td>
                    <td>{{ ucfirst($leave->status) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
