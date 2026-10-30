import { useEffect } from 'react';
import { CloseIcon } from '../icons';
import styles from './Toast.module.css';

export type ToastMessage = { id: number; text: string };

type Props = {
  toast: ToastMessage | null;
  onDismiss: () => void;
};

// The live region is always mounted so screen readers announce new text.
export function Toast({ toast, onDismiss }: Props) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onDismiss, 5000);
    return () => clearTimeout(t);
  }, [toast, onDismiss]);

  return (
    <div className={styles.region} role="status">
      {toast && (
        <div key={toast.id} className={styles.toast}>
          <p className={styles.text}>{toast.text}</p>
          <button
            type="button"
            className={styles.dismiss}
            onClick={onDismiss}
            aria-label="Dismiss"
          >
            <CloseIcon />
          </button>
        </div>
      )}
    </div>
  );
}
