<?php
// Database connection parameters
$servername = "localhost";
$username = "root";
$password = ""; // Leave the password empty for XAMPP default settings
$dbname = "contactform";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>

