import { PropsWithChildren } from "react";

export function Card({ children }: PropsWithChildren) {
  return (
    <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
      {children}
    </div>
  );
}
