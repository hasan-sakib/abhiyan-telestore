import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Tag } from "lucide-react";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBChCX8_F4yzyiFxfnDv9Z20pq2TZVcpU2NqeSXPjSnAV2Dw284zbsLrVuBXSSxVP8OWJ4j6c0D8jdQpuv9gFGMC6W4EjfTFpgVLBJwp6ZeexUUqrAnXmj3mhibd1NwQUwm_ILdmYv1sV80DNqe0WKkOaBWyEhuSYWHsRSg3IdHoBPJwX1rsYpnDSfWSs7ov0-6mbB_3ouxQ106TSV27PpeZhM7b0GM1p7V2d5_JanugTfWdGywQqHw7niCitxzavULo0oiMGW1sahf";

const TABLET_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCxBC_VpwPgdDvkClsV5IiBeMWXHWKcTEWhjw6kl-S8By5q8-69AMdWlhNdGa8Y9hjTEXT-L2J5rTpLEADzC50D_jfdadiL5LIXhbM9vevFAzhrtW6vV6FdHxhTihAh8Ix350j14ClGT8WZAN8frPAYKLKNTNjlpXqkMIdqKiZCetwbqvfyzHPbZocNwyUIa4eMFSMbj8Ax5TBXAo-iltsSmHWcvb70TjLIAxjk3KF4VbGKh9Gg061U1Ot7LKsXal36eUWfS1loU7rq";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".hero-badge",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 }
      )
        .fromTo(
          ".hero-title",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.2"
        )
        .fromTo(
          ".hero-subtitle",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.3"
        )
        .fromTo(
          ".hero-ctas",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.2"
        )
        .fromTo(
          ".hero-side",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.12 },
          "-=0.4"
        );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="py-8 sm:py-10 lg:py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
          <div className="lg:col-span-8 neumorphic-raised bg-background rounded-3xl overflow-hidden relative min-h-90 sm:min-h-110 lg:min-h-125 flex items-center group">
            <div className="absolute inset-0 z-0">
              <img
                src={HERO_IMAGE}
                alt="Premium titanium flagship smartphone"
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-linear-to-r from-background/85 via-background/40 to-transparent" />
            </div>
            <div className="relative z-10 px-6 sm:px-10 py-8 flex flex-col gap-4 max-w-md">
              <span className="hero-badge opacity-0 self-start text-primary text-xs sm:text-sm font-semibold neumorphic-raised bg-background px-3 py-1 rounded-full">
                New Arrival
              </span>
              <h1 className="hero-title opacity-0 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-foreground">
                Experience the New Titanium Edge
              </h1>
              <p className="hero-subtitle opacity-0 text-sm sm:text-base lg:text-lg text-muted-foreground">
                The most powerful chip ever in a smartphone. Pro-grade cameras.
                Sophisticated design.
              </p>
              <div className="hero-ctas opacity-0 flex flex-wrap gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => navigate("/products")}
                  className="bg-primary text-primary-foreground font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-xl neumorphic-raised hover:scale-105 active:scale-95 transition-transform text-sm sm:text-base"
                >
                  Buy Now
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/products?featured=true")}
                  className="bg-background text-primary font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-xl neumorphic-raised hover:scale-105 active:scale-95 transition-transform text-sm sm:text-base"
                >
                  Explore
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-5">
            <div className="hero-side opacity-0 neumorphic-raised rounded-3xl p-5 sm:p-6 flex flex-col justify-center items-center text-center bg-secondary">
              <div className="neumorphic-raised bg-background rounded-full p-3 mb-3 text-primary">
                <Tag className="h-6 w-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-secondary-foreground">
                Special Offers
              </h3>
              <p className="text-sm text-secondary-foreground/80 mt-2">
                Get up to 20% off on premium accessories this week.
              </p>
              <button
                type="button"
                onClick={() => navigate("/products?featured=true")}
                className="mt-4 text-sm font-semibold text-primary neumorphic-raised bg-background px-5 py-2 rounded-lg hover:scale-105 active:scale-95 transition-transform"
              >
                Claim Offer
              </button>
            </div>

            <div className="hero-side opacity-0 neumorphic-raised rounded-3xl p-4 sm:p-5 flex items-center gap-4 bg-accent">
              <div className="w-20 h-20 sm:w-24 sm:h-24 neumorphic-inset bg-background rounded-2xl overflow-hidden shrink-0">
                <img
                  src={TABLET_IMAGE}
                  alt="Tablet bundle"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-accent-foreground">
                  Tablet Bundle
                </h4>
                <p className="text-xs text-accent-foreground/80 mt-1">
                  Save $100 on the new Pro series when you buy with a keyboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
