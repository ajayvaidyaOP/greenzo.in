export const CATEGORIES = [
  {
    slug: 'indoor-plants',
    name: 'Indoor Plants',
    subtitle: 'Architectural tabletop & living room favourites',
    accentGradient: 'linear-gradient(135deg, #FBF6E9 0%, #F3E5AB 100%)',
    imageUrl: '/images/zamia-green.jpg',
    sortOrder: 1
  },
  {
    slug: 'flowering-plants',
    name: 'Flowering Plants',
    subtitle: 'Year-round indoor spathes & serene blooms',
    accentGradient: 'linear-gradient(135deg, #FDF0ED 0%, #F7CFC8 100%)',
    imageUrl: '/images/peace-lily.jpg',
    sortOrder: 2
  },
  {
    slug: 'air-purifier',
    name: 'Air Purifier Plants',
    subtitle: 'NASA-studied clean air oxygenators',
    accentGradient: 'linear-gradient(135deg, #ECF7F0 0%, #C4E7D0 100%)',
    imageUrl: '/images/snake-plant.jpg',
    sortOrder: 3
  },
  {
    slug: 'low-light',
    name: 'Low Light Plants',
    subtitle: 'Thrives in shaded corners & AC rooms',
    accentGradient: 'linear-gradient(135deg, #EDF4F9 0%, #C9DFF0 100%)',
    imageUrl: '/images/zamia-black.jpg',
    sortOrder: 4
  },
  {
    slug: 'foliage-trailing',
    name: 'Vastu & Pastel Foliage',
    subtitle: 'Prosperity trailing vines & blush leaves',
    accentGradient: 'linear-gradient(135deg, #FBF2F4 0%, #F0D5DC 100%)',
    imageUrl: '/images/syngonium-pink.jpg',
    sortOrder: 5
  }
];

export const HERO_REELS = [
  {
    id: 'reel-sanctuary',
    indexLabel: '01',
    title: '4-Plant Signature Combo',
    subtitle: 'Living Room Self-Watering Studio • ₹999',
    videoUrl: '/videos/hero-sanctuary.mp4',
    posterUrl: '/images/hero-1.jpg',
    badge: 'Most Popular Bundle',
    hotspot: {
      productSlug: 'zamia-green',
      label: 'Zamia Green + Self-Watering Pot',
      priceLabel: '₹269'
    }
  },
  {
    id: 'reel-mist',
    indexLabel: '02',
    title: 'Morning Conservatory Mist',
    subtitle: 'Grown Naturally at Empire Agro, Theur Pune',
    videoUrl: '/videos/hero-mist.mp4',
    posterUrl: '/images/hero-2.jpg',
    badge: 'Nursery Fresh Dispatch',
    hotspot: {
      productSlug: 'monstera-deliciosa',
      label: 'Monstera Swiss Foliage',
      priceLabel: '₹349'
    }
  },
  {
    id: 'reel-workspace',
    indexLabel: '03',
    title: 'Calm Desk Sanctuary',
    subtitle: '14-Day Hydro-Wick Reservoir • Zero Mess',
    videoUrl: '/videos/hero-workspace.mp4',
    posterUrl: '/images/hero-3.jpg',
    badge: 'Work-From-Home Edit',
    hotspot: {
      productSlug: 'snake-plant-laurentii',
      label: 'Laurentii Snake Plant',
      priceLabel: '₹189'
    }
  }
];

