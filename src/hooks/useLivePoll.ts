import { useEffect, useState } from "react";

interface UseLivePollOptions {
  ms?: number;
  enabled?: boolean;
  refetchOnFocus?: boolean;
}

export function useLivePoll<T>(
  fetcher: () => Promise<T>,
  options: UseLivePollOptions = {},
): T | null {
  const { ms = 60_000, enabled = true, refetchOnFocus = true } = options;
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    const run = async () => {
      try {
        const value = await fetcher();
        if (!cancelled) setData(value);
      } catch {
        // silencio intencional — un indicador no debe gritar
      }
    };

    run();
    const handle = window.setInterval(run, ms);
    const onFocus = () => run();
    if (refetchOnFocus) {
      window.addEventListener("focus", onFocus);
    }

    return () => {
      cancelled = true;
      window.clearInterval(handle);
      if (refetchOnFocus) {
        window.removeEventListener("focus", onFocus);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ms]);

  return data;
}
