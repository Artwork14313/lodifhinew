<?php
session_start();
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
$conn = new mysqli("localhost", "root", "", "lodifhidb");

$data = json_decode(file_get_contents("php://input"), true);
$email = $data["email"];
$password = $data["password"];

$sql = "SELECT * FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($user = $result->fetch_assoc()) {
    if ($password === $user["password"]) {
        $_SESSION["user"] = $user["email"];
        echo json_encode([
            "loggedIn" => true,
            "user" => $user["email"]
        ]);
        exit;
    }
}

echo json_encode(["loggedIn" => false]);
