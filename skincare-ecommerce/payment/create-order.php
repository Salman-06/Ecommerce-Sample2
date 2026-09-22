<?php
/**
 * LUMÉRA SKIN - Payment Gateway Integration: Create Order
 * Prepares server-side order payload with payment secret
 */
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit;
}

$cart_items = get_cart_items($pdo);
if (empty($cart_items)) {
    echo json_encode(['success' => false, 'message' => 'Cart is empty']);
    exit;
}

$totals = calculate_cart_totals($cart_items);
$amount_in_paise = (int)($totals['grand_total'] * 100);

// Generate unique order token
$gateway_order_id = 'order_' . bin2hex(random_bytes(10));
$txn_id = 'TXN_LUM_' . rand(10000000, 99999999);

// Create signature token using PAYMENT_SECRET server-side
$generated_signature = hash_hmac('sha256', $gateway_order_id . '|' . $amount_in_paise, PAYMENT_SECRET);

$_SESSION['pending_order_id'] = $gateway_order_id;
$_SESSION['pending_txn_id'] = $txn_id;

echo json_encode([
    'success' => true,
    'gateway_order_id' => $gateway_order_id,
    'txn_id' => $txn_id,
    'amount' => $totals['grand_total'],
    'currency' => 'INR',
    'key' => PAYMENT_KEY,
    'signature' => $generated_signature
]);
?>
