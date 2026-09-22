<?php
$page_title = 'Client Sign In — LUMÉRA SKIN';
require_once __DIR__ . '/includes/header.php';

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if (empty($email) || empty($password)) {
        $error = 'Please enter both your email address and password.';
    } else {
        try {
            $stmt = $pdo->prepare("SELECT * FROM customers WHERE email = ? LIMIT 1");
            $stmt->execute([$email]);
            $customer = $stmt->fetch();

            if ($customer && password_verify($password, $customer['password'])) {
                $_SESSION['customer_id'] = $customer['id'];
                $_SESSION['customer_name'] = $customer['name'];
                $_SESSION['customer_email'] = $customer['email'];
                header("Location: index.php");
                exit;
            } else {
                $error = 'Invalid credentials. If you are an administrator, please use the Admin Portal.';
            }
        } catch (PDOException $e) {
            $error = 'Database error: ' . $e->getMessage();
        }
    }
}

require_once __DIR__ . '/includes/navbar.php';
?>

<div class="max-w-md mx-auto px-4 py-16">
    <div class="bg-white border border-[#E8DFC8] p-8 space-y-6 text-xs shadow-xs">
        <div class="text-center space-y-1">
            <span class="font-bold uppercase tracking-widest text-[#9E7D58]">Client Portal</span>
            <h1 class="text-2xl font-serif font-bold text-stone-900">Sign In to Your Account</h1>
        </div>

        <?php if (!empty($error)): ?>
            <div class="bg-red-50 text-red-700 p-3 rounded"><?= escape($error) ?></div>
        <?php endif; ?>

        <form action="login.php" method="POST" class="space-y-4">
            <div>
                <label class="block font-bold text-stone-700 uppercase mb-1">Email Address</label>
                <input type="email" name="email" required class="w-full px-3 py-2 border border-stone-300 rounded outline-none focus:border-stone-900">
            </div>

            <div>
                <label class="block font-bold text-stone-700 uppercase mb-1">Password</label>
                <input type="password" name="password" required class="w-full px-3 py-2 border border-stone-300 rounded outline-none focus:border-stone-900">
            </div>

            <button type="submit" class="w-full py-3.5 bg-[#1C1917] hover:bg-[#9E7D58] text-white font-bold uppercase tracking-widest transition-colors">
                Sign In
            </button>
        </form>

        <div class="pt-4 text-center border-t border-stone-100 text-stone-500 space-y-2">
            <p>New to LUMÉRA? <a href="register.php" class="font-bold text-stone-900 underline">Create an Account</a></p>
            <p>Store administrator? <a href="admin/login.php" class="text-[#9E7D58] font-bold">Admin Portal →</a></p>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
