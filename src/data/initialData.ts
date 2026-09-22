import { Product, Customer, Order, ContactMessage, StoreSettings, CustomerReview } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Hydra Glow Face Serum',
    sku: 'LUM-SER-001',
    category: 'Serum',
    shortDescription: 'Deeply hydrating hyaluronic acid and botanical dew elixir for instant plumping and lasting radiance.',
    description: 'A multi-weight Hyaluronic Acid complex infused with botanical extracts to drench thirsty skin in weightless hydration. Penetrates through surface layers to lock in moisture, soothe redness, and restore skin barrier equilibrium with a dewy, non-sticky finish.',
    ingredients: 'Aqua, Sodium Hyaluronate (Multi-Molecular), Niacinamide (5%), Centella Asiatica Extract, Green Tea Leaf Water, Allantoin, Glycerin, Phenoxyethanol.',
    benefits: 'Locks in 72-hour moisture, plumps fine dehydration lines, reinforces lipid barrier, imparts an unmistakable morning glow.',
    howToUse: 'Dispense 3-4 drops onto cleansed, slightly damp face and neck. Gently pat with fingertips until fully absorbed. Follow with moisturizer.',
    originalPrice: 899,
    discountPrice: 699,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1608248597359-00994f38a531?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.9,
    reviewsCount: 128,
    newLaunch: true,
    featured: true,
    status: 1,
    createdAt: '2026-09-01T10:00:00Z'
  },
  {
    id: 2,
    name: 'Vitamin C Brightening Serum',
    sku: 'LUM-SER-002',
    category: 'Serum',
    shortDescription: 'Potent 15% Ethyl Ascorbic Acid with Ferulic Acid to fade hyperpigmentation and reveal luminous skin.',
    description: 'Stabilized Vitamin C formula engineered to neutralize oxidative stress, diminish sun spots, and even tone. Supported by Ferulic Acid and Vitamin E for synergistic protection against environmental pollutants and premature aging.',
    ingredients: 'Water, 3-O-Ethyl Ascorbic Acid (15%), Propanediol, Ferulic Acid (0.5%), Tocopherol (Vitamin E), Citrus Aurantium Dulcis Peel Extract, Sodium Citrate.',
    benefits: 'Visibly fades stubborn dark spots in 14 days, shields from urban smog, boosts natural collagen synthesis, delivers even luminosity.',
    howToUse: 'Apply 3-5 drops in the morning on cleansed skin before moisturizing. Always finish with SPF 50+ sun protection.',
    originalPrice: 999,
    discountPrice: 799,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1608248597359-00994f38a531?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.8,
    reviewsCount: 94,
    newLaunch: true,
    featured: true,
    status: 1,
    createdAt: '2026-09-05T12:30:00Z'
  },
  {
    id: 3,
    name: 'Gentle Foam Cleanser',
    sku: 'LUM-CLN-001',
    category: 'Cleanser',
    shortDescription: 'pH-balanced cloud cleanser with oat milk and chamomile that purifies without stripping delicate moisture.',
    description: 'A soothing, sulfate-free foaming wash that transforms into a dense micro-bubble lather. Effortlessly melts away daily impurities, mineral sunscreen, and sebum while conditioning with soothing colloidal oat and bisabolol.',
    ingredients: 'Aqua, Cocamidopropyl Betaine, Sodium Cocoyl Isethionate, Avena Sativa (Oat) Kernel Extract, Chamomilla Recutita Flower Extract, Panthenol (B5), Citric Acid.',
    benefits: 'Preserves the skin natural pH (5.5), eliminates grime without tightness, calms reactive redness, leaves skin touchably soft.',
    howToUse: 'Pump twice into damp palms. Massage in gentle circular motions across face for 60 seconds. Rinse thoroughly with lukewarm water.',
    originalPrice: 599,
    discountPrice: 499,
    stock: 70,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.7,
    reviewsCount: 110,
    newLaunch: false,
    featured: true,
    status: 1,
    createdAt: '2026-08-15T09:15:00Z'
  },
  {
    id: 4,
    name: 'Daily Hydration Moisturizer',
    sku: 'LUM-MST-001',
    category: 'Moisturizer',
    shortDescription: 'Ceramide-enriched lightweight barrier cream that provides 24-hour velvet cushion comfort.',
    description: 'Formulated with 3 essential biomimetic ceramides, squalane, and nourishing shea butter. This silky emulsion wraps stressed skin in a breathable shield, defending against water loss and reinforcing resilient skin architecture.',
    ingredients: 'Aqua, Glycerin, Caprylic/Capric Triglyceride, Ceramide NP, Ceramide AP, Ceramide EOP, Squalane, Butyrospermum Parkii (Shea) Butter, Phytosphingosine, Carbomer.',
    benefits: 'Rebuilds compromised skin barriers, seals in moisture without pore-clogging heaviness, softens skin texture within 3 days.',
    howToUse: 'Smooth a dime-sized amount over face and neck after serum application. Use morning and night for best barrier support.',
    originalPrice: 749,
    discountPrice: 599,
    stock: 60,
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.9,
    reviewsCount: 142,
    newLaunch: false,
    featured: true,
    status: 1,
    createdAt: '2026-08-20T14:45:00Z'
  },
  {
    id: 5,
    name: 'SPF 50+ Sun Protection Cream',
    sku: 'LUM-SUN-001',
    category: 'Sun Care',
    shortDescription: 'Broad-spectrum PA++++ invisible shield with zero white cast and a skin-like matte velvet finish.',
    description: 'Next-generation hybrid chemical and physical UV filters combined with soothing cica and antioxidant niacinamide. Delivers featherlight, non-greasy protection against UVA, UVB, and digital blue light without stinging eyes or clogging pores.',
    ingredients: 'Water, Ethylhexyl Methoxycinnamate, Zinc Oxide, Niacinamide, Butylene Glycol, Centella Asiatica Extract, Tocopheryl Acetate, Silica, Fragrance-Free Formula.',
    benefits: 'Zero white cast on all skin tones, sweat & water resistant up to 80 minutes, primes skin smoothly under makeup, high photostability.',
    howToUse: 'Apply generously (two finger-lengths) as the final step of your morning skincare ritual 15 minutes before sun exposure. Reapply every 2 hours.',
    originalPrice: 899,
    discountPrice: 749,
    stock: 80,
    image: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.9,
    reviewsCount: 88,
    newLaunch: false,
    featured: true,
    status: 1,
    createdAt: '2026-08-25T11:00:00Z'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 1,
    name: 'Aanya Sharma',
    email: 'aanya.sharma@example.com',
    phone: '+91 98765 43210',
    registeredAt: '2026-08-10',
    totalOrders: 3,
    totalSpending: 2497,
    status: 'Active'
  },
  {
    id: 2,
    name: 'Rohan Mehta',
    email: 'rohan.mehta@example.com',
    phone: '+91 98123 45678',
    registeredAt: '2026-08-18',
    totalOrders: 2,
    totalSpending: 1598,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Priya Iyer',
    email: 'priya.iyer@example.com',
    phone: '+91 98989 12345',
    registeredAt: '2026-09-02',
    totalOrders: 1,
    totalSpending: 699,
    status: 'Active'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'LUM-88410',
    customerId: 1,
    customerName: 'Aanya Sharma',
    customerEmail: 'aanya.sharma@example.com',
    customerPhone: '+91 98765 43210',
    address: 'Flat 402, Lotus Residency, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    items: [
      {
        productId: 1,
        productName: 'Hydra Glow Face Serum',
        productImage: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80',
        price: 699,
        quantity: 1,
        total: 699
      },
      {
        productId: 4,
        productName: 'Daily Hydration Moisturizer',
        productImage: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=400&q=80',
        price: 599,
        quantity: 1,
        total: 599
      }
    ],
    subtotal: 1298,
    discount: 100,
    shipping: 0,
    total: 1198,
    grandTotal: 1198,
    paymentMethod: 'Online',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    transactionId: 'TXN_LUM_99182348',
    createdAt: '2026-09-18T14:20:00Z'
  },
  {
    id: 'LUM-88411',
    customerId: 2,
    customerName: 'Rohan Mehta',
    customerEmail: 'rohan.mehta@example.com',
    customerPhone: '+91 98123 45678',
    address: 'B-14, Greenview Enclave, Sector 62',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '201301',
    items: [
      {
        productId: 2,
        productName: 'Vitamin C Brightening Serum',
        productImage: 'https://images.unsplash.com/photo-1608248597359-00994f38a531?auto=format&fit=crop&w=400&q=80',
        price: 799,
        quantity: 1,
        total: 799
      }
    ],
    subtotal: 799,
    discount: 0,
    shipping: 99,
    total: 898,
    grandTotal: 898,
    paymentMethod: 'Online',
    paymentStatus: 'Paid',
    orderStatus: 'Shipped',
    transactionId: 'TXN_LUM_99214731',
    createdAt: '2026-09-20T09:45:00Z'
  },
  {
    id: 'LUM-88412',
    customerId: 3,
    customerName: 'Priya Iyer',
    customerEmail: 'priya.iyer@example.com',
    customerPhone: '+91 98989 12345',
    address: 'Plot 72, Jubilee Hills Road No 36',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500033',
    items: [
      {
        productId: 1,
        productName: 'Hydra Glow Face Serum',
        productImage: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80',
        price: 699,
        quantity: 1,
        total: 699
      }
    ],
    subtotal: 699,
    discount: 0,
    shipping: 99,
    total: 798,
    grandTotal: 798,
    paymentMethod: 'COD',
    paymentStatus: 'Pending',
    orderStatus: 'Processing',
    transactionId: 'COD_LUM_338190',
    createdAt: '2026-09-21T16:10:00Z'
  }
];

