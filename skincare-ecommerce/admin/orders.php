<?php
$admin_title = 'Order Fulfillment — LUMÉRA Admin';
require_once __DIR__ . '/header.php';

// Filter by Status
$status_filter = $_GET['status'] ?? '';
$sql = "SELECT * FROM orders";
$params = [];

if (!empty($status_filter)) {
    $sql .= " WHERE order_status = ?";
    $params[] = $status_filter;
}
$sql .= " ORDER BY created_at DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$orders = $stmt->fetchAll();
?>

<div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <span class="text-xs uppercase font-bold tracking-widest text-[#9E7D58]">Fulfillment Queue</span>
            <h2 class="text-2xl font-bold text-stone-900">Orders Management (<?= count($orders) ?>)</h2>
        </div>

        <div class="flex gap-2">
            <a href="orders.php" class="px-3 py-1.5 rounded-lg text-xs font-bold uppercase <?= empty($status_filter) ? 'bg-stone-900 text-white' : 'bg-white text-stone-700 border border-stone-200' ?>">All</a>
            <a href="orders.php?status=Processing" class="px-3 py-1.5 rounded-lg text-xs font-bold uppercase <?= $status_filter === 'Processing' ? 'bg-stone-900 text-white' : 'bg-white text-stone-700 border border-stone-200' ?>">Processing</a>
            <a href="orders.php?status=Shipped" class="px-3 py-1.5 rounded-lg text-xs font-bold uppercase <?= $status_filter === 'Shipped' ? 'bg-stone-900 text-white' : 'bg-white text-stone-700 border border-stone-200' ?>">Shipped</a>
            <a href="orders.php?status=Delivered" class="px-3 py-1.5 rounded-lg text-xs font-bold uppercase <?= $status_filter === 'Delivered' ? 'bg-stone-900 text-white' : 'bg-white text-stone-700 border border-stone-200' ?>">Delivered</a>
        </div>
    </div>

    <div class="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
                <thead class="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-bold tracking-wider">
                    <tr>
                        <th class="p-4">Order Ref</th>
                        <th class="p-4">Customer</th>
                        <th class="p-4">Date</th>
                        <th class="p-4">Payment</th>
                        <th class="p-4">Total Amount</th>
                        <th class="p-4">Fulfillment Status</th>
                        <th class="p-4 text-right">Details</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-stone-100">
                    <?php if (empty($orders)): ?>
                        <tr><td colspan="7" class="p-8 text-center text-stone-400">No orders found matching criteria.</td></tr>
                    <?php else: ?>
                        <?php foreach ($orders as $ord): ?>
                            <tr class="hover:bg-stone-50/50">
                                <td class="p-4 font-mono font-bold text-stone-900"><?= escape($ord['order_number']) ?></td>
                                <td class="p-4">
                                    <span class="font-bold text-stone-900 block"><?= escape($ord['customer_name']) ?></span>
                                    <span class="text-[11px] text-stone-400"><?= escape($ord['customer_email']) ?></span>
                                </td>
                                <td class="p-4 text-stone-500"><?= date('M d, Y', strtotime($ord['created_at'])) ?></td>
                                <td class="p-4">
                                    <span class="px-2 py-0.5 rounded text-[10px] font-bold <?= $ord['payment_status'] === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700' ?>">
                                        <?= escape($ord['payment_method']) ?> • <?= escape($ord['payment_status']) ?>
                                    </span>
                                </td>
                                <td class="p-4 font-bold text-stone-900"><?= format_price($ord['total']) ?></td>
                                <td class="p-4">
                                    <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-stone-100 text-stone-700">
                                        <?= escape($ord['order_status']) ?>
                                    </span>
                                </td>
                                <td class="p-4 text-right">
                                    <a href="order-details.php?id=<?= $ord['id'] ?>" class="px-3 py-1.5 bg-[#1C1917] hover:bg-[#9E7D58] text-white rounded-lg text-xs font-semibold">
                                        Inspect Order
                                    </a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

</main>
</div>
</body>
</html>
