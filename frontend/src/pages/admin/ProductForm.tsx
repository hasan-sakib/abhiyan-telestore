import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCategories } from "@/hooks/useCategories";
import { useProduct, useCreateProduct, useUpdateProduct } from "@/hooks/useProducts";
import { useUploadImage } from "@/hooks/useUpload";

const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
  price: z.number().gt(0, "Price must be > 0"),
  discount_price: z.number().optional(),
  stock_quantity: z.number().int().min(0),
  status: z.enum(["in_stock", "out_of_stock", "upcoming"]),
  is_featured: z.boolean(),
  brand: z.string().optional(),
  model: z.string().optional(),
  category_id: z.number().optional(),
});

export default function ProductForm() {
  const { slug } = useParams<{ slug?: string }>();
  const isEdit = Boolean(slug);
  const navigate = useNavigate();

  const { data: existing } = useProduct(slug ?? "");
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.items ?? [];
  const { mutate: create, isPending: isCreating } = useCreateProduct();
  const { mutate: update, isPending: isUpdating } = useUpdateProduct();
  const { mutate: uploadImage, isPending: isUploading } = useUploadImage();

  const isPending = isCreating || isUpdating;

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: { status: "in_stock" as const, is_featured: false, stock_quantity: 0, price: 0 },
  });

  useEffect(() => {
    if (existing) {
      reset({
        name: existing.name,
        description: existing.description ?? "",
        price: existing.price,
        discount_price: existing.discount_price,
        stock_quantity: existing.stock_quantity,
        status: existing.status,
        is_featured: existing.is_featured,
        brand: existing.brand ?? "",
        model: existing.model ?? "",
        category_id: existing.category_id,
      });
    }
  }, [existing, reset]);

  const onSubmit = (data: z.infer<typeof productSchema>) => {
    const payload = { ...data, discount_price: data.discount_price || undefined };
    if (isEdit && existing) {
      update({ id: existing.id, data: payload }, { onSuccess: () => navigate("/admin/products") });
    } else {
      create(payload, { onSuccess: () => navigate("/admin/products") });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    uploadImage(formData);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{isEdit ? "Edit Product" : "New Product"}</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Basic Info</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" {...register("name")} />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" rows={4} {...register("description")} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="brand">Brand</Label>
                    <Input id="brand" {...register("brand")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="model">Model</Label>
                    <Input id="model" {...register("model")} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Pricing & Inventory</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="price">Price (BDT) *</Label>
                    <Input id="price" type="number" step="0.01" {...register("price", { valueAsNumber: true })} />
                    {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="discount_price">Sale Price (BDT)</Label>
                    <Input id="discount_price" type="number" step="0.01" {...register("discount_price", { valueAsNumber: true })} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="stock_quantity">Stock Quantity *</Label>
                  <Input id="stock_quantity" type="number" min="0" {...register("stock_quantity", { valueAsNumber: true })} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Image Upload</CardTitle></CardHeader>
              <CardContent>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="cursor-pointer"
                />
                {isUploading && <p className="text-xs text-muted-foreground mt-2">Uploading...</p>}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Status</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Product Status</Label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in_stock">In Stock</SelectItem>
                          <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...register("is_featured")} className="rounded" />
                  <span className="text-sm">Featured product</span>
                </label>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Category</CardTitle></CardHeader>
              <CardContent>
                <Controller
                  name="category_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ? String(field.value) : ""}
                      onValueChange={(v) => field.onChange(v ? Number(v) : undefined)}
                    >
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </CardContent>
            </Card>

            <Separator />
            <div className="flex gap-3">
              <Button type="submit" className="flex-1" disabled={isPending}>
                {isPending ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/admin/products")}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
