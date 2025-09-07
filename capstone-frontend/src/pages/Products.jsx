import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:3500";

export default function Products() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [params, setParams] = useSearchParams();

  const category = params.get("category") || "All";

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const qs = new URLSearchParams();
        if (category && category !== "All") qs.set("category", category);
        const res = await fetch(`${API}/products${qs.toString() ? `?${qs}` : ""}`);
        if (!res.ok) throw new Error("Failed to load products");
        const data = await res.json();
        setItems(data);
        setErr("");
      } catch (e) {
        setErr(e.message || "Failed to load products");
        setItems([]); 
      } finally {
        setLoading(false);
      }
    })();
  }, [category]);

  
  const baseCats = ["All", "T-Shirts", "Hoodies"];
  const categories = useMemo(() => {
    const set = new Set(baseCats);
    items.forEach(p => p.category && set.add(p.category));
    return Array.from(set);
  }, [items]);

  function setCategory(next) {
    const nextParams = new URLSearchParams(params);
    if (next === "All") nextParams.delete("category");
    else nextParams.set("category", next);
    setParams(nextParams, { replace: true });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Shop</h2>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3 py-1.5 rounded-full border text-sm ${
              (category === c || (c === "All" && category === "All"))
                ? "bg-black text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      
      {loading && <p>Loading…</p>}
      {!loading && err && (
        <p className="text-red-600 mb-6">{err}</p>
      )}

      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(p => (
          <Link
            to={`/products/${p._id}`}
            key={p._id}
            className="border rounded-xl overflow-hidden hover:shadow-sm transition"
          >
            <img src={p.imageUrl} alt={p.name} className="w-full h-60 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-sm text-gray-600">${Number(p.price).toFixed(2)}</p>
              <span className="inline-block mt-2 text-xs text-gray-500">{p.category}</span>
            </div>
          </Link>
        ))}
      </div>

      {!loading && !err && items.length === 0 && (
        <p className="mt-6 text-sm text-gray-500">No products found in “{category}”.</p>
      )}
    </div>
  );
}
