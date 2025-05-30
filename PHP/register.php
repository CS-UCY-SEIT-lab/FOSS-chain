<?php
include 'connect.php';
session_start();

if (!isset($_POST['wallet_address']) || !isset($_POST['private_key'])) {
    echo json_encode(['success' => false, 'message' => 'Wallet address or private key not received']);
    exit;
}

$username = $_POST['username'];
$password = $_POST['password'];
$wallet_address = $_POST['wallet_address'];
$private_key = $_POST['private_key'];

$stmt = $conn->prepare("SELECT COUNT(*) FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_row();
$userExists = $row[0];

if ($userExists) {
    echo json_encode(['success' => false, 'message' => 'Username already exists.']);
} else {
    $stmt = $conn->prepare("INSERT INTO users (username, password, wallet_address, private_key) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $username, $password, $wallet_address, $private_key);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error registering user.']);
    }
}

$stmt->close();
$conn->close();
?>
