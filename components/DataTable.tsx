
import React, { useState } from 'react';
import { 
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell, 
  Button, Input, Badge, Sheet, Dialog, cn 
} from './ui';
import { useTableData } from '../hooks/useTableData';

interface Column {
  key: string;
  label: string;
}

interface Props {
  tableName: string;
  title: string;
  columns: Column[];
  primaryKey: string;
}

const DataTable: React.FC<Props> = ({ tableName, title, columns, primaryKey }) => {
  const { data, isLoading, upsert, remove, isMutating } = useTableData<any>(tableName, primaryKey);
  
  const [search, setSearch] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  const filteredData = data.filter(item => 
    Object.values(item).some(val => String(val).toLowerCase().includes(search.toLowerCase()))
  );

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({});
    setIsSheetOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsSheetOpen(true);
  };

  const handleSave = async () => {
    await upsert(formData);
    setIsSheetOpen(false);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await remove(deleteId);
      setDeleteId(null);
    }
  };

  const renderStatus = (val: string) => {
    const v = String(val).toLowerCase();
    if (['delivered', 'confirmed', 'healthy', 'fleet'].includes(v)) return <Badge variant="success">{val}</Badge>;
    if (['ordered', 'warning', 'low stock', 'retail'].includes(v)) return <Badge variant="warning">{val}</Badge>;
    if (['critical', 'blocked'].includes(v)) return <Badge variant="destructive">{val}</Badge>;
    return <Badge>{val}</Badge>;
  };

  if (isLoading) return (
    <div className="h-64 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800 backdrop-blur-sm">
        <div className="flex-1 max-w-sm">
          <Input 
            placeholder="Search global records..." 
            value={search}
            onChange={(e: any) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={handleOpenAdd} className="font-bold">
          <span className="mr-2">+</span> Add {title}
        </Button>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/30 backdrop-blur-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(col => (
                <TableHead key={col.key}>{col.label}</TableHead>
              ))}
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((row, i) => (
              <TableRow key={row[primaryKey] || i} className="group">
                {columns.map(col => (
                  <TableCell key={col.key}>
                    {col.key === 'status' || col.key === 'type' || col.key === 'order_type' ? (
                      renderStatus(row[col.key])
                    ) : (
                      <span className={cn(
                        "text-sm",
                        col.key === primaryKey ? "font-mono font-bold text-emerald-500/80" : "text-slate-300"
                      )}>
                        {row[col.key]}
                      </span>
                    )}
                  </TableCell>
                ))}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(row)}>Edit</Button>
                    <Button variant="ghost" size="sm" className="text-rose-500 hover:bg-rose-500 hover:text-white" onClick={() => setDeleteId(row[primaryKey])}>Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
        {filteredData.length === 0 && (
          <div className="p-12 text-center text-slate-500 italic">No data records found.</div>
        )}
      </div>

      <Sheet 
        isOpen={isSheetOpen} 
        onClose={() => setIsSheetOpen(false)} 
        title={editingItem ? `Update ${title}` : `Create ${title}`}
      >
        <div className="space-y-6">
          {columns.map(col => (
            <div key={col.key} className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">{col.label}</label>
              <Input 
                value={formData[col.key] || ''} 
                onChange={(e: any) => setFormData({ ...formData, [col.key]: e.target.value })}
                disabled={editingItem && col.key === primaryKey}
                placeholder={`Enter ${col.label}...`}
              />
            </div>
          ))}
          <div className="pt-8 flex gap-4">
            <Button className="flex-1 h-12" onClick={handleSave} disabled={isMutating}>
              {isMutating ? 'Processing...' : (editingItem ? 'Save Changes' : 'Create Entry')}
            </Button>
            <Button variant="outline" className="h-12" onClick={() => setIsSheetOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Sheet>

      <Dialog 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={handleDelete}
        title="Verify Deletion"
        description="This action is irreversible. The record will be permanently purged from the cloud database."
      />
    </div>
  );
};

export default DataTable;
