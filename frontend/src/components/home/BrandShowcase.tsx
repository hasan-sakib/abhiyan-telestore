const BRANDS = [
  { name: "Apple",    color: "text-gray-800 dark:text-gray-200" },
  { name: "Samsung",  color: "text-blue-600" },
  { name: "Xiaomi",   color: "text-orange-500" },
  { name: "OnePlus",  color: "text-red-500" },
  { name: "Asus",     color: "text-blue-800 dark:text-blue-400" },
  { name: "Lenovo",   color: "text-red-600" },
  { name: "Anker",    color: "text-cyan-600" },
  { name: "Logitech", color: "text-gray-700 dark:text-gray-300" },
  { name: "Sony",     color: "text-black dark:text-white" },
  { name: "JBL",      color: "text-orange-600" },
];

export function BrandShowcase() {
  const doubled = [...BRANDS, ...BRANDS];

  return (
    <section className="py-8 sm:py-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6 sm:mb-8">
        <div className="text-center">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Trusted Brands</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Official Partners
          </h2>
        </div>
      </div>

      {/* Marquee track */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-linear-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee gap-6 sm:gap-10">
          {doubled.map(({ name, color }, i) => (
            <div
              key={`${name}-${i}`}
              className="shrink-0 neumorphic-raised bg-background rounded-2xl px-6 sm:px-8 py-3 sm:py-4 flex items-center justify-center hover:scale-105 transition-transform cursor-default"
            >
              <span className={`text-lg sm:text-xl font-extrabold tracking-tight whitespace-nowrap ${color}`}>
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
