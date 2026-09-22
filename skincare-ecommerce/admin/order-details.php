<?php
$admin_title = 'Order Inspection — LUMÉRA Admin';
require_once __DIR__ . '/header.php';

$id = (int)($_GET['id'] ?? 0);
$stmt = $pdo->prepare("SELECT * FROM orders WHERE id = ?");
$stmt->execute([$id]);
$order = $stmt->fetch();

if (!$order) {
    echo "<p>Order not found.</p>";
    exit;
}

// Handle Order Status Update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_status'])) {
    $new_status = $_POST['order_status'] ?? $order['order_status'];
    $new_payment = $_POST['payment_status'] ?? $order['payment_status'];
    $new_tracking = trim($_POST['tracking_number'] ?? $order['tracking_number']);

    $stmt_up = $pdo->prepare("UPDATE orders SET order_status = ?, payment_status = ?, tracking_number = ? WHERE id = ?");
    $stmt_up->execute([$new_status, $new_payment, $new_tracking, $id]);

    header("Location: order-details.php?id=" . $id);
    exit;
}

// Fetch Order Items
$stmt_items = $pdo->prepare("SELECT * FROM order_items WHERE order_id = ?");
$stmt_items->execute([$id]);
$items = $stmt_items->fetchAll();
?>

<div class="max-w-4xl mx-auto space-y-6 text-xs">
    <div class="flex items-center justify-between">
        <div>
            <span class="text-xs uppercase font-bold tracking-widest text-[#9E7D58]">Manifest</span>
            <h2 class="text-2xl font-bold text-stone-900">Order #<?= escape($order['order_number']) ?></h2>
            <span class="text-stone-400">Placed on <?= date('F d, Y - h:i A', strtotime($order['created_at'])) ?></span>
        </div>
        <a href="orders.php" class="text-xs font-bold text-stone-600 hover:text-stone-900">← Back to Orders</a>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Items Table -->
        <div class="md:col-span-2 bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-xs">
            <h3 class="font-bold uppercase text-stone-700 tracking-wider border-b border-stone-100 pb-2">Line Items</h3>
            <div class="divide-y divide-stone-100">
                <?php foreach ($items as $item): ?>
                    <div class="py-3 flex justify-between items-center">
                        <div>
                            <span class="font-bold text-stone-900 block"><?= escape($item['product_name']) ?></span>
                            <span class="text-stone-400"><?= format_price($item['price']) ?> × <?= $item['quantity'] ?> units</span>
                        </div>
                        <span class="font-bold text-stone-900"><?= format_price($item['total']) ?></span>
                    </div>
                <?php endforeach; ?>
            </div>

            <div class="pt-4 border-t border-stone-100 space-y-2 text-stone-600">
                <div class="flex justify-between">
                    <span>Subtotal</span>
                    <span><?= format_price($order['subtotal']) ?></span>
                </div>
                <div class="flex justify-between">
                    <span>Shipping</span>
                    <span><?= $order['shipping'] == 0 ? 'Complimentary' : format_price($order['shipping']) ?></span>
                </div>
                <div class="flex justify-between font-bold text-sm text-stone-900 pt-2 border-t border-stone-100">
                    <span>Grand Total</span>
                    <span><?= format_price($order['total']) ?></span>
                </div>
            </div>
        </div>

        <!-- Customer & Delivery Metadata -->
        <div class="space-y-6">
            <div class="bg-white rounded-2xl border border-stone-200 p-6 space-y-3 shadow-xs">
                <h3 class="font-bold uppercase text-stone-700 tracking-wider border-b border-stone-100 pb-2">Client Profile</h3>
                <p><strong>Name:</strong> <?= escape($order['customer_name']) ?></p>
                <p><strong>Email:</strong> <?= escape($order['customer_email']) ?></p>
                <p><strong>Phone:</strong> <?= escape($order['customer_phone']) ?></p>
                <div class="pt-2 border-t border-stone-100">
                    <strong>Shipping Address:</strong>
                    <p class="text-stone-500 mt-1">
                        <?= escape($order['shipping_address']) ?><br>
                        <?= escape($order['city']) ?>, <?= escape($order['state']) ?> - <?= escape($order['pincode']) ?>
                    </p>
                </div>
            </div>

            <!-- Status Editor Form -->
            <form action="order-details.php?id=<?= $id ?>" method="POST" class="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-xs">
                <input type="hidden" name="update_status" value="1">
                <h3 class="font-bold uppercase text-stone-700 tracking-wider border-b border-stone-100 pb-2">Status Control</h3>

                <div>
                    <label class="block font-bold text-stone-600 mb-1">Fulfillment Status</label>
                    <select name="order_status" class="w-full px-3 py-2 border border-stone-300 rounded bg-white">
                        <?php foreach (['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as $st): ?>
                            <option value="<?= $st ?>" <?= $order['order_status'] === $st ? 'selected' : '' ?>><?= $st ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div>
                    <label class="block font-bold text-stone-600 mb-1">Payment Status</label>
                    <select name="payment_status" class="w-full px-3 py-2 border border-stone-300 rounded bg-white">
                        <option value="Paid" <?= $order['payment_status'] === 'Paid' ? 'selected' : '' ?>>Paid (Settled)</option>
                        <option value="Pending" <?= $order['payment_status'] === 'Pending' ? 'selected' : '' ?>>Pending (COD or Unverified)</option>
                        <option value="Failed" <?= $order['payment_status'] === 'Failed' ? 'selected' : '' ?>>Failed</option>
                    </select>
                </div>

                <div>
                    <label class="block font-bold text-stone-600 mb-1">Tracking Number</label>
                    <input type="text" name="tracking_number" value="<?= escape($order['tracking_number'] ?? '') ?>" class="w-full px-3 py-2 border border-stone-300 rounded">
                </div>

                <button type="submit" class="w-full py-2.5 bg-[#1C1917] hover:bg-[#9E7D58] text-white font-bold uppercase tracking-wider rounded-lg transition-colors">
                    Save Changes
                </button>
            </form>
        </div>
    </div>
</div>

</main>
</div>
</body>
</html>
