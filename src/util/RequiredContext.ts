import { Context, createContext, use } from "react";

export type RequiredContext<T> = Context<T | undefined>;

export function createRequiredContext<T>(): RequiredContext<T> {
  return createContext<T | undefined>(undefined);
}

export function useRequiredContext<T>(context: RequiredContext<T>): T {
  const value = use(context);

  if (value === undefined) {
    throw `${context.displayName} used without a provider!`;
  }

  return value;
}
