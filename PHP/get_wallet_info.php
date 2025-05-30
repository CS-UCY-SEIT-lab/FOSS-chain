<?php
session_start();
include 'connect.php';

if (isset($_SESSION['wallet_address'])) {
    echo json_encode(['success' => true, 'wallet_address' => $_SESSION['wallet_address']]);
} else {
    echo json_encode(['success' => false, 'message' => 'Wallet address not found']);
}
?>
