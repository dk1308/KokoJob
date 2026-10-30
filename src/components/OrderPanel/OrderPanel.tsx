import { useEffect, useRef, useState, type RefObject } from 'react';
import { STATUSES, type Order } from '../../types';
import { formatMoney, formatStamp } from '../../format';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { STATUS_LABEL, StatusGlyph } from '../StatusBadge/StatusBadge';
import { CloseIcon } from '../icons';
import styles from './OrderPanel.module.css';

type Props = {
  order: Order;
  background: RefObject<HTMLElement>;
  onClose: () => void;
  onEdit: (patch: Partial<Order>) => void;
};

export function OrderPanel({ order, background, onClose, onEdit }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef, {
    background,
    onEscape: onClose,
    fallback: () =>
      document.querySelector<HTMLElement>(`[data-order-id="${order.id}"]`)
      ?? document.getElementById('search'),
  });

  // Notes are a local draft until blur. A rollback changes order.notes,
  // which resets the draft to the restored value.
  const saved = order.notes ?? '';
  const [draft, setDraft] = useState(saved);
  useEffect(() => setDraft(saved), [saved]);

  const commitNotes = () => {
    if (draft !== saved) onEdit({ notes: draft });
  };

  // Closing with Esc or Back can unmount the textarea without a blur.
  const pending = useRef(commitNotes);
  pending.current = commitNotes;
  useEffect(() => () => pending.current(), []);

  const rush = order.priority === 'rush';

  return (
    <>
      <div className={styles.scrim} onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="panel-title"
        tabIndex={-1}
      >
        <header className={styles.head}>
          <div className={styles.heading}>
            <p className={styles.id}>{order.id}</p>
            <h2 id="panel-title" className={styles.title}>{order.customer}</h2>
            <p className={styles.summary}>
              {order.items} {order.items === 1 ? 'item' : 'items'} · {formatMoney(order.total)}
            </p>
          </div>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close order details"
          >
            <CloseIcon />
          </button>
        </header>

        <fieldset className={styles.field}>
          <legend className={styles.label}>Status</legend>
          <div className={styles.segmented}>
            {STATUSES.map(s => (
              <label key={s} className={styles.segment}>
                <input
                  type="radio"
                  name="status"
                  value={s}
                  checked={order.status === s}
                  onChange={() => onEdit({ status: s })}
                />
                <StatusGlyph status={s} />
                {STATUS_LABEL[s]}
              </label>
            ))}
          </div>
        </fieldset>

        <div className={styles.field}>
          <span className={styles.label} id="priority-label">Priority</span>
          <button
            type="button"
            role="switch"
            aria-checked={rush}
            aria-labelledby="priority-label rush-text"
            className={styles.switch}
            onClick={() => onEdit({ priority: rush ? 'normal' : 'rush' })}
          >
            <span className={styles.track} aria-hidden="true" />
            <span id="rush-text">Rush</span>
          </button>
        </div>

        <div className={styles.field}>
          <label htmlFor="notes" className={styles.label}>Notes</label>
          <textarea
            id="notes"
            className={styles.notes}
            rows={4}
            value={draft}
            placeholder="Add a note for the warehouse"
            onChange={e => setDraft(e.target.value)}
            onBlur={commitNotes}
          />
        </div>

        <dl className={styles.timeline}>
          <div>
            <dt>Created</dt>
            <dd><time dateTime={order.createdAt}>{formatStamp(order.createdAt)}</time></dd>
          </div>
          <div>
            <dt>Last updated</dt>
            <dd><time dateTime={order.updatedAt}>{formatStamp(order.updatedAt)}</time></dd>
          </div>
        </dl>
      </div>
    </>
  );
}
