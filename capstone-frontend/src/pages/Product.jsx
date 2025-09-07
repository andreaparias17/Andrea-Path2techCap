import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3500";

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);

  // ✅ Fetch the product
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/products/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load product");
        setProduct(data);
        setSelectedSize(data.sizes?.[0] || null); // default first size
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // ✅ Add to cart (separate function, NOT inside useEffect)
  async function addToCart() {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first.");
      return;
    }
    try {
      const res = await fetch(`${API}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // We include size for future use; backend can ignore it for now
        body: JSON.stringify({ productId: product._id, qty: 1, size: selectedSize }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to add to cart");
      // success → go to cart
      window.location.href = "/cart";
    } catch (e) {
      alert(e.message);
    }
  }

  if (loading) return <p>Loading…</p>;
  if (err) return <p className="text-red-600">{err}</p>;
  if (!product) return <p>Not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-96 object-cover rounded-lg mb-6"
      />
      <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
      <p className="text-gray-600 mb-4">{product.description}</p>
      <p className="font-semibold mb-4">${Number(product.price).toFixed(2)}</p>

      {/* Sizes */}
      {product.sizes?.length > 0 && (
        <div className="flex gap-2 mb-6">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-4 py-2 border rounded-full transition ${
                selectedSize === size
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-gray-300 hover:border-black"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      )}

      <button
        disabled={!selectedSize}
        onClick={addToCart}
        className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 disabled:opacity-50"
      >
        Add to Cart
      </button>
    </div>
  );
}
