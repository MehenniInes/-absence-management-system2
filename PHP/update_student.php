<?php
require_once 'db_connect.php';
$pdo = connectDB();

if (!isset($_GET['id'])) {
    die("No student ID provided.");
}

$id = intval($_GET['id']);
$stmt = $pdo->prepare("SELECT * FROM students WHERE id=?");
$stmt->execute([$id]);
$student = $stmt->fetch();

if (!$student) {
    die("Student not found.");
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fullname = trim($_POST['fullname']);
    $matricule = trim($_POST['matricule']);
    $group_id = trim($_POST['group_id']);

    $stmt = $pdo->prepare("UPDATE students SET fullname=?, matricule=?, group_id=? WHERE id=?");
    $stmt->execute([$fullname, $matricule, $group_id, $id]);

    echo "Student updated successfully!";
    exit;
}
?>

<h2>Update Student</h2>
<form method="POST">
    Full Name: <input type="text" name="fullname" value="<?php echo $student['fullname']; ?>"><br><br>
    Matricule: <input type="text" name="matricule" value="<?php echo $student['matricule']; ?>"><br><br>
    Group: <input type="text" name="group_id" value="<?php echo $student['group_id']; ?>"><br><br>
    <button type="submit">Update Student</button>
</form>
