<!DOCTYPE html>
<html>
<head>
    <title>Event Summary Report</title>
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
        <h1>Event Summary Report</h1>
    </div>

    <table class="table">
        <thead>
            <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Date</th>
                <th>Venue</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            @foreach($events as $event)
                <tr>
                    <td>{{ $event->title }}</td>
                    <td>{{ ucfirst(str_replace('_', ' ', $event->type)) }}</td>
                    <td>{{ $event->date->format('Y-m-d') }}</td>
                    <td>{{ $event->venue }}</td>
                    <td>{{ $event->description }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
