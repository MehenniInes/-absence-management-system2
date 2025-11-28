<?php
require_once 'db_connect.php';
$pdo = connectDB();

if (!isset($_GET['id'])) {
    die("No student ID provided.");
}

$id = intval($_GET['id']);
$stmt = $pdo->prepare("DELETE FROM students WHERE id=?");
$stmt->execute([$id]);

header("Location: list_students.php");
exit;
?>
