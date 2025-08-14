<?php
session_start();
$conexion = new mysqli("localhost", "root", "", "caps_store");

if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}

$email = $_POST['email'];
$contrasena = $_POST['contrasena'];
$hash = hash('sha256', $contrasena);

$sql = "SELECT * FROM usuarios WHERE email = ? AND contraseña = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("ss", $email, $hash);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows === 1) {
    $usuario = $resultado->fetch_assoc();
    $_SESSION['usuario'] = $usuario['nombre'];
    $_SESSION['rol'] = $usuario['rol'];
    header("Location: panel.php"); // Redirige a un panel general
} else {
    echo "Credenciales incorrectas.";
}
?>
