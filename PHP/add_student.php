<?php
require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fullname = trim($_POST['fullname']);
    $matricule = trim($_POST['matricule']);
    $group_id = trim($_POST['group_id']);

    if ($fullname === "" || $matricule === "" || $group_id === "") {
        echo "All fields are required.";
        exit;
    }

    $pdo = connectDB();
    $stmt = $pdo->prepare("INSERT INTO students (fullname, matricule, group_id) VALUES (?, ?, ?)");
    $stmt->execute([$fullname, $matricule, $group_id]);

    echo "Student added successfully!";
    exit;
}
?>

<h2>Add Student</h2>
<form method="POST">
    Full Name: <input type="text" name="fullname"><br><br>
    Matricule: <input type="text" name="matricule"><br><br>
    Group: <input type="text" name="group_id"><br><br>
    <button type="submit">Add Student</button>
</form>
