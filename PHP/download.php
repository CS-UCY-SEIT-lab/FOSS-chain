<?php
ob_start();
include 'connect.php';

if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['id'])) {
    $projectId = $_GET['id'];

    $stmt = $conn->prepare("SELECT file_path FROM projects WHERE project_id = ?");
    $stmt->bind_param("i", $projectId);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();

    if ($row) {
        $filePath = $row['file_path'];

        if (file_exists($filePath)) {
            header('Content-Description: File Transfer');
            header('Content-Type: application/octet-stream');
            header('Content-Disposition: attachment; filename="' . basename($filePath) . '"');
            header('Expires: 0');
            header('Cache-Control: must-revalidate');
            header('Pragma: public');
            header('Content-Length: ' . filesize($filePath));
            readfile($filePath);
            exit;
        } else {
            echo 'Error: File not found.';
        }
    } else {
        echo 'Error: No record found for the provided ID.';
    }

    $stmt->close();
} else {
    echo 'Error: Invalid request method or no ID provided.';
}
ob_end_flush();
?>
