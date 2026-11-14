"use client";

import { ChevronDownIcon, CircleUserRoundIcon, LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useMe, useSignout } from "@/hooks/useAuth";

export function AppNavbar({ title }: { title: string }) {
  const { data: user, isLoading } = useMe();
  const signout = useSignout();

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background">
      <div className="flex w-full items-center gap-2 px-4 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-1 h-4 data-vertical:self-auto"
        />
        <h1 className="text-sm font-medium">{title}</h1>

        <div className="ml-auto flex items-center gap-3">
          {isLoading ? (
            <Skeleton className="h-8 w-32" />
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="outline" size="sm" />}
              >
                <CircleUserRoundIcon />
                <span className="hidden max-w-32 truncate sm:inline">
                  {user?.name ?? "Admin"}
                </span>
                <ChevronDownIcon className="size-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="grid gap-0.5">
                    <span className="text-sm font-medium">
                      {user?.name ?? "Admin"}
                    </span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {user?.email ?? ""}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signout.mutate()}
                  disabled={signout.isPending}
                >
                  <LogOutIcon />
                  {signout.isPending ? "Signing out..." : "Sign out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => signout.mutate()}
            disabled={signout.isPending}
            className="hidden sm:inline-flex"
          >
            <LogOutIcon />
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
