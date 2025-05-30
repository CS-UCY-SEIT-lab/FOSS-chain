<?php
include 'connect.php';
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['functionHashes']) || empty($data['functionHashes'])) {
    echo json_encode(["success" => false, "message" => "No function hashes received."]);
    exit;
}

if (!isset($data['projectId']) || empty($data['projectId'])) {
    echo json_encode(["success" => false, "message" => "No project ID received."]);
    exit;
}

$functionHashes = $data['functionHashes'];
$projectId = intval($data['projectId']);

$checkProject = $conn->prepare("SELECT project_id FROM projects WHERE project_id = ?");
$checkProject->bind_param("i", $projectId);
$checkProject->execute();
$result = $checkProject->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Project ID does not exist in `projects` table."]);
    exit;
}

$responseMessages = [];

foreach ($functionHashes as $hash) {
    $query = "INSERT INTO function_hashes (function_hash, project_id) VALUES (?, ?)";
    $stmt = $conn->prepare($query);

    if (!$stmt) {
        echo json_encode(["success" => false, "message" => "Database prepare failed: " . $conn->error]);
        exit;
    }

    $stmt->bind_param("si", $hash, $projectId);
    
    if (!$stmt->execute()) {
        $responseMessages[] = "Error inserting hash: $hash - " . $stmt->error;
    }
}

if (!empty($responseMessages)) {
    echo json_encode(["success" => false, "message" => "Some hashes failed to store.", "errors" => $responseMessages]);
} else {
    echo json_encode(["success" => true, "message" => "Function hashes stored successfully."]);
}
?>
