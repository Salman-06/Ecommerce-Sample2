-- ==========================================================
-- LUMÉRA SKIN - Complete MySQL Database Schema
-- Brand: LUMÉRA SKIN ("Pure Care. Visible Glow.")
-- Database: lumera_skincare
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `lumera_skincare` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `lumera_skincare`;

-- --------------------------------------------------------
-- Table: admins
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'Super Admin',
  `status` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Admin Account (Password: admin123)
-- Hash generated using PHP password_hash('admin123', PASSWORD_BCRYPT)
INSERT INTO `admins` (`id`, `name`, `email`, `password`, `role`, `status`) VALUES
(1, 'LUMÉRA Admin', 'admin@lumeraskin.com', '$2y$10$tM/6eU1PqfB6qLg07yvX2.8uL3B8wR8N8e0y3I5mBqf8p0x4N9GKG', 'Super Admin', 1)
ON DUPLICATE KEY UPDATE `email`=`email`;

-- --------------------------------------------------------
-- Table: categories
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT,
  `status` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `status`) VALUES
(1, 'Serum', 'serum', 'Intensive botanical and clinical treatment serums for radiant skin.', 1),
(2, 'Cleanser', 'cleanser', 'pH-balanced, sulfate-free cleansers that purify without stripping.', 1),
(3, 'Moisturizer', 'moisturizer', 'Barrier-repairing emulsions and velvet hydration balms.', 1),
(4, 'Sun Care', 'sun-care', 'Broad spectrum SPF 50+ broad defense creams with zero white cast.', 1),
(5, 'Face Care', 'face-care', 'Targeted toners, elixirs, and nourishing face care essentials.', 1)
ON DUPLICATE KEY UPDATE `name`=`name`;

