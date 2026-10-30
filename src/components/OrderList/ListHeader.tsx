import styles from './OrderList.module.css';

// Column labels for the table layout only. Hidden from assistive tech:
// each row's own text already says what every value is.
export function ListHeader() {
  return (
    <div className={styles.header} aria-hidden="true">
      <span className={styles.id}>Order</span>
      <span className={styles.customer}>Customer</span>
      <span className={styles.status}>Status</span>
      <span className={styles.meta}>
        <span className={styles.items}>Items</span>
        <span className={styles.created}>Created</span>
      </span>
      <span className={styles.total}>Total</span>
    </div>
  );
}
