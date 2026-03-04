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
        $sql = "SELECT id, department, contactNum 
                FROM contact_directory 
                WHERE isActive = 1
                ORDER BY id ASC";

        $result = $conn->query($sql);
        $contacts = [];

        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $contacts[] = $row;
            }
        }

        echo json_encode($contacts);
        break;


    // ========================
    // POST - Add Contact
    // ========================
    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);

        $department = $conn->real_escape_string($data['department']);
        $contactNum = $conn->real_escape_string($data['contactNum']);

        $sql = "INSERT INTO contact_directory (department, contactNum, isActive)
                VALUES ('$department', '$contactNum', 1)";

        if ($conn->query($sql)) {
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

        $id = (int)$data['id'];
        $department = $conn->real_escape_string($data['department']);
        $contactNum = $conn->real_escape_string($data['contactNum']);

        $sql = "UPDATE contact_directory 
                SET department = '$department',
                    contactNum = '$contactNum'
                WHERE id = $id";

        if ($conn->query($sql)) {
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
        $id = (int)$data['id'];

        $sql = "UPDATE contact_directory 
                SET isActive = 0
                WHERE id = $id";

        if ($conn->query($sql)) {
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