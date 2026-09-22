<?php
$page_title = 'LUMÉRA SKIN — Pure Care. Visible Glow.';
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';

// Fetch newly launched formulations from database
try {
    $stmt_new = $pdo->query("SELECT * FROM products WHERE status = 1 AND new_launch = 1 ORDER BY created_at DESC LIMIT 4");
    $new_launches = $stmt_new->fetchAll();

    $stmt_feat = $pdo->query("SELECT * FROM products WHERE status = 1 AND featured = 1 ORDER BY id DESC LIMIT 4");
    $featured = $stmt_feat->fetchAll();
} catch (PDOException $e) {
    $new_launches = [];
    $featured = [];
}
?>

<!-- Hero Banner -->
<section class="relative bg-[#F5F2EB] py-20 lg:py-28 overflow-hidden border-b border-[#E8DFC8]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="max-w-2xl space-y-6">
            <span class="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#9E7D58]">Botanical Science • Clean Actives</span>
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-900 leading-[1.1]">
                Pure Care.<br>Visible Glow.
            </h1>
            <p class="text-stone-600 text-sm sm:text-base leading-relaxed max-w-lg">
                Minimalist, high-performance dermatological formulations engineered to support barrier repair and unveil your skin’s biological luminosity.
            </p>
            <div class="pt-4 flex flex-wrap gap-4">
                <a href="products.php" class="px-8 py-4 bg-[#1C1917] text-white text-xs font-bold tracking-widest uppercase hover:bg-[#9E7D58] transition-all rounded-none">
                    Explore Formulations
                </a>
                <a href="about.php" class="px-8 py-4 border border-stone-800 text-stone-900 text-xs font-bold tracking-widest uppercase hover:bg-stone-900 hover:text-white transition-all rounded-none">
                    Our Philosophy
                </a>
            </div>
        </div>
    </div>
</section>

<!-- New Launches Section (Controlled by Admin Panel) -->
<?php if (!empty($new_launches)): ?>
<section class="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-end justify-between mb-12 border-b border-stone-200 pb-4">
        <div>
            <span class="text-xs font-bold uppercase tracking-widest text-[#9E7D58]">Latest Formulations</span>
            <h2 class="text-3xl font-serif font-bold text-stone-900">New Launches</h2>
        </div>
        <a href="products.php" class="text-xs font-bold uppercase tracking-wider text-stone-600 hover:text-stone-950">View All →</a>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <?php foreach ($new_launches as $product): ?>
            <div class="group flex flex-col bg-white border border-[#E8DFC8]/70 p-4 transition-all duration-300 hover:shadow-lg">
                <div class="relative overflow-hidden bg-stone-100 aspect-square mb-4">
                    <img src="<?= escape($product['image']) ?>" alt="<?= escape($product['name']) ?>" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    <span class="absolute top-2 left-2 bg-[#1C1917] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1">New Launch</span>
                </div>
                <div class="text-[11px] uppercase tracking-wider text-[#9E7D58] font-bold mb-1"><?= escape($product['category']) ?></div>
                <h3 class="font-serif font-bold text-base text-stone-900 mb-1">
                    <a href="product-details.php?id=<?= $product['id'] ?>" class="hover:underline"><?= escape($product['name']) ?></a>
                </h3>
                <p class="text-xs text-stone-500 line-clamp-2 mb-3"><?= escape($product['short_description'] ?? '') ?></p>
                <div class="mt-auto flex items-center justify-between pt-2 border-t border-stone-100">
                    <div>
                        <span class="font-bold text-sm text-stone-900"><?= format_price($product['discount_price']) ?></span>
                        <span class="text-xs text-stone-400 line-through ml-1"><?= format_price($product['original_price']) ?></span>
                    </div>
                    <form action="cart.php" method="POST">
                        <input type="hidden" name="action" value="add">
                        <input type="hidden" name="product_id" value="<?= $product['id'] ?>">
                        <input type="hidden" name="csrf_token" value="<?= generate_csrf_token() ?>">
                        <button type="submit" class="text-xs font-bold uppercase tracking-wider px-3 py-1.5 bg-stone-900 text-white hover:bg-[#9E7D58] transition-colors">
                            + Bag
                        </button>
                    </form>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</section>
<?php endif; ?>

<!-- Brand Pillars / Values -->
<section class="bg-[#F5F2EB] py-16 border-y border-[#E8DFC8]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div class="p-6">
                <i class="fa-solid fa-seedling text-2xl text-[#9E7D58] mb-3"></i>
                <h4 class="font-serif font-bold text-lg mb-1">Clean Botanical Actives</h4>
                <p class="text-xs text-stone-500">Formulated without parabens, sulfates, silicones, or microplastics.</p>
            </div>
            <div class="p-6">
                <i class="fa-solid fa-microscope text-2xl text-[#9E7D58] mb-3"></i>
                <h4 class="font-serif font-bold text-lg mb-1">Clinical Bio-Availability</h4>
                <p class="text-xs text-stone-500">Cold-stabilized molecules calibrated for optimal epidermal absorption.</p>
            </div>
            <div class="p-6">
                <i class="fa-solid fa-shield-halved text-2xl text-[#9E7D58] mb-3"></i>
                <h4 class="font-serif font-bold text-lg mb-1">Dermatologist Verified</h4>
                <p class="text-xs text-stone-500">Hypoallergenic and safety-certified on melanin-rich Asian skin types.</p>
            </div>
            <div class="p-6">
                <i class="fa-solid fa-rotate-left text-2xl text-[#9E7D58] mb-3"></i>
                <h4 class="font-serif font-bold text-lg mb-1">Sustainable Glass</h4>
                <p class="text-xs text-stone-500">100% recyclable amber glass protection shielding active ingredients.</p>
            </div>
        </div>
    </div>
</section>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
