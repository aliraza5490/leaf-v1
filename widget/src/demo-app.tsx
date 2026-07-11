import { useEffect, useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { LeafWidget } from './widget';
import './styles/widget.css';

// --- Inline SVGs to avoid extra dependencies ---
const ShoppingBagIcon = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const TrashIcon = ({ className = "h-4 w-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const XIcon = ({ className = "h-4 w-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const MinusIcon = ({ className = "h-3 w-3" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
  </svg>
);

const PlusIcon = ({ className = "h-3 w-3" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const CheckIcon = ({ className = "h-4 w-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

// --- Real Mock Products matching Fakestore API with reliable Unsplash placeholders ---
const FAKESTORE_PRODUCTS = [
  {
    id: "1",
    name: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
    description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday essentials in the main compartment.",
    price: 109.95,
    category: "Men's clothing",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80",
    stock: 25
  },
  {
    id: "2",
    name: "Mens Casual Premium Slim Fit T-Shirts",
    description: "Slim-fit style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing.",
    price: 22.3,
    category: "Men's clothing",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=80",
    stock: 120
  },
  {
    id: "3",
    name: "Mens Cotton Jacket",
    description: "Great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors.",
    price: 55.99,
    category: "Men's clothing",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=80",
    stock: 45
  },
  {
    id: "4",
    name: "Mens Casual Slim Fit",
    description: "The color could be slightly different between on the screen and in practice. Please note that body builds vary by person, therefore, detailed size information should be reviewed.",
    price: 15.99,
    category: "Men's clothing",
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&auto=format&fit=crop&q=80",
    stock: 80
  },
  {
    id: "5",
    name: "John Hardy Women's Legends Naga Gold & Silver Dragon Bracelet",
    description: "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl. Wear facing inward to be bestowed with love and abundance.",
    price: 695.0,
    category: "Jewelery",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&auto=format&fit=crop&q=80",
    stock: 15
  },
  {
    id: "6",
    name: "Solid Gold Petite Micropave",
    description: "Satisfaction Guaranteed. Return or exchange any order within 30 days. Designed and handcrafted in the USA.",
    price: 168.0,
    category: "Jewelery",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=80",
    stock: 35
  },
  {
    id: "7",
    name: "White Gold Plated Princess",
    description: "Classic Created Wedding Engagement Ring for Women. Gift box included, ideal for Valentine's Day, Anniversary, Wedding, or Birthday.",
    price: 9.99,
    category: "Jewelery",
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=500&auto=format&fit=crop&q=80",
    stock: 90
  },
  {
    id: "8",
    name: "Pierced Owl Rose Gold Plated Stainless Steel Double",
    description: "Rose Gold Plated Double Flared Tunnel Plug Ear Stretcher Piercing Jewelry. Available in multiple gauge sizes.",
    price: 10.99,
    category: "Jewelery",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=80",
    stock: 65
  },
  {
    id: "9",
    name: "WD 2TB Elements Portable External Hard Drive",
    description: "USB 3.0 and USB 2.0 Compatibility, Fast data transfers, Improve PC Performance, High Capacity; Compatibility Formatted NTFS for Windows 10, Windows 8.1, Windows 7.",
    price: 64.0,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=500&auto=format&fit=crop&q=80",
    stock: 50
  },
  {
    id: "10",
    name: "SanDisk SSD PLUS 1TB Internal SSD - SATA III",
    description: "Easy upgrade for faster boot up, shutdown, application load and response. Boosts burst write performance, making it ideal for typical PC workloads.",
    price: 109.0,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80",
    stock: 30
  },
  {
    id: "11",
    name: "BIYLACLESEN Women's 3-in-1 Snowboard Jacket",
    description: "Note: The jacket is standard US size, please choose size as your usual wear. Material: 100% Polyester; Detachable fleece inner jacket.",
    price: 56.99,
    category: "Women's Clothing",
    image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=500&auto=format&fit=crop&q=80",
    stock: 40
  },
  {
    id: "12",
    name: "Lock and Love Women's Removable Hooded Jacket",
    description: "100% POLYURETHANE (shell) 100% POLYESTER (lining). Faux leather material for style and comfort. Hand wash cold / Hang dry.",
    price: 29.95,
    category: "Women's Clothing",
    image: "https://images.unsplash.com/photo-1508427953056-b00b8d78ef65?w=500&auto=format&fit=crop&q=80",
    stock: 55
  }
];

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export function DemoApp() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 1. Load products on mount
  useEffect(() => {
    async function loadStoreProducts() {
      const token = localStorage.getItem('access_token');
      let loadedProducts: Product[] = [];

      if (token) {
        try {
          const productsRes = await fetch('http://localhost:8000/api/v1/products/?page_size=50', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (productsRes.ok) {
            const data = await productsRes.json();
            if (data && data.products && data.products.length > 0) {
              loadedProducts = data.products.map((p: any) => ({
                id: String(p.id),
                name: p.name,
                description: p.description || "",
                price: Number(p.price || 0),
                category: p.category || "General",
                image: p.images?.[0] || "",
                stock: Number(p.stock || 0)
              }));
            }
          }
        } catch (e) {
          console.error("Failed to load store products. Falling back to mock data.", e);
        }
      }

      setProducts(loadedProducts.length > 0 ? loadedProducts : FAKESTORE_PRODUCTS);
      setLoading(false);
    }

    loadStoreProducts();
  }, []);

  // 2. Computed values
  const categories = useMemo(() => {
    return ["All", "Electronics", "Jewelery", "Men's clothings", "Women's Clothing"];
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());

      if (selectedCategory === "All") return matchesSearch;

      const normalizedSelected = selectedCategory.toLowerCase().replace(/s$/, ""); 
      const normalizedProductCat = p.category.toLowerCase().replace(/s$/, "");
      
      return matchesSearch && normalizedProductCat.includes(normalizedSelected);
    });
  }, [products, searchQuery, selectedCategory]);

  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [cart]);

  // 3. Cart Actions
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

    setToastMessage(`Added "${product.name}" to cart`);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const updateQuantity = (productId: string, amount: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + amount;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // 4. Leaf Widget configuration (using Dark Slate color `#1e293b`)
  const widgetConfig = useMemo(() => {
    if (products.length === 0) return null;
    return {
      storeId: 1,
      apiUrl: "http://localhost:8000",
      position: "bottom-right" as const,
      theme: "light" as const,
      primaryColor: "#1e293b",
      storeName: "Shopi",
      greeting: `Welcome! I'm Leaf, your AI assistant for Shopi. Ask me anything about our products!`,
      placeholder: "Ask me about products...",
      showBranding: true,
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        description: p.description
      }))
    };
  }, [products]);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-24 transition-colors duration-300">
      
      {/* Header */}
      <header className="w-full bg-white border-b border-slate-100">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8">
          
          {/* Logo */}
          <div className="flex items-center">
            <span className="font-bold text-2xl tracking-tight text-black">Shopi</span>
          </div>

          {/* Categories Nav */}
          <nav className="flex items-center gap-6 sm:gap-8">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[14px] font-medium transition-all relative py-1 ${
                    isActive
                      ? "text-black after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-black"
                      : "text-slate-500 hover:text-black"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </nav>

          {/* Sign In & Cart Bag */}
          <div className="flex items-center gap-6">
            <button className="text-[14px] font-medium text-slate-700 hover:text-black transition-colors">
              Sign in
            </button>
            
            {/* Bag Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center h-10 w-10 text-slate-800 hover:text-black transition-all"
            >
              <svg className="h-6 w-6 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="absolute top-[17px] text-[10px] font-bold text-white bg-black rounded-full h-4 w-4 flex items-center justify-center">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-6 sm:px-8 pt-10">
        
        {/* Page Title */}
        <div className="text-center my-6">
          <h1 className="text-[26px] font-medium text-black">Exclusive Products</h1>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto my-8">
          <input
            type="text"
            placeholder="Search a product"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 text-[15px] text-slate-800 border border-slate-800 rounded-lg focus:outline-none focus:ring-0 focus:border-slate-800 placeholder-slate-400 font-light"
          />
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="h-8 w-8 text-black animate-spin border-4 border-slate-200 border-t-black rounded-full"></div>
            <p className="text-slate-500 text-sm">Loading catalog...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <h3 className="font-semibold text-lg">No products found</h3>
            <p className="text-slate-500 text-sm max-w-sm mt-1">Try adjusting your search query or changing filters.</p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
              className="text-black text-sm mt-2 font-medium hover:underline"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
            {filteredProducts.map((product) => {
              const isOutOfStock = product.stock === 0;

              return (
                <div key={product.id} className="flex flex-col relative group">
                  
                  {/* Image container - Styled to make images cover the container entirely */}
                  <div className="relative aspect-square w-full bg-[#f6f6f6] rounded-xl overflow-hidden flex items-center justify-center border border-slate-100/50 hover:shadow-xs transition-shadow">
                    
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    ) : (
                      <ShoppingBagIcon className="h-12 w-12 text-slate-300" />
                    )}

                    {/* Bottom-left Category Badge */}
                    <span className="absolute bottom-4 left-4 bg-white/70 backdrop-blur-xs text-[11px] px-3 py-1 rounded-full text-slate-800 border border-slate-200 font-medium">
                      {product.category.toLowerCase()}
                    </span>

                    {/* Top-right add button '+' circle */}
                    <button
                      onClick={() => addToCart(product)}
                      disabled={isOutOfStock}
                      className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white hover:bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-650 hover:text-black font-semibold text-lg transition-transform active:scale-95 shadow-xs disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>

                  {/* Title & Price on same line */}
                  <div className="flex justify-between items-start mt-3 gap-4">
                    <h3 className="font-normal text-[13.5px] leading-tight text-slate-800 line-clamp-2 flex-1">
                      {product.name}
                    </h3>
                    <span className="font-semibold text-slate-900 text-[14.5px] shrink-0">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Cart Drawer Modal */}
      {isCartOpen && (
        <>
          <div
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
          ></div>
          <div className="fixed top-0 right-0 bottom-0 z-50 w-full sm:max-w-md bg-white border-l border-slate-200 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col h-full">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <ShoppingBagIcon className="h-5 w-5 text-black" />
                <span>Your Cart</span>
              </h3>
              <button
                onClick={() => setIsCartOpen(false)}
                className="h-8 w-8 hover:bg-slate-100 rounded-full flex items-center justify-center transition-colors"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <ShoppingBagIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Your cart is empty</p>
                    <p className="text-xs text-slate-500 mt-1">Add items to get started.</p>
                  </div>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="flex gap-4 p-3 rounded-lg border border-slate-100 bg-[#f6f6f6]/50">
                    <div className="h-16 w-16 rounded bg-white p-2 border border-slate-100 flex-shrink-0 flex items-center justify-center relative">
                      {item.product.image ? (
                        <img src={item.product.image} alt={item.product.name} className="max-h-full max-w-full object-contain" />
                      ) : (
                        <ShoppingBagIcon className="h-8 w-8 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs truncate text-slate-800">{item.product.name}</p>
                      <p className="text-xs text-slate-900 font-semibold mt-0.5">${item.product.price.toFixed(2)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="h-6 w-6 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors"
                        >
                          <MinusIcon className="h-2 w-2" />
                        </button>
                        <span className="text-xs font-semibold w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="h-6 w-6 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors"
                        >
                          <PlusIcon className="h-2 w-2" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="h-8 w-8 text-slate-400 hover:text-rose-500 rounded flex items-center justify-center hover:bg-rose-50 transition-colors self-start"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-5 border-t border-slate-100 space-y-4 bg-slate-50">
              <div className="flex justify-between items-center font-semibold text-lg text-slate-800">
                <span>Total Amount:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <button className="w-full bg-black hover:bg-slate-800 text-white rounded-lg py-3 font-semibold transition-colors shadow-sm">
                Proceed to Checkout
              </button>
              <p className="text-[10px] text-center text-slate-400">Mock checkout simulation.</p>
            </div>
          </div>
        </>
      )}

      {/* Toast notifications */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-800 text-sm font-medium animate-bounce">
          <div className="h-5 w-5 bg-emerald-500 rounded-full flex items-center justify-center text-white">
            <CheckIcon className="h-3 w-3" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Renders Chat Widget Component directly */}
      {widgetConfig && <LeafWidget config={widgetConfig} />}
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<DemoApp />);
}
