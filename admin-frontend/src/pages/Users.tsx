import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, MoreHorizontal, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import {
  userCreateSchema, userEditSchema,
  type UserCreateInput, type UserEditInput,
} from "@/lib/validators";

interface AdminUser {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  is_admin: boolean;
  is_superuser: boolean;
  created_at: string;
}

interface AdminUserList {
  items: AdminUser[];
  total: number;
  page: number;
  page_size: number;
}

export default function Users() {
  const me = useAuthStore((s) => s.user);
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [deleting, setDeleting] = useState<AdminUser | null>(null);

  const params = new URLSearchParams({ page: String(page), page_size: "20" });
  if (search) params.set("search", search);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users", page, search],
    queryFn: () => apiFetch<AdminUserList>(`/api/v1/admin/users?${params}`),
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin", "users"] });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/api/v1/admin/users/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("User deleted");
      setDeleting(null);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </div>
          {me?.is_superuser && (
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" /> Add User
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9"
            />
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-12">Loading…</TableCell></TableRow>
                )}
                {!isLoading && data?.items.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-12">No users found.</TableCell></TableRow>
                )}
                {data?.items.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{u.full_name || "N/A"}</span>
                        {u.id === me?.id && <Badge variant="outline" className="text-xs">You</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                    <TableCell>
                      {u.is_superuser
                        ? <Badge>Superuser</Badge>
                        : u.is_admin
                          ? <Badge variant="outline">Admin</Badge>
                          : <Badge variant="secondary">User</Badge>}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${u.is_active ? "bg-emerald-500" : "bg-muted-foreground/50"}`} />
                        {u.is_active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {me?.is_superuser ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted">
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => setEditing(u)}>Edit</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              disabled={u.id === me?.id}
                              onSelect={() => setDeleting(u)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {data && data.total > data.page_size && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Page {data.page} of {Math.max(1, Math.ceil(data.total / data.page_size))}
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page * data.page_size >= data.total}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateUserDialog open={createOpen} onOpenChange={setCreateOpen} onSaved={invalidate} />
      <EditUserDialog user={editing} onClose={() => setEditing(null)} onSaved={invalidate} />
      <ConfirmDialog
        open={!!deleting}
        title={`Delete ${deleting?.full_name}?`}
        description="This permanently removes the user."
        confirmLabel="Delete"
        confirmVariant="destructive"
        onCancel={() => setDeleting(null)}
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}

function CreateUserDialog({
  open, onOpenChange, onSaved,
}: { open: boolean; onOpenChange: (v: boolean) => void; onSaved: () => void }) {
  const form = useForm<UserCreateInput>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: { is_admin: false, is_superuser: false, is_active: true, full_name: "", email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: (input: UserCreateInput) =>
      apiFetch("/api/v1/admin/users", { method: "POST", body: input }),
    onSuccess: () => {
      toast.success("User created");
      form.reset();
      onOpenChange(false);
      onSaved();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) form.reset(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>Create a new account with the chosen role.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="full_name">Full name</Label>
            <Input id="full_name" {...form.register("full_name")} />
            {form.formState.errors.full_name && <p className="text-xs text-destructive">{form.formState.errors.full_name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register("email")} />
            {form.formState.errors.email && <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...form.register("password")} />
            {form.formState.errors.password && <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>}
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox {...form.register("is_admin")} /> Admin
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox {...form.register("is_superuser")} /> Superuser
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox {...form.register("is_active")} /> Active
            </label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditUserDialog({
  user, onClose, onSaved,
}: { user: AdminUser | null; onClose: () => void; onSaved: () => void }) {
  const form = useForm<UserEditInput>({
    resolver: zodResolver(userEditSchema),
    values: user
      ? { full_name: user.full_name, email: user.email, is_admin: user.is_admin, is_superuser: user.is_superuser, is_active: user.is_active, password: "" }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: (input: UserEditInput) => {
      const body: Partial<UserEditInput> = { ...input };
      if (!body.password) delete body.password;
      return apiFetch(`/api/v1/admin/users/${user!.id}`, { method: "PATCH", body });
    },
    onSuccess: () => {
      toast.success("User updated");
      onClose();
      onSaved();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={!!user} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update profile, role, and status.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="edit_full_name">Full name</Label>
            <Input id="edit_full_name" {...form.register("full_name")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit_email">Email</Label>
            <Input id="edit_email" type="email" {...form.register("email")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit_password">New password (optional)</Label>
            <Input id="edit_password" type="password" placeholder="Leave blank to keep current" {...form.register("password")} />
            {form.formState.errors.password && <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>}
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox {...form.register("is_admin")} /> Admin
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox {...form.register("is_superuser")} /> Superuser
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox {...form.register("is_active")} /> Active
            </label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ConfirmDialog({
  open, title, description, confirmLabel, confirmVariant = "default",
  onCancel, onConfirm, isPending,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  confirmVariant?: "default" | "destructive";
  onCancel: () => void;
  onConfirm: () => void;
  isPending?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onCancel(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button variant={confirmVariant} onClick={onConfirm} disabled={isPending}>
            {isPending ? "Working..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
