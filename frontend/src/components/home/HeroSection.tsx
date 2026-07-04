import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ChevronLeft, ChevronRight, Zap, ArrowRight } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import heroIphone from "@/assets/hero/hero-iphone.jpg";
import heroGalaxy from "@/assets/hero/hero-galaxy-s26-ultra.jpg";
import heroPixel from "@/assets/hero/hero-pixel.jpg";

const SLIDES = [
  {
    image: heroIphone,
    badge: "New Arrival",
    title: "Experience the New Titanium Edge",
    subtitle: "The most powerful chip ever in a smartphone. Pro-grade cameras. Sophisticated design.",
    cta: "Buy Now",
    ctaLink: "/products",
    explore: "Explore More",
    exploreLink: "/products?featured=true",
  },
  {
    image: heroGalaxy,
    badge: "Galaxy AI",
    title: "Introducing Galaxy S26 Ultra",
    subtitle: "Unleash next-level creativity and productivity with Galaxy AI built right in.",
    cta: "Shop Now",
    ctaLink: "/products",
    explore: "Explore More",
    exploreLink: "/products?featured=true",
  },
  {
    image: heroPixel,
    badge: "Just Landed",
    title: "Meet the New Google Pixel",
    subtitle: "Pure Android, smarter photography, and AI that actually helps you get things done.",
    cta: "Buy Now",
    ctaLink: "/products",
    explore: "Explore More",
    exploreLink: "/products?featured=true",
  },
];

const SIDE_CARDS = [
  {
    title: "Flash Sale",
    sub: "Up to 30% off on selected smartphones this weekend only.",
    cta: "Grab Deal",
    ctaLink: "/products?featured=true",
    bg: "bg-primary/5",
  },
  {
    title: "Bundle & Save",
    sub: "Buy a laptop + wireless earbuds and save ৳2000.",
    cta: "View Bundle",
    ctaLink: "/products",
    bg: "bg-muted/60",
  },
];

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const { data: featuredData } = useProducts({ is_featured: true, page_size: 10 });
  const featuredProducts = featuredData?.items ?? [];
  const repeatedProducts = featuredProducts.length > 0
    ? Array.from({ length: Math.max(1, Math.ceil(20 / featuredProducts.length)) }).flatMap(() => featuredProducts)
    : [];
  const marqueeContent = [...repeatedProducts, ...repeatedProducts];

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setActiveSlide((s) => (s + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [autoPlay]);

  const goTo = (idx: number) => {
    setActiveSlide(idx);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 8000);
  };

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(".hero-badge", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45 })
        .fromTo(".hero-title", { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.55 }, "-=0.2")
        .fromTo(".hero-subtitle", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.45 }, "-=0.25")
        .fromTo(".hero-ctas", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.2")
        .fromTo(".hero-side", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.12 }, "-=0.3");
    },
    { scope: containerRef }
  );

  const slide = SLIDES[activeSlide];

  return (
    <section ref={containerRef} className="py-6 sm:py-8 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">

          {/* Main hero card */}
          <div className="lg:col-span-8 border border-border rounded-xl overflow-hidden relative min-h-88 sm:min-h-112 lg:min-h-136 flex items-center group bg-card">
            {/* Background image */}
            <div className="absolute inset-0 z-0">
              <img
                key={activeSlide}
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover transition-opacity duration-700"
                loading="eager"
              />
              <div className="absolute inset-0 bg-linear-to-r from-background/90 via-background/50 to-transparent" />
              <div className="absolute inset-0 bg-linear-to-t from-background/60 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 px-6 sm:px-10 py-8 flex flex-col gap-4 max-w-lg">
              <span className="hero-badge opacity-0 self-start bg-primary/15 text-primary border border-primary/20 rounded-full text-xs font-semibold px-3 py-1 flex items-center gap-1.5">
                <Zap className="h-3 w-3" /> {slide.badge}
              </span>

              <h1 className="hero-title opacity-0 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-foreground font-display">
                {slide.title}
              </h1>

              <p className="hero-subtitle opacity-0 text-sm sm:text-base text-muted-foreground leading-relaxed">
                {slide.subtitle}
              </p>

              <div className="hero-ctas opacity-0 flex flex-wrap gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => navigate(slide.ctaLink)}
                  className="bg-primary text-white font-semibold py-3 px-7 rounded-md shadow-md hover:bg-primary/90 transition-colors text-sm sm:text-base flex items-center gap-2"
                >
                  {slide.cta} <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate(slide.exploreLink)}
                  className="bg-background/80 backdrop-blur text-foreground font-medium py-3 px-7 rounded-md border border-border/60 hover:bg-background transition-colors text-sm sm:text-base"
                >
                  {slide.explore}
                </button>
              </div>
            </div>

            {/* Slide controls */}
            <div className="absolute bottom-4 left-6 sm:left-10 flex items-center gap-2.5 z-10">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === activeSlide
                      ? "w-7 h-2 bg-primary"
                      : "w-2 h-2 bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Prev/Next arrows */}
            <button
              type="button"
              onClick={() => goTo((activeSlide - 1 + SLIDES.length) % SLIDES.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-background/90 border border-border/60 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-4 w-4 text-foreground" />
            </button>
            <button
              type="button"
              onClick={() => goTo((activeSlide + 1) % SLIDES.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-background/90 border border-border/60 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
              aria-label="Next slide"
            >
              <ChevronRight className="h-4 w-4 text-foreground" />
            </button>
          </div>

          {/* Side cards */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-5">
            {SIDE_CARDS.map((card, i) => (
              <div
                key={i}
                className={`hero-side opacity-0 border border-border rounded-xl overflow-hidden cursor-pointer group/card ${card.bg}`}
                onClick={() => navigate(card.ctaLink)}
              >
                <div className="p-5 sm:p-6 flex flex-col justify-between h-full min-h-40">
                  <div>
                    <p className="label-overline mb-3">Special Offer</p>
                    <h3 className="text-lg font-bold text-foreground font-display">{card.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{card.sub}</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); navigate(card.ctaLink); }}
                    className="mt-4 text-sm font-semibold text-foreground bg-foreground/5 border border-border px-4 py-2 rounded-md hover:bg-foreground/10 transition-colors self-start flex items-center gap-1.5"
                  >
                    {card.cta} <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured products marquee */}
        {featuredProducts.length > 0 && (
          <div className="mt-8 sm:mt-10 lg:mt-12 relative overflow-hidden rounded-xl bg-muted/40 border-y border-border py-4 group">
            {/* Gradient edge masks */}
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-linear-to-l from-background to-transparent z-10 pointer-events-none" />

            <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
              {marqueeContent.map((product, idx) => (
                <div
                  key={`${product.id}-${idx}`}
                  onClick={() => navigate(`/products/${product.slug}`)}
                  className="flex items-center gap-3 px-5 sm:px-8 border-r border-border/40 last:border-transparent cursor-pointer hover:bg-background/60 transition-colors rounded-lg mx-1 py-1"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-background shrink-0 border border-border/40">
                    {product.images?.[0]?.url ? (
                      <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted text-[10px] text-muted-foreground">–</div>
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-[130px] sm:min-w-[160px]">
                    <h4 className="text-sm font-semibold text-foreground line-clamp-1 font-display">{product.name}</h4>
                    <p className="text-xs font-medium text-primary">৳{product.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
