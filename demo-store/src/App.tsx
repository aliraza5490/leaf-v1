import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProductSlider } from './components/ProductSlider';
import type { Product } from './components/ProductCard';

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'Nike Windrunner',
    category: 'Men',
    price: 1899,
    image: '/nike_windrunner.png',
  },
  {
    id: 2,
    title: "Nike Air Force 1 '07",
    category: 'Teens',
    price: 799,
    image: '/nike_air_force.png',
  },
  {
    id: 3,
    title: 'Nike Air VaporMax 2023 Flyknit',
    category: 'Men',
    price: 1499,
    image: '/nike_vapormax.png',
  },
  {
    id: 4,
    title: 'Nike Tech Fleece Hoodie',
    category: 'Women',
    price: 2199,
    image: '/nike_hoodie_pink.png',
  },
  {
    id: 5,
    title: 'Nike Dunk Low Retro',
    category: 'Teens',
    price: 1099,
    image: '/nike_dunk_green.png',
  },
];

interface CartItem {
  product: Product;
  quantity: number;
}

function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Monitor scroll for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter products based on category selected in header
  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    if (activeCategory === 'all') return true;
    return product.category.toLowerCase() === activeCategory.toLowerCase();
  });

  const handleAddToCart = (product: Product) => {
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
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleUpdateQuantity = (productId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleAskAI = (query: string) => {
    // Try to find the real Leaf chat bubble and click it to open
    const bubble = document.querySelector('button[aria-label="Open chat"]') as HTMLButtonElement | null;
    if (bubble) {
      bubble.click();
    }

    if (query.trim()) {
      // Wait for chat window/input to mount, then set value and submit
      setTimeout(() => {
        const input = document.querySelector('form input[placeholder*="message"]') as HTMLInputElement | null;
        if (input) {
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
          if (nativeInputValueSetter) {
            nativeInputValueSetter.call(input, query);
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }

          const form = input.closest('form');
          if (form) {
            form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
          }
        }
      }, 300);
    }
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-slate-50/50 pb-20">
      {/* Header */}
      <Header
        cartCount={cartCount}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        onAskAI={handleAskAI}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Content Area */}
      <main className="relative py-8">
        <ProductSlider
          products={filteredProducts}
          onAddToCart={handleAddToCart}
          onSelectProduct={(p) => setSelectedProduct(p)}
        />
      </main>

      {/* Footer / Copyright block */}
      <footer className="mx-auto max-w-7xl px-6 py-8 text-center text-xs font-medium text-slate-400 border-t border-slate-100">
        <p>© 2026 shopi - Leaf AI-Powered Store. All rights reserved.</p>
      </footer>

      {/* Back to Top Floating Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-[88px] right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-lg hover:bg-slate-900 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          aria-label="Scroll to top"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7 7 7M12 3v18" />
          </svg>
        </button>
      )}

      {/* Shopping Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs">
          <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
            <div className="w-screen max-w-md transform bg-white shadow-2xl transition-all">
              <div className="flex h-full flex-col overflow-y-scroll py-6">
                {/* Cart Header */}
                <div className="px-6 flex items-center justify-between border-b border-slate-100 pb-5">
                  <h3 className="font-heading text-lg font-bold text-slate-800">Shopping Cart</h3>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Cart Body */}
                <div className="flex-1 px-6 py-4">
                  {cart.length === 0 ? (
                    <div className="flex h-64 flex-col items-center justify-center gap-3 text-slate-400 font-medium">
                      <svg className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Your cart is empty
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.product.id} className="flex items-center gap-4 rounded-xl border border-slate-100 p-3 bg-white shadow-xs">
                          <img
                            src={item.product.image}
                            alt={item.product.title}
                            className="h-16 w-16 rounded-lg object-cover bg-slate-50"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="truncate text-sm font-bold text-slate-800">{item.product.title}</h4>
                            <p className="text-xs text-slate-400 font-semibold">{item.product.category}</p>
                            <span className="text-sm font-bold text-slate-900">₹{item.product.price}</span>
                          </div>
                          {/* Quantity Controls */}
                          <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1 bg-slate-50">
                              <button
                                onClick={() => handleUpdateQuantity(item.product.id, -1)}
                                className="h-6 w-6 text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                              >
                                -
                              </button>
                              <span className="text-xs font-bold text-slate-700 w-4 text-center">{item.quantity}</span>
                              <button
                                onClick={() => handleUpdateQuantity(item.product.id, 1)}
                                className="h-6 w-6 text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => handleRemoveFromCart(item.product.id)}
                              className="text-xs text-red-500 hover:text-red-700 font-bold transition-colors cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cart Footer */}
                {cart.length > 0 && (
                  <div className="border-t border-slate-100 px-6 pt-5 bg-slate-50/50">
                    <div className="flex items-center justify-between text-base font-bold text-slate-900 mb-4">
                      <span>Total Amount:</span>
                      <span>₹{cartTotal}</span>
                    </div>
                    <button
                      onClick={() => alert("Checkout process simulation! Thank you for testing the shopi Leaf Demo.")}
                      className="w-full rounded-xl bg-[#008060] py-3 text-center text-sm font-bold text-white shadow-md hover:bg-[#006e52] active:scale-98 transition-all cursor-pointer"
                    >
                      Checkout Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Details Modal (Quick View) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl transition-all flex flex-col md:flex-row">
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 rounded-full bg-white/80 p-2 text-slate-400 hover:bg-white hover:text-slate-700 shadow-sm cursor-pointer"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Left Image Column */}
            <div className="w-full md:w-1/2 bg-[#eaeaec] p-6 flex items-center justify-center">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                className="max-h-[300px] md:max-h-full w-full object-cover rounded-2xl shadow-sm"
              />
            </div>

            {/* Right Details Column */}
            <div className="w-full md:w-1/2 p-8 flex flex-col justify-between">
              <div>
                <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 mb-3">
                  {selectedProduct.category}
                </span>
                <h3 className="font-heading text-2xl font-extrabold text-slate-800 mb-2">
                  {selectedProduct.title}
                </h3>
                <span className="text-xl font-bold text-slate-900">
                  ₹{selectedProduct.price}
                </span>

                <p className="mt-4 text-sm text-slate-500 leading-relaxed font-medium">
                  Experience ultimate style and next-level comfort with this authentic design. Perfect for athletic activities, casual wear, or stepping up your lifestyle fashion game.
                </p>

                {/* Mock Sizes Choice */}
                <div className="mt-6">
                  <span className="text-xs font-bold text-slate-400 tracking-wider">SELECT SIZE</span>
                  <div className="flex gap-2.5 mt-2">
                    {['S', 'M', 'L', 'XL'].map((s) => (
                      <button
                        key={s}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:border-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => {
                    handleAddToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="flex-1 rounded-xl bg-slate-900 py-3 text-center text-sm font-bold text-white shadow-md hover:bg-slate-950 transition-colors cursor-pointer"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
