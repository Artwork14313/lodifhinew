<?php
session_start();

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173"); 
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data["email"] ?? "");
$password = $data["password"] ?? "";

if (!$email || !$password) {
    echo json_encode(["loggedIn" => false]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT id, email, password FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user["password"])) {
        $_SESSION["user_id"] = $user["id"];
        $_SESSION["email"] = $user["email"];

        echo json_encode([
            "loggedIn" => true,
            "user" => $user["email"]
        ]);
        exit;
    }

    echo json_encode(["loggedIn" => false]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["loggedIn" => false, "error" => "Server error"]);
}
