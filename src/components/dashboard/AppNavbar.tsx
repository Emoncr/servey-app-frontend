"use client";

import { LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSignout } from "@/hooks/useAuth";

export function AppNavbar({ title }: { title: string }) {
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signout.mutate()}
            disabled={signout.isPending}
            className="inline-flex"
          >
            <LogOutIcon />
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
