const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const day = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' });
const stamp = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
});

export const formatMoney = (n: number) => money.format(n);
export const formatDay = (iso: string) => day.format(new Date(iso));
export const formatStamp = (iso: string) => stamp.format(new Date(iso));
