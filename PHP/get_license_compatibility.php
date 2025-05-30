<?php
include 'connect.php';

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$originalLicense = $data['originalLicense'];
$uploadedLicense = $data['uploadedLicense'];

if (empty($originalLicense) || empty($uploadedLicense)) {
    echo json_encode(["success" => false, "message" => "Missing license data."]);
    exit;
}

$query = "SELECT compatible_license FROM license_compatibility_temp WHERE original_license = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $originalLicense);
$stmt->execute();
$result = $stmt->get_result();
    
error_log("Checking license compatibility for: " . $originalLicense . " against " . $uploadedLicense);

$compatibleLicenses = [];
while ($row = $result->fetch_assoc()) {
    $compatibleLicenses[] = $row['compatible_license'];
}

error_log("Compatible Licenses Retrieved from Database: " . json_encode($compatibleLicenses));

echo json_encode([
    "success" => true,
    "compatibleLicenses" => $compatibleLicenses
]);
?>