export const PRODUCTS = [
  {
    slug: 'zamia-green',
    name: 'Zamia Green (ZZ Plant)',
    botanicalName: 'Zamioculcas zamiifolia',
    categorySlug: 'indoor-plants',
    price: 269,
    maxPrice: 319,
    originalPrice: 349,
    badge: 'Bestseller',
    rating: 4.9,
    reviewCount: 312,
    imageUrl: '/images/zamia-green.jpg',
    gallery: ['/images/zamia-green.jpg', '/images/hero-1.jpg', '/images/hero-2.jpg'],
    shortDescription: 'Sculptural emerald paddle leaves that thrive even if you forget to water for weeks.',
    description:
      'Zamia Green is Pune’s #1 low-maintenance indoor plant featuring naturally glossy, waxy emerald fronds that reflect soft room light. Paired with Greenzo’s signature dual-chamber self-watering pot, its rhizomes draw exact moisture on demand—making overwatering virtually impossible.',
    lightLevel: 'Low to Bright Indirect',
    waterSchedule: 'Refill reservoir every 12–15 days',
    petFriendly: false,
    airPurifying: true,
    potColors: ['Matte Ivory', 'Forest Sage', 'Terracotta Sand', 'Charcoal Matte'],
    features: ['14-day self-watering wick', 'Thrives in AC offices', 'Air-purifying foliage', '7-day healthy plant replacement'],
    inStock: true,
    stockQty: 64,
    isBestseller: true,
    isFeaturedDeal: true,
    bundleEligible: true
  },
  {
    slug: 'zamia-black',
    name: 'Zamia Black (Raven ZZ)',
    botanicalName: 'Zamioculcas zamiifolia ‘Raven’',
    categorySlug: 'low-light',
    price: 269,
    maxPrice: 319,
    originalPrice: 369,
    badge: 'Collector’s Pick',
    rating: 4.9,
    reviewCount: 184,
    imageUrl: '/images/zamia-black.jpg',
    gallery: ['/images/zamia-black.jpg', '/images/hero-1.jpg'],
    shortDescription: 'Rare velvety obsidian-purple foliage contrasted with lime-green fresh shoots.',
    description:
      'A true architectural statement piece. New shoots emerge electric lime green before maturing into dramatic deep espresso-black leaves. Exceptionally tolerant of dim apartment hallways, bedrooms, and minimalist studio desks.',
    lightLevel: 'Low Light to Medium Indirect',
    waterSchedule: 'Refill reservoir every 14 days',
    petFriendly: false,
    airPurifying: true,
    potColors: ['Matte Ivory', 'Terracotta Sand', 'Charcoal Matte'],
    features: ['Rare dark botanical foliage', 'Ultra drought-tolerant', 'Zero leaf-drop guarantee', 'Self-watering pot included'],
    inStock: true,
    stockQty: 38,
    isBestseller: true,
    isFeaturedDeal: false,
    bundleEligible: true
  },
  {
    slug: 'syngonium-white',
    name: 'Syngonium White Butterfly',
    botanicalName: 'Syngonium podophyllum ‘Albovirens’',
    categorySlug: 'air-purifier',
    price: 199,
    maxPrice: 249,
    originalPrice: 259,
    badge: '20% OFF',
    rating: 5.0,
    reviewCount: 229,
    imageUrl: '/images/syngonium-white.jpg',
    gallery: ['/images/syngonium-white.jpg', '/images/hero-1.jpg'],
    shortDescription: 'Frosty ivory-and-mint arrowhead leaves that brighten compact shelves & study tables.',
    description:
      'Known in Feng Shui and Vastu for harmonizing indoor energy, Syngonium White Butterfly unfurls variegated cream leaves etched with forest-green veins. Compact, bushy, and effortless in our capillary self-watering planter.',
    lightLevel: 'Medium Indirect Light',
    waterSchedule: 'Refill reservoir every 8–10 days',
    petFriendly: false,
    airPurifying: true,
    potColors: ['Forest Sage', 'Matte Ivory', 'Terracotta Sand'],
    features: ['High VOC air filtration', 'Compact tabletop silhouette', 'Fast-growing lush crown', 'Eco coco-peat mix'],
    inStock: true,
    stockQty: 52,
    isBestseller: true,
    isFeaturedDeal: false,
    bundleEligible: true
  },
  {
    slug: 'syngonium-pink',
    name: 'Syngonium Pink Neon',
    botanicalName: 'Syngonium podophyllum ‘Neon Robusta’',
    categorySlug: 'foliage-trailing',
    price: 269,
    maxPrice: 319,
    originalPrice: 329,
    badge: 'Trending',
    rating: 4.8,
    reviewCount: 167,
    imageUrl: '/images/syngonium-pink.jpg',
    gallery: ['/images/syngonium-pink.jpg', '/images/hero-1.jpg'],
    shortDescription: 'Warm blush-coral pastel leaves that bring instant softness to neutral interiors.',
    description:
      'Loved by interior stylists across Pune and Mumbai, Syngonium Pink Neon delivers year-round rose-blush color with the resilience of a classic foliage plant. Ideal for gifting, coffee tables, and sunlit bedside corners.',
    lightLevel: 'Bright Indirect Light',
    waterSchedule: 'Refill reservoir every 8–10 days',
    petFriendly: false,
    airPurifying: true,
    potColors: ['Matte Ivory', 'Forest Sage', 'Terracotta Sand'],
    features: ['Year-round pastel pink leaves', 'Gift-ready luxury sleeve', 'Self-watering reservoir', 'Humidity-loving tropical'],
    inStock: true,
    stockQty: 44,
    isBestseller: true,
    isFeaturedDeal: false,
    bundleEligible: true
  },
  {
    slug: 'snake-plant-laurentii',
    name: 'Snake Plant Laurentii',
    botanicalName: 'Dracaena trifasciata ‘Laurentii’',
    categorySlug: 'air-purifier',
    price: 189,
    maxPrice: 229,
    originalPrice: 249,
    badge: 'Bedroom Oxygenator',
    rating: 4.9,
    reviewCount: 418,
    imageUrl: '/images/snake-plant.jpg',
    gallery: ['/images/snake-plant.jpg', '/images/hero-3.jpg'],
    shortDescription: 'Releases oxygen at night—upright tiger-banded sword leaves edged in sunlit gold.',
    description:
      'Unlike most plants, Snake Plant performs CAM photosynthesis—converting CO₂ into fresh oxygen through the night. Virtually indestructible in both dim corners and bright balconies.',
    lightLevel: 'Low Light to Sunny Window',
    waterSchedule: 'Refill reservoir every 15–18 days',
    petFriendly: false,
    airPurifying: true,
    potColors: ['Terracotta Sand', 'Matte Ivory', 'Charcoal Matte'],
    features: ['Nighttime oxygen release', 'NASA Clean Air Study icon', 'Beginner-proof resilience', 'Zero-spill water window'],
    inStock: true,
    stockQty: 85,
    isBestseller: true,
    isFeaturedDeal: false,
    bundleEligible: true
  },
  {
    slug: 'peace-lily-sensation',
    name: 'Peace Lily (Spathiphyllum)',
    botanicalName: 'Spathiphyllum wallisii',
    categorySlug: 'flowering-plants',
    price: 299,
    maxPrice: 349,
    originalPrice: 399,
    badge: 'Indoor Bloomer',
    rating: 4.9,
    reviewCount: 276,
    imageUrl: '/images/peace-lily.jpg',
    gallery: ['/images/peace-lily.jpg', '/images/hero-1.jpg'],
    shortDescription: 'Graceful ivory spathe blooms rising above deep emerald tropical foliage.',
    description:
      'Our nursery-acclimatized Peace Lily arrives budded and ready to bloom indoors even without direct sun. Its self-watering reservoir keeps soil evenly moist so spathes stay crisp and luminous for weeks.',
    lightLevel: 'Low to Medium Indirect',
    waterSchedule: 'Refill reservoir every 7 days',
    petFriendly: false,
    airPurifying: true,
    potColors: ['Matte Ivory', 'Forest Sage', 'Charcoal Matte'],
    features: ['Blooms indoors year-round', 'Filters indoor benzene & spores', 'Bottom-wick hydration', 'Lush multi-crown clump'],
    inStock: true,
    stockQty: 41,
    isBestseller: true,
    isFeaturedDeal: false,
    bundleEligible: true
  },
  {
    slug: 'golden-money-plant',
    name: 'Golden Money Plant',
    botanicalName: 'Epipremnum aureum',
    categorySlug: 'foliage-trailing',
    price: 249,
    maxPrice: 299,
    originalPrice: 299,
    badge: 'Vastu Essential',
    rating: 4.9,
    reviewCount: 354,
    imageUrl: '/images/money-plant.jpg',
    gallery: ['/images/money-plant.jpg', '/images/hero-3.jpg'],
    shortDescription: 'Marbled emerald-and-gold heart leaves symbolizing abundance, calm & clean air.',
    description:
      'Grown lush and dense at our Theur greenhouse with thick, trailing stems and vibrant golden variegation. Style it on bookshelves, work desks, or entryway consoles for effortless cascading greenery.',
    lightLevel: 'Low to Bright Indirect',
    waterSchedule: 'Refill reservoir every 9–11 days',
    petFriendly: false,
    airPurifying: true,
    potColors: ['Forest Sage', 'Matte Ivory', 'Terracotta Sand'],
    features: ['Auspicious Vastu favourite', 'Fast trailing habit', 'Thrives in water or coco-soil', 'Self-watering planter'],
    inStock: true,
    stockQty: 73,
    isBestseller: true,
    isFeaturedDeal: false,
    bundleEligible: true
  },
  {
    slug: 'monstera-deliciosa',
    name: 'Monstera Swiss Studio',
    botanicalName: 'Monstera deliciosa ‘Compacta’',
    categorySlug: 'indoor-plants',
    price: 349,
    maxPrice: 399,
    originalPrice: 449,
    badge: 'Pet Friendly Edit',
    rating: 4.8,
    reviewCount: 142,
    imageUrl: '/images/monstera-deliciosa.jpg',
    gallery: ['/images/monstera-deliciosa.jpg', '/images/hero-3.jpg', '/images/hero-2.jpg'],
    shortDescription: 'Iconic fenestrated tropical leaves sculpted for modern living rooms & studios.',
    description:
      'Hand-selected compact Monstera crowns with naturally split tropical leaves planted in our breathable aroid bark + perlite mix inside a matte self-watering cylinder. Instant Architectural Digest energy.',
    lightLevel: 'Bright Indirect Light',
    waterSchedule: 'Refill reservoir every 10 days',
    petFriendly: true,
    airPurifying: true,
    potColors: ['Charcoal Matte', 'Matte Ivory', 'Forest Sage'],
    features: ['Iconic split-leaf silhouette', 'Chunky breathable aroid mix', 'Statement desk or floor piece', 'Free plant doctor support'],
    inStock: true,
    stockQty: 29,
    isBestseller: true,
    isFeaturedDeal: false,
    bundleEligible: true
  }
];

