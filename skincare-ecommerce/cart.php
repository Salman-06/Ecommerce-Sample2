<?php
require_once __DIR__ . '/includes/header.php';

// Handle Cart Actions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    $product_id = (int)($_POST['product_id'] ?? 0);
    $quantity = (int)($_POST['quantity'] ?? 1);

    if (isset($_POST['csrf_token']) && verify_csrf_token($_POST['csrf_token'])) {
        if ($action === 'add' && $product_id > 0) {
            $_SESSION['cart'][$product_id] = ($_SESSION['cart'][$product_id] ?? 0) + $quantity;
        } elseif ($action === 'update' && $product_id > 0) {
            if ($quantity <= 0) {
                unset($_SESSION['cart'][$product_id]);
            } else {
                $_SESSION['cart'][$product_id] = $quantity;
            }
        } elseif ($action === 'remove' && $product_id > 0) {
            unset($_SESSION['cart'][$product_id]);
        } elseif ($action === 'clear') {
            unset($_SESSION['cart']);
        }
    }
    header("Location: cart.php");
    exit;
}

require_once __DIR__ . '/includes/navbar.php';

$cart_items = get_cart_items($pdo);
$subtotal = 0;
foreach ($cart_items as $item) {
    $subtotal += $item['total'];
}

$shipping = ($subtotal >= 999 || $subtotal === 0) ? 0 : 99;
$grand_total = $subtotal + $shipping;
?>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="mb-8">
        <span class="text-xs font-bold uppercase tracking-widest text-[#9E7D58]">Your Selection</span>
        <h1 class="text-3xl font-serif font-bold text-stone-900 mt-1">Shopping Bag</h1>
    </div>

    <?php if (empty($cart_items)): ?>
        <div class="bg-white border border-[#E8DFC8] p-12 text-center max-w-lg mx-auto space-y-4">
            <i class="fa-solid fa-bag-shopping text-3xl text-stone-300"></i>
            <h3 class="font-serif font-bold text-xl text-stone-800">Your bag is empty</h3>
            <p class="text-xs text-stone-500">Discover our bio-compatible skincare rituals to begin your routine.</p>
            <a href="products.php" class="inline-block px-6 py-3 bg-[#1C1917] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#9E7D58]">
                Explore Formulations
            </a>
        </div>
    <?php else: ?>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <!-- Items Table -->
            <div class="lg:col-span-2 space-y-4">
                <div class="bg-white border border-[#E8DFC8] divide-y divide-stone-100">
                    <?php foreach ($cart_items as $item): ?>
                        <div class="p-4 sm:p-6 flex items-center justify-between gap-4">
                            <div class="flex items-center gap-4">
                                <img src="<?= escape($item['product']['image']) ?>" alt="<?= escape($item['product']['name']) ?>" class="w-16 h-16 object-cover border border-stone-100">
                                <div>
                                    <h4 class="font-serif font-bold text-sm text-stone-900"><?= escape($item['product']['name']) ?></h4>
                                    <span class="text-xs text-stone-400"><?= format_price($item['product']['discount_price']) ?> each</span>
                                </div>
                            </div>

                            <div class="flex items-center gap-6">
                                <form action="cart.php" method="POST" class="flex items-center gap-2">
                                    <input type="hidden" name="action" value="update">
                                    <input type="hidden" name="product_id" value="<?= $item['product']['id'] ?>">
                                    <input type="hidden" name="csrf_token" value="<?= generate_csrf_token() ?>">
                                    <input type="number" name="quantity" value="<?= $item['quantity'] ?>" min="1" max="<?= $item['product']['stock'] ?>" onchange="this.form.submit()" class="w-14 px-2 py-1 border border-stone-300 rounded text-center text-xs">
                                </form>

                                <span class="font-bold text-sm text-stone-900 w-20 text-right"><?= format_price($item['total']) ?></span>

                                <form action="cart.php" method="POST">
                                    <input type="hidden" name="action" value="remove">
                                    <input type="hidden" name="product_id" value="<?= $item['product']['id'] ?>">
                                    <input type="hidden" name="csrf_token" value="<?= generate_csrf_token() ?>">
                                    <button type="submit" class="text-stone-400 hover:text-red-500 text-xs">
                                        <i class="fa-regular fa-trash-can"></i>
                                    </button>
                                </form>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- Order Summary -->
            <div class="bg-white border border-[#E8DFC8] p-6 space-y-5 h-fit text-xs">
                <h3 class="font-serif font-bold text-lg text-stone-900 border-b border-stone-100 pb-3">Order Summary</h3>

                <div class="space-y-3">
                    <div class="flex justify-between text-stone-600">
                        <span>Bag Subtotal</span>
                        <span class="font-bold text-stone-900"><?= format_price($subtotal) ?></span>
                    </div>
                    <div class="flex justify-between text-stone-600">
                        <span>Standard Shipping</span>
                        <span class="font-bold text-stone-900"><?= $shipping === 0 ? 'Complimentary' : format_price($shipping) ?></span>
                    </div>
                    <?php if ($shipping > 0): ?>
                        <p class="text-[11px] text-amber-700 bg-amber-50 p-2 rounded">
                            Add <?= format_price(999 - $subtotal) ?> more for Complimentary Shipping.
                        </p>
                    <?php endif; ?>
                    <div class="flex justify-between text-base font-bold text-stone-900 pt-3 border-t border-stone-100">
                        <span>Grand Total</span>
                        <span><?= format_price($grand_total) ?></span>
                    </div>
                </div>

                <a href="checkout.php" class="block text-center w-full py-4 bg-[#1C1917] hover:bg-[#9E7D58] text-white font-bold uppercase tracking-widest transition-colors">
                    Proceed to Checkout
                </a>
            </div>
        </div>
    <?php endif; ?>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
