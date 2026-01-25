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
    <label className="block">
      {label ? (
        <span className="mb-2 block text-xl font-bold text-slate-700">
  {label}
</span>
      ) : null}
      <input
        {...props}
        className={cn(
          "h-11 w-full rounded-[14px] border border-border bg-white px-4 text-[14px] outline-none transition",
          "placeholder:text-muted2",
          "focus:border-brand focus:ring-4 focus:ring-[rgba(67,24,255,0.10)]",
          props.disabled && "bg-surface2 text-muted",
          className
        )}
      />
      {hint ? <span className="mt-2 block text-[12px] text-muted">{hint}</span> : null}
    </label>
  );
}
