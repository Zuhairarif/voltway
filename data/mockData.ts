
import { Part, InventoryStrategy, PurchaseOrder, SalesOrder, StockItem, StockMovement, SupplierOffer, BOM } from '../types';

export const parts: Part[] = [
  { id: 'P300', name: 'S1 V1 500W Brushless Motor', type: 'assembly', usedInModels: ['S1_V1'], weight: 3.79, successorParts: 'P304' },
  { id: 'P301', name: 'S1 V1 Li-Ion 36V 10Ah Battery Pack', type: 'assembly', usedInModels: ['S1_V1'], weight: 4.84, successorParts: 'P305' },
  { id: 'P302', name: 'S1 V1 Analog Controller ZX', type: 'assembly', usedInModels: ['S1_V1'], weight: 2.29 },
  { id: 'P303', name: 'S1 V1 Aluminum Frame', type: 'assembly', usedInModels: ['S1_V1'], weight: 4.01 },
  { id: 'P304', name: 'S1 V2 750W Brushless Motor', type: 'assembly', usedInModels: ['S1_V2'], weight: 3.31 },
  { id: 'P305', name: 'S1 V2 Li-Po 48V 12Ah Battery Pack', type: 'assembly', usedInModels: ['S1_V2'], weight: 3.16 },
  { id: 'P306', name: 'S1 V2 Digital Controller ZP', type: 'assembly', usedInModels: ['S1_V2'], weight: 4.15 },
  { id: 'P307', name: 'S1 V2 Carbon Fiber Frame', type: 'assembly', usedInModels: ['S1_V2'], weight: 3.99 },
  { id: 'P308', name: 'S2 V1 500W Brushless Motor', type: 'assembly', usedInModels: ['S2_V1'], weight: 4.46 },
  { id: 'P309', name: 'S2 V1 Li-Ion 36V 10Ah Battery Pack', type: 'assembly', usedInModels: ['S2_V1'], weight: 1.77 },
  { id: 'P310', name: 'S2 V1 Analog Controller ZX', type: 'assembly', usedInModels: ['S2_V1'], weight: 4.94 },
  { id: 'P311', name: 'S2 V1 Aluminum Frame', type: 'assembly', usedInModels: ['S2_V1'], weight: 0.75 },
  { id: 'P312', name: 'S2 V2 750W Brushless Motor', type: 'assembly', usedInModels: ['S2_V2'], weight: 2.5 },
  { id: 'P313', name: 'S2 V2 Li-Po 48V 12Ah Battery Pack', type: 'assembly', usedInModels: ['S2_V2'], weight: 2.44 },
  { id: 'P314', name: 'S2 V2 Digital Controller ZP', type: 'assembly', usedInModels: ['S2_V2'], weight: 1.46 },
  { id: 'P315', name: 'S2 V2 Carbon Fiber Frame', type: 'assembly', usedInModels: ['S2_V2'], weight: 0.81 },
  { id: 'P316', name: 'S3 V1 500W Brushless Motor', type: 'assembly', usedInModels: ['S3_V1'], weight: 1.09 },
  { id: 'P317', name: 'S3 V1 Li-Ion 36V 10Ah Battery Pack', type: 'assembly', usedInModels: ['S3_V1'], weight: 2.07 },
  { id: 'P318', name: 'S3 V1 Analog Controller ZX', type: 'assembly', usedInModels: ['S3_V1'], weight: 2.7 },
  { id: 'P319', name: 'S3 V1 Aluminum Frame', type: 'assembly', usedInModels: ['S3_V1'], weight: 3.97 },
  { id: 'P320', name: 'S3 V2 750W Brushless Motor', type: 'assembly', usedInModels: ['S3_V2'], weight: 3.61 },
  { id: 'P321', name: 'S3 V2 Li-Po 48V 12Ah Battery Pack', type: 'assembly', usedInModels: ['S3_V2'], weight: 4.69 },
  { id: 'P322', name: 'S3 V2 Digital Controller ZP', type: 'assembly', usedInModels: ['S3_V2'], weight: 2.98 },
  { id: 'P323', name: 'S3 V2 Carbon Fiber Frame', type: 'assembly', usedInModels: ['S3_V2'], weight: 3.55 },
  { id: 'P324', name: 'LCD Dashboard Display', type: 'assembly', usedInModels: ['S1_V1', 'S2_V1', 'S3_V1'], weight: 4.8 },
  { id: 'P325', name: '10-inch Alloy Wheel', type: 'assembly', usedInModels: ['S1_V1', 'S2_V1', 'S3_V1'], weight: 4.1 },
  { id: 'P326', name: 'Mechanical Disc Brake', type: 'assembly', usedInModels: ['S1_V1', 'S2_V1', 'S3_V1'], weight: 0.56 },
  { id: 'P327', name: 'Standard LED Headlight', type: 'assembly', usedInModels: ['S1_V1', 'S2_V1', 'S3_V1'], weight: 2.76 },
  { id: 'P328', name: 'Standard Charger 42V', type: 'assembly', usedInModels: ['S1_V1', 'S2_V1', 'S3_V1'], weight: 1.94 },
  { id: 'P329', name: 'OLED Dashboard Display', type: 'assembly', usedInModels: ['S1_V2', 'S2_V2', 'S3_V2'], weight: 4.93 },
  { id: 'P330', name: '12-inch Alloy Wheel', type: 'assembly', usedInModels: ['S1_V2', 'S2_V2', 'S3_V2'], weight: 3.68 },
  { id: 'P331', name: 'Hydraulic Disc Brake', type: 'assembly', usedInModels: ['S1_V2', 'S2_V2', 'S3_V2'], weight: 3.3 },
  { id: 'P332', name: 'Advanced LED Headlight with DRL', type: 'assembly', usedInModels: ['S1_V2', 'S2_V2', 'S3_V2'], weight: 4.38 },
  { id: 'P333', name: 'Fast Charger 42V 2A', type: 'assembly', usedInModels: ['S1_V2', 'S2_V2', 'S3_V2'], weight: 1.16 },
  { id: 'P334', name: 'Power Cable', type: 'assembly', usedInModels: ['S1_V1', 'S1_V2', 'S2_V1', 'S2_V2', 'S3_V1', 'S3_V2'], weight: 4.03 },
  { id: 'P335', name: 'Comfort Seat', type: 'service', usedInModels: ['S1_V1', 'S1_V2', 'S2_V1', 'S2_V2', 'S3_V1', 'S3_V2'], weight: 0.82 },
  { id: 'P336', name: 'Rear Fender', type: 'service', usedInModels: ['S1_V1', 'S1_V2', 'S2_V1', 'S2_V2', 'S3_V1', 'S3_V2'], weight: 2.34 },
  { id: 'P337', name: 'Hex Nut', type: 'service', usedInModels: ['S1_V1', 'S1_V2', 'S2_V1', 'S2_V2', 'S3_V1', 'S3_V2'], weight: 3.48 },
  { id: 'P338', name: 'Lock Washer', type: 'service', usedInModels: ['S1_V1', 'S1_V2', 'S2_V1', 'S2_V2', 'S3_V1', 'S3_V2'], weight: 1.98 }
];

