import { Context, createContext, useContext } from "react";

export type RequiredContext<T> = Context<T | undefined>;

export function createRequiredContext<T>(): RequiredContext<T> {
  return createContext<T | undefined>(undefined);
}

export function useRequiredContext<T>(context: RequiredContext<T>): T {
  const value = useContext(context);

  if (value === undefined) {
    throw `${context.displayName} used without a provider!`;
  }

  return value;
}