-- --------------------------------------------------------
-- Table: products
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category_id` INT NOT NULL,
  `sku` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(255) NOT NULL,
  `short_description` TEXT,
  `description` LONGTEXT,
  `ingredients` TEXT,
  `benefits` TEXT,
  `how_to_use` TEXT,
  `original_price` DECIMAL(10,2) NOT NULL,
  `discount_price` DECIMAL(10,2) NOT NULL,
  `stock` INT NOT NULL DEFAULT 0,
  `image` VARCHAR(255) NOT NULL,
  `additional_images` TEXT,
  `rating` DECIMAL(2,1) DEFAULT 5.0,
  `reviews_count` INT DEFAULT 0,
  `new_launch` TINYINT(1) DEFAULT 0,
  `featured` TINYINT(1) DEFAULT 0,
  `status` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed the 5 Required Skincare Products
INSERT INTO `products` (`id`, `category_id`, `sku`, `name`, `short_description`, `description`, `ingredients`, `benefits`, `how_to_use`, `original_price`, `discount_price`, `stock`, `image`, `rating`, `reviews_count`, `new_launch`, `featured`, `status`) VALUES
(1, 1, 'LUM-SER-001', 'Hydra Glow Face Serum', 'Deeply hydrating hyaluronic acid and botanical dew elixir for instant plumping and lasting radiance.', 'A multi-weight Hyaluronic Acid complex infused with botanical extracts to drench thirsty skin in weightless hydration. Penetrates through surface layers to lock in moisture, soothe redness, and restore skin barrier equilibrium.', 'Aqua, Sodium Hyaluronate (Multi-Molecular), Niacinamide (5%), Centella Asiatica Extract, Green Tea Leaf Water, Allantoin, Glycerin.', 'Locks in 72-hour moisture, plumps fine dehydration lines, reinforces lipid barrier, imparts an unmistakable morning glow.', 'Dispense 3-4 drops onto cleansed, slightly damp face and neck. Gently pat with fingertips until fully absorbed. Follow with moisturizer.', 899.00, 699.00, 50, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80', 4.9, 128, 1, 1, 1),
(2, 1, 'LUM-SER-002', 'Vitamin C Brightening Serum', 'Potent 15% Ethyl Ascorbic Acid with Ferulic Acid to fade hyperpigmentation and reveal luminous skin.', 'Stabilized Vitamin C formula engineered to neutralize oxidative stress, diminish sun spots, and even tone. Supported by Ferulic Acid and Vitamin E for synergistic protection against environmental pollutants and premature aging.', 'Water, 3-O-Ethyl Ascorbic Acid (15%), Propanediol, Ferulic Acid (0.5%), Tocopherol (Vitamin E), Citrus Aurantium Dulcis Peel Extract.', 'Visibly fades stubborn dark spots in 14 days, shields from urban smog, boosts natural collagen synthesis, delivers even luminosity.', 'Apply 3-5 drops in the morning on cleansed skin before moisturizing. Always finish with SPF 50+ sun protection.', 999.00, 799.00, 45, 'https://images.unsplash.com/photo-1608248597359-00994f38a531?auto=format&fit=crop&w=800&q=80', 4.8, 94, 1, 1, 1),
(3, 2, 'LUM-CLN-001', 'Gentle Foam Cleanser', 'pH-balanced cloud cleanser with oat milk and chamomile that purifies without stripping delicate moisture.', 'A soothing, sulfate-free foaming wash that transforms into a dense micro-bubble lather. Effortlessly melts away daily impurities, mineral sunscreen, and sebum while conditioning with soothing colloidal oat and bisabolol.', 'Aqua, Cocamidopropyl Betaine, Sodium Cocoyl Isethionate, Avena Sativa (Oat) Kernel Extract, Chamomilla Recutita Flower Extract, Panthenol (B5).', 'Preserves skin natural pH (5.5), eliminates grime without tightness, calms reactive redness, leaves skin touchably soft.', 'Pump twice into damp palms. Massage in gentle circular motions across face for 60 seconds. Rinse thoroughly with lukewarm water.', 599.00, 499.00, 70, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80', 4.7, 110, 0, 1, 1),
(4, 3, 'LUM-MST-001', 'Daily Hydration Moisturizer', 'Ceramide-enriched lightweight barrier cream that provides 24-hour velvet cushion comfort.', 'Formulated with 3 essential biomimetic ceramides, squalane, and nourishing shea butter. This silky emulsion wraps stressed skin in a breathable shield, defending against water loss and reinforcing resilient skin architecture.', 'Aqua, Glycerin, Caprylic/Capric Triglyceride, Ceramide NP, Ceramide AP, Ceramide EOP, Squalane, Butyrospermum Parkii (Shea) Butter.', 'Rebuilds compromised skin barriers, seals in moisture without pore-clogging heaviness, softens skin texture within 3 days.', 'Smooth a dime-sized amount over face and neck after serum application. Use morning and night for best barrier support.', 749.00, 599.00, 60, 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80', 4.9, 142, 0, 1, 1),
(5, 4, 'LUM-SUN-001', 'SPF 50+ Sun Protection Cream', 'Broad-spectrum PA++++ invisible shield with zero white cast and a skin-like matte velvet finish.', 'Next-generation hybrid chemical and physical UV filters combined with soothing cica and antioxidant niacinamide. Delivers featherlight, non-greasy protection against UVA, UVB, and digital blue light without stinging eyes.', 'Water, Ethylhexyl Methoxycinnamate, Zinc Oxide, Niacinamide, Butylene Glycol, Centella Asiatica Extract, Tocopheryl Acetate, Silica.', 'Zero white cast on all skin tones, sweat & water resistant up to 80 minutes, primes skin smoothly under makeup, high photostability.', 'Apply generously (two finger-lengths) as the final step of your morning skincare ritual 15 minutes before sun exposure. Reapply every 2 hours.', 899.00, 749.00, 80, 'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=800&q=80', 4.9, 88, 0, 1, 1)
ON DUPLICATE KEY UPDATE `name`=`name`;

-- --------------------------------------------------------
-- Table: customers
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `customers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `mobile` VARCHAR(20) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `address` TEXT,
  `city` VARCHAR(100),
  `state` VARCHAR(100),
  `pincode` VARCHAR(20),
  `status` ENUM('Active', 'Inactive') DEFAULT 'Active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `customers` (`id`, `name`, `email`, `mobile`, `password`, `address`, `city`, `state`, `pincode`, `status`) VALUES
(1, 'Aanya Sharma', 'aanya.sharma@example.com', '+91 98765 43210', '$2y$10$eO1d4l3m0oB5rA4p8rO8I.a7V5a7s1y8N1d0u8I5mBqf8p0x4N9GK', 'Flat 402, Lotus Residency, Indiranagar', 'Bengaluru', 'Karnataka', '560038', 'Active'),
(2, 'Rohan Mehta', 'rohan.mehta@example.com', '+91 98123 45678', '$2y$10$eO1d4l3m0oB5rA4p8rO8I.a7V5a7s1y8N1d0u8I5mBqf8p0x4N9GK', 'B-14, Greenview Enclave, Sector 62', 'Noida', 'Uttar Pradesh', '201301', 'Active')
ON DUPLICATE KEY UPDATE `email`=`email`;

