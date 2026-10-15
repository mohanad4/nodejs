import { Loader2Icon } from "lucide-react";
import { useState, type MouseEvent } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { User } from "@/types/user";

interface DeleteUserDialogProps {
  // The user to delete; null keeps the dialog closed
  user: User | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (user: User) => Promise<void>;
}

export function DeleteUserDialog({ user, onOpenChange, onConfirm }: DeleteUserDialogProps) {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async (e: MouseEvent) => {
    // Keep the dialog open until the request finishes
    e.preventDefault();
    if (!user) return;
    setDeleting(true);
    try {
      await onConfirm(user);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog open={user !== null} onOpenChange={(open) => !deleting && onOpenChange(open)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete user?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete{" "}
            <span className="font-medium text-foreground">{user?.name || user?.email}</span>
            {user?.name && ` (${user.email})`}. This can't be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleConfirm} disabled={deleting}>
            {deleting && <Loader2Icon className="animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
