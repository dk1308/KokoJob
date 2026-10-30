import type { Status } from '../../types';
import styles from './StatusBadge.module.css';

export const STATUS_LABEL: Record<Status, string> = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export function StatusGlyph({ status }: { status: Status }) {
  return <span className={`${styles.glyph} ${styles[status]}`} aria-hidden="true" />;
}

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`${styles.badge} ${styles[status]}`}>
      <StatusGlyph status={status} />
      {STATUS_LABEL[status]}
    </span>
  );
}
