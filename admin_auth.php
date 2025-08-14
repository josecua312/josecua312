<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: text/plain");

$admin_user = 'JOSE';  // ⚠️ Verifica ortografía
$admin_pass = '2005';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo 'error|Método no permitido. Usa POST.';
    exit;
}

$usuario = isset($_POST['usuario']) ? trim($_POST['usuario']) : '';
$contrasena = isset($_POST['contrasena']) ? trim($_POST['contrasena']) : '';

if (empty($usuario) || empty($contrasena)) {
    echo 'error|Faltan datos del administrador.';
    exit;
}

if (strcasecmp($usuario, $admin_user) === 0 && $contrasena === $admin_pass) {
    echo 'ok|' . $admin_user . '|admin';
} else {
    echo 'error|Usuario o contraseña de administrador incorrectos.';
}
?>
