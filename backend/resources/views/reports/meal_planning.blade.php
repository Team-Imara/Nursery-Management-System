<!DOCTYPE html>
<html>
<head>
    <title>Meal Planning Report</title>
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
        <h1>Meal Planning Report</h1>
    </div>

    <table class="table">
        <thead>
            <tr>
                <th>Date</th>
                <th>Student</th>
                <th>Meal</th>
                <th>Status</th>
                <th>Suitable</th>
            </tr>
        </thead>
        <tbody>
            @foreach($meals as $meal)
                <tr>
                    <td>{{ $meal->date->format('Y-m-d') }}</td>
                    <td>{{ $meal->student->fullname }}</td>
                    <td>{{ $meal->mealPlan->menu }}</td>
                    <td>{{ $meal->status }}</td>
                    <td>{{ $meal->suitable ? 'Yes' : 'No' }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
