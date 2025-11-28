<?php


$studentsFile = 'students.json';
$today = date('Y-m-d');
$attendanceFile = "attendance_$today.json";

// Check if attendance file already exists
if (file_exists($attendanceFile)) {
    echo "<h2>Attendance for today has already been taken.</h2>";
    exit;
}

// Load students
$students = [];
if (file_exists($studentsFile)) {
    $jsonData = file_get_contents($studentsFile);
    $students = json_decode($jsonData, true);
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $attendance = [];
    foreach ($students as $student) {
        $id = $student['student_id'];
        $status = isset($_POST['status'][$id]) ? $_POST['status'][$id] : 'absent';
        $attendance[] = [
            'student_id' => $id,
            'status' => $status
        ];
    }
    file_put_contents($attendanceFile, json_encode($attendance, JSON_PRETTY_PRINT));
    echo "<h2>Attendance saved successfully for $today!</h2>";
    exit;
}
?>

<h2>Take Attendance for <?php echo $today; ?></h2>
<form method="POST">
<table border="1">
    <tr>
        <th>Student ID</th>
        <th>Name</th>
        <th>Status</th>
    </tr>
    <?php foreach ($students as $student): ?>
    <tr>
        <td><?php echo htmlspecialchars($student['student_id']); ?></td>
        <td><?php echo htmlspecialchars($student['name']); ?></td>
        <td>
            <select name="status[<?php echo $student['student_id']; ?>]">
                <option value="present">Present</option>
                <option value="absent">Absent</option>
            </select>
        </td>
    </tr>
    <?php endforeach; ?>
</table>
<br>
<button type="submit">Submit Attendance</button>
</form>
