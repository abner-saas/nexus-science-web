export function BrandMark({
  markClassName = "h-9 w-9 bg-maroon max-[374px]:h-8 max-[374px]:w-8 sm:h-10 sm:w-10",
}: {
  markClassName?: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
      <div
        aria-hidden
        className={`shrink-0 ${markClassName}`}
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
      {/* Truncar em vez de quebrar: a assinatura nunca vira duas linhas nem invade a nav. */}
      <div className="min-w-0">
        <p className="truncate font-brand text-[19px] leading-none tracking-[0.04em] text-navy max-[374px]:text-[16px] sm:text-[22px]">
          Nexus Science
        </p>
        <p className="mt-0.5 truncate text-[9px] font-extrabold tracking-[0.08em] text-[#6B7280] max-[374px]:text-[8px] sm:text-[10px]">
          CONSULTORIA ONLINE
        </p>
      </div>
    </div>
  );
}
