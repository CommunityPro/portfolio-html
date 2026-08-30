<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = $_POST["name"];
    $email = $_POST["email"];
    $subject = $_POST["subject"];
    $message = $_POST["message"];

    // Recipient email address
    $to = "support@codebyadnan.com";

    // Email subject
    $email_subject = "New contact form submission: $subject";

    // Email headers
    $headers = "From: $name <$email>" . "\r\n";
    $headers .= "Reply-To: $email" . "\r\n";

    // Send email
    if (mail($to, $email_subject, $message, $headers)) {
        // Return a success message without "Error:" and with a green background
        echo '<div style="background-color: green; color: white;">Success: Your message has been sent. Thank you!</div>';
    } else {
        // Return an error message without any specific background color
        echo '<div style="background-color: red; color: white;">Unable to send email.</div>';
    }
} else {
    // If not a POST request, return an error message
    echo "error";
}
?>
