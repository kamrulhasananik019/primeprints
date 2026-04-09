export interface ProductImage {
  url: string;
  alt: string;
  isPrimary?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  images: ProductImage[];
  description: string;
  details?: string;
  specs: Record<string, string>;
  status?: string;
}

export interface Category {
  id: string;
  title: string;
  image: string;
  tag: string;
  description: string;
  accent: string;
  slug: string;
  products: Product[];
}

export const categories: Category[] =
[
  {
    "id": "cat-paper-products",
    "title": "Paper Products",
    "image": "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80",
    "tag": "Print",
    "description": "Essential business and marketing materials printed on high-quality paper stocks.",
    "accent": "#c9a96e",
    "slug": "paper-products",
    "products": [
      { "id": "pp-01", "slug": "banner-pvc-vinyl", "name": "Banner (PVC & Vinyl)", "images": [{ "url": "https://images.unsplash.com/photo-1582133611302-68fd2ff05145?w=600", "alt": "Banner", "isPrimary": true }], "description": "Durable PVC and Vinyl banners.", "specs": { "material": "500gsm PVC", "finish": "Eyelets & Hemmed" }, "status": "latest" },
      { "id": "pp-02", "slug": "business-cards", "name": "Business Cards", "images": [{ "url": "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600", "alt": "Business Cards", "isPrimary": true }], "description": "Premium quality cards.", "specs": { "material": "450gsm Silk", "size": "85x55mm" }, "status": "latest" },
      { "id": "pp-03", "slug": "booklets", "name": "Booklets", "images": [{ "url": "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600", "alt": "Booklets", "isPrimary": true }], "description": "Multi-page booklets.", "specs": { "binding": "Saddle Stitch", "pages": "8-64" }, "status": "Standard" },
      { "id": "pp-04", "slug": "brochures", "name": "Brochures", "images": [{ "url": "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?w=600", "alt": "Brochures", "isPrimary": true }], "description": "Professional brochures.", "specs": { "material": "170gsm Silk", "fold": "Half/Tri-fold" }, "status": "Standard" },
      { "id": "pp-05", "slug": "flyer-printing", "name": "Flyer Printing", "images": [{ "url": "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600", "alt": "Flyers", "isPrimary": true }], "description": "High-speed flyer printing.", "specs": { "material": "130gsm Gloss", "size": "A5/A6" }, "status": "samedayprinting" },
      { "id": "pp-06", "slug": "leaflet-printing", "name": "Leaflet Printing", "images": [{ "url": "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600", "alt": "Leaflets", "isPrimary": true }], "description": "Bulk leaflet distribution prints.", "specs": { "material": "150gsm Silk", "size": "A4/A5" }, "status": "Standard" },
      { "id": "pp-07", "slug": "colour-printing", "name": "Colour Printing", "images": [{ "url": "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=600", "alt": "Colour Printing", "isPrimary": true }], "description": "High-fidelity digital color prints.", "specs": { "quality": "Digital CMYK", "paper": "80-300gsm" }, "status": "Essential" },
      { "id": "pp-08", "slug": "black-white-printing", "name": "Black & White Printing", "images": [{ "url": "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=600", "alt": "B&W Printing", "isPrimary": true }], "description": "Economical mono printing.", "specs": { "quality": "Grayscale", "usage": "Documents" }, "status": "Essential" },
      { "id": "pp-09", "slug": "folded-leaflets", "name": "Folded Leaflets", "images": [{ "url": "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?w=600", "alt": "Folded Leaflets", "isPrimary": true }], "description": "Custom folding options.", "specs": { "fold": "Z-Fold/Gate Fold", "size": "A4 to DL" }, "status": "Standard" },
      { "id": "pp-10", "slug": "menu-printing", "name": "Menu Printing", "images": [{ "url": "https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?w=600", "alt": "Menus", "isPrimary": true }], "description": "Restaurant and takeaway menus.", "specs": { "finish": "Laminated", "material": "350gsm" }, "status": "Popular" },
      { "id": "pp-11", "slug": "posters", "name": "Posters", "images": [{ "url": "https://images.unsplash.com/photo-1583931382172-358051e70402?w=600", "alt": "Posters", "isPrimary": true }], "description": "Indoor poster printing.", "specs": { "size": "A3 to A0", "finish": "Satin" }, "status": "Standard" },
      { "id": "pp-12", "slug": "postcards", "name": "Postcards", "images": [{ "url": "https://images.unsplash.com/photo-1527483377697-8795b1a1d6d2?w=600", "alt": "Postcards", "isPrimary": true }], "description": "Custom marketing postcards.", "specs": { "material": "350gsm Card", "size": "A6" }, "status": "Seasonal" },
      { "id": "pp-13", "slug": "sticker-printing", "name": "Sticker Printing", "images": [{ "url": "https://images.unsplash.com/photo-1589987607627-616cbd5bb225?w=600", "alt": "Stickers", "isPrimary": true }], "description": "All-purpose stickers.", "specs": { "material": "Paper/Vinyl", "cut": "Kiss-cut" }, "status": "latest" },
      { "id": "pp-14", "slug": "vinyl-stickers", "name": "Vinyl Stickers", "images": [{ "url": "https://images.unsplash.com/photo-1589987607627-616cbd5bb225?w=600", "alt": "Vinyl Stickers", "isPrimary": true }], "description": "Waterproof vinyl stickers.", "specs": { "durability": "Outdoor/Waterproof", "finish": "Gloss" }, "status": "Durable" },
      { "id": "pp-15", "slug": "self-adhesive-stickers", "name": "Self-Adhesive Stickers", "images": [{ "url": "https://images.unsplash.com/photo-1589987607627-616cbd5bb225?w=600", "alt": "Adhesive Stickers", "isPrimary": true }], "description": "Easy-peel adhesive labels.", "specs": { "type": "Permanent", "form": "Sheets" }, "status": "Standard" }
    ]
  },
  {
    "id": "cat-binding",
    "title": "Binding & Accessories",
    "image": "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&q=80",
    "tag": "Finishing",
    "description": "Professional document finishing for reports and presentations.",
    "accent": "#2c3e50",
    "slug": "binding-accessories",
    "products": [
      { "id": "ba-01", "slug": "binding-service", "name": "Binding Service", "images": [], "description": "General binding services.", "specs": { "type": "Multi-option" }, "status": "latest" },
      { "id": "ba-02", "slug": "spiral-binding", "name": "Spiral Binding", "images": [], "description": "Plastic coil binding.", "specs": { "rotation": "360 degrees" }, "status": "Popular" },
      { "id": "ba-03", "slug": "wire-binding", "name": "Wire Binding", "images": [], "description": "Professional wire-o binding.", "specs": { "material": "Metal Wire" }, "status": "Corporate" },
      { "id": "ba-04", "slug": "plastic-comb-binding", "name": "Plastic Comb Binding", "images": [], "description": "Classic comb binding.", "specs": { "reusable": "Yes" }, "status": "Standard" },
      { "id": "ba-05", "slug": "saddle-stitch-binding", "name": "Saddle Stitch Binding", "images": [], "description": "Stapled spine binding.", "specs": { "usage": "Booklets" }, "status": "Standard" },
      { "id": "ba-06", "slug": "perfect-binding", "name": "Perfect Binding", "images": [], "description": "Softcover book finish.", "specs": { "spine": "Glued" }, "status": "Premium" },
      { "id": "ba-07", "slug": "glue-binding", "name": "Glue Binding", "images": [], "description": "Padding and glue binding.", "specs": { "type": "Fan-apart" }, "status": "Standard" },
      { "id": "ba-08", "slug": "tape-binding", "name": "Tape Binding", "images": [], "description": "Wrapped spine tape binding.", "specs": { "look": "Clean/Flat" }, "status": "Standard" },
      { "id": "ba-09", "slug": "screw-binding", "name": "Screw Binding", "images": [], "description": "Chicago screw binding.", "specs": { "material": "Brass/Steel" }, "status": "Premium" },
      { "id": "ba-10", "slug": "book-binding", "name": "Book Binding", "images": [], "description": "Hardback and bespoke binding.", "specs": { "type": "Hard/Soft Cover" }, "status": "HighEnd" },
      { "id": "ba-11", "slug": "thesis-binding", "name": "Thesis Binding", "images": [], "description": "University standard binding.", "specs": { "standard": "Academic" }, "status": "StudentDeal" },
      { "id": "ba-12", "slug": "dissertation-binding", "name": "Dissertation Binding", "images": [], "description": "Fast dissertation binding.", "specs": { "turnaround": "Same Day" }, "status": "samedayprinting" },
      { "id": "ba-13", "slug": "business-presentation-binding", "name": "Business Presentation Binding", "images": [], "description": "Elegant presentation sets.", "specs": { "cover": "Acetate/Leatherette" }, "status": "Corporate" }
    ]
  },
  {
    "id": "cat-large-format",
    "title": "Large Format Printing",
    "image": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80",
    "tag": "Signage",
    "description": "High-impact wide format prints.",
    "accent": "#e74c3c",
    "slug": "large-format-printing",
    "products": [
      { "id": "lf-01", "slug": "poster-printing", "name": "Poster Printing", "images": [], "description": "High res posters.", "specs": { "ink": "UV Stable" }, "status": "Standard" },
      { "id": "lf-02", "slug": "a0-printing", "name": "A0 Printing", "images": [], "description": "Giant format A0.", "specs": { "size": "841 x 1189 mm" }, "status": "Large" },
      { "id": "lf-03", "slug": "a1-printing", "name": "A1 Printing", "images": [], "description": "Standard large A1.", "specs": { "size": "594 x 841 mm" }, "status": "Standard" },
      { "id": "lf-04", "slug": "a2-printing", "name": "A2 Printing", "images": [], "description": "Medium large A2.", "specs": { "size": "420 x 594 mm" }, "status": "Standard" },
      { "id": "lf-05", "slug": "a3-printing", "name": "A3 Printing", "images": [], "description": "Small format A3.", "specs": { "size": "297 x 420 mm" }, "status": "Standard" },
      { "id": "lf-06", "slug": "academic-poster-printing", "name": "Academic Poster Printing", "images": [], "description": "Conference posters.", "specs": { "material": "Fabric/Paper" }, "status": "Academic" },
      { "id": "lf-07", "slug": "medical-poster-printing", "name": "Medical Poster Printing", "images": [], "description": "Scientific posters.", "specs": { "detail": "Ultra Fine" }, "status": "Professional" },
      { "id": "lf-08", "slug": "banner-printing", "name": "Banner Printing", "images": [], "description": "Vinyl banner prints.", "specs": { "outdoor": "Yes" }, "status": "latest" },
      { "id": "lf-09", "slug": "outdoor-banner-printing", "name": "Outdoor Banner Printing", "images": [], "description": "Weatherproof banners.", "specs": { "material": "Mesh/Vinyl" }, "status": "HeavyDuty" },
      { "id": "lf-10", "slug": "indoor-banner-printing", "name": "Indoor Banner Printing", "images": [], "description": "Event banners.", "specs": { "material": "Satin Fabric" }, "status": "Event" },
      { "id": "lf-11", "slug": "roller-banner", "name": "Roller Banner / Pull-Up Banner", "images": [], "description": "Portable displays.", "specs": { "case": "Included" }, "status": "TopSeller" },
      { "id": "lf-12", "slug": "foam-board-printing", "name": "Foam Board Printing", "images": [], "description": "Lightweight boards.", "specs": { "thickness": "5mm/10mm" }, "status": "Rigid" },
      { "id": "lf-13", "slug": "foamex-printing", "name": "Foamex Printing", "images": [], "description": "Durable plastic boards.", "specs": { "material": "PVC Foam" }, "status": "Rigid" },
      { "id": "lf-14", "slug": "sticker-printing-large", "name": "Sticker Printing", "images": [], "description": "Large format stickers.", "specs": { "type": "Vinyl" }, "status": "Standard" },
      { "id": "lf-15", "slug": "car-stickers", "name": "Car Stickers", "images": [], "description": "Vehicle decals.", "specs": { "finish": "Weatherproof" }, "status": "Outdoor" },
      { "id": "lf-16", "slug": "information-boards-printing", "name": "Information Boards Printing", "images": [], "description": "Wayfinding signs.", "specs": { "material": "Dibond/Foamex" }, "status": "Signage" },
      { "id": "lf-17", "slug": "plan-printing", "name": "Plan Printing", "images": [], "description": "Architectural plans.", "specs": { "type": "Line Drawing" }, "status": "Professional" },
      { "id": "lf-18", "slug": "pattern-printing", "name": "Pattern Printing", "images": [], "description": "Sewing and design patterns.", "specs": { "paper": "60-80gsm" }, "status": "Custom" },
      { "id": "lf-19", "slug": "wallpaper-printing", "name": "Wallpaper Printing", "images": [], "description": "Custom wall graphics.", "specs": { "paste": "Included/Custom" }, "status": "Decor" },
      { "id": "lf-20", "slug": "sign-printing", "name": "Sign Printing", "images": [], "description": "Business signage.", "specs": { "mount": "Wall/Post" }, "status": "Corporate" },
      { "id": "lf-21", "slug": "point-of-sale-printing", "name": "Point of Sale Printing", "images": [], "description": "Retail POS displays.", "specs": { "type": "Counter/Floor" }, "status": "Retail" }
    ]
  },
  {
    "id": "cat-custom",
    "title": "Custom Product Printing",
    "image": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80",
    "tag": "Personalised",
    "description": "Bespoke printing for every occasion.",
    "accent": "#9b59b6",
    "slug": "custom-product-printing",
    "products": [
      { "id": "cp-01", "slug": "conference-name-badges", "name": "Conference Name Badges Printing", "images": [], "description": "Professional badges.", "specs": { "type": "Clip/Pin" }, "status": "Event" },
      { "id": "cp-02", "slug": "certificate-printing", "name": "Certificate Printing", "images": [], "description": "Award certificates.", "specs": { "paper": "Parchment/Textured" }, "status": "latest" },
      { "id": "cp-03", "slug": "number-plate-printing", "name": "Number Plate Printing", "images": [], "description": "Standard plates.", "specs": { "material": "Acrylic" }, "status": "Auto" },
      { "id": "cp-04", "slug": "invitation-printing", "name": "Invitation Printing", "images": [], "description": "Wedding & Event invites.", "specs": { "envelopes": "Optional" }, "status": "Personal" },
      { "id": "cp-05", "slug": "wedding-table-name-cards", "name": "Wedding Table Name Cards", "images": [], "description": "Elegant place cards.", "specs": { "finish": "Gold Foil/Matte" }, "status": "Wedding" },
      { "id": "cp-06", "slug": "table-plan-printing", "name": "Table Plan Printing", "images": [], "description": "Seating charts.", "specs": { "base": "Foamex" }, "status": "Wedding" },
      { "id": "cp-07", "slug": "photo-printing", "name": "Photo Printing", "images": [], "description": "High gloss photos.", "specs": { "paper": "Photo Gloss" }, "status": "Personal" },
      { "id": "cp-08", "slug": "portfolio-printing", "name": "Portfolio Printing", "images": [], "description": "Design portfolios.", "specs": { "quality": "HD Print" }, "status": "Creative" },
      { "id": "cp-09", "slug": "lanyard-printing", "name": "Lanyard Printing", "images": [], "description": "Custom neck straps.", "specs": { "width": "15mm/20mm" }, "status": "Event" },
      { "id": "cp-10", "slug": "photocopy", "name": "Photocopy", "images": [], "description": "Quick copy services.", "specs": { "color": "B&W/Full" }, "status": "Essential" },
      { "id": "cp-11", "slug": "napkin-printing", "name": "Napkin Printing", "images": [], "description": "Event napkins.", "specs": { "ply": "2-ply/3-ply" }, "status": "Event" },
      { "id": "cp-12", "slug": "pen-printing", "name": "Pen Printing", "images": [], "description": "Promotional pens.", "specs": { "ink": "Black/Blue" }, "status": "Promo" },
      { "id": "cp-13", "slug": "mug-printing", "name": "Mug Printing", "images": [], "description": "Custom ceramic mugs.", "specs": { "dishwasher": "Safe" }, "status": "Gift" },
      { "id": "cp-14", "slug": "canvas-printing", "name": "Canvas Printing", "images": [], "description": "Wall art canvas.", "specs": { "frame": "Wood Stretcher" }, "status": "Decor" },
      { "id": "cp-15", "slug": "bookmark-printing", "name": "Bookmark Printing", "images": [], "description": "Paper/Card bookmarks.", "specs": { "finish": "Laminated" }, "status": "Gift" },
      { "id": "cp-16", "slug": "hanging-labels-printing", "name": "Hanging Labels Printing", "images": [], "description": "Swing tags.", "specs": { "hole": "Punched" }, "status": "Retail" },
      { "id": "cp-17", "slug": "custom-packaging", "name": "Custom Packaging", "images": [], "description": "Branded boxes.", "specs": { "material": "Cardboard" }, "status": "Retail" },
      { "id": "cp-18", "slug": "cd-cover-printing", "name": "CD Cover Printing", "images": [], "description": "Sleeves and inlays.", "specs": { "size": "Standard CD" }, "status": "Standard" },
      { "id": "cp-19", "slug": "greeting-cards-printing", "name": "Greeting Cards Printing", "images": [], "description": "Bespoke cards.", "specs": { "inside": "Printed/Blank" }, "status": "Seasonal" },
      { "id": "cp-20", "slug": "newsletter-printing", "name": "Newsletter Printing", "images": [], "description": "Corporate newsletters.", "specs": { "pages": "Multi" }, "status": "Standard" },
      { "id": "cp-21", "slug": "personalised-notebook-printing", "name": "Personalised Notebook Printing", "images": [], "description": "Branded journals.", "specs": { "cover": "Hard/Soft" }, "status": "Gift" },
      { "id": "cp-22", "slug": "placemat-printing", "name": "Placemat Printing", "images": [], "description": "Dining placemats.", "specs": { "finish": "Wipeable" }, "status": "Hospitality" }
    ]
  },
  {
    "id": "cat-tshirt",
    "title": "T-Shirt / Garment Printing",
    "image": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80",
    "tag": "Apparel",
    "description": "Custom apparel and clothing.",
    "accent": "#27ae60",
    "slug": "garment-printing",
    "products": [
      { "id": "tg-01", "slug": "t-shirt-printing", "name": "T-Shirt Printing", "images": [], "description": "Custom tees.", "specs": { "print": "DTG/Vinyl" }, "status": "latest" },
      { "id": "tg-02", "slug": "hoodie-printing", "name": "Hoodie Printing", "images": [], "description": "Warm custom hoodies.", "specs": { "weight": "Heavyweight" }, "status": "WinterEssential" },
      { "id": "tg-03", "slug": "tote-bag-printing", "name": "Tote Bag Printing", "images": [], "description": "Canvas tote bags.", "specs": { "material": "Eco-Cotton" }, "status": "EcoFriendly" },
      { "id": "tg-04", "slug": "apron-printing", "name": "Apron Printing", "images": [], "description": "Kitchen & Work aprons.", "specs": { "type": "Full length" }, "status": "Hospitality" },
      { "id": "tg-05", "slug": "sweatshirt-printing", "name": "Sweatshirt Printing", "images": [], "description": "Branded sweatshirts.", "specs": { "fit": "Unisex" }, "status": "Standard" },
      { "id": "tg-06", "slug": "cap-printing", "name": "Cap Printing", "images": [], "description": "Embroidered/Printed caps.", "specs": { "style": "Trucker/Baseball" }, "status": "Accessories" },
      { "id": "tg-07", "slug": "hi-vis-printing", "name": "Hi-Vis Printing", "images": [], "description": "Safety wear.", "specs": { "class": "EN ISO 20471" }, "status": "Workwear" },
      { "id": "tg-08", "slug": "running-vest-printing", "name": "Running Vest Printing", "images": [], "description": "Athletic vests.", "specs": { "fabric": "Breathable" }, "status": "Sports" },
      { "id": "tg-09", "slug": "sports-wear-printing", "name": "Sports wear Printing", "images": [], "description": "Team kits.", "specs": { "dryfit": "Yes" }, "status": "Sports" }
    ]
  },
  {
    "id": "cat-exhibition",
    "title": "Show & Exhibition Printing",
    "image": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
    "tag": "Expo",
    "description": "Complete setup for events and trade shows.",
    "accent": "#3498db",
    "slug": "exhibition-printing",
    "products": [
      { "id": "ex-01", "slug": "table-cloth-printing", "name": "Table Cloth Printing", "images": [], "description": "Branded table covers.", "specs": { "material": "Polyester" }, "status": "Event" },
      { "id": "ex-02", "slug": "strut-card-printing", "name": "Strut Card Printing", "images": [], "description": "Counter-top displays.", "specs": { "back": "Rudder" }, "status": "Retail" },
      { "id": "ex-03", "slug": "table-talkers", "name": "Table Talkers", "images": [], "description": "3-sided displays.", "specs": { "fold": "Tri-fold" }, "status": "latest" },
      { "id": "ex-04", "slug": "tent-card-printing", "name": "Tent Card Printing", "images": [], "description": "Folded name cards.", "specs": { "size": "DL/A6" }, "status": "Event" },
      { "id": "ex-05", "slug": "cue-card-printing", "name": "Cue Card Printing", "images": [], "description": "Speaker cards.", "specs": { "finish": "Matte" }, "status": "Speech" },
      { "id": "ex-06", "slug": "flag-printing", "name": "Flag Printing", "images": [], "description": "Feather & Teardrop flags.", "specs": { "height": "2m-5m" }, "status": "Outdoor" },
      { "id": "ex-07", "slug": "wristbands", "name": "Wristbands", "images": [], "description": "Tyvek/Silicone bands.", "specs": { "security": "Yes" }, "status": "Event" }
    ]
  },
  {
    "id": "cat-gifts",
    "title": "Personalised Gifts",
    "image": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80",
    "tag": "Gifts",
    "description": "Photo gifts and personalized keepsakes.",
    "accent": "#f1c40f",
    "slug": "personalised-gifts",
    "products": [
      { "id": "pg-01", "slug": "coasters", "name": "Coasters", "images": [], "description": "Personalized coasters.", "specs": { "base": "Cork/MDF" }, "status": "Gift" },
      { "id": "pg-02", "slug": "aluminium-prints", "name": "Aluminium Prints", "images": [], "description": "Metal photo prints.", "specs": { "material": "Chromaluxe" }, "status": "Premium" },
      { "id": "pg-03", "slug": "magnets", "name": "Magnets", "images": [], "description": "Fridge magnets.", "specs": { "type": "Flexible/Rigid" }, "status": "Souvenir" },
      { "id": "pg-04", "slug": "money-box", "name": "Money Box", "images": [], "description": "Custom piggy banks.", "specs": { "material": "Ceramic" }, "status": "Kids" }
    ]
  }
]

