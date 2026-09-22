<?php
$page_title = 'Formulations Catalog — LUMÉRA SKIN';
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';

$category = $_GET['category'] ?? '';
$search = $_GET['q'] ?? '';
$sort = $_GET['sort'] ?? 'newest';

$sql = "SELECT * FROM products WHERE status = 1";
$params = [];

if (!empty($category) && $category !== 'All') {
    $sql .= " AND category = ?";
    $params[] = $category;
}

if (!empty($search)) {
    $sql .= " AND (name LIKE ? OR short_description LIKE ? OR ingredients LIKE ?)";
    $params[] = "%$search%";
    $params[] = "%$search%";
    $params[] = "%$search%";
}

switch ($sort) {
    case 'price_low':
        $sql .= " ORDER BY discount_price ASC";
        break;
    case 'price_high':
        $sql .= " ORDER BY discount_price DESC";
        break;
    default:
        $sql .= " ORDER BY created_at DESC";
        break;
}

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $products = $stmt->fetchAll();
} catch (PDOException $e) {
    $products = [];
}
?>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Breadcrumb & Title -->
    <div class="mb-8">
        <span class="text-xs font-bold uppercase tracking-widest text-[#9E7D58]">Curated Catalog</span>
        <h1 class="text-3xl font-serif font-bold text-stone-900 mt-1">
            <?= !empty($category) ? escape($category) . ' Formulations' : 'All Skin Formulations' ?>
        </h1>
        <p class="text-xs text-stone-500 mt-1">Showing <?= count($products) ?> conscious formulations</p>
    </div>

    <!-- Filter & Sort Controls -->
    <div class="flex flex-wrap items-center justify-between gap-4 bg-white p-4 border border-[#E8DFC8] mb-10 text-xs">
        <div class="flex flex-wrap gap-2">
            <a href="products.php" class="px-3.5 py-1.5 rounded-full <?= empty($category) ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200' ?> font-bold uppercase">All</a>
            <a href="products.php?category=Serum" class="px-3.5 py-1.5 rounded-full <?= $category === 'Serum' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200' ?> font-bold uppercase">Serums</a>
            <a href="products.php?category=Cleanser" class="px-3.5 py-1.5 rounded-full <?= $category === 'Cleanser' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200' ?> font-bold uppercase">Cleansers</a>
            <a href="products.php?category=Moisturizer" class="px-3.5 py-1.5 rounded-full <?= $category === 'Moisturizer' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200' ?> font-bold uppercase">Moisturizers</a>
            <a href="products.php?category=Sun Care" class="px-3.5 py-1.5 rounded-full <?= $category === 'Sun Care' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200' ?> font-bold uppercase">Sun Care</a>
        </div>

        <form method="GET" action="products.php" class="flex items-center gap-3">
            <?php if (!empty($category)): ?>
                <input type="hidden" name="category" value="<?= escape($category) ?>">
            <?php endif; ?>
            <input type="text" name="q" value="<?= escape($search) ?>" placeholder="Search ingredients, concerns..." class="px-3 py-1.5 border border-stone-300 rounded text-xs outline-none focus:border-stone-900">
            <select name="sort" onchange="this.form.submit()" class="px-3 py-1.5 border border-stone-300 rounded text-xs outline-none bg-white">
                <option value="newest" <?= $sort === 'newest' ? 'selected' : '' ?>>Newest First</option>
                <option value="price_low" <?= $sort === 'price_low' ? 'selected' : '' ?>>Price: Low to High</option>
                <option value="price_high" <?= $sort === 'price_high' ? 'selected' : '' ?>>Price: High to Low</option>
            </select>
        </form>
    </div>

    <!-- Product Grid -->
    <?php if (empty($products)): ?>
        <div class="text-center py-20 bg-white border border-[#E8DFC8]">
            <p class="text-stone-500 font-serif text-lg mb-2">No formulations found matching your query.</p>
            <a href="products.php" class="text-xs font-bold uppercase underline">Reset Filters</a>
        </div>
    <?php else: ?>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <?php foreach ($products as $product): ?>
                <div class="group flex flex-col bg-white border border-[#E8DFC8]/70 p-4 transition-all duration-300 hover:shadow-lg">
                    <div class="relative overflow-hidden bg-stone-100 aspect-square mb-4">
                        <img src="<?= escape($product['image']) ?>" alt="<?= escape($product['name']) ?>" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                        <?php if (!empty($product['new_launch'])): ?>
                            <span class="absolute top-2 left-2 bg-[#1C1917] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1">New Launch</span>
                        <?php endif; ?>
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
    <?php endif; ?>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
