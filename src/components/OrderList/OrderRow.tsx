import { memo } from 'react';
import type { Order } from '../../types';
import { formatDay, formatMoney } from '../../format';
import { StatusBadge } from '../StatusBadge/StatusBadge';
import styles from './OrderList.module.css';

type Props = {
  order: Order;
  onSelect: (id: string) => void;
};

export const OrderRow = memo(function OrderRow({ order, onSelect }: Props) {
  return (
    <button
      type="button"
      className={styles.row}
      data-order-id={order.id}
      onClick={() => onSelect(order.id)}
    >
      <span className={styles.id}>{order.id}</span>
      <span className={styles.customer}>
        <span className={styles.name} title={order.customer}>{order.customer}</span>
        {order.priority === 'rush' && <span className={styles.rush}>Rush</span>}
      </span>
      <span className={styles.status}><StatusBadge status={order.status} /></span>
      <span className={styles.meta}>
        <span className={styles.items}>
          {order.items}
          <span className={styles.unit}> {order.items === 1 ? 'item' : 'items'}</span>
        </span>
        <time className={styles.created} dateTime={order.createdAt}>
          {formatDay(order.createdAt)}
        </time>
      </span>
      <span className={styles.total}>{formatMoney(order.total)}</span>
    </button>
  );
});
