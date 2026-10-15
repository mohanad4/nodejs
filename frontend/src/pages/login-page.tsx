import { Loader2Icon } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";

import { getToken, login, saveSession } from "@/api/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LoginInput } from "@/types/auth";

type FieldErrors = Partial<Record<keyof LoginInput, string>>;

function validate(values: LoginInput): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.email.trim()) errors.email = "Email is required";
  else if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = "Enter a valid email";
  if (!values.password) errors.password = "Password is required";
  return errors;
}

export function LoginPage() {
  const [values, setValues] = useState<LoginInput>({ email: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // RequireAuth passes the page the user was trying to open
  const redirectTo = (location.state as { from?: string } | null)?.from ?? "/";

  const setField = (field: keyof LoginInput, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      const response = await login({ ...values, email: values.email.trim() });
      console.log("Login response:", response);
      saveSession(response);
      toast.success(response.message);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      console.log("Login error:", error);
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  // Already logged in: skip the form
  if (getToken()) return <Navigate to={redirectTo} replace />;

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sign in</CardTitle>
          <CardDescription>Enter your email and password to continue.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} noValidate className="grid gap-4">
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={values.email}
                onChange={(e) => setField("email", e.target.value)}
                aria-invalid={!!errors.email}
                autoComplete="email"
                autoFocus
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={values.password}
                onChange={(e) => setField("password", e.target.value)}
                aria-invalid={!!errors.password}
                autoComplete="current-password"
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting && <Loader2Icon className="animate-spin" />}
              Sign in
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
