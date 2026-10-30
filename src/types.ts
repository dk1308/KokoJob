export type Status =
  | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type Priority = 'normal' | 'rush';

export type Order = {
  id: string;            // "ORD-2481"
  customer: string;
  status: Status;
  items: number;
  total: number;
  priority: Priority;
  createdAt: string;     // ISO 8601
  updatedAt: string;
  notes?: string;
};

export type SortKey =
  | 'created-desc' | 'created-asc'
  | 'total-desc' | 'total-asc'
  | 'customer-asc';

export const STATUSES: Status[] = [
  'pending', 'processing', 'shipped', 'delivered', 'cancelled',
];

export const SORTS: { key: SortKey; label: string }[] = [
  { key: 'created-desc', label: 'Newest first' },
  { key: 'created-asc', label: 'Oldest first' },
  { key: 'total-desc', label: 'Total, high to low' },
  { key: 'total-asc', label: 'Total, low to high' },
  { key: 'customer-asc', label: 'Customer, A–Z' },
];
