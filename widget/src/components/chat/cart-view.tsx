import { useState } from 'react';
import type { Product } from '@/lib/types';
import { TrashIcon } from '@/components/ui/icons';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartViewProps {
  cart: CartItem[];
  primaryColor: string;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onBackToChat: () => void;
}

export function CartView({
  cart,
  primaryColor,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onBackToChat,
}: CartViewProps) {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'payment' | 'success'>('cart');
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [cardNum, setCardNum] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const estTax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + estTax + shipping;

  const handleProcessPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setCheckoutStep('success');
      onClearCart();
    }, 2000);
  };

  if (cart.length === 0 && checkoutStep !== 'success') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-gray-50 dark:bg-zinc-950 animate-leaf-fade-in">
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-zinc-900 flex items-center justify-center text-gray-400 dark:text-zinc-500 mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
          </svg>
        </div>
        <h4 className="text-base font-semibold text-gray-900 dark:text-zinc-100 mb-1">Your cart is empty</h4>
        <p className="text-xs text-gray-500 dark:text-zinc-400 mb-5 max-w-[220px]">
          Add items to your cart by speaking to Leaf or clicking "+" on product suggestions!
        </p>
        <button
          onClick={onBackToChat}
          className="px-4 py-2 text-xs font-semibold text-white rounded-lg shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer"
          style={{ backgroundColor: primaryColor }}
        >
          Return to Chat
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-zinc-950 overflow-hidden animate-leaf-fade-in">
      {checkoutStep === 'success' ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-zinc-900 overflow-y-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 animate-bounce">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h4 className="text-lg font-bold text-gray-900 dark:text-zinc-100 mb-1">Order Placed!</h4>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-3">Simulated payment successful</p>
          <p className="text-xs text-gray-500 dark:text-zinc-400 max-w-[260px] leading-relaxed mb-6">
            Thank you for your order, {name || 'valued customer'}! Your simulated receipt details have been recorded.
          </p>
          <button
            onClick={() => {
              setCheckoutStep('cart');
              onBackToChat();
            }}
            className="px-5 py-2.5 text-xs font-semibold text-white rounded-lg shadow-md hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            style={{ backgroundColor: primaryColor }}
          >
            Continue Chatting
          </button>
        </div>
      ) : (
        <>
          {/* Checkout Steps Header */}
          <div className="bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 px-4 py-2.5 flex items-center justify-between text-xs text-gray-500 dark:text-zinc-400 font-medium">
            <span className={checkoutStep === 'cart' ? 'text-gray-900 dark:text-zinc-100 font-bold' : ''}>1. Cart</span>
            <span className="text-gray-300 dark:text-zinc-700">/</span>
            <span className={checkoutStep === 'shipping' ? 'text-gray-900 dark:text-zinc-100 font-bold' : ''}>2. Shipping</span>
            <span className="text-gray-300 dark:text-zinc-700">/</span>
            <span className={checkoutStep === 'payment' ? 'text-gray-900 dark:text-zinc-100 font-bold' : ''}>3. Payment</span>
          </div>

          {/* Step Contents */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {checkoutStep === 'cart' && (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex gap-3 bg-white dark:bg-zinc-900 p-3 rounded-xl border border-gray-100 dark:border-zinc-800 hover:shadow-sm dark:hover:shadow-none transition-all duration-200">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-14 h-14 object-cover rounded-lg bg-gray-50 dark:bg-zinc-800 animate-leaf-fade-in"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <p className="text-xs font-bold text-gray-900 dark:text-zinc-100 truncate leading-tight">{item.product.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5" style={{ color: primaryColor }}>
                          ${item.product.price.toFixed(2)} each
                        </p>
                      </div>
                      
                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center border border-gray-150 dark:border-zinc-800 rounded-lg overflow-hidden bg-gray-50 dark:bg-zinc-800">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="px-2 py-0.5 text-xs font-bold hover:bg-gray-150 dark:hover:bg-zinc-700 transition-colors text-gray-600 dark:text-zinc-400"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-semibold text-gray-700 dark:text-zinc-300">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="px-2 py-0.5 text-xs font-bold hover:bg-gray-150 dark:hover:bg-zinc-700 transition-colors text-gray-600 dark:text-zinc-400"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-xs font-bold text-gray-800 dark:text-zinc-200 ml-auto">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-gray-400 hover:text-red-500 self-start p-1 transition-colors"
                      aria-label="Remove item"
                    >
                      <TrashIcon size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {checkoutStep === 'shipping' && (
              <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 space-y-3 animate-leaf-slide-up">
                <h5 className="text-xs font-bold text-gray-800 dark:text-zinc-200 uppercase tracking-wide">Shipping Address</h5>
                <div className="space-y-2.5 text-xs">
                  <div>
                    <label className="block text-gray-500 dark:text-zinc-400 mb-1 font-medium">Full Name</label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 dark:border-zinc-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-gray-50/50 dark:bg-zinc-850 text-gray-900 dark:text-zinc-100"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 dark:text-zinc-400 mb-1 font-medium">Email Address</label>
                    <input
                      type="email"
                      className="w-full border border-gray-200 dark:border-zinc-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-gray-50/50 dark:bg-zinc-850 text-gray-900 dark:text-zinc-100"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 dark:text-zinc-400 mb-1 font-medium">Delivery Address</label>
                    <textarea
                      rows={2}
                      className="w-full border border-gray-200 dark:border-zinc-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-gray-50/50 dark:bg-zinc-850 text-gray-900 dark:text-zinc-100 resize-none"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 Shopping St, Mall City"
                    />
                  </div>
                </div>
              </div>
            )}

            {checkoutStep === 'payment' && (
              <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 space-y-3 animate-leaf-slide-up">
                <h5 className="text-xs font-bold text-gray-800 dark:text-zinc-200 uppercase tracking-wide">Payment details</h5>
                <div className="space-y-2.5 text-xs">
                  <div>
                    <label className="block text-gray-500 dark:text-zinc-400 mb-1 font-medium">Card Number (Simulated)</label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 dark:border-zinc-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-gray-50/50 dark:bg-zinc-850 text-gray-900 dark:text-zinc-100"
                      value={cardNum}
                      onChange={(e) => setCardNum(e.target.value.replace(/\D/g, '').slice(0, 16))}
                      placeholder="4111 2222 3333 4444"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-gray-500 dark:text-zinc-400 mb-1 font-medium">Expiry</label>
                      <input
                        type="text"
                        maxLength={5}
                        className="w-full border border-gray-200 dark:border-zinc-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-gray-50/50 dark:bg-zinc-850 text-gray-900 dark:text-zinc-100"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 dark:text-zinc-400 mb-1 font-medium">CVV</label>
                      <input
                        type="text"
                        maxLength={3}
                        className="w-full border border-gray-200 dark:border-zinc-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-gray-50/50 dark:bg-zinc-850 text-gray-900 dark:text-zinc-100"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Price Calculations */}
            <div className="bg-white dark:bg-zinc-900 p-3 rounded-xl border border-gray-100 dark:border-zinc-800 space-y-2 text-xs text-gray-600 dark:text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold text-gray-800 dark:text-zinc-200">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Simulated Tax (8%):</span>
                <span className="font-semibold text-gray-800 dark:text-zinc-200">${estTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="font-semibold text-gray-800 dark:text-zinc-200">
                  {shipping === 0 ? <span className="text-emerald-600 dark:text-emerald-400 font-bold">Free</span> : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="border-t border-gray-100 dark:border-zinc-800 pt-2 flex justify-between font-bold text-sm text-gray-900 dark:text-zinc-100">
                <span>Total:</span>
                <span style={{ color: primaryColor }}>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="p-3 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 flex gap-2">
            {checkoutStep === 'cart' && (
              <>
                <button
                  onClick={onBackToChat}
                  className="flex-1 py-2 text-xs font-semibold text-gray-600 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  Keep Shopping
                </button>
                <button
                  onClick={() => setCheckoutStep('shipping')}
                  className="flex-1 py-2 text-xs font-semibold text-white rounded-lg hover:opacity-90 transition-all cursor-pointer shadow-sm"
                  style={{ backgroundColor: primaryColor }}
                >
                  Checkout
                </button>
              </>
            )}

            {checkoutStep === 'shipping' && (
              <>
                <button
                  onClick={() => setCheckoutStep('cart')}
                  className="flex-1 py-2 text-xs font-semibold text-gray-600 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={() => setCheckoutStep('payment')}
                  disabled={!name || !email || !address}
                  className="flex-1 py-2 text-xs font-semibold text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
                  style={{ backgroundColor: primaryColor }}
                >
                  Continue to Payment
                </button>
              </>
            )}

            {checkoutStep === 'payment' && (
              <>
                <button
                  onClick={() => setCheckoutStep('shipping')}
                  className="flex-1 py-2 text-xs font-semibold text-gray-600 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={handleProcessPayment}
                  disabled={isProcessing || !cardNum}
                  className="flex-1 py-2 text-xs font-semibold text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/10"
                  style={{ backgroundColor: primaryColor }}
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Paying...
                    </>
                  ) : (
                    `Pay $${total.toFixed(2)}`
                  )}
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
