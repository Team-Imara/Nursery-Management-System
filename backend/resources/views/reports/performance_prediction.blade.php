<!DOCTYPE html>
<html>
<head>
    <title>Performance Prediction Report</title>
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
        <h1>Performance Prediction Report</h1>
    </div>

    <table class="table">
        <thead>
            <tr>
                <th>Date</th>
                <th>Mood</th>
                <th>Social Interaction</th>
                <th>Attention Span</th>
                <th>Language Development</th>
            </tr>
        </thead>
        <tbody>
            @foreach($observations as $observation)
                <tr>
                    <td>{{ $observation->date->format('Y-m-d') }}</td>
                    <td>{{ $observation->mood }}</td>
                    <td>{{ $observation->social_interaction }}</td>
                    <td>{{ $observation->attention_span }}</td>
                    <td>{{ $observation->language_development }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
