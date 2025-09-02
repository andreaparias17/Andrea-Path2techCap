import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="rounded-2xl overflow-hidden bg-gray-100">
      <div className="grid md:grid-cols-2">
        <div className="p-10 md:p-16 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">New Classics.</h1>
          <p className="mt-4 text-gray-600">Our latest and most popular tees.</p>
          <Link to="/products" className="mt-6 inline-block px-5 py-3 border rounded-full hover:bg-black hover:text-white transition">
            Shop the collection
          </Link>
        </div>
        {/* Swap this image to your real hero later (put it in /public and use /hero.jpg) */}
        <img
          className="w-full h-80 md:h-full object-cover"
          src="https://images.unsplash.com/photo-1516641393168-cca3b91cb3cc?q=80&w=1600&auto=format&fit=crop"
          alt="Rebellions hero"
        />
      </div>
    </section>
  );
}
