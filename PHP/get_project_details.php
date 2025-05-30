<?php
include 'connect.php';
header('Content-Type: application/json');

$response = ['success' => false];

if (isset($_GET['id'])) {
    $projectId = intval($_GET['id']);

    $stmt = $conn->prepare("SELECT project_id, project_name, project_description, license_type, parent_project_id FROM projects WHERE project_id = ?");
    $stmt->bind_param("i", $projectId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $project = $result->fetch_assoc();
    
        $response['success'] = true;
        $response['project_id'] = $project['project_id'];
        $response['project_name'] = $project['project_name'];
        $response['project_description'] = $project['project_description'];
        $response['license_type'] = $project['license_type'];
        $response['parent_project_id'] = $project['parent_project_id'];
    } else {
        $response['message'] = "Project not found.";
    }

    $stmt->close();
} else {
    $response['message'] = "No project ID provided.";
}

echo json_encode($response);
?>
