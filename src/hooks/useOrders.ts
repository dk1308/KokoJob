import { useCallback, useEffect, useState } from 'react';
import { loadOrders, saveOrder } from '../data/api';
import type { Order } from '../types';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setState('loading');
    setError(null);
    try {
      setOrders(await loadOrders());
      setState('ready');
    } catch (e) {
      setError((e as Error).message);
      setState('error');
    }
  }, []);

  useEffect(() => { void reload(); }, [reload]);

  const update = useCallback(async (id: string, patch: Partial<Order>) => {
    // Only the fields this edit touches are remembered, so a failed save
    // rolls back itself and never another edit that landed meanwhile.
    let before: Partial<Order> = {};
    setOrders(prev => prev.map(o => {
      if (o.id !== id) return o;
      before = Object.fromEntries(
        [...Object.keys(patch), 'updatedAt'].map(k => [k, o[k as keyof Order]]),
      );
      return { ...o, ...patch, updatedAt: new Date().toISOString() };
    }));
    try {
      // The server echoes the static record, so only take what this edit
      // changed; earlier edits to other fields live only in this state.
      const saved = await saveOrder(id, patch);
      setOrders(prev => prev.map(o =>
        o.id === id ? { ...o, ...patch, updatedAt: saved.updatedAt } : o,
      ));
    } catch (e) {
      setOrders(prev => prev.map(o => (o.id === id ? { ...o, ...before } : o)));
      throw e;                                       // caller shows the toast
    }
  }, []);

  return { orders, state, error, reload, update };
}
