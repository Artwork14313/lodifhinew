<?php
session_start();

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (isset($_SESSION["user_id"])) {

    echo json_encode([
        "loggedIn" => true,
        "user" => [
            "id" => $_SESSION["user_id"],
            "fullName" => $_SESSION["fullName"],
            "email" => $_SESSION["email"]
        ]
    ]);

} else {
    echo json_encode([
        "loggedIn" => false
    ]);
}
?>