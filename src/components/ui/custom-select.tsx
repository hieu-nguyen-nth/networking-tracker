"use client";

import { useEffect, useId, useRef, useState } from "react";

type SelectOption<Value extends string> = Readonly<{
  label: string;
  value: Value;
}>;

type CustomSelectProps<Value extends string> = Readonly<{
  ariaLabel: string;
  onChange: (value: Value) => void;
  options: readonly SelectOption<Value>[];
  value: Value;
}>;

export function CustomSelect<Value extends string>({
  ariaLabel,
  onChange,
  options,
  value,
}: CustomSelectProps<Value>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    function closeOnOutsideClick(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, []);

  function selectOption(optionValue: Value) {
    onChange(optionValue);
    setIsOpen(false);
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        aria-controls={listboxId}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        className="flex min-h-11 w-full items-center justify-between gap-3 border border-[#C9C8BD] bg-[#FAFAF5] px-3 py-2 text-left text-sm font-normal tracking-normal text-[#474744] transition-colors hover:border-[#A71D31] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A71D31]"
        onClick={() => setIsOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setIsOpen(false);
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
        type="button"
      >
        <span>{selected.label}</span>
        <span aria-hidden="true" className={`text-[#75756F] transition-transform ${isOpen ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>

      {isOpen ? (
        <div
          aria-label={ariaLabel}
          className="absolute z-30 mt-1 w-full border border-[#C9C8BD] bg-[#FAFAF5] p-1 shadow-[0_12px_30px_rgba(25,25,24,0.14)]"
          id={listboxId}
          role="listbox"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                aria-selected={isSelected}
                className={`block min-h-10 w-full px-3 py-2 text-left text-sm font-normal tracking-normal transition-colors focus-visible:outline-none ${
                  isSelected
                    ? "bg-[#EAD1D6] text-[#711524]"
                    : "bg-[#FAFAF5] text-[#474744] hover:bg-[#ECEBE0] hover:text-[#191918] focus-visible:bg-[#ECEBE0]"
                }`}
                key={option.value}
                onClick={() => selectOption(option.value)}
                role="option"
                type="button"
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
