<?php
$cart_count = 0;
if (!empty($_SESSION['cart'])) {
    $cart_count = array_sum($_SESSION['cart']);
}
$wishlist_count = count($_SESSION['wishlist'] ?? []);
?>
<!-- Announcement Bar -->
<div class="bg-[#1C1917] text-[#FAF8F5] text-center text-xs py-2 tracking-widest uppercase font-medium">
    Complimentary Shipping on all orders above ₹999 • Code: <span class="text-[#C5A880] font-bold">GLOW10</span>
</div>

<!-- Main Header Navigation -->
<header class="bg-[#FAF8F5] border-b border-[#E8DFC8]/60 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
            <!-- Brand Logo -->
            <a href="index.php" class="flex flex-col">
                <span class="text-2xl font-serif font-bold tracking-[0.2em] text-[#1C1917]">LUMÉRA</span>
                <span class="text-[9px] tracking-[0.3em] text-stone-500 uppercase font-sans">Pure Care • Visible Glow</span>
            </a>

            <!-- Navigation Links -->
            <nav class="hidden md:flex space-x-8 text-xs font-semibold uppercase tracking-widest text-stone-700">
                <a href="index.php" class="hover:text-stone-950 transition-colors">Home</a>
                <a href="products.php" class="hover:text-stone-950 transition-colors">Formulations</a>
                <a href="about.php" class="hover:text-stone-950 transition-colors">Philosophy</a>
                <a href="contact.php" class="hover:text-stone-950 transition-colors">Consultation</a>
            </nav>

            <!-- Actions Icons -->
            <div class="flex items-center space-x-4 text-stone-800">
                <a href="products.php" class="p-2 hover:text-[#9E7D58] transition-colors" title="Search">
                    <i class="fa-solid fa-magnifying-glass"></i>
                </a>
                <a href="wishlist.php" class="p-2 hover:text-red-500 transition-colors relative" title="Wishlist">
                    <i class="fa-regular fa-heart"></i>
                    <?php if ($wishlist_count > 0): ?>
                        <span class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center"><?= $wishlist_count ?></span>
                    <?php endif; ?>
                </a>
                <a href="cart.php" class="p-2 hover:text-[#9E7D58] transition-colors relative" title="Cart">
                    <i class="fa-solid fa-bag-shopping"></i>
                    <?php if ($cart_count > 0): ?>
                        <span class="absolute -top-1 -right-1 bg-stone-900 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center"><?= $cart_count ?></span>
                    <?php endif; ?>
                </a>
                <?php if (is_customer_logged_in()): ?>
                    <a href="logout.php" class="text-xs uppercase font-semibold hover:underline">Logout</a>
                <?php else: ?>
                    <a href="login.php" class="p-2 hover:text-[#9E7D58] transition-colors" title="Login">
                        <i class="fa-regular fa-user"></i>
                    </a>
                <?php endif; ?>
                <a href="admin/login.php" class="text-[11px] px-2.5 py-1 rounded bg-stone-200 hover:bg-stone-300 font-bold uppercase" title="Admin Portal">
                    Admin
                </a>
            </div>
        </div>
    </div>
</header>
