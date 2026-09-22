<?php
$page_title = 'Create Account — LUMÉRA SKIN';
require_once __DIR__ . '/includes/header.php';

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $password = $_POST['password'] ?? '';

    if (empty($name) || empty($email) || empty($password)) {
        $error = 'Please fill in all mandatory fields.';
    } else {
        try {
            // Check if email already registered
            $stmt_check = $pdo->prepare("SELECT id FROM customers WHERE email = ? LIMIT 1");
            $stmt_check->execute([$email]);
            if ($stmt_check->fetch()) {
                $error = 'An account with this email address already exists.';
            } else {
                $hash = password_hash($password, PASSWORD_DEFAULT);
                $stmt = $pdo->prepare("
                    INSERT INTO customers (name, email, phone, password, created_at)
                    VALUES (?, ?, ?, ?, NOW())
                ");
                $stmt->execute([$name, $email, $phone, $hash]);

                $_SESSION['customer_id'] = $pdo->lastInsertId();
                $_SESSION['customer_name'] = $name;
                $_SESSION['customer_email'] = $email;

                header("Location: index.php");
                exit;
            }
        } catch (PDOException $e) {
            $error = 'Registration error: ' . $e->getMessage();
        }
    }
}

require_once __DIR__ . '/includes/navbar.php';
?>

<div class="max-w-md mx-auto px-4 py-16">
    <div class="bg-white border border-[#E8DFC8] p-8 space-y-6 text-xs shadow-xs">
        <div class="text-center space-y-1">
            <span class="font-bold uppercase tracking-widest text-[#9E7D58]">Join the Circle</span>
            <h1 class="text-2xl font-serif font-bold text-stone-900">Create an Account</h1>
        </div>

        <?php if (!empty($error)): ?>
            <div class="bg-red-50 text-red-700 p-3 rounded"><?= escape($error) ?></div>
        <?php endif; ?>

        <form action="register.php" method="POST" class="space-y-4">
            <div>
                <label class="block font-bold text-stone-700 uppercase mb-1">Full Name *</label>
                <input type="text" name="name" required class="w-full px-3 py-2 border border-stone-300 rounded outline-none focus:border-stone-900">
            </div>

            <div>
                <label class="block font-bold text-stone-700 uppercase mb-1">Email Address *</label>
                <input type="email" name="email" required class="w-full px-3 py-2 border border-stone-300 rounded outline-none focus:border-stone-900">
            </div>

            <div>
                <label class="block font-bold text-stone-700 uppercase mb-1">Phone Number</label>
                <input type="text" name="phone" class="w-full px-3 py-2 border border-stone-300 rounded outline-none focus:border-stone-900">
            </div>

            <div>
                <label class="block font-bold text-stone-700 uppercase mb-1">Password *</label>
                <input type="password" name="password" minlength="6" required class="w-full px-3 py-2 border border-stone-300 rounded outline-none focus:border-stone-900">
            </div>

            <button type="submit" class="w-full py-3.5 bg-[#1C1917] hover:bg-[#9E7D58] text-white font-bold uppercase tracking-widest transition-colors">
                Register Account
            </button>
        </form>

        <div class="pt-4 text-center border-t border-stone-100 text-stone-500">
            <p>Already have an account? <a href="login.php" class="font-bold text-stone-900 underline">Sign In</a></p>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
