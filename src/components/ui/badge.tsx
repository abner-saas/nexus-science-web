import { cn } from "@/lib/utils";
import { STATUS_META } from "@/lib/theme";

export function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status as keyof typeof STATUS_META];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-[0.02em]",
      )}
      style={{
        color: meta?.color ?? "#6B7280",
        background: meta?.bg ?? "rgba(107,114,128,0.12)",
      }}
    >
      {status}
    </span>
  );
}
