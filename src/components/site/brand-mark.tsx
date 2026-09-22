export function BrandMark({
  markClassName = "h-10 w-10 bg-maroon",
}: {
  markClassName?: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
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
      <div className="min-w-0">
        <p className="font-brand text-[22px] leading-none tracking-[0.04em] text-navy">Nexus Science</p>
        <p className="text-[10px] font-extrabold tracking-[0.08em] text-[#9CA3AF]">CONSULTORIA ONLINE</p>
      </div>
    </div>
  );
}
