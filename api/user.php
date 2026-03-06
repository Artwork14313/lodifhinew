<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = new mysqli("localhost", "root", "", "lodifhidb");

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    // ========================
    // GET - Load User Info
    // ========================
    case 'GET':

        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(["error" => "User ID required"]);
            exit();
        }

        $id = (int)$_GET['id'];

        $stmt = $conn->prepare("SELECT fullName, email FROM users WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();

        $row = $result->fetch_assoc();

        if ($row) {
            echo json_encode($row);
        } else {
            echo json_encode([
                "fullName" => "",
                "email" => ""
            ]);
        }

    break;


    // ========================
    // PUT - Update User Info
    // ========================
    case 'PUT':

        $data = json_decode(file_get_contents("php://input"), true);

        $id = (int)($data['id'] ?? 0);
        $fullName = trim($data['fullName'] ?? "");
        $email = trim($data['email'] ?? "");
        $oldPassword = $data['oldPassword'] ?? "";
        $newPassword = $data['password'] ?? "";

        // ❌ Prevent empty fields
        if ($id === 0 || $fullName === "" || $email === "" || $oldPassword === "") {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "All fields including old password are required"
            ]);
            exit();
        }

        // Get current password
        $stmt = $conn->prepare("SELECT password FROM users WHERE id=?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        if (!$user) {
            echo json_encode([
                "success" => false,
                "message" => "User not found"
            ]);
            exit();
        }

        // 🔐 Verify old password
        if (!password_verify($oldPassword, $user["password"])) {
            echo json_encode([
                "success" => false,
                "message" => "Old password is incorrect"
            ]);
            exit();
        }

        // If new password exists
        if (!empty($newPassword)) {

            $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

            $stmt = $conn->prepare(
                "UPDATE users SET fullName=?, email=?, password=? WHERE id=?"
            );

            $stmt->bind_param("sssi", $fullName, $email, $hashedPassword, $id);

        } else {

            $stmt = $conn->prepare(
                "UPDATE users SET fullName=?, email=? WHERE id=?"
            );

            $stmt->bind_param("ssi", $fullName, $email, $id);
        }

        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Profile updated successfully"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Update failed"
            ]);
        }

    break;
}

$conn->close();
?>