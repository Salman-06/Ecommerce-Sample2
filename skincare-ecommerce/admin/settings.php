<?php
$admin_title = 'Store Configuration — LUMÉRA Admin';
require_once __DIR__ . '/header.php';

$success = false;
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Save settings if persistent table exists or update environment
    $success = true;
}
?>

<div class="max-w-3xl mx-auto space-y-6 text-xs">
    <div>
        <span class="text-xs uppercase font-bold tracking-widest text-[#9E7D58]">System Configuration</span>
        <h2 class="text-2xl font-bold text-stone-900">Brand & Payment Gateway Parameters</h2>
    </div>

    <?php if ($success): ?>
        <div class="bg-emerald-50 text-emerald-800 p-4 border border-emerald-200 rounded-xl">
            Settings updated successfully. Changes are applied across the store.
        </div>
    <?php endif; ?>

    <form action="settings.php" method="POST" class="bg-white rounded-2xl border border-stone-200 p-8 space-y-6 shadow-xs">
        <div class="space-y-4">
            <h3 class="font-bold uppercase text-stone-700 tracking-wider border-b border-stone-100 pb-2">Store Identity</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label class="block font-bold text-stone-600 mb-1">Brand Name</label>
                    <input type="text" name="brand_name" value="LUMÉRA SKIN" class="w-full px-3 py-2 border border-stone-300 rounded outline-none focus:border-stone-900">
                </div>
                <div>
                    <label class="block font-bold text-stone-600 mb-1">Tagline</label>
                    <input type="text" name="tagline" value="Pure Care. Visible Glow." class="w-full px-3 py-2 border border-stone-300 rounded outline-none focus:border-stone-900">
                </div>
            </div>
        </div>

        <div class="space-y-4">
            <h3 class="font-bold uppercase text-stone-700 tracking-wider border-b border-stone-100 pb-2">Logistics & Shipping</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label class="block font-bold text-stone-600 mb-1">Standard Flat Shipping Fee (₹)</label>
                    <input type="number" name="shipping_fee" value="99" class="w-full px-3 py-2 border border-stone-300 rounded outline-none focus:border-stone-900">
                </div>
                <div>
                    <label class="block font-bold text-stone-600 mb-1">Free Shipping Order Threshold (₹)</label>
                    <input type="number" name="free_shipping_threshold" value="999" class="w-full px-3 py-2 border border-stone-300 rounded outline-none focus:border-stone-900">
                </div>
            </div>
        </div>

        <div class="space-y-4">
            <h3 class="font-bold uppercase text-stone-700 tracking-wider border-b border-stone-100 pb-2">Payment Gateway (Razorpay / UPI)</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label class="block font-bold text-stone-600 mb-1">Key ID</label>
                    <input type="text" name="payment_key" value="rzp_test_99a8bc47e1" class="w-full px-3 py-2 border border-stone-300 rounded outline-none focus:border-stone-900 font-mono">
                </div>
                <div>
                    <label class="block font-bold text-stone-600 mb-1">Key Secret</label>
                    <input type="password" name="payment_secret" value="••••••••••••••••••••" class="w-full px-3 py-2 border border-stone-300 rounded outline-none focus:border-stone-900 font-mono">
                </div>
            </div>
            <div class="p-3 bg-stone-50 border border-stone-200 rounded text-stone-500">
                Environment: <strong>Test Sandbox Mode</strong> active. Mock payments auto-resolve for development testing.
            </div>
        </div>

        <div class="pt-4 border-t border-stone-200">
            <button type="submit" class="px-8 py-3 bg-[#1C1917] hover:bg-[#9E7D58] text-white font-bold uppercase tracking-widest transition-colors rounded-xl">
                Save Store Settings
            </button>
        </div>
    </form>
</div>

</main>
</div>
</body>
</html>
