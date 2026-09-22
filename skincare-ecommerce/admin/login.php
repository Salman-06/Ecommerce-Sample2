<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    // Verify against DB or standard credentials
    $authenticated = false;
    try {
        $stmt = $pdo->prepare("SELECT * FROM admins WHERE username = ? OR email = ? LIMIT 1");
        $stmt->execute([$username, $username]);
        $admin = $stmt->fetch();

        if ($admin && password_verify($password, $admin['password'])) {
            $authenticated = true;
            $_SESSION['admin_username'] = $admin['username'];
        }
    } catch (PDOException $e) {
        // Fallback check
    }

    // Default emergency fallback
    if (!$authenticated && ($username === 'admin' || $username === 'admin@lumeraskin.com') && ($password === 'password123' || $password === 'admin123')) {
        $authenticated = true;
        $_SESSION['admin_username'] = 'Admin';
    }

    if ($authenticated) {
        $_SESSION['admin_logged_in'] = true;
        header("Location: index.php");
        exit;
    } else {
        $error = 'Invalid credentials. Default: admin / password123';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Authentication — LUMÉRA SKIN</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-[#1C1917] text-white min-h-screen flex items-center justify-center p-4">
    <div class="max-w-sm w-full bg-[#292524] border border-stone-700 p-8 rounded-2xl shadow-2xl space-y-6 text-xs">
        <div class="text-center space-y-1">
            <div class="w-10 h-10 rounded-xl bg-[#1C1917] text-[#C5A880] flex items-center justify-center mx-auto text-lg font-bold">L</div>
            <h1 class="text-lg font-bold tracking-wider uppercase text-white mt-2">Staff Portal</h1>
            <p class="text-stone-400">Restricted Administration Environment</p>
        </div>

        <?php if (!empty($error)): ?>
            <div class="bg-red-950 text-red-300 border border-red-800 p-3 rounded"><?= escape($error) ?></div>
        <?php endif; ?>

        <form action="login.php" method="POST" class="space-y-4">
            <div>
                <label class="block uppercase font-bold text-stone-300 mb-1">Username or Email</label>
                <input type="text" name="username" required value="admin" class="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded text-white outline-none focus:border-[#C5A880]">
            </div>

            <div>
                <label class="block uppercase font-bold text-stone-300 mb-1">Password</label>
                <input type="password" name="password" required value="password123" class="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded text-white outline-none focus:border-[#C5A880]">
            </div>

            <button type="submit" class="w-full py-3 bg-[#C5A880] hover:bg-white text-stone-950 font-bold uppercase tracking-widest transition-colors rounded-lg">
                Authenticate
            </button>
        </form>

        <div class="p-3 bg-stone-900/80 rounded border border-stone-800 text-[11px] text-stone-400">
            <strong>Default Credentials:</strong><br>
            User: <code class="text-stone-200">admin</code><br>
            Password: <code class="text-stone-200">password123</code>
        </div>
    </div>
</body>
</html>
