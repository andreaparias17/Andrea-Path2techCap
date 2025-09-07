import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [me, setMe] = useState(null);

  useEffect(() => {
    const m = localStorage.getItem("me");
    setMe(m ? JSON.parse(m) : null);
  }, []);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("me");
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <span className="text-2xl font-extrabold tracking-widest">REBELLIONS</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <NavLink to="/" className={({isActive}) => isActive ? "underline" : "hover:opacity-70"}>Home</NavLink>
          <NavLink to="/products" className={({isActive}) => isActive ? "underline" : "hover:opacity-70"}>Shop</NavLink>
          <NavLink to="/about" className={({isActive}) => isActive ? "underline" : "hover:opacity-70"}>About</NavLink>
          <NavLink to="/cart" className={({isActive}) => isActive ? "underline" : "hover:opacity-70"}>Cart</NavLink>

          {me ? (
            <>
              <NavLink to="/orders" className={({isActive}) => isActive ? "underline" : "hover:opacity-70"}>Orders</NavLink>

              {/* ✅ Only show to admins */}
              {me.role === "admin" && (
                <NavLink to="/admin" className={({isActive}) => isActive ? "underline" : "hover:opacity-70"}>
                  Admin
                </NavLink>
              )}

              <span className="text-gray-600">Hi, {me.name?.split(" ")[0] || "User"}</span>
              <button onClick={logout} className="underline">Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({isActive}) => isActive ? "underline" : "hover:opacity-70"}>Login</NavLink>
              <NavLink to="/register" className={({isActive}) => isActive ? "underline" : "hover:opacity-70"}>Register</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
