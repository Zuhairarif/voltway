
import { VersionEntry } from '../types';

export const changeLog: VersionEntry[] = [
  {
    version: '1.3.0',
    date: '2025-05-24',
    title: 'Interface Modernization',
    changes: [
      { type: 'feature', text: 'Collapsible Sidebar for maximized workspace efficiency.' },
      { type: 'feature', text: 'Version History module added to track system iterations.' },
      { type: 'feature', text: 'Engineering Change Order (ECO) logic in BOM Manager.' },
      { type: 'feature', text: 'Lead Time Volatility Risk tracking in Dashboard.' }
    ]
  },
  {
    version: '1.2.0',
    date: '2025-05-20',
    title: 'Cloud & Design Migration',
    changes: [
      { type: 'infra', text: 'Supabase Real-time database integration.' },
      { type: 'infra', text: 'TanStack Query (React Query) for state management.' },
      { type: 'feature', text: 'Shadcn UI design system implementation.' },
      { type: 'feature', text: 'Global CRUD functionality for all master data tables.' }
    ]
  },
  {
    version: '1.1.0',
    date: '2025-05-15',
    title: 'AI Intelligence Layer',
    changes: [
      { type: 'feature', text: 'Hugo AI: Agentic procurement assistant powered by Gemini.' },
      { type: 'feature', text: 'Build Potential Calculator for production planning.' },
      { type: 'fix', text: 'Resolved min_stock undefined property errors in dashboard.' }
    ]
  },
  {
    version: '1.0.0',
    date: '2025-05-01',
    title: 'Industrial OS Core',
    changes: [
      { type: 'feature', text: 'Material Master and Sales Order tracking.' },
      { type: 'feature', text: 'Basic Inventory and Supplier registry.' },
      { type: 'feature', text: 'Production BOM management system.' }
    ]
  }
];
