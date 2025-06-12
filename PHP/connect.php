<?php 
$conn = new mysqli("localhost", "root","","fosschain");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
