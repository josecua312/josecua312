<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "usuarios";
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die(json_encode(["error" => "Conexión fallida"]));
}

$usuario = $_POST['usuario'] ?? '';

$stmt = $conn->prepare("SELECT nombre, apellido, correo, telefono FROM usuarios WHERE usuario = ?");
$stmt->bind_param("s", $usuario);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode($row);
} else {
    echo json_encode(["error" => "Usuario no encontrado"]);
}

$stmt->close();
$conn->close();
?>
