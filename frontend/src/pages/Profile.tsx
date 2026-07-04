import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS_COLORS } from "@/lib/constants";
import { profileUpdateSchema, changePasswordSchema, type ProfileUpdateInput, type ChangePasswordInput } from "@/lib/validators";
import { useAuthStore } from "@/store/authStore";
import { useUpdateProfile, useChangePassword } from "@/hooks/useAuth";
import { useMyOrders } from "@/hooks/useOrders";

function AccountInfoCard() {
  const user = useAuthStore((s) => s.user);
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: { full_name: user?.full_name ?? "", email: user?.email ?? "" },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Info</CardTitle>
        <CardDescription>Update your name and email address.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit((data) => updateProfile(data))} className="space-y-4 max-w-sm">
          <div className="space-y-1.5">
            <Label htmlFor="full_name">Full Name</Label>
            <Input id="full_name" {...register("full_name")} />
            {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ChangePasswordCard() {
  const { mutate: changePassword, isPending } = useChangePassword();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = (data: ChangePasswordInput) => {
    changePassword(data, { onSuccess: () => reset() });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Update the password used to sign in.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm">
          <div className="space-y-1.5">
            <Label htmlFor="current_password">Current Password</Label>
            <Input id="current_password" type="password" {...register("current_password")} />
            {errors.current_password && <p className="text-xs text-destructive">{errors.current_password.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new_password">New Password</Label>
            <Input id="new_password" type="password" {...register("new_password")} />
            {errors.new_password && <p className="text-xs text-destructive">{errors.new_password.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm_password">Confirm New Password</Label>
            <Input id="confirm_password" type="password" {...register("confirm_password")} />
            {errors.confirm_password && <p className="text-xs text-destructive">{errors.confirm_password.message}</p>}
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function MyOrdersCard() {
  const { data, isLoading } = useMyOrders({ page_size: 5 });
  const orders = data?.items ?? [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>My Orders</CardTitle>
          <CardDescription>Track the progress of your recent orders.</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/orders">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
          </div>
        )}

        {!isLoading && orders.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
            <Button asChild><Link to="/products">Start Shopping</Link></Button>
          </div>
        )}

        <div className="space-y-3">
          {orders.map((order, i) => (
            <div key={order.id}>
              {i > 0 && <Separator className="mb-3" />}
              <Link to={`/orders/${order.id}`} className="flex items-center justify-between gap-4 hover:opacity-80 transition-opacity">
                <div>
                  <p className="text-sm font-medium">Order #{order.id}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge
                    className={ORDER_STATUS_COLORS[order.status] ?? ""}
                    variant="outline"
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                  <span className="font-semibold text-sm">{formatPrice(order.total_amount)}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Profile() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        {user && <p className="text-sm text-muted-foreground mt-1">{user.full_name} &middot; {user.email}</p>}
      </div>
      <MyOrdersCard />
      <AccountInfoCard />
      <ChangePasswordCard />
    </div>
  );
}
