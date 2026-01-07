<!DOCTYPE html>
<html>
<head>
    <title>Student & Tutor Details Report</title>
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
        <h1>Student & Tutor Details Report</h1>
    </div>

    <table class="table">
        <thead>
            <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Head Teacher (Tutor)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($students as $student)
                <tr>
                    <td>{{ $student->fullname }}</td>
                    <td>{{ $student->classe->classname }}</td>
                    <td>{{ $student->classe->headTeacher->fullname }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
