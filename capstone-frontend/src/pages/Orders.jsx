import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:3500";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [params] = useSearchParams();
  const token = localStorage.getItem("token");

  useEffect(() => {
    (async () => {
      try {
        if (!token) { setErr("Please login to view orders."); setLoading(false); return; }

        
        if (params.get("success") === "1" && params.get("session_id")) {
          await fetch(`${API}/orders/stripe/success?session_id=${params.get("session_id")}`, {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => {});
        }

        const res = await fetch(`${API}/orders/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error("Failed to load orders");
        setOrders(data);
        setErr("");
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [params, token]);

  if (!token) return <p>Please login to view orders.</p>;
  if (loading) return <p>Loading…</p>;
  if (err) return <p className="text-red-600">{err}</p>;
  if (!orders.length) return <p>No orders yet.</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Orders</h2>
      {orders.map((o) => (
        <div key={o._id} className="border rounded-xl p-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Order #{o._id.slice(-6).toUpperCase()}</span>
            <span>{new Date(o.createdAt).toLocaleString()}</span>
          </div>
          <ul className="mt-3 divide-y">
            {o.items.map((it, i) => (
              <li key={i} className="py-2 flex justify-between text-sm">
                <span>{it.product?.name || "Item"} × {it.qty}</span>
                <span>${(Number(it.price) * it.qty).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 font-semibold flex justify-between">
            <span>Status</span><span className="uppercase">{o.status}</span>
          </div>
          <div className="mt-1 font-semibold flex justify-between">
            <span>Total</span><span>${Number(o.total).toFixed(2)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
