<?php
require_once 'db_connect.php';

$pdo = connectDB();
$stmt = $pdo->query("SELECT * FROM students ORDER BY id ASC");
$students = $stmt->fetchAll();
?>

<h2>Students List</h2>
<table border="1">
    <tr>
        <th>ID</th>
        <th>Full Name</th>
        <th>Matricule</th>
        <th>Group</th>
        <th>Actions</th>
    </tr>
    <?php foreach ($students as $s): ?>
    <tr>
        <td><?php echo $s['id']; ?></td>
        <td><?php echo $s['fullname']; ?></td>
        <td><?php echo $s['matricule']; ?></td>
        <td><?php echo $s['group_id']; ?></td>
        <td>
            <a href="update_student.php?id=<?php echo $s['id']; ?>">Edit</a> |
            <a href="delete_student.php?id=<?php echo $s['id']; ?>" onclick="return confirm('Delete this student?');">Delete</a>
        </td>
    </tr>
    <?php endforeach; ?>
</table>
