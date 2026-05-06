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
      <div className="container mx-auto px-4 py-8">
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
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
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" size="sm" asChild className="mb-6 -ml-1 gap-1">
        <Link to="/products">
          <ChevronLeft className="h-4 w-4" /> Back to Products
        </Link>
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <ProductImageGallery images={product.images ?? []} productName={product.name} />

        <div className="space-y-4">
          {product.brand && (
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">{product.brand}</p>
          )}
          <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>

          <div className="flex items-center gap-2 flex-wrap">
            {product.status === "in_stock" && <Badge variant="success">In Stock</Badge>}
            {product.status === "out_of_stock" && <Badge variant="destructive">Out of Stock</Badge>}
            {product.status === "upcoming" && <Badge variant="secondary">Coming Soon</Badge>}
            {product.is_featured && <Badge variant="outline">Featured</Badge>}
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold">
              {formatPrice(product.discount_price ?? product.price)}
            </span>
            {product.discount_price && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            )}
            {product.discount_price && (
              <Badge variant="destructive" className="text-xs">
                {Math.round((1 - product.discount_price / product.price) * 100)}% OFF
              </Badge>
            )}
          </div>

          {product.description && (
            <>
              <Separator />
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </>
          )}

          {product.specs && Object.keys(product.specs).length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2 text-sm">Specifications</h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                  {Object.entries(product.specs).map(([k, v]) => (
                    <div key={k} className="contents">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd>{String(v)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </>
          )}

          <Separator />

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Package className="h-4 w-4" />
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
