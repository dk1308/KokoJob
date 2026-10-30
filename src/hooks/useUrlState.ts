import { useCallback, useEffect, useState } from 'react';
import { SORTS, STATUSES, type SortKey, type Status } from '../types';

export type UrlState = {
  q: string;
  statuses: Status[];
  sort: SortKey;
  order: string | null;
};

const DEFAULT_SORT: SortKey = 'created-desc';

function read(): UrlState {
  const p = new URLSearchParams(location.search);
  const sort = p.get('sort');
  return {
    q: p.get('q') ?? '',
    statuses: (p.get('status') ?? '').split(',')
      .filter((s): s is Status => (STATUSES as string[]).includes(s)),
    sort: SORTS.some(o => o.key === sort) ? (sort as SortKey) : DEFAULT_SORT,
    order: p.get('order'),
  };
}

function toUrl(s: UrlState): string {
  const p = new URLSearchParams();
  if (s.q) p.set('q', s.q);
  if (s.statuses.length) p.set('status', s.statuses.join(','));
  if (s.sort !== DEFAULT_SORT) p.set('sort', s.sort);
  if (s.order) p.set('order', s.order);
  // URLSearchParams escapes the comma; keep the list readable.
  const qs = p.toString().replace(/%2C/g, ',');
  return qs ? `?${qs}` : location.pathname;
}

/*
 * The URL is the source of truth; React state mirrors it. Filters replace
 * the current history entry (typing shouldn't flood Back). Opening an
 * order pushes one, so browser Back closes the panel.
 */
export function useUrlState() {
  const [state, setState] = useState(read);

  useEffect(() => {
    const onPop = () => setState(read());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const setFilters = useCallback(
    (patch: Partial<Pick<UrlState, 'q' | 'statuses' | 'sort'>>) => {
      const next = { ...read(), ...patch };
      history.replaceState(history.state, '', toUrl(next));
      setState(next);
    },
    [],
  );

  const openOrder = useCallback((id: string) => {
    const next = { ...read(), order: id };
    history.pushState({ panel: true }, '', toUrl(next));
    setState(next);
  }, []);

  const closeOrder = useCallback(() => {
    // Opened in-app: step back so the entry we pushed disappears.
    // Arrived on a deep link: there is nothing of ours to go back to.
    if ((history.state as { panel?: boolean } | null)?.panel) {
      history.back();
    } else {
      const next = { ...read(), order: null };
      history.replaceState(null, '', toUrl(next));
      setState(next);
    }
  }, []);

  return { ...state, setFilters, openOrder, closeOrder };
}