// Get all products from categories
export const getAllProducts = (): Product[] => {
  return categories.flatMap(category => category.products);
};

// Get same-day printing products
export const getSameDayPrinting = (): Product[] => {
  return getAllProducts().filter(product => product.status?.includes('samedayprinting'));
};

// Get seasonal favorite products
export const getSeasonalFavorites = (): Product[] => {
  return getAllProducts().filter(product => product.status?.includes('SeasonalFavorite'));
};

// Get latest products
export const getLatestProducts = (): Product[] => {
  return getAllProducts().filter(product => product.status?.includes('latest'));
};

// Get products with both tags
export const getNewAndSeasonalProducts = (): Product[] => {
  return getAllProducts().filter(product => 
    product.status?.includes('samedayprinting') && product.status?.includes('SeasonalFavorite')
  );
};

// Get products by category
export const getProductsByCategory = (categorySlug: string): Product[] => {
  const category = categories.find(cat => cat.slug === categorySlug);
  return category ? category.products : [];
};

// Get related products (from same category)
export const getRelatedProducts = (productId: string, limit: number = 3): Product[] => {
  const allProducts = getAllProducts();
  const currentProduct = allProducts.find(p => p.id === productId);

  if (!currentProduct) return [];

  // Find the category this product belongs to
  const category = categories.find(cat =>
    cat.products.some(p => p.id === productId)
  );

  if (category) {
    // Return other products from the same category
    return category.products
      .filter(p => p.id !== productId)
      .slice(0, limit);
  }

  return [];
};

// Get primary image for a product
export const getPrimaryImage = (product: Product): string => {
  const primaryImage = product.images.find(img => img.isPrimary);
  return primaryImage ? primaryImage.url : product.images[0]?.url || '';
};