export const BLOGS = [
  {
    slug: '5-low-light-plants-that-thrive-in-apartments',
    title: '5 Low-Light Plants That Thrive in Indian Apartments',
    category: 'Plant Care',
    readTime: '5 min read',
    excerpt: 'North-facing balcony or AC bedroom? Discover resilient sculptural plants that stay glossy without harsh sunlight.',
    imageUrl: '/images/zamia-black.jpg',
    author: 'Dr. Kavita Kulkarni • Lead Horticulturist, Greenzo Pune',
    publishedAt: '2026-10-12',
    content: [
      'Modern urban apartments in Pune, Mumbai, and Bengaluru often feature deep living rooms, tinted windows, or shaded balconies where direct sunlight barely reaches for an hour a day. Fortunately, understory tropical plants evolved beneath dense rainforest canopies—making them naturally adapted to gentle ambient light.',
      '1. Zamia Green & Raven ZZ: Powered by underground water-storing rhizomes, ZZ plants maintain mirror-like emerald or obsidian leaves even three metres away from a window. Simply let our self-watering indicator drop before refilling.',
      '2. Snake Plant Laurentii: Not only does it tolerate dim hallways, it releases oxygen overnight via CAM photosynthesis—making it our #1 recommendation for master bedrooms.',
      '3. Peace Lily: If you crave indoor blooms without a sunny terrace, Peace Lily rewards medium shade with crisp white spathes and tells you visibly when its reservoir needs a top-up.',
      'Pro Nursery Tip: Wipe dust off broad leaves once every two weeks with a damp microfibre cloth—clean leaves absorb up to 30% more indoor ambient light!'
    ]
  },
  {
    slug: 'self-watering-pots-how-they-work',
    title: 'Self-Watering Pots: The Science Behind 14-Day Carefree Hydration',
    category: 'Hydro-Wick Tech',
    readTime: '4 min read',
    excerpt: 'Overwatering causes 80% of indoor plant loss. Here is how capillary cotton wicks let roots drink at their own pace.',
    imageUrl: '/images/zamia-green.jpg',
    author: 'Rohan Deshpande • Product Design, Greenzo Studio',
    publishedAt: '2026-10-18',
    content: [
      'Nearly four out of five indoor plants struggle not from neglect, but from inconsistent top-watering—flooding roots on Sunday and letting soil turn hydrophobic by Friday.',
      'Every Greenzo planter separates the nutrient-rich coco-perlite root chamber from a lower clean-water reservoir. A braided natural cotton capillary wick draws moisture upward only as the potting mix dries, maintaining optimal root aeration alongside steady hydration.',
      'Travelling for Diwali or a two-week work trip? Top up the lower chamber to the max indicator window before locking your door, and return to perky, thriving foliage with zero saucer spills on wooden furniture.'
    ]
  },
  {
    slug: 'indoor-plants-productivity-and-calm',
    title: 'Biophilic Workspaces: How Desk Greenery Cuts Fatigue by 37%',
    category: 'Wellness',
    readTime: '6 min read',
    excerpt: 'Backed by environmental psychology: why placing three living plants within your sightline sharpens focus and lowers stress.',
    imageUrl: '/images/hero-3.jpg',
    author: 'Meera Joshi • Biophilic Interior Consultant',
    publishedAt: '2026-10-21',
    content: [
      'When our eyes stare at flat backlit screens for eight hours straight, directed attention fatigue sets in rapidly. Soft fractal geometry in living leaves—like the arrowheads of Syngonium Pink or the fenestrations of Monstera—triggers effortless micro-restoration in the visual cortex.',
      'Pair one upright structural plant (Snake Plant or Zamia Green) beside your monitor with a trailing Golden Money Plant on an upper shelf to create layered depth without sacrificing desk space.',
      'Need help styling your home studio or Pune office floor? Book a complimentary 15-minute video consultation with our nursery specialists directly on Greenzo.in.'
    ]
  }
];

