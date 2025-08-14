<?php
session_start();

if (!isset($_SESSION['usuario'])) {
    header("Location: login.html");
    exit;
}

$nombre = $_SESSION['usuario'];
$rol = $_SESSION['rol'];
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Bienvenido - CAPS_STORE</title>
    <link rel="stylesheet" href="panel.css">
</head>
<body>
    <h1>Hola, <?php echo htmlspecialchars($nombre); ?> 👋</h1>
    <p>Has iniciado sesión como <strong><?php echo $rol; ?></strong>.</p>

    <?php if ($rol === 'admin'): ?>
        <a href="admin_panel.php" class="boton-flotante">⚙ Admin</a>
    <?php endif; ?>

</body>
</html>

