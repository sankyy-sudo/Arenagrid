// Session-only public data cache. Failed refreshes never erase usable content.
export function createResourceCache<T>(load: () => Promise<T>, staleMs = 30_000) {
  let snapshot: { data: T | undefined; loading: boolean; error: boolean } = { data: undefined, loading: true, error: false };
  const initialSnapshot = snapshot;
  let updatedAt = 0;
  let pending: Promise<void> | undefined;
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach(listener => listener());
  return {
    getSnapshot: () => snapshot,
    getServerSnapshot: () => initialSnapshot,
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    refresh(force = false): Promise<void> {
      if (pending) return pending;
      if (!force && snapshot.data !== undefined && Date.now() - updatedAt < staleMs) return Promise.resolve();
      snapshot = { ...snapshot, loading: snapshot.data === undefined, error: false };
      emit();
      pending = Promise.resolve().then(load).then(data => {
        updatedAt = Date.now();
        snapshot = { data, loading: false, error: false };
      }).catch(() => {
        snapshot = { ...snapshot, loading: false, error: snapshot.data === undefined };
      }).finally(() => { pending = undefined; emit(); });
      return pending;
    }
  };
}
