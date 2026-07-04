import appleLogo from "@/assets/partners/apple.svg";
import samsungLogo from "@/assets/partners/samsung.svg";
import xiaomiLogo from "@/assets/partners/xiaomi.svg";
import oneplusLogo from "@/assets/partners/oneplus.svg";
import asusLogo from "@/assets/partners/asus.svg";
import lenovoLogo from "@/assets/partners/lenovo.svg";
import ankerLogo from "@/assets/partners/anker.svg";
import logitechLogo from "@/assets/partners/logitech.svg";
import sonyLogo from "@/assets/partners/sony.svg";
import jblLogo from "@/assets/partners/jbl.svg";

const BRANDS = [
  { name: "Apple", logo: appleLogo },
  { name: "Samsung", logo: samsungLogo },
  { name: "Xiaomi", logo: xiaomiLogo },
  { name: "OnePlus", logo: oneplusLogo },
  { name: "Asus", logo: asusLogo },
  { name: "Lenovo", logo: lenovoLogo },
  { name: "Anker", logo: ankerLogo },
  { name: "Logitech", logo: logitechLogo },
  { name: "Sony", logo: sonyLogo },
  { name: "JBL", logo: jblLogo },
];

export function BrandShowcase() {
  const doubled = [...BRANDS, ...BRANDS];

  return (
    <section className="py-8 sm:py-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6 sm:mb-8">
        <div className="text-center">
          <p className="label-overline mb-1">Trusted Brands</p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display">
            Official Partners
          </h2>
        </div>
      </div>

      {/* Marquee track */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-linear-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee gap-4 sm:gap-6">
          {doubled.map((brand, i) => (
            <div
              key={`${brand.name}-${i}`}
              className="shrink-0 border border-border bg-card rounded-lg px-6 sm:px-8 py-3 sm:py-4 flex items-center justify-center hover:border-primary/40 transition-colors cursor-default"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-8 sm:h-10 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
