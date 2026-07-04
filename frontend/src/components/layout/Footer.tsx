import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Globe, Play, Camera, MessageCircle,
  MapPin, Phone, Mail, Send, ShieldCheck,
  Truck, CreditCard, RotateCcw, ChevronRight,
} from "lucide-react";

const SOCIAL_LINKS = [
  { icon: Globe,         href: "#", label: "Facebook" },
  { icon: Camera,        href: "#", label: "Instagram" },
  { icon: Play,          href: "#", label: "YouTube" },
  { icon: MessageCircle, href: "#", label: "WhatsApp" },
];

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "Secure Payment",  desc: "100% protected" },
  { icon: Truck,       label: "Fast Delivery",   desc: "Dhaka & nationwide" },
  { icon: CreditCard,  label: "EMI Available",   desc: "0% on all products" },
  { icon: RotateCcw,   label: "Easy Return",     desc: "7-day hassle-free" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="w-full mt-auto bg-foreground">
      {/* Trust badges strip */}
      <div className="border-b border-background/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {TRUST_BADGES.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-background/10 text-background shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-background">{label}</p>
                  <p className="text-xs text-background/50">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">

          {/* Brand column */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-6 bg-primary rounded-sm" />
              <span className="text-2xl font-extrabold tracking-tight font-display">
                <span className="text-primary">Abiyan</span>
                <span className="text-background"> Telestore</span>
              </span>
            </Link>
            <p className="text-sm text-background/60 leading-relaxed max-w-sm">
              Bangladesh's premier destination for premium smartphones, laptops, and accessories.
              Genuine products, official warranty, unbeatable prices.
            </p>

            {/* Contact */}
            <div className="flex flex-col gap-2.5 mt-1">
              <div className="flex items-center gap-2.5 text-sm text-background/60">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-background/60">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>+880 1XXX-XXXXXX</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-background/60">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>support@abiyantelestore.com</span>
              </div>
            </div>

            {/* Social links */}
            <div className="flex gap-2 mt-1">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="border border-background/20 rounded-md p-2.5 text-background/60 hover:text-background hover:border-background/50 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop column */}
          <div className="flex flex-col gap-3">
            <h6 className="text-xs font-semibold text-background uppercase tracking-widest">Shop</h6>
            {[
              { to: "/products", label: "All Products" },
              { to: "/products?category=smartphones", label: "Smartphones" },
              { to: "/products?category=laptops", label: "Laptops" },
              { to: "/products?category=tablets", label: "Tablets" },
              { to: "/products?category=smartwatch", label: "Smart Watch" },
              { to: "/products?category=audio", label: "Audio" },
              { to: "/products?featured=true", label: "Offers & Deals" },
            ].map(({ to, label }) => (
              <Link
                key={to + label}
                to={to}
                className="flex items-center gap-1.5 text-sm text-background/60 hover:text-background transition-colors group"
              >
                <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                {label}
              </Link>
            ))}
          </div>

          {/* Support column */}
          <div className="flex flex-col gap-3">
            <h6 className="text-xs font-semibold text-background uppercase tracking-widest">Support</h6>
            {[
              { to: "/orders", label: "Track Order" },
              { to: "/orders", label: "Contact Us" },
              { to: "/orders", label: "FAQ" },
              { to: "/orders", label: "Warranty" },
              { to: "/orders", label: "Return Policy" },
              { to: "/", label: "Privacy Policy" },
              { to: "/", label: "Terms of Service" },
            ].map(({ to, label }) => (
              <Link
                key={label}
                to={to}
                className="flex items-center gap-1.5 text-sm text-background/60 hover:text-background transition-colors group"
              >
                <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                {label}
              </Link>
            ))}
          </div>

          {/* Newsletter column */}
          <div className="flex flex-col gap-4">
            <h6 className="text-xs font-semibold text-background uppercase tracking-widest">Newsletter</h6>
            <p className="text-sm text-background/60 leading-relaxed">
              Get the latest deals, launches, and tech news delivered to your inbox.
            </p>
            {subscribed ? (
              <div className="bg-background/10 border border-background/20 rounded-lg p-4 text-center">
                <ShieldCheck className="h-6 w-6 text-primary mx-auto mb-1" />
                <p className="text-sm font-semibold text-background">You're subscribed!</p>
                <p className="text-xs text-background/50 mt-0.5">Thanks for joining us.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <div className="flex items-center gap-2 border border-background/20 rounded-md px-3 py-2.5 focus-within:border-primary/60 transition-colors">
                  <Mail className="h-4 w-4 text-background/40 shrink-0" />
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-sm text-background placeholder:text-background/40"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary text-white font-semibold py-2.5 rounded-md flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors text-sm"
                >
                  <Send className="h-4 w-4" /> Subscribe
                </button>
              </form>
            )}

            {/* Payment methods */}
            <div className="mt-1">
              <p className="text-xs text-background/40 font-semibold uppercase tracking-widest mb-2">Payments</p>
              <div className="flex flex-wrap gap-1.5">
                {["bKash", "Nagad", "VISA", "MasterCard", "Rocket"].map((method) => (
                  <span
                    key={method}
                    className="text-[10px] font-semibold px-2 py-1 bg-background/10 border border-background/20 rounded text-background/60"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-background/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="text-xs text-background/40">
            © {new Date().getFullYear()} Abiyan Telestore. All rights reserved.
          </span>
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              { to: "/", label: "Privacy" },
              { to: "/", label: "Terms" },
              { to: "/", label: "Shipping" },
              { to: "/orders", label: "Contact" },
            ].map(({ to, label }) => (
              <Link key={label} to={to} className="text-xs text-background/40 hover:text-background/80 transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
