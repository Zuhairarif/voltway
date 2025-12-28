
import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Utility for tailwind classes */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Button = React.forwardRef<HTMLButtonElement, any>(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  const variants: any = {
    default: "bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm shadow-emerald-900/10",
    destructive: "bg-rose-600 text-white hover:bg-rose-500",
    outline: "border border-slate-800 bg-transparent hover:bg-slate-900 text-slate-300",
    secondary: "bg-slate-800 text-slate-100 hover:bg-slate-700",
    ghost: "hover:bg-slate-900 text-slate-400 hover:text-slate-100",
    link: "text-emerald-500 underline-offset-4 hover:underline",
  };
  const sizes: any = {
    default: "h-10 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});

export const Input = React.forwardRef<HTMLInputElement, any>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm ring-offset-slate-950 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

export const Card = ({ className, ...props }: any) => (
  <div className={cn("rounded-xl border border-slate-800 bg-slate-900/50 text-slate-100 shadow-sm", className)} {...props} />
);

export const Badge = ({ className, variant = 'default', ...props }: any) => {
  const variants: any = {
    default: "bg-slate-800 text-slate-400",
    success: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
    destructive: "bg-rose-500/10 text-rose-500 border border-rose-500/20",
  };
  return (
    <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase transition-colors", variants[variant], className)} {...props} />
  );
};

export const Sheet = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative h-full w-full max-w-md border-l border-slate-800 bg-slate-950 p-8 shadow-2xl animate-slide-in">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
            <button onClick={onClose} className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <span className="text-2xl">✕</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Dialog = ({ isOpen, onClose, onConfirm, title, description }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-lg border border-slate-800 bg-slate-950 p-6 shadow-2xl animate-in">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="mt-2 text-sm text-slate-400">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm}>Confirm Delete</Button>
        </div>
      </div>
    </div>
  );
};

export const Table = ({ children, className }: any) => (
  <div className="relative w-full overflow-auto">
    <table className={cn("w-full caption-bottom text-sm", className)}>{children}</table>
  </div>
);

export const TableHeader = ({ children }: any) => <thead className="[&_tr]:border-b border-slate-800">{children}</thead>;
export const TableBody = ({ children }: any) => <tbody className="[&_tr:last-child]:border-0">{children}</tbody>;
export const TableRow = ({ children, className }: any) => (
  <tr className={cn("border-b border-slate-800/50 transition-colors hover:bg-slate-900/50 data-[state=selected]:bg-slate-900", className)}>{children}</tr>
);
export const TableHead = ({ children, className }: any) => <th className={cn("h-12 px-4 text-left align-middle font-medium text-slate-500 uppercase text-[10px] tracking-widest", className)}>{children}</th>;
export const TableCell = ({ children, className }: any) => <td className={cn("p-4 align-middle", className)}>{children}</td>;
