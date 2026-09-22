<!-- Footer -->
<footer class="bg-[#1C1917] text-[#FAF8F5] mt-auto pt-16 pb-12 border-t border-stone-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800 text-xs">
            <div class="space-y-4">
                <span class="text-2xl font-serif font-bold tracking-widest block text-[#FAF8F5]">LUMÉRA</span>
                <p class="text-stone-400 leading-relaxed">
                    Formulating pure, bio-compatible skincare rituals designed to honor the skin's barrier integrity.
                </p>
                <div class="flex space-x-4 text-stone-400">
                    <a href="#" class="hover:text-white"><i class="fa-brands fa-instagram"></i></a>
                    <a href="#" class="hover:text-white"><i class="fa-brands fa-pinterest"></i></a>
                    <a href="#" class="hover:text-white"><i class="fa-brands fa-facebook"></i></a>
                </div>
            </div>

            <div>
                <h4 class="font-bold uppercase tracking-widest text-[#C5A880] mb-4">Formulations</h4>
                <ul class="space-y-2.5 text-stone-400">
                    <li><a href="products.php?category=Serum" class="hover:text-white">Active Serums</a></li>
                    <li><a href="products.php?category=Moisturizer" class="hover:text-white">Barrier Creams</a></li>
                    <li><a href="products.php?category=Cleanser" class="hover:text-white">pH Cleansers</a></li>
                    <li><a href="products.php?category=Sun Care" class="hover:text-white">Mineral Sun Care</a></li>
                </ul>
            </div>

            <div>
                <h4 class="font-bold uppercase tracking-widest text-[#C5A880] mb-4">Client Care</h4>
                <ul class="space-y-2.5 text-stone-400">
                    <li><a href="about.php" class="hover:text-white">Our Philosophy</a></li>
                    <li><a href="contact.php" class="hover:text-white">Dermal Consultation</a></li>
                    <li><a href="cart.php" class="hover:text-white">Shipping & Returns</a></li>
                    <li><a href="admin/login.php" class="hover:text-white">Staff Management Portal</a></li>
                </ul>
            </div>

            <div>
                <h4 class="font-bold uppercase tracking-widest text-[#C5A880] mb-4">Newsletter</h4>
                <p class="text-stone-400 mb-3">Join our private circle for early formulation launches.</p>
                <form action="contact.php" method="POST" class="flex">
                    <input type="email" placeholder="Your email address" class="px-3 py-2 bg-stone-900 border border-stone-700 rounded-l-lg text-xs text-white focus:outline-none w-full">
                    <button type="submit" class="bg-[#C5A880] text-stone-950 px-4 py-2 rounded-r-lg font-bold uppercase text-[10px] hover:bg-white transition-colors">Join</button>
                </form>
            </div>
        </div>

        <div class="pt-8 flex flex-col sm:flex-row justify-between items-center text-[11px] text-stone-500 gap-4">
            <p>© <?= date('Y') ?> LUMÉRA SKIN Laboratory. All rights reserved.</p>
            <p>100% Cruelty-Free • Dermatologist Tested • Paraben Free</p>
        </div>
    </div>
</footer>
</body>
</html>
