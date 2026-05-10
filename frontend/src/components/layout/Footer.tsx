import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Globe, Play, Camera, MessageCircle,
  MapPin, Phone, Mail, Send, ShieldCheck,
  Truck, CreditCard, RotateCcw, ChevronRight,
} from "lucide-react";

const SOCIAL_LINKS = [
  { icon: Globe,         href: "#", label: "Facebook",  color: "hover:text-blue-500" },
  { icon: Camera,        href: "#", label: "Instagram", color: "hover:text-pink-500" },
  { icon: Play,          href: "#", label: "YouTube",   color: "hover:text-red-500" },
  { icon: MessageCircle, href: "#", label: "WhatsApp",  color: "hover:text-green-500" },
];

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "Secure Payment" },
  { icon: Truck, label: "Fast Delivery" },
  { icon: CreditCard, label: "EMI Available" },
  { icon: RotateCcw, label: "Easy Return" },
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
    <footer className="w-full mt-auto bg-background border-t border-border">
      {/* Trust badges strip */}
      <div className="border-b border-border/60 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 group">
                <div className="neumorphic-raised bg-background p-2.5 rounded-xl text-primary group-hover:scale-110 transition-transform shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-semibold text-foreground">{label}</span>
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
            <Link to="/" className="text-2xl font-extrabold tracking-tight">
              <span className="text-gradient-primary">Abiyan</span>
              <span className="text-foreground"> Telestore</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Bangladesh's premier destination for premium smartphones, laptops, and accessories.
              Genuine products, official warranty, unbeatable prices.
            </p>

            {/* Contact */}
            <div className="flex flex-col gap-2.5 mt-1">
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>+880 1XXX-XXXXXX</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>support@abiyantelestore.com</span>
              </div>
            </div>

            {/* Social links */}
            <div className="flex gap-2.5 mt-1">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`neumorphic-raised bg-background p-2.5 rounded-xl text-muted-foreground ${color} hover:scale-110 active:scale-95 transition-all`}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop column */}
          <div className="flex flex-col gap-3">
            <h6 className="text-sm font-bold text-foreground uppercase tracking-wider">Shop</h6>
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
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors group"
              >
                <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                {label}
              </Link>
            ))}
          </div>

          {/* Support column */}
          <div className="flex flex-col gap-3">
            <h6 className="text-sm font-bold text-foreground uppercase tracking-wider">Support</h6>
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
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors group"
              >
                <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                {label}
              </Link>
            ))}
          </div>

          {/* Newsletter column */}
          <div className="flex flex-col gap-4">
            <h6 className="text-sm font-bold text-foreground uppercase tracking-wider">Newsletter</h6>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Get the latest deals, launches, and tech news delivered to your inbox.
            </p>
            {subscribed ? (
              <div className="neumorphic-inset bg-background rounded-2xl p-4 text-center">
                <ShieldCheck className="h-6 w-6 text-green-500 mx-auto mb-1" />
                <p className="text-sm font-semibold text-green-600 dark:text-green-400">You're subscribed!</p>
                <p className="text-xs text-muted-foreground mt-0.5">Thanks for joining us.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <div className="neumorphic-inset bg-background rounded-xl flex items-center gap-2 px-3 py-2.5">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-primary text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all text-sm shadow-md"
                >
                  <Send className="h-4 w-4" /> Subscribe
                </button>
              </form>
            )}

            {/* Payment methods */}
            <div className="mt-2">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Accepted Payments</p>
              <div className="flex flex-wrap gap-1.5">
                {["bKash", "Nagad", "VISA", "MasterCard", "Rocket"].map((method) => (
                  <span
                    key={method}
                    className="text-[10px] font-bold px-2 py-1 bg-muted rounded-md text-muted-foreground border border-border/50"
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
      <div className="border-t border-border/60 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Abiyan Telestore. All rights reserved.
          </span>
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              { to: "/", label: "Privacy" },
              { to: "/", label: "Terms" },
              { to: "/", label: "Shipping" },
              { to: "/orders", label: "Contact" },
            ].map(({ to, label }) => (
              <Link key={label} to={to} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
