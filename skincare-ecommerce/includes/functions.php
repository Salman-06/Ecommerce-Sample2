<?php
/**
 * LUMÉRA SKIN - Helper Functions & Security Library
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Generate CSRF Token
function generate_csrf_token() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

// Verify CSRF Token
function verify_csrf_token($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

// XSS Protection Escaping
function escape($data) {
    return htmlspecialchars($data ?? '', ENT_QUOTES, 'UTF-8');
}

// Currency Formatter
function format_price($amount) {
    return '₹' . number_format((float)$amount, 2);
}

// Check Admin Authentication
function check_admin_auth() {
    if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
        header("Location: " . ADMIN_URL . "/login.php");
        exit;
    }
}

// Check Customer Authentication
function is_customer_logged_in() {
    return isset($_SESSION['customer_id']) && !empty($_SESSION['customer_id']);
}

// Get Cart Items with Product Details
function get_cart_items($pdo) {
    $cart_items = [];
    if (!empty($_SESSION['cart'])) {
        $ids = array_keys($_SESSION['cart']);
        if (!empty($ids)) {
            $in = str_repeat('?,', count($ids) - 1) . '?';
            $stmt = $pdo->prepare("SELECT * FROM products WHERE id IN ($in) AND status = 1");
            $stmt->execute($ids);
            $products = $stmt->fetchAll();
            
            foreach ($products as $product) {
                $qty = (int)$_SESSION['cart'][$product['id']];
                $cart_items[] = [
                    'product' => $product,
                    'quantity' => $qty,
                    'total' => $product['discount_price'] * $qty
                ];
            }
        }
    }
    return $cart_items;
}

// Calculate Cart Totals
function calculate_cart_totals($cart_items) {
    $subtotal = 0;
    foreach ($cart_items as $item) {
        $subtotal += $item['total'];
    }
    $discount = 0;
    if (isset($_SESSION['applied_coupon']) && $_SESSION['applied_coupon'] === 'LUMERA10') {
        $discount = $subtotal * 0.10;
    }
    $shipping = ($subtotal >= 999 || $subtotal == 0) ? 0 : 99;
    $grand_total = max(0, $subtotal - $discount + $shipping);

    return [
        'subtotal' => $subtotal,
        'discount' => $discount,
        'shipping' => $shipping,
        'grand_total' => $grand_total
    ];
}

// Decrement stock upon successful order
function deduct_product_stock($pdo, $product_id, $quantity) {
    $stmt = $pdo->prepare("UPDATE products SET stock = GREATEST(0, stock - ?) WHERE id = ?");
    return $stmt->execute([(int)$quantity, (int)$product_id]);
}
?>
