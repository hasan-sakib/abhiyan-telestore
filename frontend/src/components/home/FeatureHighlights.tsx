import { Truck, CreditCard, ShieldCheck, BadgeDollarSign } from "lucide-react";

const FEATURES = [
  {
    icon: Truck,
    title: "Free Delivery",
    sub: "On orders above $500",
  },
  {
    icon: CreditCard,
    title: "EMI Available",
    sub: "0% Interest options",
  },
  {
    icon: ShieldCheck,
    title: "Warranty",
    sub: "2 Year brand protection",
  },
  {
    icon: BadgeDollarSign,
    title: "Best Price",
    sub: "Direct store pricing",
  },
];

export function FeatureHighlights() {
  return (
    <section className="py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {FEATURES.map(({ icon: Icon, title, sub }) => (
            <div
              key={title}
              className="neumorphic-raised bg-background p-4 sm:p-5 rounded-2xl flex flex-col items-center text-center gap-2 hover:scale-105 transition-transform cursor-default"
            >
              <Icon className="h-7 w-7 sm:h-9 sm:w-9 text-primary" />
              <h5 className="text-sm font-semibold text-foreground">{title}</h5>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
