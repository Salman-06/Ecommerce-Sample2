<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';

// Check if authenticated
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header("Location: login.php");
    exit;
}

$admin_title = $admin_title ?? 'Admin Suite — LUMÉRA SKIN';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= escape($admin_title) ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="bg-[#F7F5F0] text-stone-900 font-['Plus_Jakarta_Sans',sans-serif] min-h-screen flex flex-col">

<!-- Top Bar -->
<header class="bg-[#1C1917] text-white border-b border-stone-800 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30">
    <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-stone-800 text-[#C5A880] flex items-center justify-center font-bold text-sm">L</div>
        <div>
            <h1 class="text-xs font-bold uppercase tracking-wider text-stone-100">LUMÉRA SKIN <span class="text-[#C5A880] font-normal">| Admin Suite</span></h1>
            <p class="text-[10px] text-stone-400">PHP 8+ / MySQL Engine</p>
        </div>
    </div>
    <div class="flex items-center gap-4 text-xs font-semibold">
        <a href="../index.php" target="_blank" class="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg flex items-center gap-1.5">
            <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i> View Store
        </a>
        <a href="logout.php" class="px-3 py-1.5 bg-red-950 text-red-200 border border-red-800/50 rounded-lg hover:bg-red-900">
            <i class="fa-solid fa-arrow-right-from-bracket"></i> Logout
        </a>
    </div>
</header>

<div class="flex-1 flex flex-col md:flex-row">
    <!-- Sidebar Navigation -->
    <aside class="w-full md:w-60 bg-white border-r border-stone-200 p-4 flex md:flex-col gap-1 overflow-x-auto">
        <a href="index.php" class="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-stone-700 hover:bg-stone-100">
            <i class="fa-solid fa-chart-line w-4"></i> Dashboard
        </a>
        <a href="products.php" class="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-stone-700 hover:bg-stone-100">
            <i class="fa-solid fa-box-open w-4"></i> Formulations
        </a>
        <a href="orders.php" class="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-stone-700 hover:bg-stone-100">
            <i class="fa-solid fa-bag-shopping w-4"></i> Orders
        </a>
        <a href="customers.php" class="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-stone-700 hover:bg-stone-100">
            <i class="fa-solid fa-users w-4"></i> Customers
        </a>
        <a href="messages.php" class="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-stone-700 hover:bg-stone-100">
            <i class="fa-solid fa-envelope w-4"></i> Inquiries
        </a>
        <a href="reports.php" class="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-stone-700 hover:bg-stone-100">
            <i class="fa-solid fa-file-invoice-dollar w-4"></i> Sales Reports
        </a>
        <a href="settings.php" class="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-stone-700 hover:bg-stone-100">
            <i class="fa-solid fa-gear w-4"></i> Settings
        </a>
    </aside>

    <!-- Main Admin Workspace -->
    <main class="flex-1 p-6 lg:p-8 overflow-y-auto">
