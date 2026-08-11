"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { canAccess } from "@/lib/roles";
import { useAuthStore } from "@/store/auth";
import { Sidebar } from "./sidebar";
import { usePathname } from "next/navigation";

function LiveDate() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="hidden rounded-lg border border-line bg-input px-3 py-1.5 font-mono text-xs text-black/42 sm:inline">
      {now.toLocaleDateString("pt-BR", {
        weekday: "short",
        day: "2-digit",
        month: "short",
      })}
    </span>
  );
}

export function AppShell({
  title,
  subtitle,
  children,
  actions,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, hydrated, setUser, setHydrated } = useAuthStore();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.me();
        if (!cancelled) setUser(res.user);
        if (!res.user) router.replace("/login");
        else if (res.user.role === "STUDENT") router.replace("/aluno");
      } catch {
        if (!cancelled) {
          setUser(null);
          router.replace("/login");
        }
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router, setUser, setHydrated]);

  useEffect(() => {
    if (!hydrated || !user || user.role === "STUDENT") return;
    if (pathname && !canAccess(user.role, pathname)) {
      router.replace("/dashboard");
    }
  }, [hydrated, user, router, pathname]);

  if (!hydrated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface text-sm text-black/50">
        Carregando...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-input">
      <Sidebar />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col bg-input">
        <header className="sticky top-0 z-20 flex h-[82px] items-center justify-between border-b-[1.5px] border-line bg-white px-4 md:px-6">
          <div className="min-w-0 pl-12 md:pl-0">
            <h1 className="truncate font-title text-lg font-bold leading-tight text-ink md:text-[18px]">
              {title}
            </h1>
            {subtitle ? <p className="mt-0.5 truncate text-sm text-black/60">{subtitle}</p> : null}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {actions}
            <LiveDate />
          </div>
        </header>
        <main className="section-enter flex-1 overflow-y-auto px-4 py-6 md:px-6">{children}</main>
      </div>
    </div>
  );
}
