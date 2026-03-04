<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require "db.php";

// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

$firstName = trim($data["firstName"] ?? "");
$lastName  = trim($data["lastName"] ?? "");
$email     = trim($data["email"] ?? "");
$password  = $data["password"] ?? "";

// Validation
if (!$firstName || !$lastName || !$email || !$password) {
    http_response_code(400);
    echo json_encode(["error" => "All fields are required"]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid email"]);
    exit;
}

if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode(["error" => "Password must be at least 6 characters"]);
    exit;
}

// Create fullname by concatenating first and last name
$fullname = $firstName . ' ' . $lastName;

try {
    // Check if email exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);

    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(["error" => "Email already registered"]);
        exit;
    }

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Insert user into DB
    $stmt = $pdo->prepare(
        "INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)"
    );
    $stmt->execute([$fullname, $email, $hashedPassword]);

    echo json_encode([
        "success" => true,
        "message" => "Account created successfully"
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Server error"]);
}
