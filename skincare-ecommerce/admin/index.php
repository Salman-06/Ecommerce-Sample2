<?php
$admin_title = 'Dashboard Overview — LUMÉRA Admin';
require_once __DIR__ . '/header.php';

// Fetch Telemetry & Performance Metrics
try {
    $total_revenue = $pdo->query("SELECT SUM(total) FROM orders WHERE payment_status = 'Paid'")->fetchColumn() ?: 0;
    $total_orders = $pdo->query("SELECT COUNT(*) FROM orders")->fetchColumn() ?: 0;
    $total_products = $pdo->query("SELECT COUNT(*) FROM products")->fetchColumn() ?: 0;
    $low_stock_products = $pdo->query("SELECT * FROM products WHERE stock <= 15")->fetchAll();
    $recent_orders = $pdo->query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 5")->fetchAll();
} catch (PDOException $e) {
    $total_revenue = 0;
    $total_orders = 0;
    $total_products = 0;
    $low_stock_products = [];
    $recent_orders = [];
}
?>

<div class="space-y-8">
    <div>
        <span class="text-xs uppercase font-bold tracking-widest text-[#9E7D58]">System Overview</span>
        <h2 class="text-2xl font-bold text-stone-900">Telemetry & Laboratory Performance</h2>
    </div>

    <!-- 4 Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-xs">
        <div class="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
            <span class="font-bold text-stone-400 uppercase tracking-wider block mb-1">Total Net Revenue</span>
            <div class="text-2xl font-bold text-stone-900"><?= format_price($total_revenue) ?></div>
            <span class="text-emerald-600 font-semibold mt-1 block">Live paid volume</span>
        </div>

        <div class="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
            <span class="font-bold text-stone-400 uppercase tracking-wider block mb-1">Total Placed Orders</span>
            <div class="text-2xl font-bold text-stone-900"><?= $total_orders ?></div>
            <span class="text-stone-400 mt-1 block">Fulfilled & pending</span>
        </div>

        <div class="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
            <span class="font-bold text-stone-400 uppercase tracking-wider block mb-1">Active Catalog SKUs</span>
            <div class="text-2xl font-bold text-stone-900"><?= $total_products ?></div>
            <span class="text-stone-400 mt-1 block">Formulations catalog</span>
        </div>

        <div class="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
            <span class="font-bold text-stone-400 uppercase tracking-wider block mb-1">Low Inventory Alert</span>
            <div class="text-2xl font-bold text-red-600"><?= count($low_stock_products) ?></div>
            <span class="text-red-500 mt-1 block">Stock units ≤ 15</span>
        </div>
    </div>

    <!-- Low Stock Alert Banner -->
    <?php if (!empty($low_stock_products)): ?>
        <div class="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-xs text-amber-900 flex items-center justify-between">
            <div>
                <strong>Inventory Warning:</strong> The following items require compounding replenishment:
                <ul class="list-disc pl-5 mt-1 text-amber-800">
                    <?php foreach ($low_stock_products as $lp): ?>
                        <li><?= escape($lp['name']) ?> (Only <?= $lp['stock'] ?> units remaining)</li>
                    <?php endforeach; ?>
                </ul>
            </div>
            <a href="products.php" class="px-3 py-2 bg-amber-800 text-white rounded-lg uppercase font-bold text-[10px]">Restock</a>
        </div>
    <?php endif; ?>

    <!-- Recent Orders Table -->
    <div class="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-stone-100 pb-4">
            <h3 class="text-base font-bold text-stone-900">Recent Customer Transactions</h3>
            <a href="orders.php" class="text-xs font-bold text-[#9E7D58] hover:underline uppercase">All Orders →</a>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
                <thead>
                    <tr class="border-b border-stone-200 text-stone-400 uppercase font-bold tracking-wider">
                        <th class="pb-3">Order #</th>
                        <th class="pb-3">Customer</th>
                        <th class="pb-3">Payment</th>
                        <th class="pb-3">Total</th>
                        <th class="pb-3">Status</th>
                        <th class="pb-3 text-right">Action</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-stone-100">
                    <?php foreach ($recent_orders as $ord): ?>
                        <tr>
                            <td class="py-3 font-mono font-bold text-stone-900"><?= escape($ord['order_number']) ?></td>
                            <td class="py-3"><?= escape($ord['customer_name']) ?></td>
                            <td class="py-3">
                                <span class="px-2 py-0.5 rounded text-[10px] font-bold <?= $ord['payment_status'] === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700' ?>">
                                    <?= escape($ord['payment_method']) ?> (<?= escape($ord['payment_status']) ?>)
                                </span>
                            </td>
                            <td class="py-3 font-bold"><?= format_price($ord['total']) ?></td>
                            <td class="py-3">
                                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100"><?= escape($ord['order_status']) ?></span>
                            </td>
                            <td class="py-3 text-right">
                                <a href="order-details.php?id=<?= $ord['id'] ?>" class="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded text-[11px] font-semibold">Inspect</a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

</main>
</div>
</body>
</html>
