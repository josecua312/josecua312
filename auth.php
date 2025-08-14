<?php
// Conexión a la base de datos
$host = "localhost";
$user = "root";
$pass = "";
$db = "usuarios"; // Asegúrate de que la base de datos existe

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Asegura que se recibe POST y el campo 'action'
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['action'])) {
    $action = $_POST['action'];

    if ($action === 'login') {
        $usuario = $_POST['usuario'] ?? '';
        $contrasena = $_POST['contrasena'] ?? '';

        $stmt = $conn->prepare("SELECT contrasena FROM usuarios WHERE usuario = ?");
        $stmt->bind_param("s", $usuario);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            // Verifica si la contraseña ingresada coincide con la cifrada
            if (password_verify($contrasena, $row['contrasena'])) {
                echo "ok|" . $usuario . "|usuario";
            } else {
                echo "error|Contraseña incorrecta";
            }
        } else {
            echo "error|Usuario no encontrado";
        }

        $stmt->close();
    }

    if ($action === 'register') {
        $usuario = $_POST['nuevo_usuario'] ?? '';
        $correo = $_POST['nuevo_correo'] ?? '';
        $contrasena = $_POST['nuevo_contrasena'] ?? '';

        // Validar campos vacíos
        if (empty($usuario) || empty($correo) || empty($contrasena)) {
            echo "error|Todos los campos son obligatorios";
            exit;
        }

        // Verifica si el usuario ya existe
        $checkStmt = $conn->prepare("SELECT id FROM usuarios WHERE usuario = ?");
        $checkStmt->bind_param("s", $usuario);
        $checkStmt->execute();
        $checkStmt->store_result();
        if ($checkStmt->num_rows > 0) {
            echo "error|El usuario ya existe";
            $checkStmt->close();
            exit;
        }
        $checkStmt->close();

        // Encriptar contraseña y registrar
        $hash = password_hash($contrasena, PASSWORD_DEFAULT);
        $stmt = $conn->prepare("INSERT INTO usuarios (usuario, correo, contrasena) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $usuario, $correo, $hash);

        if ($stmt->execute()) {
            echo "ok|" . $usuario . "|usuario";
        } else {
            echo "error|No se pudo registrar";
        }

        $stmt->close();
    }

    $conn->close();
}
?>
