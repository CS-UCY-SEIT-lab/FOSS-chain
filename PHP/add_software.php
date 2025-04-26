<?php
ob_start();
header('Content-Type: application/json'); 
include 'connect.php';  
session_start();
file_put_contents("debug_project_upload.txt", print_r($_POST, true) . "\nFiles: " . print_r($_FILES, true));
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL); 

$response = ['success' => false];

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Invalid request method.');
    }
    $projectName = $_POST['projectName'] ?? '';
    $projectDescription = $_POST['projectDescription'] ?? '';
    $walletAddress = $_POST['walletAddress'] ?? '';
    $licenseType = $_POST['licenseType'] ?? null;
    $fileHash = $_POST['fileHash'] ?? '';
    $userId = $_SESSION['id'] ?? '';
    $parentProjectId = isset($_POST['parentProjectId']) && is_numeric($_POST['parentProjectId']) ? intval($_POST['parentProjectId']) : null;


    file_put_contents("debug_project_upload.txt", "\nReceived Data:\n" . print_r($_POST, true), FILE_APPEND);

    if (empty($walletAddress) || !preg_match("/^0x[a-fA-F0-9]{40}$/", $walletAddress)) {
        throw new Exception('Invalid wallet address.');
    }

    if (empty($projectName) || empty($projectDescription) || empty($userId)) {
        throw new Exception('Missing required project details.');
    }

    if (!isset($_FILES['projectFiles']) || $_FILES['projectFiles']['error'] !== UPLOAD_ERR_OK) {
        throw new Exception("File upload error: " . $_FILES['projectFiles']['error']);
    }

    $uploadDir = __DIR__ . '/uploads/' . bin2hex(random_bytes(10)) . '/';
    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0777, true)) {
            throw new Exception("Failed to create upload directory.");
        }
    }

    $filePath = $uploadDir . basename($_FILES['projectFiles']['name']);
    if (!move_uploaded_file($_FILES['projectFiles']['tmp_name'], $filePath)) {
        throw new Exception("Failed to move uploaded file.");
    }

    file_put_contents("debug_project_upload.txt", "File moved successfully to: " . $filePath . "\n", FILE_APPEND);

    $stmt = $conn->prepare("INSERT INTO projects (user_id, project_name, project_description, file_path, wallet_address, license_type, file_hash, parent_project_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("issssssi", $userId, $projectName, $projectDescription, $filePath, $walletAddress, $licenseType, $fileHash, $parentProjectId);


    if (!$stmt->execute()) {
        throw new Exception('Database error: ' . $stmt->error);
    }

    $projectId = $conn->insert_id;
    $response['success'] = true;
    $response['message'] = 'Project successfully added.';
    $response['project_id'] = $projectId;

    file_put_contents("debug_project_upload.txt", "Project inserted successfully with ID: " . $projectId . "\n", FILE_APPEND);
} catch (Exception $e) {
    $response['error'] = $e->getMessage();
    file_put_contents("debug_project_upload.txt", "Error: " . $e->getMessage() . "\n", FILE_APPEND);
}

ob_end_clean();
echo json_encode($response);
ob_end_flush();
?>
