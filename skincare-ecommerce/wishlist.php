<?php
require_once __DIR__ . '/includes/header.php';

// Wishlist Action Handlers
$action = $_GET['action'] ?? '';
$product_id = (int)($_GET['product_id'] ?? 0);

if ($action === 'add' && $product_id > 0) {
    if (!isset($_SESSION['wishlist'])) {
        $_SESSION['wishlist'] = [];
    }
    if (!in_array($product_id, $_SESSION['wishlist'])) {
        $_SESSION['wishlist'][] = $product_id;
    }
    header("Location: wishlist.php");
    exit;
} elseif ($action === 'remove' && $product_id > 0) {
    if (isset($_SESSION['wishlist'])) {
        $_SESSION['wishlist'] = array_diff($_SESSION['wishlist'], [$product_id]);
    }
    header("Location: wishlist.php");
    exit;
}

require_once __DIR__ . '/includes/navbar.php';

$wishlist_ids = $_SESSION['wishlist'] ?? [];
$wishlist_products = [];

if (!empty($wishlist_ids)) {
    $in = str_repeat('?,', count($wishlist_ids) - 1) . '?';
    try {
        $stmt = $pdo->prepare("SELECT * FROM products WHERE id IN ($in) AND status = 1");
        $stmt->execute(array_values($wishlist_ids));
        $wishlist_products = $stmt->fetchAll();
    } catch (PDOException $e) {
        $wishlist_products = [];
    }
}
?>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="mb-8">
        <span class="text-xs font-bold uppercase tracking-widest text-[#9E7D58]">Saved Rituals</span>
        <h1 class="text-3xl font-serif font-bold text-stone-900 mt-1">Your Wishlist</h1>
    </div>

    <?php if (empty($wishlist_products)): ?>
        <div class="bg-white border border-[#E8DFC8] p-12 text-center max-w-lg mx-auto space-y-4">
            <i class="fa-regular fa-heart text-3xl text-stone-300"></i>
            <h3 class="font-serif font-bold text-xl text-stone-800">Your wishlist is empty</h3>
            <p class="text-xs text-stone-500">Save formulations you wish to try during future seasonal rituals.</p>
            <a href="products.php" class="inline-block px-6 py-3 bg-[#1C1917] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#9E7D58]">
                Explore Formulations
            </a>
        </div>
    <?php else: ?>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <?php foreach ($wishlist_products as $p): ?>
                <div class="bg-white border border-[#E8DFC8] p-4 flex flex-col">
                    <img src="<?= escape($p['image']) ?>" alt="<?= escape($p['name']) ?>" class="w-full aspect-square object-cover mb-4">
                    <span class="text-[10px] uppercase tracking-wider font-bold text-[#9E7D58]"><?= escape($p['category']) ?></span>
                    <h4 class="font-serif font-bold text-base text-stone-900 mb-2">
                        <a href="product-details.php?id=<?= $p['id'] ?>" class="hover:underline"><?= escape($p['name']) ?></a>
                    </h4>
                    <div class="mt-auto flex items-center justify-between pt-3 border-t border-stone-100">
                        <span class="font-bold text-sm text-stone-900"><?= format_price($p['discount_price']) ?></span>
                        <div class="flex items-center gap-2">
                            <form action="cart.php" method="POST">
                                <input type="hidden" name="action" value="add">
                                <input type="hidden" name="product_id" value="<?= $p['id'] ?>">
                                <input type="hidden" name="csrf_token" value="<?= generate_csrf_token() ?>">
                                <button type="submit" class="text-[11px] font-bold uppercase px-3 py-1.5 bg-stone-900 text-white hover:bg-[#9E7D58]">
                                    + Bag
                                </button>
                            </form>
                            <a href="wishlist.php?action=remove&product_id=<?= $p['id'] ?>" class="text-stone-400 hover:text-red-500 p-1.5" title="Remove">
                                <i class="fa-solid fa-xmark"></i>
                            </a>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
