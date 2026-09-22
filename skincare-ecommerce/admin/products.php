<?php
$admin_title = 'Manage Formulations — LUMÉRA Admin';
require_once __DIR__ . '/header.php';

// Quick toggle actions
if (isset($_GET['toggle_status']) && isset($_GET['id'])) {
    $id = (int)$_GET['id'];
    $stmt = $pdo->prepare("UPDATE products SET status = IF(status = 1, 0, 1) WHERE id = ?");
    $stmt->execute([$id]);
    header("Location: products.php");
    exit;
}

if (isset($_GET['toggle_new']) && isset($_GET['id'])) {
    $id = (int)$_GET['id'];
    $stmt = $pdo->prepare("UPDATE products SET new_launch = IF(new_launch = 1, 0, 1) WHERE id = ?");
    $stmt->execute([$id]);
    header("Location: products.php");
    exit;
}

// Fetch all products
$stmt = $pdo->query("SELECT * FROM products ORDER BY id DESC");
$products = $stmt->fetchAll();
?>

<div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <span class="text-xs uppercase font-bold tracking-widest text-[#9E7D58]">Catalog Control</span>
            <h2 class="text-2xl font-bold text-stone-900">Formulations Inventory (<?= count($products) ?>)</h2>
        </div>
        <a href="product-add.php" class="px-5 py-2.5 bg-[#1C1917] hover:bg-[#9E7D58] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2">
            <i class="fa-solid fa-plus"></i> New Formulation
        </a>
    </div>

    <div class="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
                <thead class="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-bold tracking-wider">
                    <tr>
                        <th class="p-4">SKU</th>
                        <th class="p-4">Product</th>
                        <th class="p-4">Category</th>
                        <th class="p-4">Pricing</th>
                        <th class="p-4">Stock</th>
                        <th class="p-4">New Launch</th>
                        <th class="p-4">Status</th>
                        <th class="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-stone-100">
                    <?php foreach ($products as $p): ?>
                        <tr class="hover:bg-stone-50/50">
                            <td class="p-4 font-mono font-bold text-stone-500"><?= escape($p['sku']) ?></td>
                            <td class="p-4 flex items-center gap-3">
                                <img src="<?= escape($p['image']) ?>" alt="" class="w-10 h-10 object-cover rounded-lg border border-stone-200">
                                <div>
                                    <span class="font-bold text-stone-900 block"><?= escape($p['name']) ?></span>
                                    <span class="text-[11px] text-stone-400">Rating: <?= $p['rating'] ?> ★</span>
                                </div>
                            </td>
                            <td class="p-4"><?= escape($p['category']) ?></td>
                            <td class="p-4">
                                <span class="font-bold text-stone-900"><?= format_price($p['discount_price']) ?></span>
                                <span class="text-[10px] text-stone-400 line-through block"><?= format_price($p['original_price']) ?></span>
                            </td>
                            <td class="p-4">
                                <span class="px-2 py-0.5 rounded font-bold text-xs <?= $p['stock'] <= 15 ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700' ?>">
                                    <?= $p['stock'] ?> units
                                </span>
                            </td>
                            <td class="p-4">
                                <a href="products.php?toggle_new=1&id=<?= $p['id'] ?>" class="px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-colors <?= $p['new_launch'] ? 'bg-[#1C1917] text-white' : 'bg-stone-100 text-stone-500' ?>">
                                    <?= $p['new_launch'] ? '★ Hero Badge' : 'Standard' ?>
                                </a>
                            </td>
                            <td class="p-4">
                                <a href="products.php?toggle_status=1&id=<?= $p['id'] ?>" class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors <?= $p['status'] ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-500' ?>">
                                    <?= $p['status'] ? 'Active' : 'Disabled' ?>
                                </a>
                            </td>
                            <td class="p-4 text-right space-x-2">
                                <a href="product-edit.php?id=<?= $p['id'] ?>" class="p-2 text-stone-600 hover:text-stone-950 font-semibold text-xs" title="Edit">
                                    <i class="fa-regular fa-pen-to-square"></i>
                                </a>
                                <a href="product-delete.php?id=<?= $p['id'] ?>" onclick="return confirm('Are you sure you want to delete this formulation?');" class="p-2 text-red-400 hover:text-red-700 font-semibold text-xs" title="Delete">
                                    <i class="fa-regular fa-trash-can"></i>
                                </a>
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
