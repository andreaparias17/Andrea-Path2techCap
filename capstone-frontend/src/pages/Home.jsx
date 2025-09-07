export default function Home() {
  return (
    <main>
  {/* HERO */}
  <section className="max-w-6xl mx-auto p-4">
  <div className="relative rounded-2xl overflow-hidden">
    {/* image in normal flow (no absolute, no fixed height) */}
    <img
      src="https://res.cloudinary.com/drcldtopk/image/upload/v1757274821/REBELBANNER_ozyoxc.jpg"
      alt="Rebellions hero"
      className="block w-full rounded-2xl"
    />
    {/* overlay positioned within the image box */}
    <div className="absolute right-[15%] bottom-[22%] text-right">
      <p className="text-white/90 text-lg md:text-2xl tracking-wide">NEW CLASSICS</p>
      <a href="/products" className="inline-block mt-4 rounded-full bg-white px-6 py-3 font-medium text-black hover:bg-neutral-200 transition">
        Shop the collection
      </a>
    </div>
  </div>
</section>
  
</main>

  );
}
