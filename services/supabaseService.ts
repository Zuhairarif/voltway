
import { supabase } from '../lib/supabase';
import { AppState } from '../types';

export const fetchAppState = async (): Promise<Partial<AppState> | null> => {
  try {
    const [
      { data: materials },
      { data: products },
      { data: customers },
      { data: bom },
      { data: warehouses },
      { data: stock },
      { data: stock_movements },
      { data: sales_orders },
      { data: suppliers },
      { data: material_orders },
      { data: dispatch_parameters }
    ] = await Promise.all([
      supabase.from('materials').select('*'),
      supabase.from('products').select('*'),
      supabase.from('customers').select('*'),
      supabase.from('bom').select('*'),
      supabase.from('warehouses').select('*'),
      supabase.from('stock').select('*'),
      supabase.from('stock_movements').select('*'),
      supabase.from('sales_orders').select('*'),
      supabase.from('suppliers').select('*'),
      supabase.from('material_orders').select('*'),
      supabase.from('dispatch_parameters').select('*')
    ]);

    return {
      materials: materials || [],
      products: products || [],
      customers: customers || [],
      bom: bom || [],
      warehouses: warehouses || [],
      stock: stock || [],
      stock_movements: stock_movements || [],
      sales_orders: sales_orders || [],
      suppliers: suppliers || [],
      material_orders: material_orders || [],
      dispatch_parameters: dispatch_parameters || []
    };
  } catch (error) {
    console.error('Fetch Error:', error);
    return null;
  }
};

export const seedSupabase = async (state: AppState) => {
  try {
    // 1. Primary Entities (No Foreign Keys)
    await supabase.from('materials').upsert(state.materials);
    await supabase.from('products').upsert(state.products);
    await supabase.from('customers').upsert(state.customers);
    await supabase.from('warehouses').upsert(state.warehouses);

    // 2. Secondary Entities (Dependent on Primary)
    await supabase.from('bom').upsert(state.bom);
    await supabase.from('stock').upsert(state.stock);
    await supabase.from('suppliers').upsert(state.suppliers);
    await supabase.from('dispatch_parameters').upsert(state.dispatch_parameters);

    // 3. Transactions (Dependent on Entities)
    await supabase.from('sales_orders').upsert(state.sales_orders);
    await supabase.from('material_orders').upsert(state.material_orders);
    await supabase.from('stock_movements').upsert(state.stock_movements);

    return true;
  } catch (error) {
    console.error('Seed Error:', error);
    return false;
  }
};