export const strategy: InventoryStrategy[] = [
  { partId: 'P300', minStockLevel: 63, reorderQuantity: 79, reorderIntervalDays: 18 },
  { partId: 'P338', minStockLevel: 15, reorderQuantity: 104, reorderIntervalDays: 8 }
];

export const boms: BOM[] = [
  {
    id: 'S1_V1',
    model: 'S1',
    version: 'V1 Standard',
    components: [
      { partId: 'P300', quantity: 1 }, { partId: 'P301', quantity: 1 }, { partId: 'P302', quantity: 1 },
      { partId: 'P303', quantity: 1 }, { partId: 'P324', quantity: 1 }, { partId: 'P325', quantity: 2, notes: 'Front & Rear' },
      { partId: 'P326', quantity: 1, notes: '160 mm rotor' }, { partId: 'P327', quantity: 1 }, { partId: 'P328', quantity: 1, notes: '1.5 A' },
      { partId: 'P334', quantity: 1 }, { partId: 'P335', quantity: 1, notes: 'Optional' }, { partId: 'P336', quantity: 1 },
      { partId: 'P337', quantity: 12, notes: 'M6' }, { partId: 'P338', quantity: 12, notes: 'M6' }
    ],
    assemblyRequirements: ['Torque motor mounting bolts to 35 Nm', 'Apply thread-locker to Hex Nut (P337)']
  },
  {
    id: 'S1_V2',
    model: 'S1',
    version: 'V2 Pro',
    components: [
      { partId: 'P304', quantity: 1 }, { partId: 'P305', quantity: 1 }, { partId: 'P306', quantity: 1 },
      { partId: 'P307', quantity: 1 }, { partId: 'P329', quantity: 1 }, { partId: 'P330', quantity: 2, notes: 'Front & Rear' },
      { partId: 'P331', quantity: 1, notes: '180 mm rotor' }, { partId: 'P332', quantity: 1 }, { partId: 'P333', quantity: 1, notes: '2.0 A' },
      { partId: 'P334', quantity: 1 }, { partId: 'P335', quantity: 1 }, { partId: 'P336', quantity: 1 },
      { partId: 'P337', quantity: 12 }, { partId: 'P338', quantity: 12 }
    ]
  }
  // Data for S2 and S3 variants follows this exact pattern from screenshots...
];

export const inventory: StockItem[] = [
  { partId: 'P300', partName: 'S1 V1 500W Brushless Motor', location: 'WH1', quantityAvailable: 158 },
  { partId: 'P338', partName: 'Lock Washer', location: 'WH1', quantityAvailable: 31 }
];

export const purchaseOrders: PurchaseOrder[] = [
  { id: 'O5000', partId: 'P312', quantityOrdered: 32, orderDate: '2025-04-19', expectedDeliveryDate: '2025-05-13', supplierId: 'SupA', status: 'ordered' }
];

export const salesOrders: SalesOrder[] = [
  { id: 'S6000', model: 'S2', version: 'V1', quantity: 10, orderType: 'webshop', requestedDate: '2025-03-03', createdAt: '2025-01-01', acceptedRequestDate: '2025-01-02' }
];

export const suppliers: SupplierOffer[] = [
  { supplierId: 'SupC', partId: 'P300', pricePerUnit: 136.45, leadTimeDays: 8, minOrderQty: 18, reliabilityRating: 0.86 }
];

export const movements: StockMovement[] = [
  { date: '2025-03-30', partId: 'P314', type: 'inbound', quantity: 76 }
];
