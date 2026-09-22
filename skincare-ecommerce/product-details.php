<?php
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';

$id = (int)($_GET['id'] ?? 0);

try {
    $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ? AND status = 1 LIMIT 1");
    $stmt->execute([$id]);
    $product = $stmt->fetch();
} catch (PDOException $e) {
    $product = false;
}

if (!$product) {
    echo "<div class='text-center py-20'><h2 class='text-2xl font-serif font-bold'>Formulation Not Found</h2><a href='products.php' class='underline mt-4 inline-block'>Return to catalog</a></div>";
    require_once __DIR__ . '/includes/footer.php';
    exit;
}
?>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        <!-- Product Image -->
        <div class="space-y-4">
            <div class="bg-white border border-[#E8DFC8] p-4 aspect-square flex items-center justify-center overflow-hidden">
                <img src="<?= escape($product['image']) ?>" alt="<?= escape($product['name']) ?>" class="w-full h-full object-cover">
            </div>
        </div>

        <!-- Product Information -->
        <div class="space-y-6">
            <div>
                <span class="text-xs font-bold uppercase tracking-widest text-[#9E7D58]"><?= escape($product['category']) ?></span>
                <h1 class="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mt-1"><?= escape($product['name']) ?></h1>
                <p class="text-xs text-stone-400 mt-1">SKU: <?= escape($product['sku']) ?></p>
            </div>

            <div class="flex items-baseline space-x-3">
                <span class="text-2xl font-bold text-stone-900"><?= format_price($product['discount_price']) ?></span>
                <span class="text-base text-stone-400 line-through"><?= format_price($product['original_price']) ?></span>
                <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                    Save <?= round((($product['original_price'] - $product['discount_price']) / $product['original_price']) * 100) ?>%
                </span>
            </div>

            <p class="text-xs text-stone-600 leading-relaxed border-t border-b border-stone-200 py-4">
                <?= nl2br(escape($product['description'])) ?>
            </p>

            <form action="cart.php" method="POST" class="space-y-4">
                <input type="hidden" name="action" value="add">
                <input type="hidden" name="product_id" value="<?= $product['id'] ?>">
                <input type="hidden" name="csrf_token" value="<?= generate_csrf_token() ?>">

                <div class="flex items-center space-x-4">
                    <label class="text-xs font-bold uppercase tracking-wider text-stone-700">Quantity:</label>
                    <input type="number" name="quantity" value="1" min="1" max="<?= $product['stock'] ?>" class="w-16 px-3 py-2 border border-stone-300 rounded text-center text-xs">
                    <span class="text-xs text-stone-400">In Stock: <?= $product['stock'] ?> units</span>
                </div>

                <div class="flex space-x-4 pt-2">
                    <button type="submit" class="flex-1 py-4 bg-[#1C1917] hover:bg-[#9E7D58] text-white text-xs font-bold uppercase tracking-widest transition-colors">
                        Add to Shopping Bag
                    </button>
                    <a href="wishlist.php?action=add&product_id=<?= $product['id'] ?>" class="p-4 border border-stone-300 hover:border-stone-900 transition-colors flex items-center justify-center">
                        <i class="fa-regular fa-heart text-base"></i>
                    </a>
                </div>
            </form>

            <!-- Ingredients & Usage Accordion -->
            <div class="pt-6 space-y-4 border-t border-stone-200 text-xs">
                <?php if (!empty($product['ingredients'])): ?>
                <div>
                    <h4 class="font-bold uppercase tracking-wider text-stone-900 mb-1">Key Botanical Ingredients</h4>
                    <p class="text-stone-600"><?= escape($product['ingredients']) ?></p>
                </div>
                <?php endif; ?>

                <?php if (!empty($product['benefits'])): ?>
                <div>
                    <h4 class="font-bold uppercase tracking-wider text-stone-900 mb-1">Dermatological Benefits</h4>
                    <p class="text-stone-600"><?= escape($product['benefits']) ?></p>
                </div>
                <?php endif; ?>

                <?php if (!empty($product['how_to_use'])): ?>
                <div>
                    <h4 class="font-bold uppercase tracking-wider text-stone-900 mb-1">Recommended Application</h4>
                    <p class="text-stone-600"><?= escape($product['how_to_use']) ?></p>
                </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
