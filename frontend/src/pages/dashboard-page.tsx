import { UsersIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

import { getUsers } from "@/api/users";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardPage() {
  const [userCount, setUserCount] = useState<number | null>(null);

  useEffect(() => {
    getUsers()
      .then((users) => setUserCount(users.length))
      .catch(() => setUserCount(null));
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Link to="/users">
        <Card className="transition-colors hover:bg-muted/50">
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <UsersIcon className="size-4" /> Total users
            </CardDescription>
            <CardTitle className="text-3xl tabular-nums">{userCount ?? "—"}</CardTitle>
          </CardHeader>
        </Card>
      </Link>
    </div>
  );
}
