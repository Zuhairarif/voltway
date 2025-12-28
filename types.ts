
export interface Material {
  part_id: string;
  part_name: string;
  part_type: string;
  dimensions?: string;
  weight: number;
  blocked_parts?: string[];
  successor_parts?: string[];
  comment?: string;
}

export interface VersionEntry {
  version: string;
  date: string;
  title: string;
  changes: {
    type: 'feature' | 'fix' | 'security' | 'infra';
    text: string;
  }[];
}

export interface Product {
  product_id: string;
  model: string;
  version: string;
  product_name: string;
}

export interface Customer {
  customer_id: string;
  name: string;
  type: 'fleet' | 'retail';
}

export interface BOMEntry {
  product_id: string;
  part_id: string;
  quantity: number;
}

export interface Warehouse {
  location: string;
  description?: string;
}

export interface Stock {
  part_id: string;
  location: string;
  quantity_available: number;
}

export interface StockMovement {
  id?: string;
  date: string;
  part_id: string;
  location: string;
  type: 'inbound' | 'outbound';
  quantity: number;
}

export interface SalesOrder {
  sales_order_id: string;
  product_id: string;
  customer_id: string;
  quantity: number;
  order_type: string;
  requested_date: string;
  created_at: string;
  accepted_request_date: string;
  status: string;
}

export interface Supplier {
  supplier_id: string;
  part_id: string;
  price_per_unit: number;
  lead_time_days: number;
  min_order_qty: number;
  reliability_rating: number;
}

export interface MaterialOrder {
  order_id: string;
  part_id: string;
  supplier_id: string;
  quantity_ordered: number;
  order_date: string;
  expected_delivery_date: string;
  status: 'ordered' | 'delivered';
  actual_delivered_at?: string;
}

export interface DispatchParameter {
  part_id: string;
  config_data: any;
  updated_at: string;
}

export interface AppState {
  materials: Material[];
  products: Product[];
  customers: Customer[];
  bom: BOMEntry[];
  warehouses: Warehouse[];
  stock: Stock[];
  stock_movements: StockMovement[];
  sales_orders: SalesOrder[];
  suppliers: Supplier[];
  material_orders: MaterialOrder[];
  dispatch_parameters: DispatchParameter[];
}
