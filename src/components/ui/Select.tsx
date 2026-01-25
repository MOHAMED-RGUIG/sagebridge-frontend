import { cn } from "@/lib/utils/cn";

export default function Select({
  className,
  label,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      {label ? (
       <span className="mb-2 block text-xl font-bold text-slate-700">
       {label}
     </span>
      ) : null}
      <select
        {...props}
        className={cn(
          "h-11 w-full rounded-[14px] border border-border bg-white px-4 text-[14px] outline-none transition",
          "focus:border-brand focus:ring-4 focus:ring-[rgba(67,24,255,0.10)]",
          className
        )}
      >
        {children}
      </select>
    </label>
  );
}
