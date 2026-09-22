# LUMÉRA SKIN - Full Skincare E-Commerce & Admin Panel
> "Pure Care. Visible Glow."

This package provides a **production-ready PHP 8+ and MySQL skincare e-commerce platform** with customer-facing shopping experience and an integrated administrator management dashboard.

---

## 1. Credentials for Testing
- **Admin Panel URL:** `http://localhost/skincare-ecommerce/admin/login.php`
- **Admin Email:** `admin@lumeraskin.com`
- **Admin Password:** `admin123`

---

## 2. Directory Structure
```text
/skincare-ecommerce
│
├── index.php                 # Homepage (Hero, Dynamic New Launches, Reviews, Newsletter)
├── about.php                 # Brand Story, Philosophy, Mission & Sustainability
├── products.php              # Full Catalog with Search, Category & Price Filters, Sorting
├── product-details.php       # Product view with Gallery, Ingredients, How to Use, Related
├── cart.php                  # Shopping Cart with Quantity updates & Coupon (LUMERA10)
├── wishlist.php              # Saved items with Move-to-Cart
├── checkout.php              # Shipping Address & Payment Selection (Online/COD)
├── order-confirmation.php    # Post-purchase receipt with Order & Transaction IDs
├── contact.php               # Contact Form & Location Map (saves to database)
├── login.php                 # Customer login with password_verify()
├── register.php              # Customer registration with password_hash()
├── logout.php                # Session destruction
│
├── config/
│   └── database.php          # PDO database connection & payment credentials
│
├── includes/
│   ├── header.php            # HTML head, luxury fonts & stylesheets
│   ├── navbar.php            # Responsive navbar with Admin link
│   ├── footer.php            # Footer, newsletter subscription & links
│   └── functions.php         # CSRF, XSS escaping, cart calculation, stock decrease
│
├── payment/
│   ├── create-order.php      # Server-side HMAC token & order generation
│   ├── verify-payment.php    # Server-side HMAC signature verification
│   ├── payment-success.php   # Order record insertion & stock reduction
│   └── payment-failed.php    # Payment error handling
│
├── admin/
│   ├── index.php             # Admin router / dashboard redirect
│   ├── login.php             # Secure admin authentication
│   ├── dashboard.php         # 8 Metric cards, Sales & Category charts
│   ├── products.php          # Products list with search, filter, pagination
│   ├── add-product.php       # Add product with image upload & New Launch toggle
│   ├── edit-product.php      # Full product update & stock management
│   ├── delete-product.php    # Secure product deletion
│   ├── orders.php            # Order management & status update
│   ├── order-details.php     # Order view with customer info & items
│   ├── sales.php             # Paid sales list with search & date filters
│   ├── sales-report.php      # Revenue metrics, daily/monthly charts, CSV export
│   ├── customers.php         # Customer directory with lifetime spend
│   ├── contact-messages.php  # Customer contact form submissions with reply
│   ├── settings.php          # Brand settings, payment gateway keys, shipping
│   └── logout.php            # Admin session termination
│
└── database/
    └── database.sql          # Full MySQL database with tables, constraints & seed data
```

---

## 3. Installation Guide (Localhost with XAMPP)

1. **Copy Files to XAMPP:**
   Copy the `skincare-ecommerce` folder into your XAMPP `htdocs` directory:
   `C:/xampp/htdocs/skincare-ecommerce` (Windows) or `/opt/lampp/htdocs/skincare-ecommerce` (Linux).

2. **Start Apache & MySQL:**
   Open the XAMPP Control Panel and start **Apache** and **MySQL**.

3. **Import Database:**
   - Open your browser and navigate to `http://localhost/phpmyadmin`
   - Click **New** and create a database named `lumera_skincare`
   - Select the newly created database, go to the **Import** tab
   - Choose `skincare-ecommerce/database/database.sql` and click **Import**

4. **Verify Database Configuration:**
   Open `skincare-ecommerce/config/database.php` and verify connection parameters:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'root');
   define('DB_PASS', '');
   define('DB_NAME', 'lumera_skincare');
   ```

5. **Open the Store:**
   - Customer Store: `http://localhost/skincare-ecommerce/`
   - Admin Management Panel: `http://localhost/skincare-ecommerce/admin/`

---

## 4. Shared Hosting (Hostinger / cPanel) Deployment
1. Upload all files into `public_html` via File Manager or FTP.
2. In cPanel / hPanel, create a MySQL database and user.
3. Import `database/database.sql` using phpMyAdmin.
4. Update `config/database.php` with your hosting database credentials and domain URL.
5. Ensure `assets/uploads/products/` has write permissions (`755` or `775`).
