"use client";

import React from "react";

type Step = {
  id: string;            // ex: "info-generale"
  title: string;         // ex: "Information générale"
  subtitle?: string;     // ex: "Entête"
};

type Props = {
  steps: Step[];
  activeId: string;
  onChange: (id: string) => void;
};

export default function StepperTabs({ steps, activeId, onChange }: Props) {
  const activeIndex = Math.max(
    0,
    steps.findIndex((s) => s.id === activeId)
  );

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Ligne du bas (progress) */}
      <div className="relative px-4 pt-4 hidden">
        <div className="absolute left-4 right-4 top-[42px] h-[2px] bg-slate-200" />
        <div
          className="absolute left-4 top-[42px] h-[2px] bg-[#4318FF] transition-all duration-300"
          style={{
            width:
              steps.length <= 1
                ? "0%"
                : `${(activeIndex / (steps.length - 1)) * 100}%`,
          }}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 px-4 pb-4 pt-3 md:grid-cols-5">
        {steps.map((s, idx) => {
          const isDone = idx < activeIndex;
          const isActive = idx === activeIndex;

          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onChange(s.id)}
              className={[
                "group relative flex w-full items-center gap-3 rounded-2xl p-3 text-left transition",
                "hover:bg-slate-50",
                isActive ? "bg-slate-50" : "bg-transparent",
              ].join(" ")}
            >
              {/* Cercle */}
              <div
                className={[
                  "flex h-11 w-11 items-center justify-center rounded-full border-2 transition",
                  isDone
                    ? "border-[#4318FF] bg-[#4318FF] text-white"
                    : isActive
                    ? "border-[#4318FF] bg-white text-[#4318FF]"
                    : "border-slate-200 bg-white text-slate-500",
                ].join(" ")}
              >
                {isDone ? (
                  // check icon
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span className="text-sm font-semibold">
                    {(idx + 1).toString().padStart(2, "0")}
                  </span>
                )}
              </div>

              {/* Texte */}
              <div className="min-w-0">
                <div
                  className={[
                    "truncate text-sm font-semibold",
                    isActive ? "text-slate-900" : "text-slate-800",
                  ].join(" ")}
                >
                  {s.title}
                </div>
                {s.subtitle ? (
                  <div className="truncate text-xs text-slate-500">
                    {s.subtitle}
                  </div>
                ) : null}
              </div>

              {/* petit chevron style "étape" */}
              <div className="ml-auto hidden md:block">
                <svg
                  className={[
                    "h-5 w-5 transition",
                    isActive ? "text-[#4318FF]" : "text-slate-300",
                  ].join(" ")}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
