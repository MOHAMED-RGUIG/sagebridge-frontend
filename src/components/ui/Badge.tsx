import { cn } from "@/lib/utils/cn";

export default function Badge({
  children,
  tone = "slate",
  className,
}: {
  children: React.ReactNode;
  tone?: "slate" | "green" | "blue" | "amber" | "red";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold",
        "border border-border/70 bg-white/70 backdrop-blur",
        tone === "slate" && "text-text/70",
        tone === "green" && "border-[rgba(22,163,74,0.25)] bg-[rgba(22,163,74,0.10)] text-[rgb(22,163,74)]",
        tone === "blue" && "border-[rgba(91,90,247,0.30)] bg-[rgba(91,90,247,0.12)] text-[rgb(91,90,247)]",
        tone === "amber" && "border-[rgba(245,158,11,0.25)] bg-[rgba(245,158,11,0.12)] text-[rgb(180,83,9)]",
        tone === "red" && "border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.10)] text-[rgb(239,68,68)]",
        className
      )}
    >
      {children}
    </span>
  );
}
