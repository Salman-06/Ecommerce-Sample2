<?php
$admin_title = 'Client Directory — LUMÉRA Admin';
require_once __DIR__ . '/header.php';

$stmt = $pdo->query("SELECT * FROM customers ORDER BY id DESC");
$customers = $stmt->fetchAll();
?>

<div class="space-y-6">
    <div>
        <span class="text-xs uppercase font-bold tracking-widest text-[#9E7D58]">Client Registry</span>
        <h2 class="text-2xl font-bold text-stone-900">Registered Customers (<?= count($customers) ?>)</h2>
    </div>

    <div class="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
                <thead class="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-bold tracking-wider">
                    <tr>
                        <th class="p-4">ID</th>
                        <th class="p-4">Customer Name</th>
                        <th class="p-4">Contact Details</th>
                        <th class="p-4">Registration Date</th>
                        <th class="p-4">Status</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-stone-100">
                    <?php if (empty($customers)): ?>
                        <tr><td colspan="5" class="p-6 text-center text-stone-400">No registered customers yet.</td></tr>
                    <?php else: ?>
                        <?php foreach ($customers as $c): ?>
                            <tr class="hover:bg-stone-50/50">
                                <td class="p-4 font-mono font-bold text-stone-400">#<?= $c['id'] ?></td>
                                <td class="p-4 font-bold text-stone-900"><?= escape($c['name']) ?></td>
                                <td class="p-4 text-stone-600">
                                    <div><?= escape($c['email']) ?></div>
                                    <div class="text-[11px] text-stone-400"><?= escape($c['phone'] ?? 'N/A') ?></div>
                                </td>
                                <td class="p-4 text-stone-500"><?= date('M d, Y', strtotime($c['created_at'])) ?></td>
                                <td class="p-4">
                                    <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700">Active</span>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

</main>
</div>
</body>
</html>
