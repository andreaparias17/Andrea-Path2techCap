import { useEffect, useMemo, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3500";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const token = localStorage.getItem("token");

  async function fetchCart() {
    if (!token) {
      setErr("Please login to view your cart.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load cart");
      const data = await res.json();
      setCart(data);
      setErr("");
    } catch (e) {
      setErr(e.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const items = cart?.items || [];
  const subtotal = useMemo(() => {
    if (!cart?.items) return 0;
    return cart.items.reduce((sum, it) => sum + Number(it.product.price) * it.qty, 0);
  }, [cart]);

  async function updateQty(productId, qty) {
    try {
      if (qty < 1) return;
      const res = await fetch(`${API}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, qty }),
      });
      if (!res.ok) throw new Error("Failed to update cart");
      const data = await res.json();
      setCart(data);
    } catch (e) {
      alert(e.message);
    }
  }

  async function removeItem(productId) {
    try {
      const res = await fetch(`${API}/cart/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to remove item");
      const data = await res.json();
      setCart(data);
    } catch (e) {
      alert(e.message);
    }
  }

  async function checkoutStripe() {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please login first.");
      if (!cart?.items?.length) return;

      const res = await fetch(`${API}/checkout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) throw new Error(data.message || "Checkout failed");

      window.location.href = data.url;
    } catch (e) {
      alert(e.message);
    }
  }

  if (!token) {
    return (
      <div className="max-w-xl">
        <h2 className="text-2xl font-bold mb-2">Cart</h2>
        <p className="text-gray-600">Please login to view your cart.</p>
      </div>
    );
  }

  if (loading) return <p>Loading…</p>;
  if (err) return <p className="text-red-600">{err}</p>;

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {/* Items */}
      <div className="md:col-span-2 space-y-4">
        <h2 className="text-2xl font-bold">Your Cart</h2>

        {items.length === 0 && (
          <p className="text-gray-600 mt-4">Your cart is empty.</p>
        )}

        {items.map((it) => (
          <div
            key={it.product._id || it.product}
            className="flex items-center gap-4 border rounded-xl p-4"
          >
            <img
              src={it.product.imageUrl}
              alt={it.product.name}
              className="w-24 h-24 object-cover rounded"
            />
            <div className="flex-1">
              <div className="font-semibold">{it.product.name}</div>
              <div className="text-sm text-gray-500">
                ${Number(it.product.price).toFixed(2)}
              </div>
            </div>

            {/* qty control */}
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 border rounded"
                onClick={() => updateQty(it.product._id, Math.max(1, it.qty - 1))}
              >
                −
              </button>
              <input
                type="number"
                className="w-16 border rounded px-2 py-1 text-center"
                min={1}
                value={it.qty}
                onChange={(e) =>
                  updateQty(it.product._id, Math.max(1, Number(e.target.value)))
                }
              />
              <button
                className="px-3 py-1 border rounded"
                onClick={() => updateQty(it.product._id, it.qty + 1)}
              >
                +
              </button>
            </div>

            <button
              className="ml-4 text-sm underline"
              onClick={() => removeItem(it.product._id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <aside className="border rounded-xl p-4 h-fit sticky top-24">
        <h3 className="font-semibold mb-3">Order Summary</h3>
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <button
          disabled={items.length === 0}
          onClick={checkoutStripe}
          className={`mt-4 w-full px-5 py-3 rounded-full border transition ${
            items.length === 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-black hover:text-white"
          }`}
        >
          Checkout with Stripe (Test)
        </button>
        <p className="text-xs text-gray-500 mt-2">
          Test mode — redirects to Stripe Checkout.
        </p>
      </aside>
    </div>
  );
}
