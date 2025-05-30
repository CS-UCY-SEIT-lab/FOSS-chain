<?php
include 'connect.php';
session_start();

$softwareList = [];
$userId = $_SESSION['id'];

$stmt = $conn->prepare("SELECT project_id, project_name, project_description, file_path, license_type FROM projects WHERE user_id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {
    $row['file_path'] = json_decode($row['file_path']);
    $softwareList[] = $row;
}
header('Content-Type: application/json');
echo json_encode($softwareList);
?>
