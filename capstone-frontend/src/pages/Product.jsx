import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:3500";

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [p, setP] = useState(null);
  const [qty, setQty] = useState(1);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/products/${id}`);
        if (!res.ok) throw new Error("Failed to load product");
        setP(await res.json());
        setErr("");
      } catch (e) {
        setErr(e.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function addToCart() {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }
    try {
      const res = await fetch(`${API}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: id, qty }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to add to cart");
      // success
      navigate("/cart"); // or toast and stay
    } catch (e) {
      alert(e.message);
    }
  }

  if (loading) return <p>Loading…</p>;
  if (err) return <p className="text-red-600">{err}</p>;
  if (!p) return null;

  return (
    <div className="grid md:grid-cols-2 gap-10">
      <img
        src={p.imageUrl}
        alt={p.name}
        className="w-full aspect-square object-cover rounded-2xl border"
      />

      <div>
        <h1 className="text-3xl font-bold">{p.name}</h1>
        <p className="mt-2 text-xl">${Number(p.price).toFixed(2)}</p>

        {/* Sizes (read-only badges for MVP) */}
        {p.sizes?.length > 0 && (
          <div className="mt-5">
            <label className="block text-sm text-gray-600 mb-1">Size</label>
            <div className="flex gap-2 flex-wrap">
              {p.sizes.map(s => (
                <span key={s} className="px-3 py-1 border rounded-full text-sm">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="mt-5">
          <label className="block text-sm text-gray-600 mb-1">Quantity</label>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={e => setQty(Math.max(1, Number(e.target.value)))}
            className="w-24 border rounded px-3 py-2"
          />
        </div>

        <button
          onClick={addToCart}
          className="mt-6 px-5 py-3 rounded-full border hover:bg-black hover:text-white transition"
        >
          Add to Cart
        </button>

        <p className="mt-6 text-gray-700 leading-relaxed">{p.description}</p>
      </div>
    </div>
  );
}
