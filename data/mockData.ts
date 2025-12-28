
import { Material, Product, Customer, BOMEntry, Warehouse, Stock, StockMovement, SalesOrder, Supplier, MaterialOrder, DispatchParameter } from '../types';

export const materials: Material[] = [
  { part_id: 'P300', part_name: '500W Brushless Motor', part_type: 'assembly', weight: 3.79, successor_parts: ['P304'] },
  { part_id: 'P301', part_name: 'Li-Ion 36V 10Ah Battery', part_type: 'assembly', weight: 4.84, successor_parts: ['P305'] },
  { part_id: 'P302', part_name: 'Analog Controller ZX', part_type: 'assembly', weight: 2.29 },
  { part_id: 'P303', part_name: 'Aluminum Frame S1', part_type: 'assembly', weight: 4.01 },
  { part_id: 'P304', part_name: '750W Brushless Motor', part_type: 'assembly', weight: 3.31 },
  { part_id: 'P337', part_name: 'Hex Nut M8', part_type: 'hardware', weight: 0.05 },
  { part_id: 'P338', part_name: 'Lock Washer M8', part_type: 'hardware', weight: 0.02 }
];

export const products: Product[] = [
  { product_id: 'S1_V1', model: 'S1', version: 'V1', product_name: 'Voltway S1 Standard' },
  { product_id: 'S1_V2', model: 'S1', version: 'V2', product_name: 'Voltway S1 Pro' }
];

export const customers: Customer[] = [
  { customer_id: 'C100', name: 'Berlin Micro-Mobility GmbH', type: 'fleet' },
  { customer_id: 'C101', name: 'Individual Retail', type: 'retail' }
];

export const bom: BOMEntry[] = [
  { product_id: 'S1_V1', part_id: 'P300', quantity: 1 },
  { product_id: 'S1_V1', part_id: 'P301', quantity: 1 },
  { product_id: 'S1_V1', part_id: 'P337', quantity: 12 },
  { product_id: 'S1_V2', part_id: 'P304', quantity: 1 },
  { product_id: 'S1_V2', part_id: 'P301', quantity: 1 },
  { product_id: 'S1_V2', part_id: 'P337', quantity: 12 }
];

export const warehouses: Warehouse[] = [
  { location: 'WH1', description: 'Main Assembly Facility - Berlin' }
];

export const stock: Stock[] = [
  { part_id: 'P300', location: 'WH1', quantity_available: 158 },
  { part_id: 'P301', location: 'WH1', quantity_available: 45 },
  { part_id: 'P304', location: 'WH1', quantity_available: 12 },
  { part_id: 'P337', location: 'WH1', quantity_available: 4500 }
];

export const suppliers: Supplier[] = [
  { supplier_id: 'SupA', part_id: 'P304', price_per_unit: 185.00, lead_time_days: 14, min_order_qty: 10, reliability_rating: 0.92 },
  { supplier_id: 'SupB', part_id: 'P301', price_per_unit: 245.50, lead_time_days: 10, min_order_qty: 5, reliability_rating: 0.88 }
];

export const material_orders: MaterialOrder[] = [
  { order_id: 'PO-9001', part_id: 'P304', supplier_id: 'SupA', quantity_ordered: 50, order_date: '2025-05-01', expected_delivery_date: '2025-05-15', status: 'ordered' }
];

export const sales_orders: SalesOrder[] = [
  { sales_order_id: 'SO-1001', product_id: 'S1_V1', customer_id: 'C100', quantity: 20, order_type: 'fleet', requested_date: '2025-06-01', created_at: '2025-04-10', accepted_request_date: '2025-04-12', status: 'confirmed' }
];

export const stock_movements: StockMovement[] = [
  { date: '2025-04-20', part_id: 'P300', location: 'WH1', type: 'inbound', quantity: 100 }
];

export const dispatch_parameters: DispatchParameter[] = [
  { part_id: 'P300', config_data: { min_stock: 50, reorder_qty: 100 }, updated_at: '2025-04-01' }
];
