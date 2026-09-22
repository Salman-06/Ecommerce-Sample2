<?php
$admin_title = 'Add New Formulation — LUMÉRA Admin';
require_once __DIR__ . '/header.php';

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $sku = trim($_POST['sku'] ?? '');
    $category = $_POST['category'] ?? 'Serum';
    $short_desc = trim($_POST['short_description'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $ingredients = trim($_POST['ingredients'] ?? '');
    $benefits = trim($_POST['benefits'] ?? '');
    $how_to_use = trim($_POST['how_to_use'] ?? '');
    $original_price = (float)($_POST['original_price'] ?? 0);
    $discount_price = (float)($_POST['discount_price'] ?? 0);
    $stock = (int)($_POST['stock'] ?? 0);
    $image = trim($_POST['image'] ?? '');
    $new_launch = isset($_POST['new_launch']) ? 1 : 0;
    $featured = isset($_POST['featured']) ? 1 : 0;

    if (empty($name) || empty($sku) || $discount_price <= 0 || empty($image)) {
        $error = 'Please fill in product name, SKU, price, and image URL.';
    } else {
        try {
            $stmt = $pdo->prepare("
                INSERT INTO products (
                    name, sku, category, short_description, description,
                    ingredients, benefits, how_to_use, original_price, discount_price,
                    stock, image, new_launch, featured, status, rating, reviews_count, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 5.0, 0, NOW())
            ");
            $stmt->execute([
                $name, $sku, $category, $short_desc, $description,
                $ingredients, $benefits, $how_to_use, $original_price, $discount_price,
                $stock, $image, $new_launch, $featured
            ]);
            header("Location: products.php");
            exit;
        } catch (PDOException $e) {
            $error = 'Failed to create formulation: ' . $e->getMessage();
        }
    }
}
?>

<div class="max-w-3xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <span class="text-xs uppercase font-bold tracking-widest text-[#9E7D58]">Inventory Expansion</span>
            <h2 class="text-2xl font-bold text-stone-900">Add New Formulation</h2>
        </div>
        <a href="products.php" class="text-xs font-bold text-stone-600 hover:text-stone-900">← Back to Catalog</a>
    </div>

    <?php if (!empty($error)): ?>
        <div class="bg-red-50 text-red-700 p-3 rounded-lg text-xs"><?= escape($error) ?></div>
    <?php endif; ?>

    <form action="product-add.php" method="POST" class="bg-white rounded-2xl border border-stone-200 p-8 space-y-5 text-xs">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label class="block font-bold text-stone-700 uppercase mb-1">Formulation Name *</label>
                <input type="text" name="name" required placeholder="e.g. Copper Peptide Complex" class="w-full px-3 py-2 border border-stone-300 rounded outline-none focus:border-stone-900">
            </div>
            <div>
                <label class="block font-bold text-stone-700 uppercase mb-1">SKU Code *</label>
                <input type="text" name="sku" required placeholder="LUM-CP-07" class="w-full px-3 py-2 border border-stone-300 rounded outline-none focus:border-stone-900">
            </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
                <label class="block font-bold text-stone-700 uppercase mb-1">Category *</label>
                <select name="category" class="w-full px-3 py-2 border border-stone-300 rounded outline-none focus:border-stone-900 bg-white">
                    <option value="Serum">Serum</option>
                    <option value="Cleanser">Cleanser</option>
                    <option value="Moisturizer">Moisturizer</option>
                    <option value="Sun Care">Sun Care</option>
                    <option value="Face Care">Face Care</option>
                </select>
            </div>
            <div>
                <label class="block font-bold text-stone-700 uppercase mb-1">Original Price (₹)</label>
                <input type="number" step="0.01" name="original_price" required placeholder="999" class="w-full px-3 py-2 border border-stone-300 rounded outline-none focus:border-stone-900">
            </div>
            <div>
                <label class="block font-bold text-stone-700 uppercase mb-1">Selling Price (₹) *</label>
                <input type="number" step="0.01" name="discount_price" required placeholder="799" class="w-full px-3 py-2 border border-stone-300 rounded outline-none focus:border-stone-900">
            </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label class="block font-bold text-stone-700 uppercase mb-1">Units In Stock *</label>
                <input type="number" name="stock" required value="40" class="w-full px-3 py-2 border border-stone-300 rounded outline-none focus:border-stone-900">
            </div>
            <div>
                <label class="block font-bold text-stone-700 uppercase mb-1">Image URL *</label>
                <input type="url" name="image" required placeholder="https://images.unsplash.com/..." class="w-full px-3 py-2 border border-stone-300 rounded outline-none focus:border-stone-900">
            </div>
        </div>

        <div>
            <label class="block font-bold text-stone-700 uppercase mb-1">Short Description</label>
            <input type="text" name="short_description" placeholder="Brief 1-sentence synopsis" class="w-full px-3 py-2 border border-stone-300 rounded outline-none focus:border-stone-900">
        </div>

        <div>
            <label class="block font-bold text-stone-700 uppercase mb-1">Comprehensive Description</label>
            <textarea name="description" rows="3" class="w-full px-3 py-2 border border-stone-300 rounded outline-none focus:border-stone-900"></textarea>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
                <label class="block font-bold text-stone-700 uppercase mb-1">Key Ingredients</label>
                <input type="text" name="ingredients" placeholder="Hyaluronic Acid, Ceramides..." class="w-full px-3 py-2 border border-stone-300 rounded outline-none focus:border-stone-900">
            </div>
            <div>
                <label class="block font-bold text-stone-700 uppercase mb-1">Clinical Benefits</label>
                <input type="text" name="benefits" placeholder="Restores barrier, reduces transepidermal loss..." class="w-full px-3 py-2 border border-stone-300 rounded outline-none focus:border-stone-900">
            </div>
            <div>
                <label class="block font-bold text-stone-700 uppercase mb-1">Usage Ritual</label>
                <input type="text" name="how_to_use" placeholder="Apply 3-4 drops morning and night..." class="w-full px-3 py-2 border border-stone-300 rounded outline-none focus:border-stone-900">
            </div>
        </div>

        <div class="flex items-center gap-6 pt-2">
            <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="new_launch" value="1" checked>
                <span class="font-bold uppercase text-stone-700">Display 'New Launch' Badge</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="featured" value="1" checked>
                <span class="font-bold uppercase text-stone-700">Display in Featured Section</span>
            </label>
        </div>

        <div class="pt-4 border-t border-stone-200">
            <button type="submit" class="px-8 py-3.5 bg-[#1C1917] hover:bg-[#9E7D58] text-white font-bold uppercase tracking-widest transition-colors rounded-xl">
                Save & Publish Formulation
            </button>
        </div>
    </form>
</div>

</main>
</div>
</body>
</html>
