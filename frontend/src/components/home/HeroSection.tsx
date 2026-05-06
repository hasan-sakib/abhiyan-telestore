import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(".hero-badge", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 })
      .fromTo(".hero-title", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.2")
      .fromTo(".hero-subtitle", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
      .fromTo(".hero-ctas", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.2");
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-20 md:py-32"
    >
      <div className="container mx-auto px-4 text-center">
        <div className="hero-badge inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium mb-6 opacity-0">
          New arrivals every week
        </div>

        <h1 className="hero-title opacity-0 text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-3xl mx-auto">
          The latest phones &
          <span className="text-primary"> accessories</span>
        </h1>

        <p className="hero-subtitle opacity-0 text-muted-foreground text-lg md:text-xl max-w-xl mx-auto mb-8">
          Discover our curated selection of premium mobile devices and accessories at unbeatable prices.
        </p>

        <div className="hero-ctas opacity-0 flex flex-wrap gap-3 justify-center">
          <Button size="lg" onClick={() => navigate("/products")} className="gap-2">
            Shop Now <ArrowRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/products?featured=true")}>
            View Featured
          </Button>
        </div>
      </div>

      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
    </section>
  );
}
