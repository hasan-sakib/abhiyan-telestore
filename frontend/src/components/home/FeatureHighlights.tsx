import { Truck, CreditCard, ShieldCheck, BadgeDollarSign } from "lucide-react";

const FEATURES = [
  {
    icon: Truck,
    title: "Free Delivery",
    sub: "On orders above ৳5,000",
  },
  {
    icon: CreditCard,
    title: "EMI Available",
    sub: "0% interest options",
  },
  {
    icon: ShieldCheck,
    title: "Warranty",
    sub: "2 year brand protection",
  },
  {
    icon: BadgeDollarSign,
    title: "Best Price",
    sub: "Direct store pricing",
  },
];

export function FeatureHighlights() {
  return (
    <section className="border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
          {FEATURES.map(({ icon: Icon, title, sub }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center gap-2 py-5 sm:py-6 px-4 sm:px-6"
            >
              <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <h5 className="text-sm font-semibold text-foreground">{title}</h5>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
