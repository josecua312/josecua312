<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "pedidos"; // Tu base de datos

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo "Error de conexión: " . $conn->connect_error;
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
if (!$data || !is_array($data)) {
    echo "Error en los datos recibidos";
    exit;
}

$error = false;
foreach ($data as $item) {
    $nombre = $conn->real_escape_string($item['name']);
    $precio = $conn->real_escape_string($item['price']);
    $img = $conn->real_escape_string($item['img']);
    $cantidad = isset($item['quantity']) ? intval($item['quantity']) : 1;
    $sql = "INSERT INTO pedidos (producto, precio, imagen, cantidad) VALUES ('$nombre', '$precio', '$img', '$cantidad')";
    if (!$conn->query($sql)) {
        $error = true;
        break;
    }
}

if ($error) {
    echo "Error al realizar el pedido";
} else {
    echo "ok";
}
$conn->close();
?>