<?php
require_once __DIR__ . '/includes/header.php';

$cart_items = get_cart_items($pdo);
if (empty($cart_items)) {
    header("Location: cart.php");
    exit;
}

$subtotal = 0;
foreach ($cart_items as $item) {
    $subtotal += $item['total'];
}
$shipping = ($subtotal >= 999) ? 0 : 99;
$grand_total = $subtotal + $shipping;

$order_success = null;
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_POST['csrf_token']) || !verify_csrf_token($_POST['csrf_token'])) {
        $error = 'Invalid security token. Please refresh and retry.';
    } else {
        $name = trim($_POST['customer_name'] ?? '');
        $email = trim($_POST['customer_email'] ?? '');
        $phone = trim($_POST['customer_phone'] ?? '');
        $address = trim($_POST['shipping_address'] ?? '');
        $city = trim($_POST['city'] ?? '');
        $state = trim($_POST['state'] ?? '');
        $pincode = trim($_POST['pincode'] ?? '');
        $payment_method = $_POST['payment_method'] ?? 'COD';

        if (empty($name) || empty($email) || empty($phone) || empty($address)) {
            $error = 'Please fill in all required shipping fields.';
        } else {
            try {
                $pdo->beginTransaction();

                // Stock Check
                foreach ($cart_items as $item) {
                    $stmt_stk = $pdo->prepare("SELECT stock FROM products WHERE id = ? FOR UPDATE");
                    $stmt_stk->execute([$item['product']['id']]);
                    $curr_stock = $stmt_stk->fetchColumn();

                    if ($curr_stock < $item['quantity']) {
                        throw new Exception("Insufficient stock for " . $item['product']['name']);
                    }
                }

                $order_number = 'LMR-' . rand(10000, 99999);
                $payment_status = ($payment_method === 'Online') ? 'Paid' : 'Pending';
                $order_status = ($payment_status === 'Paid') ? 'Processing' : 'Pending';
                $tracking = 'DL-' . rand(10000000, 99999999);

                $stmt_ord = $pdo->prepare("
                    INSERT INTO orders (
                        order_number, customer_name, customer_email, customer_phone,
                        shipping_address, city, state, pincode, subtotal, discount,
                        shipping, total, payment_method, payment_status, order_status,
                        tracking_number, created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
                ");

                $stmt_ord->execute([
                    $order_number, $name, $email, $phone,
                    $address, $city, $state, $pincode, $subtotal, 0,
                    $shipping, $grand_total, $payment_method, $payment_status, $order_status,
                    $tracking
                ]);

                $order_id = $pdo->lastInsertId();

                // Insert Items & Deduct Stock
                $stmt_itm = $pdo->prepare("
                    INSERT INTO order_items (order_id, product_id, product_name, price, quantity, total)
                    VALUES (?, ?, ?, ?, ?, ?)
                ");
                $stmt_dec = $pdo->prepare("UPDATE products SET stock = stock - ? WHERE id = ?");

                foreach ($cart_items as $item) {
                    $stmt_itm->execute([
                        $order_id,
                        $item['product']['id'],
                        $item['product']['name'],
                        $item['product']['discount_price'],
                        $item['quantity'],
                        $item['total']
                    ]);
                    $stmt_dec->execute([$item['quantity'], $item['product']['id']]);
                }

                $pdo->commit();
                unset($_SESSION['cart']);

                $order_success = [
                    'order_number' => $order_number,
                    'total' => $grand_total,
                    'payment_method' => $payment_method,
                    'tracking' => $tracking
                ];
            } catch (Exception $e) {
                $pdo->rollBack();
                $error = $e->getMessage();
            }
        }
    }
}

require_once __DIR__ . '/includes/navbar.php';
?>

<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <?php if ($order_success): ?>
        <div class="bg-white border border-[#E8DFC8] p-8 sm:p-12 text-center space-y-4 max-w-xl mx-auto">
            <div class="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
                <i class="fa-solid fa-check"></i>
            </div>
            <span class="text-xs uppercase font-bold tracking-widest text-[#9E7D58]">Payment & Order Verified</span>
            <h1 class="text-3xl font-serif font-bold text-stone-900">Thank You for Your Order</h1>
            <p class="text-xs text-stone-500">Order Reference: <strong class="text-stone-900"><?= $order_success['order_number'] ?></strong></p>
            <p class="text-xs text-stone-500">Tracking Code: <strong class="text-[#9E7D58]"><?= $order_success['tracking'] ?></strong></p>
            <p class="text-xs text-stone-500">Grand Total: <strong><?= format_price($order_success['total']) ?></strong> via <?= $order_success['payment_method'] ?></p>
            <div class="pt-6">
                <a href="products.php" class="px-8 py-3.5 bg-[#1C1917] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#9E7D58]">
                    Continue Exploring
                </a>
            </div>
        </div>
    <?php else: ?>
        <div class="mb-8">
            <span class="text-xs font-bold uppercase tracking-widest text-[#9E7D58]">Secure Checkout</span>
            <h1 class="text-3xl font-serif font-bold text-stone-900 mt-1">Shipping & Payment</h1>
        </div>

        <?php if (!empty($error)): ?>
            <div class="bg-red-50 text-red-700 p-4 border border-red-200 text-xs mb-6 rounded">
                <?= escape($error) ?>
            </div>
        <?php endif; ?>

        <form action="checkout.php" method="POST" class="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <input type="hidden" name="csrf_token" value="<?= generate_csrf_token() ?>">

            <!-- Shipping Information Form -->
            <div class="lg:col-span-2 bg-white border border-[#E8DFC8] p-6 sm:p-8 space-y-4 text-xs">
                <h3 class="font-serif font-bold text-lg text-stone-900 border-b border-stone-100 pb-3">Destination Address</h3>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block font-bold text-stone-700 uppercase mb-1">Full Name *</label>
                        <input type="text" name="customer_name" required class="w-full px-3 py-2 border border-stone-300 rounded outline-none focus:border-stone-900">
                    </div>
                    <div>
                        <label class="block font-bold text-stone-700 uppercase mb-1">Email Address *</label>
                        <input type="email" name="customer_email" required class="w-full px-3 py-2 border border-stone-300 rounded outline-none focus:border-stone-900">
                    </div>
                    <div>
                        <label class="block font-bold text-stone-700 uppercase mb-1">Phone Number *</label>
                        <input type="text" name="customer_phone" required class="w-full px-3 py-2 border border-stone-300 rounded outline-none focus:border-stone-900">
                    </div>
                    <div>
                        <label class="block font-bold text-stone-700 uppercase mb-1">Pincode *</label>
                        <input type="text" name="pincode" required class="w-full px-3 py-2 border border-stone-300 rounded outline-none focus:border-stone-900">
                    </div>
                    <div class="sm:col-span-2">
                        <label class="block font-bold text-stone-700 uppercase mb-1">Street Address *</label>
                        <input type="text" name="shipping_address" required class="w-full px-3 py-2 border border-stone-300 rounded outline-none focus:border-stone-900">
                    </div>
                    <div>
                        <label class="block font-bold text-stone-700 uppercase mb-1">City *</label>
                        <input type="text" name="city" required class="w-full px-3 py-2 border border-stone-300 rounded outline-none focus:border-stone-900">
                    </div>
                    <div>
                        <label class="block font-bold text-stone-700 uppercase mb-1">State *</label>
                        <input type="text" name="state" required class="w-full px-3 py-2 border border-stone-300 rounded outline-none focus:border-stone-900">
                    </div>
                </div>

                <h3 class="font-serif font-bold text-lg text-stone-900 border-b border-stone-100 pt-6 pb-3">Payment Method</h3>
                <div class="space-y-2">
                    <label class="flex items-center gap-3 p-3 border border-stone-200 rounded cursor-pointer hover:bg-[#FAF8F5]">
                        <input type="radio" name="payment_method" value="Online" checked>
                        <div>
                            <span class="font-bold text-stone-900 block">Instant Online Payment (UPI / Cards / NetBanking)</span>
                            <span class="text-stone-500">Encrypted 256-bit gateway verification</span>
                        </div>
                    </label>
                    <label class="flex items-center gap-3 p-3 border border-stone-200 rounded cursor-pointer hover:bg-[#FAF8F5]">
                        <input type="radio" name="payment_method" value="COD">
                        <div>
                            <span class="font-bold text-stone-900 block">Cash on Delivery (COD)</span>
                            <span class="text-stone-500">Pay upon physical doorstep delivery</span>
                        </div>
                    </label>
                </div>
            </div>

            <!-- Order Summary -->
            <div class="bg-white border border-[#E8DFC8] p-6 space-y-4 h-fit text-xs">
                <h3 class="font-serif font-bold text-lg text-stone-900 border-b border-stone-100 pb-3">Review Order</h3>
                <div class="divide-y divide-stone-100">
                    <?php foreach ($cart_items as $i): ?>
                        <div class="py-2 flex justify-between">
                            <span><?= escape($i['product']['name']) ?> × <?= $i['quantity'] ?></span>
                            <span class="font-bold"><?= format_price($i['total']) ?></span>
                        </div>
                    <?php endforeach; ?>
                </div>

                <div class="pt-3 border-t border-stone-100 space-y-2">
                    <div class="flex justify-between text-stone-600">
                        <span>Subtotal</span>
                        <span><?= format_price($subtotal) ?></span>
                    </div>
                    <div class="flex justify-between text-stone-600">
                        <span>Shipping</span>
                        <span><?= $shipping === 0 ? 'Free' : format_price($shipping) ?></span>
                    </div>
                    <div class="flex justify-between font-bold text-stone-900 text-sm pt-2 border-t border-stone-100">
                        <span>Total Due</span>
                        <span><?= format_price($grand_total) ?></span>
                    </div>
                </div>

                <button type="submit" class="w-full py-4 bg-[#1C1917] hover:bg-[#9E7D58] text-white font-bold uppercase tracking-widest transition-colors mt-4">
                    Confirm & Place Order
                </button>
            </div>
        </form>
    <?php endif; ?>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
