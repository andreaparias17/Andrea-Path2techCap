import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";     
import Product from "./pages/Product";    

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />   
          <Route path="/products/:id" element={<Product />} /> 
          <Route path="/cart" element={<div>Cart (soon)</div>} />
          <Route path="/login" element={<div>Login (soon)</div>} />
          <Route path="/about" element={<div>About (soon)</div>} />
        </Routes>
      </main>
      <footer className="text-center text-xs text-gray-500 py-10">
        © {new Date().getFullYear()} Rebellions
      </footer>
    </BrowserRouter>
  );
}
