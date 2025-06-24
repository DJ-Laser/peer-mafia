import { useCallback, useState } from "react";

export function useCopy(
  text: string,
  animationDuration: number,
): [() => void, boolean] {
  const [copyTimeout, setCopyTimeout] = useState<number | undefined>(undefined);

  const copyFn = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      const timeout = setTimeout(() => {
        setCopyTimeout(undefined);
      }, animationDuration);

      setCopyTimeout((oldTimeout) => {
        clearTimeout(oldTimeout);
        return timeout;
      });
    });
  }, [animationDuration, text]);

  return [copyFn, copyTimeout !== undefined];
}
