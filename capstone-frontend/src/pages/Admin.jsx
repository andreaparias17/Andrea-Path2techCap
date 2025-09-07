import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3500";

export default function Admin() {
  const token = localStorage.getItem("token");
  const [list, setList] = useState([]);
  const [err, setErr] = useState("");
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "T-Shirts",
    imageUrl: "",
    description: "",
    sizes: "S,M,L,XL",
    inStock: true,
  });

  async function load() {
    try {
      const res = await fetch(`${API}/products`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load products");
      setList(data);
    } catch (e) {
      setErr(e.message);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!token) {
      setErr("Please login as admin to upload.");
      return;
    }

    try {
      setUploading(true);
      const fd = new FormData();
      // field name MUST match upload.single('image') in your backend route
      fd.append("image", file);

      const res = await fetch(`${API}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // DO NOT set Content-Type for FormData
        },
        body: fd,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) throw new Error(data.message || "Upload failed");

      setForm((f) => ({ ...f, imageUrl: data.url }));
    } catch (e) {
      setErr(e.message);
    } finally {
      setUploading(false);
    }
  }

  async function onCreate(e) {
    e.preventDefault();
    setErr("");
    if (!token) {
      setErr("Please login as admin to create products.");
      return;
    }

    const priceNum = parseFloat(form.price);
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      setErr("Please enter a valid positive price.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      price: priceNum,
      category: form.category.trim() || "T-Shirts",
      imageUrl: form.imageUrl, // set by upload step
      description: form.description.trim(),
      sizes: form.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      inStock: !!form.inStock,
    };

    try {
      const res = await fetch(`${API}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Create failed");

      // reset form
      setForm({
        name: "",
        price: "",
        category: "T-Shirts",
        imageUrl: "",
        description: "",
        sizes: "S,M,L,XL",
        inStock: true,
      });

      await load();
    } catch (e) {
      setErr(e.message);
    }
  }

  async function onDelete(id) {
    if (!window.confirm("Delete product?")) return;
    if (!token) {
      setErr("Please login as admin to delete products.");
      return;
    }
    try {
      const res = await fetch(`${API}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.message || "Delete failed");
      }
      await load();
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-10">
      {/* Create */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Add Product</h2>
        {err && <p className="text-red-600 mb-2">{err}</p>}

        <form onSubmit={onCreate} className="space-y-3">
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Price"
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            required
          />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Category (e.g., T-Shirts, Hoodies)"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          />
          <textarea
            className="w-full border rounded px-3 py-2"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Sizes (comma separated)"
            value={form.sizes}
            onChange={(e) => setForm((f) => ({ ...f, sizes: e.target.value }))}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) => setForm((f) => ({ ...f, inStock: e.target.checked }))}
            />
            In stock
          </label>

          <div className="space-y-2">
            <label className="block text-sm text-gray-600">Image</label>
            <input type="file" accept="image/*" onChange={onUpload} />
            {uploading && <p className="text-sm">Uploading…</p>}
            {form.imageUrl && (
              <img src={form.imageUrl} alt="preview" className="h-28 rounded border" />
            )}
          </div>

          <button className="px-5 py-3 rounded-full border hover:bg-black hover:text-white transition">
            Create Product
          </button>
        </form>
      </div>

      {/* List */}
      <div>
        <h2 className="text-2xl font-bold mb-4">All Products</h2>
        <div className="space-y-3">
          {list.map((p) => (
            <div key={p._id} className="flex items-center gap-3 border rounded-xl p-3">
              <img
                src={p.imageUrl}
                alt={p.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-gray-500">
                  ${Number(p.price).toFixed(2)} • {p.category}
                </div>
              </div>
              <button onClick={() => onDelete(p._id)} className="text-sm underline">
                Delete
              </button>
            </div>
          ))}
          {list.length === 0 && <p className="text-gray-600">No products yet.</p>}
        </div>
      </div>
    </div>
  );
}
