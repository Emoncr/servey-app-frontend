import Link from "next/link";
import { ClipboardListIcon } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col bg-muted/40">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Link href="/survey" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ClipboardListIcon className="size-4" />
          </span>
          <span className="text-sm font-semibold tracking-tight">
            Survey Admin
          </span>
        </Link>
        <Link
          href="/survey"
          className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Open public survey
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">{children}</div>
      </main>
      <footer className="mx-auto w-full max-w-6xl px-4 py-5 text-center text-xs text-muted-foreground sm:px-6">
        Student information survey platform
      </footer>
    </div>
  );
}
