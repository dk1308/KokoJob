import { ORDERS } from './orders';
import type { Order } from '../types';

let failureMode = false;
export const setFailureMode = (on: boolean) => { failureMode = on; };
export const isFailureMode = () => failureMode;

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export async function loadOrders(): Promise<Order[]> {
  await sleep(350 + Math.random() * 250);
  if (failureMode || Math.random() < 0.08) {
    throw new Error('Could not load orders.');
  }
  return [...ORDERS];
}

export async function saveOrder(
  id: string,
  patch: Partial<Order>,
): Promise<Order> {
  await sleep(250);
  if (failureMode || Math.random() < 0.15) {
    throw new Error('Could not save changes.');
  }
  const found = ORDERS.find(o => o.id === id);
  if (!found) throw new Error('Order not found.');
  return { ...found, ...patch, updatedAt: new Date().toISOString() };
}
