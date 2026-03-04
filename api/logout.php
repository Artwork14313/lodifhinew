<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:5173");
// header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
session_destroy();
echo "Logged out";
