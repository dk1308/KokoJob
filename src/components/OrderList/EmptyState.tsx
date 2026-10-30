import styles from './States.module.css';

type Props = {
  filtered: boolean;
  onClearFilters: () => void;
};

export function EmptyState({ filtered, onClearFilters }: Props) {
  if (!filtered) {
    return (
      <div className={styles.state}>
        <h2 className={styles.title}>No orders yet</h2>
        <p className={styles.body}>New orders will appear here as they come in.</p>
      </div>
    );
  }
  return (
    <div className={styles.state}>
      <h2 className={styles.title}>No orders match these filters</h2>
      <p className={styles.body}>Try a different search, or show every status.</p>
      <button type="button" className={styles.action} onClick={onClearFilters}>
        Clear filters
      </button>
    </div>
  );
}
