import { cn } from "@/lib/utils/cn";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "inverse";
  size?: "sm" | "md" | "lg";
}) {
  return (
    <button
      {...props}
      className={cn(
        // Base
        "inline-flex items-center justify-center gap-2 font-medium uppercase tracking-[2px]",
        "rounded-full transition-all duration-300 ease-out",
        "focus:outline-none",
        
        // Floating shadow feel
        "shadow-[0px_8px_15px_rgba(0,0,0,0.15)]",
        
        size === "sm" && "h-14 px-5 text-[12px]",
        size === "md" && "h-16 px-8 text-[12px]",
        size === "lg" && "h-20 px-10 text-[13px]",

        // 🔥 NEW INVERSE STYLE
        variant === "inverse" &&
          `
          bg-black text-white 
          hover:bg-white hover:text-black
          hover:shadow-[0px_15px_20px_rgba(0,0,0,0.25)]
          hover:-translate-y-[7px]
          active:-translate-y-[1px]
          `,

        // Your existing ones untouched
        variant === "primary" &&
          "bg-brand text-white shadow-cardSm hover:brightness-[0.98] hover:-translate-y-[7px] active:-translate-y-[1px]",
        variant === "secondary" &&
          "border border-border bg-surface text-text shadow-cardSm hover:-translate-y-[7px] active:-translate-y-[1px]",
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
