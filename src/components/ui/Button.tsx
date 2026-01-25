import { cn } from "@/lib/utils/cn";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[14px] font-semibold transition",
        "focus:outline-none focus:ring-2 focus:ring-[rgba(67,24,255,0.25)]",
        size === "sm" && "h-9 px-3 text-[13px]",
        size === "md" && "h-11 px-5 text-[14px]",
        size === "lg" && "h-12 px-6 text-[14px]",
        variant === "primary" &&
          "bg-brand text-white shadow-cardSm hover:brightness-[0.98] active:translate-y-[1px]",
        variant === "secondary" &&
          "border border-border bg-surface text-text shadow-cardSm hover:bg-surface2",
        variant === "ghost" && "bg-transparent text-text/80 hover:bg-surface2",
        variant === "danger" &&
          "bg-danger text-white shadow-cardSm hover:brightness-[0.98]",
        props.disabled && "cursor-not-allowed opacity-60",
        className
      )}
    >
      {children}
    </button>
  );
}
