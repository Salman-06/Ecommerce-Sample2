<?php
/**
 * LUMÉRA SKIN - Database Connection Configuration
 * Compatible with XAMPP, LAMP, cPanel, and Hostinger MySQL
 */

// Database credentials - update as needed for production / hosting
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_NAME', getenv('DB_NAME') ?: 'lumera_skincare');
define('DB_PORT', getenv('DB_PORT') ?: 3306);

// Payment Gateway Configuration
define('PAYMENT_KEY', getenv('PAYMENT_KEY') ?: 'rzp_test_lumera_98124Key');
define('PAYMENT_SECRET', getenv('PAYMENT_SECRET') ?: 'sec_lumera_secret_77298Hash');

// Base Site URL
define('SITE_URL', 'http://localhost/skincare-ecommerce');
define('ADMIN_URL', SITE_URL . '/admin');

try {
    $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
} catch (PDOException $e) {
    // In production, log error instead of exposing raw database messages
    error_log("Database Connection Error: " . $e->getMessage());
    die("Database Connection Error: Please ensure MySQL is running and the database 'lumera_skincare' is imported.");
}
?>
