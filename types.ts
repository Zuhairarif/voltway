
export interface Part {
  id: string;
  name: string;
  type: string;
  usedInModels: string[];
  dimensions?: string;
  weight: number;
  blockedParts?: string;
  successorParts?: string;
  comment?: string;
}

export interface BOMComponent {
  partId: string;
  quantity: number;
  notes?: string;
}

export interface BOM {
  id: string; // Model_Version identifier
  model: string;
  version: string;
  components: BOMComponent[];
  assemblyRequirements?: string[];
}

export interface InventoryStrategy {
  partId: string;
  minStockLevel: number;
  reorderQuantity: number;
  reorderIntervalDays: number;
}

export interface PurchaseOrder {
  id: string;
  partId: string;
  quantityOrdered: number;
  orderDate: string;
  expectedDeliveryDate: string;
  supplierId: string;
  status: 'ordered' | 'delivered';
  actualDeliveredAt?: string;
}

export interface SalesOrder {
  id: string;
  model: string;
  version: string;
  quantity: number;
  orderType: string;
  requestedDate: string;
  createdAt: string;
  acceptedRequestDate: string;
}

export interface StockItem {
  partId: string;
  partName: string;
  location: string;
  quantityAvailable: number;
}

export interface StockMovement {
  date: string;
  partId: string;
  type: 'inbound' | 'outbound';
  quantity: number;
}

export interface SupplierOffer {
  supplierId: string;
  partId: string;
  pricePerUnit: number;
  leadTimeDays: number;
  minOrderQty: number;
  reliabilityRating: number;
}

export interface AppState {
  parts: Part[];
  strategy: InventoryStrategy[];
  purchaseOrders: PurchaseOrder[];
  salesOrders: SalesOrder[];
  inventory: StockItem[];
  movements: StockMovement[];
  suppliers: SupplierOffer[];
  boms: BOM[];
}
