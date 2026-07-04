import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ShieldCheck, Star, Users, Package, Award, Quote } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { icon: Users,      value: 50000, suffix: "+",   label: "Happy Customers" },
  { icon: Package,    value: 12000, suffix: "+",   label: "Products Sold" },
  { icon: Award,      value: 99,    suffix: "%",   label: "Genuine Products" },
  { icon: ShieldCheck, value: 5,   suffix: " yr",  label: "In Business" },
];

const TESTIMONIALS = [
  {
    name: "Rahim Ahmed",
    role: "Verified Buyer",
    rating: 5,
    text: "Bought an iPhone 15 Pro Max here. Original product, sealed box, and delivery was super fast. Highly recommend!",
    avatar: "RA",
  },
  {
    name: "Fatema Khanam",
    role: "Verified Buyer",
    rating: 5,
    text: "Amazing experience! The EMI option made it so easy to buy my MacBook. Customer support was very helpful.",
    avatar: "FK",
  },
  {
    name: "Karim Hossain",
    role: "Verified Buyer",
    rating: 4,
    text: "Great collection and competitive prices. Got my Samsung Galaxy S24 Ultra at the best price in town.",
    avatar: "KH",
  },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        let start = 0;
        const step = Math.ceil(target / 60);
        const id = setInterval(() => {
          start = Math.min(start + step, target);
          setCount(start);
          if (start >= target) clearInterval(id);
        }, 20);
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export function CustomerTrust() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".trust-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">

        {/* Stats grid */}
        <div>
          <div className="text-center mb-8">
            <p className="label-overline mb-1">Why Choose Us</p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display">
              Trusted by Thousands
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {STATS.map(({ icon: Icon, value, suffix, label }) => (
              <div
                key={label}
                className="trust-card opacity-0 border border-border bg-card rounded-xl p-5 sm:p-7 flex flex-col items-center text-center gap-3"
              >
                <div className="bg-primary/10 text-primary p-3 rounded-lg">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground font-display">
                  <AnimatedCounter target={value} suffix={suffix} />
                </div>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <div className="text-center mb-8">
            <p className="label-overline mb-1">Reviews</p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display">
              What Customers Say
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {TESTIMONIALS.map(({ name, role, rating, text, avatar }) => (
              <div
                key={name}
                className="trust-card opacity-0 border border-border bg-card rounded-xl p-5 sm:p-6 flex flex-col gap-4"
              >
                <Quote className="h-5 w-5 text-primary/20" />
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">"{text}"</p>
                <div className="flex items-center gap-0.5 mb-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${i < rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/20 fill-muted-foreground/10"}`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3 border-t border-border pt-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
                    {avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{name}</div>
                    <div className="text-xs text-muted-foreground">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
