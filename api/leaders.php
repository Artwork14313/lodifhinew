<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

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

/* 🔹 allow PUT using POST + _method */
if ($method === "POST" && isset($_GET['_method']) && $_GET['_method'] === "PUT") {
    $method = "PUT";
}

/* 🔹 upload folder */
$uploadDir = dirname(__DIR__) . "/public/";

if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

switch ($method) {

    // ========================
    // GET - Fetch Leader
    // ========================
    case 'GET':

        $stmt = $conn->prepare(
            "SELECT id, Source, fullName, title
             FROM leaders
             WHERE isActive = 1
             ORDER BY id ASC"
        );

        $stmt->execute();
        $result = $stmt->get_result();

        $leaders = [];

        while ($row = $result->fetch_assoc()) {
            $leaders[] = $row;
        }

        echo json_encode($leaders);
        break;


    // ========================
    // POST - Add Leader
    // ========================
    case 'POST':

        $fullName = trim($_POST['fullName'] ?? "");
        $title = trim($_POST['title'] ?? "");

        if (empty($fullName)) {
            http_response_code(400);
            echo json_encode(["error" => "Full Name are required"]);
            exit();
        }else if (empty($title)) {
            http_response_code(400);
            echo json_encode(["error" => "Title are required"]);
            exit();
        }

        $Source = "";

        /* 🔹 handle file upload */
        if (isset($_FILES['file']) && $_FILES['file']['error'] === 0) {

            $filename = basename($_FILES["file"]["name"]);
            $targetFile = $uploadDir . $filename;

            move_uploaded_file($_FILES["file"]["tmp_name"], $targetFile);

            $Source = "/" . $filename;
        }

        $stmt = $conn->prepare(
            "INSERT INTO leaders (Source, fullName, title, isActive)
             VALUES (?, ?, ?, 1)"
        );

        $stmt->bind_param("sss", $Source, $fullName, $title);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Doctor added successfully"]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Insert failed"]);
        }

        break;


    // ========================
    // PUT - Update Doctor
    // ========================
    case 'PUT':

        // Parse PUT data (for FormData multipart)
        $id = 0;
        $fullName = "";
        $title = "";
        $Source = "";

        // If request is multipart/form-data, use $_POST and $_FILES
        if (!empty($_POST)) {
            $id = (int) ($_POST['id'] ?? 0);
            $fullName = trim($_POST['fullName'] ?? "");
            $title = trim($_POST['title'] ?? "");
        } else {
            // fallback for JSON payloads
            $data = json_decode(file_get_contents("php://input"), true);
            $id = (int) ($data['id'] ?? 0);
            $fullName = trim($data['fullName'] ?? "");
            $title = trim($data['title'] ?? "");
        }

        if ($id === 0 || empty($fullName) || empty($title)) {
            http_response_code(400);
            echo json_encode([
                "error" => "ID, fullName and title are required",
                "debug" => ["id" => $id, "fullName" => $fullName, "title" => $title, "_POST" => $_POST, "_FILES" => $_FILES]
            ]);
            exit();
        }

        // Get old image
        $old = $conn->query("SELECT Source FROM leaders WHERE id=$id")->fetch_assoc();
        $Source = $old['Source'] ?? "";

        // Handle new file upload if exists
        if (isset($_FILES['file']) && $_FILES['file']['error'] === 0) {
            $filename = basename($_FILES["file"]["name"]);
            $targetFile = $uploadDir . $filename;

            if (move_uploaded_file($_FILES["file"]["tmp_name"], $targetFile)) {
                $Source = "/" . $filename; // only replace Source if upload succeeded
            }
        }

        $stmt = $conn->prepare(
            "UPDATE leaders
         SET Source = ?, fullName = ?, title = ?
         WHERE id = ?"
        );

        $stmt->bind_param("sssi", $Source, $fullName, $title, $id);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Doctor updated successfully"]);
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

        $id = (int) $data['id'];

        $stmt = $conn->prepare(
            "UPDATE leaders
             SET isActive = 0
             WHERE id = ?"
        );

        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Doctor deleted successfully"]);
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