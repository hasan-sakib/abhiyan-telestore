import { Link } from "react-router-dom";
import { Globe, Share2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full mt-12 px-4 sm:px-6 py-10 sm:py-12 flex flex-col items-center gap-6 bg-background border-t border-border">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row justify-between gap-8 border-b border-border pb-8 sm:pb-10">
        <div className="flex flex-col gap-3 max-w-xs">
          <span className="text-xl sm:text-2xl font-extrabold text-primary">
            Abiyan Telestore
          </span>
          <p className="text-sm text-muted-foreground">
            Your premier destination for high-end mobile technology and premium
            accessories. Experience the future of retail.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
          <div className="flex flex-col gap-2">
            <h6 className="text-sm font-semibold text-foreground">Shop</h6>
            <Link
              to="/products"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Phones
            </Link>
            <Link
              to="/products?category=tablets"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Tablets
            </Link>
            <Link
              to="/products?category=wearables"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Wearables
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <h6 className="text-sm font-semibold text-foreground">Support</h6>
            <Link
              to="/orders"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Contact Us
            </Link>
            <Link
              to="/orders"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              FAQ
            </Link>
            <Link
              to="/orders"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Warranty
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <h6 className="text-sm font-semibold text-foreground">Legal</h6>
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            <h6 className="text-sm font-semibold text-foreground">Follow Us</h6>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Website"
                className="neumorphic-raised bg-background p-2 rounded-lg text-primary hover:scale-110 transition-transform"
              >
                <Globe className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Share"
                className="neumorphic-raised bg-background p-2 rounded-lg text-primary hover:scale-110 transition-transform"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center gap-3">
        <span className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Abiyan Telestore. All rights reserved.
        </span>
        <div className="flex flex-wrap gap-4 sm:gap-5 justify-center">
          <Link
            to="/"
            className="text-xs text-muted-foreground hover:text-primary"
          >
            Privacy Policy
          </Link>
          <Link
            to="/"
            className="text-xs text-muted-foreground hover:text-primary"
          >
            Terms of Service
          </Link>
          <Link
            to="/"
            className="text-xs text-muted-foreground hover:text-primary"
          >
            Shipping Info
          </Link>
          <Link
            to="/orders"
            className="text-xs text-muted-foreground hover:text-primary"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
}
