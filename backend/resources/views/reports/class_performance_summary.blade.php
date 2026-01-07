<!DOCTYPE html>
<html>
<head>
    <title>Class Performance Summary</title>
    <style>
        body { font-family: sans-serif; }
        .header { text-align: center; margin-bottom: 30px; }
        .table { width: 100%; border-collapse: collapse; }
        .table th, .table td { border: 1px solid #ddd; padding: 8px; }
        .table th { background-color: #f2 f2 f2; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Class Performance Summary</h1>
        <h2>Class: {{ $class->classname }}</h2>
    </div>

    <table class="table">
        <thead>
            <tr>
                <th>Date</th>
                <th>Student</th>
                <th>Mood</th>
                <th>Attention Span</th>
                <th>Comments</th>
            </tr>
        </thead>
        <tbody>
            @foreach($observations as $observation)
                <tr>
                    <td>{{ $observation->date->format('Y-m-d') }}</td>
                    <td>{{ $observation->student->fullname }}</td>
                    <td>{{ $observation->mood }}</td>
                    <td>{{ $observation->attention_span }}</td>
                    <td>{{ $observation->teacher_comments }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
