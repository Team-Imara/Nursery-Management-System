<!DOCTYPE html>
<html>
<head>
    <title>Teacher-Class Allocation Report</title>
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
        <h1>Teacher-Class Allocation Report</h1>
    </div>

    <table class="table">
        <thead>
            <tr>
                <th>Class</th>
                <th>Head Teacher</th>
                <th>Assistant Teachers</th>
                <th>Capacity</th>
            </tr>
        </thead>
        <tbody>
            @foreach($classes as $class)
                <tr>
                    <td>{{ $class->classname }}</td>
                    <td>{{ $class->headTeacher->fullname }}</td>
                    <td>
                        {{ $class->assistantTeachers->pluck('fullname')->join(', ') }}
                    </td>
                    <td>{{ $class->capacity }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