export const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: 1,
    name: 'Sneha Kapoor',
    email: 'sneha.k@gmail.com',
    phone: '+91 97712 34567',
    subject: 'Question on sensitive skin compatibility',
    message: 'Hello LUMÉRA team, can I layer the Vitamin C Serum with the Hydra Glow Serum during my morning routine? My skin tends to flush easily.',
    createdAt: '2026-09-19T11:22:00Z',
    status: 'Replied',
    replyNotes: 'Advised client to apply Vitamin C first, wait 2 mins, then follow with Hydra Glow and SPF.'
  },
  {
    id: 2,
    name: 'Vikram Joshi',
    email: 'vikram.j@outlook.com',
    phone: '+91 98450 67890',
    subject: 'Bulk order for luxury boutique gift hampers',
    message: 'We are curating wellness baskets for a luxury resort launch in Goa next month. Would love to inquire about wholesale order rates for 50 sets.',
    createdAt: '2026-09-21T08:15:00Z',
    status: 'New'
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  brandName: 'LUMÉRA SKIN',
  tagline: 'Pure Care. Visible Glow.',
  currency: '₹',
  shippingFee: 99,
  freeShippingThreshold: 999,
  paymentKey: 'rzp_test_lumera_98124Key',
  paymentSecret: 'sec_lumera_secret_77298Hash',
  paymentMode: 'Test / Sandbox',
  adminEmail: 'admin@lumeraskin.com'
};

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 1,
    name: 'Meera Deshmukh',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: '3 days ago',
    review: 'The Hydra Glow Face Serum is sheer magic! Within 4 days my dull monsoon skin felt revitalized, plump, and dewy without looking oily. The texture is sublime.',
    productName: 'Hydra Glow Face Serum',
    verified: true
  },
  {
    id: 2,
    name: 'Arjun Nambiar',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: '1 week ago',
    review: 'Finally an SPF 50+ that leaves zero white cast on my warm skin tone. Dries down to an elegant velvety finish. Smells subtle and clean.',
    productName: 'SPF 50+ Sun Protection Cream',
    verified: true
  },
  {
    id: 3,
    name: 'Ananya Roy',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: '2 weeks ago',
    review: 'The Gentle Foam Cleanser saved my compromised skin barrier. It takes off long-wear makeup gently and leaves skin calm. Packaging looks stunning on my vanity!',
    productName: 'Gentle Foam Cleanser',
    verified: true
  }
];
