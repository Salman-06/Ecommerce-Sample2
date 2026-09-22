<?php
$admin_title = 'Client Inquiries — LUMÉRA Admin';
require_once __DIR__ . '/header.php';

// Quick Status Toggle
if (isset($_GET['mark_replied']) && isset($_GET['id'])) {
    $id = (int)$_GET['id'];
    $stmt = $pdo->prepare("UPDATE contact_messages SET status = 'Replied' WHERE id = ?");
    $stmt->execute([$id]);
    header("Location: messages.php");
    exit;
}

$stmt = $pdo->query("SELECT * FROM contact_messages ORDER BY created_at DESC");
$messages = $stmt->fetchAll();
?>

<div class="space-y-6">
    <div>
        <span class="text-xs uppercase font-bold tracking-widest text-[#9E7D58]">Client Relations</span>
        <h2 class="text-2xl font-bold text-stone-900">Consultation Inquiries (<?= count($messages) ?>)</h2>
    </div>

    <div class="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
                <thead class="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-bold tracking-wider">
                    <tr>
                        <th class="p-4">Date</th>
                        <th class="p-4">Client</th>
                        <th class="p-4">Subject</th>
                        <th class="p-4">Inquiry Message</th>
                        <th class="p-4">Status</th>
                        <th class="p-4 text-right">Action</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-stone-100">
                    <?php if (empty($messages)): ?>
                        <tr><td colspan="6" class="p-8 text-center text-stone-400">No consultation messages recorded.</td></tr>
                    <?php else: ?>
                        <?php foreach ($messages as $m): ?>
                            <tr class="hover:bg-stone-50/50">
                                <td class="p-4 text-stone-400"><?= date('M d, H:i', strtotime($m['created_at'])) ?></td>
                                <td class="p-4">
                                    <span class="font-bold text-stone-900 block"><?= escape($m['name']) ?></span>
                                    <span class="text-[11px] text-stone-400"><?= escape($m['email']) ?></span>
                                </td>
                                <td class="p-4 font-semibold text-stone-800"><?= escape($m['subject']) ?></td>
                                <td class="p-4 text-stone-600 max-w-sm truncate"><?= escape($m['message']) ?></td>
                                <td class="p-4">
                                    <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase <?= $m['status'] === 'Replied' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700' ?>">
                                        <?= escape($m['status']) ?>
                                    </span>
                                </td>
                                <td class="p-4 text-right">
                                    <?php if ($m['status'] !== 'Replied'): ?>
                                        <a href="messages.php?mark_replied=1&id=<?= $m['id'] ?>" class="px-3 py-1 bg-stone-900 hover:bg-[#9E7D58] text-white rounded text-[11px] font-bold uppercase">
                                            Mark Replied
                                        </a>
                                    <?php else: ?>
                                        <span class="text-stone-400 text-xs">Resolved</span>
                                    <?php endif; ?>
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
