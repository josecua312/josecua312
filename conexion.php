<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "caps_store";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}
?>
