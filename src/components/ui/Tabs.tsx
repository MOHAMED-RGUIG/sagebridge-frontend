import { cn } from "@/lib/utils/cn";

export type TabItem<T extends string> = {
  key: T;
  label: string;
};

export default function Tabs<T extends string>({
  items,
  value,
  onChange,
  className,
}: {
  items: Array<TabItem<T>>;
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {items.map((it) => {
        const active = it.key === value;
        return (
          <button
            key={it.key}
            type="button"
            onClick={() => onChange(it.key)}
            className={cn(
              "h-10 rounded-[14px] px-4 text-[13px] font-semibold transition",
              "border border-border",
              active
                ? "bg-brand text-white shadow-cardSm"
                : "bg-surface text-text/70 hover:bg-surface2"
            )}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
