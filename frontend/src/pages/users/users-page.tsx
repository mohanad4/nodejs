import { PencilIcon, PlusIcon, SearchIcon, Trash2Icon, UsersIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { deleteUser, getUsers, saveUser } from "@/api/users";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { User } from "@/types/user";

import { DeleteUserDialog } from "./delete-user-dialog";
import { UserFormDialog, type UserFormValues } from "./user-form-dialog";

const errorMessage = (err: unknown) => (err instanceof Error ? err.message : "Something went wrong");

// name is optional in the database, so fall back to the email
const displayName = (user: User) => user.name || user.email;

const initials = (name: string) =>
  name
    .split(/[\s@.]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  // Bump to fetch the list again (e.g. "Try again")
  const [reloadKey, setReloadKey] = useState(0);
  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  useEffect(() => {
    let ignore = false;
    getUsers()
      .then((data) => !ignore && setUsers(data))
      .catch((err) => !ignore && setLoadError(errorMessage(err)))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  const retryLoad = () => {
    setLoading(true);
    setLoadError(null);
    setReloadKey((k) => k + 1);
  };

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      [u.name, u.email, u.phone].some((field) => field?.toLowerCase().includes(q))
    );
  }, [users, search]);

  const openAdd = () => {
    setEditingUser(null);
    setFormOpen(true);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setFormOpen(true);
  };

  const handleSubmit = async (values: UserFormValues) => {
    try {
      const { message } = await saveUser({
        // With an id the backend updates that user, without one it creates a new user
        id: editingUser?.id,
        name: values.name,
        email: values.email,
        phone: values.phone,
        // Only send the password if one was typed (blank keeps the current one when editing)
        ...(values.password && { password: values.password }),
      });
      // Refetch quietly (no skeleton) so the row shows the server's values
      setUsers(await getUsers());
      toast.success(message);
      setFormOpen(false);
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const handleDelete = async (user: User) => {
    try {
      await deleteUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setDeletingUser(null);
      toast.success(`${displayName(user)} deleted`);
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="grid gap-1">
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage the people who can access the system.</CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-auto">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 sm:w-64"
              />
            </div>
            <Button onClick={openAdd}>
              <PlusIcon /> Add user
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Phone</TableHead>
                  <TableHead className="hidden md:table-cell">Created</TableHead>
                  <TableHead className="w-0 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Skeleton className="size-8 rounded-full" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="ml-auto h-7 w-36" /></TableCell>
                    </TableRow>
                  ))
                ) : loadError ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center">
                      <p className="mb-2 text-destructive">{loadError}</p>
                      <Button variant="outline" size="sm" onClick={retryLoad}>
                        Try again
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                      <UsersIcon className="mx-auto mb-2 size-6" />
                      {search ? "No users match your search." : "No users yet."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarFallback className="text-xs">{initials(displayName(user))}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.name ?? "—"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell className="hidden text-muted-foreground lg:table-cell">
                        {user.phone ?? "—"}
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground md:table-cell">
                        {formatDate(user.createdAt)}
                      </TableCell>
                      <TableCell>
                        {/* Labels hide on small screens; aria-label keeps the buttons accessible */}
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEdit(user)}
                            aria-label={`Edit ${displayName(user)}`}
                          >
                            <PencilIcon /> <span className="hidden sm:inline">Edit</span>
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeletingUser(user)}
                            aria-label={`Delete ${displayName(user)}`}
                          >
                            <Trash2Icon /> <span className="hidden sm:inline">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <UserFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        user={editingUser}
        onSubmit={handleSubmit}
      />
      <DeleteUserDialog
        user={deletingUser}
        onOpenChange={(open) => !open && setDeletingUser(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}
