<?php
session_start();

// Database connection
$servername = "localhost";
$username = "root";  // Default MySQL username for XAMPP
$password = "";      // Default MySQL password for XAMPP
$dbname = "user_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$error_message = ''; // Initialize error message as empty

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitize input
    $email = isset($_POST['email']) ? trim($_POST['email']) : null;
    $password = isset($_POST['password']) ? trim($_POST['password']) : null;

    if (!empty($email) && !empty($password)) {
        // Query to find the user
        $sql = "SELECT * FROM users WHERE email = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            // User exists
            $user = $result->fetch_assoc();

            // Check if password matches
            if (password_verify($password, $user['password'])) {
                // Valid login, store user session
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_name'] = $user['name'];
                $_SESSION['user_email'] = $user['email']; // Store email in session
                header("Location: dashboard.php"); // Redirect to a dashboard page
                exit(); // Stop script execution after the redirect
            } else {
                $error_message = "Invalid password."; // Show error if password is incorrect
            }
        } else {
            $error_message = "No user found with this email."; // Show error if user doesn't exist
        }

        $stmt->close();
    } else {
        $error_message = "Email and password are required.";
    }
}

$conn->close();
?>

<html>
<head>
    <script>
        // Function to display a message as a popup
        function showMessage(message) {
            if (message) {
                alert(message); // Display the message as an alert
            }
        }
    </script>
</head>
<body>
    <!-- Call JavaScript to show the error message -->
    <script>
        const errorMessage = <?php echo json_encode($error_message); ?>; // Pass PHP message to JavaScript
        showMessage(errorMessage); // Show the error message in a popup
    </script>
</body>
</html>
