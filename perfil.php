<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "usuarios";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

$usuario = $_POST['usuario'] ?? '';
$nombre = $_POST['nombre'] ?? '';
$apellido = $_POST['apellido'] ?? '';
$correo = $_POST['correo'] ?? '';
$telefono = $_POST['telefono'] ?? '';

if (!$usuario) {
    echo "error|Usuario no identificado";
    exit;
}

$stmt = $conn->prepare("UPDATE usuarios SET nombre = ?, apellido = ?, correo = ?, telefono = ? WHERE usuario = ?");
$stmt->bind_param("sssss", $nombre, $apellido, $correo, $telefono, $usuario);

if ($stmt->execute()) {
    echo "ok|Perfil actualizado";
} else {
    echo "error|No se pudo actualizar";
}

$stmt->close();
$conn->close();
?>
