export interface Route {
  path: string;
  name: string;
  icon: string;
  submenu?: Route[];
  count?: number;
  highlight?: boolean;
  roles?: string[];
}

interface Customer {
  id: number;
  full_name: string;
  email: string;
  phone: string;
}

interface Cargo {
  characteristics: string;
  slots: string;
  weight: string;
  volume: string;
  dimensions: Record<string, any>;
}

export interface Act {
  id: number;
  customer: Customer;
  total_cost: string;
  sender_city: string;
  receiver_city: string;
  additional_info: string;
  cargo: Cargo[];
  status: string;
  customer_signature: string;
  created_at: string;
  images: string[];
  customer_is_payer: boolean;
}

export interface TableRow {
  id: string;
  customer: string;
  created_at: string;
  cargo: Cargo;
  status: string;
  statusColor: string;
  view: string;
  total_cost: string;
}
