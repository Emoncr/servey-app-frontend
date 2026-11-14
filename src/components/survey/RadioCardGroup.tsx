"use client";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function RadioCardGroup({
  options,
  value,
  onValueChange,
  idPrefix,
}: {
  options: string[];
  value: string | undefined;
  onValueChange: (value: string) => void;
  idPrefix: string;
}) {
  return (
    <RadioGroup
      value={value ?? null}
      onValueChange={onValueChange}
      className="grid w-full gap-3 sm:grid-cols-2"
    >
      {options.map((option, index) => {
        const id = `${idPrefix}-${index}`;
        const checked = value === option;

        return (
          <Label
            key={option}
            htmlFor={id}
            className={cn(
              "flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border px-4 py-2.5 text-sm font-normal transition-colors",
              checked
                ? "border-sky-600 bg-sky-50 text-slate-900"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            )}
          >
            <RadioGroupItem
              id={id}
              value={option}
              className="border-slate-300 data-checked:border-sky-600 data-checked:bg-sky-600"
            />
            <span>{option}</span>
          </Label>
        );
      })}
    </RadioGroup>
  );
}
