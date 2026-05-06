import { Link } from "react-router-dom";
import { Smartphone } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 font-bold text-lg mb-3">
              <Smartphone className="h-5 w-5 text-primary" />
              <span>Abiyan Telestore</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your trusted destination for mobile phones and accessories.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-sm">Shop</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/products" className="hover:text-foreground transition-colors">All Products</Link></li>
              <li><Link to="/products?category=phones" className="hover:text-foreground transition-colors">Mobile Phones</Link></li>
              <li><Link to="/products?category=accessories" className="hover:text-foreground transition-colors">Accessories</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-sm">Account</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/login" className="hover:text-foreground transition-colors">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-foreground transition-colors">Register</Link></li>
              <li><Link to="/orders" className="hover:text-foreground transition-colors">Order History</Link></li>
            </ul>
          </div>
        </div>

        <Separator className="my-6" />
        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Abiyan Telestore. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
