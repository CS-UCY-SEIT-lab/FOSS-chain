<?php
include 'connect.php';
session_start();

$searchQuery = $_GET['q'] ?? '';
$searchResults = [];

if (!empty($searchQuery)) {
    $stmt = $conn->prepare("SELECT project_id, project_name, project_description, license_type FROM projects WHERE project_name LIKE ?");
    $likeQuery = "%$searchQuery%";
    $stmt->bind_param("s", $likeQuery);
    $stmt->execute();
} else {
    $stmt = $conn->prepare("SELECT project_id, project_name, project_description, license_type FROM projects");
    $stmt->execute();
}

$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {
    $searchResults[] = $row;
}

header('Content-Type: application/json');
echo json_encode($searchResults);
?>
