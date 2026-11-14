import type { LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  isLoading = false,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  isLoading?: boolean;
}) {
  return (
    <Card size="sm">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div className="grid gap-1">
          <CardDescription>{title}</CardDescription>
          {isLoading ? (
            <Skeleton className="h-7 w-20" />
          ) : (
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {value}
            </CardTitle>
          )}
        </div>
        <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Icon className="size-4" />
        </span>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