export const REVIEWS = [
  {
    customerName: 'Rahul Verma',
    city: 'Mumbai',
    rating: 5,
    comment:
      'Greenzo completely transformed my living room console! Ordered the 4-Plant ₹999 Self-Watering Combo—arrived spotless in breathable eco boxes, zero soil spill, and every plant looks straight out of a magazine.',
    plantPurchased: '4-Plant Self-Watering Combo @ ₹999',
    verified: true,
    avatarInitials: 'RV'
  },
  {
    customerName: 'Amit Sharma',
    city: 'Koregaon Park, Pune',
    rating: 5,
    comment:
      'Same-week delivery from their Theur nursery! The water-level window on the Zamia Green pot is genius for a beginner like me. Three weeks in and two new glossy shoots have already popped up.',
    plantPurchased: 'Zamia Green (ZZ Plant)',
    verified: true,
    avatarInitials: 'AS'
  },
  {
    customerName: 'Mohammad Zubair',
    city: 'Nagpur',
    rating: 5,
    comment:
      'Their free plant consultation helped me pick low-light varieties for my windowless study. Syngonium Pink and Raven ZZ arrived hydrated and healthy even after transit. Easily my go-to plant store!',
    plantPurchased: 'Zamia Black & Syngonium Pink',
    verified: true,
    avatarInitials: 'MZ'
  },
  {
    customerName: 'Sneha Kulkarni',
    city: 'Baner, Pune',
    rating: 5,
    comment:
      'Gifted 12 Peace Lilies and Money Plants in Matte Ivory pots for our studio inauguration. Clients couldn’t stop asking where we sourced them—aesthetic, minimal, and super affordable.',
    plantPurchased: 'Peace Lily Sensation',
    verified: true,
    avatarInitials: 'SK'
  }
];

