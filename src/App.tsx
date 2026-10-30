import { useCallback } from 'react';
import { useOrders } from './hooks/useOrders';
import { OrderList } from './components/OrderList/OrderList';
import styles from './App.module.css';

export function App() {
  const { orders, state, error, reload } = useOrders();
  const noop = useCallback(() => {}, []);

  return (
    <div className={styles.app}>
      <header className={styles.top}>
        <h1 className={styles.brand}>KokoJob</h1>
        <p className={styles.sub}>Orders</p>
      </header>
      <main className={styles.main}>
        <OrderList
          state={state}
          error={error}
          orders={orders}
          total={orders.length}
          onSelect={noop}
          onRetry={reload}
          onClearFilters={noop}
        />
      </main>
    </div>
  );
}
