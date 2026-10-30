import styles from './OrderList.module.css';

const bar = (width: string) => (
  <span className={styles.bar} style={{ width }} />
);

// Same .row grid and cells as OrderRow, so nothing moves when data lands.
export function Skeleton({ rows = 8 }: { rows?: number }) {
  return (
    <ul className={styles.rows} aria-hidden="true">
      {Array.from({ length: rows }, (_, i) => (
        <li key={i}>
          <div className={styles.row}>
            <span className={styles.id}>{bar('4.5rem')}</span>
            <span className={styles.customer}>
              <span className={styles.name}>{bar(`${7 + ((i * 5) % 8)}rem`)}</span>
            </span>
            <span className={styles.status}>
              <span className={`${styles.bar} ${styles.pill}`} />
            </span>
            <span className={styles.meta}>
              <span className={styles.items}>{bar('1.5rem')}</span>
              <span className={styles.created}>{bar('3rem')}</span>
            </span>
            <span className={styles.total}>{bar('4rem')}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
