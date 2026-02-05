import { cn } from "@/lib/utils/cn";

export default function Input({
  className,
  label,
  hint,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
}) {
  return (
// Input
<label className="block">
  {label ? (
    <span className="mb-2 block text-[13px] font-semibold text-slate-600">
      {label}
    </span>
  ) : null}

  <input
    {...props}
    className={cn(
      "h-11 w-full rounded-xl bg-white px-4 text-[14px]",
      "border border-[hsl(var(--border))]",
      "shadow-[0_8px_18px_rgba(15,23,42,0.06)]",
      "outline-none transition",
      "placeholder:text-slate-400",
      "focus:border-transparent focus:ring-4 focus:ring-black/5",
      props.disabled && "bg-slate-50 text-slate-500 shadow-none",
      className
    )}
  />
</label>

  );
}
