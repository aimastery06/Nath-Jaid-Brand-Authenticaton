// Customer-facing order status copy, from brand/voice.md ("Order Status").
import type { Database } from '../lib/server/database.types';

export type OrderStatus = Database['public']['Enums']['order_status'];

export const orderStatusCopy: Record<OrderStatus, { label: string; line: string }> = {
  pending_payment: { label: 'Awaiting payment', line: "We're waiting for your payment to be confirmed." },
  paid: { label: 'Preparing', line: "We're getting your candles ready to ship." },
  fulfilled: { label: 'Shipped', line: 'Your candles are on their way.' },
  expired: { label: 'Not completed', line: "This checkout wasn't completed, so nothing was charged." },
  cancelled: { label: 'Cancelled', line: 'This order was cancelled and refunded in full.' },
  refunded: { label: 'Refunded', line: 'This order was refunded.' },
  partially_refunded: { label: 'Partly refunded', line: 'Part of this order was refunded.' },
};
