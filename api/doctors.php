<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = "localhost";
$user = "root";
$password = "";
$database = "lodifhidb";

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    // ========================
    // GET - Fetch Contacts
    // ========================
    case 'GET':

        $stmt = $conn->prepare(
            "SELECT id, fullname, specialization
             FROM doctors
             WHERE isActive = 1
             ORDER BY id ASC"
        );

        $stmt->execute();
        $result = $stmt->get_result();

        $contacts = [];

        while ($row = $result->fetch_assoc()) {
            $contacts[] = $row;
        }

        echo json_encode($contacts);
        break;


    // ========================
    // POST - Add Contact
    // ========================
    case 'POST':

        $data = json_decode(file_get_contents("php://input"), true);

        if (
            empty($data['fullname']) ||
            empty($data['specialization'])
        ) {
            http_response_code(400);
            echo json_encode(["error" => "fullname and Contact Number are required"]);
            exit();
        }

        $fullname = trim($data['fullname']);
        $specialization = trim($data['specialization']);

        $stmt = $conn->prepare(
            "INSERT INTO doctors (fullname, specialization, isActive)
             VALUES (?, ?, 1)"
        );

        $stmt->bind_param("ss", $fullname, $specialization);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Contact added successfully"]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Insert failed"]);
        }

        break;


    // ========================
    // PUT - Update Contact
    // ========================
    case 'PUT':

        $data = json_decode(file_get_contents("php://input"), true);

        if (
            empty($data['id']) ||
            empty($data['fullname']) ||
            empty($data['specialization'])
        ) {
            http_response_code(400);
            echo json_encode(["error" => "ID, fullname and Contact Number are required"]);
            exit();
        }

        $id = (int)$data['id'];
        $fullname = trim($data['fullname']);
        $specialization = trim($data['specialization']);

        $stmt = $conn->prepare(
            "UPDATE doctors
             SET fullname = ?, specialization = ?
             WHERE id = ?"
        );

        $stmt->bind_param("ssi", $fullname, $specialization, $id);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Contact updated successfully"]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Update failed"]);
        }

        break;


    // ========================
    // DELETE - Soft Delete
    // ========================
    case 'DELETE':

        $data = json_decode(file_get_contents("php://input"), true);

        if (empty($data['id'])) {
            http_response_code(400);
            echo json_encode(["error" => "ID is required"]);
            exit();
        }

        $id = (int)$data['id'];

        $stmt = $conn->prepare(
            "UPDATE doctors
             SET isActive = 0
             WHERE id = ?"
        );

        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Contact deleted successfully"]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Delete failed"]);
        }

        break;


    default:
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
        break;
}

$conn->close();
?>