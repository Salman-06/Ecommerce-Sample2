<?php
$admin_title = 'Financial Analytics & Reports — LUMÉRA Admin';
require_once __DIR__ . '/header.php';

// Calculate sales analytics
try {
    $paid_total = $pdo->query("SELECT SUM(total) FROM orders WHERE payment_status = 'Paid'")->fetchColumn() ?: 0;
    $cod_total = $pdo->query("SELECT SUM(total) FROM orders WHERE payment_method = 'COD'")->fetchColumn() ?: 0;
    $online_total = $pdo->query("SELECT SUM(total) FROM orders WHERE payment_method = 'Online'")->fetchColumn() ?: 0;
    $delivered_count = $pdo->query("SELECT COUNT(*) FROM orders WHERE order_status = 'Delivered'")->fetchColumn() ?: 0;
    $avg_order_value = $pdo->query("SELECT AVG(total) FROM orders WHERE payment_status = 'Paid'")->fetchColumn() ?: 0;
} catch (PDOException $e) {
    $paid_total = 0; $cod_total = 0; $online_total = 0; $delivered_count = 0; $avg_order_value = 0;
}
?>

<div class="space-y-8 text-xs">
    <div>
        <span class="text-xs uppercase font-bold tracking-widest text-[#9E7D58]">Financial Intelligence</span>
        <h2 class="text-2xl font-bold text-stone-900">Revenue Breakdown & Fulfillment Velocity</h2>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div class="bg-white rounded-2xl border border-stone-200 p-6 space-y-1 shadow-xs">
            <span class="text-stone-400 font-bold uppercase tracking-wider">Average Order Value</span>
            <div class="text-2xl font-bold text-stone-900"><?= format_price($avg_order_value) ?></div>
            <span class="text-stone-400">Across settled carts</span>
        </div>
        <div class="bg-white rounded-2xl border border-stone-200 p-6 space-y-1 shadow-xs">
            <span class="text-stone-400 font-bold uppercase tracking-wider">Gateway Settlements</span>
            <div class="text-2xl font-bold text-emerald-600"><?= format_price($online_total) ?></div>
            <span class="text-emerald-700">Instant digital checkout</span>
        </div>
        <div class="bg-white rounded-2xl border border-stone-200 p-6 space-y-1 shadow-xs">
            <span class="text-stone-400 font-bold uppercase tracking-wider">Doorstep COD Pending</span>
            <div class="text-2xl font-bold text-amber-600"><?= format_price($cod_total) ?></div>
            <span class="text-amber-700">Pay on physical delivery</span>
        </div>
    </div>

    <!-- Security & Payment Reconciliation Report -->
    <div class="bg-white rounded-2xl border border-stone-200 p-8 space-y-4 shadow-xs">
        <h3 class="text-base font-bold text-stone-900 border-b border-stone-100 pb-3">Payment Gateway Integrity & Verification Audit</h3>
        <p class="text-stone-600 leading-relaxed">
            All online transactions processed through the LUMÉRA store execute through server-validated HMAC SHA-256 signatures via <code class="bg-stone-100 px-2 py-0.5 rounded text-stone-800">/payment/verify-payment.php</code>.
            Client prices are never accepted from the frontend payload; subtotals and discounts are re-computed directly against authoritative database rows.
        </p>
        <div class="pt-4 flex gap-4">
            <button onclick="window.print()" class="px-5 py-2.5 bg-stone-900 hover:bg-[#9E7D58] text-white rounded-xl font-bold uppercase tracking-wider">
                <i class="fa-solid fa-print mr-2"></i> Print Audit Report
            </button>
        </div>
    </div>
</div>

</main>
</div>
</body>
</html>