-- --------------------------------------------------------
-- Table: cart
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `cart` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_id` INT NULL,
  `session_id` VARCHAR(100) NULL,
  `product_id` INT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: wishlist
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `wishlist` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_wishlist` (`customer_id`, `product_id`),
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: orders
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_number` VARCHAR(50) NOT NULL UNIQUE,
  `customer_id` INT NULL,
  `customer_name` VARCHAR(100) NOT NULL,
  `customer_email` VARCHAR(150) NOT NULL,
  `customer_mobile` VARCHAR(20) NOT NULL,
  `address` TEXT NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  `pincode` VARCHAR(20) NOT NULL,
  `subtotal` DECIMAL(10,2) NOT NULL,
  `discount` DECIMAL(10,2) DEFAULT 0.00,
  `shipping` DECIMAL(10,2) DEFAULT 0.00,
  `grand_total` DECIMAL(10,2) NOT NULL,
  `payment_method` ENUM('Online', 'COD') NOT NULL DEFAULT 'Online',
  `payment_status` ENUM('Paid', 'Pending', 'Failed') DEFAULT 'Pending',
  `order_status` ENUM('Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: order_items
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `product_name` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `quantity` INT NOT NULL,
  `total` DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: payments
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `payments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `payment_id` VARCHAR(100) NOT NULL,
  `transaction_id` VARCHAR(100) NOT NULL,
  `payment_method` VARCHAR(50) NOT NULL,
  `payment_amount` DECIMAL(10,2) NOT NULL,
  `payment_status` VARCHAR(50) NOT NULL,
  `payment_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `raw_response` TEXT,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: contact_messages
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(20),
  `subject` VARCHAR(200) NOT NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('New', 'Read', 'Replied') DEFAULT 'New',
  `reply_notes` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: newsletter_subscribers
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `newsletter_subscribers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `discount_sent` TINYINT(1) DEFAULT 1,
  `subscribed_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sample Initial Orders
INSERT INTO `orders` (`id`, `order_number`, `customer_id`, `customer_name`, `customer_email`, `customer_mobile`, `address`, `city`, `state`, `pincode`, `subtotal`, `discount`, `shipping`, `grand_total`, `payment_method`, `payment_status`, `order_status`, `created_at`) VALUES
(1, 'LUM-88410', 1, 'Aanya Sharma', 'aanya.sharma@example.com', '+91 98765 43210', 'Flat 402, Lotus Residency, Indiranagar', 'Bengaluru', 'Karnataka', '560038', 1298.00, 100.00, 0.00, 1198.00, 'Online', 'Paid', 'Delivered', '2026-09-18 14:20:00'),
(2, 'LUM-88411', 2, 'Rohan Mehta', 'rohan.mehta@example.com', '+91 98123 45678', 'B-14, Greenview Enclave, Sector 62', 'Noida', 'Uttar Pradesh', '201301', 799.00, 0.00, 99.00, 898.00, 'Online', 'Paid', 'Shipped', '2026-09-20 09:45:00')
ON DUPLICATE KEY UPDATE `order_number`=`order_number`;

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `price`, `quantity`, `total`) VALUES
(1, 1, 1, 'Hydra Glow Face Serum', 699.00, 1, 699.00),
(2, 1, 4, 'Daily Hydration Moisturizer', 599.00, 1, 599.00),
(3, 2, 2, 'Vitamin C Brightening Serum', 799.00, 1, 799.00)
ON DUPLICATE KEY UPDATE `product_name`=`product_name`;

INSERT INTO `payments` (`id`, `order_id`, `payment_id`, `transaction_id`, `payment_method`, `payment_amount`, `payment_status`, `payment_date`) VALUES
(1, 1, 'PAY_LUM_99182348', 'TXN_LUM_99182348', 'Online', 1198.00, 'Paid', '2026-09-18 14:21:00'),
(2, 2, 'PAY_LUM_99214731', 'TXN_LUM_99214731', 'Online', 898.00, 'Paid', '2026-09-20 09:46:00')
ON DUPLICATE KEY UPDATE `payment_id`=`payment_id`;

INSERT INTO `contact_messages` (`id`, `name`, `email`, `phone`, `subject`, `message`, `status`, `created_at`) VALUES
(1, 'Sneha Kapoor', 'sneha.k@gmail.com', '+91 97712 34567', 'Question on sensitive skin compatibility', 'Can I layer the Vitamin C Serum with Hydra Glow during morning routine?', 'Replied', '2026-09-19 11:22:00'),
(2, 'Vikram Joshi', 'vikram.j@outlook.com', '+91 98450 67890', 'Bulk order for luxury boutique gift hampers', 'We are curating wellness baskets for a luxury resort launch in Goa.', 'New', '2026-09-21 08:15:00')
ON DUPLICATE KEY UPDATE `name`=`name`;