export const SEED_ORDERS = [
  {
    orderNumber: 'GRZ-2610-4821',
    customerName: 'Aditi Gokhale',
    customerPhone: '+91 98220 44119',
    customerEmail: 'aditi.g@example.com',
    shippingAddress: 'Flat 902, Emerald Bay, Kalyani Nagar',
    city: 'Pune',
    pincode: '411006',
    paymentMethod: 'UPI',
    couponCode: null,
    subtotal: 999,
    discountAmount: 0,
    shippingFee: 0,
    totalAmount: 999,
    status: 'DISPATCHED',
    notes: 'Gift note included',
    items: [
      {
        productName: '4-Plant Self-Watering Sanctuary Box',
        potColor: 'Matte Ivory & Forest Sage',
        potSize: 'Combo of 4 Self-Watering Pots',
        unitPrice: 999,
        quantity: 1,
        isBundle: true,
        bundleItems: ['Zamia Green (ZZ Plant)', 'Snake Plant Laurentii', 'Syngonium Pink Neon', 'Peace Lily (Spathiphyllum)']
      }
    ]
  },
  {
    orderNumber: 'GRZ-2610-4835',
    customerName: 'Vikramjit Patil',
    customerPhone: '+91 97654 11820',
    customerEmail: 'vikram.patil@example.com',
    shippingAddress: 'Bungalow 14, Prabhat Road, Deccan',
    city: 'Pune',
    pincode: '411004',
    paymentMethod: 'COD',
    couponCode: 'GREENZO10',
    subtotal: 618,
    discountAmount: 62,
    shippingFee: 0,
    totalAmount: 556,
    status: 'CONFIRMED',
    notes: 'Morning delivery preferred',
    items: [
      {
        productName: 'Zamia Green (ZZ Plant)',
        potColor: 'Matte Ivory',
        potSize: 'Medium (5 inch Self-Watering)',
        unitPrice: 269,
        quantity: 1,
        isBundle: false,
        bundleItems: null
      },
      {
        productName: 'Monstera Swiss Studio',
        potColor: 'Charcoal Matte',
        potSize: 'Medium (5 inch Self-Watering)',
        unitPrice: 349,
        quantity: 1,
        isBundle: false,
        bundleItems: null
      }
    ]
  }
];

