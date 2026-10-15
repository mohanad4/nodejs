import { Loader2Icon } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { User } from "@/types/user";

export interface UserFormValues {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // null = add a new user, otherwise edit this user
  user: User | null;
  onSubmit: (values: UserFormValues) => Promise<void>;
}

export function UserFormDialog({ open, onOpenChange, user, onSubmit }: UserFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{user ? "Edit user" : "Add user"}</DialogTitle>
          <DialogDescription>
            {user ? `Update the details for ${user.name || user.email}.` : "Create a new user account."}
          </DialogDescription>
        </DialogHeader>
        {/* DialogContent unmounts when closed, so the form state resets on every open */}
        <UserForm user={user} onSubmit={onSubmit} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

type FieldErrors = Partial<Record<keyof UserFormValues, string>>;

function validate(values: UserFormValues, isEdit: boolean): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.name.trim()) errors.name = "Name is required";
  if (!values.email.trim()) errors.email = "Email is required";
  else if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) errors.email = "Enter a valid email";
  if (values.phone && !/^\+?[0-9\s-]{6,}$/.test(values.phone.trim()))
    errors.phone = "Enter a valid phone number";
  // Password is required when adding, optional when editing
  if (!isEdit || values.password) {
    if (values.password.length < 6) errors.password = "At least 6 characters";
  }
  return errors;
}

interface UserFormProps {
  user: User | null;
  onSubmit: (values: UserFormValues) => Promise<void>;
  onCancel: () => void;
}

function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
  const isEdit = user !== null;
  const [values, setValues] = useState<UserFormValues>({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    password: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const setField = (field: keyof UserFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validate(values, isEdit);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      await onSubmit({
        ...values,
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
      <Field label="Name" id="name" error={errors.name}>
        <Input
          id="name"
          value={values.name}
          onChange={(e) => setField("name", e.target.value)}
          aria-invalid={!!errors.name}
          autoFocus
        />
      </Field>

      <Field label="Email" id="email" error={errors.email}>
        <Input
          id="email"
          type="email"
          value={values.email}
          onChange={(e) => setField("email", e.target.value)}
          aria-invalid={!!errors.email}
          autoComplete="off"
        />
      </Field>

      <Field label="Phone" id="phone" error={errors.phone} hint="Optional.">
        <Input
          id="phone"
          type="tel"
          value={values.phone}
          onChange={(e) => setField("phone", e.target.value)}
          aria-invalid={!!errors.phone}
          autoComplete="off"
        />
      </Field>

      <Field
        label="Password"
        id="password"
        error={errors.password}
        hint={isEdit ? "Leave blank to keep the current password." : undefined}
      >
        <Input
          id="password"
          type="password"
          value={values.password}
          onChange={(e) => setField("password", e.target.value)}
          aria-invalid={!!errors.password}
          autoComplete="new-password"
        />
      </Field>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2Icon className="animate-spin" />}
          {isEdit ? "Save changes" : "Add user"}
        </Button>
      </DialogFooter>
    </form>
  );
}

interface FieldProps {
  label: string;
  id: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

function Field({ label, id, error, hint, children }: FieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : (
        hint && <p className="text-sm text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}
