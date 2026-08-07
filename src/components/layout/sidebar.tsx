"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Wallet,
  ShieldAlert,
  Dumbbell,
  HeartPulse,
  Ruler,
  CreditCard,
  Layers,
  Sparkles,
  LogOut,
  Menu,
  X,
  Settings,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { canAccess, ROLE_LABELS } from "@/lib/roles";
import { useMemo, useState } from "react";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/crm", label: "CRM de Alunos", icon: Users },
  { href: "/financeiro", label: "Financeiro", icon: Wallet },
  { href: "/retencao", label: "Retenção & Churn", icon: ShieldAlert },
  { href: "/treinos", label: "Treinos", icon: Dumbbell },
  { href: "/biofeedback", label: "Biofeedback", icon: HeartPulse },
  { href: "/avaliacao", label: "Avaliação Física", icon: Ruler },
  { href: "/pagamentos", label: "Pagamentos", icon: CreditCard },
  { href: "/planos", label: "Planos dos Alunos", icon: Layers },
  { href: "/ia", label: "IA & Insights", icon: Sparkles },
  { href: "/aluno", label: "App do Aluno", icon: Smartphone },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [open, setOpen] = useState(false);

  const visibleNav = useMemo(
    () => NAV.filter((item) => canAccess(user?.role, item.href)),
    [user?.role],
  );

  async function logout() {
    try {
      await api.logout();
    } finally {
      setUser(null);
      router.replace("/login");
    }
  }

  const nav = (
    <nav className="flex flex-1 flex-col px-2.5 py-2.5">
      <p className="px-1 pb-1.5 pt-2 text-[10px] font-bold uppercase tracking-[0.1em] text-black/30">
        Menu Principal
      </p>
      {visibleNav.map((item) => {
        const active = pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn("ns-nav-item mb-0.5", active && "ns-nav-item-active")}
          >
            <Icon size={15} strokeWidth={active ? 2.25 : 1.8} color={active ? "#FFFFFF" : "#002060"} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <button
        type="button"
        className="fixed left-4 top-4 z-40 rounded-xl border border-line bg-white p-2 shadow-card md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
      >
        <Menu size={20} className="text-navy" />
      </button>

      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setOpen(false)}
          aria-label="Fechar menu"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-56 flex-col border-r border-line bg-white transition-transform md:static md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-[82px] shrink-0 items-center justify-between border-b-[1.5px] border-line px-[18px]">
          <div className="flex min-w-0 items-center gap-2.5">
            <div
              aria-hidden
              className="h-[42px] w-[42px] shrink-0 bg-maroon"
              style={{
                WebkitMaskImage: "url(/nexus-mark.png)",
                maskImage: "url(/nexus-mark.png)",
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            />
            <div className="min-w-0">
              <p className="font-brand text-[22px] leading-none tracking-[0.04em] text-navy">
                Nexus Science
              </p>
              <p className="text-[10px] font-extrabold tracking-[0.08em] text-[#9CA3AF]">
                CONSULTORIA ONLINE
              </p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-lg p-1 text-black/50 md:hidden"
            onClick={() => setOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {nav}

        <div className="border-t border-black/[0.08] p-2.5">
          <div className="mb-2 truncate px-3 py-1 text-sm">
            <p className="font-medium text-ink">{user?.name}</p>
            <p className="text-[11px] text-black/45">
              {user?.role ? ROLE_LABELS[user.role] : ""}
            </p>
          </div>
          {canAccess(user?.role, "/configuracoes") ? (
            <Link
              href="/configuracoes"
              onClick={() => setOpen(false)}
              className={cn(
                "ns-nav-item mb-0.5",
                pathname.startsWith("/configuracoes") && "ns-nav-item-active",
              )}
            >
              <Settings
                size={15}
                color={pathname.startsWith("/configuracoes") ? "#FFFFFF" : "#002060"}
              />
              Configurações
            </Link>
          ) : null}
          <button type="button" onClick={logout} className="ns-nav-item">
            <LogOut size={15} color="#002060" />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}
