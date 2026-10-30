import { useState } from 'react';
import { SORTS, STATUSES, type SortKey, type Status } from '../../types';
import { isFailureMode, setFailureMode } from '../../data/api';
import { STATUS_LABEL, StatusGlyph } from '../StatusBadge/StatusBadge';
import { CheckIcon, ChevronIcon, SearchIcon } from '../icons';
import type { UrlState } from '../../hooks/useUrlState';
import styles from './Toolbar.module.css';

type Props = {
  q: string;
  statuses: Status[];
  sort: SortKey;
  onChange: (patch: Partial<Pick<UrlState, 'q' | 'statuses' | 'sort'>>) => void;
  count: string;
};

export function Toolbar({ q, statuses, sort, onChange, count }: Props) {
  const [failing, setFailing] = useState(isFailureMode);

  const toggleStatus = (s: Status) =>
    onChange({
      statuses: statuses.includes(s)
        ? statuses.filter(x => x !== s)
        : STATUSES.filter(x => x === s || statuses.includes(x)),
    });

  return (
    <section className={styles.toolbar} aria-label="Filters">
      <div className={styles.inner}>
        <div className={styles.search}>
          <label htmlFor="search" className="sr-only">Search orders</label>
          <SearchIcon className={styles.searchIcon} />
          <input
            id="search"
            type="search"
            className={styles.input}
            placeholder="Search by order or customer"
            value={q}
            onChange={e => onChange({ q: e.target.value })}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className={styles.sort}>
          <label htmlFor="sort" className="sr-only">Sort orders</label>
          <select
            id="sort"
            className={styles.select}
            value={sort}
            onChange={e => onChange({ sort: e.target.value as SortKey })}
          >
            {SORTS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
          </select>
          <ChevronIcon className={styles.chevron} />
        </div>

        <div className={styles.chips} role="group" aria-label="Filter by status">
          {STATUSES.map(s => {
            const on = statuses.includes(s);
            return (
              <button
                key={s}
                type="button"
                className={styles.chip}
                aria-pressed={on}
                onClick={() => toggleStatus(s)}
              >
                {on ? <CheckIcon className={styles.check} /> : <StatusGlyph status={s} />}
                {STATUS_LABEL[s]}
              </button>
            );
          })}
        </div>

        <p className={styles.count} role="status">{count}</p>

        <label className={styles.demo}>
          <input
            type="checkbox"
            checked={failing}
            onChange={e => {
              setFailureMode(e.target.checked);
              setFailing(e.target.checked);
            }}
          />
          Demo: force failures
        </label>
      </div>
    </section>
  );
}
