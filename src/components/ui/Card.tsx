import { cn } from "@/lib/utils/cn";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border border-border bg-surface shadow-card",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4  border-b border-border px-6 py-5">
      <div>
        <div className="text-2xl md:text-2xl font-extrabold tracking-tight
          bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600
          bg-clip-text text-transparent">{title}</div>
        {subtitle ? <div className="mt-0.5 text-[12px] text-muted">{subtitle}</div> : null}
      </div>
      {right}
    </div>
  );
}

export function CardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("p-6 ", className)}>{children}</div>;
}
