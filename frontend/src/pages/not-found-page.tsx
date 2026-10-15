import { Link } from "react-router";

import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-24 text-center">
      <p className="text-4xl font-semibold">404</p>
      <p className="text-muted-foreground">This page doesn't exist.</p>
      <Button asChild variant="outline">
        <Link to="/">Go home</Link>
      </Button>
    </div>
  );
}
