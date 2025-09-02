import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          {/* swap to your real logo later: <img src="/rebellions-logo.png" className="h-7" /> */}
          <span className="text-2xl font-extrabold tracking-widest">REBELLIONS</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <NavLink to="/" className={({isActive}) => isActive ? "underline" : "hover:opacity-70"}>Home</NavLink>
          <NavLink to="/products" className={({isActive}) => isActive ? "underline" : "hover:opacity-70"}>Shop</NavLink>
          <NavLink to="/about" className={({isActive}) => isActive ? "underline" : "hover:opacity-70"}>About</NavLink>
          <NavLink to="/cart" className={({isActive}) => isActive ? "underline" : "hover:opacity-70"}>Cart</NavLink>
          <NavLink to="/login" className={({isActive}) => isActive ? "underline" : "hover:opacity-70"}>Login</NavLink>
        </nav>
      </div>
    </header>
  );
}
