import { ClassNameValue, twMerge } from "tailwind-merge";

export function cardClasses(
  secondary?: boolean,
  ...customClasses: ClassNameValue[]
): string {
  const colors = secondary
    ? "rounded-lg bg-slate-700/50 border-slate-600"
    : "rounded-2xl bg-slate-800 border-slate-700";

  const className = twMerge(colors, "p-8 border", customClasses);
  return className;
}
