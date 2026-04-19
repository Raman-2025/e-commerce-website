<?php
// Include the database connection file
include 'db_connection.php';

// Check if form data is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data and sanitize it
    $name = $conn->real_escape_string($_POST['name']);
    $phone = $conn->real_escape_string($_POST['phone']);
    $email = $conn->real_escape_string($_POST['email']);
    $message = $conn->real_escape_string($_POST['message']);

    // SQL query to insert data into contact table
    $sql = "INSERT INTO contact (name, phone, email, message) VALUES ('$name', '$phone', '$email', '$message')";
     
    // // Execute the query
    // if ($conn->query($sql) === TRUE) {
    //     echo "<script>alert('Message sent successfully!');</script>";
    // } else {
    //     echo "<script>alert('Error: " . $conn->error . "');</script>";
    // }

    
    // Execute the query
    if ($conn->query($sql) === TRUE) {
        echo "<script>
                alert('Message sent successfully!');
                window.location.href = window.location.href; // Reload the current page
              </script>";
    } else {
        echo "<script>
                alert('Error: " . $conn->error . "');
                window.location.href = window.location.href; // Reload the current page
              </script>";
    }
    
    
}

// Close the connection
$conn->close();

?>


<!-- // Include the database connection file
include 'db_connection.php';

$messageSent = false; // Variable to track if the message was sent successfully

// Check if form data is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data and sanitize it
    $name = $conn->real_escape_string($_POST['name']);
    $phone = $conn->real_escape_string($_POST['phone']);
    $email = $conn->real_escape_string($_POST['email']);
    $message = $conn->real_escape_string($_POST['message']);

    // SQL query to insert data into contact table
    $sql = "INSERT INTO contact (name, phone, email, message) VALUES ('$name', '$phone', '$email', '$message')";

    // Execute the query
    if ($conn->query($sql) === TRUE) {
        $messageSent = true; // Set success flag
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

// Close the connection
$conn->close(); -->


