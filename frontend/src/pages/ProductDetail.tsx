import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ShoppingCart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductImageGallery } from "@/components/product/ProductImageGallery";
import { ProductDetailSkeleton } from "@/components/shared/LoadingSkeleton";
import { formatPrice } from "@/lib/utils";
import { useProduct } from "@/hooks/useProducts";
import { useCartStore } from "@/store/cartStore";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, isError } = useProduct(slug!);
  const { addItem, setDrawerOpen } = useCartStore();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-semibold mb-2">Product not found</h2>
        <Button asChild variant="outline"><Link to="/products">Back to Products</Link></Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({ product_id: product.id, quantity: 1, product });
    setDrawerOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <Link to="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ChevronLeft className="h-4 w-4" /> Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <ProductImageGallery images={product.images ?? []} productName={product.name} />

        <div className="space-y-4">
          {product.brand && (
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{product.brand}</p>
          )}
          <h1 className="text-2xl md:text-3xl font-bold font-display leading-tight">{product.name}</h1>

          <div className="flex items-center gap-2 flex-wrap">
            {product.status === "in_stock" && <Badge variant="success">In Stock</Badge>}
            {product.status === "out_of_stock" && <Badge variant="destructive">Out of Stock</Badge>}
            {product.status === "upcoming" && <Badge variant="secondary">Coming Soon</Badge>}
            {product.is_featured && <Badge variant="outline">Featured</Badge>}
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold font-display">
              {formatPrice(product.discount_price ?? product.price)}
            </span>
            {product.discount_price && (
              <span className="price-original text-base">
                {formatPrice(product.price)}
              </span>
            )}
            {product.discount_price && (
              <span className="price-discount-badge">
                {Math.round((1 - product.discount_price / product.price) * 100)}% OFF
              </span>
            )}
          </div>

          {product.description && (
            <>
              <Separator />
              <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
            </>
          )}

          {product.specs && Object.keys(product.specs).length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3 text-sm font-display">Specifications</h3>
                <dl className="bg-muted/40 rounded-lg p-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {Object.entries(product.specs).map(([k, v]) => (
                    <div key={k} className="contents">
                      <dt className="text-xs text-muted-foreground font-medium">{k}</dt>
                      <dd className="text-sm font-medium text-foreground">{String(v)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </>
          )}

          <Separator />

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Package className="h-4 w-4 text-primary" />
            <span>{product.stock_quantity} units available</span>
          </div>

          <Button
            size="lg"
            className="w-full gap-2"
            onClick={handleAddToCart}
            disabled={product.status === "out_of_stock"}
          >
            <ShoppingCart className="h-5 w-5" />
            {product.status === "out_of_stock" ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}