export const SEED_COUPONS = [
  {
    code: 'GREENZO10',
    type: 'percent',
    value: 10,
    minSubtotal: 399,
    label: '10% OFF Nursery Welcome',
    description: 'Flat 10% instant discount on orders above ₹399',
    isActive: true,
    showInBanner: true
  },
  {
    code: 'FIRSTPLANT',
    type: 'flat',
    value: 75,
    minSubtotal: 599,
    label: '₹75 OFF Orders ₹599+',
    description: 'Save ₹75 instantly on your indoor sanctuary cart',
    isActive: true,
    showInBanner: true
  },
  {
    code: 'PUNE50',
    type: 'flat',
    value: 50,
    minSubtotal: 499,
    label: '₹50 OFF Pune Direct',
    description: 'Direct Empire Agro nursery dispatch benefit',
    isActive: true,
    showInBanner: false
  }
];

export const SEED_GALLERY_PHOTOS = [
  {
    imageUrl: '/images/hero-1.jpg',
    caption: 'Travertine Living Console • 4-Plant Sanctuary Combo',
    spanClass: 'lg:col-span-2 lg:row-span-2',
    sortOrder: 1
  },
  {
    imageUrl: '/images/zamia-green.jpg',
    caption: 'Zamia Green in Matte Ivory Self-Watering Planter',
    spanClass: '',
    sortOrder: 2
  },
  {
    imageUrl: '/images/peace-lily.jpg',
    caption: 'Peace Lily Sensation with Bottom Reservoir Notch',
    spanClass: '',
    sortOrder: 3
  },
  {
    imageUrl: '/images/hero-2.jpg',
    caption: 'Morning Mist at Empire Agro Conservatory, Pune',
    spanClass: '',
    sortOrder: 4
  },
  {
    imageUrl: '/images/syngonium-pink.jpg',
    caption: 'Blush Syngonium Pink Neon for Warm Interiors',
    spanClass: '',
    sortOrder: 5
  },
  {
    imageUrl: '/images/hero-3.jpg',
    caption: 'Calm Biophilic Home Studio Setup',
    spanClass: 'lg:col-span-2',
    sortOrder: 6
  }
];

export const DEFAULT_STORE_SETTINGS = {
  announcementText: 'Signature Offer: Buy 4 Plants with Self-Watering Pots @ ₹999',
  heroBadge: 'Empire Agro Nursery • Pune Direct',
  heroSubheading:
    'Transform your living room & workspace into a calm biophilic sanctuary. Every Greenzo plant arrives acclimatized in a dual-chamber 14-day capillary self-watering pot—zero soil spills, zero overwatering.',
  comboBundlePrice: 999,
  comboBundleSize: 4,
  freeShippingThreshold: 499,
  standardShippingFee: 69,
  phone: '+91 8883639639',
  whatsappNumber: '918883639639',
  email: 'Greenzo.pune@gmail.com',
  address: 'Empire Agro, Tar Mala Road, Theur, Haveli, Pune 412110',
  razorpayEnabled: true,
  codEnabled: true,
  razorpayKeyId: '',
  razorpayKeySecret: ''
};

