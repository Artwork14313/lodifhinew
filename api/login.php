<?php
session_start();

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require "db.php";

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data["email"] ?? "");
$password = $data["password"] ?? "";

if (!$email || !$password) {
    echo json_encode(["loggedIn" => false]);
    exit;
}

try {

    $stmt = $pdo->prepare("SELECT id, fullName, email, password FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user["password"])) {

        // Save session
        $_SESSION["user_id"] = $user["id"];
        $_SESSION["fullName"] = $user["fullName"];
        $_SESSION["email"] = $user["email"];

        echo json_encode([
            "loggedIn" => true,
            "user" => [
                "id" => $user["id"],
                "fullName" => $user["fullName"],
                "email" => $user["email"]
            ]
        ]);
        exit;
    }

    echo json_encode(["loggedIn" => false]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "loggedIn" => false,
        "error" => "Server error"
    ]);
}