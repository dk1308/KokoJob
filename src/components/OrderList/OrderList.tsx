import type { Order } from '../../types';
import { ListHeader } from './ListHeader';
import { OrderRow } from './OrderRow';
import { Skeleton } from './Skeleton';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import styles from './OrderList.module.css';

type Props = {
  state: 'loading' | 'ready' | 'error';
  error: string | null;
  orders: Order[];
  total: number;
  onSelect: (id: string) => void;
  onRetry: () => void;
  onClearFilters: () => void;
};

export function OrderList({
  state, error, orders, total, onSelect, onRetry, onClearFilters,
}: Props) {
  if (state === 'error') {
    return <ErrorState message={error ?? 'Something went wrong.'} onRetry={onRetry} />;
  }
  if (state === 'ready' && orders.length === 0) {
    return <EmptyState filtered={total > 0} onClearFilters={onClearFilters} />;
  }

  return (
    <div className={styles.list}>
      <div className={styles.frame}>
        <ListHeader />
        {state === 'loading' ? (
          <Skeleton />
        ) : (
          <ul className={styles.rows} aria-label="Orders">
            {orders.map(o => (
              <li key={o.id}>
                <OrderRow order={o} onSelect={onSelect} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
