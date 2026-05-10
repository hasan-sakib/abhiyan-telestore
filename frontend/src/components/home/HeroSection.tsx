import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ChevronLeft, ChevronRight, Zap, Tag, ArrowRight } from "lucide-react";

const SLIDES = [
  {
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBChCX8_F4yzyiFxfnDv9Z20pq2TZVcpU2NqeSXPjSnAV2Dw284zbsLrVuBXSSxVP8OWJ4j6c0D8jdQpuv9gFGMC6W4EjfTFpgVLBJwp6ZeexUUqrAnXmj3mhibd1NwQUwm_ILdmYv1sV80DNqe0WKkOaBWyEhuSYWHsRSg3IdHoBPJwX1rsYpnDSfWSs7ov0-6mbB_3ouxQ106TSV27PpeZhM7b0GM1p7V2d5_JanugTfWdGywQqHw7niCitxzavULo0oiMGW1sahf",
    badge: "New Arrival",
    badgeColor: "bg-gradient-primary",
    title: "Experience the New Titanium Edge",
    subtitle: "The most powerful chip ever in a smartphone. Pro-grade cameras. Sophisticated design.",
    cta: "Buy Now",
    ctaLink: "/products",
    explore: "Explore More",
    exploreLink: "/products?featured=true",
  },
  {
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxBC_VpwPgdDvkClsV5IiBeMWXHWKcTEWhjw6kl-S8By5q8-69AMdWlhNdGa8Y9hjTEXT-L2J5rTpLEADzC50D_jfdadiL5LIXhbM9vevFAzhrtW6vV6FdHxhTihAh8Ix350j14ClGT8WZAN8frPAYKLKNTNjlpXqkMIdqKiZCetwbqvfyzHPbZocNwyUIa4eMFSMbj8Ax5TBXAo-iltsSmHWcvb70TjLIAxjk3KF4VbGKh9Gg061U1Ot7LKsXal36eUWfS1loU7rq",
    badge: "Hot Deal",
    badgeColor: "bg-gradient-warm",
    title: "Power Meets Portability",
    subtitle: "Ultra-slim laptops & tablets built for the next generation. Premium performance, all day battery.",
    cta: "Shop Now",
    ctaLink: "/products?category=laptops",
    explore: "View Tablets",
    exploreLink: "/products?category=tablets",
  },
];

const SIDE_CARDS = [
  {
    type: "promo",
    title: "Flash Sale",
    sub: "Up to 30% off on selected smartphones this weekend only.",
    cta: "Grab Deal",
    ctaLink: "/products?featured=true",
    gradient: "bg-gradient-warm",
  },
  {
    type: "bundle",
    title: "Bundle & Save",
    sub: "Buy a laptop + wireless earbuds and save ৳2000.",
    cta: "View Bundle",
    ctaLink: "/products",
    gradient: "bg-gradient-cool",
  },
];

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

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
          <div className="lg:col-span-8 neumorphic-raised bg-background rounded-3xl overflow-hidden relative min-h-88 sm:min-h-112 lg:min-h-136 flex items-center group">
            {/* Background image with smooth transition */}
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
              <span className={`hero-badge opacity-0 self-start text-white text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full shadow-lg ${slide.badgeColor} flex items-center gap-1.5`}>
                <Zap className="h-3.5 w-3.5" /> {slide.badge}
              </span>

              <h1 className="hero-title opacity-0 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-foreground">
                {slide.title}
              </h1>

              <p className="hero-subtitle opacity-0 text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                {slide.subtitle}
              </p>

              <div className="hero-ctas opacity-0 flex flex-wrap gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => navigate(slide.ctaLink)}
                  className="bg-gradient-primary text-white font-bold py-3 px-7 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all text-sm sm:text-base flex items-center gap-2"
                >
                  {slide.cta} <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate(slide.exploreLink)}
                  className="bg-background/80 backdrop-blur text-foreground font-semibold py-3 px-7 rounded-2xl neumorphic-raised hover:scale-105 active:scale-95 transition-all text-sm sm:text-base border border-border/50"
                >
                  {slide.explore}
                </button>
              </div>
            </div>

            {/* Slide controls */}
            <div className="absolute bottom-4 left-6 sm:left-10 flex items-center gap-3 z-10">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === activeSlide
                      ? "w-8 h-2.5 bg-primary shadow-md"
                      : "w-2.5 h-2.5 bg-white/60 hover:bg-white/90"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Prev/Next arrows */}
            <button
              type="button"
              onClick={() => goTo((activeSlide - 1 + SLIDES.length) % SLIDES.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 glass-card p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </button>
            <button
              type="button"
              onClick={() => goTo((activeSlide + 1) % SLIDES.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 glass-card p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5 text-foreground" />
            </button>
          </div>

          {/* Side cards */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-5">
            {SIDE_CARDS.map((card, i) => (
              <div
                key={i}
                className="hero-side opacity-0 neumorphic-raised rounded-3xl overflow-hidden relative group cursor-pointer"
                onClick={() => navigate(card.ctaLink)}
              >
                <div className={`${card.gradient} opacity-10 absolute inset-0`} />
                <div className="relative p-5 sm:p-6 flex flex-col justify-between h-full min-h-40">
                  <div>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-xs font-bold ${card.gradient} shadow-md mb-3`}>
                      <Tag className="h-3 w-3" /> Special
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-foreground">{card.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{card.sub}</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); navigate(card.ctaLink); }}
                    className={`mt-4 text-sm font-bold text-white ${card.gradient} px-5 py-2.5 rounded-xl hover:scale-105 active:scale-95 transition-transform shadow-md self-start flex items-center gap-1.5`}
                  >
                    {card.cta} <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
