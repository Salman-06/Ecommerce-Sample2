<?php
$page_title = 'Dermal Consultation & Laboratory Inquiries — LUMÉRA SKIN';
require_once __DIR__ . '/includes/header.php';

$success = false;
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_POST['csrf_token']) || !verify_csrf_token($_POST['csrf_token'])) {
        $error = 'Security session expired. Please refresh.';
    } else {
        $name = trim($_POST['name'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $phone = trim($_POST['phone'] ?? '');
        $subject = trim($_POST['subject'] ?? 'General Skin Inquiry');
        $message = trim($_POST['message'] ?? '');

        if (empty($name) || empty($email) || empty($message)) {
            $error = 'Please provide your name, email address, and inquiry message.';
        } else {
            try {
                $stmt = $pdo->prepare("
                    INSERT INTO contact_messages (name, email, phone, subject, message, status, created_at)
                    VALUES (?, ?, ?, ?, ?, 'New', NOW())
                ");
                $stmt->execute([$name, $email, $phone, $subject, $message]);
                $success = true;
            } catch (PDOException $e) {
                $error = 'Unable to send message at this time: ' . $e->getMessage();
            }
        }
    }
}

require_once __DIR__ . '/includes/navbar.php';
?>

<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
    <div class="mb-10 text-center max-w-xl mx-auto space-y-2">
        <span class="text-xs font-bold uppercase tracking-widest text-[#9E7D58]">Direct Consultation</span>
        <h1 class="text-3xl sm:text-4xl font-serif font-bold text-stone-900">Connect With Our Dermal Specialists</h1>
        <p class="text-xs text-stone-500">
            Have questions about ingredient compatibility, product layering, or custom routines? Our team is at your service.
        </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
        <!-- Contact Form -->
        <div class="md:col-span-2 bg-white border border-[#E8DFC8] p-6 sm:p-8">
            <?php if ($success): ?>
                <div class="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-xl text-xs text-center space-y-2">
                    <i class="fa-solid fa-check-circle text-2xl text-emerald-600"></i>
                    <h4 class="font-bold text-sm">Inquiry Received</h4>
                    <p>Thank you for reaching out. A dermal care specialist will review your note and respond within 24 business hours.</p>
                </div>
            <?php else: ?>
                <?php if (!empty($error)): ?>
                    <div class="bg-red-50 text-red-700 p-3 rounded mb-4 text-xs"><?= escape($error) ?></div>
                <?php endif; ?>

                <form action="contact.php" method="POST" class="space-y-4 text-xs">
                    <input type="hidden" name="csrf_token" value="<?= generate_csrf_token() ?>">

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-bold text-stone-700 uppercase mb-1">Your Name *</label>
                            <input type="text" name="name" required class="w-full px-3 py-2 border border-stone-300 rounded outline-none focus:border-stone-900">
                        </div>
                        <div>
                            <label class="block font-bold text-stone-700 uppercase mb-1">Email Address *</label>
                            <input type="email" name="email" required class="w-full px-3 py-2 border border-stone-300 rounded outline-none focus:border-stone-900">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-bold text-stone-700 uppercase mb-1">Phone (Optional)</label>
                            <input type="text" name="phone" class="w-full px-3 py-2 border border-stone-300 rounded outline-none focus:border-stone-900">
                        </div>
                        <div>
                            <label class="block font-bold text-stone-700 uppercase mb-1">Subject</label>
                            <input type="text" name="subject" placeholder="e.g. Sensitive skin advice" class="w-full px-3 py-2 border border-stone-300 rounded outline-none focus:border-stone-900">
                        </div>
                    </div>

                    <div>
                        <label class="block font-bold text-stone-700 uppercase mb-1">Message / Skin Concern *</label>
                        <textarea name="message" rows="4" required class="w-full px-3 py-2 border border-stone-300 rounded outline-none focus:border-stone-900" placeholder="Please describe your skin type, any current breakouts, or specific formulation queries..."></textarea>
                    </div>

                    <button type="submit" class="px-8 py-3.5 bg-[#1C1917] hover:bg-[#9E7D58] text-white font-bold uppercase tracking-widest transition-colors">
                        Submit Message
                    </button>
                </form>
            <?php endif; ?>
        </div>

        <!-- Info Sidebar -->
        <div class="bg-[#F5F2EB] border border-[#E8DFC8] p-6 space-y-6 text-xs text-stone-700">
            <div>
                <h4 class="font-serif font-bold text-base text-stone-900 mb-2">Laboratory & Studio</h4>
                <p class="text-stone-600 leading-relaxed">
                    No. 402, 100ft Road, Indiranagar<br>
                    Bengaluru, Karnataka 560038<br>
                    India
                </p>
            </div>

            <div class="border-t border-stone-300/60 pt-4">
                <h4 class="font-serif font-bold text-base text-stone-900 mb-2">Support Channels</h4>
                <p class="text-stone-600">Email: care@lumeraskin.com</p>
                <p class="text-stone-600">Toll-Free: +91 1800-419-LUMERA</p>
            </div>

            <div class="border-t border-stone-300/60 pt-4">
                <h4 class="font-serif font-bold text-base text-stone-900 mb-2">Operating Hours</h4>
                <p class="text-stone-600">Monday - Friday: 9:00 AM – 7:00 PM IST</p>
                <p class="text-stone-600">Saturday: 10:00 AM – 4:00 PM IST</p>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
