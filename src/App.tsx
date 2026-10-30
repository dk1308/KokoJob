import { useCallback, useMemo } from 'react';
import type { Order, SortKey } from './types';
import { useOrders } from './hooks/useOrders';
import { useUrlState } from './hooks/useUrlState';
import { Toolbar } from './components/Toolbar/Toolbar';
import { OrderList } from './components/OrderList/OrderList';
import styles from './App.module.css';

const COMPARATORS: Record<SortKey, (a: Order, b: Order) => number> = {
  'created-desc': (a, b) => b.createdAt.localeCompare(a.createdAt),
  'created-asc': (a, b) => a.createdAt.localeCompare(b.createdAt),
  'total-desc': (a, b) => b.total - a.total,
  'total-asc': (a, b) => a.total - b.total,
  'customer-asc': (a, b) => a.customer.localeCompare(b.customer),
};

export function App() {
  const { orders, state, error, reload } = useOrders();
  const { q, statuses, sort, setFilters, openOrder } = useUrlState();

  // 60 local records: filtering is synchronous and instant. No debounce.
  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return orders
      .filter(o => statuses.length === 0 || statuses.includes(o.status))
      .filter(o => !needle
        || o.id.toLowerCase().includes(needle)
        || o.customer.toLowerCase().includes(needle))
      .sort(COMPARATORS[sort]);
  }, [orders, q, statuses, sort]);

  const clearFilters = useCallback(() => setFilters({ q: '', statuses: [] }), [setFilters]);

  const count =
    state === 'loading' ? 'Loading orders…'
    : state === 'error' ? ''
    : `${visible.length} of ${orders.length} orders`;

  return (
    <div className={styles.app}>
      <header className={styles.top}>
        <h1 className={styles.brand}>KokoJob</h1>
        <p className={styles.sub}>Orders</p>
      </header>
      <main className={styles.main}>
        <Toolbar q={q} statuses={statuses} sort={sort} onChange={setFilters} count={count} />
        <OrderList
          state={state}
          error={error}
          orders={visible}
          total={orders.length}
          onSelect={openOrder}
          onRetry={reload}
          onClearFilters={clearFilters}
        />
      </main>
    </div>
  );
}
