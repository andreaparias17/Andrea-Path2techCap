import { useState } from "react";
const API = import.meta.env.VITE_API_URL || "http://localhost:3500";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.token) throw new Error(data.message || "Login failed");
      localStorage.setItem("token", data.token);
      localStorage.setItem("me", JSON.stringify(data.user));
      window.location.href = "/"; // go home
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="max-w-sm mx-auto">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {err && <p className="text-red-600 mb-2">{err}</p>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Email"
               value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Password" type="password"
               value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full border rounded px-3 py-2 hover:bg-black hover:text-white">
          Sign in
        </button>
      </form>
    </div>
  );
}
