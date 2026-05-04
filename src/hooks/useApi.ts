import { useCallback, useEffect, useRef, useState } from "react";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseApiResult<T> extends UseApiState<T> {
  refetch(): Promise<void>;
}

export function useApi<T>(fetcher: () => Promise<T>, deps: ReadonlyArray<unknown> = []): UseApiResult<T> {
  const [state, setState] = useState<UseApiState<T>>({ data: null, loading: true, error: null });
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const run = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await fetcherRef.current();
      setState({ data, loading: false, error: null });
    } catch (err) {
      setState({ data: null, loading: false, error: err instanceof Error ? err : new Error(String(err)) });
    }
  }, []);

  useEffect(() => {
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { ...state, refetch: run };
}
