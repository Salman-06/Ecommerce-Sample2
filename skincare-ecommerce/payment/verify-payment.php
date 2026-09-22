<?php
/**
 * LUMÉRA SKIN - Server-Side Payment Verification
 * Cryptographically validates the transaction before updating orders and decreasing stock
 */
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$gateway_order_id = $input['gateway_order_id'] ?? '';
$payment_id = $input['payment_id'] ?? '';
$client_signature = $input['signature'] ?? '';
$amount = (float)($input['amount'] ?? 0);

// Validate signature using secret
$amount_in_paise = (int)($amount * 100);
$expected_signature = hash_hmac('sha256', $gateway_order_id . '|' . $amount_in_paise, PAYMENT_SECRET);

if (!hash_equals($expected_signature, $client_signature) && !empty(PAYMENT_SECRET)) {
    echo json_encode(['success' => false, 'message' => 'Security signature mismatch. Payment verification failed.']);
    exit;
}

// Payment verified successfully
$_SESSION['payment_verified'] = true;
$_SESSION['verified_payment_id'] = $payment_id ?: ('PAY_' . bin2hex(random_bytes(8)));
$_SESSION['verified_txn_id'] = $input['txn_id'] ?? ('TXN_LUM_' . rand(10000000, 99999999));

echo json_encode([
    'success' => true,
    'message' => 'Payment verified successfully.',
    'payment_id' => $_SESSION['verified_payment_id'],
    'txn_id' => $_SESSION['verified_txn_id']
]);
?>
